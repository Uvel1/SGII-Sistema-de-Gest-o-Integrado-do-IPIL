import * as TableClasses from './Table.Classes';
import * as DeleteClasse from './delete.Classes';
import * as TableClassesForDashboard from './TableForDash.Classes';
import * as TableClassesForTeachers from './TableForTeacher.Classes';

export const ClassesController = {
    ...TableClasses,
    ...DeleteClasse,
    ...TableClassesForTeachers,
    ...TableClassesForDashboard,
};