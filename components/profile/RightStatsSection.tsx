"use client";

import React from "react";

function RightStatsSection() {
    return (
        <aside className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="rounded-2xl bg-card p-6 border border-border shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Активность</h2>

                <div className="flex items-center justify-center h-40 text-muted-foreground">
                    <p className="text-sm opacity-70">
                        Здесь появятся графики активности
                    </p>
                </div>
            </div>

            <div className="rounded-2xl bg-card p-6 border border-border shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Статистика</h2>

                <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p className="text-sm opacity-70">
                        Здесь будет статистика задач и проектов
                    </p>
                </div>

            </div>

        </aside>
    );
}

export default RightStatsSection;
