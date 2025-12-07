import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { projectReactionRepository } from "@/lib/repositories/project-reaction.repository";

export async function GET() {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const totals = await projectReactionRepository.aggregateForUserProjects(userId);
    return NextResponse.json(totals);
}
