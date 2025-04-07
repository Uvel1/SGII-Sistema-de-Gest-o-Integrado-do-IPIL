"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-bold">
            <div className="flex h-16 w-16 items-center justify-center rounded-md">
              <img src="/logo/logo.png" alt="logo" className="w-16 h-16" />
            </div>
            IPIL
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex-col lg:items-center lg:justify-center bg-blue-700 lg:flex lg:p-8">
        <img src="/logo/sgi-branco.png" alt="logo" />
      </div>
    </div>
  );
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";

    if (!formData.email) {
      errorMessage += "Email é obrigatório.\n";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errorMessage += "Email inválido.\n";
      isValid = false;
    }

    if (!formData.senha) {
      errorMessage += "Senha é obrigatória.\n";
      isValid = false;
    }

    if (!isValid) {
      toast.error(errorMessage);
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3333/Entrar", formData);
      console.log("Resposta da API:", response.data);

      const { accessToken, refreshToken, userType } = response.data as {
        accessToken: string;
        refreshToken: string;
        userType: unknown;
      };

      // Armazena os tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Extraímos o tipo de usuário conforme a estrutura da API
      const userTypeValue =
        Array.isArray(userType) && userType.length > 0 ? userType[0].tipo_de_usuario : null;

      if (!userTypeValue) {
        toast.error("Tipo de usuário não definido");
        return;
      }

      // Armazena exatamente o valor recebido
      localStorage.setItem("userType", userTypeValue);

      // Redirecionamento simples baseado no valor exato
      switch (userTypeValue) {
        case "Secretaria":
          router.push("/admin");
          break;
        case "Coordenação":
          router.push("/coord");
          break;
        case "Professor":
          router.push("/professores");
          break;
        case "Aluno":
          router.push("/alunos");
          break;
        default:
          toast.error("Tipo de usuário desconhecido: " + userTypeValue);
          break;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login. Verifique os dados e tente novamente.");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira o seu Email e sua respectiva Senha
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Ex: ipil@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="outline-none bg-white text-black"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Esqueceu a sua senha?
            </a>
          </div>
          <Input
            id="password"
            name="senha"
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
          Entrar
        </Button>
      </div>
    </form>
  );
}
