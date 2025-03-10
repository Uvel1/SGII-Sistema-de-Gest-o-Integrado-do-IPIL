// arquivo: docs.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const docs = async (req: Request, res: Response) => {
  try {
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
    
    res.status(StatusCodes.OK).json(documentos);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao buscar documentos" });
  }
};
