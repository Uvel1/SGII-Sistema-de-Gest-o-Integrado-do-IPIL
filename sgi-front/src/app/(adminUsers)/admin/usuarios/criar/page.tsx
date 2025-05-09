import React from "react";
import { List } from "lucide-react";
import { Metadata } from "next";
import CriarUsuarioPage from "@/components/card/Admin/CriarUsuarios"; // <— default import

export const metadata: Metadata = {
  title: "Criar usuários | SGI-IPIL",
  description: "Sistema de Gestão Integrado do IPIL",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function CriarUsuariosPage() {
  return (
    <div className="w-full p-2 pt-14 md:pt-2">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center space-x-2 mb-4">
        <List className="w-6 h-6" />
        <span>Criar usuários</span>
      </h2>
      <CriarUsuarioPage/>
    </div>
  );
}
