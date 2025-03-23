import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto, RegisterDto, JwtPayload } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    const user = await this.userService.create(registerDto);
    
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      isAdmin: user.isAdmin,
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      },
    };
  }
} 