import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

interface IParams {
  id: number;
}

export const TeacherIdValidation = validation((getSchema) => ({
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

export const GetData = async (req: Request<IParams>, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.$queryRaw<{
      n_lista: number;
      numProc: number;
      nome: string;
      sexo: string;
      turma: string;
      mac: number;
      p1: number;
      p2: number;
      pf: number;
      mt: number;
      faltas: number;
    }[]>`
      SELECT DISTINCT
  ad.id AS id,
  ad.n_lista,
  ad.numero_processo AS numProc,
  u.nome,
  ad.sexo,
  t.nome AS turma,
  n.mac,
  n.p1,
  n.p2,
  n.pf,
  n.mt,
  n.faltas
      FROM professores_turmas pt
      INNER JOIN professor_detalhes pd ON pd.id = pt.professor_id
      INNER JOIN turmas t ON t.id = pt.turma_id
      INNER JOIN turma_alunos ta ON ta.turma_id = t.id
      INNER JOIN aluno_detalhes ad ON ad.aluno_id = ta.aluno_id
      INNER JOIN usuarios u ON u.id = ad.aluno_id
      LEFT JOIN professores_disciplina pdisc ON pdisc.professor_id = pd.id
      LEFT JOIN notas n ON n.aluno_id = ad.aluno_id AND n.disciplina_id = pdisc.disciplina_id
      WHERE pd.usuario_id = ${id}
      ORDER BY t.nome, u.nome;
    `;

    const safeResult = result.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (typeof value === "bigint") {
            value = Number(value);
          }
          if (["mac", "p1", "p2", "pf", "mt", "faltas"].includes(key) && value === null) {
            value = 0;
          }
          return [key, value];
        })
      )
    );

    res.status(StatusCodes.OK).json(safeResult);
  } catch (error) {
    console.error("Erro ao buscar dados dos alunos:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar dados dos alunos" });
  }
};
