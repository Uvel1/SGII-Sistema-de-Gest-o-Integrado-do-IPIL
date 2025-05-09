import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.config';
import path from 'path';

export const DownloadDoc = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const doc = await prisma.documentos_submetidos.findUnique({
    where: { id },
    select: { url_documento: true, nome_documento: true }
  });
  if (!doc) return res.status(404).send('Documento não encontrado');
  // path absoluto no disco
  const filePath = path.join(process.cwd(), 'src', 'server', 'public', doc.url_documento);
  return res.download(filePath, doc.nome_documento);
};
