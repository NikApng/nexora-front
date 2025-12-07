import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { db } from "@/lib/db/connection";
import { projects } from "@/db/schema";
import {
    projectReactionRepository,
    type ReactionType,
} from "@/lib/repositories/project-reaction.repository";

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

    const session = await getServerSession(authConfig);
    const userId = session?.user?.id ? Number(session.user.id) : undefined;

    const stats = await projectReactionRepository.getStats(projectId, userId);
    return NextResponse.json(stats);
}

export async function POST(req: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
        return NextResponse.json({ error: "Некорректный id проекта" }, { status: 400 });
    }

    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (!(await ensureProject(projectId))) {
        return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const type = body?.type as ReactionType | undefined;

    if (type !== "star" && type !== "watch") {
        return NextResponse.json({ error: "Некорректный тип реакции" }, { status: 400 });
    }

    const userId = Number(session.user.id);
    await projectReactionRepository.toggle(projectId, userId, type);

    const stats = await projectReactionRepository.getStats(projectId, userId);
    return NextResponse.json(stats);
}
