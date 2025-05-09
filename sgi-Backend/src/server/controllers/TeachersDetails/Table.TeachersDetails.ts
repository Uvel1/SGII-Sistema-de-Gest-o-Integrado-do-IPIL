import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { wss } from "../../../index";

export async function sendTeachersUpdate() {
    try {
        const result = await prisma.$queryRaw`
        SELECT
          pd.id AS id,
          u.nome,
          u.email,
          pd.telefone AS tel,
          pd.cargo AS cargo,
          pd.numero_bi AS numero_bi,
          pd.sexo AS sexo,
          d.nome AS disciplina
        FROM usuarios u
        JOIN professor_detalhes pd ON u.id = pd.usuario_id
        JOIN professores_disciplina pd2 ON pd.id = pd2.professor_id
        JOIN disciplinas d ON d.id = pd2.disciplina_id
        WHERE u.tipo_de_usuario = 'Professor'
        ORDER BY u.nome;
      `;
  
  const safeResult = (result as any[]).map((row) => {
    return Object.fromEntries(
      Object.entries(row).map(([key, value]) =>
        [key, typeof value === "bigint" ? Number(value) : value]
      )
    );
  });

  const message = JSON.stringify({
    type: "updateTeachers",
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

export const getTabelaProfessores = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
     SELECT
  pd.id AS id,
  u.nome,
  u.email,
  pd.telefone AS tel,
  pd.cargo AS cargo,
  pd.numero_bi AS numero_bi,
  pd.sexo AS sexo,
  d.nome AS disciplina
FROM usuarios u
JOIN professor_detalhes pd ON u.id = pd.usuario_id
LEFT JOIN professores_disciplina pd2 ON pd.id = pd2.professor_id
LEFT JOIN disciplinas d ON d.id = pd2.disciplina_id
WHERE u.tipo_de_usuario = 'Professor'
ORDER BY u.nome;
    `;

    const safeResult = (result as any[]).map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) =>
          [key, typeof value === "bigint" ? Number(value) : value]
        )
      )
    );

    res.status(StatusCodes.OK).json(safeResult);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar os dados dos professores" });
  }
};
