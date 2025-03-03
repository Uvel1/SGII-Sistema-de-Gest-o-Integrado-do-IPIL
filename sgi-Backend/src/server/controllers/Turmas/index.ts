import * as tabela_turmas from './tabela.turmas';
import * as tabela_prof from './tabelaProf.Turmas';
import * as tabela_turmas_dashboard from './tabelaDash.Turmas';
import * as apagar_turma from './delete.turma';

export const TurmasController = {
    ...tabela_turmas,
    ...tabela_prof,
    ...tabela_turmas_dashboard,
    ...apagar_turma,
};