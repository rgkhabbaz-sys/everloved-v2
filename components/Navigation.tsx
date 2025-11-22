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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 bg-transparent pointer-events-none">
            <div className="glass-panel rounded-full px-3 py-2 pointer-events-auto flex gap-2 shadow-2xl bg-white/5 backdrop-blur-md border border-white/10">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                isActive
                                    ? "bg-[#89CFF0]/10 text-[#89CFF0] shadow-[0_0_20px_rgba(137,207,240,0.2)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
