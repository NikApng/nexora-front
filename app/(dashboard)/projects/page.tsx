"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import {usePopularProjects} from "@/lib/hooks/use-pojects";
import {ProjectCard} from "@/components/profile/projects/ProjectCard";



function Page() {

    const { data: projects = [] } = usePopularProjects();
    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto max-w-6xl px-4 lg:px-0">
                <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Популярные проекты
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Список популярных репозиториев по активности и количеству звёзд.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                        <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-xs font-medium">
                            <Button className="rounded-full  px-3 py-1 shadow-sm hover:bg-accent hover:text-accent-foreground">
                                Сегодня
                            </Button>
                            <Button className="rounded-full px-3 py-1 hover:bg-accent hover:text-accent-foreground">
                                Эта неделя
                            </Button>
                            <Button className="rounded-full px-3 py-1 hover:bg-accent hover:text-accent-foreground">
                                Этот месяц
                            </Button>
                        </div>

                        <div className="flex gap-2 text-xs">
                            <Button className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 hover:bg-accent hover:text-accent-foreground">
                                Язык: Все
                                <span className="text-muted-foreground">▼</span>
                            </Button>
                            <Button className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 hover:bg-accent hover:text-accent-foreground">
                                Сортировка: По звёздам
                                <span className="text-muted-foreground">▼</span>
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="flex flex-col gap-3">
                    {
                        projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    description={project.description}
                                    language={project.language}
                                    stack={project.stack}
                                    updatedAt={project.updatedAt}
                                />
                            ))
                    }
                </section>
            </div>
        </main>
    );
}

export default Page;
