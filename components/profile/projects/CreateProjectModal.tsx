"use client";

import React from "react";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
export type CreateProjectFormValues = {
    name: string;
    description: string;
    language: string;
    stackText: string;
    code: string;
    codeFilename?: string | null;
    codeStructure?: string | null;
};
type CreateProjectModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: CreateProjectFormValues) => void;
};

function CreateProjectModal({open, onClose, onSubmit}: CreateProjectModalProps) {
    if (!open) return null;
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [language, setLanguage] = React.useState("")
    const [stackText, setStackText] = React.useState("")
    const [code, setCode] = React.useState("")
    const [codeFileName, setCodeFileName] = React.useState<string | null>(null)
    const [codeError, setCodeError] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement | null>(null)
    const folderInputRef = React.useRef<HTMLInputElement | null>(null)
    const [codeStructure, setCodeStructure] = React.useState<string | null>(null)

    const handleCodeFile = (file?: File | null) => {
        if (!file) return;
        const maxBytes = 250 * 1024; // ~250KB, чтобы не класть слишком большой файл в БД
        if (file.size > maxBytes) {
            setCodeError("Файл слишком большой (макс ~250KB)");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result?.toString() ?? "";
            setCode(text);
            setCodeFileName(file.name);
            setCodeError(null);
            setCodeStructure(JSON.stringify([{ path: file.name, size: file.size, content: text }]));
        };
        reader.onerror = () => {
            setCodeError("Не удалось прочитать файл");
        };
        reader.readAsText(file);
    };

    const handleCodeFolder = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList);
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        const maxBytes = 900 * 1024; // ~900KB, чтобы не взорвать БД
        if (totalSize > maxBytes) {
            setCodeError("Папка слишком большая (макс ~900KB)");
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

            setCode(combined);
            setCodeFileName(folderName);
            setCodeError(null);
            setCodeStructure(JSON.stringify(contents.map(({ path, size, text }) => ({ path, size, content: text }))));
        } catch (err) {
            setCodeError("Не удалось прочитать файлы папки");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-lg shadow-black/20">

                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold">Новый проект</h2>
                        <p className="text-xs text-muted-foreground">
                            Заполните данные, чтобы создать проект в профиле.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/70 text-muted-foreground transition"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>

                <form className="px-5 py-4 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="project-name" className="text-xs">
                            Название проекта
                        </Label>
                        <Input
                            id="project-name"
                            placeholder="Например: Nexora Dashboard"
                            className="text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="project-description" className="text-xs">
                            Краткое описание
                        </Label>
                        <textarea
                            id="project-description"
                            className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Опишите, что делает ваш проект…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="project-language" className="text-xs">
                                Язык
                            </Label>
                            <Input
                                id="project-language"
                                placeholder="TypeScript"
                                className="text-sm"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            />

                        </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="project-stack" className="text-xs">
                            Стек
                        </Label>
                        <Input
                                id="project-stack"
                                placeholder="Next.js, React, Drizzle…"
                                className="text-sm"
                                value={stackText}
                                onChange={(e) => setStackText(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="project-code" className="text-xs">
                            Код или фрагмент
                        </Label>
                        <textarea
                            id="project-code"
                            className="w-full min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Вставьте основной файл, ссылку или фрагмент кода…"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setCodeFileName(null);
                                setCodeStructure(null);
                            }}
                        />
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <label className="inline-flex items-center gap-2 cursor-pointer rounded-full border border-border px-3 py-1.5 hover:bg-accent/60">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".ts,.tsx,.js,.jsx,.json,.md,.txt,.yaml,.yml,.css,.scss,.html,.py,.go,.rs,.java,.kt,.php,.rb,.c,.cpp,.cs,.swift,.mjs"
                                    className="hidden"
                                    onChange={(e) => handleCodeFile(e.target.files?.[0])}
                                />
                                Загрузить файл
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer rounded-full border border-border px-3 py-1.5 hover:bg-accent/60">
                                <input
                                    ref={folderInputRef}
                                    type="file"
                                    className="hidden"
                                    multiple
                                    //@ts-expect-error webkitdirectory поддерживается браузером
                                    webkitdirectory="true"
                                    directory=""
                                    onChange={(e) => handleCodeFolder(e.target.files)}
                                />
                                Загрузить папку
                            </label>
                            {codeFileName && (
                                <span className="text-foreground">
                                    Загружено: <strong>{codeFileName}</strong>
                                </span>
                            )}
                            {codeError && (
                                <span className="text-destructive">{codeError}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 px-5 pb-4 pt-2 border-t border-border/60">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-xs px-3"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="button"
                            className="text-xs px-4"
                            onClick={() => {
                                if (!onSubmit) return

                                onSubmit({
                                    name,
                                    description,
                                    language,
                                    stackText,
                                    code,
                                    codeFilename: codeFileName,
                                    codeStructure,
                                })
                            }}
                        >
                            Создать проект
                        </Button>


                    </div>
                </form>


            </div>
        </div>
    );
}

export default CreateProjectModal;
