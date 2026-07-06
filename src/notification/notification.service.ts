import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async send(data: {
    recipientId: number;
    title: string;
    body: string;
    category?: string;
  }) {
    console.log("🔥 SAVING NOTIFICATION", data);

    return this.prisma.notification.create({
      data: {
        recipientId: Number(data.recipientId),
        title: data.title,
        body: data.body,
        category: data.category || "booking",
        isRead: false,
      },
    });
  }

  async getMy(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async markRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}