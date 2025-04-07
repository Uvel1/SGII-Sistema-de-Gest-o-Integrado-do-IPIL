// Exemplo usando app.locals em um controller
import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { StatusCodes } from "http-status-codes";
import { prisma } from '../../config/prisma.config';

interface IParams {
    id: number;
  }

  export const IdStudentValidation = validation((getSchema) => ({
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

export const StudentGrades = async (req: Request<IParams>, res: Response) => {
   
    const {id} = req.params;

    try{
        const results = await prisma.$queryRaw<
      {
        disciplina: string;
        mac: number;
        p1: number;
        p2: number;
        faltas: number;
        md: number;
      }[]
    >`
      SELECT 
        d.nome AS disciplina,
        n.mac,
        n.p1,
        n.p2,
        n.faltas,
        ((n.mac + n.p1 + n.p2) / 3) AS md
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = ${id}
    `;
      
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao buscar solicitações de alunos' });
  }
};
