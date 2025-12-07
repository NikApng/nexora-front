"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePopularProjects, type ProjectDto } from "@/lib/hooks/use-pojects";
import { ProjectListCard } from "@/components/projects/ProjectListCard";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

type TimeFilter = "today" | "week" | "month" | "all";
type SortOption = "stars" | "updated" | "name";

const languages = [
  "Все",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "PHP",
  "Ruby",
];

function Page() {
  const { data: projects = [], isLoading } = usePopularProjects();
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("Все");
  const [sortOption, setSortOption] = useState<SortOption>("updated");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Адаптация проектов
  const adaptedProjects = useMemo(() => {
    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      language: p.language,
      stack: Array.isArray(p.stack)
        ? p.stack
        : typeof p.stack === "string"
        ? p.stack.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      code: p.code ?? "",
      codeFilename: p.codeFilename ?? "",
      codeStructure: p.codeStructure ?? "",
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
    }));
  }, [projects]);

  // Фильтрация по времени
  const filteredByTime = useMemo(() => {
    if (timeFilter === "all") return adaptedProjects;

    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }

    return adaptedProjects.filter((project) => {
      const updatedDate = new Date(project.updatedAt);
      return updatedDate >= filterDate;
    });
  }, [adaptedProjects, timeFilter]);

  // Фильтрация по языку
  const filteredByLanguage = useMemo(() => {
    if (languageFilter === "Все") return filteredByTime;
    return filteredByTime.filter(
      (project) => project.language.toLowerCase() === languageFilter.toLowerCase()
    );
  }, [filteredByTime, languageFilter]);

  // Сортировка
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredByLanguage];

    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "updated":
        return sorted.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "stars":
        // Если нет поля stars, сортируем по обновлению
        return sorted.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return sorted;
    }
  }, [filteredByLanguage, sortOption]);

  const formatTimeFilter = (filter: TimeFilter) => {
    const labels = {
      today: "Сегодня",
      week: "Эта неделя",
      month: "Этот месяц",
      all: "Все время",
    };
    return labels[filter] || filter;
  };

  const formatSortOption = (option: SortOption) => {
    const labels = {
      stars: "По звёздам",
      updated: "По обновлению",
      name: "По названию",
    };
    return labels[option] || option;
  };

  return (
    <main className="min-h-screen bg-background py-8 text-foreground">
      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Проекты
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Список всех проектов пользователей платформы
            </p>
          </div>
          <Link href="/profile">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Создать проект
            </Button>
          </Link>
        </header>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Time Filter */}
          <div className="flex items-center gap-1 rounded-full bg-card p-1 shadow-sm border border-border">
            {(["today", "week", "month", "all"] as TimeFilter[]).map((filter) => (
              <Button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                variant={timeFilter === filter ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-4 py-1.5 text-xs font-medium"
              >
                {formatTimeFilter(filter)}
              </Button>
            ))}
          </div>

          {/* Language and Sort Filters */}
          <div className="flex items-center gap-2">
            {/* Language Filter */}
            <div className="relative">
              <Button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowSortDropdown(false);
                }}
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
              >
                Язык: {languageFilter}
                <span className="text-muted-foreground">▼</span>
              </Button>
              {showLanguageDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg">
                  <div className="max-h-60 overflow-y-auto p-1">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguageFilter(lang);
                          setShowLanguageDropdown(false);
                        }}
                        className={`
                          w-full rounded-md px-3 py-2 text-left text-xs transition-colors
                          ${
                            languageFilter === lang
                              ? "bg-accent font-medium"
                              : "text-foreground hover:bg-accent"
                          }
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <Button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowLanguageDropdown(false);
                }}
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
              >
                Сортировка: {formatSortOption(sortOption)}
                <span className="text-muted-foreground">▼</span>
              </Button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg">
                  <div className="p-1">
                    {(["stars", "updated", "name"] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setShowSortDropdown(false);
                        }}
                        className={`
                          w-full rounded-md px-3 py-2 text-left text-xs transition-colors
                          ${
                            sortOption === option
                              ? "bg-accent font-medium"
                              : "text-foreground hover:bg-accent"
                          }
                        `}
                      >
                        {formatSortOption(option)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Найдено проектов:{" "}
            <span className="font-semibold text-foreground">
              {sortedProjects.length}
            </span>
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {languageFilter !== "Все" || timeFilter !== "all"
                ? "Проекты не найдены по выбранным фильтрам"
                : "Проекты пока отсутствуют"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <ProjectListCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                language={project.language}
                stack={project.stack}
                updatedAt={project.updatedAt}
              />
            ))}
          </div>
        )}

        {/* Click outside to close dropdowns */}
        {(showLanguageDropdown || showSortDropdown) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowLanguageDropdown(false);
              setShowSortDropdown(false);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default Page;
