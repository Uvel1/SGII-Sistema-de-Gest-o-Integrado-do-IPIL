"use client";

import { useRef, useState, useEffect } from "react";
import { ConfProfessor } from "@/components/Dialog/conf/confProfessor";
import SideBar from "@/components/SideBar/commonUsers/professores";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  uid: number;
  nome: string;
  email: string;
  tipo: string;
}

export default function PerfilProf() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<CustomJwtPayload | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/logo/logo.png");
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          if (token) {
            setAccessToken(token);
            const decoded = jwtDecode<CustomJwtPayload>(token);
            console.log("Token decodificado:", decoded);
            setUserData(decoded);
            localStorage.setItem("nome", decoded.nome);
            localStorage.setItem("email", decoded.email);
            localStorage.setItem("tipo", decoded.tipo);
          }
        }
      }, []);
  
     useEffect(() => {
         if (userData && accessToken) {
           const fetchUserPhoto = async () => {
             try {
               const response = await fetch(`http://localhost:3333/user/photo/${userData.uid}`, {
                 headers: {
                   Authorization: `Bearer ${accessToken}`
                 }
               });
               const data = await response.json();
               if (response.ok && data.photo) {
                 setAvatarUrl(data.photo);
               }
             } catch (error) {
               console.error("Erro ao buscar foto do usuário:", error);
             }
           };
           fetchUserPhoto();
         }
       }, [userData, accessToken]);
     
       if (!userData) {
         return <div>Loading...</div>;
       }
     
       const handleAvatarClick = () => {
         inputFileRef.current?.click();
       };
     
       const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
         const file = event.target.files?.[0];
         if (!file || !accessToken || !userData) return;
     
         if (userData.uid === undefined || userData.uid === null) {
           console.error("ID do usuário não está disponível no token.");
           return;
         }
     
         const formData = new FormData();
         formData.append("foto-perfil", file);
         formData.append("userId", userData.uid.toString());
     
         try {
           const response = await fetch("http://localhost:3333/upload-profile", {
             method: "POST",
             headers: {
               Authorization: `Bearer ${accessToken}`,
             },
             body: formData,
           });
           const data = await response.json();
           if (response.ok) {
             setAvatarUrl(data.user.foto_perfil);
             console.log("Foto atualizada com sucesso", data);
           } else {
             console.error("Erro:", data.error);
           }
         } catch (error) {
           console.error("Erro no upload:", error);
         }
       };

  return (
    <>
      <SideBar></SideBar>
      <div className="w-full p-8 pt-24">
        <h2 className="text-2xl font-bold text-blue-700">Perfil</h2>
        <div className="w-full flex flex-col items-center justify-center gap-4">
        <div onClick={handleAvatarClick} className="cursor-pointer" title="Editar foto">
          <Avatar className="w-72 h-72">
            <AvatarImage src={avatarUrl}></AvatarImage>
            <AvatarFallback className="bg-blue-700 text-white">
              <span>SC</span>
            </AvatarFallback>
          </Avatar>
          </div>
          <input
          type="file"
          name="foto-perfil"
          id="foto-perfil"
          className="hidden"
          ref={inputFileRef}
          title="Editar foto"
          onChange={handleFileUpload}
        />
          <h3 className="font-bold text-2xl">{userData.nome}</h3>
          <div className="w-full h-auto md:w-[800px] border-2 border-blue-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold">Disciplina</h2>
              <span>TLP</span>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold">Email</h2>
              <span className="text-nowrap text-ellipsis overflow-hidden w-44">{userData.email}</span>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="font-bold">Cargo</h2>
              <span>{userData.tipo}</span>
            </div>
          </div>
          <ConfProfessor></ConfProfessor>
        </div>
      </div>
    </>
  );
}
