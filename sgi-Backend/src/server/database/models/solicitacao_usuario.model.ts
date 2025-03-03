import { solicitacao_usuario_estado } from "@prisma/client";

export interface SolicitacaoUsuario {
    id: number;
    usuario_id: number;
    descricao: string;
    estado?: solicitacao_usuario_estado;
    data_solicitacao: Date;
    data_resolucao: Date;
  }