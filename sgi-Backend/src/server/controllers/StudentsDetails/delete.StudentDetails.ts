// arquivo: deleteSolicitacao.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { AlunosController } from "./index.StudentsDetails";

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
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: "ID inválido" },
    });
  }

  try {
    const aluno = await prisma.aluno_detalhes.findUnique({
      where: { id },
    });

    if (!aluno) {
      res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Solicitação não encontrada." },
      });
    }

    await prisma.aluno_detalhes.delete({
      where: { id },
    });

    await AlunosController.sendStudentsUpdate();

    res.status(StatusCodes.OK).json({ message: "Solicitação excluída permanentemente com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};
