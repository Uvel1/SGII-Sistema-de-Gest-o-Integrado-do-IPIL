import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../config/prisma.config"

export const getChart2 = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw<
      { estado: string; total: bigint }[]
    >`
      SELECT estado, SUM(total) as total FROM (
        SELECT estado, COUNT(*) as total FROM solicitacao_aluno
        GROUP BY estado
        UNION ALL
        SELECT estado, COUNT(*) as total FROM solicitacao_escola
        GROUP BY estado
      ) AS combined
      GROUP BY estado
    `

    const safeResult = result.map(row => ({
      estado: row.estado,
      total: Number(row.total),
    }))

    res.status(StatusCodes.OK).json(safeResult)
  } catch (error) {
    console.error("Erro ao buscar dados de solicitações:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar dados de solicitações" })
  }
}
