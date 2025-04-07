"use client";

import { useState } from "react";
import {
  SidebarOpen,
  SidebarClose,
  Home,
  Notebook,
  List,
  Archive,
  Send,
  Inbox,
  Users2,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Ínicio", icon: Home },
    { href: "/admin/pedidos/recebidos", label: "Pedidos Recedidos", icon: Inbox },
    { href: "/admin/pedidos/enviados", label: "Pedidos Enviados", icon: Send },
    { href: "/admin/turmas", label: "Turmas", icon: Notebook },
    { href: "/admin/turmas/alunos", label: "Alunos", icon: List },
    { href: "/admin/turmas/professores", label: "Professores", icon: List },
    { href: "/admin/documentos", label: "Documentos", icon: Archive },
    { href: "/admin/usuarios", label: "Usuários", icon: Users2 },
    { href: "/admin/perfil", label: "Perfil", icon: User2 },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Botão para abrir a Sidebar */}
      <div className="bg-white border w-full fixed z-10 p-1 flex flex-row items-center justify-between md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="text-blue-700 hover:bg-blue-700 hover:text-white md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <SidebarClose/>
          ) : (
            <SidebarOpen/>
          )}
          <span className="sr-only">
            {isOpen ? "Fechar menu" : "Abrir menu"}
          </span>
        </Button>
        <img src="/logo/sgi2.png" alt="logo"/>
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <img src="/logo/sgi2.png" alt="Logo do site" className="w-24" />
          <Button
            variant="outline"
            size="icon"
            className="text-blue-700 hover:bg-blue-700 hover:text-white"
            onClick={toggleSidebar}
          >
            <SidebarClose/>
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Navegação */}
        <nav className="mt-6 px-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg text-blue-700 font-bold ${
                pathname === link.href
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700 hover:text-white"
              }`}
              onClick={toggleSidebar} // Fecha a sidebar ao clicar no link
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
