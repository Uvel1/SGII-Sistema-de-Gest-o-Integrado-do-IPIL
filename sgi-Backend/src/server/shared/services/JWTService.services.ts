import * as jwt from "jsonwebtoken";

interface IJwtData {
  uid: number;
  nome: string;
  tipo_de_usuario?: string;
  curso?: string;
  email: string;
  disciplina?: string;
  nproc?:number;

}

const sign = (data: IJwtData): string | "JWT_SECRET_NOT_FOUND" => {
  if (!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

  // Define o tipo padrão como "aluno" se data.tipo for undefined ou null
  const payload = { ...data, tipo: data.tipo_de_usuario ? data.tipo_de_usuario : "aluno" };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }); // Access token expira em 15 minutos
};

const signRefreshToken = (data: IJwtData): string | "JWT_SECRET_NOT_FOUND" => {
  if (!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

  // Define o tipo padrão como "aluno" se data.tipo for undefined ou null
  const payload = { ...data, tipo: data.tipo_de_usuario ? data.tipo_de_usuario : "aluno" };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }); // Refresh token expira em 24 horas
};

const verify = (token: string): IJwtData | "JWT_SECRET_NOT_FOUND" | "INVALID_TOKEN" => {
  if (!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "string") {
      return "INVALID_TOKEN";
    }
    return decoded as IJwtData;
  } catch (error) {
    return "INVALID_TOKEN";
  }
};

export const JWTService = {
  sign,
  signRefreshToken,
  verify,
};
