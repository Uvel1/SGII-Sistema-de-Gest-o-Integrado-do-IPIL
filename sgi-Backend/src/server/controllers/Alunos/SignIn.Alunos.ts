import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { JWTService, PasswordCrypto } from "../../shared/services/index.services";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { IUsuario, IAluno_detalhes } from "../../database/models/index.models";

interface IBodyProps extends 
Omit<IUsuario, "id" | "nome"|"email"| "foto_perfil" | "create_at" | "update_at" | "tipo_de_usuario">,
Omit<IAluno_detalhes, "id" | "numero_processo"|"sexo"| "data_nasc" | "created_at" | "updated_at" | "curso_id" | "aluno_id" > {}

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      senha: yup.string().required().min(6),
      numero_bi: yup.string().required(),
    })
  ),
}));

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { numero_bi, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const aluno = await prisma.aluno_detalhes.findUnique({
      where: { numero_bi : numero_bi },
      select: {aluno_id:true,curso_id:true,numero_processo:true}
    });

    if (!aluno) {
      res.status(StatusCodes.NOT_FOUND).json({
        errors: {
          default: "BI ou senha são inválidos",
        },
      });
    }

    const user = await prisma.usuarios.findUnique({
        where:{id:aluno.aluno_id},
        select:{senha:true,nome:true,email:true}
    })

    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({
          errors: {
            default: "BI ou senha são inválidos",
          },
        });
      }
     
     if (!user.senha) {
       res.status(StatusCodes.NOT_FOUND).json({
         errors: {
           default: "BI ou senha são inválidos",
         },
       });
     }
     
     const passwordMatch = await PasswordCrypto.verifyPassword(senha, user.senha);
     if (!passwordMatch) {
       res.status(StatusCodes.UNAUTHORIZED).json({
         errors: {
           default: "Email ou senha são inválidos",
         },
       });
     }

     const curso = await prisma.cursos.findUnique({
        where: { id :aluno.curso_id},
        select: { nome :true }
     });
     
    if (!curso) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: "Curso não encontrado",
        },
      });
    }

    const accessToken = JWTService.sign({ uid: aluno.aluno_id, nome: user.nome, curso: curso.nome, email: user.email, nproc:aluno.numero_processo});
    const refreshToken = JWTService.signRefreshToken({ uid: aluno.aluno_id, nome: user.nome, curso: curso.nome, email: user.email, nproc:aluno.numero_processo});

    if (accessToken === "JWT_SECRET_NOT_FOUND" || refreshToken === "JWT_SECRET_NOT_FOUND") {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: "Erro ao gerar os tokens",
        },
      });
    }

    // Retorna os tokens para o cliente
    res.status(StatusCodes.OK).json({ accessToken, refreshToken});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "Erro ao processar a solicitação",
      },
    });
  }
};
