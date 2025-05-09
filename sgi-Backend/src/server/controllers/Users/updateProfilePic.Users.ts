// controllers/Usuarios/updateProfilePic.ts
import { Request, Response } from 'express';
import { prisma } from "../../config/prisma.config";

export const updateProfilePicRoute = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const baseUrl = 'http://localhost:3333';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const updatedUser = await prisma.usuarios.update({
      where: { id: Number(userId) },
      data: { foto_perfil: fileUrl },
    });

    return res.json({ message: "Foto de perfil atualizada!", user: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
