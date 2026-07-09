import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antoniette | Rooftop & Cucina Italiana",
  description: "Cucina Italiana con vista a la ciudad en Río Yamboya y Caracas. Reserva tu experiencia gastronómica.",
  openGraph: {
    title: "Antoniette | Rooftop & Cucina Italiana",
    description: "Cucina Italiana con vista a la ciudad. Reserva tu experiencia gastronómica.",
    type: "website",
    locale: "es_EC",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
