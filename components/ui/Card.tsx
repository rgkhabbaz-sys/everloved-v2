import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className = '', title, description }: CardProps) {
    return (
        <div className={`bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="p-6 border-b border-[var(--border)]">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {description && <p className="text-sm text-[var(--muted)] mt-1">{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
