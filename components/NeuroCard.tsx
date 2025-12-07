"use client";

import React from "react";

export type ChartType = "line" | "bar" | "scatter" | "circular" | "gauge";

interface NeuroCardProps {
    type: ChartType;
    title: string;
    value: string;
    trend?: string;
    trendDirection?: "up" | "down" | "stable";
    insight: string;
    data: number[] | { x: number; y: number }[] | { label: string; value: number }[]; // Flexible data prop
}

export function NeuroCard({
    type,
    title,
    value,
    trend,
    trendDirection,
    insight,
    data
}: NeuroCardProps) {
    const renderChart = () => {
        const height = 80;
        const width = 200;
        const color = "#89CFF0";

        if (type === "line" && Array.isArray(data)) {
            // Line Chart / Sparkline
            const numData = data as number[];
            if (numData.length < 2) return null;
            const max = Math.max(...numData);
            const min = Math.min(...numData);
            const range = max - min || 1;
            const points = numData.map((val, i) => {
                const x = (i / (numData.length - 1)) * width;
                const y = height - ((val - min) / range) * height;
                return `${x},${y}`;
            }).join(" ");

            return (
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        points={points}
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Baseline dotted line if requested, but for now just the trend */}
                </svg>
            );
        }

        if (type === "bar" && Array.isArray(data)) {
            // Simple Bar Chart
            const numData = data as number[]; // Or could be objects
            // If complex objects are passed for bars, we handle them. Assuming simple numbers for distribution or generic bars for now.
            // If data is {label, value}, handle that:
            const barData = (typeof data[0] === 'object' && 'value' in (data[0] as any)) ? (data as { value: number }[]).map(d => d.value) : data as number[];

            const max = Math.max(...barData, 1);
            const barWidth = (width / barData.length) * 0.8;

            return (
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {barData.map((d, i) => (
                        <rect
                            key={i}
                            x={i * (width / barData.length) + (width / barData.length - barWidth) / 2}
                            y={height - (d / max) * height}
                            width={barWidth}
                            height={(d / max) * height}
                            fill={color}
                            opacity={0.8}
                            rx={2}
                        />
                    ))}
                </svg>
            );
        }

        if (type === "scatter" && Array.isArray(data)) {
            // Scatter Plot
            // Expects {x, y} normalized 0-100 or similar
            const scatterData = data as { x: number, y: number }[];
            return (
                <svg viewBox={`0 0 100 100`} className="w-full h-full border border-white/5 bg-white/5 rounded-lg">
                    {/* Axis lines */}
                    <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeOpacity="0.1" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.1" />
                    {scatterData.map((d, i) => (
                        <circle
                            key={i}
                            cx={d.x}
                            cy={100 - d.y}
                            r="4"
                            fill={color}
                            opacity={0.8}
                        />
                    ))}
                </svg>
            );
        }

        if (type === "circular" && Array.isArray(data) && data.length > 0) {
            // Circular Progress
            // Expects single value [percent] or similar. Let's assume data[0] is percent (0-100)
            const val = (data as number[])[0];
            const radius = 35;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (val / 100) * circumference;

            return (
                <svg viewBox="0 0 100 100" className="w-full h-full flex items-center justify-center">
                    <circle cx="50" cy="50" r={radius} stroke="white" strokeOpacity="0.1" strokeWidth="8" fill="none" />
                    <circle
                        cx="50" cy="50" r={radius}
                        stroke={color} strokeWidth="8" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                    />
                    <text x="50" y="54" textAnchor="middle" fill="white" fontSize="16" fontFamily="monospace" fontWeight="bold">{val}%</text>
                </svg>
            );
        }

        if (type === "gauge" && Array.isArray(data)) {
            // Segmented Bar Gauge
            // Expects specific layout or standard 3 segments? 
            // Let's implement a simple 3-bar gauge or single bar gauge. 
            // User req: "Bar gauge (High/Med/Low)". Let's assume data[0] is the 'active' level (1, 2, or 3).
            const level = (data as number[])[0]; // 1=Low, 2=Med, 3=High

            return (
                <div className="flex gap-1 h-full items-center p-4">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`flex-1 h-2 rounded-full transition-all ${i <= level ? 'bg-[#89CFF0] shadow-[0_0_10px_#89CFF0]' : 'bg-white/10'}`}
                        />
                    ))}
                    <span className="ml-2 text-xs font-mono text-white/60">
                        {level === 1 ? "LOW" : level === 2 ? "MED" : "HIGH"}
                    </span>
                </div>
            )
        }

        return null;
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col h-full hover:border-[#89CFF0]/50 transition-all shadow-xl group">
            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold">{title}</h3>
                <div className="text-white/20 hover:text-white/60 transition-colors cursor-help group-hover/icon" title={insight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </div>
            </div>

            {/* Value Row */}
            <div className="flex justify-between items-end mb-6">
                <span className="text-2xl font-mono text-white font-medium tracking-tight whitespace-nowrap">{value}</span>
                {trend && (
                    <span className={`text-xs font-mono mb-1 ${trendDirection === "up" ? "text-red-400" : trendDirection === "down" ? "text-red-400" : "text-white/40" // Coloring depends on context, but let's stick to user prompt implication or neutral
                        // Wait, user didn't specify color rules for up/down universally. Let's make it contextual or just white/40 for now unless "stable".
                        // Actually, I'll allow color override or default to standard green/red logic if needed. 
                        // For now, I'll keep it simple:
                        } text-white/60`}>
                        {trend}
                    </span>
                )}
            </div>

            {/* Chart Container */}
            <div className="flex-1 min-h-[100px] mb-4 relative flex items-center justify-center">
                {renderChart()}
            </div>

            {/* Footer / Insight */}
            <div className="mt-auto relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="pt-3 text-[10px] text-white/50 italic leading-relaxed font-sans">
                    "{insight}"
                </p>
            </div>
        </div>
    );
}
