import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware/index.middleware";
import { StatusCodes } from "http-status-codes";
import { prisma } from '../../config/prisma.config';
import { ITurmas } from "../../database/models/Classes.models";
import {turmas_turno} from "@prisma/client";

interface IBodyProps extends Omit<ITurmas, 'id'|'created_at'| 'updated_at'>{}

export const CreateClasseValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
        nome: yup.string().required().min(5),
        ano_lectivo: yup.number().required().min(5),
        diretorTurma_id: yup.number().required().min(1),
        classe: yup.string().required(),
        sala: yup.string().required(),
        turno: yup.string().oneOf(Object.values(turmas_turno) as string[]).required(),
  })
),
}));


 export const CreateClasse = async (req:Request<{},{},IBodyProps>, res:Response ) =>{

    const { nome, bi, nProc, pedido , email } = req.body;

    try {
const aluno = await prisma.alunos.findUnique({
    where: {
      num_proc: nProc,
      bi: bi,
    },
  });
  
  if (!aluno) {
    return res.status(StatusCodes.NOT_FOUND).json({
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
    return res.status(StatusCodes.NOT_FOUND).json({
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
     return res.status(StatusCodes.NOT_FOUND).json({
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
            return res.status(StatusCodes.CREATED).json(pdd);
            
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          errors: {
            default: 'Erro ao processar a solicitação',
          },
        });
      }
 
  console.log(req.body);

   res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Não implementado!');
 };