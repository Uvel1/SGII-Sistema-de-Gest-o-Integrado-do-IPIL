import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function AdminPedidosPage() {
  return (
    <>
      <div className="w-full p-4 pt-16 md:pt-0">
        <h2 className="text-2xl font-bold text-blue-700">
          Enviar Pedidos
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
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email da entidade"
                    className="w-full"
                  ></Input>
                </div>
                <textarea className="w-full rounded-lg p-4 bg-gray-100 outline-blue-700 border" placeholder="Assunto..."></textarea>
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
