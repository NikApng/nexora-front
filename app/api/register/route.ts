import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validations/auth.validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await authService.register(validatedData.data);

    return NextResponse.json(
      {
        message: "Пользователь успешно зарегистрирован",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Обработка ошибок от сервиса
    if (error instanceof Error) {
      const statusCode = error.message.includes("уже существует") ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status: statusCode });
    }

    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
}

