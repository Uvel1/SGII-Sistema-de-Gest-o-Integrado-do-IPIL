import { Request, RequestHandler, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware/index.middleware";
import { StatusCodes } from "http-status-codes";
import { prisma } from '../../config/prisma.config';
import { IPedidos } from "../../database/models/pedidos.models";
import { IAlunos } from "../../database/models/StudentsDetails.models";
import { pedidos_pedido } from '@prisma/client';

interface IBodyProps extends Omit<IPedidos, 'id'|'detalhes'|'aluno_id'|'usuario_id'|'estado'|'data_envio'>,Omit<IAlunos, 'data_atual'|'id'|'tel'|'data_nasc'|'sexo'|'curso_id'|'sala'|'area_formacao_id'|'data_criacao'> {}

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3),
    bi:yup.string().required().length(14),
    nProc:yup.number().required().min(6),
    pedido: yup.mixed<pedidos_pedido>().oneOf(Object.values(pedidos_pedido)).required(),
    email: yup.string().required().email().min(5),
  })),
}));


 export const create = async (req:Request<{},{},IBodyProps>, res:Response ) =>{

    const { nome, bi, nProc, pedido , email } = req.body;

    try {
const aluno = await prisma.alunos.findUnique({
    where: {
      num_proc: nProc,
      bi: bi,
    },
  });
  
  if (!aluno) {
     res.status(StatusCodes.NOT_FOUND).json({
      errors: {
        default: 'Aluno não encontrado',
      },
    });
  }

  const ALUNO_ID = await prisma.alunos.findUnique({
    where: {
      num_proc: nProc,
    },
    select: {
      id: true,
    },
  });

  if (!ALUNO_ID) {
     res.status(StatusCodes.NOT_FOUND).json({
      errors: {
        default: 'ID do aluno não encontrado',
      },
    });
  }

  const conexaoTurma = await prisma.turma_alunos.findFirst({
    where: {
      aluno_id: ALUNO_ID.id,
    },
  });
  

  
   if (!conexaoTurma) {
      res.status(StatusCodes.NOT_FOUND).json({
       errors: {
         default: 'Aluno não encontrado em nenhuma turma ou dados não encontrados.',
       },
     });
   }
  
            const pdd = await prisma.pedidos.create({
              data: {      
                pedido: pedido, 
                estado: 'Pendente',  
                aluno_id: ALUNO_ID.id,
                usuario_id: 1, 
              },
            });
            res.status(StatusCodes.CREATED).json(pdd);
            
    } catch (error) {
        console.error(error);
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          errors: {
            default: 'Erro ao processar a solicitação',
          },
        });
      }
 
  console.log(req.body);

   res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Não implementado!');
 };