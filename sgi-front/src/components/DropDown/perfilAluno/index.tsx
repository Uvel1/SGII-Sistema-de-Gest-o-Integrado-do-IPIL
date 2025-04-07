"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import {jwtDecode} from "jwt-decode"; // Utilize a importação default
import Link from "next/link";
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

export function PerfilAluno() {
  const router = useRouter();
  const [nome, setNome] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/logo/logo.png");
  const [userId, setUserId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");

    if (!token) {
      router.push("/");
      return;
    }

    // Decodifica o token para obter os dados do usuário
    const decoded = jwtDecode<CustomJwtPayload>(token);
    setNome(decoded.nome);
    setUserId(decoded.uid);
    setAccessToken(token);
    localStorage.setItem("nome", decoded.nome);

    if (userType !== "aluno") {
      router.push("/");
    }
  }, [router]);

  // Busca a foto do usuário no backend usando o endpoint GET
  useEffect(() => {
    if (userId && accessToken) {
      const fetchUserPhoto = async () => {
        try {
          const response = await fetch(`http://localhost:3333/user/photo/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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
  }, [userId, accessToken]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent hover:shadow-sm hover:shadow-blue-600 outline-blue-700 border-none shadow-none rounded-full w-10 h-10">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-700 text-white">
              <span>SC</span>
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
            href="/alunos/perfil"
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
