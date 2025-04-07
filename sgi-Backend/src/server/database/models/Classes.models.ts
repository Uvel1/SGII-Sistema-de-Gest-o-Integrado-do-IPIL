import {turmas_turno} from "@prisma/client";

export interface ITurmas{
    id:number,
    nome:string,
    ano_lectivo:number,
    diretorTurma_id:number,
    classe:string,
    sala:string,
    turno:turmas_turno,
    created_at:Date,
    updated_at:Date,
};