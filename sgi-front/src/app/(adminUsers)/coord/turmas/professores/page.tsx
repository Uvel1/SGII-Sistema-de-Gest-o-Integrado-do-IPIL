import { TableProf } from "@/components/Table/dashboard/professores";
import { List } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professores | SGI-IPIL",
  description: "Sistema de Gestão Integrado do IPIL",
  icons: {
    icon: "/logo/logo.png"
  },
}


export default function TurmasPage() {
  return (
    <>
      <div className="w-full p-2 pt-14 md:pt-2">
        <h2 className="text-2xl font-bold text-blue-700 flex flex-row items-center space-x-2"><List></List><span>Lista de Professores</span></h2>
        <TableProf></TableProf>
      </div>
    </>
  );
}
