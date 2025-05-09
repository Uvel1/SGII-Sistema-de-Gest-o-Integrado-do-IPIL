import * as XLSX from 'xlsx';
import fs from 'fs';
import * as yup from 'yup';
import { validation } from '../../shared/middleware/index.middleware';
import path from 'path';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from '../../config/prisma.config';

interface IParams {
  id: number;
}

export const IdPed = validation((getSchema) => ({
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

export const importDoc = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Tem de enviar um ficheiro XLS' });
    }

    const pedido = await prisma.solicitacao_aluno.findUnique({
      where: { id },
      select: { tipo: true, aluno_id: true }
    });
    if (!pedido) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Pedido não encontrado' });
    }

    const aluno = await prisma.usuarios.findUnique({
      where: { id: pedido.aluno_id },
      select: { nome: true }
    });
    if (!aluno || !aluno.nome) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Aluno não encontrado' });
    }

    const nomes = aluno.nome.trim().split(/\s+/);
    const primeiroNome = nomes[0];
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : nomes[0];

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const dataStr = `${dia}_${mes}_${ano}`;

    const filenameXls = `${primeiroNome}_${ultimoNome}_${dataStr}.xlsx`;

    const publicDir = path.join(process.cwd(), 'src', 'server', 'public', 'documents', 'XLXS');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const destXls = path.join(publicDir, filenameXls);
    fs.renameSync(req.file.path, destXls);
    const xlsUrl = `/documents/XLXS/${filenameXls}`;

    await prisma.solicitacao_aluno.update({
      where: { id },
      data: { estado: 'Aprovado', data_resolucao: data }
    });

    await prisma.documentos_submetidos.create({
      data: {
        url_documento: xlsUrl,
        nome_documento: filenameXls,
        tipo_documento: pedido.tipo,
        usuario_id: pedido.aluno_id
      }
    });

    return res.status(StatusCodes.OK).json({ message: 'Importação XLS feita!', xlsUrl });
  } catch (error) {
    console.error('Erro ao importar documento:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno ao importar documento' });
  }
};
