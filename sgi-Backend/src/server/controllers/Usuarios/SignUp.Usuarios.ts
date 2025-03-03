import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware/index.middleware';
import { prisma } from '../../config/prisma.config';
import { IUsuario } from '../../database/models/index.models';
import { PasswordCrypto } from '../../shared/services/index.services'; 
import { usuarios_tipo_de_usuario } from '@prisma/client';

interface IBodyProps extends Omit<IUsuario, 'id'|'create_at'|'update_at'|'foto_perfil'>{}

export const signUpValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
      senha: yup.string().required().min(6),
      email: yup.string().required().email().min(5),
      tipo_de_usuario: yup.mixed<usuarios_tipo_de_usuario>().oneOf(Object.values(usuarios_tipo_de_usuario)).required(),
    })
  ),
}));

export const signUp = async (req: Request<{}, {}, IUsuario>, res: Response) => {
   
    try {
    const { nome, senha, email, tipo_de_usuario } = req.body;

    console.log("Dados recebidos:", req.body);
    // Criptografar a senha
    const hashedPassword = await PasswordCrypto.hashPassword(senha);

    // Criar o usuário no banco de dados com a senha criptografada
    const usuario = await prisma.usuarios.create({
      data: {
        nome: nome,        // Passando o nome corretamente
        senha: hashedPassword, // Usando a senha criptografada
        email: email,
        tipo_de_usuario: tipo_de_usuario,        // Passando o tipo corretamente
      },
    });

    console.log("Usuário criado:", usuario);

     res.status(StatusCodes.CREATED).json(usuario);
  } catch (error: any) {
    console.error("Erro na criação do usuário:", error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: error.message,
      },
    });
  }
};

