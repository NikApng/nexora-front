"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRegister } from "@/lib/hooks/use-auth";
import { BrandLoader } from "@/components/ui/Loader";

function RegisterForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { register, isLoading, error } = useRegister();

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await register({ name, email, password });
        } catch {
        }
    }

    return (
        <Card className="w-[400px] p-6 mt-10 w-auto">
            <CardHeader className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-full items-center justify-center">
                    {isLoading ? (
                        <BrandLoader />
                    ) : (
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold text-center">Nexora</h1>
                            <h4 className="text-lg text-center">Создать аккаунт</h4>
                        </div>
                    )}
                </div>
            </CardHeader>

            <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={2}
                            disabled={isLoading}
                        />
                    </div>

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
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>

                <CardFooter className="flex flex-col justify-center items-center w-full h-full gap-2">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Уже есть аккаунт?{" "}
                        <Link
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Войти
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default RegisterForm;
