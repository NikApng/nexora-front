"use client";

import React from 'react';
import NavItem from "@/components/header/nav-item";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import ThemeButton from '@/components/header/ThemeBtton'
import Link from "next/link";


function HeaderLayout() {
    const { data: session, status } = useSession();

    return (
        <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

                <Link href="/projects" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                        N
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                        Nexora
                    </span>
                </Link>

                {status === "authenticated" && <NavItem />}

                <div className="hidden items-center gap-3 sm:flex">
                    {status === "loading" ? (
                        <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
                    ) : status === "authenticated" ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">
                                {session?.user?.name || session?.user?.email}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="text-sm"
                            >
                                Выйти
                            </Button>
                        </div>
                    ) : (
                        <>
                            <a
                                href="/login"
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                            >
                                Войти
                            </a>
                            <a
                                href="/register"
                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Регистрация
                            </a>
                        </>
                    )}
                    <ThemeButton/>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 md:hidden"
                    aria-label="Открыть меню"
                >
                    <span className="sr-only">Открыть меню</span>
                    <span className="block h-[2px] w-5 rounded bg-slate-900" />
                    <span className="mt-1 block h-[2px] w-5 rounded bg-slate-900" />
                    <span className="mt-1 block h-[2px] w-5 rounded bg-slate-900" />
                </button>
            </div>
        </header>
    );
}

export default HeaderLayout;