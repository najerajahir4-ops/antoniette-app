'use client'

import { useTransition } from 'react'
import { logoutUser } from '@/app/actions/auth'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={className}
    >
      {children ?? (isPending ? 'Saliendo...' : 'Cerrar Sesión')}
    </button>
  )
}
