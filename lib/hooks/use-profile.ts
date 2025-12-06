"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Profile {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}

async function fetchProfile(): Promise<Profile> {
    const res = await fetch("/api/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Не удалось загрузить профиль");
    }

    return res.json();
}

async function patchBio(bio: string): Promise<Profile> {
    const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.error || "Не удалось обновить био";
        throw new Error(message);
    }

    return res.json();
}

export function useProfile() {
    return useQuery<Profile>({
        queryKey: ["profile"],
        queryFn: fetchProfile,
    });
}

export function useUpdateBio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchBio,
        onSuccess: (data) => {
            queryClient.setQueryData(["profile"], data);
        },
    });
}
