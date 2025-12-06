"use client";

import React, {useState} from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import {useSession} from "next-auth/react";
import {useProfile} from "@/lib/hooks/use-profile";

import HeaderProfileSide from "@/components/profile/HeaderProfileSide";
import BioSectionProfile from "@/components/profile/BioSectionProfile";
import RightStatsSection from "@/components/profile/RightStatsSection";

function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    const {data: profile} = useProfile();

    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto max-w-6xl flex flex-col gap-8 px-4 lg:px-0">

                <PhotoUploadModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    currentPhoto={profilePhoto}
                />

                <HeaderProfileSide isOpen={() => setIsModalOpen(true)}/>

                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="flex-1 flex flex-col gap-6">

                    </div>

                    <RightStatsSection/>

                </div>

            </div>
        </main>
    );
}

export default Page;
