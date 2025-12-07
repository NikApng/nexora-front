import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/db/schema";
import { db } from "@/lib/db/connection";
import { eq } from "drizzle-orm";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

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
