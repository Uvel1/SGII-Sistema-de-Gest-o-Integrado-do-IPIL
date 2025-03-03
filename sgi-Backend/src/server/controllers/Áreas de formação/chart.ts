// /pages/api/alunos-por-area.ts
// import type { NextApiRequest, NextApiResponse } from "next"
// import { prisma } from "@/lib/prisma" // ajuste o caminho conforme sua estrutura

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const data = await prisma.$queryRaw<
//       { area: string; total: number }[]
//     >`
//       SELECT af.nome as area, COUNT(ad.id) as total
//       FROM aluno_detalhes ad
//       JOIN cursos c ON ad.curso_id = c.id
//       JOIN areas_formacao af ON c.areas_id = af.id
//       GROUP BY af.nome
//     `
//     res.status(200).json(data)
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao buscar dados" })
//   }
// }
