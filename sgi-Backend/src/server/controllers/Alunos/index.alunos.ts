import * as sigin from './SignIn.Alunos';
import * as tabela from './tabela.Alunos';
import * as verfic from './verificarConta.Alunos';
import * as certificado from './certificado.Alunos';
import * as declaração from './declaração.Aluno'
import * as apagar from './delete.aluno';

export const AlunosController = {
    ...sigin,
    ...tabela,
    ...verfic,
    ...certificado,
    ...declaração,
    ...apagar,
};