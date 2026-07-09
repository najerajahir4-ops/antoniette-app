import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckCircle2, XCircle, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerificarCorreoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1A1D18] flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A961]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-[#C9A961]/20 rounded-xl p-8 text-center shadow-2xl relative z-10">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-serif text-[#C9A961] mb-4">Token Faltante</h1>
          <p className="text-foreground/80 mb-8 text-sm leading-relaxed">
            No se proporcionó ningún token de verificación de correo electrónico. Por favor, revisa el enlace completo enviado a tu bandeja de entrada.
          </p>
          <Link
            href="/"
            className="inline-block w-full py-3 px-6 bg-transparent border border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961] hover:text-[#1A1D18] transition-all duration-300 font-semibold tracking-widest text-xs uppercase"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  // Buscar usuario con el token correspondiente
  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  })

  // Validaciones del token
  const isExpired = user?.verificationTokenExpiry && new Date() > user.verificationTokenExpiry
  const isValid = user && !isExpired

  if (isValid) {
    // Marcar correo como verificado y limpiar tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#1A1D18] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A961]/5 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-[#C9A961]/20 rounded-xl p-8 text-center shadow-2xl relative z-10">
        <h1 className="text-3xl font-serif text-[#C9A961] tracking-widest uppercase mb-1">Antoniette</h1>
        <p className="text-xs text-foreground/40 tracking-[4px] uppercase mb-8">Rooftop & Cucina Italiana</p>

        {isValid ? (
          <div>
            <CheckCircle2 className="w-16 h-16 text-[#C9A961] mx-auto mb-6 animate-pulse" />
            <h2 className="text-xl font-serif text-foreground mb-4">¡Correo Verificado!</h2>
            <p className="text-foreground/80 mb-8 text-sm leading-relaxed">
              Tu dirección de correo electrónico ha sido confirmada con éxito. ¡Antoniette te espera para vivir la mejor experiencia!
            </p>
            <Link
              href="/reservar"
              className="inline-block w-full py-3 px-6 bg-[#C9A961] text-[#1A1D18] hover:bg-[#b09352] transition-all duration-300 font-semibold tracking-widest text-xs uppercase shadow-lg shadow-[#C9A961]/20"
            >
              Reservar una Mesa
            </Link>
          </div>
        ) : (
          <div>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-xl font-serif text-foreground mb-4">Enlace Inválido o Expirado</h2>
            <p className="text-foreground/80 mb-8 text-sm leading-relaxed">
              El enlace de verificación no es válido o ha expirado (el tiempo límite es de 24 horas). Por favor, solicita un nuevo correo de verificación.
            </p>
            
            <ReenviarBoton email={user?.email} />
          </div>
        )}
      </div>
    </div>
  )
}

// Subcomponente de botón cliente para reenviar el correo usando fetch
import { ReenviarBoton } from './ReenviarBoton'
