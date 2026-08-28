'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ isLoading, variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-defset-2 focus:ring-defset-background disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
    secondary: "bg-surface text-foreground border border-surface-border hover:bg-surface-border",
    ghost: "text-foreground/80 hover:text-foreground hover:bg-surface"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
