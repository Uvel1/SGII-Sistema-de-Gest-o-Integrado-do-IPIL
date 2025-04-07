import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";

export const getUserPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Utilizando uma query raw para buscar o campo 'foto_perfil' na tabela 'usuarios'
    const results = await prisma.$queryRaw<{ foto_perfil: string }[]>`
      SELECT foto_perfil
      FROM usuarios
      WHERE id = ${Number(id)}
    `;

    if (!results || results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Usuário não encontrado" });
    }

    return res.status(StatusCodes.OK).json({ photo: results[0].foto_perfil });
  } catch (error) {
    console.error("Erro ao buscar foto do usuário:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao buscar foto do usuário" });
  }
};
