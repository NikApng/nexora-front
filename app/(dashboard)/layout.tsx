export const metadata = {
    title: "Nexora",
    description: "SaaS Dashboard",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        {children}
        </body>
        </html>
    );
}
