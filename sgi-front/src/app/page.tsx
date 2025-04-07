"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Login } from "@/components/Dialog/auth/login";
import { VerificarConta } from "@/components/Dialog/auth/verificarConta";

export default function HomePage() {

  const router = useRouter();

  useEffect(() => {
    // Executa somente na montagem
    const userType = localStorage.getItem("userType");
    if (userType) {
      let target = "";
      switch (userType) {
        case "Secretaria":
          console.log("Redirecionando ", userType, " para /admin");
          target = "/admin";
          break;
        case "Coordenação":
          console.log("Redirecionando ", userType, " para /coord");
          target = "/coord";
          break;
        case "Professor":
          console.log("Redirecionando ", userType, " para /professores");
          target = "/professores";
          break;
        case "Aluno":
          console.log("Redirecionando ", userType, " para /alunos");
          target = "/alunos";
          break;
        default:
          toast.error("Tipo de usuário desconhecido: " + userType);
          break;
      }
      if (target && window.location.pathname !== target) {
        router.push(target);
      }
    }
  }, [router]);

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex md:flex-row">
        <div className="w-full flex flex-row items-center justify-center space-x-2 absolute mt-10 md:justify-start md:pl-12">
          <img src="/logo/logo.png" alt="logo da escola" className="w-16 h-16" />
          <span className="font-bold text-black">IPIL</span>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 className="font-bold text-blue-700 text-center text-2xl md:text-4xl">
            Seja bem-vindo a nossa plataforma
          </h2>
          <p className="text-blue-700 font-bold">Conecte-se já ao futuro</p>
          <div className="flex flex-row space-x-4 mt-32">
            <Login>
            </Login>
            <VerificarConta></VerificarConta>
          </div>
        </div>
        <div className="w-full h-full bg-blue-700 hidden md:flex items-center justify-center">
          <img src="/logo/sgi-branco.png" alt="logo" className="h-[200px]" />
        </div>
      </div>
    </div>
  );
}
