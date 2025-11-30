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
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
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
    if (diffDays === 0) {
      return "Сегодня";
    }
    if (diffDays === 1) {
      return "Завтра";
    }
    return `Через ${diffDays} дн.`;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      className={cn(
        "group cursor-move rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all",
        "hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5",
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
      <h3 className="mb-2 font-semibold text-slate-900 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="mb-3 text-sm text-slate-600 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-600">{task.assignee.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <User className="h-3 w-3" />
            <span>Не назначено</span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;

