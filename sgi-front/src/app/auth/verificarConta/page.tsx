"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerificarContaPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="#"
            className="flex items-center gap-2 font-bold"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-md">
              <img src="/logo/logo.png" alt="logo" className="w-16 h-16" />
            </div>
            IPIL
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex-col lg:items-center lg:justify-center bg-blue-700 text-white lg:flex lg:p-8">
        <img src="/logo/sgi-branco.png" alt="logo" />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    nome: "",
    numero_bi: "",
    email: "",
  });
    const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "numero_bi") {
      // Validação para o campo BI
      const formattedValue = formatBI(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatBI = (value: string) => {
    // Remove todos os caracteres não permitidos
    let formattedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Limitar os primeiros 9 caracteres a apenas números
    if (formattedValue.length > 0) {
      const numericPart = formattedValue.slice(0, 9).replace(/\D/g, ""); // 9 primeiros números
      formattedValue = numericPart + formattedValue.slice(9);
    }

    // Garantir que as posições 10 e 11 sejam letras maiúsculas
    if (formattedValue.length > 9) {
      const part1 = formattedValue.slice(0, 9); // 9 primeiros números
      const part2 = formattedValue
        .slice(9, 11)
        .replace(/[^A-Z]/g, "")
        .toUpperCase(); // Letras maiúsculas
      formattedValue = part1 + part2 + formattedValue.slice(11);
    }

    // Garantir que as posições 12 a 14 sejam números
    if (formattedValue.length > 11) {
      const part1 = formattedValue.slice(0, 11); // 9 números + 2 letras
      const part3 = formattedValue.slice(11, 14).replace(/\D/g, ""); // 3 últimos números
      formattedValue = part1 + part3;
    }

    // Limitar o comprimento total a 14 caracteres
    return formattedValue.slice(0, 14);
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";

    // Validação do nome
    if (!formData.nome) {
      errorMessage += "Nome é obrigatório.\n";
      isValid = false;
    }

    // Validação do BI
    if (!formData.numero_bi) {
      errorMessage += "Número de BI é obrigatório.\n";
      isValid = false;
    } else if (!/^\d{9}[A-Z]{2}\d{3}$/.test(formData.numero_bi)) {
      errorMessage +=
        "BI deve ter 9 números, 2 letras maiúsculas e 3 números no final.\n";
      isValid = false;
    }

    // Validação do email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errorMessage += "Email inválido.\n";
      isValid = false;
    }

    if (!isValid) {
      alert(errorMessage); // Exibe os erros em um alert
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Dados enviados para a API:", formData);
      try {
        const response = await axios.post("http://localhost:3333/verificar", formData);
        console.log("Resposta da API:", response.data);
        router.push("/auth/login/aluno");
        return response;
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao fazer verificação. Verifique os dados e tente novamente.");
      }
    }
  };

  useEffect(() => {
  
      const userType = localStorage.getItem('userType');
      
      console.log(userType);
      
      switch (userType) {
        case "Admim":
          router.push("/admin");
          break;
        case "Coordenacao":
          router.push("/coord");
          break;
        case "Professor":
          router.push("/professores");
          break;
        case 'aluno':
          router.push("/alunos");
          break
      }
    }, [router]);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verificar Conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira o seu Nome, Email e o seu Nº do BI
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            type="text"
            name="nome"
            id="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="outline-none bg-white text-black"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Ex:ipil@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="outline-none bg-white text-black"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="numero_bi">Nº BI</Label>
          <Input
            type="text"
            name="numero_bi"
            id="numero_bi"
            placeholder="Ex:000000000AA000"
            value={formData.numero_bi}
            onChange={handleChange}
            required
            maxLength={14}
            className="outline-none bg-white  text-black"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
          Verificar Conta
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Ou
          </span>
        </div>
        <Button
          
          type="button" onClick={() => router.push('/auth/login/aluno')}
          variant="outline"
          className="w-full text-blue-700 hover:text-blue-700"
        >
          Entrar
        </Button>
      </div>
    </form>
  );
}
