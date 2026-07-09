import React from 'react'
import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Decorative subtle background for the admin area */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
