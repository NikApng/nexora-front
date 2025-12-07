"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ReactionType = "star" | "watch";

export type ProjectReactionsDto = {
    stars: number;
    watchers: number;
    isStarred: boolean;
    isWatching: boolean;
};

export type WatcherDto = {
    id: number;
    name: string | null;
    email: string | null;
    createdAt: string | Date | null;
};

async function fetchProjectReactions(projectId?: number | string): Promise<ProjectReactionsDto> {
    if (!projectId) throw new Error("Проект не найден");

    const res = await fetch(`/api/projects/${projectId}/reactions`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось загрузить реакции");
    }

    return res.json();
}

async function toggleProjectReaction(
    projectId: number | string,
    type: ReactionType
): Promise<ProjectReactionsDto> {
    const res = await fetch(`/api/projects/${projectId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось обновить реакцию");
    }

    return res.json();
}

async function fetchProjectWatchers(projectId?: number | string): Promise<WatcherDto[]> {
    if (!projectId) throw new Error("Проект не найден");

    const res = await fetch(`/api/projects/${projectId}/watchers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось загрузить подписчиков");
    }

    return res.json();
}

async function fetchProfileReactions(): Promise<{ stars: number; watchers: number }> {
    const res = await fetch("/api/profile/reactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (res.status === 401) {
        return { stars: 0, watchers: 0 };
    }

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось загрузить реакции профиля");
    }

    return res.json();
}

export function useProjectReactions(projectId?: number | string) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["project-reactions", projectId],
        queryFn: () => fetchProjectReactions(projectId),
        enabled: Boolean(projectId),
    });

    const { mutate: toggleStar, isPending: isStarUpdating } = useMutation({
        mutationFn: () => toggleProjectReaction(projectId as string, "star"),
        onSuccess: (payload) => {
            queryClient.setQueryData(["project-reactions", projectId], payload);
            queryClient.invalidateQueries({ queryKey: ["profile-reactions"] });
            queryClient.invalidateQueries({ queryKey: ["project-watchers", projectId] });
        },
    });

    const { mutate: toggleWatch, isPending: isWatchUpdating } = useMutation({
        mutationFn: () => toggleProjectReaction(projectId as string, "watch"),
        onSuccess: (payload) => {
            queryClient.setQueryData(["project-reactions", projectId], payload);
            queryClient.invalidateQueries({ queryKey: ["profile-reactions"] });
            queryClient.invalidateQueries({ queryKey: ["project-watchers", projectId] });
        },
    });

    return {
        data,
        isLoading,
        error,
        toggleStar,
        toggleWatch,
        isUpdating: isStarUpdating || isWatchUpdating,
    };
}

export function useProjectWatchers(projectId?: number | string) {
    return useQuery({
        queryKey: ["project-watchers", projectId],
        queryFn: () => fetchProjectWatchers(projectId),
        enabled: Boolean(projectId),
    });
}

export function useProfileReactions() {
    return useQuery({
        queryKey: ["profile-reactions"],
        queryFn: fetchProfileReactions,
    });
}
