import * as sigin from './SignIn.StudentsDetails';
import * as tabela from './tabela.StudentsDetails';
import * as verfic from './verificarConta.StudentsDetails';
import * as certificado from './certificado.StudentsDetails';
import * as declaração from './declaração.StudentsDetails'
import * as apagar from './delete.StudentDetails';

export const StudentsDetailsController = {
    ...sigin,
    ...tabela,
    ...verfic,
    ...certificado,
    ...declaração,
    ...apagar,
};