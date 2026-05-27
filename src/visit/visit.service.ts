import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateVisitDto } from "./dto/create-visit.dto";

// Shared shape returned by all property lookups
interface PropertyAvailability {
  availableFrom?: Date | string | null;
}

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Converts "5:30 PM" / "09:00 AM" / "17:30" → "05:30" / "09:00" / "17:30"
   */
  private convertTo24Hour(time: string): string {
    time = time.trim().replace(/\s+/g, " ");

    const upper = time.toUpperCase();

    // Already 24-hour — no AM/PM suffix
    if (!upper.includes("AM") && !upper.includes("PM")) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:${m ?? "00"}`;
    }

    const parts = time.split(" ");
    const modifier = parts[1].toUpperCase(); // "AM" | "PM"
    const [hourStr, minuteStr] = parts[0].split(":");
    let h = parseInt(hourStr, 10);

    if (modifier === "PM" && h !== 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${minuteStr ?? "00"}`;
  }

  /**
   * Validates selected date is within [today or availableFrom, start + 15 days].
   * Accepts both Date and string for availableFrom (Apartment/Commercial store it as string).
   */
  private validateDateRange(
    selectedDate: Date,
    availableFrom: Date | string | null
  ): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const from = availableFrom ? new Date(availableFrom) : today;
    from.setHours(0, 0, 0, 0);

    const start = today > from ? today : from;

    const end = new Date(start);
    end.setDate(start.getDate() + 15);

    const sel = new Date(selectedDate);
    sel.setHours(0, 0, 0, 0);

    if (sel < start || sel > end) {
      throw new BadRequestException(
        "Date must be within the available range (next 15 days)"
      );
    }
  }

  /**
   * Validates time is between 7 AM and 10 PM and not in the past.
   * Returns the combined visitDateTime.
   */
  private validateTime(dateStr: string, time24: string): Date {
    const [h] = time24.split(":").map(Number);

    if (h < 7 || h > 22) {
      throw new BadRequestException("Allowed visit time: 7 AM – 10 PM");
    }

    const visitDateTime = new Date(`${dateStr}T${time24}:00`);

    if (isNaN(visitDateTime.getTime())) {
      throw new BadRequestException("Invalid date/time combination");
    }

    if (visitDateTime < new Date()) {
      throw new BadRequestException("Cannot schedule a visit in the past");
    }

    return visitDateTime;
  }

  /**
   * Resolves the property across all four types and returns { availableFrom }.
   * Uses the correct Prisma accessor names from schema.prisma.
   *
   * Schema model → Prisma accessor:
   *   PGDetails   → this.prisma.pGDetails
   *   Commercial  → this.prisma.commercial
   *   Flatmate    → this.prisma.flatmate
   *   Apartment   → this.prisma.apartment
   */
  private async resolveProperty(
    propertyType: string | null | undefined,
    propertyId: number
  ): Promise<PropertyAvailability | null> {
    const type = (propertyType ?? "").toLowerCase().trim();

    if (type.includes("flatmate")) {
      return this.prisma.flatmate.findUnique({
        where: { id: propertyId },
        select: { availableFrom: true },
      });
    }

    if (type.includes("commercial")) {
      return this.prisma.commercial.findUnique({
        where: { id: propertyId },
        select: { availableFrom: true },
      });
    }

    if (type.includes("apartment")) {
      return this.prisma.apartment.findUnique({
        where: { id: propertyId },
        select: { availableFrom: true },
      });
    }

    // Default: PG / Hostel
    return this.prisma.pGDetails.findUnique({
      where: { id: propertyId },
      select: { availableFrom: true },
    });
  }

  /**
   * Auto-expires past pending/confirmed/calling visits so they don't
   * block new bookings for the same property.
   */
  private async expirePastVisits(
    userId: number,
    propertyId: number
  ): Promise<void> {
    const now = new Date();

    const staleVisits = await this.prisma.visit.findMany({
      where: {
        userId,
        propertyId,
        status: { in: ["pending", "confirmed", "calling"] },
      },
    });

    for (const v of staleVisits) {
      if (!v.visitDateTime) continue;
      const dt = new Date(v.visitDateTime);
      if (isNaN(dt.getTime())) continue;
      if (dt < now) {
        await this.prisma.visit.update({
          where: { id: v.id },
          data: { status: "completed" },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // CREATE VISIT
  // ─────────────────────────────────────────────────────────────────

  async createVisit(userId: number, dto: CreateVisitDto) {
    const { propertyId, date, time, propertyType } = dto;

    if (!propertyId) throw new BadRequestException("propertyId is required");
    if (!date || !time) throw new BadRequestException("date and time are required");

    // ── Resolve property ───────────────────────────────────────────
    const property = await this.resolveProperty(propertyType, propertyId);

    if (!property) {
      throw new NotFoundException(`Property #${propertyId} not found`);
    }

    // ── Date range validation ──────────────────────────────────────
    this.validateDateRange(new Date(date), property.availableFrom ?? null);

    // ── Time conversion & validation ───────────────────────────────
    const time24 = this.convertTo24Hour(time);
    console.log("⏱ RESOLVED TIME (24h):", time24);

    const visitDateTime = this.validateTime(date, time24);

    // ── Auto-expire stale visits ───────────────────────────────────
    await this.expirePastVisits(userId, propertyId);

    // ── Block duplicate active booking ─────────────────────────────
    const activeVisit = await this.prisma.visit.findFirst({
      where: {
        userId,
        propertyId,
        status: { in: ["pending", "confirmed", "calling"] },
      },
    });

    if (activeVisit) {
      throw new BadRequestException(
        "You already have an active visit for this property. Cancel or complete it first."
      );
    }

    // ── Slot conflict check ────────────────────────────────────────
    const slotTaken = await this.prisma.visit.findFirst({
      where: {
        propertyId,
        visitDateTime,
        status: { not: "cancelled" },
      },
    });

    if (slotTaken) {
      throw new BadRequestException(
        "This time slot is already booked. Please choose another."
      );
    }

    // ── Create ─────────────────────────────────────────────────────
    return this.prisma.visit.create({
      data: {
        userId,
        propertyId,
        date,
        time: time24,
        propertyType,
        visitDateTime,
        status: "pending",
        isCalled: false,
        language: "en",
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RESCHEDULE VISIT
  // ─────────────────────────────────────────────────────────────────

  async rescheduleVisit(
    visitId: number,
    userId: number,
    date: string,
    time: string
  ) {
    if (!date || !time) {
      throw new BadRequestException("date and time are required");
    }

    // ── Fetch existing visit ───────────────────────────────────────
    const existing = await this.prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!existing) {
      throw new NotFoundException(`Visit #${visitId} not found`);
    }

    if (existing.userId !== userId) {
      throw new BadRequestException(
        "You are not authorized to reschedule this visit"
      );
    }

    if (existing.status === "cancelled") {
      throw new BadRequestException("Cannot reschedule a cancelled visit");
    }

    if (existing.status === "completed") {
      throw new BadRequestException("Cannot reschedule a completed visit");
    }

    // ── Resolve property for date-range validation ─────────────────
    const property = await this.resolveProperty(
      existing.propertyType,
      existing.propertyId
    );

    // ── Date range validation ──────────────────────────────────────
    if (property) {
      this.validateDateRange(new Date(date), property.availableFrom ?? null);
    }

    // ── Time conversion & validation ───────────────────────────────
    const time24 = this.convertTo24Hour(time);
    console.log("⏱ RESCHEDULE TIME (24h):", time24);

    const newVisitDateTime = this.validateTime(date, time24);

    // ── Slot conflict check (exclude current visit) ────────────────
    const slotTaken = await this.prisma.visit.findFirst({
      where: {
        propertyId: existing.propertyId,
        visitDateTime: newVisitDateTime,
        status: { not: "cancelled" },
        NOT: { id: visitId },
      },
    });

    if (slotTaken) {
      throw new BadRequestException(
        "This time slot is already booked. Please choose another."
      );
    }

    // ── Update ─────────────────────────────────────────────────────
    const updated = await this.prisma.visit.update({
      where: { id: visitId },
      data: {
        date,
        time: time24,
        visitDateTime: newVisitDateTime,
        status: "pending",
      },
    });

    console.log(`✅ Visit #${visitId} rescheduled → ${date} ${time24}`);

    return updated;
  }

  // ─────────────────────────────────────────────────────────────────
  // GET MY VISITS
  // ─────────────────────────────────────────────────────────────────

  async getMyVisits(userId: number) {
    const visits = await this.prisma.visit.findMany({
      where: { userId },
      include: {
        property: true,
        user: true,
      },
      orderBy: { visitDateTime: "desc" },
    });

    // Back-fill visitDateTime for legacy rows that only have date + time
    return visits.map((v) => {
      if (!v.visitDateTime && v.date && v.time) {
        return {
          ...v,
          visitDateTime: new Date(`${v.date}T${v.time}:00`),
        };
      }
      return v;
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // CANCEL VISIT
  // ─────────────────────────────────────────────────────────────────

  async cancelVisit(id: number) {
    const visit = await this.prisma.visit.findUnique({ where: { id } });

    if (!visit) {
      throw new NotFoundException(`Visit #${id} not found`);
    }

    if (visit.status === "cancelled") {
      throw new BadRequestException("Visit is already cancelled");
    }

    return this.prisma.visit.update({
      where: { id },
      data: { status: "cancelled" },
    });
  }
}