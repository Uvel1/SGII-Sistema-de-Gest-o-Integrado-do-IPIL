import SideBar from "@/components/SideBar/commonUsers/professores";
import { TableProfTurma } from "@/components/Table/commonUsers/professores/turma";

export default function ProfTurmasPage() {

  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Turmas Atribuidas</h2>
        <TableProfTurma></TableProfTurma>
      </div>
    </>
  );
}

