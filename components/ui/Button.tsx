import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-[#89CFF0] text-black font-bold hover:scale-105 shadow-lg hover:shadow-[#89CFF0]/20",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
        outline: "border-2 border-white/20 text-white hover:border-[#89CFF0] hover:text-[#89CFF0]",
        ghost: "hover:bg-white/5 text-white/60 hover:text-white",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-16 px-8 text-xl",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            style={{ fontFamily: 'Avenir, sans-serif' }}
            {...props}
        >
            {children}
        </button>
    );
}
