import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ProjectDto {
    id: number;
    userId: number;
    name: string;
    description: string | null;
    language: string;
    stack: string;
    code: string | null;
    codeFilename: string | null;
    codeStructure: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectOwnerDto {
    id: number;
    name: string | null;
    email: string | null;
    bio: string | null;
    createdAt: string | Date | null;
}

export interface ProjectDetailsDto extends ProjectDto {
    owner: ProjectOwnerDto | null;
}

async function fetchProjects(): Promise<ProjectDto[]> {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Не удалось загрузить проекты");
    return res.json();
}

async function fetchProjectById(id: number | string): Promise<ProjectDetailsDto> {
    const res = await fetch(`/api/projects/${id}`);

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.error || "Не удалось загрузить проект";
        throw new Error(message);
    }

    return res.json();
}

interface CreateProjectPayload {
    name: string;
    description?: string;
    language?: string;
    stack?: string[];
    code?: string;
    codeFilename?: string | null;
    codeStructure?: string | null;
}

interface UpdateProjectPayload {
    description?: string;
    code?: string;
    codeFilename?: string | null;
    codeStructure?: string | null;
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

async function updateProject(id: number | string, payload: UpdateProjectPayload): Promise<ProjectDto> {
    const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось обновить проект");
    }

    return res.json();
}

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
    });
}

export function useUpdateProject(id?: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProjectPayload) => updateProject(id as string, payload),
        onSuccess: (updated) => {
            queryClient.setQueryData<ProjectDto[] | undefined>(["projects"], (old) =>
                old ? old.map((p) => (p.id === updated.id ? updated : p)) : old
            );
            queryClient.setQueryData(["projects", "popular"], (old: ProjectDto[] | undefined) =>
                old ? old.map((p) => (p.id === updated.id ? updated : p)) : old
            );
            queryClient.setQueryData(["projects", id], updated);
        },
    });
}

export function useProjectById(id?: number | string) {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: () => fetchProjectById(id as string),
        enabled: Boolean(id),
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
