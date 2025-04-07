import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";

interface ApagarTurmaProps {
  id: number; // ou string, conforme o identificador utilizado
}

export function ApagarTurma({ id }: ApagarTurmaProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Deletando pedido com id:", id);
      // Chamada à API para deletar o pedido com o id recebido
      await axios.delete(`http://localhost:3333/turmas/${id}`);
      // Aqui você pode adicionar uma lógica para atualizar a UI ou notificar o usuário
    } catch (error) {
      console.error("Erro ao apagar o pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600">
          <Trash2></Trash2>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">Tem certeza absoluta que quer apagar?</AlertDialogTitle>
          <AlertDialogDescription>
            Está ação vai apagar o arquivo permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
          disabled={isLoading}
          >
            {isLoading ? "Apagando..." : "Continuar"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
