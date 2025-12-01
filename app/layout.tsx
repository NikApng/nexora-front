import type {Metadata} from "next";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import {SessionProvider} from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
    title: "Nexora",
    description: "Nexora Dashboard",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

