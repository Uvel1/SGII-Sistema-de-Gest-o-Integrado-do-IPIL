import { Request, Response } from 'express';
import { notas_trimestre } from '@prisma/client'; 
import { prisma } from '../../config/prisma.config'; 

export const Chart = async (trimestre: notas_trimestre) => {

  const notas = await prisma.notas.findMany({
    where: {
      trimestre,
    },
    select: {
      mac: true, 
    },
  });

  const positivas = notas.filter((nota) => Number(nota.mac) >= 10).length;
  const negativas = notas.filter((nota) => Number(nota.mac) < 10).length;

  return {
    positivas,
    negativas,
  };
};

export const ChartGrades = async (req: Request, res: Response) => {
  try {
    const { trimestre } = req.params;

    if (!trimestre) {
       res.status(400).json({ error: 'O trimestre é obrigatório.' });
    }

    const data = await chart(trimestre as notas_trimestre);

    res.json({
      labels: ['Positivas', 'Negativas'],
      datasets: [
        {
          label: 'Desempenho dos Alunos',
          data: [data.positivas, data.negativas],
        },
      ],
    });
  } catch (error) {
    console.error('Erro ao processar dados das notas:', error);
    res.status(500).json({ error: 'Erro ao obter os dados das notas.' });
  }
};
