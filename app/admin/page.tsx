import React from 'react'
import { Card } from '@/components/ui/Card'
import { getAdminReport } from '@/app/actions/admin'
import { Calendar, Star, Grid, MessageSquare, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const report = await getAdminReport()

  const metrics = [
    { 
      title: 'Reservas (Últimos 7 días)', 
      value: report.reservationsCount ?? 0, 
      desc: 'Nuevas reservas creadas', 
      icon: Calendar,
      color: 'bg-green-500/10 text-green-400' 
    },
    { 
      title: 'Calificación Promedio', 
      value: `${report.avgRating ?? 0} / 5.0`, 
      desc: 'Basado en reseñas reales', 
      icon: Star,
      color: 'bg-amber-500/10 text-amber-400' 
    },
    { 
      title: 'Total de Mesas', 
      value: report.tablesCount ?? 0, 
      desc: 'Mesas activas configuradas', 
      icon: Grid,
      color: 'bg-blue-500/10 text-blue-400' 
    },
    { 
      title: 'Reseñas Totales', 
      value: report.totalReviews ?? 0, 
      desc: 'Opiniones recibidas', 
      icon: MessageSquare,
      color: 'bg-purple-500/10 text-purple-400' 
    },
  ]

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumen General</h1>
        <p className="text-foreground/60 mt-2">Bienvenido de nuevo. Esto es lo que está pasando en Antoniette hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground/70">{metric.title}</h3>
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs mt-1 text-foreground/40 font-light">
                {metric.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Visual sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 min-h-[300px] flex flex-col justify-center items-center text-foreground/45 border-dashed">
          <Calendar className="w-8 h-8 text-accent/50 mb-2" />
          <p className="font-semibold text-foreground/80">Calendario de Reservas</p>
          <p className="text-xs text-foreground/50 font-light mt-1">Los empleados pueden ver y gestionar el servicio desde el panel de Empleado.</p>
        </Card>
        <Card className="p-6 min-h-[300px] flex flex-col justify-center items-center text-foreground/45 border-dashed">
          <MessageSquare className="w-8 h-8 text-accent/50 mb-2" />
          <p className="font-semibold text-foreground/80">Moderación Activa</p>
          <p className="text-xs text-foreground/50 font-light mt-1">Utiliza el menú lateral para gestionar las opiniones de los clientes.</p>
        </Card>
      </div>
    </>
  )
}
