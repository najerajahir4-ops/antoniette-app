import React from 'react'
import { getAdminTables } from '@/app/actions/admin'
import { TablesManager } from '@/components/admin/TablesManager'
import { ShieldAlert } from 'lucide-react'

export default async function AdminTablesPage() {
  const { tables, error } = await getAdminTables()

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  return <TablesManager initialTables={tables || []} />
}
