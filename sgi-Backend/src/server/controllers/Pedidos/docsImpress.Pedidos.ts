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
    // Verifica se o documento existe na base de dados
    const documento = await prisma.documentos_submetidos.findUnique({
      where: { id },
    });

    if (!documento) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Documento não encontrado." },
      });
    }

    // Recupera o caminho do arquivo armazenado
    const filePath = documento.url_documento;

    // Verifica se o arquivo existe no sistema de arquivos
    if (!fs.existsSync(filePath)) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: "Arquivo não encontrado." },
      });
    }

    // Gera o caminho absoluto para o arquivo
    const absolutePath = path.resolve(filePath);

    // Define os cabeçalhos para PDF
    res.setHeader("Content-Type", "application/pdf");

    // Envia o arquivo para o cliente
    return res.sendFile(absolutePath);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};
