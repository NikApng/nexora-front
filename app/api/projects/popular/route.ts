import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const rows = await db
            .select()
            .from(projects)
            .orderBy(desc(projects.createdAt))
            .limit(50); // пока просто топ-50 по дате

        // Нормализуем ответ (на всякий случай)
        const result = rows.map((p) => ({
            id: p.id,
            userId: p.userId,
            name: p.name,
            description: p.description ?? "",
            language: p.language,
            stack: p.stack,
            code: p.code,
            codeFilename: p.codeFilename,
            codeStructure: p.codeStructure,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching popular projects:", error);
        return NextResponse.json(
            { error: "Не удалось загрузить популярные проекты" },
            { status: 500 }
        );
    }
}
