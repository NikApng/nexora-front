"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth.validation";

interface UseRegisterReturn {
  register: (data: RegisterInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface UseLoginReturn {
  login: (credentials: LoginInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка при регистрации");
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при регистрации");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (!result || !result.ok) {
        throw new Error(result?.error || "Неверный email или пароль");
      }

      router.push("/profile");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неверный email или пароль";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

