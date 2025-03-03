import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { JWTService, PasswordCrypto } from "../../shared/services/index.services";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { IUsuario } from "../../database/models/index.models";

interface IBodyProps extends Omit<IUsuario, "id" | "nome" | "tipo_de_usuario" | "create_at" | "update_at" | "foto_perfil"> {}

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      senha: yup.string().required().min(6),
      email: yup.string().required(),
    })
  ),
}));

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: email },
    });

    if (!usuario) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: {
          default: "Email ou senha são inválidos",
        },
      });
    }

     if (!usuario.senha) {
        res.status(StatusCodes.UNAUTHORIZED).json({
         errors: {
           default: "Email ou senha são inválidos",
         },
       });
     }
     
     const passwordMatch = await PasswordCrypto.verifyPassword(senha, usuario.senha);
     if (!passwordMatch) {
        res.status(StatusCodes.UNAUTHORIZED).json({
         errors: {
           default: "Email ou senha são inválidos",
         },
       });
     }

    if(!passwordMatch){
         res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
            default: "Email ou senha são inválidos",
            },
        });
    }
    
    // Gera os tokens
    const accessToken = JWTService.sign({ uid: usuario.id, tipo_de_usuario: usuario.tipo_de_usuario, nome: usuario.nome, email: usuario.email});
    const refreshToken = JWTService.signRefreshToken({ uid: usuario.id, tipo_de_usuario: usuario.tipo_de_usuario, nome: usuario.nome, email: usuario.email});
    const userType = await prisma.usuarios.findMany({
        where:{email:email},
        select: {
            tipo_de_usuario: true, 
        },
        distinct: ['tipo_de_usuario'], // Para evitar repetições
      });

    // if(userType.length > 0 && userType[0].tipo === "Professor")
    //     const disciplina = await prisma.usuarios.findUnique({
    // where:{email:email},
    // select:{}
    // });

    if (accessToken === "JWT_SECRET_NOT_FOUND" || refreshToken === "JWT_SECRET_NOT_FOUND") {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: "Erro ao gerar os tokens",
        },
      });
    }
    
    // Retorna os tokens para o cliente
     res.status(StatusCodes.OK).json({ accessToken, refreshToken, userType });
    
  } catch (error) {
    console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "Erro ao processar a solicitação",
      },
    });
  }
};
