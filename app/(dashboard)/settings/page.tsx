"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {useSession} from "next-auth/react";

export default function SettingsPage() {
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);


    return (
        <main className="relative max-w-5xl mx-auto px-4 py-10 space-y-10">

            <header className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight">Настройки</h1>
                    <p className="text-sm text-muted-foreground">
                        Управляйте параметрами аккаунта и интерфейса.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsSectionsOpen(true)}
                >
                    Разделы
                </Button>
            </header>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Профиль</CardTitle>
                        <CardDescription>
                            Эти данные используются в уведомлениях и системе.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Имя</Label>
                                <Input id="firstName" placeholder="Никита" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Фамилия</Label>
                                <Input id="lastName" placeholder="Апнг" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Почта</Label>
                            <Input id="email" type="email" placeholder="you@nexora.app" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Роль</Label>
                            <Input id="role" placeholder="Frontend Developer" />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button">
                            Отмена
                        </Button>
                        <Button type="button">Сохранить</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Безопасность</CardTitle>
                        <CardDescription>
                            Управляйте паролем и доступом к аккаунту.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Текущий пароль</Label>
                            <Input id="currentPassword" type="password" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Новый пароль</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Подтверждение</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button variant="outline" type="button">
                            Изменить пароль
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Полупрозрачный фон под выезжающей панелью */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
                    isSectionsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSectionsOpen(false)}
            />

            {/* Выезжающая панель справа */}
            <aside
                className={`fixed right-0 top-0 z-50 h-full w-72 border-l bg-background shadow-lg transition-transform duration-300
        ${isSectionsOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="text-sm font-medium">Разделы</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => setIsSectionsOpen(false)}
                    >
                        ✕
                    </Button>
                </div>

                <div className="p-3 space-y-1 text-sm">
                    <button className="w-full text-left px-3 py-2 rounded-md bg-muted font-medium">
                        Профиль
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition">
                        Уведомления
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition">
                        Безопасность
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition">
                        Рабочие пространства
                    </button>
                </div>
            </aside>
        </main>
    );
}
