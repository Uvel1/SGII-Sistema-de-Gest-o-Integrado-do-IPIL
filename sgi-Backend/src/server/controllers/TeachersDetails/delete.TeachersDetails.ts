// arquivo: deleteSolicitacao.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { ProfessoresController } from "./index.TeachersDetails"; // ajuste o caminho conforme necessário

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
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: "ID inválido" },
    });
  }

  try {
    const teacher = await prisma.professor_detalhes.findUnique({
      where: { id },
    });

    if (!teacher) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Solicitação não encontrada." },
      });
    }

    await prisma.professor_detalhes.delete({
      where: { id },
    });

    await ProfessoresController.sendTeachersUpdate();

    return res.status(StatusCodes.OK).json({ message: "Solicitação excluída permanentemente com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};
