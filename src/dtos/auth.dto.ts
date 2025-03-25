export class LoginDto {
  username: string;
  password: string;
}

export class RegisterDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  isAdmin?: boolean;
  googleId?: string;
  picture?: string;
  isGoogleUser?: boolean;
  verificationToken?: string;
  isEmailVerified?: boolean;
}

export class JwtPayload {
  username: string;
  sub: number;
  picture: string;
  email: string;
  fullName: string;
  googleId: string;
} 