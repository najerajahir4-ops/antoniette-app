import React from 'react'
import { getAdminUsers } from '@/app/actions/admin'
import { EmployeesManager } from '@/components/admin/EmployeesManager'
import { ShieldAlert } from 'lucide-react'

export default async function AdminEmployeesPage() {
  const { users, error } = await getAdminUsers()

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  return <EmployeesManager initialUsers={users || []} />
}
