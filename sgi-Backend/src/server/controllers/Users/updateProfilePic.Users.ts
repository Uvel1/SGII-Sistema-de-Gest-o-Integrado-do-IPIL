// controllers/Usuarios/updateProfilePic.ts
import { Request, Response } from 'express';
import { prisma } from "../../config/prisma.config";

export const updateProfilePicRoute = async (req: Request, res: Response) => {
  try {
    // Neste exemplo, estamos esperando que o ID do usuário venha no corpo da requisição.
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    // Constroi a URL para acessar o arquivo.
    const baseUrl = 'http://localhost:3333';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Atualiza o campo foto_perfil do usuário no banco de dados
    const updatedUser = await prisma.usuarios.update({
      where: { id: Number(userId) },
      data: { foto_perfil: fileUrl },
    });

    return res.json({ message: "Foto de perfil atualizada!", user: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
