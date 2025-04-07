// arquivo: documentsByType.ts (ou renomeie conforme sua estrutura)
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const documentsByType = async (req: Request, res: Response) => {
  try {

    const result = await prisma.documentos_submetidos.groupBy({
      by: ["tipo_documento"],
      _count: { id: true },
    });

    const sanitizedResult = result.map((item) => ({
      tipo_documento: item.tipo_documento,
      total: Number(item._count.id),
    }));

    return res.status(StatusCodes.OK).json({ data: sanitizedResult });
  } catch (error) {
    console.error("Erro na consulta de documentos por tipo:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar dados." });
  }
};
