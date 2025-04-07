import { TableAdminAlunos } from "@/components/Table/dashboard/alunos";
import { List } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alunos | SGI-IPIL",
  description: "Sistema de Gestão Integrado do IPIL",
}

export default function AlunosPage() {
  return (
    <>
      <div className="w-full p-2 pt-16 md:pt-0">
        <h2 className="text-2xl font-bold text-blue-700 flex flex-row items-center space-x-2"><List></List><span>Lista de Alunos</span></h2>
        <TableAdminAlunos></TableAdminAlunos>
      </div>
    </>
  );
}
