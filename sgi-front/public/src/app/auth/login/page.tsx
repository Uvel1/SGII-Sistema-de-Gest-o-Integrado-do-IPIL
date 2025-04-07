"use client";

import React, { useState } from "react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-blue-900 text-white">
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
      <div className="relative hidden lg:flex-col lg:items-center lg:justify-center bg-white lg:flex lg:p-8">
        <img src="/logo/sgi.png" alt="logo" />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    bi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bi") {
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

    // Validação do BI
    if (!formData.bi) {
      errorMessage += "Número de BI é obrigatório.\n";
      isValid = false;
    } else if (!/^\d{9}[A-Z]{2}\d{3}$/.test(formData.bi)) {
      errorMessage +=
        "BI deve ter 9 números, 2 letras maiúsculas e 3 números no final.\n";
      isValid = false;
    }

    if (!isValid) {
      alert(errorMessage); // Exibe os erros em um alert
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Formulário válido!", formData);
    } else {
      console.log("Existem erros no formulário.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-balance text-sm text-white">
          Insira o seu Nº do BI e a sua respectiva senha
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Input
            type="text"
            name="bi"
            id="bi"
            placeholder="Ex:000000000AA000"
            value={formData.bi}
            onChange={handleChange}
            required
            maxLength={14}
            className="outline-none bg-white  text-black"
          />
        </div>
        <div className="grid gap-2">
          <Input
            id="password"
            type="password"
            placeholder="Senha"
            required
            className="outline-none bg-white border-none text-black"
          />
          <div className="flex items-center">
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full font-bold bg-blue-700 hover:bg-blue-800"
        >
          Entrar
        </Button>
        <Button
          variant="outline"
          className="w-full text-blue-700 font-bold hover:text-blue-700 hover:bg-muted"
        >
          Verificar Conta
        </Button>
      </div>
    </form>
  );
}
