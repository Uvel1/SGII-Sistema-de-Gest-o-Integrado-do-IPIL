import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from '../../config/prisma.config';
  
  export const getTabelaAlunos = async (req: Request, res: Response) => {

    try{

  const alunosComNotas = await prisma.alunos.findMany({
    select: {
        id: true,
        numero_processo: true,
        nome: true,
        numero_bi: true,
        sexo: true,
        email: true,
        data_nasc: true, // Para calcular a idade
        turmas: {
          select: {
            turma: {
              select: {
                nome: true, // Nome da turma
              },
            },
          },
        },
        notas: {
          select: {
            mac: true,
            p1: true,
            p2: true,
            pf: true,
            mt: true,
          },
        },
      },
    });

  // Calcula a idade e transforma o resultado
  const result = alunosComNotas.map(aluno => ({
    numLista: aluno.id,
    numProc: aluno.numero_processo,
    nome: aluno.nome,
    numBI: aluno.numero_bi,
    sexo: aluno.sexo,
    email: aluno.email,
    mac: Number(aluno.notas[0]?.mac) || 0,
    p1: Number(aluno.notas[0]?.p1) || 0,
    p2: Number(aluno.notas[0]?.p2) || 0,
    pf: aluno.notas[0]?.pf !== null ? Number(aluno.notas[0]?.pf) : null,
    mt: aluno.notas[0]?.mt !== null ? Number(aluno.notas[0]?.mt) : null,
    turma: aluno.turmas[0]?.turma?.nome,
  }));
  
  
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao buscar solicitações de alunos' });
    }
  };