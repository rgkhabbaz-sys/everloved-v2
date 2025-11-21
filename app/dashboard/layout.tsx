import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-[var(--secondary)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--background)] border-r border-[var(--border)] fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b border-[var(--border)]">
                    <Link href="/" className="text-2xl font-bold text-[var(--primary)]">EverLoved</Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/dashboard" active>Profiles</NavLink>
                    <NavLink href="/dashboard/activity">Activity Log</NavLink>
                    <NavLink href="/dashboard/settings">Settings</NavLink>
                </nav>

                <div className="p-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                            JD
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">John Doe</p>
                            <p className="text-[var(--muted)] text-xs">Caregiver</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
        >
            {children}
        </Link>
    );
}
