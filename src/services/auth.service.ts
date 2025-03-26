import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto, RegisterDto, JwtPayload } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { EmailService } from './email.service';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
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

    // Tạo access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m' // Access token hết hạn sau 15 phút
    });

    // Tạo refresh token
    const refreshToken = await this.createRefreshToken(user);
    
    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
        picture: user.picture,
      },
    };
  }

  private async createRefreshToken(user: User): Promise<RefreshToken> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token hết hạn sau 7 ngày

    const refreshToken = this.refreshTokenRepository.create({
      token,
      expiresAt,
      userId: user.id
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  async refreshAccessToken(refreshTokenString: string) {
    const foundToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString, isRevoked: false },
      relations: ['user']
    });

    if (!foundToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (new Date() > foundToken.expiresAt) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    const payload: JwtPayload = {
      username: foundToken.user.username,
      sub: foundToken.user.id,
      picture: foundToken.user.picture,
      email: foundToken.user.email,
      fullName: foundToken.user.fullName,
      googleId: foundToken.user.googleId,
    };

    // Tạo access token mới
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m'
    });

    return {
      accessToken,
      user: {
        id: foundToken.user.id,
        username: foundToken.user.username,
        fullName: foundToken.user.fullName,
        isAdmin: foundToken.user.isAdmin,
        picture: foundToken.user.picture,
      }
    };
  }

  async revokeRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token }
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }
} 