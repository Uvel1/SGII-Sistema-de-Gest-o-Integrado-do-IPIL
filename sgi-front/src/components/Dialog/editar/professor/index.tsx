import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

export function EditarProfessor() {
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
        <div className="grid gap-4 py-4"></div>
      </DialogContent>
    </Dialog>
  );
}
