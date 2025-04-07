"use client";


import React, { useState } from "react";
import SideBar from "@/components/SideBar/commonUsers/alunos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Certificado() {
  const [formData, setFormData] = useState({ email: "", nome: "", ano:"", curso:"", numero_bi:"", descricao:"", tel:""});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
  
      if (!formData.nome) {
        errorMessage += "Nome é obrigatória.\n";
        isValid = false;
      }

      if (!formData.numero_bi) {
        errorMessage += "BI é obrigatória.\n";
        isValid = false;
      }
      
      if (!isValid) {
        toast.error(errorMessage);
      }
  
      return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (validateForm()) {
        try {
          const response = await axios.post("http://localhost:3333/certificado", formData);
  
          console.log(response.data);

          setFormData({
            email: "",
            nome: "",
            ano: "",
            curso: "",
            numero_bi: "",
            descricao: "",
            tel:"",
          });
    
          toast.success("Pedido enviado com sucesso!");
          toast.success("Aguarde a confirmação do pedido.");
          
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          toast.error("Erro ao fazer pedido. Verifique os dados e tente novamente.");
        }
      }
    };

  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-16 md:pt-24">
        <h2 className="text-2xl font-bold text-blue-700">
          Solicitação de Certificado
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-4">
          <Card className="p-4">
            <CardHeader>
              <div className="w-full flex flex-row items-center justify-between text-blue-700 font-semibold">
                <h2>Formulário de Solicitação</h2>
                <Send></Send>
              </div>
            </CardHeader>
            <CardDescription>
              Preencha corretamente o formulário
            </CardDescription>
            <CardContent className="w-fulll mt-4">
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center space-y-2">
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <Input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome"
                    className="w-full"
                  ></Input>
                  <Input
                    type="text"
                    name="numero_bi"
                    id="numero_bi"
                    value={formData.numero_bi}
                    onChange={handleChange}
                    placeholder="Nº BI"
                    className="w-full"
                  ></Input>
                </div>
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full"
                  ></Input>
                  <Input
                    type="text"
                    name="tel"
                    id="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    placeholder="Tel"
                    className="w-full"
                  ></Input>
                </div>
                <div className="w-full md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row">
                  <select 
                  
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}


                  className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona o ano</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                  </select>
                  <select 

                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  
                  className="w-full rounded-lg border outline-blue-700 p-2">
                    <option value="">Seleciona o curso</option>
                    <option value="Téc. Informática">Téc. Informática</option>
                    <option value="Informática de Gestão">Informática de Gestão</option>
                  </select>
                </div>
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} className="w-full rounded-lg p-4 bg-gray-100 outline-blue-700 border"></textarea>
                <div>
                    <Input type="submit" value={'Submeter'} className="bg-blue-700 text-white font-bold hover:bg-blue-800"></Input>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card></Card>
        </div>
      </div>
    </>
  );
}
