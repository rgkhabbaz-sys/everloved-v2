"use client";

import Image from "next/image";
import { NeuroCard } from "@/components/NeuroCard";

export default function SciencePage() {

    return (
        <main className="min-h-screen pt-24 px-4 bg-[var(--background)] relative overflow-hidden font-sans">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/90 via-[var(--background)]/80 to-[var(--background)]/95 z-10" />
                <Image
                    src="/assets/user-photos/photo3.png"
                    alt="Science Background"
                    fill
                    className="object-cover object-center opacity-30"
                    priority
                />
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Cognitive Analytics</h1>
                    <p className="text-white/60 font-mono text-sm">
                        AI-Driven Neuro-Informatics • <span className="text-[#89CFF0]">Real-time Analysis</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Card 1: Lexical Diversity */}
                    <NeuroCard
                        type="line"
                        title="Lexical Diversity (TTR)"
                        value="0.72 Ratio"
                        trend="Stable"
                        trendDirection="stable"
                        insight="Measures vocabulary retention and verbal complexity over time."
                        data={[0.70, 0.71, 0.72, 0.72, 0.71, 0.72, 0.72]}
                    />

                    {/* Card 2: Semantic Coherence */}
                    <NeuroCard
                        type="gauge"
                        title="Semantic Coherence"
                        value="92% Logical Flow"
                        insight="Ability to maintain topic and logical sentence structure."
                        data={[3]} // 3 = High
                    />

                    {/* Card 3: Response Latency */}
                    <NeuroCard
                        type="line"
                        title="Processing Speed"
                        value="1.8s Delay"
                        trend="↑ Slower"
                        trendDirection="down" // "down" usually bad, but here generic "down" color is red
                        insight="Time taken to respond to Avatar prompts; indicates synaptic processing speed."
                        data={[1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8]}
                    />

                    {/* Card 4: Emotional State Map */}
                    <NeuroCard
                        type="scatter"
                        title="Emotional Valence"
                        value="Calm/Positive"
                        insight="Distinguishes between agitation (High Energy/Negative) and depression (Low Energy/Negative)."
                        // Valence (x), Arousal (y). Calm/Pos is high Valence, Low Arousal. 
                        // Let's plot some points in bottom right quadrant (High X, Low Y)
                        data={[
                            { x: 70, y: 30 }, { x: 75, y: 25 }, { x: 72, y: 35 },
                            { x: 80, y: 20 }, { x: 65, y: 40 }
                        ]}
                    />

                    {/* Card 5: Memory Recall Rate */}
                    <NeuroCard
                        type="circular"
                        title="Short-Term Recall"
                        value="3/5 Recalled"
                        insight="Success rate in session-based memory prompts (e.g., 'Do you remember...?')."
                        data={[60]} // 60%
                    />

                    {/* Card 6: Disorientation Events */}
                    <NeuroCard
                        type="bar"
                        title="Confusion Episodes"
                        value="4 Events Today"
                        insight="Frequency of 'Where am I?' or identity confusion statements."
                        // Morning, Afternoon, Evening
                        data={[1, 2, 1]}
                    />

                    {/* Card 7: Cognitive Stamina */}
                    <NeuroCard
                        type="bar"
                        title="Attention Span"
                        value="12m 30s Avg"
                        insight="Duration of active engagement before focus is lost."
                        // Histogram of session lengths? Just mocking some bars
                        data={[8, 12, 15, 10, 5]}
                    />

                    {/* Card 8: Speech Fluency */}
                    <NeuroCard
                        type="line"
                        title="Verbal Fluency (WPM)"
                        value="85 Words/Min"
                        trend="↓ Declining"
                        trendDirection="down"
                        insight="Speech motor control and processing speed."
                        data={[95, 92, 90, 88, 86, 85, 85]}
                    />
                </div>
            </div>
        </main>
    );
}
