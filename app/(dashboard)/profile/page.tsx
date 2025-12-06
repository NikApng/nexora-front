"use client";

import React, { useEffect, useState } from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfile, useUpdateBio } from "@/lib/hooks/use-profile";

const projects = [
    {
        id: 1,
        name: "Nexora CRM",
        description: "Внутренняя CRM для управления клиентами и задачами.",
        language: "TypeScript",
        stack: ["Next.js", "TailwindCSS"],
        updatedAt: "Обновлён 2 часа назад",
    },
];

function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const { data: session, status } = useSession();

    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const {
        mutate: updateBio,
        isPending: isBioUpdating,
        error: bioError,
    } = useUpdateBio();

    const [bioDraft, setBioDraft] = useState("");

    useEffect(() => {
        if (profile?.bio != null) {
            setBioDraft(profile.bio);
        }
    }, [profile]);

    const nickName =
        profile?.name?.trim().charAt(0).toUpperCase() ??
        profile?.email?.trim().charAt(0).toUpperCase() ??
        "U";

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

    function handleSaveBio() {
        updateBio(bioDraft);
    }

    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:px-0">
                <PhotoUploadModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onPhotoSelect={handlePhotoSelect}
                    currentPhoto={profilePhoto}
                />

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
                                    <span>{nickName}</span>
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
                            <p className="text-lg font-semibold">
                                {status === "authenticated"
                                    ? profile?.name || profile?.email
                                    : "Гость"}
                            </p>
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
                            <div className="text-lg font-semibold">{projects.length}</div>
                            <div className="text-xs text-muted-foreground">Проектов</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">5</div>
                            <div className="text-xs text-muted-foreground">
                                Открытых задач
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">12</div>
                            <div className="text-xs text-muted-foreground">
                                Pull Request&apos;ов
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl bg-card p-6 shadow-sm border border-border flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">О себе</h2>

                    {isProfileLoading ? (
                        <p className="text-sm text-muted-foreground">Загрузка...</p>
                    ) : (
                        <>
              <textarea
                  className="w-full min-h-[100px] rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  placeholder="Расскажите о себе, стеке, опыте, чем занимаетесь…"
              />
                            {bioError && (
                                <p className="text-xs text-red-500">
                                    {(bioError as Error).message}
                                </p>
                            )}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSaveBio}
                                    disabled={isBioUpdating}
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-70"
                                >
                                    {isBioUpdating ? "Сохранение..." : "Сохранить"}
                                </button>
                            </div>
                        </>
                    )}
                </section>

                {/* дальше твои блоки с проектами и сайдбаром */}
            </div>
        </main>
    );
}

export default Page;
