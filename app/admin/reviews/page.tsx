import React from 'react'
import { getAdminReviews } from '@/app/actions/admin'
import { ReviewsManager } from '@/components/admin/ReviewsManager'
import { ShieldAlert } from 'lucide-react'

export default async function AdminReviewsPage() {
  const { reviews, error } = await getAdminReviews()

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm text-sm flex gap-3 items-center">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  return <ReviewsManager initialReviews={(reviews as any) || []} />
}
