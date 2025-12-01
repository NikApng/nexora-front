"use client";

import React, { useState } from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import { Camera } from "lucide-react";

const projects = [
    {
        id: 1,
        name: "Nexora CRM",
        description: "Внутренняя CRM для управления клиентами и задачами.",
        language: "TypeScript",
        stack: ["Next.js", "TailwindCSS"],
        updatedAt: "Обновлён 2 часа назад",
    },
    {
        id: 2,
        name: "Analytics Dashboard",
        description: "Дашборд с метриками и графиками для маркетинга.",
        language: "JavaScript",
        stack: ["React", "REST API"],
        updatedAt: "Обновлён вчера",
    },
    {
        id: 3,
        name: "Landing Builder",
        description: "Конструктор лендингов с готовыми блоками.",
        language: "TypeScript",
        stack: ["Next.js", "Zustand"],
        updatedAt: "Обновлён на этой неделе",
    },
];

function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    const handlePhotoSelect = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePhoto(null);
        }
    };

    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:px-0">
                <PhotoUploadModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onPhotoSelect={handlePhotoSelect}
                    currentPhoto={profilePhoto}
                />

                {/* Верхний блок профиля */}
                <section className="flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between border border-border">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    "N"
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Изменить фото"
                            >
                                <Camera className="h-6 w-6 text-primary-foreground" />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Никита
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Frontend-разработчик · Next.js / React / TypeScript
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Зарегистрирован: март 2024 · Последняя активность: сегодня
                            </p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-4 md:w-auto">
                        <div className="text-center">
                            <div className="text-lg font-semibold">
                                {projects.length}
                            </div>
                            <div className="text-xs text-muted-foreground">Проектов</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">5</div>
                            <div className="text-xs text-muted-foreground">Открытых задач</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">12</div>
                            <div className="text-xs text-muted-foreground">
                                Pull Request&apos;ов
                            </div>
                        </div>
                    </div>
                </section>

                {/* Плашка с выбором фото */}
                <section className="rounded-2xl border-2 border-dashed border-border bg-card p-6 shadow-sm transition hover:border-accent hover:bg-accent/40">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex w-full items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted overflow-hidden">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <Camera className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="text-left">
                                <h3 className="text-base font-semibold">
                                    {profilePhoto
                                        ? "Изменить фото профиля"
                                        : "Добавить фото профиля"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {profilePhoto
                                        ? "Нажмите, чтобы загрузить новое фото"
                                        : "Загрузите фото, чтобы другие пользователи могли вас узнать"}
                                </p>
                            </div>
                        </div>
                        <Camera className="h-5 w-5 text-muted-foreground" />
                    </button>
                </section>

                {/* Проекты + сайдбар */}
                <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                    {/* Левая колонка — проекты */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Проекты</h2>
                                <p className="text-sm text-muted-foreground">
                                    Список твоих последних проектов.
                                </p>
                            </div>
                            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                Новый проект
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="rounded-2xl border border-border bg-card p-4 transition hover:border-accent hover:bg-accent/40"
                                >
                                    <div className="mb-1 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="#"
                                                className="text-sm font-semibold hover:underline"
                                            >
                                                {project.name}
                                            </a>
                                        </div>
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {project.language}
                    </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {project.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            {project.stack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                                >
                          {tech}
                        </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                      {project.updatedAt}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Правая колонка — сайдбар */}
                    <aside className="flex flex-col gap-4">
                        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
                            <h3 className="mb-3 text-sm font-semibold">
                                Активность
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex justify-between">
                                    <span>Сегодня</span>
                                    <span className="font-medium text-foreground">
                    3 коммита
                  </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>За неделю</span>
                                    <span className="font-medium text-foreground">
                    12 задач закрыто
                  </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Пулл-реквесты</span>
                                    <span className="font-medium text-foreground">
                    4 открыто
                  </span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
                            <h3 className="mb-3 text-sm font-semibold">
                                Быстрые действия
                            </h3>
                            <div className="flex flex-col gap-2">
                                <button className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted">
                                    Перейти к задачам
                                </button>
                                <button className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted">
                                    Настройки профиля
                                </button>
                                <button className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted">
                                    Просмотреть все проекты
                                </button>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}

export default Page;
