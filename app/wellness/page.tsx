"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { db } from "@/lib/db/service";
import { WellnessMetric } from "@/lib/db/types";
import { WellnessChart } from "@/components/WellnessChart";

import { BiomarkerCard } from "@/components/BiomarkerCard";

export default function WellnessPage() {
    // Mock Data for 8 Specific Cards
    // Trends are mocked to match the requested UI
    const metrics = [
        {
            id: 1,
            title: "Verbal Perseveration (Looping)",
            value: "12 events/hr",
            trendLabel: "10%",
            trendDirection: "down", // Improvement
            status: "ok",
            context: "Tracks repetitive questioning frequency via NLP.",
            history: [18, 16, 15, 14, 13, 12, 12]
        },
        {
            id: 2,
            title: "Aphasia Risk / Speech Latency",
            value: "Noun/Verb Ratio: 0.8",
            trendLabel: "Stable",
            trendDirection: "stable",
            status: "ok",
            context: "Monitors vocabulary richness and pause duration.",
            history: [0.78, 0.79, 0.8, 0.8, 0.79, 0.8, 0.8]
        },
        {
            id: 3,
            title: "Sundowning Onset",
            value: "Peak Agitation: 16:30 PM",
            trendLabel: "Shifted +15m",
            trendDirection: "stable",
            status: "warning",
            context: "Maps high-arousal voice tones to time-of-day.",
            history: [40, 45, 60, 85, 90, 80, 50] // Mocking an agitation curve peaking in evening
        },
        {
            id: 4,
            title: "Emotional Range (Valence)",
            value: "Flat Affect: 15% / Pos: 40%",
            trendLabel: "Variability ↑",
            trendDirection: "up",
            status: "ok",
            context: "Tracks facial micro-expressions.",
            history: [30, 35, 32, 38, 40, 42, 40]
        },
        {
            id: 5,
            title: "Orientation (Time/Place)",
            value: "Score: 28/30",
            trendLabel: "Stable",
            trendDirection: "stable",
            status: "ok",
            context: "Accuracy of responses to daily orientation checks.",
            history: [28, 28, 27, 28, 28, 29, 28]
        },
        {
            id: 6,
            title: "Sleep Quality (WASO)",
            value: "Wakes: 4x / night",
            trendLabel: "1x",
            trendDirection: "up", // Worsening
            status: "warning",
            context: "Wake After Sleep Onset events (linked to wearable data).",
            history: [2, 2, 3, 3, 3, 4, 4]
        },
        {
            id: 7,
            title: "Gait Velocity",
            value: "0.8 m/s",
            trendLabel: "Stable",
            trendDirection: "stable",
            status: "warning", // Lowish velocity might be warning? Keeping as requested context implies fall risk check
            context: "Walking speed and steadiness (Fall risk indicator).",
            history: [0.82, 0.81, 0.80, 0.80, 0.79, 0.80, 0.80]
        },
        {
            id: 8,
            title: "Hydration Adherence",
            value: "1.2L / day",
            trendLabel: "Low Warning",
            trendDirection: "down",
            status: "warning",
            context: "Logged fluid intake frequency.",
            history: [1.5, 1.4, 1.4, 1.3, 1.2, 1.2, 1.2]
        }
    ] as const;

    return (
        <main className="min-h-screen pt-24 px-4 bg-[var(--background)] relative overflow-hidden font-sans">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/90 via-[var(--background)]/80 to-[var(--background)]/95 z-10" />
                <Image
                    src="/assets/user-photos/photo4.jpg"
                    alt="Wellness Background"
                    fill
                    className="object-cover object-center opacity-30"
                    priority
                />
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl" style={{ position: 'relative', zIndex: 100 }}>
                <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Digital Biomarker Monitor</h1>
                        <p className="text-white/60 font-mono text-sm">
                            Patient ID: EV-2024-X89 • Status: <span className="text-green-400">Monitoring Active</span>
                        </p>
                    </div>
                    <button
                        className="px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg uppercase tracking-wider bg-[#89CFF0] text-black"
                    >
                        Export Clinical Report
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {metrics.map((metric) => (
                        <BiomarkerCard
                            key={metric.id}
                            title={metric.title}
                            value={metric.value}
                            trendLabel={metric.trendLabel}
                            trendDirection={metric.trendDirection}
                            status={metric.status}
                            context={metric.context}
                            history={[...metric.history]}
                        />
                    ))}
                </div>

                <div className="max-w-2xl mx-auto text-center opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white/40 font-mono mb-4">
                        Data integrated from: Voice Analysis Engine, Computer Vision API, Wearable SDK
                    </p>
                    <button className="text-[#89CFF0] text-xs font-bold uppercase tracking-widest hover:underline">
                        Manage Data Sources
                    </button>
                </div>
            </div>
        </main>
    );
}
