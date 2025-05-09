import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const GetRequests = async (req: Request, res: Response) => {
  try {
    const [escolaResults, alunoResults] = await Promise.all([
      prisma.solicitacao_escola.groupBy({
        by: ['estado'],
        _count: { estado: true },
      }),
      prisma.solicitacao_aluno.groupBy({
        by: ['estado'],
        _count: { estado: true },
      }),
    ]);

    const combinedResults: Record<string, number> = {};

    const processResults = (results: any[]) => {
      results.forEach((item) => {
        const estado = item.estado;
        const count = item._count.estado;
        combinedResults[estado] = (combinedResults[estado] || 0) + count;
      });
    };

    processResults(escolaResults);
    processResults(alunoResults);

    const formattedResults = Object.entries(combinedResults).map(
      ([estado, total]) => ({
        estado,
        total: Number(total),
      })
    );

    res.status(StatusCodes.OK).json(formattedResults);
  } catch (error) {
    console.error("Erro ao buscar dados de solicitações:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      error: "Erro ao buscar dados de solicitações" 
    });
  }
};