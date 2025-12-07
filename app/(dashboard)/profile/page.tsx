"use client";
import type { CreateProjectFormValues } from "@/components/profile/projects/CreateProjectModal";
import React, { useState } from "react";
import PhotoUploadModal from "@/components/profile/PhotoUploadModal";
import { useProjects, useCreateProject, useDeleteProject } from "@/lib/hooks/use-pojects";
import { ProjectsGrid } from "@/components/profile/projects/ProjectsGrid";
import HeaderProfileSide from "@/components/profile/HeaderProfileSide";
import BioSectionProfile from "@/components/profile/BioSectionProfile";
import RightStatsSection from "@/components/profile/RightStatsSection";
import type { ProjectDto } from "@/lib/hooks/use-pojects";
import { useProfileReactions } from "@/lib/hooks/use-project-reactions";
function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    const { data: projects = [] } = useProjects();
    const { data: profileReactions } = useProfileReactions();
    const starsTotal = profileReactions?.stars ?? 0;
    const watchersTotal = profileReactions?.watchers ?? 0;

    const uiProjects = projects.map((project: ProjectDto) => ({
        id: project.id,
        name: project.name,
        description: project.description ?? "",

        language: project.language,

        stack: Array.isArray(project.stack)
            ? project.stack
            : project.stack
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),

        updatedAt: project.updatedAt,
    }));
    const { mutate: createProject } = useCreateProject();
    const { mutate: deleteProject } = useDeleteProject();

    const handleRemoveProject = (id: number | string) => {
        deleteProject(id);
    };
    const handleCreateProject = (values: CreateProjectFormValues) => {
        const stackArray = values.stackText
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)

        createProject({
            name: values.name,
            description: values.description,
            language: values.language,
            stack: stackArray,
            code: values.code,
            codeFilename: values.codeFilename,
            codeStructure: values.codeStructure,
        })
    }


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
                    starsTotal={starsTotal}
                    watchersTotal={watchersTotal}
                    isOpen={() => setIsModalOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-6">
                        <BioSectionProfile />

                        <ProjectsGrid
                            projects={uiProjects}
                            onCreateProject={handleCreateProject}
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
