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

normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Always store 10-digit mobile numbers in DB
  return digits.slice(-10);
}

getLocalNumber(phone: string): string {
  return phone;
}

  // SEND OTP
  async sendOtp(mobile: string) {
    const phone = this.normalizePhone(mobile);
    const localNumber = this.getLocalNumber(phone);

    try {
      const response = await axios.post(
        "https://www.fast2sms.com/dev/otp/send",
        {
          mobile: localNumber,
          otp_id: process.env.FAST2SMS_OTP_ID,
        },
        {
          headers: {
            authorization:
              process.env.FAST2SMS_API_KEY,
            "Content-Type":
              "application/json",
            accept: "application/json",
          },
        },
      );

      console.log(
        "FAST2SMS SEND:",
        response.data,
      );

      if (!response.data.request_id) {
        throw new UnauthorizedException(
          "OTP send failed",
        );
      }

      const requestId =
        response.data.request_id;

      await this.prisma.otpSession.deleteMany({
        where: { mobile: phone },
      });

      await this.prisma.otpSession.create({
        data: {
          mobile: phone,
          sessionId: requestId,
        },
      });

      return {
        success: true,
        requestId,
      };
    } catch (e: any) {
      console.log(
        e.response?.data || e.message,
      );

      throw new UnauthorizedException(
        "Failed to send OTP",
      );
    }
  }

  // VERIFY OTP
  async verifyOtp(
    mobile: string,
    otp: string,
  ) {
    const phone = this.normalizePhone(mobile);
    const localNumber =
      this.getLocalNumber(phone);

    const session =
      await this.prisma.otpSession.findFirst({
        where: { mobile: phone },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!session) {
      throw new UnauthorizedException(
        "OTP session not found",
      );
    }

    try {
      const response = await axios.post(
        "https://www.fast2sms.com/dev/otp/verify",
        {
          mobile: localNumber,
          otp,
          otp_id: process.env.FAST2SMS_OTP_ID,
        },
        {
          headers: {
            authorization:
              process.env.FAST2SMS_API_KEY,
            "Content-Type":
              "application/json",
            accept: "application/json",
          },
        },
      );

      console.log(
        "FAST2SMS VERIFY:",
        response.data,
      );

     if (response.data.return !== true) {
  throw new UnauthorizedException(
    response.data.message || "Invalid OTP",
  );
}

      await this.prisma.otpSession.deleteMany({
        where: {
          mobile: phone,
        },
      });

      let user =
        await this.prisma.user.findUnique({
          where: {
            mobile: phone,
          },
        });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            mobile: phone,
          },
        });
      }

      const token = this.jwtService.sign({
        userId: user.id,
        mobile: user.mobile,
      });

      return {
        success: true,
        token,
        user,
      };
    } catch (e: any) {
      console.log(
        e.response?.data || e.message,
      );

      throw new UnauthorizedException(
        "OTP verification failed",
      );
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 9edb78bfade2d50287649ec288abf7e536759177
