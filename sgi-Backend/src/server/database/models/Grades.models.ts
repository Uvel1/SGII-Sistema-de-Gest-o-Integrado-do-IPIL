import { notas_trimestre } from "@prisma/client";

export interface INotas{
    id:number,                 
    mac:number,                      
    p1:number,                     
    p2:number,                  
    pf:number,                     
    trimestre:notas_trimestre,
    prof_disciplina_id:number,
    turma_aluno_id:number,
    created_at:Date,       
    updated_at:Date,        

}