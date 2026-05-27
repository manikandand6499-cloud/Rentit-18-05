import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,private prisma: PrismaService) {}

  @Post("send-otp")
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.mobile);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.mobile, dto.otp);
  }

  @Post("login")
  async login(@Body() body: any) {

    const { name, email, mobile } = body;

    // Check existing user.....
    let user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    // If user doesn't exist → create
    if (!user) {

      user = await this.prisma.user.create({
        data: {
          name,
          email,
          mobile
        }
      });
    }

    return {
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile
    };
  }
}