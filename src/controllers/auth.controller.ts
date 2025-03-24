import { Controller, Post, Body, Get, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtPayload, LoginDto, RegisterDto } from '../dtos/auth.dto';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/entities/user.entity';

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
  @Get('me')
  async getCurrentUser(@Request() req) {
    try {
      // Lấy cookie từ request
      const userCookie = req.cookies?.user;
      
      if (!userCookie) {
        console.log('Không tìm thấy cookie user');
        return null;
      }

      // Parse JSON từ cookie
      const userData = JSON.parse(userCookie);
      console.log('User data từ cookie:', userData);
      
      return userData;
    } catch (error) {
      console.error('Lỗi khi lấy user từ cookie:', error);
      return null;
    }
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
      const token = await this.authService.generateToken(user);
      // Set secure cookie with user data
      res.cookie('user', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Redirect with only token
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token.accessToken}&user=${JSON.stringify(user)}`);
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
    const user = await this.authService.validateSocialUser({
      email: req.user.email,
      fullName: req.user.fullName,
      picture: req.user.picture,
      facebookId: req.user.id, // ID từ Facebook
      accessToken: req.user.accessToken,
    });
    const token = await this.authService.generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token.accessToken}&user=${JSON.stringify(user)}`);
  }
} 