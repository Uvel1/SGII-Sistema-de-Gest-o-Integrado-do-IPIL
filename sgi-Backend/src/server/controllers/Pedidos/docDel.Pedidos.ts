// arquivo: deleteDocumento.ts (renomeie se necessário)
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import fs from "fs";
import { wss } from "../../../index";

interface IParams {
  id: number;
}

export const IdDeleteValidationDoc = validation((getSchema) => ({
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

export const DeleteDoc = async (req: Request<IParams>, res: Response) => {
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

    // Verifica se o arquivo existe e o deleta do sistema de arquivos
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deleta o registro do documento da base de dados
    await prisma.documentos_submetidos.delete({
      where: { id },
    });

    // Após deletar, obtém a lista atualizada de documentos
    const documentos = await prisma.$queryRaw`
      SELECT 
        d.id, 
        u.nome, 
        YEAR(d.created_at) AS ano_de_termino, 
        d.nome_documento, 
        d.tipo_documento
      FROM documentos_submetidos d
      JOIN usuarios u ON d.usuario_id = u.id
    `;
    
    // Envia a atualização para todos os clientes conectados via WebSocket
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "updateDocumentos", data: documentos }));
    });

    return res.status(StatusCodes.OK).json({
      message: "Documento excluído permanentemente com sucesso.",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação." },
    });
  }
};
