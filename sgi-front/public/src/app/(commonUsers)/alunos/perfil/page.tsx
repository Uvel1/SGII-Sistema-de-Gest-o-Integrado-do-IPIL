import SideBar from "@/components/SideBar/commonUsers/alunos";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PerfilProf() {
  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Perfil</h2>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <Avatar className="w-72 h-72">
            <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
            <AvatarFallback className="bg-blue-700 text-white">
              <span>SC</span>
            </AvatarFallback>
          </Avatar>
          <h3 className="text-blue-700 font-bold text-2xl">Abel Mpendani Eduardo</h3>
          <div className="w-full h-auto md:w-[800px] h-16 border-2 border-blue-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold text-blue-700">Curso</h2>
              <span className="text-blue-700">Informática de Gestão</span>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold text-blue-700">Email</h2>
              <span className="text-blue-700 text-nowrap text-ellipsis overflow-hidden w-44">abelmpendanieduardo34@gmail.com</span>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold text-blue-700">Telefone</h2>
              <span className="text-blue-700">938294016</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
