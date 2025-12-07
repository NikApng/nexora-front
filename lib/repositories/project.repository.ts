import { db } from "@/lib/db/connection";
import { projects, type Project, type NewProject } from "@/db/schema";
import { eq } from "drizzle-orm";

export class ProjectRepository {
    async findByUser(userId: number): Promise<Project[]> {
        return db
            .select()
            .from(projects)
            .where(eq(projects.userId, userId))
            .orderBy(projects.createdAt);
    }

    async createForUser(
        userId: number,
        data: Omit<NewProject, "id" | "userId" | "createdAt" | "updatedAt">
    ): Promise<Project> {
        const [project] = await db
            .insert(projects)
            .values({
                userId,
                ...data,
            })
            .returning();

        return project;
    }

    async deleteById(id: number) {
        await db.delete(projects).where(eq(projects.id, id));
    }
}


export const projectRepository = new ProjectRepository();
