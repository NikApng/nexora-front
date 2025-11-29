import React from "react";

const projects = [
    {
        id: 1,
        name: "Nexora CRM",
        description: "Внутренняя CRM для управления клиентами и задачами.",
        language: "TypeScript",
        stack: ["Next.js", "TailwindCSS"],
        updatedAt: "Обновлён 2 часа назад",
    },
    {
        id: 2,
        name: "Analytics Dashboard",
        description: "Дашборд с метриками и графиками для маркетинга.",
        language: "JavaScript",
        stack: ["React", "REST API"],
        updatedAt: "Обновлён вчера",
    },
    {
        id: 3,
        name: "Landing Builder",
        description: "Конструктор лендингов с готовыми блоками.",
        language: "TypeScript",
        stack: ["Next.js", "Zustand"],
        updatedAt: "Обновлён на этой неделе",
    },
];

function Page() {
    return (
        <main className="min-h-screen bg-slate-50 py-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:px-0">
                <section className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white">
                            N
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Никита
                            </h1>
                            <p className="text-sm text-slate-500">
                                Frontend-разработчик · Next.js / React / TypeScript
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Зарегистрирован: март 2024 · Последняя активность: сегодня
                            </p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-4 md:w-auto">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-slate-900">
                                {projects.length}
                            </div>
                            <div className="text-xs text-slate-500">Проектов</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-slate-900">5</div>
                            <div className="text-xs text-slate-500">Открытых задач</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-slate-900">12</div>
                            <div className="text-xs text-slate-500">Pull Request'ов</div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Проекты
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Список твоих последних проектов.
                                </p>
                            </div>
                            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                                Новый проект
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <div className="mb-1 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="#"
                                                className="text-sm font-semibold text-slate-900 hover:underline"
                                            >
                                                {project.name}
                                            </a>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {project.language}
                    </span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {project.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            {project.stack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                                                >
                          {tech}
                        </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400">
                      {project.updatedAt}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="flex flex-col gap-4">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                Активность
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex justify-between">
                                    <span>Сегодня</span>
                                    <span className="font-medium text-slate-900">
                    3 коммита
                  </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>За неделю</span>
                                    <span className="font-medium text-slate-900">
                    12 задач закрыто
                  </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Пулл-реквесты</span>
                                    <span className="font-medium text-slate-900">
                    4 открыто
                  </span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                Быстрые действия
                            </h3>
                            <div className="flex flex-col gap-2">
                                <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50">
                                    Перейти к задачам
                                </button>
                                <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50">
                                    Настройки профиля
                                </button>
                                <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50">
                                    Просмотреть все проекты
                                </button>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}

export default Page;
