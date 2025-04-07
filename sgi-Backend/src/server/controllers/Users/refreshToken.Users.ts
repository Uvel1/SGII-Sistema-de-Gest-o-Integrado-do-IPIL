import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../../shared/services/index.services";
import { prisma } from "../../config/prisma.config";

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
     res.status(StatusCodes.BAD_REQUEST).json({ error: "Token de atualização não fornecido" });
  }

  try {
    const decoded = JWTService.verify(refreshToken);

    if (decoded === "INVALID_TOKEN" || decoded === "JWT_SECRET_NOT_FOUND") {
       res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token inválido ou expirado" });
    }

    const user = await prisma.usuarios.findUnique({
      where: { id: decoded.uid },
      select: { nome: true, email: true }
    });

    if (!user) {
       res.status(StatusCodes.UNAUTHORIZED).json({ error: "Usuário não encontrado" });
    }

    const newAccessToken = JWTService.sign({ 
      uid: decoded.uid,
      nome: user.nome,
      email: user.email 
    });

    if (newAccessToken === "JWT_SECRET_NOT_FOUND") {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao gerar o token de acesso" });
    }

     res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (error) {
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao processar o token de atualização" });
  }
};
