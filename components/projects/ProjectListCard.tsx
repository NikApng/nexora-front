"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Code, ExternalLink, Eye, Star } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { useProjectReactions } from "@/lib/hooks/use-project-reactions";

interface ProjectListCardProps {
  id: number | string;
  name: string;
  description: string;
  language: string;
  stack: string[];
  updatedAt: string;
}

export function ProjectListCard({
  id,
  name,
  description,
  language,
  stack,
  updatedAt,
}: ProjectListCardProps) {
  const formattedDate = formatDateShort(updatedAt);
  const {
    data: reactions,
    isLoading,
    toggleStar,
    toggleWatch,
  } = useProjectReactions(id);

  const stars = reactions?.stars ?? 0;
  const watchers = reactions?.watchers ?? 0;
  const isStarred = reactions?.isStarred ?? false;
  const isWatching = reactions?.isWatching ?? false;

  return (
    <Link
      href={`/projects/${id}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all hover:border-border hover:shadow-md hover:bg-accent/50",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-lg font-semibold">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description || "Описание отсутствует"}
          </p>
        </div>
        <ExternalLink className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Tech Stack */}
      {stack && stack.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          {stack.slice(0, 5).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {stack.length > 5 && (
            <span className="text-xs text-muted-foreground">+{stack.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-4">
          {language && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-muted-foreground">{language}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleStar();
            }}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
              isStarred
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/60"
            )}
            aria-pressed={isStarred}
            disabled={isLoading}
          >
            <Star className="h-3.5 w-3.5" />
            {stars}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWatch();
            }}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
              isWatching
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent/60"
            )}
            aria-pressed={isWatching}
            disabled={isLoading}
          >
            <Eye className="h-3.5 w-3.5" />
            {watchers}
          </button>
        </div>
      </div>
    </Link>
  );
}
