"use client";

import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { BrandLoader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateBio } from "@/lib/hooks/use-profile";

function BioSectionProfile() {
    const { data: profile, isLoading } = useProfile();
    const [bioDraft, setBioDraft] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const {
        mutate: updateBio,
        isPending: isUpdating,
        error,
    } = useUpdateBio();

    useEffect(() => {
        if (profile?.bio != null) {
            setBioDraft(profile.bio);
        }
    }, [profile]);

    const handleSave = () => {
        updateBio(bioDraft, {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <section
            className="rounded-2xl bg-card p-6 shadow-sm border border-border flex flex-col gap-4 relative group"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <h2 className="text-lg font-semibold">О себе</h2>

            {isLoading ? (
                <BrandLoader />
            ) : (
                <>
                    {!isEditing && (
                        <div className="relative ">
                            <p className="text-sm text-foreground/90 whitespace-pre-line">
                                {bioDraft || "Пока здесь пусто…"}
                            </p>

                            {isHover && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute -top-2 right-0 text-xs hover:scale-101 duration-300"
                                >
                                    <Edit/>
                                </Button>
                            )}
                        </div>
                    )}

                    {isEditing && (
                        <div className="flex flex-col gap-3">
              <textarea
                  className="w-full min-h-[120px] rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
              />

                            {error && (
                                <p className="text-xs text-red-500">
                                    {(error as Error).message}
                                </p>
                            )}

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setBioDraft(profile?.bio || "");
                                        setIsEditing(false);
                                    }}
                                >
                                    Отмена
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Сохранение..." : "Сохранить"}
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default BioSectionProfile;
