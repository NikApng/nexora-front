import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function GET() {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const items = await projectRepository.findByUser(userId);

    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim() ?? "";
    const language = body.language?.trim() || "TypeScript";
    const stack = Array.isArray(body.stack) ? body.stack.join(", ") : "Next.js, React";

    if (!name) {
        return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
    }

    const project = await projectRepository.createForUser(userId, {
        name,
        description,
        language,
        stack,
    });

    return NextResponse.json(project, { status: 201 });
}
