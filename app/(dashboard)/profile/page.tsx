"use client";

import React, {useEffect, useState} from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import {useSession} from "next-auth/react";
import {useProfile, useUpdateBio} from "@/lib/hooks/use-profile";
import {Button} from "@/components/ui/button";
import {BrandLoader} from "@/components/ui/Loader";
import HeaderProfileSide from "@/components/profile/HeaderProfileSide";

function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const {data: session, status} = useSession();

    const {data: profile, isLoading: isProfileLoading} = useProfile();
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

                <HeaderProfileSide/>

                <section className="rounded-2xl bg-card p-6 shadow-sm border border-border flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">О себе</h2>

                    {isProfileLoading ? (
                        <BrandLoader/>
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
                                <Button
                                    type="button"
                                    onClick={handleSaveBio}
                                    disabled={isBioUpdating}
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-70"
                                >
                                    {isBioUpdating ? "Сохранение..." : "Сохранить"}
                                </Button>
                            </div>
                        </>
                    )}
                </section>

            </div>
        </main>
    );
}

export default Page;
