"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronDown, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  GlassWater, 
  Music, 
  Sunset, 
  UtensilsCrossed,
  FileText,
  Sparkles
} from "lucide-react";

// --- Mock Data ---

const MENU_CATEGORIES = [
  "Antipasti & Ensaladas", 
  "Pastas & Focaccia", 
  "Pizzas Artesanales", 
  "Segundos & Risotto", 
  "Coctelería & Vinos"
];

interface MenuItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  // --- Antipasti & Ensaladas ---
  { 
    id: 1, 
    name: "Burrata Dolce Vita", 
    category: "Antipasti & Ensaladas", 
    price: "$10.00", 
    badge: "Recomendado", 
    description: "Burrata cremosa con jamón serrano, dulce de higo, rúcula y nueces crocantes, bañada en aceite de oliva extra virgen." 
  },
  { 
    id: 2, 
    name: "Charcutería para 2", 
    category: "Antipasti & Ensaladas", 
    price: "$20.00", 
    badge: "Para compartir", 
    description: "Selección selecta de embutidos y quesos importados, acompañada de frutas de temporada y frutos secos." 
  },
  { 
    id: 3, 
    name: "Dúo de Focaccia", 
    category: "Antipasti & Ensaladas", 
    price: "$8.00", 
    description: "Una rebanada con mascarpone y frutos rojos, otra con ricotta fresca y jamón serrano." 
  },
  { 
    id: 4, 
    name: "Calamari Fritti", 
    category: "Antipasti & Ensaladas", 
    price: "$8.00", 
    description: "Calamares empanizados al punto crocante perfecto, servidos con salsa golf artesanal y gajo de limón." 
  },
  { 
    id: 5, 
    name: "Insalata di Burrata", 
    category: "Antipasti & Ensaladas", 
    price: "$12.00", 
    description: "Mix de hojas verdes con burrata entera, tomate deshidratado, rúcula fresca, albahaca y aceite de oliva virgen." 
  },
  { 
    id: 6, 
    name: "Insalata Mediterránea", 
    category: "Antipasti & Ensaladas", 
    price: "$17.00", 
    description: "Langostinos, calamares y camarones sobre lechuga, frutilla y arándanos en salsa de finas hierbas y mostaza dulce." 
  },
  { 
    id: 7, 
    name: "César con Pollo a la Parrilla", 
    category: "Antipasti & Ensaladas", 
    price: "$13.00", 
    description: "Lechuga romana crujiente, queso parmesano en lascas, tomates cherry, crutones dorados y pechuga de pollo a la brasa." 
  },
  { 
    id: 8, 
    name: "César con Filete de Salmón", 
    category: "Antipasti & Ensaladas", 
    price: "$18.00", 
    badge: "Premium", 
    description: "Versión de autor con filete de salmón sellado, lechuga romana, parmesano curado y aderezo especial de la casa." 
  },

  // --- Pastas & Focaccia ---
  { 
    id: 9, 
    name: "Fettuccine al Pesto con Carne", 
    category: "Pastas & Focaccia", 
    price: "$23.00", 
    badge: "Firma del Chef", 
    description: "Pasta artesanal fresca al pesto genovés de albahaca y nueces, coronada con medallones de lomo fino jugoso." 
  },
  { 
    id: 10, 
    name: "Spaghetti Frutti di Mare", 
    category: "Pastas & Focaccia", 
    price: "$20.00", 
    badge: "Especialidad Mar", 
    description: "Pasta al dente con frutos del mar (langostinos, pulpo, almejas, calamar y mejillones) a la reducción de vino blanco." 
  },
  { 
    id: 11, 
    name: "Lasagna de Carne Tradizionale", 
    category: "Pastas & Focaccia", 
    price: "$12.00", 
    description: "Capas de pasta artesanal con ragù de carne premium, salsa bechamel sedosa y gratén dorado al horno." 
  },
  { 
    id: 12, 
    name: "Fettuccine a la Carbonara", 
    category: "Pastas & Focaccia", 
    price: "$13.00", 
    description: "Receta italiana auténtica con base de yemas de huevo, parmesano reggiano y tocino ahumado crocante." 
  },
  { 
    id: 13, 
    name: "Spaghetti Alfredo con Pollo", 
    category: "Pastas & Focaccia", 
    price: "$14.00", 
    description: "Pasta bañada en salsa alfredo cremosa con jamón cocido y parmesano, acompañada de pechuga de pollo a la plancha." 
  },
  { 
    id: 14, 
    name: "Penne al Ragù", 
    category: "Pastas & Focaccia", 
    price: "$14.00", 
    description: "Penne rigate con ragù casero de carne premium, cocido lentamente durante horas con tomate maduro y vino tinto." 
  },
  { 
    id: 15, 
    name: "Panini di Focaccia Che Luigi", 
    category: "Pastas & Focaccia", 
    price: "$15.00", 
    badge: "Focaccia de Autor", 
    description: "Focaccia casera horneada, lomo a la parrilla, mozzarella, tomates cherry asados, pesto, jamón serrano, pepperoni y aceitunas." 
  },
  { 
    id: 16, 
    name: "Panini di Focaccia Melina", 
    category: "Pastas & Focaccia", 
    price: "$14.00", 
    description: "Focaccia artesanal, burrata, pesto, miel pura, ají en hojuela, jamón serrano, pepperoni, rúcula y tomates frescos." 
  },
  { 
    id: 17, 
    name: "Panini di Focaccia Florencia", 
    category: "Pastas & Focaccia", 
    price: "$13.00", 
    description: "Focaccia, pesto genovés, burrata fresca, jamón serrano, salami milano, tomate deshidratado, aceitunas verdes y albahaca." 
  },

  // --- Pizzas Artesanales ---
  { 
    id: 18, 
    name: "Pizza Antoniette", 
    category: "Pizzas Artesanales", 
    price: "$16.00", 
    badge: "La Especialidad", 
    description: "La joya de la casa: masa madre horneada a la piedra, jamón serrano sobre cama de rúcula, burrata entera cremosa y nueces." 
  },
  { 
    id: 19, 
    name: "Pizza By Che Luis", 
    category: "Pizzas Artesanales", 
    price: "$16.00", 
    badge: "Firma Che Luis", 
    description: "Lomo fino a la parrilla, salami milano, pimiento verde fresco, cebolla perla y abundante mozzarella fundida." 
  },
  { 
    id: 20, 
    name: "Pizza Napolitana di Parma", 
    category: "Pizzas Artesanales", 
    price: "$15.00", 
    description: "Jamón serrano seleccionado, mozzarella fundida, tomate deshidratado y orégano silvestre aromático." 
  },
  { 
    id: 21, 
    name: "Pizza Pepperoni Clásica", 
    category: "Pizzas Artesanales", 
    price: "$13.00", 
    description: "Lonjas de pepperoni americano especiado sobre generosa capa de mozzarella y pomodoro casero." 
  },
  { 
    id: 22, 
    name: "Pizza Hawaiana", 
    category: "Pizzas Artesanales", 
    price: "$13.00", 
    description: "Jamón cocido especial y piña caramelizada sobre una capa dorada de queso mozzarella y pomodoro." 
  },

  // --- Segundos & Risotto ---
  { 
    id: 23, 
    name: "Pulpo al Grill con Risotto Cítrico", 
    category: "Segundos & Risotto", 
    price: "$28.00", 
    badge: "Plato Estrella", 
    description: "Pulpo importado dorado a las brasas con chimichurri mediterráneo, servido sobre risotto cítrico al parmesano." 
  },
  { 
    id: 24, 
    name: "Salmón al Romero", 
    category: "Segundos & Risotto", 
    price: "$24.00", 
    badge: "Recomendado", 
    description: "Filete de salmón chileno con mantequilla infusionada al romero fresco, suave puré de papa y espárragos grillados." 
  },
  { 
    id: 25, 
    name: "Risotto Frutti di Mare", 
    category: "Segundos & Risotto", 
    price: "$22.00", 
    description: "Arroz arborio cremoso con variedad de mariscos frescos, reducción de vino blanco y langostinos dorados." 
  },
  { 
    id: 26, 
    name: "Ribeye Steak", 
    category: "Segundos & Risotto", 
    price: "$20.00", 
    description: "Corte jugoso y marmoleado cocinado al término deseado a la parrilla, con guarnición a elección de la casa." 
  },

  // --- Coctelería & Vinos ---
  { 
    id: 27, 
    name: "Cóctel Antoniette", 
    category: "Coctelería & Vinos", 
    price: "$14.00", 
    badge: "Firma de la Casa", 
    description: "Baileys irlandés, vodka premium y una extracción de café espresso recién hecho. Sedoso, aromático y envolvente." 
  },
  { 
    id: 28, 
    name: "Negroni Clásico", 
    category: "Coctelería & Vinos", 
    price: "$16.00", 
    description: "Gin botánico de autor, Martini Rosso, Campari amargo y twist de corteza de naranja flameada." 
  },
  { 
    id: 29, 
    name: "Aperol Spritz", 
    category: "Coctelería & Vinos", 
    price: "$16.00", 
    description: "Aperol, Cinzano Pro Spritz, chorrito de soda burbujeante y rodaja de naranja fresca de estación." 
  },
  { 
    id: 30, 
    name: "Moscow Mule", 
    category: "Coctelería & Vinos", 
    price: "$13.00", 
    description: "Vodka, jugo de lima recién exprimido, ginger beer picante, menta silvestre y hielo picado en jarra de cobre." 
  },
  { 
    id: 31, 
    name: "Pisco Sour", 
    category: "Coctelería & Vinos", 
    price: "$13.00", 
    description: "Pisco aromático, jugo de limón fresco, emulsión sedosa de clara de huevo y gotas de amargo de angostura." 
  },
  { 
    id: 32, 
    name: "Margarita Frozen", 
    category: "Coctelería & Vinos", 
    price: "$12.00", 
    description: "Tequila reposado, jugo de limón, licor de naranja, hielo frappé y escarchado de sal fina en el borde." 
  },
  { 
    id: 33, 
    name: "Sangría de la Casa (Copa / Jarra)", 
    category: "Coctelería & Vinos", 
    price: "$9 / $30", 
    description: "Vino tinto o blanco con maceración artesanal de frutas frescas, toque de ron añejo y soda cítrica." 
  },
  { 
    id: 34, 
    name: "Copa de Vino / Botella de la Casa", 
    category: "Coctelería & Vinos", 
    price: "$7 / $25+", 
    description: "Selección de vinos tintos (Chianti DOCG, Casillero Cabernet, Merlot, Malbec) y blancos o espumosos (Sauvignon Blanc, Lambrusco)." 
  },
];

const TESTIMONIALS = [
  { id: 1, name: "Carlos M.", text: "La mejor vista de la ciudad y una comida italiana excepcional. El ambiente nocturno es inmejorable.", rating: 5 },
  { id: 2, name: "Andrea P.", text: "Los raviolis di tartufo son increíbles. Perfecto para una cena romántica o con amigos.", rating: 5 },
  { id: 3, name: "Juan D.", text: "Excelente atención y los cócteles de autor son una maravilla. 100% recomendado.", rating: 5 },
];

const FEATURES = [
  { icon: Sunset, title: "Vista Panorámica", desc: "Los mejores atardeceres de la ciudad desde las alturas." },
  { icon: Music, title: "Música en Vivo", desc: "Acompaña tu velada con sets acústicos y DJ en vivo." },
  { icon: GlassWater, title: "Coctelería de Autor", desc: "Mixología premium con toques italianos." },
  { icon: UtensilsCrossed, title: "Cucina Auténtica", desc: "Recetas tradicionales con ingredientes de primer nivel." },
];

// --- Animation Variants ---

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("Antipasti & Ensaladas");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [reviews, setReviews] = useState<any[]>(TESTIMONIALS);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial auto-play based on dynamic reviews
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  const filteredMenu = MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-background">
      
      {/* 1. HERO / PORTADA */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Cinemático con Recorrido Suave Horizontal (Ken Burns) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute inset-0 w-[116%] h-[116%] -left-[8%] -top-[8%]"
            animate={{ 
              x: ["-3.5%", "3.5%", "-3.5%"],
              scale: [1.06, 1.10, 1.06]
            }}
            transition={{ 
              duration: 22, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Image 
              src="/images/hero-antoniette-clean.jpg" 
              alt="Interior y terraza exclusiva de Antoniette Italian Rooftop" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </motion.div>

          {/* Gradientes elegantes fijos para contraste perfecto sin distorsión */}
          <div className="absolute inset-0 bg-black/25 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/50 z-10" />
          {/* Desvanecido suave hacia la siguiente sección */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
        </div>

        {/* Navbar */}
        <motion.nav 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1A1D18]/95 backdrop-blur-md py-4 border-b border-surface-border shadow-lg shadow-black/20' : 'bg-transparent py-6'}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 relative flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-6 z-10">
              <a href="#" className="flex items-center">
                <Image 
                  src="/images/logo-transparent.png" 
                  alt="Antoniette Logo" 
                  width={200} 
                  height={56}
                  priority
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>

            {/* Navegación Desktop Centrada */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-xs uppercase tracking-widest text-foreground/80 font-medium">
              <a href="#nosotros" className="hover:text-accent transition-colors">Nosotros</a>
              <a href="#menu" className="hover:text-accent transition-colors">Menú</a>
              <a href="#experiencia" className="hover:text-accent transition-colors">Experiencia</a>
              <a href="#reservas" className="hover:text-accent transition-colors">Ubicación</a>
            </div>

            {/* Badge de Abierto a la derecha */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-surface-border bg-black/20 backdrop-blur-sm z-10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs uppercase tracking-widest text-foreground/80 font-light">Abierto ahora</span>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          {/* Sutil halo oscuro detrás del texto para máxima legibilidad */}
          <div className="absolute -inset-x-8 -inset-y-12 bg-black/35 rounded-3xl blur-2xl -z-10 pointer-events-none" />

          <motion.p 
            className="text-xs md:text-sm text-accent tracking-[0.3em] uppercase mb-4 font-medium drop-shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            DESDE 2020 · SANTO DOMINGO
          </motion.p>
          <motion.h1 
            className="font-playfair text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 tracking-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Antoniette
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-foreground/95 font-light tracking-[0.25em] uppercase mb-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Rooftop & Cucina Italiana
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a 
              href="#reservas"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent text-[#1A1D18] font-semibold tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/40"
            >
              <span className="relative z-10">Vive la experiencia</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="cursor-pointer"
          >
            <ChevronDown className="text-accent w-8 h-8 opacity-80" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. SOBRE NOSOTROS / CONCEPTO */}
      <section id="nosotros" className="py-24 md:py-32 px-6 relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-8"
          >
            <h2 className="font-playfair text-4xl md:text-5xl text-accent">La Altura del Sabor</h2>
            <div className="h-px w-24 bg-accent/50" />
            <p className="text-foreground/80 text-lg leading-relaxed font-light">
              Ubicado en lo alto de la ciudad, Antoniette redefine la gastronomía italiana fusionando recetas clásicas con técnicas contemporáneas en un ambiente vibrante.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed font-light">
              Nuestra filosofía es simple: ingredientes de la más alta calidad, pasión por el detalle y un entorno que transforma cada cena en una ocasión inolvidable.
            </p>
          </motion.div>
          
          <motion.div 
            className="relative h-[500px] md:h-[600px] w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <Image 
              src="/images/concepto-plato.png" 
              alt="Cucina Italiana Pasta Auténtica" 
              fill
              priority
              className="object-cover rounded-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Divisor fino editorial italiano */}
      <div className="relative flex items-center justify-center py-4 bg-background">
        <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="mx-4 flex items-center gap-2 text-accent/50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-light font-playfair">Antoniette</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        </div>
        <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent" />
      </div>

      {/* 3. MENÚ COMPLETO (Carta Editorial Fina) */}
      <section id="menu" className="py-24 md:py-28 bg-gradient-to-b from-background via-[#20241E] to-background relative overflow-hidden">
        {/* Desvanecidos suaves para eliminar cualquier corte duro */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        {/* Glow ambiental dorado sutil */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-14 space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center gap-2 text-accent text-xs uppercase tracking-[0.3em] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Passione di famiglia dal 1991</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-playfair text-4xl md:text-6xl text-foreground font-normal tracking-tight">
              Il Menù
            </h2>
            <p className="text-foreground/60 italic text-sm md:text-base font-light font-playfair max-w-md mx-auto">
              &ldquo;Antoniette, con il cuore di Che Luis, un assaggio di casa in ogni piatto.&rdquo;
            </p>
          </motion.div>

          {/* Categorías Tabs Elegantes */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14 border-b border-surface-border/40 pb-6">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs md:text-sm tracking-wider uppercase transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-accent text-[#1A1D18] shadow-lg shadow-accent/20 font-bold scale-105' 
                      : 'text-foreground/60 hover:text-foreground hover:bg-background/40 border border-transparent hover:border-surface-border/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Lista Editorial de Platos (2 Columnas) */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={activeCategory}
          >
            {filteredMenu.map((item) => (
              <motion.div 
                key={item.id} 
                variants={fadeUp}
                className="group flex flex-col justify-between p-4 -mx-4 rounded-lg hover:bg-background/40 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-playfair text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors font-medium">
                        {item.name}
                      </h3>
                      {item.badge && (
                        <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-sans font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Línea punteada editorial */}
                    <div className="hidden sm:block flex-grow border-b border-dotted border-foreground/20 mx-2" />

                    <span className="font-playfair text-xl md:text-2xl text-accent font-semibold shrink-0">
                      {item.price}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-foreground/60 font-light leading-relaxed mt-2 pr-4">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Pie del menú con Descarga del Menú PDF y nota legal */}
          <div className="mt-16 pt-10 border-t border-surface-border/60 flex flex-col items-center text-center space-y-4">
            <a 
              href="/menu-antoniette.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent/10 hover:bg-accent text-accent hover:text-[#1A1D18] border border-accent/40 hover:border-accent transition-all duration-300 rounded-sm text-xs uppercase tracking-widest font-semibold shadow-lg group"
            >
              <FileText className="w-4 h-4 text-accent group-hover:text-[#1A1D18] transition-colors" />
              <span>Ver Menú Digital Completo (PDF)</span>
              <span className="text-[10px] text-accent/70 group-hover:text-[#1A1D18]/80 font-normal">· 15 páginas</span>
            </a>
            
            <p className="text-[11px] uppercase tracking-widest text-foreground/40 font-light max-w-lg">
              Los precios ya incluyen IVA · Déjanos saber si posees alguna alergia, intolerancia o restricción de alimentos
            </p>
          </div>
        </div>
      </section>

      {/* Divisor fino editorial italiano */}
      <div className="relative flex items-center justify-center py-4 bg-background">
        <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="mx-4 flex items-center gap-2 text-accent/50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-light font-playfair">Rooftop</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        </div>
        <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent" />
      </div>

      {/* 4. EXPERIENCIA ROOFTOP */}
      <section id="experiencia" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx} 
                  variants={fadeUp}
                  className="text-center p-6 border border-surface-border rounded-lg hover:border-accent/50 transition-colors duration-300"
                >
                  <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-playfair text-xl mb-3">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm font-light leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>



      {/* Divisor fino editorial italiano */}
      <div className="relative flex items-center justify-center py-4 bg-background">
        <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="mx-4 flex items-center gap-2 text-accent/50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-light font-playfair">Esperienze</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        </div>
        <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent" />
      </div>

      {/* 6. TESTIMONIOS */}
      <section className="py-28 bg-gradient-to-b from-background via-[#20241E] to-background relative overflow-hidden">
        {/* Desvanecidos suaves */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <QuoteIcon className="w-16 h-16 text-accent/30 mx-auto mb-8" />
          
          <div className="h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {reviews.length > 0 && (
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center gap-1 text-accent">
                    {[...Array(reviews[testimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="font-playfair text-2xl md:text-3xl italic leading-relaxed text-foreground/90">
                    "{reviews[testimonialIndex].text}"
                  </p>
                  <p className="tracking-widest uppercase text-sm text-foreground/50">
                    — {reviews[testimonialIndex].name}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === testimonialIndex ? 'bg-accent w-8' : 'bg-surface-border hover:bg-accent/50'
                }`}
                aria-label={`Ver testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. UBICACIÓN Y RESERVAS */}
      <section id="reservas" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-10"
          >
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl text-accent mb-4">Visítanos</h2>
              <p className="text-foreground/70">Vive una experiencia única en las alturas. Se recomienda reservar con anticipación.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium uppercase tracking-widest text-sm mb-1">Dirección</h4>
                  <p className="text-foreground/70 font-light">Av. Río Yamboya y Caracas<br/>Santo Domingo</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium uppercase tracking-widest text-sm mb-1">Horario</h4>
                  <p className="text-foreground/70 font-light">Lunes a Sábado<br/>17h00 - 23h00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium uppercase tracking-widest text-sm mb-1">Reservas</h4>
                  <p className="text-foreground/70 font-light">099 897 1785</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/593998971785?text=Hola,%20quisiera%20hacer%20una%20reserva%20en%20Antoniette%20Rooftop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-accent text-[#1A1D18] font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 text-center text-xs rounded-sm shadow-lg shadow-accent/10"
              >
                Reservar por WhatsApp
              </a>
              <a 
                href="tel:0998971785"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-foreground/30 hover:border-accent hover:text-accent text-foreground font-semibold tracking-widest uppercase hover:scale-105 transition-transform duration-300 text-center text-xs rounded-sm"
              >
                Llamar Directo
              </a>
            </div>
          </motion.div>

          {/* Formulario / Mapa */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="h-[400px] md:h-full min-h-[400px] bg-surface rounded-lg overflow-hidden border border-surface-border relative shadow-lg"
          >
            <iframe 
              src="https://www.google.com/maps?q=Antoniette,+Av.+Yamboya,+Santo+Domingo&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
              title="Mapa de Ubicación Antoniette"
              className="absolute inset-0"
            />
          </motion.div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-surface border-t border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
          <h2 className="font-playfair text-3xl text-accent tracking-widest uppercase">
            A<span className="text-foreground">ntoniette</span>
          </h2>
          
          <div className="flex gap-4">
            <a href="https://instagram.com/antoniette.ec" target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full text-foreground/70 hover:text-accent hover:bg-accent/10 transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-foreground/50 font-light mt-8">
            &copy; {new Date().getFullYear()} Antoniette Rooftop & Cucina Italiana. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Icono decorativo de comillas
function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
