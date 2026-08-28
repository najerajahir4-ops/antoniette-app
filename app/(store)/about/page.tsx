import React from 'react'
import { Package, ShieldCheck, Zap } from 'lucide-react'

export const metadata = {
  title: 'Nosotros | LUXE',
  description: 'Conoce más sobre la historia y valores de LUXE.',
}

export default function AboutPage() {
  return (
    <div className="pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Elevando el estándar de la <span className="text-accent">tecnología</span>
          </h1>
          <p className="text-lg text-foreground/70">
            En LUXE, no solo vendemos productos; curamos experiencias. Creemos que la tecnología
            debe ser tan hermosa como funcional.
          </p>
        </div>

        {/* Misión y Visión Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-surface-border">
            <img 
              src="/mission_bg.png" 
              alt="Misión LUXE" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Nuestra Misión</h3>
              <p className="text-white/80">Proveer tecnología de la más alta calidad con un diseño inigualable, accesible para aquellos que valoran el detalle.</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground">Por qué elegir LUXE</h2>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Calidad Garantizada</h4>
                <p className="text-foreground/60">Cada producto en nuestro catálogo pasa por rigurosos controles de calidad.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Innovación Constante</h4>
                <p className="text-foreground/60">Nos mantenemos a la vanguardia para traerte los últimos lanzamientos y tendencias.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Envíos Seguros</h4>
                <p className="text-foreground/60">Tu compra llega rápida y segura a la puerta de tu casa con tracking en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-surface border border-surface-border rounded-3xl p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-foreground mb-4">¿Listo para vivir la experiencia?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos y descubre por qué somos la elección número uno
            en tecnología premium.
          </p>
          <a 
            href="/#collection"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors rounded-full shadow-lg shadow-accent/20"
          >
            Explorar Tienda
          </a>
        </div>
        
      </div>
    </div>
  )
}
