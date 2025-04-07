import { Chart1 } from "@/components/Charts/adminUsers/admin/chart1";
// import { Chart2 } from "@/components/Charts/adminUsers/admin/chart2";
import { Card } from "@/components/ui/card";
import { Users2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuários | SGI-IPIL",
  description: "Sistema de Gestão Integrado do IPIL",
}

export default function AdminUsuariosPage() {
  return (
    <>
      <div className="w-full p-2 pt-14 md:pt-2">
        <h2 className="text-2xl font-bold text-blue-700 flex flex-row space-x-2 items-center"><Users2></Users2><span>Usuários</span></h2>
        <div className="w-full flex flex-col space-y-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-2 mt-2">
            <Card className="h-28"></Card>
            <Card className="h-28"></Card>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-2">
            <Chart1></Chart1>
            {/* <Chart2></Chart2> */}
          </div>
        </div>
      </div>
    </>
  );
}
