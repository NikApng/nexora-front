"use client";

import React, { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Activity,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Eye,
    FileCode2,
    GitFork,
    Layers,
    Link as LinkIcon,
    Code2,
    ShieldCheck,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDateShort } from "@/lib/utils";
import { useProjectById, useUpdateProject } from "@/lib/hooks/use-pojects";
import { useProjectReactions, useProjectWatchers } from "@/lib/hooks/use-project-reactions";
import { FolderOpen } from "lucide-react";

type Tab = "overview" | "activity";

type TreeNode = {
    name: string;
    children?: TreeNode[];
    isFile?: boolean;
};

function buildTree(paths: string[]): TreeNode[] {
    const root: Record<string, TreeNode> = {};

    paths.forEach((fullPath) => {
        const parts = fullPath.split("/").filter(Boolean);
        let current = root;
        parts.forEach((part, idx) => {
            if (!current[part]) {
                current[part] = { name: part, children: [] };
            }
            if (idx === parts.length - 1) {
                current[part].isFile = true;
            }
            if (!current[part].children) current[part].children = [];
            current = current[part].children as any;
        });
    });

    const toArray = (node: Record<string, TreeNode>): TreeNode[] =>
        Object.values(node).map((n) => ({
            ...n,
            children: n.children && n.children.length ? toArray(n.children as any) : [],
        }));

    return toArray(root);
}

function renderTree(nodes: TreeNode[], depth = 0): React.ReactNode {
    return nodes.map((node) => (
        <div key={`${depth}-${node.name}`} className="pl-2">
            <div className={cn("flex items-center gap-2 text-xs", node.isFile ? "text-foreground" : "text-muted-foreground font-semibold")}>
                {node.isFile ? "📄" : "📁"}
                <span>{node.name}</span>
            </div>
            {node.children && node.children.length > 0 && (
                <div className="pl-4 border-l border-border/60 ml-1 my-1">
                    {renderTree(node.children, depth + 1)}
                </div>
            )}
        </div>
    ));
}

function Page() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const projectId = params?.id;

    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const {
        data: project,
        isLoading,
        error,
    } = useProjectById(projectId);

    const stackList = useMemo(() => {
        if (!project?.stack) return [];
        if (Array.isArray(project.stack)) {
            return project.stack;
        }

        return project.stack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }, [project]);

    const {
        data: reactions,
        isLoading: isReactionsLoading,
        toggleStar,
        toggleWatch,
    } = useProjectReactions(projectId);

    const { data: watchersList = [] } = useProjectWatchers(projectId);
    const updateProject = useUpdateProject(projectId);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const folderInputRef = useRef<HTMLInputElement | null>(null);

    const handleFilesUpload = async (fileList: FileList | null) => {
        if (!fileList || !projectId) return;
        const files = Array.from(fileList);
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        const maxBytes = 1_000 * 1024; // ~1MB

        if (totalSize > maxBytes) {
            alert("Папка или файлы слишком большие (макс ~1MB)");
            return;
        }

        try {
            const contents = await Promise.all(
                files.map(
                    (file) =>
                        new Promise<{ path: string; text: string; size: number }>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) =>
                                resolve({
                                    path: (file as any).webkitRelativePath || file.name,
                                    text: e.target?.result?.toString() ?? "",
                                    size: file.size,
                                });
                            reader.onerror = () => reject(new Error("read error"));
                            reader.readAsText(file);
                        })
                )
            );

            const combined = contents
                .map((item) => `// File: ${item.path}\n${item.text}`)
                .join("\n\n");

            const folderName = (files[0] as any).webkitRelativePath
                ? (files[0] as any).webkitRelativePath.split("/")[0] || "folder"
                : files[0].name;

            updateProject.mutate({
                code: combined,
                codeFilename: folderName,
                codeStructure: JSON.stringify(contents.map(({ path, size }) => ({ path, size }))),
            });
        } catch (e) {
            alert("Не удалось прочитать файлы");
        }
    };

    const stars = reactions?.stars ?? 0;
    const watchers = reactions?.watchers ?? 0;
    const isStarred = reactions?.isStarred ?? false;
    const isWatching = reactions?.isWatching ?? false;
    const forks = 0;

    const ownerName =
        project?.owner?.name ||
        project?.owner?.email ||
        "Автор проекта";
    const ownerInitial =
        ownerName?.trim().charAt(0).toUpperCase() || "U";

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background py-8 text-foreground">
                <div className="mx-auto max-w-6xl space-y-4 px-4 lg:px-0">
                    <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
                    <div className="h-52 animate-pulse rounded-2xl bg-card" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="h-28 animate-pulse rounded-xl bg-card" />
                        <div className="h-28 animate-pulse rounded-xl bg-card" />
                        <div className="h-28 animate-pulse rounded-xl bg-card" />
                    </div>
                    <div className="h-96 animate-pulse rounded-2xl bg-card" />
                </div>
            </main>
        );
    }

    if (error || !project) {
        const message =
            error instanceof Error
                ? error.message
                : "Проект не найден или недоступен";
        return (
            <main className="min-h-screen bg-background py-12 text-foreground">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-destructive/10 px-3 py-1 text-sm text-destructive">
                        Ошибка загрузки
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold">
                        Не удалось открыть проект
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {message}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Button variant="outline" onClick={() => router.push("/projects")}>
                            <ArrowLeft className="h-4 w-4" />
                            Вернуться к списку
                        </Button>
                        <Button onClick={() => router.refresh()}>
                            Повторить попытку
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background py-8 text-foreground">
            <div className="mx-auto max-w-6xl space-y-6 px-4 lg:px-0">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/projects")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        К проектам
                    </Button>
                    <span className="text-muted-foreground">Популярные проекты сообщества</span>
                </div>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                                {ownerInitial}
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-xs text-muted-foreground">Автор</p>
                                    <span className="text-sm font-medium">{ownerName}</span>
                                    <span className="text-xs text-muted-foreground">/</span>
                                    <h1 className="text-xl font-semibold">{project.name}</h1>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-2xl">
                                    {project.description || "Описание пока пустует — самое время оформить README."}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        Обновлён {formatDateShort(project.updatedAt)}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                                        <Layers className="h-3.5 w-3.5" />
                                        {stackList.length || 1} модулей
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {project.language}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant={isStarred ? "default" : "outline"}
                                size="sm"
                                onClick={toggleStar}
                                disabled={isReactionsLoading}
                            >
                                <Star className="h-4 w-4" />
                                {isStarred ? "Starred" : "Star"}
                                <span className="rounded bg-background/60 px-2 py-0.5 text-xs">
                                    {stars}
                                </span>
                            </Button>
                            <Button
                                variant={isWatching ? "default" : "outline"}
                                size="sm"
                                onClick={toggleWatch}
                                disabled={isReactionsLoading}
                            >
                                <Eye className="h-4 w-4" />
                                Watch
                                <span className="rounded bg-background/60 px-2 py-0.5 text-xs">
                                    {watchers}
                                </span>
                            </Button>
                            <Button variant="outline" size="sm">
                                <GitFork className="h-4 w-4" />
                                Fork
                                <span className="rounded bg-background/60 px-2 py-0.5 text-xs">
                                    {forks}
                                </span>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card/60 p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4" />
                            Социальные реакции
                        </div>
                        <p className="mt-2 text-2xl font-semibold">{stars}</p>
                        <p className="text-xs text-muted-foreground">Люди, которые отметили проект</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card/60 p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Подписчики
                        </div>
                        <p className="mt-2 text-2xl font-semibold">{watchers}</p>
                        <p className="text-xs text-muted-foreground">Следят за обновлениями</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card/60 p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            Активность
                        </div>
                        <p className="mt-2 text-2xl font-semibold">{forks}</p>
                        <p className="text-xs text-muted-foreground">Ответвления и эксперименты</p>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={activeTab === "overview" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab("overview")}
                            >
                                <FileCode2 className="h-4 w-4" />
                                Обзор
                            </Button>
                            <Button
                                variant={activeTab === "activity" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab("activity")}
                            >
                                <Activity className="h-4 w-4" />
                                Активность
                            </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
              ID проекта: {project.id}
            </span>
                    </div>

                    {activeTab === "overview" ? (
                        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="rounded-xl border border-border bg-background/50 p-4">
                                    <div className="flex items-center gap-2">
                                        <FileCode2 className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-semibold">Описание проекта</p>
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {project.description ||
                                            "Добавьте сюда ключевые идеи, ссылки на деплой и заметки по запуску — как README."}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {stackList.length > 0 ? (
                                            stackList.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                                >
                                                    {tech}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Стек не указан</span>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border bg-background/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code2 className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-semibold">Загруженный проект</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {project.codeFilename && (
                                                <span className="text-xs text-muted-foreground">
                                                    {project.codeFilename}
                                                </span>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={updateProject.isPending}
                                            >
                                                Добавить файлы
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => folderInputRef.current?.click()}
                                                disabled={updateProject.isPending}
                                            >
                                                Добавить папку
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".ts,.tsx,.js,.jsx,.json,.md,.txt,.yaml,.yml,.css,.scss,.html,.py,.go,.rs,.java,.kt,.php,.rb,.c,.cpp,.cs,.swift,.mjs"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    handleFilesUpload(
                                                            file ? ({ 0: file, length: 1, item: (idx: number) => (idx === 0 ? file : null) } as any as FileList) : null
                                                    );
                                                    e.target.value = "";
                                                }}
                                            />
                                            <input
                                                ref={folderInputRef}
                                                type="file"
                                                className="hidden"
                                                multiple
                                                //@ts-expect-error webkitdirectory поддерживается браузером
                                                webkitdirectory="true"
                                                directory=""
                                                onChange={(e) => {
                                                    handleFilesUpload(e.target.files);
                                                    e.target.value = "";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {project.codeStructure && (
                                        <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                                                <FolderOpen className="h-3.5 w-3.5" />
                                                Структура
                                            </div>
                                            <div className="space-y-1">
                                                {renderTree(
                                                    (() => {
                                                        try {
                                                            const parsed = JSON.parse(project.codeStructure || "[]") as Array<{ path: string }>;
                                                            return buildTree(parsed.map((f) => f.path));
                                                        } catch {
                                                            return [];
                                                        }
                                                    })()
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {project.code ? (
                                        <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg bg-muted/70 p-3 text-xs leading-relaxed whitespace-pre-wrap">
                                            {project.code}
                                        </pre>
                                    ) : (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Код не загружен. Добавьте его при создании или редактировании проекта.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <aside className="space-y-3">
                                <div className="rounded-xl border border-border bg-background/60 p-4">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-semibold">Автор</p>
                                    </div>
                                    <p className="mt-2 text-sm font-medium">{ownerName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {project.owner?.bio || "Описание автора пока пустое"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                                            <Clock className="h-3 w-3" />
                                            С {formatDateShort(project.owner?.createdAt)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Проверенный участник
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border bg-background/60 p-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-semibold">Статус</p>
                                    </div>
                                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        <li>• Создан: {formatDateShort(project.createdAt)}</li>
                                        <li>• Последнее обновление: {formatDateShort(project.updatedAt)}</li>
                                        <li>• Основной язык: {project.language}</li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-border bg-background/60 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-semibold">Подписчики</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{watchersList.length}</span>
                                    </div>
                                    {watchersList.length === 0 ? (
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            Пока никто не следит за обновлениями.
                                        </p>
                                    ) : (
                                        <div className="mt-3 space-y-2">
                                            {watchersList.map((w, index) => (
                                                <div
                                                    key={w.id ?? `${project.id}-watcher-${index}`}
                                                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                            {(w.name || w.email || "U").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {w.name || w.email || "Без имени"}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {w.email || "—"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        с {formatDateShort(w.createdAt)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                            <div className="rounded-xl border border-border bg-background/50 p-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-semibold">Активность проекта</p>
                                </div>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                        <div>
                                            <p className="text-sm font-medium">Последний коммит</p>
                                            <p className="text-xs text-muted-foreground">
                                                Обновлено {formatDateShort(project.updatedAt)} — синхронизированы основные файлы
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                                        <div>
                                            <p className="text-sm font-medium">Ветка main стабильна</p>
                                            <p className="text-xs text-muted-foreground">
                                                Следите за релизами через подписку на обновления
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                                        <div>
                                            <p className="text-sm font-medium">README</p>
                                            <p className="text-xs text-muted-foreground">
                                                Оформите гайды по запуску и вкладчикам — как на GitHub
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-border bg-background/50 p-4">
                                <div className="flex items-center gap-2">
                                    <GitFork className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-semibold">История</p>
                                </div>
                                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Создан</span>
                                        <span>{formatDateShort(project.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Последний push</span>
                                        <span>{formatDateShort(project.updatedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Технологий в стеке</span>
                                        <span>{stackList.length || 1}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Подписчики</span>
                                        <span>{watchers}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Page;
