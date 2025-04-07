import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { wss } from "../../../index";

export async function SendClassesUpdate() {
    try {
      const result = await prisma.$queryRaw<{
        id: number;
       nome_turma: string;
      classe: string;
      sala: string;
      turno: string;
      total_alunos: number;
      curso: string;
      diretor_turma: string;
    }[]>`
     SELECT 
    t.id AS id,
    t.nome AS nome_turma,
    t.classe,
    t.sala,
    t.turno,
    COUNT(ta.aluno_id) AS total_alunos,
    c.nome AS curso,
    u.nome AS diretor_turma
FROM turmas t
LEFT JOIN professores_turmas pt ON pt.turma_id = t.id
LEFT JOIN professor_detalhes pd ON pd.id = pt.professor_id
LEFT JOIN turma_alunos ta ON ta.turma_id = t.id
LEFT JOIN aluno_detalhes ad ON ad.aluno_id = ta.aluno_id
LEFT JOIN cursos c ON c.id = ad.curso_id
LEFT JOIN usuarios u ON u.id = t.diretorTurma_id
GROUP BY t.id, t.nome, t.classe, t.sala, t.turno, c.nome, u.nome;
      `;
  
      const safeResult = (result as any[]).map((row) => {
        return Object.fromEntries(
          Object.entries(row).map(([key, value]) =>
            [key, typeof value === "bigint" ? Number(value) : value]
          )
        );
      });
  
      const message = JSON.stringify({
        type: "updateTurmas",
        data: safeResult,
      });
  
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error("Erro ao enviar atualização via WebSocket:", error);
    }
  }


export const AllClassesForTeacher = async (req: Request, res: Response) => {
  try {
    const results = await prisma.$queryRaw<{
        id: number;
      nome_turma: string;
      classe: string;
      sala: string;
      turno: string;
      total_alunos: number;
      curso: string;
      diretor_turma: string;
    }[]>`
     SELECT 
    t.id AS id,
    t.nome AS nome_turma,
    t.classe,
    t.sala,
    t.turno,
    COUNT(ta.aluno_id) AS total_alunos,
    c.nome AS curso,
    u.nome AS diretor_turma
FROM turmas t
LEFT JOIN professores_turmas pt ON pt.turma_id = t.id
LEFT JOIN professor_detalhes pd ON pd.id = pt.professor_id
LEFT JOIN turma_alunos ta ON ta.turma_id = t.id
LEFT JOIN aluno_detalhes ad ON ad.aluno_id = ta.aluno_id
LEFT JOIN cursos c ON c.id = ad.curso_id
LEFT JOIN usuarios u ON u.id = t.diretorTurma_id
GROUP BY t.id, t.nome, t.classe, t.sala, t.turno, c.nome, u.nome;

    `;

    const resultsFixed = results.map(row => ({
      ...row,
      total_alunos: Number(row.total_alunos),
    }));

    res.status(StatusCodes.OK).json(resultsFixed);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar turmas" });
  }
};
