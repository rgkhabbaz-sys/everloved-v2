"use client";

interface WellnessChartProps {
    data: number[];
    color: string;
    height?: number;
}

export function WellnessChart({ data, color, height = 60 }: WellnessChartProps) {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Normalize data to fit height
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full overflow-hidden" style={{ height }}>
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Path */}
                <path
                    d={`M0,100 L0,${100 - ((data[0] - min) / range) * 100} ${points.split(" ").map(p => `L${p}`).join(" ")} L100,100 Z`}
                    fill={`url(#gradient-${color})`}
                />

                {/* Line Path */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />

                {/* End Dot */}
                <circle
                    cx="100"
                    cy={100 - ((data[data.length - 1] - min) / range) * 100}
                    r="3"
                    fill={color}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
}
