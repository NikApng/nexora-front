"use client";

import React, { useState } from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import { useProjects, useCreateProject, useDeleteProject } from "@/lib/hooks/use-pojects";
import { ProjectsGrid } from "@/components/profile/projects/ProjectsGrid";
import HeaderProfileSide from "@/components/profile/HeaderProfileSide";
import BioSectionProfile from "@/components/profile/BioSectionProfile";
import RightStatsSection from "@/components/profile/RightStatsSection";

function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    const { data: projects = [] } = useProjects();
    const { mutate: createProject } = useCreateProject();
    const { mutate: deleteProject } = useDeleteProject();

    const handleRemoveProject = (id: number | string) => {
        deleteProject(id);
    };
    const handleNewProject = () => {
        const name = window.prompt("Название проекта");
        if (!name) return;

        createProject({
            name,
            description: "Описание позже",
            language: "TypeScript",
            stack: ["Next.js", "React"],
        });
    };

    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto max-w-6xl flex flex-col gap-8 px-4 lg:px-0">
                <PhotoUploadModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    currentPhoto={profilePhoto}
                />

                <HeaderProfileSide
                    projectsCounter={projects.length}
                    isOpen={() => setIsModalOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-6">
                        <BioSectionProfile />

                        <ProjectsGrid
                            projects={projects}
                            onActionClick={handleNewProject}
                            onRemoveProject={handleRemoveProject}
                        />

                    </div>

                    <RightStatsSection />
                </div>
            </div>
        </main>
    );
}

export default Page;
