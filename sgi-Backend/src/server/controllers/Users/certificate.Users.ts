import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware/index.middleware';
import { prisma } from '../../config/prisma.config';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

interface IParams {
  id: number;
}

export const idCertifValidation = validation((getSchema) => ({
  params: getSchema<IParams>(
    yup.object().shape({
      id: yup
        .number()
        .transform((value, originalValue) => Number(originalValue))
        .typeError("O id deve ser um número")
        .required("O id é obrigatório"),
    })
  ),
}));

async function gerarPDF(
  declaracaoData: {
    nomeAluno: string;
    nomePai: string;
    nomeMae: string;
    numeroBI: string;
    numProc: string;
    areaForm: string;
    dataNasc: string;
    localNasc: string;
    localEmissaoBI: string;
    dataEmissaoBI: string;
    classe: string;
    nomeCurso: string;
    periodo: string;
    dataDocumento: string;
  },
  logoPath: string
): Promise<Buffer> {
  let logoBase64 = "";
  try {
    const imageBuffer = fs.readFileSync(logoPath);
    logoBase64 = imageBuffer.toString('base64');
  } catch (err) {
    console.error("Erro ao carregar a imagem", err);
  }

  const boletim = [
    { nome: 'MATEMÁTICA',         faltas: 8, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'ING.TEC',            faltas: 2, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'FÍSICA',             faltas: 3, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'TIEC',               faltas: 1, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'TIC',                faltas: 0, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'TLP',                faltas: 0, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'PROJECT.TEC',        faltas: 2, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'EMPREENDEDORISMO',   faltas: 1, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
    { nome: 'OGI',                faltas: 0, j: 7,  i: 13, p1: 9,  p2: 15, pt: 10, med: 12 },
  ];

  const linhasDisciplinas = boletim.map((disc) => {
    return `
      <tr>
        <td>${disc.nome}</td>
        <td>${disc.faltas}</td>
        <td>${disc.j}</td>
        <td>${disc.i}</td>
        <td>${disc.p1}</td>
        <td>${disc.p2}</td>
        <td>${disc.pt}</td>
        <td>${disc.med}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 20px 40px 0 40px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
      }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .title { font-size: 16px; font-weight: bold; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      table, th, td {
        border: 1px solid black;
      }
      th, td {
        padding: 6px;
        text-align: center;
      }
      thead th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
      tbody td:first-child {
        text-align: left;
      }
      .info-section {
        margin: 10px 0;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="center">
      ${logoBase64 ? `<img src="data:image/jpeg;base64,${logoBase64}" width="70" height="70" />` : ""}
    </div>
    <div class="center bold">REPÚBLICA DE ANGOLA</div>
    <div class="center bold">MINISTÉRIO DA EDUCAÇÃO</div>
    <div class="center">----------||----------</div>
    <div class="center bold title">INSTITUTO POLITÉCNICO INDUSTRIAL DE LUANDA</div>
    <div class="center" style="font-size:16px;">
      (RUA EUGÉNIO DE CASTRO / LARGO DO SOWETO - CP:2513 - LUANDA/ANGOLA)
    </div>
    <br/>
    <div class="info-section">
      NOME: ${declaracaoData.nomeAluno || "NOME_DO_ALUNO"}<br/>
      Turma: ${declaracaoData.classe || "13ª"}
    </div>
    <div class="center title">DECLARAÇÃO DE FREQUÊNCIA COM NOTAS</div>
    <br/>
    <div style="line-height: 1.5; font-size:14px;">
      Para efeitos: <strong class="underline">Comprovativo</strong>, declara-se que,
      <strong class="underline">${declaracaoData.nomeAluno || 'NOME_DO_ALUNO'}</strong>, filho de
      <strong class="underline">${declaracaoData.nomePai || 'NOME_DO_PAI'}</strong> e de
      <strong class="underline">${declaracaoData.nomeMae || 'NOME_DA_MAE'}</strong> nascido em 
      <strong class="underline">${declaracaoData.localNasc || 'LOCAL_DE_NASCIMENTO'}</strong> aos
      <strong class="underline">${declaracaoData.dataNasc || 'DD/MM/AAAA'}</strong>, portador do Bilhete de Identidade nº
      <strong class="underline">${declaracaoData.numeroBI || 'NUMERO_DO_BI'}</strong>, passado pelo
      Arquivo de Identificação Civil de <strong class="underline">Luanda</strong>, aos
      <strong class="underline">${declaracaoData.dataEmissaoBI || 'DD/MM/AAAA'}</strong>, sob o nº de processo
      <strong class="underline">${declaracaoData.numProc || 'NUMERO_DE_PROCESSO'}</strong> frequenta no ano lectivo a
      <strong class="underline">${declaracaoData.classe || '13ª'}</strong> classe; do curso de
      <strong class="underline">${declaracaoData.nomeCurso || 'Técnico de Gestão dos sistemas Informáticos'}</strong> da Área de Formação de
      <strong class="underline">${declaracaoData.areaForm || 'INFORMÁTICA'}</strong> em regime
      <strong class="underline">${declaracaoData.periodo || 'TARDE'}</strong>.
    </div>
    <br/>   
    <table>
      <thead>
        <tr>
          <th rowspan="2">DISCIPLINAS</th>
          <th colspan="6">CLASSIFICAÇÃO</th>
        </tr>
        <tr>
          <th>10º</th>
          <th>11º</th>
          <th>12º</th>
          <th>13º</th>
          <th>EXAME</th>
          <th>RESULTADO FINAL</th>
        </tr>
      </thead>
      <tbody>
        ${linhasDisciplinas}
      </tbody>
    </table>
    <br>
    <div style="font-size:14px;">
      Por ser verdade e me ter sido solicitado, mandei passar a presente Declaração que vai por mim assinada e autenticada com carimbo a óleo em uso nesta Escola.
    </div>
    <br/>
    <div style="text-align: left; font-size: 16px;">
      Luanda, aos ${declaracaoData.dataDocumento || 'DD de Mês de AAAA'}.
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="font-size:14px; font-weight:bold;">A CHEFE DA SECRETARIA PEDAGÓGICA</div>
        <div style="font-size:12px;">____________________________</div>
        <div style="font-size:10px; font-weight:bold;">ANA PAULA FERNANDES LIMA</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="font-size:14px; font-weight:bold;">O SUBDIRETOR PEDAGÓGICO</div>
        <div style="font-size:12px;">____________________________</div>
        <div style="font-size:10px; font-weight:bold;">EDSON JORGE SOUSA VIEGAS</div>
      </div>
    </div>
  </body>
</html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    printBackground: true
  });
  await browser.close();
  return pdfBuffer;
}

export const EnviarCertificado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pedido = await prisma.solicitacao_aluno.findUnique({
      where: { id: Number(id) },
      select: { aluno_id: true },
    });
      
    if (!pedido) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Pedido não encontrado' },
      });
    }

    const alunoId = pedido.aluno_id;

    const certificadoData: Array<{
      nomeAluno: string;
      nomePai: string;
      nomeMae: string;
      numeroBI: string;
      numProc: string;
      dataNasc: string;
      localNasc: string;
      localEmissaoBI: string;
      dataEmissaoBI: string;
      nomeCurso: string;
      areaForm: string;
      periodo: string;
      classe: string;
      dataDocumento?: string;
    }> = await prisma.$queryRaw`
      SELECT 
        u.nome AS nomeAluno,
        ad.nome_pai AS nomePai,
        ad.nome_mae AS nomeMae,
        ad.numero_bi AS numeroBI,
        ad.numero_processo AS numProc,
        DATE_FORMAT(ad.data_nasc, '%d/%m/%Y') AS dataNasc,
        ad.local_nascimento AS localNasc,
        ad.local_emissao_bi AS localEmissaoBI,
        DATE_FORMAT(ad.data_emissao_bi, '%d/%m/%Y') AS dataEmissaoBI,
        c.nome AS nomeCurso,
        a.nome AS areaForm,
        t.turno AS periodo,
        t.classe AS classe
      FROM aluno_detalhes ad
      INNER JOIN usuarios u ON u.id = ad.aluno_id
      INNER JOIN cursos c ON c.id = ad.curso_id
      INNER JOIN areas_formacao a ON a.id = c.areas_id
      INNER JOIN turma_alunos ta ON ta.aluno_id = ad.aluno_id
      INNER JOIN turmas t ON t.id = ta.turma_id
      WHERE ad.aluno_id = ${alunoId}
    `;

    if (!certificadoData || certificadoData.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Detalhes do aluno não encontrados' },
      });
    }

    const dataDocumento = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    certificadoData[0].dataDocumento = dataDocumento;

    const nomeAluno = certificadoData[0].nomeAluno;

    const usuarioData: { id: number }[] = await prisma.$queryRaw`
      SELECT u.id FROM usuarios u WHERE u.id = ${alunoId}
    `;
    if (!usuarioData || usuarioData.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Usuário não encontrado' },
      });
    }
    const usuarioId = usuarioData[0].id;

    const logoPath = 'src/server/public/assets/logo.png';
    const pdfBuffer = await gerarPDF({ ...certificadoData[0], dataDocumento: certificadoData[0].dataDocumento || '' }, logoPath);

    const documentsFolder = path.join(process.cwd(), 'src', 'server', 'public', 'documents', 'Certificados');
    if (!fs.existsSync(documentsFolder)) {
      fs.mkdirSync(documentsFolder, { recursive: true });
    }

    const fileName = `${nomeAluno.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(documentsFolder, fileName);

    fs.writeFileSync(filePath, pdfBuffer);

    await prisma.documentos_submetidos.create({
      data: {
        url_documento: filePath,
        nome_documento: fileName,
        tipo_documento: 'Certificado' as any,
        usuario_id: usuarioId,
      }
    });

    return res.status(StatusCodes.OK).json({
      mensagem: 'Boletim de Notas gerado e salvo com sucesso!',
      documento: { caminho: filePath, nome: fileName },
    });
  } catch (error: any) {
    console.error('Erro ao salvar o documento', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: error.message },
    });
  }
};
