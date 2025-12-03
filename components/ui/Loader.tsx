import React from "react";

type BrandLoaderProps = {
    fullScreen?: boolean;
    label?: string;
};

export function BrandLoader({fullScreen = false, label}: BrandLoaderProps) {
    const wrapperClasses = fullScreen
        ? "min-h-screen flex items-center justify-center bg-background"
        : "flex items-center justify-center";

    return (
        <div className={wrapperClasses}>
            <div className="relative flex flex-col items-center gap-4">

                <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary via-sky-500 to-emerald-400 shadow-xl shadow-primary/40">

                    <div className="absolute inset-2 rounded-3xl border border-white/20 animate-pulse"/>

                    <span className="relative text-3xl font-semibold tracking-[0.25em] text-white"
                    >N
                    </span>

                    <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-primary/20 blur-xl"/>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-bounce"/>
                    <span
                        className="h-2.5 w-2.5 rounded-full bg-primary/70 animate-bounce"
                        style={{animationDelay: "0.15s"}}
                    />
                    <span
                        className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce"
                        style={{animationDelay: "0.3s"}}
                    />
                </div>

                {label && (
                    <p className="text-sm text-muted-foreground">
                        {label}
                    </p>
                )}
            </div>
        </div>
    );
}
