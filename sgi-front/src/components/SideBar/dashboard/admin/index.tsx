"use client";

import React, { useState, useEffect } from "react";
import {
  Archive,
  Home,
  Inbox,
  List,
  Notebook,
  School2,
  Send,
  ShoppingBag,
  UserRoundPlus,
  TableOfContents,
  Users2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AppSidebarProps {
  userRole: "admin" | "admin";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const basePath = userRole === "admin" ? "/admin" : "/admin";

  const routeMapping: Record<string, { menu: string; subItem?: string }> = {
    [`${basePath}`]: { menu: "home" },
    [`${basePath}/pedidos/recebidos`]: { menu: "pedidos", subItem: "recebidos" },
    [`${basePath}/pedidos/enviados`]: { menu: "pedidos", subItem: "enviados" },
    [`${basePath}/turmas`]: { menu: "turmas", subItem: "turmas" },
    [`${basePath}/turmas/alunos`]: { menu: "turmas", subItem: "alunos" },
    [`${basePath}/turmas/professores`]: { menu: "turmas", subItem: "professores" },
    [`${basePath}/documentos`]: { menu: "documentos" },
    [`${basePath}/coordenacao`]: { menu: "coordenacao" },
    [`${basePath}/usuarios/criar`]: { menu: "usuarios", subItem: "criar" },
    [`${basePath}/usuarios/gerir`]: { menu: "usuarios", subItem: "gerir" },
  };

  useEffect(() => {
    if (userRole === "admin" && pathname.startsWith("/admin")) {
      router.replace(pathname.replace("/admin", "/admin"));
    }
    if (userRole === "admin" && pathname.startsWith("/admin")) {
      router.replace(pathname.replace("/amin", "/admin"));
    }
  }, [pathname, router, userRole]);

  useEffect(() => {
    const currentRoute = routeMapping[pathname];
    if (currentRoute) {
      setActiveMenu(currentRoute.menu);
      setActiveSubItem(currentRoute.subItem || null);
    } else {
      setActiveMenu(null);
      setActiveSubItem(null);
    }
  }, [pathname, routeMapping]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleSetActive = (menu: string, subItem: string | null = null) => {
    setActiveMenu(menu);
    setActiveSubItem(subItem);
  };

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="bg-blue-950">
        <img src="/logo/sgi-branco3.png" alt="logo" className="w-36" />
      </SidebarHeader>
      <SidebarContent className="bg-blue-950 text-white font-bold">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link
                  href={`${basePath}`}
                  className={`flex flex-row space-x-2 items-center p-2 rounded-lg ${
                    activeMenu === "home"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => handleSetActive("home")}
                >
                  <Home />
                  <span className="text-sm">Ínicio</span>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <div
                  className={`flex flex-row justify-between items-center p-2 rounded-lg cursor-pointer ${
                    activeMenu === "pedidos"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => toggleDropdown("pedidos")}
                >
                  <div className="flex flex-row space-x-2 items-center">
                    <ShoppingBag />
                    <span className="text-sm">Pedidos</span>
                  </div>
                </div>
                {openDropdown === "pedidos" && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/pedidos/recebidos`}
                        className={`flex flex-row space-x-2 items-center p-1 rounded-lg ${
                          activeSubItem === "recebidos"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("pedidos", "recebidos")}
                      >
                        <Inbox className="w-4 h-4" />
                        <span className="text-sm">Recebidos</span>
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/pedidos/enviados`}
                        className={`flex flex-row space-x-2 items-center p-1 rounded-lg ${
                          activeSubItem === "enviados"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("pedidos", "enviados")}
                      >
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Enviados</span>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <div
                  className={`flex flex-row justify-between items-center p-2 rounded-lg cursor-pointer ${
                    activeMenu === "turmas"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => toggleDropdown("turmas")}
                >
                  <div className="flex flex-row space-x-2 items-center">
                    <Notebook />
                    <span className="text-sm">Turmas</span>
                  </div>
                </div>
                {openDropdown === "turmas" && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/turmas`}
                        className={`flex flex-row space-x-2 items-center p-1 rounded-lg ${
                          activeSubItem === "turmas"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("turmas", "turmas")}
                      >
                        <List className="w-4 h-4" />
                        <span className="text-sm">Turmas</span>
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/turmas/alunos`}
                        className={`flex flex-row space-x-2 items-center p-1 rounded-lg ${
                          activeSubItem === "alunos"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("turmas", "alunos")}
                      >
                        <List className="w-4 h-4" />
                        <span className="text-sm">Alunos</span>
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/turmas/professores`}
                        className={`flex flex-row space-x-2 items-center p-1 rounded-lg ${
                          activeSubItem === "professores"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("turmas", "professores")}
                      >
                        <List className="w-4 h-4" />
                        <span className="text-sm">Professores</span>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link
                  href={`${basePath}/documentos`}
                  className={`flex flex-row space-x-2 items-center p-2 rounded-lg ${
                    activeMenu === "documentos"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => handleSetActive("documentos")}
                >
                  <Archive />
                  <span className="text-sm">Documentos</span>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link
                  href={`${basePath}/coordenacao`}
                  className={`flex flex-row space-x-2 items-center p-2 rounded-lg ${
                    activeMenu === "coordenacao"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => handleSetActive("coordenacao")}
                >
                  <School2 />
                  <span className="text-sm">Coordenação</span>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <div
                  className={`flex justify-between items-center p-2 rounded-lg cursor-pointer space-x-2 ${
                    activeMenu === "usuarios"
                      ? "bg-white text-blue-700"
                      : "hover:bg-white hover:text-blue-700"
                  }`}
                  onClick={() => toggleDropdown("usuarios")}
                >
                  <div className="flex items-center space-x-2">
                    <Users2 />
                    <span className="text-sm">Usuários</span>
                  </div>
                </div>
                {openDropdown === "usuarios" && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/usuarios/criar`}
                        className={`flex items-center space-x-2 p-1 rounded-lg ${
                          activeSubItem === "create"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("usuarios", "criar")}
                      >
                        <UserRoundPlus className="w-4 h-4" />
                        <span className="text-sm">Criar</span>
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href={`${basePath}/usuarios/gerenciar`}
                        className={`flex items-center space-x-2 p-1 rounded-lg ${
                          activeSubItem === "manage"
                            ? "text-blue-700"
                            : "hover:text-blue-700"
                        }`}
                        onClick={() => handleSetActive("usuarios", "gerenciar")}
                      >
                        <TableOfContents className="w-4 h-4" />
                        <span className="text-sm">Gerenciar</span>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
