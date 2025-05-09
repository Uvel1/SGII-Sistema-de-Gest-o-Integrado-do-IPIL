// src/server/controllers/ProfessoresStatsController.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const getApprovalStats = async (req: Request, res: Response) => {
  const profId = Number(req.params.id);
  if (isNaN(profId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });
  }

  try {
    const [row] = await prisma.$queryRaw<
      { aprovados: number; reprovados: number }[]
    >`
      SELECT
        SUM(CASE WHEN ((n.mac + n.p1 + n.p2) / 3) >= 10 THEN 1 ELSE 0 END) AS aprovados,
        SUM(CASE WHEN ((n.mac + n.p1 + n.p2) / 3) < 10 THEN 1 ELSE 0 END) AS reprovados
      FROM professores_turmas pt
      JOIN turma_alunos ta ON ta.turma_id = pt.turma_id
      JOIN notas n         ON n.aluno_id  = ta.aluno_id
      WHERE pt.professor_id = ${profId};
    `;

    const stats = {
      aprovados: Number(row.aprovados ?? 0),
      reprovados: Number(row.reprovados ?? 0),
    };

    return res.status(StatusCodes.OK).json(stats);
  } catch (err) {
    console.error("Erro ao buscar stats de aprovação:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro interno" });
  }
};
