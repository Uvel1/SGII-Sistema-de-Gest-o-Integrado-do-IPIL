"use client";

import { AppSidebar } from "@/components/SideBar/dashboard/admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenuDemo } from "@/components/DropDown/perfilAdmin";
import { MobileSidebar } from "@/components/SideBar/dashboard/admin/mobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col">
        <header className="w-full h-16 bg-white flex-row items-center justify-between p-2 hidden md:flex">
          <SidebarTrigger className="text-blue-700 font-bold hover:bg-blue-700 hover:text-white">
          </SidebarTrigger>
          <DropdownMenuDemo></DropdownMenuDemo>
        </header>
        <MobileSidebar></MobileSidebar>
        {children}
      </div>
    </SidebarProvider>
  );
}
