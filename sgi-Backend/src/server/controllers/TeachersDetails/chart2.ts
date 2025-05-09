// src/controllers/Professores.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../config/prisma.config";

export const getFaltasStats = async (req: Request, res: Response) => {
  const profId = Number(req.params.id);
  try {
    const result = await prisma.$queryRaw<{ faltas: number; totalAulas: number }[]>`
      SELECT
        SUM(a.faltas) AS faltas,
        COUNT(a.id) * 1 AS totalAulas
      FROM notas a
      JOIN professores_turmas pt ON pt.turma_id = a.turma_id
      WHERE pt.professor_id = ${profId};
    `;
    const stats = result[0] ?? { faltas: 0, totalAulas: 0 };
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao calcular estatísticas de faltas" });
  }
};
