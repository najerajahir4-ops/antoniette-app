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

// --- Mock Data ---

const MENU_CATEGORIES = ["Entradas", "Pastas", "Pizzas", "Carnes", "Cócteles"];
const MENU_ITEMS = [
  { 
    id: 1, 
    name: "Tabla de Antipasto Antoniette", 
    category: "Entradas", 
    description: "Burrata fresca artesanal, jamón serrano, prosciutto di Parma, quesos curados, aceitunas marinadas, dip dulce y tostas.", 
    price: "$18.00", 
    image: "/images/instagram/antipasto-tabla.jpg" 
  },
  { 
    id: 2, 
    name: "Carpaccio di Manzo", 
    category: "Entradas", 
    description: "Láminas finas de lomo de res, alcaparras baby, lascas de parmesano reggiano y aceite de trufa blanca.", 
    price: "$15.00", 
    image: "https://images.unsplash.com/photo-1544358586-8ab07d720b05?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: 3, 
    name: "Tagliatelle con Bife Tagliata", 
    category: "Pastas", 
    description: "Pasta artesanal fresca al dente, corte jugoso de carne en término medio, albahaca y aceite de oliva virgen extra.", 
    price: "$24.00", 
    image: "/images/instagram/tagliata-pasta-cocktail.jpg" 
  },
  { 
    id: 4, 
    name: "Pasta Lover Experience", 
    category: "Pastas", 
    description: "Taller gastronómico de pasta fresca desde cero: estira, corta, cocina y disfruta con tu acompañante.", 
    price: "$25.00", 
    image: "/images/instagram/pasta-lover-club.jpg" 
  },
  { 
    id: 5, 
    name: "Ravioli di Tartufo", 
    category: "Pastas", 
    description: "Raviolis artesanales rellenos de ricotta y trufa, salsa suave de mantequilla dorada y salvia fresca.", 
    price: "$22.00", 
    image: "https://images.unsplash.com/photo-1587214041042-3ee3f47b59e5?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: 6, 
    name: "Pizza Napolitana con Burrata", 
    category: "Pizzas", 
    description: "Masa madre de lenta fermentación horneada a la piedra, salsa pomodoro, burrata cremosa entera y prosciutto di Parma.", 
    price: "$18.00", 
    image: "/images/instagram/pizza-burrata-chef.jpg" 
  },
  { 
    id: 7, 
    name: "Bistecca alla Fiorentina", 
    category: "Carnes", 
    description: "Corte premium a la parrilla, sal marina en escamas, romero aromático y guarnición de la casa.", 
    price: "$35.00", 
    image: "https://images.unsplash.com/photo-1544025162-882ab2a353d6?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: 8, 
    name: "Cóctel Frozen de Autor", 
    category: "Cócteles", 
    description: "Mixología refrescante de autor con hielo frappé, toques cítricos, hierbabuena fresca y licor artesanal.", 
    price: "$11.00", 
    image: "/images/instagram/cocktail-autor.jpg" 
  },
  { 
    id: 9, 
    name: "Aperol Spritz", 
    category: "Cócteles", 
    description: "Aperol, Prosecco italiano D.O.C., splash de soda y media luna de naranja fresca.", 
    price: "$10.00", 
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600" 
  },
];

const GALLERY_ITEMS = [
  {
    src: "/images/instagram/pizza-burrata-chef.jpg",
    title: "Pizza Artesanal & Burrata",
    desc: "Masa madre horneada con burrata fresca y prosciutto",
    tag: "#PizzaNapoletana",
    link: "https://www.instagram.com/antoniette.ec/"
  },
  {
    src: "/images/instagram/tagliata-pasta-cocktail.jpg",
    title: "Tagliata di Manzo & Pasta",
    desc: "Cortes seleccionados con pasta fresca y coctelería",
    tag: "#CucinaItaliana",
    link: "https://www.instagram.com/antoniette.ec/"
  },
  {
    src: "/images/instagram/antipasto-tabla.jpg",
    title: "Tabla de Antipasto Antoniette",
    desc: "Burrata, embutidos italianos, quesos curados y tostas",
    tag: "#Aperitivo",
    link: "https://www.instagram.com/antoniette.ec/"
  },
  {
    src: "/images/instagram/pasta-lover-club.jpg",
    title: "Pasta Lover Club",
    desc: "Talleres para estirar, cortar y crear pasta desde cero",
    tag: "#PastaFattaInCasa",
    link: "https://www.instagram.com/antoniette.ec/"
  },
  {
    src: "/images/instagram/pasta-experience-couple.jpg",
    title: "Momentos en el Rooftop",
    desc: "Celebraciones y cenas bajo las luces de nuestra terraza",
    tag: "#RooftopVibes",
    link: "https://www.instagram.com/antoniette.ec/"
  },
  {
    src: "/images/instagram/cocktail-autor.jpg",
    title: "Coctelería de Autor",
    desc: "Mixología refrescante para acompañar cada velada",
    tag: "#MixologiaAntoniette",
    link: "https://www.instagram.com/antoniette.ec/"
  }
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

  useEffect(() => {
    async function loadData() {
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
          <div className="absolute inset-0 bg-black/35 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/15 to-black/55 z-10" />
          
          {/* Grain texture overlay para toque editorial */}
          <div className="absolute inset-0 z-10 opacity-15 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>

          <Image 
            src="/images/hero-real-antoniette.jpg" 
            alt="Interior y terraza exclusiva de Antoniette Italian Rooftop" 
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

            {/* Navegación Desktop */}
            <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-foreground/80 font-medium">
              <a href="#nosotros" className="hover:text-accent transition-colors">Nosotros</a>
              <a href="#menu" className="hover:text-accent transition-colors">Menú</a>
              <a href="#experiencia" className="hover:text-accent transition-colors">Experiencia</a>
              <a href="#reservas" className="hover:text-accent transition-colors">Ubicación</a>
            </div>

            {/* CTA Reservar Mesa */}
            <div className="flex items-center gap-4">
              <a 
                href="#reservas"
                className="px-5 py-2.5 border border-accent text-accent hover:bg-accent hover:text-[#1A1D18] transition-colors duration-300 rounded-sm text-xs uppercase tracking-widest font-semibold"
              >
                Reservar Mesa
              </a>
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
      <section id="menu" className="py-24 bg-surface relative">
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

      {/* 5. GALERÍA / INSTAGRAM FEED (@antoniette.ec) */}
      <section className="py-20 bg-background border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.25em] mb-2 font-medium">
              <InstagramIcon className="w-4 h-4" />
              <span>Experiencia & Comunidad</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-5xl text-foreground">
              @antoniette.ec en Instagram
            </h2>
            <p className="text-foreground/60 text-sm mt-2 max-w-md font-light">
              Revive los momentos, platos de autor y celebraciones en las alturas de nuestro rooftop.
            </p>
          </div>
          <a 
            href="https://www.instagram.com/antoniette.ec/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-border border border-surface-border hover:border-accent text-xs uppercase tracking-widest text-foreground hover:text-accent transition-all rounded-full group w-fit shadow-md"
          >
            <span>Ver perfil en Instagram</span>
            <InstagramIcon className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.a 
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden group rounded-xl border border-surface-border bg-surface block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-90"
              />
              
              {/* Tag pill */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider text-accent font-medium border border-white/10">
                  {item.tag}
                </span>
              </div>

              {/* Bottom overlay with caption and Instagram icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-playfair text-lg text-white font-semibold">{item.title}</h4>
                    <p className="text-xs text-white/80 line-clamp-1 font-light mt-0.5">{item.desc}</p>
                  </div>
                  <div className="p-2.5 bg-accent/20 rounded-full text-accent backdrop-blur-sm shrink-0">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.a>
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
