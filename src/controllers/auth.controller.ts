import { Controller, Post, Body, Get, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, Res, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, ResendEmailDto } from '../dtos/auth.dto';
import { JwtAuthGuard, Public } from '../guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('resend-email')
  async resendEmail(@Body() resendEmailDto: ResendEmailDto) {
    return this.authService.resendEmail(resendEmailDto);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    console.log('Starting Google authentication process');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    try {
      const userInfo = req.user;
      const tempToken = await this.authService.createTempToken(userInfo);
      res.redirect(`${process.env.CLIENT_URL}/success?token=${tempToken}`);
    } catch (_error) {
      console.error('Google authentication error:', _error);
      res.redirect(`${process.env.CLIENT_URL}/error?message=Authentication failed`);
    }
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) {
    console.log('Starting Facebook authentication process');
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Request() req, @Res() res: Response) {
    try {
      const userInfo = req.user;
      const tempToken = await this.authService.createTempToken(userInfo);
      res.redirect(`${process.env.CLIENT_URL}/success?token=${tempToken}`);
    } catch (_error) {
      console.error('Facebook authentication error:', _error);
      res.redirect(`${process.env.CLIENT_URL}/error?message=Authentication failed`);
    }
  }

  @Public()
  @Get('token-info')
  async getTokenInfo(@Query('token') token: string) {
    return this.authService.getTempTokenInfo(token);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    await this.authService.revokeRefreshToken(refreshToken);
    return { message: 'Đăng xuất thành công' };
  }
} 