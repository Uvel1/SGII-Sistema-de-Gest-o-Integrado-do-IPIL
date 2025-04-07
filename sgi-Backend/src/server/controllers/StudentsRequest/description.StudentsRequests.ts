import * as yup from "yup";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import { validation } from "../../shared/middleware/index.middleware";

interface IParams {
  id: number;
}

export const IdDescriptionValidation = validation((getSchema) => ({
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

export const GetRequestDescription = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    
    const results = await prisma.$queryRaw<any[]>`
  SELECT
    descricao AS \`desc\`,
    estado AS status,
    tipo,
    NULL AS resposta
  FROM solicitacao_aluno
  WHERE id = ${Number(id)}
`;


    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Pedido não encontrado" });
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error("Erro ao buscar a descrição do pedido:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao buscar a descrição do pedido" });
  }
};
