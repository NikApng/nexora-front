import { db } from "@/lib/db/connection";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User, NewUser } from "@/db/schema";

export class UserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return results[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return results[0] || null;
  }
  async updateBio(id: number, bio: string): Promise<User | null> {
    const results = await db
        .update(users)
        .set({
          bio,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

    return results[0] || null;
  }


  async create(userData: Omit<NewUser, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const results = await db
      .insert(users)
      .values(userData)
      .returning();

    return results[0];
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}

export const userRepository = new UserRepository();

