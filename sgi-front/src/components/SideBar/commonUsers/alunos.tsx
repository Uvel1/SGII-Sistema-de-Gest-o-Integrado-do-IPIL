"use client";

import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PerfilAluno } from "@/components/DropDown/perfilAluno";
import { SidebarOpen,CalendarDays,FileText, FileBadge2, FileBadge } from "lucide-react";
import Link from "next/link";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { href: "/alunos", label: "Boletim", icon: CalendarDays },
    { href: "/alunos/certificado", label: "Certficado", icon: FileBadge2 },
    { href: "/alunos/declaracao", label: "Declaração", icon: FileBadge },
    { href: "/alunos/trasnferencia", label: "Transferência", icon: FileText },
  ];

  return (
    <>
      {/* Header para desktop */}
      <header className="hidden md:fixed md:flex md:flex-row md:w-full md:shadow-lg md:h-14 md:bg-white md:justify-between md:items-center md:pl-16 md:pr-16 z-40">
        <div>
          <img src="/logo/sgi2.png" alt="logo do site" />
        </div>
        <div className="flex flex-row space-x-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-2.5 py-2 text-blue-700 bg-white ${
                pathname === link.href ? "font-bold" : ""
              } hover:font-bold`}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
          <PerfilAluno></PerfilAluno>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <div className="flex fixed w-full flex-col bg-muted/40 md:hidden z-40">
        <div className="flex flex-col lg:gap-4 lg:py-4 lg:pl-4">
          <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 lg:static lg:h-auto lg:border-0 lg:bg-transparent lg:px-6 justify-between">
            <div className="flex flex-row items-center space-x-1">
              <img src="/logo/sgi2.png" alt="logo do site" />
            </div>
            <div className="flex flex-row items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-muted-foreground hover:bg-blue-700 hover:text-white lg:hidden"
                  >
                    <SidebarOpen className="w-5 h-5" />
                    <span className="sr-only">Abrir/Fechar menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="sm:max-w-xs p-0 pl-4 pt-4"
                >
                  <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                  <SheetHeader>
                    <img
                      src="/logo/sgi2.png"
                      alt="logo do site"
                      className="w-24 mb-14"
                    />
                  </SheetHeader>
                  <nav className="grid gap-6 pr-2 text-lg font-medium text-blue-700">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-4 px-2.5 py-2 rounded-lg text-blue-700 font-bold ${
                          pathname === link.href
                            ? "bg-blue-700 text-white"
                            : "hover:bg-blue-700 hover:text-white"
                        }`}
                        prefetch={false}
                      >
                        <link.icon className="w-5 h-5 transition-all" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-row items-center text-blue-700 mt-8 space-x-2">
                    <PerfilAluno></PerfilAluno>
                    <span>Perfil</span>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}
