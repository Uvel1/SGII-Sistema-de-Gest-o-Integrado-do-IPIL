import * as create from './create.Pedidos'
import * as chart from './chart.Pedidos'
import * as table from './tabela.Pedidos'
import * as deletePedido from './Eliminar.Pedidos'

export const PedidosController = {
    ...create,
    ...chart,
    ...table,
    ...deletePedido,
};