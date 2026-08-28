import React from 'react'
import { getEmployeeDashboardData } from '@/app/actions/employee'
import { EmployeeDashboard } from '@/components/employee/EmployeeDashboard'
import { ShieldAlert } from 'lucide-react'

export default async function EmployeePage() {
  const { tables, reservations, error } = await getEmployeeDashboardData()

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  // Cast values since relations in server actions might need casting to plain objects
  return (
    <EmployeeDashboard 
      initialTables={tables || []} 
      initialReservations={(reservations as any) || []} 
    />
  )
}
