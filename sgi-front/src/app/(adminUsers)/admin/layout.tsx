"use client"; // Torna o componente um Client Component

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Importação correta no App Router
import { AppSidebar } from "@/components/SideBar/dashboard/admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PerfilAdmin } from "@/components/DropDown/perfilAdmin";
import { MobileSidebar } from "@/components/SideBar/dashboard/admin/mobile";
import Loader from "@/components/Loader"; // Importando o loader

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Obtém a rota atual

  // Simula a mudança de rota para ativar o loader
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Tempo curto para simular carregamento
    return () => clearTimeout(timeout);
  }, [pathname]); // Reage à mudança da URL

  // Extrai o primeiro segmento da URL para identificar o perfil (coord ou admin)
  const segments = pathname.split("/");
  const role = segments[1]; // Ex.: "coord", "admin", etc.

  return (
    <SidebarProvider>
      <AppSidebar userRole={role === "admin" ? "admin" : "admin"} />
      <div className="w-full flex flex-col">
        <header className="w-full h-12 bg-white flex-row items-center border justify-between p-2 hidden md:flex">
          <SidebarTrigger
            className="text-blue-700 font-bold hover:bg-blue-700 hover:text-white"
            variant={"outline"}
          />
          {role === "admin" && <PerfilAdmin />}
        </header>
        <MobileSidebar />

        {/* Exibe o loader enquanto a página carrega */}
        {loading && <Loader />}

        {children}
      </div>
    </SidebarProvider>
  );
}
