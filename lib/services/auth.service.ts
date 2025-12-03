import bcrypt from "bcryptjs";
import { userRepository } from "@/lib/repositories/user.repository";
import type { User } from "@/db/schema";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {

  async register(data: RegisterData): Promise<Omit<User, "password">> {
    // Проверка существования пользователя
    const existingUser = await userRepository.existsByEmail(data.email);
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(credentials: LoginCredentials): Promise<Omit<User, "password"> | null> {
    // Поиск пользователя
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }


  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const authService = new AuthService();

