import { Request, Response } from "express";
import { prisma } from '../../config/prisma.config';

export const gerarRelatorioPorProfessor = async (req: Request, res: Response) => {
  try {
    const profId = Number(req.params.id);
    if (isNaN(profId)) {
      return res.status(400).json({ error: "ID de professor inválido" });
    }

    const sql = `
      SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'turmaId', t.id,
            'nomeTurma', t.nome,
            'anoLetivo', t.ano_letivo,
            'sala', t.sala,
            'classe', t.classe,
            'turno', t.turno,
            'alunos', (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', u.id,
                  'nome', u.nome,
                  'detalhes', JSON_OBJECT(
                    'numero_processo', ad.numero_processo,
                    'numero_bi', ad.numero_bi,
                    'data_nasc', DATE_FORMAT(ad.data_nasc, '%Y-%m-%d')
                  ),
                  'notas', (
                    SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'disciplina', d.nome,
                        'mac', n.mac,
                        'p1', n.p1,
                        'p2', n.p2,
                        'pf', n.pf,
                        'mt', n.mt
                      )
                    )
                    FROM notas AS n
                    INNER JOIN disciplinas AS d ON d.id = n.disciplina_id
                    WHERE n.aluno_id = ta.aluno_id
                  )
                )
              )
              FROM turma_alunos AS ta
              INNER JOIN usuarios AS u ON u.id = ta.aluno_id
              INNER JOIN aluno_detalhes AS ad ON ad.aluno_id = u.id
              WHERE ta.turma_id = t.id
            )
          )
        ) AS turmas
      FROM professores_turmas AS pt
      INNER JOIN turmas AS t ON t.id = pt.turma_id
      WHERE pt.professor_id = ${profId};
    `;

    const result = await prisma.$queryRawUnsafe<{ turmas: string }>(sql);
    const turmas = result?.turmas ? JSON.parse(result.turmas) : [];

    return res.status(200).json({ turmas });
  } catch (error) {
    console.error("Erro em gerarRelatorioPorProfessor (RAW):", error);
    return res.status(500).json({ error: "Erro ao gerar relatório do professor" });
  }
};
