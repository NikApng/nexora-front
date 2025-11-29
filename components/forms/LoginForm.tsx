"use client";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import React from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

function LoginForm() {
    const [error, setError] = useState<null | string>(null)
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("")
    const router = useRouter()

    async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res || !res.ok) {
            setError(res?.error ?? "Не удалось войти");
            return;
        }

        router.push("/profile");
    }

    return (
        <Card className="w-[400px] p-6">
            <form onSubmit={handleLogIn}>
                <CardHeader>
                    <h1 className="text-2xl font-bold text-center">Login in account</h1>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Имя</Label>
                        <Input
                            type={'text'}
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Почта</Label>
                        <Input type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Пароль</Label>
                        <Input type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>

                <CardFooter className={'flex flex-col justify-center items-center w-full h-full '}>
                    <Button type="submit"
                            className=""
                    >Далее</Button>
                    <p className="text-sm text-center text-muted-foreground">
                        еще нет аккаунта?{" "}
                        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                            Регистрация
                        </Link>
                    </p>
                </CardFooter>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            </form>
        </Card>
    );
}

export default LoginForm;