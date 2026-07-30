"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { AuthUser, LoginResponse } from "@/types/auth";
import { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setAuthCookies(token: string, role: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clearAuthCookies() {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (values: LoginFormValues) => {
    const data = await api.post<LoginResponse>("/auth/login", values);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthCookies(data.token, data.user.role);
    setUser(data.user);

    const redirectPath =
      data.user.role === "ADMIN"
        ? "/dashboard/admin"
        : data.user.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer";

    router.push(redirectPath);
  };

  const register = async (values: RegisterFormValues) => {
    await api.post("/auth/register", values);
    await login({ email: values.email, password: values.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearAuthCookies();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}