
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CriarAluno() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold bg-blue-700 hover:bg-blue-800">
          Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">Adicionar Aluno</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coluna da esquerda: avatar com seleção */}
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div
                          className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-700 cursor-pointer"
                          onClick={handleImageClick}
                          title="Clique para selecionar a foto"
                        >
                          <Avatar className="w-full h-full">
                            <AvatarImage src={selectedImage || ""} />
                            <AvatarFallback className="bg-blue-700 text-white text-4xl">
                              <User2 size={48} />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500">Clique na imagem para escolher uma foto</p>
                      </div>
        
                      {/* Coluna da direita: formulário */}
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 font-medium">Nome Completo</label>
                          <Input placeholder="Digite o nome" />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">E-mail</label>
                          <Input type="email" placeholder="usuario@exemplo.com" />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">Senha</label>
                          <Input type="password" placeholder="••••••••" />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">Tipo de Usuário</label>
                          <select className="w-full p-2 border rounded">
                            <option value="Secretaria">Secretaria</option>
                            <option value="Coordenação">Coordenação</option>
                            <option value="Professor">Professor</option>
                            <option value="Aluno">Aluno</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                                  <Button className="bg-blue-700 hover:bg-blue-800">
                                    Criar Usuário
                                  </Button>
                                </div>
      </DialogContent>
    </Dialog>
  );
}