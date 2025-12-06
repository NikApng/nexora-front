import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ReactQueryProvider } from "@/app/ReactQueryProvider";

export const metadata: Metadata = {
    title: "Nexora",
    description: "Nexora Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <ReactQueryProvider>
                <SessionProvider>{children}</SessionProvider>
            </ReactQueryProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
