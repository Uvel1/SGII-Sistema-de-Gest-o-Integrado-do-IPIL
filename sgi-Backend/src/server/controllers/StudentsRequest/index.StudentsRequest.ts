import * as chart from './chart.StudentsRequests'
import * as table from './Table.StudentsRequests'
import * as create from './create.StudentsRequests'
import * as chart2 from './chart2.StudentsRequests'
import * as update from './updateStatus.StudentsRequests'
import * as deleteRequest from './delete.StudentsRequests'
import * as descPedido from './description.StudentsRequests'

export const StudentsRequestsController = {
    ...chart,
    ...table,
    ...create,
    ...chart2,
    ...update,
    ...descPedido,
    ...deleteRequest,

};