import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-4">
            <div className="text-center space-y-6 animate-in fade-in duration-700">
                <h1 className="text-9xl font-bold text-[#89CFF0] opacity-20" style={{ fontFamily: 'Avenir, sans-serif' }}>404</h1>
                <h2 className="text-4xl font-bold" style={{ fontFamily: 'Avenir, sans-serif' }}>Page Not Found</h2>
                <p className="text-xl text-white/60 max-w-md mx-auto" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    The path you are looking for seems to have drifted away.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-4 rounded-full bg-[#89CFF0] text-black font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-[#89CFF0]/20 mt-8"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                    Return Home
                </Link>
            </div>
        </main>
    );
}
