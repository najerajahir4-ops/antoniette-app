import React from 'react'

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface/60 backdrop-blur-md border border-surface-border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}
