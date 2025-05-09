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

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); 

  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: {
        default: 'Token não fornecido!',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { uid: number; nome: string; tipo?: string };
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Token inválido ou expirado!',
      },
    });
  }
};
