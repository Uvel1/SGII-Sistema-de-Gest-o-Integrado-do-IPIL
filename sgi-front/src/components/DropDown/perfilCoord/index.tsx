"use client";

import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import {jwtDecode} from "jwt-decode"; // Importação default
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

interface CustomJwtPayload {
  uid: number;
  nome: string;
}

export function PerfilCoord() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("/logo/logo.png");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
    if (!accessToken) {
      toast.error("Token não encontrado");
      router.push("/");
      return;
    }
    setToken(accessToken);
    const decoded = jwtDecode<CustomJwtPayload>(accessToken);
    setNome(decoded.nome);
    setUserId(decoded.uid);
    localStorage.setItem("nome", decoded.nome);

    // Caso o tipo do usuário não seja o esperado (ex.: "coord"), redireciona
    if (userType !== "Coordenação") {
      router.push("/");
    }
  }, [router]);

  // Busca a foto do usuário no backend assim que o userId e token estiverem disponíveis
  useEffect(() => {
    if (userId && token) {
      const fetchUserPhoto = async () => {
        try {
          const response = await fetch(`http://localhost:3333/user/photo/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.photo) {
            setAvatarUrl(data.photo);
          } else {
            console.error("Erro ao buscar a foto:", data.error);
          }
        } catch (error) {
          console.error("Erro ao buscar a foto:", error);
        }
      };
      fetchUserPhoto();
    }
  }, [userId, token]);

  // Se o token não estiver definido, não renderiza o dropdown
  if (!token) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden md:flex">
        <Button className="bg-transparent hover:bg-transparent hover:shadow-sm hover:shadow-blue-600 outline-blue-700 border-none shadow-none rounded-full w-10 h-10">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-700 text-white">
              <span>{nome ? nome.charAt(0).toUpperCase() : "?"}</span>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-blue-700 mr-4">
        <DropdownMenuLabel className="text-nowrap text-ellipsis overflow-hidden w-44">
          {nome}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          <Link
            href="/coord/perfil"
            className="flex flex-row items-center space-x-1 hover:bg-blue-700 hover:text-white p-1 rounded-lg"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Perfil</span>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userType");
            window.location.href = "/";
          }}
          className="flex flex-row items-center space-x-1 hover:bg-blue-700 hover:text-white p-1 rounded-lg w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
