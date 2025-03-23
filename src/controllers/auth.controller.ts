import { Controller, Post, Body, Get, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';
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
      // Lưu hoặc cập nhật thông tin người dùng vào database
      const user = await this.authService.validateSocialUser({
        email: req.user.email,
        fullName: req.user.fullName,
        picture: req.user.picture,
        googleId: req.user.id, // ID từ Google
        accessToken: req.user.accessToken,
      });

      // Tạo JWT token
      const token = await this.authService.generateToken(user);
      
      // Chuyển hướng về frontend với token
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token.accessToken}`);
    } catch (error) {
      console.error('Google authentication error:', error);
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`);
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
    const token = await this.authService.generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token.accessToken}`);
  }
} 