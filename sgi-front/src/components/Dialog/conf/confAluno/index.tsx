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

export function ConfAluno() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 text-white font-bold hover:bg-blue-800">
          Editar Senha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Editar Senha</DialogTitle>
          <DialogDescription>
            Faça as suas alterações e clica em salvar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Input
              type="password"
              id="senha-atual"
              placeholder="senha atual"
              className="col-span-3 w-full"
            />
            <Input
              type="password"
              id="nova-senha"
              placeholder="nova senha"
              className="col-span-3 w-full"
            />
            <Input
              type="password"
              id="conf-senha"
              placeholder="confirmar senha"
              className="col-span-3 w-full"
            />
          </div>
          <Button type="submit" className="bg-blue-700 text-white font-bold hover:bg-blue-800">Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
