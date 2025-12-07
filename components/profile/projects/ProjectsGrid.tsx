import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./ProjectCard";
import CreateProjectModal from "@/components/profile/projects/CreateProjectModal";

type Project = {
    id: number | string;
    name: string;
    description: string;
    language: string;
    stack: string[];
    updatedAt: string;
};

type CreateProjectFormValues = {
    name: string
    description: string
    language: string
    stackText: string
}

type ProjectsGridProps = {
    title?: string;
    subtitle?: string;
    actionLabel?: string;
    projects: Project[];
    onRemoveProject?: (id: number | string) => void;
    onCreateProject?: (values: CreateProjectFormValues) => void;
};



export function ProjectsGrid({
                                 title = "Проекты",
                                 subtitle = "Список твоих последних проектов.",
                                 actionLabel = "Новый проект",
                                 projects,
                                 onRemoveProject,
                                 onCreateProject,
                             }: ProjectsGridProps) {
    const [isOpen, setOpen] = useState(false)

    const handleSubmitFromModal = (values: CreateProjectFormValues) => {
        if (onCreateProject) {
            onCreateProject(values)
        }
        setOpen(false)
    }

    return (
        <section className="flex flex-col gap-4">
            <CreateProjectModal
                open={isOpen}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmitFromModal}
            />

            <header className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold truncate">{title}</h2>
                    <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                </div>

                <Button
                    type="button"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() => setOpen(true)}
                >
                    {actionLabel}
                </Button>
            </header>

            <div className="flex flex-col gap-3">
                {projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-sm text-muted-foreground text-center">
                        Здесь появятся ваши проекты. Создайте первый, чтобы начать.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                description={project.description}
                                language={project.language}
                                stack={project.stack}
                                updatedAt={project.updatedAt}
                                onRemove={onRemoveProject}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
