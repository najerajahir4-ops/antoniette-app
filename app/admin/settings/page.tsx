import React from 'react'
import { getSettings } from '@/app/actions/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const { settings, error } = await getSettings()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
      </div>
      
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
          {error}
        </div>
      ) : (
        <SettingsForm initialSettings={settings} />
      )}
    </div>
  )
}
