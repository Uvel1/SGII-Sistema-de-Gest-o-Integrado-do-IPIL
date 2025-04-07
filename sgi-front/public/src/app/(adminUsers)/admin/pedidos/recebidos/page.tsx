import { TableAdminPedidos } from "@/components/Table/dashboard/pedidos";

export default function AdminPedidosPage() {
  return (
    <>
      <div className="w-full p-8 pt-16 md:pt-0">
        <h2 className="text-2xl font-bold text-blue-700">Pedidos Recebidos</h2>
        <TableAdminPedidos></TableAdminPedidos>
      </div>
    </>
  );
}
