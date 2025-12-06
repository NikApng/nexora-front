import React, {useState} from 'react';
import {Camera} from "lucide-react";
import {useProfile} from "@/lib/hooks/use-profile";
import {useSession} from "next-auth/react";


function HeaderProfileSide({isModalOpen, }) {
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
    const {data: profile, isLoading: isProfileLoading} = useProfile();
    const {data: session, status} = useSession();

    const nickName =
        profile?.name?.trim().charAt(0).toUpperCase() ??
        profile?.email?.trim().charAt(0).toUpperCase() ??
        "U";
    return (
        <section
            className="flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between border border-border">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div
                        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
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
                        <Camera className="h-6 w-6 text-primary-foreground"/>
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

                    </p>
                </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-4 md:w-auto">
                <div className="text-center">
                    <div className="text-lg font-semibold">0</div>
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
    );
}

export default HeaderProfileSide;