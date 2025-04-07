import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Importando Tooltip

export function Login() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
          Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Como deseja acessar sua conta?</DialogTitle>
          <DialogDescription>
            Para continuar, selecione a opção correspondente ao seu perfil.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center space-x-4">
          <TooltipProvider>
            {/* Botão Aluno */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/auth/login/aluno" passHref>
                  <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
                    Aluno
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acesse sua área exclusiva como estudante.</p>
              </TooltipContent>
            </Tooltip>

            {/* Botão Funcionário */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/auth/login" passHref>
                  <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
                    Funcionário
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Entre com sua conta institucional.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
