import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/connection";
import { projects } from "@/db/schema";
import { projectReactionRepository } from "@/lib/repositories/project-reaction.repository";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

async function ensureProject(id: number) {
    const exists = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

    return exists.length > 0;
}

export async function GET(req: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
        return NextResponse.json({ error: "Некорректный id проекта" }, { status: 400 });
    }

    if (!(await ensureProject(projectId))) {
        return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    const watchers = await projectReactionRepository.listWatchers(projectId);
    return NextResponse.json(watchers);
}
