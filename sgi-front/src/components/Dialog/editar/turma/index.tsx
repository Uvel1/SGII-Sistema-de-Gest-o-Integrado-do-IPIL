import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

export function EditarTurma() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-600">
          <Edit></Edit>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-yellow-500">Editar</DialogTitle>
          <DialogDescription>
            Faça as suas alterações e clica em salvar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <select className="border rounded-lg p-2 outline-blue-700">
            <option value="">Selecionar Turma</option>
            <option value="IG10A">IG10A</option>
          </select>
          <select className="border rounded-lg p-2 outline-blue-700">
            <option value="">Selecionar Classe</option>
            <option value="10ª Classe">10ª Classe</option>
            <option value="11ª Classe">11ª Classe</option>
            <option value="12ª Classe">12ª Classe</option>
            <option value="13ª Classe">13ª Classe</option>
          </select>
          <Input
            placeholder="informe a sala"
            className="max-w-sm outline-blue-700 border-blue-700"
          />
          <select className="border rounded-lg p-2 outline-blue-700">
            <option value="">Selecionar o Turno</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
          <select className="border rounded-lg p-2 outline-blue-700">
            <option value="">Selecionar Curso</option>
            <option value="10ª Classe">10ª Classe</option>
            <option value="11ª Classe">11ª Classe</option>
            <option value="12ª Classe">12ª Classe</option>
            <option value="13ª Classe">13ª Classe</option>
          </select>
          <Button className="bg-blue-700 hover:bg-blue-800">Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
