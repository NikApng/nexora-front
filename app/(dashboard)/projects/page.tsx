import React from "react";
import {Button} from "@/components/ui/button";

const projects = [
    {
        id: 1,
        name: "nexora/nexora-front",
        description: "Панель управления проектами и задачами для команд.",
        language: "TypeScript",
        stars: 1243,
        forks: 87,
        starsToday: 32,
        tags: ["Next.js", "Dashboard", "Team"],
        updatedAt: "Обновлён 2 часа назад",
    },
    {
        id: 2,
        name: "nexora/analytics-kit",
        description: "Набор инструментов для продуктовой и маркетинговой аналитики.",
        language: "JavaScript",
        stars: 854,
        forks: 41,
        starsToday: 18,
        tags: ["Analytics", "Charts", "React"],
        updatedAt: "Обновлён сегодня",
    },
    {
        id: 3,
        name: "nexora/ui-library",
        description: "Единая дизайн-система и UI-кит для внутренних продуктов.",
        language: "TypeScript",
        stars: 532,
        forks: 29,
        starsToday: 7,
        tags: ["Design System", "UI", "Components"],
        updatedAt: "Обновлён вчера",
    },
    {
        id: 4,
        name: "nexora/automation-scripts",
        description: "Скрипты для автоматизации рутинных задач разработки.",
        language: "Python",
        stars: 391,
        forks: 15,
        starsToday: 3,
        tags: ["Automation", "DevTools"],
        updatedAt: "Обновлён на этой неделе",
    },
];

function Page() {
    return (
        <main className="min-h-screen bg-slate-50 py-8">
            <div className="mx-auto max-w-6xl px-4 lg:px-0">
                <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Популярные проекты
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Список популярных репозиториев по активности и количеству звёзд.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-700">
                            <Button className="rounded-full bg-white px-3 py-1 shadow-sm">
                                Сегодня
                            </Button>
                            <Button className="rounded-full px-3 py-1 hover:bg-white/70">
                                Эта неделя
                            </Button>
                            <Button className="rounded-full px-3 py-1 hover:bg-white/70">
                                Этот месяц
                            </Button>
                        </div>

                        <div className="flex gap-2 text-xs">
                            <Button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50">
                                Язык: Все
                                <span className="text-slate-400">▼</span>
                            </Button>
                            <Button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50">
                                Сортировка: По звёздам
                                <span className="text-slate-400">▼</span>
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="flex flex-col gap-3">
                    {projects.map((project) => (
                        <article
                            key={project.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            <div className="mb-1 flex items-center justify-between gap-3">
                                <a
                                    href="#"
                                    className="text-sm font-semibold text-slate-900 hover:underline"
                                >
                                    {project.name}
                                </a>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {project.language}
                </span>
                            </div>

                            <p className="text-sm text-slate-600">{project.description}</p>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    ★
                    <span className="font-medium text-slate-800">
                      {project.stars}
                    </span>
                  </span>
                                    <span className="inline-flex items-center gap-1">
                   ⑂
                    <span className="font-medium text-slate-800">
                      {project.forks}
                    </span>
                  </span>
                                    <span className="inline-flex items-center gap-1">
                    Сегодня
                    <span className="font-medium text-slate-800">
                      +{project.starsToday}
                    </span>
                  </span>
                                    <span className="hidden text-slate-400 sm:inline">
                    · {project.updatedAt}
                  </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-2 text-xs text-slate-400 sm:hidden">
                                {project.updatedAt}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}

export default Page;
