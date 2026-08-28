'use client'

import React, { useState } from 'react'
import { updateUserRole, toggleUserStatus, deleteUser } from '@/app/actions/admin'
import { UserCheck, ShieldAlert, ToggleLeft, ToggleRight, Trash2, Info } from 'lucide-react'

interface UserItem {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string | Date
}

export function EmployeesManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: string) => {
    setError(null)
    setInfoMessage(null)
    const res = await updateUserRole(userId, newRole)
    if (res.error) {
      setError(res.error)
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    }
  }

  const handleToggleStatus = async (userId: string) => {
    setError(null)
    setInfoMessage(null)
    const res = await toggleUserStatus(userId)
    if (res.error) {
      setError(res.error)
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      )
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
    
    setError(null)
    setInfoMessage(null)
    
    const res = await deleteUser(userId)
    if (res.error) {
      setError(res.error)
    } else {
      if (res.softDeleted) {
        setInfoMessage(res.message || 'Se aplicó Soft Delete porque el usuario tiene historial.')
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u))
        )
      } else {
        setInfoMessage(res.message || 'Usuario eliminado permanentemente.')
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios y Permisos</h1>
        <p className="text-foreground/60 text-sm mt-1">Administra las cuentas de los comensales y del personal operativo.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {infoMessage && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-sm text-sm flex gap-3 items-center">
          <Info className="w-5 h-5" />
          <span>{infoMessage}</span>
        </div>
      )}

      <div className="bg-surface/20 border border-surface-border rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-surface/40 text-xs uppercase tracking-widest text-foreground/60">
              <th className="p-5 font-medium">Email</th>
              <th className="p-5 font-medium">Rol</th>
              <th className="p-5 font-medium">Estado</th>
              <th className="p-5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {users.map((item) => (
              <tr 
                key={item.id} 
                className={`hover:bg-surface/10 transition-colors ${
                  !item.isActive ? 'opacity-50 bg-black/10' : ''
                }`}
              >
                <td className="p-5 text-sm font-light text-foreground/80">
                  <span className={!item.isActive ? 'line-through decoration-red-500/45' : ''}>
                    {item.email}
                  </span>
                </td>
                <td className="p-5">
                  <select
                    value={item.role}
                    onChange={(e) => handleRoleChange(item.id, e.target.value)}
                    disabled={!item.isActive}
                    className="bg-background border border-surface-border px-3 py-1.5 text-xs rounded-sm text-foreground focus:outline-none focus:border-accent disabled:opacity-50"
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="EMPLEADO">Empleado</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </td>
                <td className="p-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    item.isActive 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {item.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-5 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                      item.isActive
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white'
                        : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-green-400" /> Suspender
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-foreground/30" /> Activar
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border bg-red-650/10 text-red-400 border-red-500/20 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
