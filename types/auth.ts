export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: string;
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export type RegisterResponse = User;

export interface JwtPayload {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}