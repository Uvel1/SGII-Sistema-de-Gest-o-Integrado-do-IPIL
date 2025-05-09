import { Request, Response } from "express";
import { prisma } from '../../config/prisma.config';
import puppeteer from 'puppeteer';

export async function imprimirRelatorioTurma(req: Request, res: Response) {
  try {
    const professorId = Number(req.params.professorId);
    const turmaId     = Number(req.params.turmaId);

    if (isNaN(professorId) || isNaN(turmaId)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const sql = `
      SELECT JSON_OBJECT(
        'turma', JSON_OBJECT(
          'id', t.id,
          'nome', t.nome,
          'anoLetivo', t.ano_letivo,
          'classe', t.classe,
          'turno', t.turno
        ),
        'professor', JSON_OBJECT(
          'id', p.usuario_id,
          'nome', u.nome
        ),
        'alunos', (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', u2.id,
              'nome', u2.nome,
              'faltas', ta.faltas,
              'notas', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'disciplina', d.nome,
                    'mac', n.mac,
                    'p1', n.p1,
                    'p2', n.p2,
                    'pf', n.pf,
                    'mt', n.mt
                  )
                )
                FROM notas n
                INNER JOIN disciplinas d ON d.id = n.disciplina_id
                WHERE n.aluno_id = u2.id
              )
            )
          )
          FROM turma_alunos ta
          INNER JOIN usuarios u2 ON u2.id = ta.aluno_id
          WHERE ta.turma_id = t.id
        )
      ) AS payload
      FROM professores_turmas p
      INNER JOIN turmas t ON t.id = p.turma_id
      INNER JOIN usuarios u ON u.id = p.professor_id
      WHERE p.professor_id = ${professorId}
        AND p.turma_id     = ${turmaId};
    `;

    const result = await prisma.$queryRawUnsafe<{ payload: string }>(sql);
    const row = Array.isArray(result) ? result[0] : result;
    if (!row || !row.payload) {
      return res.status(404).json({ error: "Turma não encontrada ou sem alunos" });
    }

    const data = JSON.parse(row.payload);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1, h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Relatório de Turma</h1>
          <h2>${data.turma.nome} — ${data.turma.anoLetivo} (${data.turma.turno})</h2>
          <p><strong>Professor:</strong> ${data.professor.nome}</p>
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Faltas</th>
                <th>MAC</th>
                <th>P1</th>
                <th>P2</th>
                <th>PF</th>
                <th>MT</th>
              </tr>
            </thead>
            <tbody>
              ${data.alunos.map((aluno: any) => `
                <tr>
                  <td>${aluno.nome}</td>
                  <td>${aluno.faltas}</td>
                  ${aluno.notas.map((n: any) => `
                    <td>${n.mac}</td><td>${n.p1}</td><td>${n.p2}</td><td>${n.pf ?? '-'}</td><td>${n.mt ?? '-'}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    await browser.close();

    // 3) Envia PDF ao cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_turma_${turmaId}.pdf`);
    return res.send(pdfBuffer);

  } catch (error) {
    console.error("Erro em imprimirRelatorioTurma:", error);
    return res.status(500).json({ error: "Erro ao gerar relatório da turma" });
  }
}
