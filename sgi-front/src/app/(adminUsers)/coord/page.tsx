"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chart1 } from "@/components/Charts/adminUsers/coord/chart1";
import { ChartAlunosPorArea } from "@/components/Charts/adminUsers/coord/chart2";
import { Chart3 } from "@/components/Charts/adminUsers/coord/chart3";
import { ChartDocumentosSubmetidosPorTipo } from "@/components/Charts/adminUsers/coord/chart4/page";
import { Home } from "lucide-react";

export default function CoordHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Obtém os tokens e o tipo de usuário do localStorage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userType = localStorage.getItem("userType");

    // Se faltar algum dado, redireciona para a página inicial
    if (!accessToken || !refreshToken) {
      router.push('/');
      return;
    }

    // Verifica se o tipo de usuário é exatamente "Coordenação"
    if (userType !== 'Coordenação') {
      router.push('/'); // Redireciona para a página inicial se o tipo não for "x"
    }
  }, [router]);

  return (
    <div className="w-full p-2 pt-14 md:pt-2">
      <h2 className="text-2xl font-bold text-blue-700 flex flex-row space-x-2 items-center">
        <Home />
        <span>Ínicio</span>
      </h2>
      <div className="w-full flex flex-col space-y-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-2 mt-2">
          <Chart3 />
          <ChartDocumentosSubmetidosPorTipo/>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-2">
          <Chart1 />
          <ChartAlunosPorArea />
        </div>
      </div>
    </div>
  );
}
