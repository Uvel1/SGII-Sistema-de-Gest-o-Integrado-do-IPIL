"use client";

import SideBar from "@/components/SideBar/commonUsers/alunos";
import { TableBoletim } from "@/components/Table/commonUsers/alunos/boletim";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AlunoHomePage() {

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
    
    console.log(userType);

    if (userType !== 'aluno') {
      router.push('/'); // Redireciona para a página inicial se o tipo não for "x"
    }
  }, [router]);

  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Boletim de Notas</h2>
        <TableBoletim></TableBoletim>
      </div>
    </>
  );
}
