import * as TeachersTable from './Table.TeachersDetails';
import * as DeleteTeacher from './delete.TeachersDetails';

export const TeachersDetailsController = {
    ...TeachersTable,
    ...DeleteTeacher,
};