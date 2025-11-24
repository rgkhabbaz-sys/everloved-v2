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
                    <div className="fixed top-0 left-0 right-0 z-[10000] bg-red-600 text-white text-center p-2 font-bold">
                        DEBUG: DEPLOYMENT UPDATED - V3 (Neon Dock)
                    </div>
                    <Navigation />
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
