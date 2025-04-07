import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { wss } from "../../../index";

export async function sendSolicitacoesUpdate() {
    try {
      const results = await prisma.$queryRaw<any[]>`
        SELECT
          sa.id,
          sa.tipo,
          sa.estado,
          JSON_OBJECT(
            'nome', u.nome,
            'numero_bi', ad.numero_bi,
            'email', u.email,
            'curso', JSON_OBJECT('nome', c.nome)
          ) AS aluno
        FROM solicitacao_aluno AS sa
        INNER JOIN usuarios AS u ON sa.aluno_id = u.id
        INNER JOIN aluno_detalhes AS ad ON ad.aluno_id = u.id
        INNER JOIN cursos AS c ON ad.curso_id = c.id;
      `;
  
      const formattedResults = results.map((row) => ({
        id: row.id,
        tipo: row.tipo,
        estado: row.estado,
        aluno: JSON.parse(row.aluno),
      }));
  
      const message = JSON.stringify({
        type: "updateSolicitacoes",
        data: formattedResults,
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

export const getSolicitacoesAlunos = async (req: Request, res: Response) => {
  try {
    const results = await prisma.$queryRaw<any[]>`
      SELECT
        sa.id,
        sa.tipo,
        sa.estado,
        JSON_OBJECT(
          'nome', u.nome,
          'numero_bi', ad.numero_bi,
          'email', u.email,
          'curso', JSON_OBJECT('nome', c.nome)
        ) AS aluno
      FROM solicitacao_aluno AS sa
      INNER JOIN usuarios AS u ON sa.aluno_id = u.id
      INNER JOIN aluno_detalhes AS ad ON ad.aluno_id = u.id
      INNER JOIN cursos AS c ON ad.curso_id = c.id;
    `;

    const formattedResults = results.map((row) => ({
      id: row.id,
      tipo: row.tipo,
      estado: row.estado,
      aluno: JSON.parse(row.aluno),
    }));

    res.status(StatusCodes.OK).json(formattedResults);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar solicitações de alunos" });
  }
};
