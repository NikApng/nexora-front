import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth/auth.config";
import { userRepository } from "@/lib/repositories/user.repository";

export async function GET() {
    const session = await getServerSession(authConfig);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const user = await userRepository.findById(userId);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authConfig);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);
        const body = await request.json();
        const bio = typeof body.bio === "string" ? body.bio.trim() : "";

        if (bio.length > 500) {
            return NextResponse.json(
                { error: "Био не должно быть длиннее 500 символов" },
                { status: 400 }
            );
        }

        const updatedUser = await userRepository.updateBio(userId, bio);

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Пользователь не найден" },
                { status: 404 }
            );
        }

        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json(
            { error: "Ошибка при обновлении профиля" },
            { status: 500 }
        );
    }
}
