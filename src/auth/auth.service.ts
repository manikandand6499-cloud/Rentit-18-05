import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

import axios from "axios";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /// NORMALIZE PHONE
  normalizePhone(phone: string) {
    return phone.replace(/\D/g, "").trim();
  }

  /// SEND OTP
  async sendOtp(mobile: string) {
    mobile = this.normalizePhone(mobile);

    console.log("📤 Sending OTP:", mobile);

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.API_KEY}/SMS/+91${mobile}/AUTOGEN`
    );

    console.log("2Factor:", response.data);

    if (response.data.Status !== "Success") {
      throw new UnauthorizedException(
        "Failed to send OTP"
      );
    }

    const sessionId = response.data.Details;

    // DELETE OLD SESSION
    await this.prisma.otpSession.deleteMany({
      where: {
        mobile,
      },
    });

    // SAVE SESSION
    await this.prisma.otpSession.create({
      data: {
        mobile,
        sessionId,
      },
    });

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }

  /// VERIFY OTP
  async verifyOtp(
    mobile: string,
    otp: string,
  ) {
    mobile = this.normalizePhone(mobile);

    const session =
      await this.prisma.otpSession.findFirst({
        where: { mobile },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!session) {
      throw new UnauthorizedException(
        "OTP session expired",
      );
    }

    console.log(
      "📲 Verifying:",
      session.sessionId,
    );

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.API_KEY}/SMS/VERIFY/${session.sessionId}/${otp}`
    );

    console.log(response.data);

    if (response.data.Status !== "Success") {
      throw new UnauthorizedException(
        "Invalid OTP",
      );
    }

    // DELETE OTP SESSION
    await this.prisma.otpSession.deleteMany({
      where: {
        mobile,
      },
    });

    // CHECK USER
    let user =
      await this.prisma.user.findUnique({
        where: {
          mobile,
        },
      });

    // CREATE USER
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          mobile,
        },
      });
    }

    // JWT TOKEN
    const token = this.jwtService.sign({
      userId: user.id,
      mobile: user.mobile,
    });

    return {
      success: true,
      token,
      user,
    };
  }
} 