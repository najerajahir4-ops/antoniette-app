'use client'

import React, { useRef, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { Product } from '@prisma/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let intervalId: NodeJS.Timeout

    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
          if (scrollContainer.scrollLeft >= maxScroll - 10) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' })
          }
        }
      }, 4000)
    }

    startScrolling()

    const pauseScrolling = () => clearInterval(intervalId)
    
    scrollContainer.addEventListener('mouseenter', pauseScrolling)
    scrollContainer.addEventListener('mouseleave', startScrolling)
    scrollContainer.addEventListener('touchstart', pauseScrolling, { passive: true })
    scrollContainer.addEventListener('touchend', startScrolling)

    return () => {
      clearInterval(intervalId)
      scrollContainer.removeEventListener('mouseenter', pauseScrolling)
      scrollContainer.removeEventListener('mouseleave', startScrolling)
      scrollContainer.removeEventListener('touchstart', pauseScrolling)
      scrollContainer.removeEventListener('touchend', startScrolling)
    }
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 w-12 h-12 flex items-center justify-center bg-surface/80 backdrop-blur-md border border-surface-border text-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth hide-scrollbar px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {products.map((product, index) => (
          <div key={product.id} className="w-[280px] sm:w-[320px] flex-none snap-center">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 w-12 h-12 flex items-center justify-center bg-surface/80 backdrop-blur-md border border-surface-border text-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
