import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsBoolean()
  @IsOptional()
  isGoogleUser?: boolean;

  @IsString()
  @IsOptional()
  verificationToken?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsArray()
  @IsOptional()
  roleIds?: number[];
}

export class JwtPayload {
  username: string;
  sub: number;
  picture: string;
  email: string;
  fullName: string;
  googleId: string;
} 