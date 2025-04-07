import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { PasswordCrypto } from "../../shared/services/index.services";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

interface IBodyProps {
  numero_bi: string;
  nome: string;
  email: string;
}

export const VerificationValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      numero_bi: yup.string().required(),
      nome: yup.string().required(),
      email: yup.string().email().required(),
    })
  ),
}));

export const Verification = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { numero_bi, email, nome } = req.body;

  try {
    // Busca os detalhes do aluno para obter o id do usuário
    const aluno = await prisma.aluno_detalhes.findUnique({
      where: { numero_bi },
      select: { aluno_id: true },
    });

    if (!aluno) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: "Aluno não registrado" },
      });
    }

    // Busca o usuário associado ao aluno e confere o nome
    const alunoEmail = await prisma.usuarios.findUnique({
      where: { id: aluno.aluno_id },
      select: { email: true, nome: true, senha: true },
    });

    if (!alunoEmail || alunoEmail.nome !== nome) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: "Aluno não registrado" },
      });
    }

    // Verifica se o campo senha já possui um valor (ou seja, já foi verificado)
    // Supondo que, se não verificado, o campo esteja como uma string vazia ("")
    if (alunoEmail.senha && alunoEmail.senha !== " ") {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: "Esta conta já foi verificada" },
      });
    }

    // Gerar senha aleatória
    const randomPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await PasswordCrypto.hashPassword(randomPassword);

    // Atualizar senha na base de dados (marcando a conta como verificada)
    await prisma.usuarios.update({
      where: { email: alunoEmail.email },
      data: { senha: hashedPassword },
    });

    // Enviar email com a senha
    await sendEmail(
      email,
      "Verificação de Conta",
      `Aluno verificado com sucesso. Sua senha de início de sessão é: ${randomPassword}. Altere sua senha após o primeiro login.`
    );

    res.status(StatusCodes.OK).json({
      message: "Aluno verificado com sucesso. A senha foi enviada para o email cadastrado.",
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Erro ao processar a solicitação" },
    });
  }
};
