import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className = '', title, description }: CardProps) {
    return (
        <div className={`bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="p-6 border-b border-white/10 bg-white/5">
                    {title && <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>{title}</h3>}
                    {description && <p className="text-sm text-white/60 mt-1 font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
