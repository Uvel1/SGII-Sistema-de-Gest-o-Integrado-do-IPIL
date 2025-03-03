// arquivo: deleteTurma.ts (renomeie se necessário)
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { TurmasController } from "./index"; // ajuste o caminho conforme necessário

interface IParams {
  id: number;
}

export const IdDeleteValidation = validation((getSchema) => ({
  params: getSchema<IParams>(
    yup.object().shape({
      id: yup
        .number()
        .transform((value, originalValue) => Number(originalValue))
        .typeError("O id deve ser um número")
        .required("O id é obrigatório"),
    })
  ),
}));

export const Delete = async (req: Request<IParams>, res: Response) => {
  const id = Number(req.params.id); // Converte id para número

  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: "ID inválido" },
    });
  }

  try {
    // Verifica se a turma existe
    const turma = await prisma.turmas.findUnique({
      where: { id },
    });

    if (!turma) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Turma não encontrada." },
      });
    }

    // Deleta a turma permanentemente do banco de dados
    await prisma.turmas.delete({
      where: { id },
    });

    // Chama a função de atualização via WebSocket para turmas
    await TurmasController.sendTurmasUpdate();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Turma excluída permanentemente com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};

