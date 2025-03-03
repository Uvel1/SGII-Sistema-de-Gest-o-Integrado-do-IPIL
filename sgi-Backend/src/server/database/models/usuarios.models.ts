
import { usuarios_tipo_de_usuario } from '@prisma/client';
export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    senha:string;
    foto_perfil: string;
    tipo_de_usuario: usuarios_tipo_de_usuario;
    create_at: Date;
    update_at: Date;
  }