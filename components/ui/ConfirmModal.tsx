'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmModal({ isOpen, title, description, onConfirm, onCancel, isLoading }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onCancel : undefined}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-surface-border bg-surface p-6 shadow-2xl shadow-black/50 sm:rounded-2xl"
          >
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="text-sm text-foreground/70">{description}</p>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
                className="mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                isLoading={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white border-transparent"
              >
                Confirm Delete
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
