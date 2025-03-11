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
}

export class JwtPayload {
  username: string;
  sub: number;
  isAdmin: boolean;
} 