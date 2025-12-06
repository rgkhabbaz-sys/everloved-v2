import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EverLoved | Avant-Garde AI Companion",
    description: "A premium, voice-enabled therapeutic companion for dementia care. Experience the future of connection.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ToastProvider>
                    {/* Debug banner removed */}
                    <Navigation />
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
