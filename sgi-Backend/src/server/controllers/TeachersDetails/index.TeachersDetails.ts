import * as TeachersTable from './Table.TeachersDetails';
import * as DeleteTeacher from './delete.TeachersDetails';
import * as imprimir from './imprimirRelat.TeachersDetails';
import * as chart1 from './charts1.TeachrsDetails';
import * as chart2 from './chart2';
import * as gerarRelatorio from './gerarRelatorioPorProfessor.TeachersDetails';

export const TeachersDetailsController = {
    ...chart1,
    ...chart2,
    ...gerarRelatorio,
    ...imprimir,
    ...TeachersTable,
    ...DeleteTeacher,
};