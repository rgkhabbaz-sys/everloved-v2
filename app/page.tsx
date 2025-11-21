import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="w-full py-6 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md fixed top-0 z-50">
                <div className="container flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tight text-[var(--primary)]">EverLoved</div>
                    <div className="flex gap-6 items-center">
                        <Link href="#features" className="text-sm font-medium hover:text-[var(--primary)]">Features</Link>
                        <Link href="#safety" className="text-sm font-medium hover:text-[var(--primary)]">Safety</Link>
                        <Link href="/companion" className="btn btn-primary text-sm">Try Demo</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[80vh] relative overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-10 bg-gradient-to-b from-[var(--primary)] to-transparent" />

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--muted)]">
                    A Familiar Face,<br />A Comforting Voice.
                </h1>
                <p className="text-xl md:text-2xl text-[var(--muted)] mb-10 max-w-2xl leading-relaxed">
                    Therapeutic AI companions designed to bring peace and grounding to those with dementia through the presence of their loved ones.
                </p>
                <div className="flex gap-4">
                    <Link href="/companion" className="btn btn-primary text-lg px-8 py-4">
                        Experience EverLoved
                    </Link>
                    <Link href="#how-it-works" className="btn btn-outline text-lg px-8 py-4">
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-[var(--secondary)]">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Restoring Connection</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Photo-Realistic Avatars"
                            description="Brings cherished memories to life with gentle, animated avatars created from your favorite photos."
                        />
                        <FeatureCard
                            title="Voice Cloning"
                            description="Synthesizes the comforting, familiar voice of a family member to read stories or offer reassurance."
                        />
                        <FeatureCard
                            title="Therapeutic Conversations"
                            description="AI guided by validation therapy principles to reduce anxiety and prevent agitation loops."
                        />
                    </div>
                </div>
            </section>

            {/* Safety Section */}
            <section id="safety" className="py-20">
                <div className="container flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Built with Safety & Ethics First</h2>
                        <p className="text-lg text-[var(--muted)] mb-6">
                            We understand the sensitivity of memory care. EverLoved is built with strict guardrails to ensure every interaction is positive, affirming, and safe.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--accent)]">✓</span> No harmful hallucinations
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--accent)]">✓</span> Controlled "Therapeutic Fibbing" support
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[var(--accent)]">✓</span> Private and secure data handling
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 h-64 bg-[var(--secondary)] rounded-2xl flex items-center justify-center">
                        <span className="text-[var(--muted)]">Safety Visualization Placeholder</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--border)]">
                <div className="container text-center text-[var(--muted)]">
                    <p>&copy; 2025 EverLoved. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
    return (
        <div className="p-8 bg-[var(--background)] rounded-2xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-[var(--muted)]">{description}</p>
        </div>
    );
}
