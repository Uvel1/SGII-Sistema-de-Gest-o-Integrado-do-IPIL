'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // usePathname para detectar mudanças na URL
import Loader from "../components/Loader"; // Componente de loader
import "./globals.css";

// Importação do ToastContainer e do CSS do react-toastify
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast"; // Importa o Toaster


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Detecta alterações na URL

  useEffect(() => {
    // Ativa o loader quando a URL mudar
    setLoading(true);
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Tempo de exibição do loader (ajustável)

    // Limpa o timeout para evitar comportamentos indesejados
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {loading && <Loader />} {/* Exibe o loader durante a navegação */}
        {children}
        {/* ToastContainer global para exibir notificações */}
        <Toaster 
         position="top-right"
         reverseOrder={false}
         toastOptions={{
           duration: 3000,
           style: {
         background: '#363636',
         color: '#fff',
           },
         }} />
      </body>
    </html>
  );
}
