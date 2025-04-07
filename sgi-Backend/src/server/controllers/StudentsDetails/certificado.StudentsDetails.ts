import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware/index.middleware";
import { prisma } from "../../config/prisma.config";
import { IUsuario, IAluno_detalhes, ISolicitacaoAluno } from "../../database/models/index.models";
import { wss } from "../../../index";

function sendSolicitacoesUpdate() {
  (async () => {
    try {
      const results = await prisma.$queryRaw<any[]>`
        SELECT
          sa.id,
          sa.tipo,
          sa.estado,
          JSON_OBJECT(
            'nome', u.nome,
            'numero_bi', ad.numero_bi,
            'email', u.email,
            'curso', JSON_OBJECT('nome', c.nome)
          ) AS aluno
        FROM solicitacao_aluno AS sa
        INNER JOIN usuarios AS u ON sa.aluno_id = u.id
        INNER JOIN aluno_detalhes AS ad ON ad.aluno_id = u.id
        INNER JOIN cursos AS c ON ad.curso_id = c.id;
      `;

      const formattedResults = results.map((row) => ({
        id: row.id,
        tipo: row.tipo,
        estado: row.estado,
        aluno: JSON.parse(row.aluno),
      }));

      const message = JSON.stringify({
        type: "updateSolicitacoes",
        data: formattedResults,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error("Erro ao enviar atualização via WebSocket:", error);
    }
  })();
}

interface IBodyProps
  extends Omit<
      IAluno_detalhes,
      | "id"
      | "numero_processo"
      | "created_at"
      | "updated_at"
      | "aluno_id"
      | "sexo"
      | "numero_processo"
      | "curso_id"
      | "turmas"
      | "data_nasc"
    >,
    Omit<
      IUsuario,
      | "id"
      | "senha"
      | "create_at"
      | "update_at"
      | "senha"
      | "foto_perfil"
      | "tipo_de_usuario"
    >,
    Omit<
      ISolicitacaoAluno,
      | "id"
      | "aluno_id"
      | "tipo"
      | "estado"
      | "data_solicitacao"
      | "data_resolucao"
    > {}

export const RequestCertificateValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required(),
      numero_bi: yup.string().required(),
      email: yup.string().required().email(),
      curso: yup.string().required(),
      descricao: yup.string(),
    })
  ),
}));

export const RequestCertificate = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const { numero_bi, nome, email, descricao } = req.body;

  try {
    const user = await prisma.usuarios.findUnique({
      where: {
        email: email,
        nome: nome,
      },
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: {
          default: "BI ou nome de aluno são inválidos",
        },
      });
    }

    const aluno = await prisma.aluno_detalhes.findUnique({
      where: { numero_bi: numero_bi },
    });

    if (!aluno) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errors: {
          default: "BI ou nome de aluno são inválidos",
        },
      });
    }

    const novaSolicitacao = await prisma.solicitacao_aluno.create({
      data: {
        aluno_id: aluno.aluno_id,
        tipo: "Certificado",
        descricao: descricao,
      },
    });

    console.log("Pedido criado", novaSolicitacao);

    sendSolicitacoesUpdate();

    res.status(StatusCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "Erro ao processar a solicitação",
      },
    });
  }
};
