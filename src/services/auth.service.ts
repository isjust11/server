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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    
    return null;
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
    // Créer un nouvel utilisateur
    const user = await this.userService.create(registerDto);
    
    // Générer un token pour le nouvel utilisateur
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