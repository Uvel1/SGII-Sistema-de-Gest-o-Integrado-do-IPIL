import SideBar from "@/components/SideBar/commonUsers/professores";
import { TableNotas } from "@/components/Table/commonUsers/professores/notas";

export default function ProfNotasPage() {
  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Lista de Alunos</h2>
        <TableNotas></TableNotas>
      </div>
    </>
  );
}
