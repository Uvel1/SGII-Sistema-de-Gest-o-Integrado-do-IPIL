import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

declare module 'express' {
    export interface Request {
      user?: {
        uid: number;
        nome: string;
        tipo?: string;
      };
    }
  }

// Função que verifica o token JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtém o token do cabeçalho

  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: {
        default: 'Token não fornecido!',
      },
    });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Substitua pelo seu segredo
    req.user = decoded as { uid: number; nome: string; tipo?: string }; // Atribui o payload do token à requisição
    next(); // Passa o controle para a próxima função de middleware ou rota
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Token inválido ou expirado!',
      },
    });
  }
};
