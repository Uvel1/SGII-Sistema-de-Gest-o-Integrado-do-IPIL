import * as tabelaProfessores from './tabela.professores';
import * as apagarProfessores from './delete.professores';

export const ProfessoresController = {
    ...tabelaProfessores,
    ...apagarProfessores,
};