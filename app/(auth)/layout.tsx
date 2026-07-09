import Image from 'next/image'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Imagen de fondo premium con overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Antoniette Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay oscuro semitransparente */}
        <div className="absolute inset-0 bg-[#1A1D18]/80 z-10" />
      </div>
      
      <div className="relative z-20 w-full max-w-md px-6 py-12">
        {children}
      </div>
    </div>
  )
}
