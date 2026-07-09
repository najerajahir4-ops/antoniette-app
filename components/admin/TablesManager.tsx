'use client'

import React, { useState, useTransition } from 'react'
import { createTable, updateTable, deleteTable } from '@/app/actions/admin'
import { Trash2, Edit2, Plus, X, ShieldAlert } from 'lucide-react'

interface Table {
  id: string
  number: number
  capacity: number
  status: string
}

export function TablesManager({ initialTables }: { initialTables: Table[] }) {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [number, setNumber] = useState<number | ''>('')
  const [capacity, setCapacity] = useState<number | ''>('')
  
  // Edit states
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [editNumber, setEditNumber] = useState<number | ''>('')
  const [editCapacity, setEditCapacity] = useState<number | ''>('')
  const [editStatus, setEditStatus] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!number || !capacity) return

    const res = await createTable(Number(number), Number(capacity))
    if (res.error) {
      setError(res.error)
    } else if (res.table) {
      setTables((prev) => [...prev, res.table as Table].sort((a, b) => a.number - b.number))
      setShowAddForm(false)
      setNumber('')
      setCapacity('')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!editingTable || !editNumber || !editCapacity) return

    const res = await updateTable(editingTable.id, Number(editNumber), Number(editCapacity), editStatus)
    if (res.error) {
      setError(res.error)
    } else if (res.table) {
      setTables((prev) =>
        prev.map((t) => (t.id === editingTable.id ? (res.table as Table) : t)).sort((a, b) => a.number - b.number)
      )
      setEditingTable(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta mesa?')) return
    setError(null)

    const res = await deleteTable(id)
    if (res.error) {
      setError(res.error)
    } else {
      setTables((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const startEdit = (table: Table) => {
    setEditingTable(table)
    setEditNumber(table.number)
    setEditCapacity(table.capacity)
    setEditStatus(table.status)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Mesas</h1>
          <p className="text-foreground/60 text-sm mt-1">Configura el diseño y capacidad del restaurante.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingTable(null); setError(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-background font-semibold hover:scale-105 transition-transform duration-300 rounded-sm text-sm uppercase tracking-widest"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cerrar' : 'Agregar Mesa'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Forms Section */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 bg-surface border border-surface-border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Número de Mesa</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-background border border-surface-border px-4 py-2.5 text-foreground rounded-sm text-sm"
              placeholder="Ej. 11"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Capacidad (Personas)</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-background border border-surface-border px-4 py-2.5 text-foreground rounded-sm text-sm"
              placeholder="Ej. 4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent text-background font-bold uppercase rounded-sm text-xs tracking-wider"
          >
            Guardar Mesa
          </button>
        </form>
      )}

      {editingTable && (
        <form onSubmit={handleUpdate} className="p-6 bg-surface border border-accent/20 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Número de Mesa</label>
            <input
              type="number"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-background border border-surface-border px-4 py-2.5 text-foreground rounded-sm text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Capacidad</label>
            <input
              type="number"
              value={editCapacity}
              onChange={(e) => setEditCapacity(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-background border border-surface-border px-4 py-2.5 text-foreground rounded-sm text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Estado</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full bg-background border border-surface-border px-4 py-2.5 text-foreground rounded-sm text-sm"
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="RESERVADA">Reservada</option>
              <option value="LIMPIEZA">En Limpieza</option>
              <option value="FUERA_DE_SERVICIO">Fuera de Servicio</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-grow px-4 py-3 bg-accent text-background font-bold uppercase rounded-sm text-xs tracking-wider"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => setEditingTable(null)}
              className="px-4 py-3 bg-background border border-surface-border text-foreground/75 uppercase rounded-sm text-xs tracking-wider"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tables Grid */}
      <div className="bg-surface/20 border border-surface-border rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-surface/40 text-xs uppercase tracking-widest text-foreground/60">
              <th className="p-5 font-medium">Número</th>
              <th className="p-5 font-medium">Capacidad</th>
              <th className="p-5 font-medium">Estado</th>
              <th className="p-5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {tables.map((table) => (
              <tr key={table.id} className="hover:bg-surface/10 transition-colors">
                <td className="p-5 font-playfair text-xl font-bold">Mesa {table.number}</td>
                <td className="p-5 font-light">{table.capacity} personas</td>
                <td className="p-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    table.status === 'DISPONIBLE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    table.status === 'OCUPADA' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    table.status === 'RESERVADA' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    table.status === 'LIMPIEZA' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-foreground/10 text-foreground/50 border border-surface-border'
                  }`}>
                    {table.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  <button
                    onClick={() => startEdit(table)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-border text-foreground/80 hover:text-foreground rounded-sm text-xs font-medium border border-surface-border transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-sm text-xs font-medium transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
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
