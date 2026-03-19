import React from 'react';

export const Button = ({ children, className = "", variant = "primary", size = "md", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
    
    const variants = {
        primary: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-500",
        outline: "bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-slate-500",
    };
    
    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 p-0",
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
