import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send} from "lucide-react";

export function ResponderPedido() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
          <Send></Send>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-green-500">Responder</DialogTitle>
          <DialogDescription>
            Faça as suas alterações e clica em salvar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
      </DialogContent>
    </Dialog>
  );
}
