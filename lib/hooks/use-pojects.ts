import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ProjectDto {
    id: number;
    userId: number;
    name: string;
    description: string | null;
    language: string;
    stack: string;
    createdAt: string;
    updatedAt: string;
}

async function fetchProjects(): Promise<ProjectDto[]> {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Не удалось загрузить проекты");
    return res.json();
}

interface CreateProjectPayload {
    name: string;
    description?: string;
    language?: string;
    stack?: string[];
}

async function createProject(payload: CreateProjectPayload): Promise<ProjectDto> {
    const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось создать проект");
    }

    return res.json();
}

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (project) => {
            queryClient.setQueryData<ProjectDto[] | undefined>(["projects"], (old) =>
                old ? [...old, project] : [project]
            );
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const message = data?.error || "Не удалось удалить проект";
                throw new Error(message);
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

async function fetchPopularProjects(): Promise<ProjectDto[]> {
    const res = await fetch("/api/projects/popular");
    if (!res.ok) throw new Error("Не удалось загрузить популярные проекты");
    return res.json();
}

export function usePopularProjects() {
    return useQuery({
        queryKey: ["projects", "popular"],
        queryFn: fetchPopularProjects,
    });
}
