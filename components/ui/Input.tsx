'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full text-left">
        <label className="text-sm font-medium text-foreground/90">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/50">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 bg-surface/50 border border-surface-border rounded-lg 
              text-foreground placeholder:text-foreground/40
              backdrop-blur-sm
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
              transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -4 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500 font-medium"
          >
            {error}
          </motion.span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
