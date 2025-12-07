"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type CreateProjectModalProps = {
    open: boolean;
    onClose: () => void;
};

function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-lg shadow-black/20">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold">Новый проект</h2>
                        <p className="text-xs text-muted-foreground">
                            Заполните данные, чтобы создать проект в профиле.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/70 text-muted-foreground transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* body */}
                <div className="px-5 py-4 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="project-name" className="text-xs">
                            Название проекта
                        </Label>
                        <Input
                            id="project-name"
                            placeholder="Например: Nexora Dashboard"
                            className="text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="project-description" className="text-xs">
                            Краткое описание
                        </Label>
                        <textarea
                            id="project-description"
                            className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Опишите, что делает ваш проект…"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="project-language" className="text-xs">
                                Язык
                            </Label>
                            <Input
                                id="project-language"
                                placeholder="TypeScript"
                                className="text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="project-stack" className="text-xs">
                                Стек
                            </Label>
                            <Input
                                id="project-stack"
                                placeholder="Next.js, React, Drizzle…"
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="flex items-center justify-end gap-2 px-5 pb-4 pt-2 border-t border-border/60">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-xs px-3"
                        onClick={onClose}
                    >
                        Отмена
                    </Button>
                    <Button

                        type="button"
                        className="text-xs px-4"
                    >
                        Создать проект
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateProjectModal;
