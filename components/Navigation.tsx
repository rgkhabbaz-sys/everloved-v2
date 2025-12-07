"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Patient Comfort", href: "/" },
    { name: "Caregiver Control", href: "/caregiver" },
    { name: "New Science", href: "/science" },
    { name: "Health & Wellness", href: "/wellness" },
];

export function Navigation() {
    const pathname = usePathname();

    const isActiveRaw = (path: string) => pathname === path;

    return (
        <nav
            style={{
                position: 'fixed',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 99999,
                visibility: 'visible',
                opacity: 1,
                display: 'flex'
            }}
            className="bg-black/30 backdrop-blur-xl rounded-full px-8 py-4 gap-8 items-center shadow-2xl border border-white/20 group hover:bg-black/50 transition-all duration-500"
        >
            {tabs.map((tab) => {
                const isActive = isActiveRaw(tab.href);
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            "text-sm font-medium transition-colors uppercase tracking-widest hover:scale-105 transform",
                            isActive ? "text-white scale-105" : "text-white/90 hover:text-white"
                        )}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </nav>
    );
}
