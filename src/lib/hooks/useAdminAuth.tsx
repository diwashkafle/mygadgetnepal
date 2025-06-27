'use client';

import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface AdminTokenPayload {
  userId: string;
  email: string;
  exp: number;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminTokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        const payload = jwtDecode<AdminTokenPayload>(token);
        if (payload.exp * 1000 > Date.now()) {
          setUser(payload);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("admin_token", token);
    const payload = jwtDecode<AdminTokenPayload>(token);
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return { user, isLoading, login, logout };
}
