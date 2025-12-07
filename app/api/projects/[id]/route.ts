import { NextRequest, NextResponse } from "next/server";
import { projects, users } from "@/db/schema";
import { db } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { projectRepository } from "@/lib/repositories/project.repository";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const projectId = Number(id);

        if (Number.isNaN(projectId)) {
            return NextResponse.json(
                { error: "Некорректный id проекта" },
                { status: 400 }
            );
        }

        const [row] = await db
            .select({
                id: projects.id,
                userId: projects.userId,
                name: projects.name,
                description: projects.description,
                language: projects.language,
                stack: projects.stack,
                code: projects.code,
                codeFilename: projects.codeFilename,
                codeStructure: projects.codeStructure,
                createdAt: projects.createdAt,
                updatedAt: projects.updatedAt,
                ownerId: users.id,
                ownerName: users.name,
                ownerEmail: users.email,
                ownerBio: users.bio,
                ownerCreatedAt: users.createdAt,
            })
            .from(projects)
            .leftJoin(users, eq(projects.userId, users.id))
            .where(eq(projects.id, projectId))
            .limit(1);

        if (!row) {
            return NextResponse.json(
                { error: "Проект не найден" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: row.id,
            userId: row.userId,
            name: row.name,
            description: row.description,
            language: row.language,
            stack: row.stack,
            code: row.code,
            codeFilename: row.codeFilename,
            codeStructure: row.codeStructure,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            owner: row.ownerId
                ? {
                    id: row.ownerId,
                    name: row.ownerName,
                    email: row.ownerEmail,
                    bio: row.ownerBio,
                    createdAt: row.ownerCreatedAt,
                }
                : null,
        });
    } catch (error) {
        console.error("Ошибка при получении проекта:", error);
        return NextResponse.json(
            { error: "Не удалось загрузить проект" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
    try {

        const { id } = await context.params;
        const projectId = Number(id);

        if (Number.isNaN(projectId)) {
            return NextResponse.json(
                { error: "Некорректный id проекта" },
                { status: 400 }
            );
        }

        const result = await db
            .delete(projects)
            .where(eq(projects.id, projectId));

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Ошибка при удалении проекта:", error);
        return NextResponse.json(
            { error: "Не удалось удалить проект" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await context.params;
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
        return NextResponse.json({ error: "Некорректный id проекта" }, { status: 400 });
    }

    const existing = await projectRepository.findById(projectId);
    if (!existing) {
        return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
    }

    if (existing.userId !== Number(session.user.id)) {
        return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code : undefined;
    const codeFilename =
        typeof body.codeFilename === "string" ? body.codeFilename : undefined;
    const codeStructure =
        typeof body.codeStructure === "string" ? body.codeStructure : undefined;
    const description =
        typeof body.description === "string" ? body.description.trim() : undefined;

    const updated = await projectRepository.updateForUser(projectId, existing.userId, {
        code,
        codeFilename,
        codeStructure,
        description,
    });

    return NextResponse.json(updated);
}
