"use client";

import React from "react";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "@/lib/types/task.types";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  count: number;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onAddTask?: () => void;
  isDraggedOver?: boolean;
}

const columnStyles = {
  todo: {
    headerBg: "bg-slate-50",
    headerText: "text-slate-700",
    border: "border-slate-200",
  },
  "in-progress": {
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    border: "border-blue-200",
  },
  review: {
    headerBg: "bg-purple-50",
    headerText: "text-purple-700",
    border: "border-purple-200",
  },
  done: {
    headerBg: "bg-green-50",
    headerText: "text-green-700",
    border: "border-green-200",
  },
};

function TaskColumn({
  status,
  title,
  tasks,
  count,
  onDragOver,
  onDrop,
  onDragStart,
  onAddTask,
  isDraggedOver = false,
}: TaskColumnProps) {
  const styles = columnStyles[status];

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-300px)] min-w-[320px] flex-col rounded-lg border-2 transition-all",
        styles.border,
        "bg-white shadow-sm",
        isDraggedOver && "border-dashed border-slate-400 bg-slate-50"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between rounded-t-lg px-4 py-3",
          styles.headerBg
        )}
      >
        <div className="flex items-center gap-2">
          <h2 className={cn("font-semibold", styles.headerText)}>{title}</h2>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
              styles.headerText,
              "bg-white/50"
            )}
          >
            {count}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onAddTask && (
            <button
              onClick={onAddTask}
              className={cn(
                "rounded p-1 transition hover:bg-white/50",
                styles.headerText
              )}
              aria-label="Добавить задачу"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            className={cn(
              "rounded p-1 transition hover:bg-white/50",
              styles.headerText
            )}
            aria-label="Дополнительные действия"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2.5">
          {tasks.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-sm text-slate-400">
              Нет задач
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={onDragStart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskColumn;

