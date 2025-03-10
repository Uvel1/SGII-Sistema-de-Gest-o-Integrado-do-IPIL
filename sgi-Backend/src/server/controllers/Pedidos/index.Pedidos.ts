import * as create from './create.Pedidos'
import * as chart from './chart.Pedidos'
import * as table from './tabela.Pedidos'
import * as deletePedido from './Eliminar.Pedidos'
import * as docs from './docs.pedidos'
import * as chart2 from './chart2.Pedidos'
import * as delDocs from './docDel.Pedidos'
import * as docsImpress from './docsImpress.Pedidos'

export const PedidosController = {
    ...create,
    ...chart,
    ...table,
    ...deletePedido,
    ...docs,
    ...chart2,
    ...delDocs,
    ...docsImpress,

};