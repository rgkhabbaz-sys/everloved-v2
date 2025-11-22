"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db/service";
import { WellnessMetric } from "@/lib/db/types";
import { WellnessChart } from "@/components/WellnessChart";

export default function WellnessPage() {
    const [metrics, setMetrics] = useState<WellnessMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        const data = await db.getWellnessMetrics();
        setMetrics(data);
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen pt-24 px-4 bg-[var(--background)]">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <p className="text-xl text-white/60 font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            Daily metrics and wellness tracking.
                        </p>
                    </div>
                    <button
                        className="px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg"
                        style={{
                            backgroundColor: '#89CFF0',
                            color: '#000',
                            fontFamily: 'Avenir, sans-serif'
                        }}
                    >
                        Export Report
                    </button>
                </header>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {metrics.map((metric) => (
                            <div key={metric.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#89CFF0]/30 transition-colors backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-white/60 font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>{metric.label}</div>
                                    <div
                                        className={`text-xs font-bold px-2 py-1 rounded-full ${metric.trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <div className="text-4xl font-light text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>{metric.value}</div>
                                    <div className="text-sm text-white/40" style={{ fontFamily: 'Avenir, sans-serif' }}>{metric.unit}</div>
                                </div>

                                <div className="mt-4 opacity-80 hover:opacity-100 transition-opacity">
                                    <WellnessChart
                                        data={metric.history}
                                        color="#89CFF0"
                                        height={40}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white/5 rounded-3xl border border-white/5 p-12 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-[#89CFF0]/10 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#89CFF0]"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Detailed Analysis</h3>
                    <p className="text-white/60 max-w-md text-lg font-light leading-relaxed" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        Connect a wearable device to unlock detailed sleep stages, heart rate variability, and activity tracking.
                    </p>
                    <button
                        className="mt-8 text-[#89CFF0] font-bold hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                        Connect Device
                    </button>
                </div>
            </div>
        </main>
    );
}
