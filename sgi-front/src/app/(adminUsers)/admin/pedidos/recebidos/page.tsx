import { TableAdminPedidos } from "@/components/Table/dashboard/pedidos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recebidos | SGI-IPIL",
  description: "Sistema de Gestão Integrado do IPIL",
  icons: {
    icon: "/logo/logo.png"
  },
}



export default function AdminPedidosPage() {
  return (
    <>
      <div className="w-full p-2 pt-14 md:pt-2">
        <h2 className="text-2xl font-bold text-blue-700">Pedidos Recebidos</h2>
        <TableAdminPedidos></TableAdminPedidos>
      </div>
    </>
  );
}
