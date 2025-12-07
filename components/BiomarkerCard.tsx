"use client";

import { WellnessChart } from "./WellnessChart";

interface BiomarkerCardProps {
    title: string;
    value: string;
    trendLabel?: string;
    trendDirection: "up" | "down" | "stable";
    status: "ok" | "warning";
    context: string;
    history: number[];
}

export function BiomarkerCard({
    title,
    value,
    trendLabel,
    trendDirection,
    status,
    context,
    history
}: BiomarkerCardProps) {
    const statusColor = status === "ok" ? "#4ADE80" : "#F87171"; // Green-400 : Red-400
    const trendColor = trendDirection === "stable" ? "text-white/40" : (trendDirection === "up" && status === "ok") || (trendDirection === "down" && status === "ok") ? "text-green-400" : "text-red-400";
    const trendIcon = trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→";

    return (
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col h-full hover:border-[#89CFF0]/50 transition-colors shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider font-sans">{title}</h3>
                <div className={`w-2 h-2 rounded-full ${status === "ok" ? "bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.5)]"}`} />
            </div>

            {/* Main Value */}
            <div className="mb-1">
                <span className="text-2xl font-mono text-white font-bold tracking-tight">{value}</span>
            </div>

            {/* Trend Info */}
            <div className="flex items-center gap-2 mb-4 text-xs font-mono">
                <span className={trendColor}>
                    {trendIcon} {trendLabel}
                </span>
            </div>

            {/* Sparkline */}
            <div className="flex-1 min-h-[60px] mb-3 relative opacity-80 hover:opacity-100 transition-opacity">
                <WellnessChart
                    data={history}
                    color={status === "ok" ? "#4ADE80" : "#F87171"}
                    height={60}
                />
            </div>

            {/* Context Footer */}
            <div className="mt-auto pt-3 border-t border-white/5">
                <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                    {context}
                </p>
            </div>
        </div>
    );
}
