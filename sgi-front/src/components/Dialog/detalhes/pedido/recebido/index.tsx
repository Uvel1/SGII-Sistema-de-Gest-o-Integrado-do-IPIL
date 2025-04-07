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

// Extendemos o tipo para incluir status, resposta e tipo (documento solicitado)
export type Pedido = {
  desc: string;
  status?: string;    // Ex.: "Pendente", "Aprovado", "Rejeitado"
  resposta?: string;  // Justificativa ou resposta do admin
  tipo?: string;      // Ex.: "Certificado", "Declaracao", "Transferência", etc.
};

export function DetalhesPedidosRecebidos({ id }: DetalhesPedidosRecebidosProps) {
  const [data, setData] = React.useState<Pedido[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string | undefined>("");
  const [responseText, setResponseText] = React.useState<string>("");

  const fetchData = async () => {
    try {
      console.log("Recebendo detalhes do pedido com id:", id);
      // Aqui informamos ao Axios que o retorno é um array de Pedido
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
      // Atualiza o status do pedido
      await axios.put(`http://localhost:3333/update_pedido/${id}`, { estado: newStatus });
      toast.success(`Status atualizado para ${newStatus}!`);
      
      // Se o novo status for "Aprovado", verifica o tipo do documento e aciona a rota específica
      if (newStatus === "Aprovado") {
        // Obtemos os detalhes atualizados para garantir que temos o tipo correto
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

      // Atualiza os dados do componente
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleSendResponse = async () => {
    try {
      // Envia a resposta para o endpoint que trata do envio por email
      await axios.post(`http://localhost:3333/enviar_email/${id}`, { resposta: responseText });
      toast.success("Resposta enviada por email com sucesso!");
      setResponseText(""); // Limpa o campo após o envio
      fetchData(); // Atualiza os dados (caso o backend registre a resposta)
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
              {/* Seção de Descrição */}
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

              {/* Seção de Status com DropDown */}
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

              {/* Seção de Resposta do Admin (exibida, se existir) */}
              {data.length > 0 && data[0].resposta && (
                <div>
                  <h3 className="font-semibold">Resposta do Admin:</h3>
                  <p className="text-gray-800">{data[0].resposta}</p>
                </div>
              )}

              {/* Área para escrever a resposta para envio por email */}
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
