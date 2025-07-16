import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import SessionProviderClient from "../components/SessionProviderClient";
import ToastProvider from "../components/Toast";
import { Inter, Montserrat } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: {
    default: "Squat Store - Ropa y Accesorios de Moda",
    template: "%s | Squat Store",
  },
  description:
    "Descubre las últimas tendencias en ropa, zapatos y accesorios. Envío gratis en Venezuela. Calidad y estilo en cada prenda.",
  keywords: [
    "ropa",
    "zapatos",
    "accesorios",
    "moda",
    "Venezuela",
    "tienda online",
    "fashion",
  ],
  authors: [{ name: "Squat Store" }],
  creator: "Squat Store",
  publisher: "Squat Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "/",
    title: "Squat Store - Ropa y Accesorios de Moda",
    description:
      "Descubre las últimas tendencias en ropa, zapatos y accesorios. Envío gratis en Venezuela.",
    siteName: "Squat Store",
    images: [
      {
        url: "/LogoNegro.png",
        width: 800,
        height: 600,
        alt: "Squat Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squat Store - Ropa y Accesorios de Moda",
    description:
      "Descubre las últimas tendencias en ropa, zapatos y accesorios.",
    images: ["/LogoNegro.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/LogoNegro.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="antialiased">
        <SessionProviderClient>
          <ToastProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </SessionProviderClient>
      </body>
    </html>
  );
}
