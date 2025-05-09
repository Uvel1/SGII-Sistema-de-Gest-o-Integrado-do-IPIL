import { Request, Response } from "express"; 
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

const BASE_URL = "http://localhost:3333";

export const getTabelaAlunos = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT
        ad.id AS id,  
        u.foto_perfil AS foto,
        u.id AS numLista,
        ad.numero_processo AS numProc,
        u.nome AS nome,
        ad.numero_bi AS numBI,
        ad.sexo AS sexo,
        u.email AS email,
        (SELECT n2.mac FROM notas n2 WHERE n2.aluno_id = u.id ORDER BY n2.id LIMIT 1) AS mac,
        (SELECT n2.p1 FROM notas n2 WHERE n2.aluno_id = u.id ORDER BY n2.id LIMIT 1) AS p1,
        (SELECT n2.p2 FROM notas n2 WHERE n2.aluno_id = u.id ORDER BY n2.id LIMIT 1) AS p2,
        (SELECT n2.pf FROM notas n2 WHERE n2.aluno_id = u.id ORDER BY n2.id LIMIT 1) AS pf,
        (SELECT n2.mt FROM notas n2 WHERE n2.aluno_id = u.id ORDER BY n2.id LIMIT 1) AS mt,
        (SELECT t2.nome FROM turma_alunos ta2
           JOIN turmas t2 ON ta2.turma_id = t2.id
         WHERE ta2.aluno_id = u.id
         LIMIT 1) AS turma
      FROM aluno_detalhes ad
      JOIN usuarios u ON ad.aluno_id = u.id
      ORDER BY u.id;
    `;

    const safeResult = (result as any[]).map((row) => {
      const newRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) =>
          [key, typeof value === "bigint" ? Number(value) : value]
        )
      );

      if (
        newRow.foto &&
        typeof newRow.foto === "string" &&
        !newRow.foto.startsWith("http")
      ) {
        newRow.foto = `${BASE_URL}/uploads/${newRow.foto}`;
      }

      return newRow;
    });

    res.status(StatusCodes.OK).json(safeResult);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao buscar alunos" });
  }
};
