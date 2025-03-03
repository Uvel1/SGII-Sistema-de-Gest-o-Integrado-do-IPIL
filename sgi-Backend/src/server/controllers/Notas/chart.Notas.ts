import { prisma } from '../../config/prisma.config'; // Ajuste o caminho do cliente Prisma conforme necessário
import { Request, Response } from 'express';

/**
 * Processa as notas dos alunos por trimestre e retorna o número de notas positivas e negativas.
 * @param trimestre Trimestre a ser filtrado (ex.: '1º Trimestre').
 * @returns Dados formatados com a contagem de notas positivas e negativas.
 */
import { notas_trimestre } from '@prisma/client'; // Import the enum type

export const chart = async (trimestre: notas_trimestre) => {
  // Buscar as notas dos alunos no banco de dados com base no trimestre
  const notas = await prisma.notas.findMany({
    where: {
      trimestre,
    },
    select: {
      mac: true, // Apenas o campo necessário para o cálculo
    },
  });

  // Contar notas positivas e negativas
  const positivas = notas.filter((nota) => Number(nota.mac) >= 10).length;
  const negativas = notas.filter((nota) => Number(nota.mac) < 10).length;

  return {
    positivas,
    negativas,
  };
};

/**
 * Endpoint para retornar os dados formatados para o gráfico.
 */
export const chartNotas = async (req: Request, res: Response) => {
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
