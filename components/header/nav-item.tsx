"use client";
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {cn} from "@/lib/utils"

function NavItem(props) {
    const navButtons = [
        { label: "Профиль", href: "/profile" },
        { label: "Проекты", href: "/projects" },
        { label: "Задачи", href: "/tasks" },
        { label: "Настройки", href: "/settings" },
    ];
    const pathname = usePathname();



    return (
        <nav className="flex gap-4">
            {navButtons.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-opacity hover:opacity-70",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default NavItem;