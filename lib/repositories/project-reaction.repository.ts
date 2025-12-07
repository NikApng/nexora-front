import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db/connection";
import { projectReactions, projects, users } from "@/db/schema";

export type ReactionType = "star" | "watch";

export class ProjectReactionRepository {
    async toggle(projectId: number, userId: number, type: ReactionType) {
        const existing = await db
            .select({ id: projectReactions.id })
            .from(projectReactions)
            .where(
                and(
                    eq(projectReactions.projectId, projectId),
                    eq(projectReactions.userId, userId),
                    eq(projectReactions.type, type)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            await db
                .delete(projectReactions)
                .where(eq(projectReactions.id, existing[0].id));
            return { active: false };
        }

        await db.insert(projectReactions).values({
            projectId,
            userId,
            type,
            createdAt: new Date(),
        });
        return { active: true };
    }

    async getStats(projectId: number, userId?: number) {
        const [starsRow] = await db
            .select({ value: count() })
            .from(projectReactions)
            .where(
                and(
                    eq(projectReactions.projectId, projectId),
                    eq(projectReactions.type, "star")
                )
            );

        const [watchersRow] = await db
            .select({ value: count() })
            .from(projectReactions)
            .where(
                and(
                    eq(projectReactions.projectId, projectId),
                    eq(projectReactions.type, "watch")
                )
            );

        let isStarred = false;
        let isWatching = false;

        if (userId) {
            const userRows = await db
                .select({ type: projectReactions.type })
                .from(projectReactions)
                .where(
                    and(
                        eq(projectReactions.projectId, projectId),
                        eq(projectReactions.userId, userId)
                    )
                );

            isStarred = userRows.some((row) => row.type === "star");
            isWatching = userRows.some((row) => row.type === "watch");
        }

        return {
            stars: starsRow?.value ?? 0,
            watchers: watchersRow?.value ?? 0,
            isStarred,
            isWatching,
        };
    }

    async listWatchers(projectId: number) {
        return db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(projectReactions)
            .leftJoin(users, eq(projectReactions.userId, users.id))
            .where(
                and(
                    eq(projectReactions.projectId, projectId),
                    eq(projectReactions.type, "watch")
                )
            );
    }

    async aggregateForUserProjects(userId: number) {
        const [starsRow] = await db
            .select({ value: count() })
            .from(projectReactions)
            .leftJoin(projects, eq(projectReactions.projectId, projects.id))
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projectReactions.type, "star")
                )
            );

        const [watchersRow] = await db
            .select({ value: count() })
            .from(projectReactions)
            .leftJoin(projects, eq(projectReactions.projectId, projects.id))
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projectReactions.type, "watch")
                )
            );

        return {
            stars: starsRow?.value ?? 0,
            watchers: watchersRow?.value ?? 0,
        };
    }
}

export const projectReactionRepository = new ProjectReactionRepository();
