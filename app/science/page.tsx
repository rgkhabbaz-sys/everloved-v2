"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db/service";
import { Resource } from "@/lib/db/types";
import Image from "next/image";

export default function SciencePage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        const data = await db.getResources();
        setResources(data);
        setIsLoading(false);
    };

    const categories = ["All", "Research", "Therapy", "Care Tips", "Wellness"];
    const filteredResources = selectedCategory === "All"
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    return (
        <main className="min-h-screen pt-24 px-4 bg-[var(--background)]">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-12 text-center flex flex-col items-center gap-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-[#89CFF0] text-black font-bold shadow-[0_0_20px_rgba(137,207,240,0.3)]"
                                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        Latest research and therapeutic approaches in dementia care.
                    </p>
                </header>

                <div className="space-y-8">
                    {isLoading ? (
                        // Loading Skeletons
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col md:flex-row gap-8 animate-pulse bg-white/5 p-6 rounded-2xl">
                                <div className="w-full md:w-64 h-40 bg-white/10 rounded-xl" />
                                <div className="flex-1 space-y-4">
                                    <div className="h-4 w-24 bg-white/10 rounded" />
                                    <div className="h-8 w-3/4 bg-white/10 rounded" />
                                    <div className="h-20 w-full bg-white/10 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredResources.map((resource) => (
                            <article key={resource.id} className="group cursor-pointer bg-white/5 hover:bg-white/10 p-6 rounded-3xl transition-all duration-300 border border-white/5 hover:border-[#89CFF0]/30">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-64 h-40 bg-black/20 rounded-2xl overflow-hidden relative shadow-lg">
                                        {resource.imageUrl && (
                                            <Image
                                                src={resource.imageUrl}
                                                alt={resource.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span
                                                className="text-xs font-bold px-3 py-1 rounded-full bg-[#89CFF0]/10 text-[#89CFF0] tracking-wider uppercase"
                                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                            >
                                                {resource.category}
                                            </span>
                                            <span className="text-xs text-white/40" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                                {new Date(resource.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2
                                            className="text-2xl font-bold mb-3 text-white group-hover:text-[#89CFF0] transition-colors"
                                            style={{ fontFamily: 'Avenir, sans-serif' }}
                                        >
                                            {resource.title}
                                        </h2>
                                        <p className="text-white/70 leading-relaxed font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                            {resource.summary}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
