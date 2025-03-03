import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { IAlunos, ISolicitacaoAluno } from "../../database/models/index.models";

interface IBodyProps extends 
Omit<IAlunos, "id"|"senha"| "created_at" | "updated_at" | "curso" | "sexo" | "numero_processo" | "curso_id" | "solicitacoes" | "turmas" | "data_nasc">, 
Omit<ISolicitacaoAluno,"id" | "aluno_id" | "tipo" | "estado" | "data_solicitacao" | "data_resolucao" > {}

export const declaraçãoValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required(),
      numero_bi: yup.string().required(),
      email: yup.string().required().email(),
      curso: yup.string().required(),
      descricao: yup.string(),
      turmas: yup.string().required(),
    })
  ),
}));

export const declaração = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const { numero_bi, nome, email, descricao } = req.body;

  try {

    const aluno = await prisma.alunos.findUnique({
      where: { 
        numero_bi : numero_bi,
        email:email,
        nome:nome,
     },
    });

    if (!aluno) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: {
          default: "BI ou nome de aluno são inválidos",
        },
      });
    }

    const novaSolicitacao = await prisma.solicitacao_aluno.create({
        data:{
            aluno_id:aluno.id,
            tipo:"Declaracao",
            descricao:descricao,
        }
    });

    console.log('Pedido criado',novaSolicitacao)

    return res.status(StatusCodes.OK).json({});
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "Erro ao processar a solicitação",
      },
    });
  }
};
