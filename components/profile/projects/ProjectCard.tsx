import React from "react";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";

type ProjectCardProps = {
    id: number | string;
    name: string;
    description: string;
    language: string;
    stack: string[];
    updatedAt: string;
    onRemove?: (id: number | string) => void;
};


export function ProjectCard({
                                id,
                                name,
                                description,
                                language,
                                stack,
                                updatedAt,
                                onRemove,
                            }: ProjectCardProps) {
    const safeStack = Array.isArray(stack)
        ? stack
        : typeof stack === "string"
            ? stack.split(",").map(s => s.trim())
            : []


    return (
        <article
            className="rounded-2xl border border-border bg-card p-4 transition hover:border-accent hover:bg-accent/40 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold line-clamp-1">{name}</span>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground shrink-0">
          {language}
        </span>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex flex-wrap gap-2">
                    {safeStack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {tech}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {updatedAt}
                      </span>

                    <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onRemove?.(id)}
                    >
                        <Trash className="size-4"/>
                    </Button>
                </div>
            </div>
        </article>
    );
}
