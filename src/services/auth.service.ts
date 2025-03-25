import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto, RegisterDto, JwtPayload } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    
    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async validateSocialUser(socialUser: any): Promise<any> {
    try {
      // Tìm user theo email
      let user = await this.userService.findByEmail(socialUser.email);
      
      if (!user) {
        // Tạo user mới nếu chưa tồn tại
        const registerDto: RegisterDto = {
          username: socialUser.email,
          email: socialUser.email,
          fullName: socialUser.fullName,
          password: Math.random().toString(36).slice(-8), // Tạo mật khẩu ngẫu nhiên
          googleId: socialUser.googleId, // Lưu ID từ Google
          picture: socialUser.picture, // Lưu ảnh đại diện
          isGoogleUser: true, // Đánh dấu là user đăng nhập bằng Google
        };
        user = await this.userService.create(registerDto);
      } else {
        // Cập nhật thông tin nếu user đã tồn tại
        user.googleId = socialUser.googleId;
        user.picture = socialUser.picture;
        user.isGoogleUser = true;
        await this.userService.update(user.id, user);
      }
      
      return this.generateToken(user);
    } catch (error) {
      console.error('Error in validateSocialUser:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    
    return this.generateToken(user);
  }

  async register(registerDto: RegisterDto) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await this.userService.create({
      ...registerDto,
      verificationToken,
      isEmailVerified: false,
    });
    
    // Gửi email xác thực
    if (user.email) {
      await this.emailService.sendVerificationEmail(
        user.email, 
        verificationToken,
        user.fullName || user.username
      );
    }
    
    return this.generateToken(user);
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Token xác thực không hợp lệ');
    }

    user.isEmailVerified = true;
    user.verificationToken = '';
    await this.userService.update(user.id, user);

    return { message: 'Email đã được xác thực thành công' };
  }

  async generateToken(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      picture: user.picture,
      email: user.email,
      fullName: user.fullName,
      googleId: user.googleId,
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
        picture: user.picture,
      },
    };
  }
} 