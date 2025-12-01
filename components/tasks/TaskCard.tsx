"use client";

import React from "react";
import { Task } from "@/lib/types/task.types";
import { Clock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onClick?: () => void;
}

const priorityColors = {
  low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700",
  medium:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-700",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-700",
  critical:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-700",
};

function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  const formatDate = (date: Date) => {
    const today = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Просрочено ${Math.abs(diffDays)} дн.`;
    }
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Завтра";
    return `Через ${diffDays} дн.`;
  };

  return (
      <div
          draggable
          onDragStart={(e) => onDragStart(e, task)}
          onClick={onClick}
          className={cn(
              "group cursor-move rounded-lg border bg-card p-3 shadow-sm transition-all",
              "border-border hover:border-accent hover:bg-accent/40 hover:shadow-md hover:-translate-y-0.5",
              "active:opacity-50"
          )}
      >
        {/* Priority Badge */}
        <div className="mb-2 flex items-start justify-between gap-2">
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                priorityColors[task.priority]
            )}
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          {task.priority === "critical"
              ? "Критично"
              : task.priority === "high"
                  ? "Высокий"
                  : task.priority === "medium"
                      ? "Средний"
                      : "Низкий"}
        </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-semibold text-foreground line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
        )}

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {task.labels.map((label, index) => (
                  <span
                      key={index}
                      className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
              {label}
            </span>
              ))}
            </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
          {task.assignee ? (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">
              {task.assignee.name}
            </span>
              </div>
          ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Не назначено</span>
              </div>
          )}

          {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
          )}
        </div>
      </div>
  );
}

export default TaskCard;
