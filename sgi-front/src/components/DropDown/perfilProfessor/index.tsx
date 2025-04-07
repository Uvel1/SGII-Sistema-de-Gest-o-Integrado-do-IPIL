"use client";

import { LogOut, User } from "lucide-react";
import {jwtDecode} from "jwt-decode"; // Importação default para decodificar o token
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CustomJwtPayload {
  uid: number;
  nome: string;
}

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userType");
  window.location.href = "/";
};

export function PerfilProfessor() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("https://github.com/shadcn.png");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Token não encontrado");
      router.push("/");
      return;
    }
    setToken(accessToken);
    try {
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
      setNome(decoded.nome);
      setUserId(decoded.uid);
      localStorage.setItem("nome", decoded.nome);
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
    }
  }, [router]);

  // Busca a foto do usuário no backend quando o userId e o token estiverem disponíveis
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

  if (!token) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
            href="/professores/perfil"
            className="flex flex-row items-center space-x-1 hover:bg-blue-700 hover:text-white p-1 rounded-lg"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Perfil</span>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          href="/"
          onClick={handleLogout}
          className="flex flex-row items-center space-x-1 hover:bg-blue-700 hover:text-white p-1 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
