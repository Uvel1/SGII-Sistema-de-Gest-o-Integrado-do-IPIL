import { solicitacao_aluno_estado, solicitacao_aluno_tipo } from '@prisma/client';

export interface ISolicitacaoAluno {
    id: number;
    aluno_id: number;
    tipo: solicitacao_aluno_tipo;
    descricao?: string;
    estado?: solicitacao_aluno_estado;
    data_solicitacao: Date;
    data_resolucao: Date;
  }