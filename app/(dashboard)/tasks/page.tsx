"use client";

import React, { useState, useCallback } from "react";
import TaskColumn from "@/components/tasks/TaskColumn";
import { Task, TaskStatus } from "@/lib/types/task.types";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Моковые данные для примера
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Создать дизайн системы задач",
    description:
      "Разработать UI/UX для системы управления задачами в стиле Jira",
    status: "todo",
    priority: "high",
    assignee: {
      id: "1",
      name: "Никита",
    },
    labels: ["Дизайн", "UI/UX"],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Реализовать API для задач",
    description: "Создать endpoints для CRUD операций с задачами",
    status: "in-progress",
    priority: "critical",
    assignee: {
      id: "2",
      name: "Анна",
    },
    labels: ["Backend", "API"],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Написать тесты для компонентов",
    description: "Покрыть тестами все UI компоненты",
    status: "review",
    priority: "medium",
    labels: ["Тестирование"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Настроить CI/CD пайплайн",
    description: "Автоматизировать деплой приложения",
    status: "done",
    priority: "low",
    assignee: {
      id: "1",
      name: "Никита",
    },
    labels: ["DevOps"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Оптимизировать производительность",
    description: "Улучшить скорость загрузки страниц",
    status: "todo",
    priority: "medium",
    labels: ["Оптимизация"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Добавить фильтры и поиск",
    description: "Реализовать фильтрацию задач по различным критериям",
    status: "in-progress",
    priority: "high",
    assignee: {
      id: "2",
      name: "Анна",
    },
    labels: ["Функционал"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const columns = [
  { id: "todo" as TaskStatus, title: "К выполнению" },
  { id: "in-progress" as TaskStatus, title: "В работе" },
  { id: "review" as TaskStatus, title: "На проверке" },
  { id: "done" as TaskStatus, title: "Готово" },
];

function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Группировка задач по статусам
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // Фильтрация задач по поисковому запросу
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.assignee?.name.toLowerCase().includes(query) ||
      task.labels?.some((label) => label.toLowerCase().includes(query))
    );
  });

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverColumn(status);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, newStatus: TaskStatus) => {
      e.preventDefault();
      if (!draggedTask) return;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id
            ? { ...task, status: newStatus, updatedAt: new Date() }
            : task
        )
      );

      setDraggedTask(null);
      setDraggedOverColumn(null);
    },
    [draggedTask]
  );

  const handleAddTask = (status: TaskStatus) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "Новая задача",
      description: "",
      status: status,
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[calc(100vw-2rem)] px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Задачи</h1>
            <p className="mt-1 text-sm text-slate-500">
              Управление проектами и задачами
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Создать задачу
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div
                key={column.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="text-sm text-slate-500">{column.title}</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {columnTasks.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4">
            {columns.map((column) => {
              const columnTasks = searchQuery
                ? filteredTasks.filter((task) => task.status === column.id)
                : getTasksByStatus(column.id);
              return (
                <TaskColumn
                  key={column.id}
                  status={column.id}
                  title={column.title}
                  tasks={columnTasks}
                  count={columnTasks.length}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                  onAddTask={() => handleAddTask(column.id)}
                  isDraggedOver={draggedOverColumn === column.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
