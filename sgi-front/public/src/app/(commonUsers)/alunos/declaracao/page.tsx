import SideBar from "@/components/SideBar/commonUsers/alunos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function Declaracao() {
  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-16 md:pt-24">
        <h2 className="text-2xl font-bold text-blue-700">
          Solicitação de Declaração
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-4">
          <Card className="p-4">
            <CardHeader>
              <div className="w-full flex flex-row items-center justify-between text-blue-700 font-semibold">
                <h2>Formulário de Solicitação</h2>
                <Send></Send>
              </div>
            </CardHeader>
            <CardDescription>
              Preencha corretamente o formulário
            </CardDescription>
            <CardContent className="w-fulll mt-4">
              <form action="" className="w-full flex flex-col items-center justify-center space-y-2">
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <Input
                    type="text"
                    name="nome"
                    id="nome"
                    placeholder="Nome"
                    className="w-full"
                  ></Input>
                  <Input
                    type="text"
                    name="bi"
                    id="bi"
                    placeholder="Nº BI"
                    className="w-full"
                  ></Input>
                </div>
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="w-full"
                  ></Input>
                  <Input
                    type="text"
                    name="tel"
                    id="tel"
                    placeholder="Tel"
                    className="w-full"
                  ></Input>
                </div>
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <select className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona a classe</option>
                    <option value="10ª Classe">10ª Classe</option>
                    <option value="11ª Classe">11ª Classe</option>
                    <option value="12ª Classe">12ª Classe</option>
                  </select>
                  <select className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona o curso</option>
                    <option value="Téc. Informática">Téc. Informática</option>
                    <option value="Informática de Gestão">Informática de Gestão</option>
                  </select>
                </div>
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <select className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona a turma</option>
                    <option value="II10A">II10A</option>
                    <option value="II10B">II10B</option>
                    <option value="IG10A">IG10A</option>
                    <option value="IG10B">IG11B</option>
                  </select>
                  <select className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona o curso</option>
                    <option value="Téc. Informática">Téc. Informática</option>
                    <option value="Informática de Gestão">Informática de Gestão</option>
                  </select>
                </div>
                <textarea className="w-full rounded-lg p-4 bg-gray-100 outline-blue-700 border"></textarea>
                <div>
                    <Input type="submit" value={'Submeter'} className="bg-blue-700 text-white font-bold hover:bg-blue-800"></Input>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card></Card>
        </div>
      </div>
    </>
  );
}
