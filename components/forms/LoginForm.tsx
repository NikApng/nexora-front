"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogin } from "@/lib/hooks/use-auth";

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
      <form onSubmit={handleLogIn}>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Вход в аккаунт</h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Почта</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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