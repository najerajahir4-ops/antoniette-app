"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppButton({
  phoneNumber = "593998971785",
  defaultMessage = "Hola, me gustaría más información y hacer una reserva en Antoniette.",
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip / Mensaje flotante al pasar el cursor */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center px-4 py-2 bg-surface/95 backdrop-blur-md border border-surface-border text-foreground text-xs font-medium rounded-full shadow-xl shadow-black/40 whitespace-nowrap pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2 animate-pulse" />
            <span>¿En qué podemos ayudarte? <strong>Escríbenos</strong></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp (+593 99 897 1785)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#1ea952] to-[#25D366] text-white shadow-xl shadow-[#25D366]/30 border border-white/20 transition-all duration-300"
      >
        {/* Halo de resplandor al hover */}
        <span className="absolute inset-0 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Icono de WhatsApp oficial */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-6 drop-shadow-sm"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.766.8 5.342 2.188 7.518L2.05 30l6.685-2.09A13.918 13.918 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm8.01 19.86c-.33.93-1.638 1.725-2.678 1.95-.71.15-1.637.27-4.757-1.02-3.99-1.65-6.57-5.7-6.77-5.96-.2-.27-1.62-2.15-1.62-4.11 0-1.95 1.02-2.91 1.38-3.31.36-.4.78-.5 1.04-.5.26 0 .52.002.75.012.24.01.56-.09.87.66.33.79 1.12 2.73 1.22 2.93.1.2.16.44.03.7-.13.26-.2.42-.4.65-.2.23-.42.51-.6.69-.2.2-.41.42-.18.82.23.39 1.02 1.68 2.19 2.72 1.51 1.34 2.78 1.76 3.18 1.96.39.2.62.17.85-.1.23-.26.98-1.14 1.24-1.53.26-.39.52-.33.88-.2.36.13 2.29 1.08 2.68 1.28.39.2.65.3.75.46.1.16.1 1.06-.23 1.99z" />
        </svg>
      </motion.a>
    </div>
  );
}
