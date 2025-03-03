import { user_detalhes_sexo } from "@prisma/client";


export interface IAluno_detalhes {
    id: number;
    numero_processo: number;
    numero_bi: string;
    sexo: user_detalhes_sexo;
    data_nasc: Date;
    aluno_id: number;
    curso_id: number;
    created_at: Date;
    updated_at: Date;
}