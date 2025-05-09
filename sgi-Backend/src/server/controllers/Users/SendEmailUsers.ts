import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import { prisma } from "../../config/prisma.config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

export const enviarEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resposta } = req.body;

    if (!resposta) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { default: 'A resposta é obrigatória para envio do email.' },
      });
    }

    const pedido = await prisma.solicitacao_aluno.findUnique({
      where: { id: Number(id) },
      select: { aluno_id: true },
    });

    if (!pedido) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Pedido não encontrado.' },
      });
    }

    const aluno = await prisma.usuarios.findUnique({
      where: { id: pedido.aluno_id },
      select: { email: true },
    });

    if (!aluno || !aluno.email) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Email do aluno não encontrado.' },
      });
    }

    await sendEmail(
      aluno.email,
      "Resposta ao seu pedido",
      resposta
    );

    return res.status(StatusCodes.OK).json({
      mensagem: 'Email enviado com sucesso para o aluno.',
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: error.message },
    });
  }
};
