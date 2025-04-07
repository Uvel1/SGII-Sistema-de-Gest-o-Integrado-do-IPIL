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

export function VerificarConta() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
          Verificar Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Verificação de Conta</DialogTitle>
          <DialogDescription>
            Apenas alunos podem verificar sua conta. Se for um estudante, continue para concluir a verificação.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center space-x-4">
          <TooltipProvider>
            {/* Botão Continuar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/auth/verificarConta" passHref>
                  <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
                    Continuar
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Avance para verificar sua conta de aluno.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
