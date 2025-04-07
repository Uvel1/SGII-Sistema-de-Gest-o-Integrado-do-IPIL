import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

interface IParams {
  id: number;
}

export const IdTeacherValidation = validation((getSchema) => ({
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

export const ClassesForTeacher = async (req: Request<IParams>, res: Response) => {
  const { id } = req.params;

  console.log("ID recebido:", id);

  try {
    const results = await prisma.$queryRaw<{
      nome_turma: string;
      classe: string;
      sala: string;
      turno: string;
      total_alunos: number;
      curso: string;
      diretor_turma: string;
    }[]>`
      SELECT 
        t.nome AS nome_turma,
        t.classe,
        t.sala,
        t.turno,
        COUNT(ta.aluno_id) AS total_alunos,
        c.nome AS curso,
        u.nome AS diretor_turma
      FROM turmas t
      INNER JOIN professores_turmas pt ON pt.turma_id = t.id
      INNER JOIN professor_detalhes pd ON pd.id = pt.professor_id
      LEFT JOIN turma_alunos ta ON ta.turma_id = t.id
      LEFT JOIN aluno_detalhes ad ON ad.aluno_id = ta.aluno_id
      LEFT JOIN cursos c ON c.id = ad.curso_id
      INNER JOIN usuarios u ON u.id = t.diretorTurma_id
      WHERE pd.usuario_id = ${id}
      GROUP BY t.id, t.nome, t.classe, t.sala, t.turno, c.nome, u.nome
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
      .json({ error: "Erro ao buscar turmas do professor" });
  }
};
