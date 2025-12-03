"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogin } from "@/lib/hooks/use-auth";
import { BrandLoader } from "@/components/ui/Loader";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, isLoading, error } = useLogin();

  async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login({ email, password });
    } catch {

    }
  }

  return (
      <Card className="w-[400px] p-6">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-20 w-full items-center justify-center">
            {isLoading ? (
                <BrandLoader />
            ) : (
                <h1 className="text-2xl font-bold text-center">Вход в аккаунт</h1>
            )}
          </div>
        </CardHeader>

        <form onSubmit={handleLogIn}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Почта</Label>
              <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col justify-center items-center w-full h-full gap-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Вход..." : "Войти"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Еще нет аккаунта?{" "}
              <Link
                  href="/register"
                  className="text-primary underline-offset-4 hover:underline"
              >
                Регистрация
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
  );
}

export default LoginForm;
