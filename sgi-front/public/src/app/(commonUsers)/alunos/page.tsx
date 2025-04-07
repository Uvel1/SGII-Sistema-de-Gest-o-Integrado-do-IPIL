import SideBar from "@/components/SideBar/commonUsers/alunos";
import { TableBoletim } from "@/components/Table/commonUsers/alunos/boletim";

export default function AlunoHomePage() {
  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Boletim de Notas</h2>
        <TableBoletim></TableBoletim>
      </div>
    </>
  );
}
