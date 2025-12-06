import React from "react";

type BrandLoaderProps = {
    fullScreen?: boolean;
    label?: string;
};

export function BrandLoader({fullScreen = false, label}: BrandLoaderProps) {
    const wrapper = fullScreen
        ? "min-h-screen flex items-center justify-center bg-background"
        : "flex items-center justify-center";

    return (
        <div className={wrapper}>
            <div className="flex flex-col items-center gap-4">

                <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-muted shadow-sm">
                    <span className="text-xl font-semibold text-foreground">N</span>

                    <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-12 w-12 animate-spin rounded-full border-2 border-muted border-t-primary"/>
          </span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"/>
                    <span
                        className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-bounce"
                        style={{animationDelay: "0.15s"}}
                    />
                    <span
                        className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"
                        style={{animationDelay: "0.3s"}}
                    />
                </div>

                {label && (
                    <p className="text-xs text-muted-foreground">
                        {label}
                    </p>
                )}
            </div>
        </div>
    );
}
