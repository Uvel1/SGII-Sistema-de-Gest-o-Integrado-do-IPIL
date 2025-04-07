import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const ChartFiels = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        af.nome AS area, 
        COUNT(*) AS total
      FROM aluno_detalhes ad
      JOIN cursos c ON ad.curso_id = c.id
      JOIN areas_formacao af ON c.areas_id = af.id
      GROUP BY af.nome
      ORDER BY af.nome ASC
    `;

    const sanitizedResult = result.map((item: any) => ({
      ...item,
      total: Number(item.total),
    }));

    return res.status(StatusCodes.OK).json({ data: sanitizedResult });
  } catch (error) {
    console.error("Erro na query raw de alunos por área:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar dados." });
  }
};
