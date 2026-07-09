'use client'

import React, { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginUser } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAction = async (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await loginUser(formData)
      if (res?.error) {
        // Traducir algunos errores comunes
        if (res.error.toLowerCase().includes('invalid credentials')) {
          setError('Credenciales incorrectas. Inténtalo de nuevo.')
        } else {
          setError(res.error)
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Logo centrado */}
      <div className="flex justify-center">
        <Image
          src="/images/logo-transparent.png"
          alt="Antoniette Logo"
          width={180}
          height={50}
          priority
          className="h-12 w-auto object-contain"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-8 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Iniciar Sesión</h1>
          <p className="text-sm text-foreground/60 mt-2">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <form action={handleAction} className="space-y-5">
          <Input
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="tu@ejemplo.com"
            icon={<Mail className="w-4 h-4" />}
            required
            className="bg-background/40 border-surface-border text-foreground focus:border-accent"
          />
          
          <Input
            name="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            required
            className="bg-background/40 border-surface-border text-foreground focus:border-accent"
          />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          <Button type="submit" isLoading={isPending} className="w-full mt-2 bg-accent hover:bg-accent-hover text-background font-bold tracking-wider uppercase text-xs rounded-sm">
            Ingresar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground/60">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Créala aquí
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
