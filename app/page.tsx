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
  UtensilsCrossed 
} from "lucide-react";
import { getActiveReviews } from "@/app/actions/reviews";
import { ReviewForm } from "@/components/store/ReviewForm";
import { getCurrentUserAction } from "@/app/actions/auth";
import { LogoutButton } from "@/components/ui/LogoutButton";
import Link from "next/link";

// --- Mock Data ---

const MENU_CATEGORIES = ["Entradas", "Pastas", "Carnes", "Postres", "Cócteles"];
const MENU_ITEMS = [
  { id: 1, name: "Burrata al Pomodoro", category: "Entradas", description: "Burrata fresca, tomates cherry confitados, pesto de albahaca.", price: "$12.00", image: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Carpaccio de Res", category: "Entradas", description: "Láminas de lomo fino, alcaparras, parmesano, aceite de trufa.", price: "$15.00", image: "https://images.unsplash.com/photo-1544358586-8ab07d720b05?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Ravioli di Tartufo", category: "Pastas", description: "Raviolis artesanales rellenos de ricotta y trufa, salsa de mantequilla y salvia.", price: "$22.00", image: "https://images.unsplash.com/photo-1587214041042-3ee3f47b59e5?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Linguine ai Frutti di Mare", category: "Pastas", description: "Pasta con mariscos frescos, salsa de tomate y vino blanco.", price: "$25.00", image: "https://images.unsplash.com/photo-1563379926898-05f45c514605?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Bistecca alla Fiorentina", category: "Carnes", description: "Corte grueso a la parrilla, sal marina, romero.", price: "$35.00", image: "https://images.unsplash.com/photo-1544025162-882ab2a353d6?auto=format&fit=crop&q=80&w=600" },
  { id: 6, name: "Tiramisú Clásico", category: "Postres", description: "Savoiardi, mascarpone, café espresso, cacao.", price: "$9.00", image: "https://images.unsplash.com/photo-1571115177098-24c42d5e050c?auto=format&fit=crop&q=80&w=600" },
  { id: 7, name: "Aperol Spritz", category: "Cócteles", description: "Aperol, Prosecco, soda, rodaja de naranja.", price: "$10.00", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600" },
  { id: 8, name: "Negroni", category: "Cócteles", description: "Gin, Campari, Vermouth Rosso.", price: "$12.00", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600" },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1554679665-f5537f187268?auto=format&fit=crop&q=80&w=800",
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
  const [activeCategory, setActiveCategory] = useState("Entradas");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [reviews, setReviews] = useState<any[]>(TESTIMONIALS);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const userRes = await getCurrentUserAction();
      if (userRes) setCurrentUser(userRes);

      const reviewsRes = await getActiveReviews();
      if (reviewsRes.reviews && reviewsRes.reviews.length > 0) {
        setReviews(reviewsRes.reviews);
      }
    }
    loadData();
  }, []);

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
        {/* Background Parallax Image & Overlays */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Base darkening overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40 z-10" />
          
          {/* Grain texture overlay para toque editorial */}
          <div className="absolute inset-0 z-10 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>

          <Image 
            src="/images/hero-bg.png" 
            alt="Antoniette Rooftop con vista a la ciudad" 
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Navbar */}
        <motion.nav 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1A1D18]/95 backdrop-blur-md py-4 border-b border-surface-border shadow-lg shadow-black/20' : 'bg-transparent py-6'}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            {/* Logo y Badge de Abierto */}
            <div className="flex items-center gap-6">
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
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-surface-border bg-black/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs uppercase tracking-widest text-foreground/80 font-light">Abierto ahora</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  {currentUser.role === 'ADMIN' && (
                    <Link href="/admin" className="text-xs uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors hidden sm:block">
                      Admin
                    </Link>
                  )}
                  {currentUser.role === 'EMPLEADO' && (
                    <Link href="/empleado" className="text-xs uppercase tracking-widest text-accent font-semibold hover:text-accent-hover transition-colors hidden sm:block">
                      Empleado
                    </Link>
                  )}
                  {currentUser.role !== 'ADMIN' && currentUser.role !== 'EMPLEADO' && (
                    <Link href="/mis-reservas" className="text-xs uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors hidden sm:block">
                      Mis Reservas
                    </Link>
                  )}
                  <LogoutButton className="text-xs uppercase tracking-widest text-red-400/80 hover:text-red-400 transition-colors bg-transparent border-0 p-0 cursor-pointer">
                    Salir
                  </LogoutButton>
                </div>
              ) : (
                <Link href="/login" className="text-xs uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors">
                  Iniciar Sesión
                </Link>
              )}

              {(!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'EMPLEADO')) && (
                <Link 
                  href={currentUser ? '/reservar' : '/login?redirect=/reservar'}
                  className="px-5 py-2 border border-accent text-accent hover:bg-accent hover:text-background transition-colors duration-300 rounded-sm text-xs uppercase tracking-widest font-semibold"
                >
                  Reservar Mesa
                </Link>
              )}
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.p 
            className="text-xs md:text-sm text-accent tracking-[0.3em] uppercase mb-6 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            DESDE 2020 · SANTO DOMINGO
          </motion.p>
          <motion.h1 
            className="font-playfair text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 tracking-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Antoniette
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-foreground/90 font-light tracking-[0.2em] uppercase mb-10 drop-shadow-md"
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
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-accent text-[#1A1D18] font-semibold tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform duration-300"
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
      <section className="py-24 md:py-32 px-6 relative overflow-hidden bg-background">
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
            <div className="absolute inset-0 bg-accent/20 translate-x-4 translate-y-4 rounded-sm" />
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

      {/* 3. MENÚ DESTACADO */}
      <section className="py-24 bg-surface relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-playfair text-4xl md:text-5xl text-accent">Il Menù</h2>
            <p className="text-foreground/70 tracking-widest uppercase text-sm">Selección de Autor</p>
          </motion.div>

          {/* Categorías Tabs */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm md:text-base tracking-widest uppercase transition-all duration-300 pb-2 border-b-2 ${
                  activeCategory === cat 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-foreground/50 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Platos */}
          <motion.div 
            className="grid md:grid-cols-2 gap-x-12 gap-y-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={activeCategory} // Force re-render on category change
          >
            {filteredMenu.map((item) => (
              <motion.div 
                key={item.id} 
                variants={fadeUp}
                className="group flex gap-6 items-center p-4 hover:bg-background/50 rounded-lg transition-colors duration-300 cursor-pointer"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-playfair text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors">{item.name}</h3>
                    <span className="font-playfair text-xl text-accent">{item.price}</span>
                  </div>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <a href="#reservas" className="text-accent uppercase tracking-widest text-sm border-b border-accent pb-1 hover:text-accent-hover transition-colors">
              Descargar Menú Completo
            </a>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCIA ROOFTOP */}
      <section className="py-24 bg-background">
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

      {/* 5. GALERÍA / AMBIENTE (Masonry/Grid) */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {GALLERY_IMAGES.map((src, idx) => (
            <motion.div 
              key={idx}
              className="relative aspect-square overflow-hidden group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
            >
              <img 
                src={src} 
                alt={`Ambiente ${idx}`} 
                className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <InstagramIcon className="w-8 h-8 text-accent" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section className="py-32 bg-surface relative overflow-hidden">
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

      {/* SECCIÓN ESCRIBIR RESEÑA */}
      <section className="py-16 bg-background border-t border-surface-border">
        <ReviewForm user={currentUser} />
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
                  <p className="text-foreground/70 font-light">QR3R+3QC, Av. Yamboya<br/>Santo Domingo</p>
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
              <Link 
                href={currentUser ? '/reservar' : '/login?redirect=/reservar'}
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-accent text-[#1A1D18] font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 text-center text-xs rounded-sm"
              >
                Reservar Mesa Online
              </Link>
              <a 
                href="https://wa.me/593998971785?text=Hola,%20quisiera%20hacer%20una%20reserva%20en%20Antoniette%20Rooftop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-semibold tracking-widest uppercase hover:scale-105 transition-transform duration-300 text-center text-xs rounded-sm"
              >
                Reservar por WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Formulario / Mapa */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="h-[400px] md:h-full min-h-[400px] bg-surface rounded-lg overflow-hidden border border-surface-border relative grayscale hover:grayscale-0 transition-all duration-700"
          >
            <iframe 
              src="https://www.google.com/maps?q=QR3R%2B3QC,+Av.+Yamboya,+Santo+Domingo&output=embed" 
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
