"use client";

import SideBar from "@/components/SideBar/commonUsers/professores";
import { ChartProf } from "@/components/Charts/commonUsers/professor/chartDepenho/index";
import { ChartProf2 } from "@/components/Charts/commonUsers/professor/chartDesenpenho2/index";
import { ChartProf3 } from "@/components/Charts/commonUsers/professor/chartDesempenho3";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfHomePage() {

  const router = useRouter();

  useEffect(() => {
    // Obtenha os tokens de onde os armazenou (localStorage, cookies, etc.)
    const accessToken = localStorage.getItem('accessToken'); // ou Cookie.get('accessToken')
    const refreshToken = localStorage.getItem('refreshToken'); // ou Cookie.get('refreshToken')
    const userType = localStorage.getItem('userType');

    // Se algum dos tokens não existir, redireciona para a página inicial
    if (!accessToken || !refreshToken) {
      router.push('/');
      return;
    }

    if (userType !== 'Professor') {
      router.push('/'); // Redireciona para a página inicial se o tipo não for "x"
    }
  }, [router]);

  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-4 pt-24">
        <div className="w-full flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-700">
            Gráficos Estatíscos
          </h2>
          <Button className="rounded-xl bg-blue-700 font-bold hover:bg-blue-800 fixed z-10 top-32 md:static shadow-md shadow-blue-600"><Printer></Printer> Gerar Relatório</Button>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 md:space-x-4 mt-14">
          <ChartProf></ChartProf>
          <ChartProf2></ChartProf2>
          <ChartProf3></ChartProf3>
        </div>
      </div>
    </>
  );
}
