"use client";

import React from "react";
import NavItem from "@/components/header/nav-item";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import ThemeButton from "@/components/header/ThemeBtton";
import Link from "next/link";

function HeaderLayout() {
    const { data: session, status } = useSession();

    return (
        <header className="w-full border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
                {/* Лого + бренд */}
                <Link href="/projects" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                        N
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
            Nexora
          </span>
                </Link>

                {status === "authenticated" && <NavItem />}

                <div className="hidden items-center gap-3 sm:flex">
                    {status === "loading" ? (
                        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                    ) : status === "authenticated" ? (
                        <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
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
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Войти
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                    <ThemeButton />
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-border bg-card p-2 md:hidden"
                    aria-label="Открыть меню"
                >
                    <span className="sr-only">Открыть меню</span>
                    <span className="block h-[2px] w-5 rounded bg-foreground" />
                    <span className="mt-1 block h-[2px] w-5 rounded bg-foreground" />
                    <span className="mt-1 block h-[2px] w-5 rounded bg-foreground" />
                </button>
            </div>
        </header>
    );
}

export default HeaderLayout;
