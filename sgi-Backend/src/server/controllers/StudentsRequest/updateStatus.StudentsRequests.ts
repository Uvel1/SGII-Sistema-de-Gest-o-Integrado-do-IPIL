import { Request, Response } from "express";
import * as yup from "yup";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { validation } from "../../shared/middleware/index.middleware";
import { sendSolicitacoesUpdate } from "./Table.StudentsRequests"; // Função que envia atualização via WebSocket

interface IParams {
  id: number;
}

interface IBody {
  estado: "Pendente" | "Aprovado" | "Rejeitado";
}

// Validação dos parâmetros e do corpo da requisição
export const UpdateSolicitacaoValidation = validation((getSchema) => ({
  params: getSchema<IParams>(
    yup.object().shape({
      id: yup
        .number()
        .transform((value, originalValue) => Number(originalValue))
        .typeError("O id deve ser um número")
        .required("O id é obrigatório"),
    })
  ),
  body: getSchema<IBody>(
    yup.object().shape({
      estado: yup
        .string()
        .oneOf(["Pendente", "Aprovado", "Rejeitado"], "Estado inválido")
        .required("O estado é obrigatório"),
    })
  ),
}));

// Endpoint HTTP para atualizar o estado da solicitação de aluno
export const updateSolicitacaoAluno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Verifica se a solicitação existe
    const solicitacaoExiste = await prisma.solicitacao_aluno.findUnique({
      where: { id: Number(id) },
    });

    if (!solicitacaoExiste) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Solicitação não encontrada" });
    }

    // Atualiza o estado e a data de resolução
    const solicitacaoAtualizada = await prisma.solicitacao_aluno.update({
      where: { id: Number(id) },
      data: {
        estado,
        data_resolucao: new Date(),
      },
      select: { id: true, estado: true, data_resolucao: true },
    });

    // Envia a atualização via WebSocket para os clientes conectados
    sendSolicitacoesUpdate();

    return res.status(StatusCodes.OK).json({
      message: "Solicitação atualizada com sucesso",
      solicitacao: solicitacaoAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar a solicitação:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao atualizar a solicitação" });
  }
};
