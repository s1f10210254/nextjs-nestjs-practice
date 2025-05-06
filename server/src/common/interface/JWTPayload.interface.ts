export interface JWTPayload {
  sub: number;
  email: string;
  nickname: string;
  iat: number; // issued at
  exp: number; // expiration time
}
