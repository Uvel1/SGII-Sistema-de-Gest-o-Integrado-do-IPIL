"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface DetalhesPedidosRecebidosProps {
  id: number;
}

export type Pedido = {
  desc: string;
  status?: string;
  resposta?: string;
  tipo?: string;
  documentoUrl?: string; // URL do ficheiro XLS aprovado
};

export function DetalhesPedidosRecebidos({ id }: DetalhesPedidosRecebidosProps) {
  const [data, setData] = React.useState<Pedido[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string | undefined>("");
  const [responseText, setResponseText] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loadingImport, setLoadingImport] = React.useState<boolean>(false);

  const fetchData = async () => {
    try {
      console.log("Recebendo detalhes do pedido com id:", id);
      const response = await axios.get<Pedido[]>(`http://localhost:3333/pedidos_desc/${id}`);
      setData(response.data);
      if (response.data.length > 0) {
        setSelectedStatus(response.data[0].status);
      }
    } catch (error) {
      console.error("Erro na requisição de detalhes do pedido:", error);
    }
  };

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    try {
      await axios.put(`http://localhost:3333/update_pedido/${id}`, { estado: newStatus });
      toast.success(`Status atualizado para ${newStatus}!`);

      // --- Código antigo de geração de PDF comentado por precaução ---
      /*
      if (newStatus === "Aprovado") {
        const updatedResponse = await axios.get<Pedido[]>(`http://localhost:3333/pedidos_desc/${id}`);
        const pedidoAtual = updatedResponse.data[0];
        const docType = pedidoAtual?.tipo;
        if (docType) {
          switch (docType) {
            case "Certificado":
              await axios.post(`http://localhost:3333/criar_certificado/${id}`);
              toast.success("Certificado criado para o aluno.");
              break;
            case "Declaração":
              await axios.post(`http://localhost:3333/criar_declaracao/${id}`);
              toast.success("Declaração criada para o aluno.");
              break;
            case "Transferência":
              await axios.post(`http://localhost:3333/criar_transferencia/${id}`);
              toast.success("Documento de transferência criado para o aluno.");
              break;
            default:
              toast("Nenhuma ação definida para o tipo: " + docType);
              break;
          }
        } else {
          toast.error("Tipo de documento não identificado.");
        }
      }
      */
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Seleciona um ficheiro primeiro");
      return;
    }
    setLoadingImport(true);
    const form = new FormData();
    form.append("file", file);
    try {
      await axios.post(
        `http://localhost:3333/pedidos/${id}/import`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Documento XLS importado com sucesso!");
      setFile(null);
      fetchData();
    } catch (err) {
      console.error("Erro ao importar XLS:", err);
      toast.error("Falha ao importar ficheiro");
    } finally {
      setLoadingImport(false);
    }
  };

  const handleSendResponse = async () => {
    try {
      await axios.post(`http://localhost:3333/enviar_email/${id}`, { resposta: responseText });
      toast.success("Resposta enviada por email com sucesso!");
      setResponseText("");
      fetchData();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta.");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Detalhes do Pedido</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Descrição:</h3>
                {data.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {data.map((pedido, index) => (
                      <li key={index} className="mb-2">
                        {pedido.desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Carregando descrição...</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Alterar Status:</h3>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="border rounded-md px-2 py-1 w-full focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Rejeitado">Rejeitado</option>
                </select>
              </div>

              {selectedStatus === "Aprovado" && !data[0]?.documentoUrl && (
                <div>
                  <h3 className="font-semibold">Importar Documento Final (.xlsx):</h3>
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  <Button
                    onClick={handleImport}
                    disabled={!file || loadingImport}
                    className="mt-2 bg-green-600 hover:bg-green-700"
                  >
                    {loadingImport ? 'Importando...' : 'Importar XLS'}
                  </Button>
                </div>
              )}

              {/* Link de download do documento final, se existir */}
              {data[0]?.documentoUrl && (
                <div>
                  <h3 className="font-semibold">Documento Aprovado:</h3>
                  <a
                    href={data[0].documentoUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Descarregar Ficheiro
                  </a>
                </div>
              )}

              {data.length > 0 && data[0].resposta && (
                <div>
                  <h3 className="font-semibold">Resposta do Admin:</h3>
                  <p className="text-gray-800">{data[0].resposta}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold">Responder Pedido (Enviar Email):</h3>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="w-full rounded-md border px-2 py-1"
                  rows={4}
                />
                <Button
                  onClick={handleSendResponse}
                  className="mt-2 bg-blue-500 hover:bg-blue-600"
                >
                  Enviar Resposta
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
