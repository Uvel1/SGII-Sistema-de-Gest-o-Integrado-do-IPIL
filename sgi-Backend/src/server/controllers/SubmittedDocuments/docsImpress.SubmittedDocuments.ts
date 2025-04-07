// arquivo: printDocumento.ts (renomeie se necessário)
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import fs from "fs";
import path from "path";

interface IParams {
  id: number;
}

export const IdPrintValidationDoc = validation((getSchema) => ({
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

export const PrintDoc = async (req: Request<IParams>, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: "ID inválido" },
    });
  }

  try {
    const documento = await prisma.documentos_submetidos.findUnique({
      where: { id },
    });

    if (!documento) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Documento não encontrado." },
      });
    }

    const filePath = documento.url_documento;

    if (!fs.existsSync(filePath)) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Arquivo não encontrado." },
      });
    }

    const absolutePath = path.resolve(filePath);

    res.setHeader("Content-Type", "application/pdf");

    return res.sendFile(absolutePath);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};
