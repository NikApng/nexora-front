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

const columnStyles: Record<
    TaskStatus,
    { headerBg: string; headerText: string; border: string }
> = {
  todo: {
    headerBg: "bg-muted",
    headerText: "text-foreground",
    border: "border-border",
  },
  "in-progress": {
    headerBg: "bg-blue-50 dark:bg-blue-950",
    headerText: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-700",
  },
  review: {
    headerBg: "bg-purple-50 dark:bg-purple-950",
    headerText: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-700",
  },
  done: {
    headerBg: "bg-green-50 dark:bg-green-950",
    headerText: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-700",
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
              "flex h-[calc(100vh-300px)] min-w-[320px] flex-col rounded-lg border-2 bg-card text-foreground shadow-sm transition-all",
              styles.border,
              isDraggedOver && "border-dashed border-accent bg-accent/20"
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
                    "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold bg-background/70",
                    styles.headerText
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
                        "rounded p-1 transition hover:bg-background/60",
                        styles.headerText
                    )}
                    aria-label="Добавить задачу"
                >
                  <Plus className="h-4 w-4" />
                </button>
            )}
            <button
                className={cn(
                    "rounded p-1 transition hover:bg-background/60",
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
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground bg-background/40">
                  Нет задач
                </div>
            ) : (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
                ))
            )}
          </div>
        </div>
      </div>
  );
}

export default TaskColumn;
