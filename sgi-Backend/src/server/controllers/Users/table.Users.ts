// src/server/controllers/UsersUpdate.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { wss } from "../../../index";

export async function sendUsersUpdate() {
  try {
    const results = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        nome,
        email,
        tipo_de_usuario AS tipo,
        foto_perfil AS foto
      FROM usuarios;
    `;

    const message = JSON.stringify({
      type: "updateUsers",
      data: results,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  } catch (error) {
    console.error("Erro ao enviar atualização de usuários via WebSocket:", error);
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.$queryRaw<any[]>`
      SELECT
        id,
        nome,
        email,
        tipo_de_usuario AS tipo,
        foto_perfil AS foto
      FROM usuarios;
    `;

    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar usuários" });
  }
};
