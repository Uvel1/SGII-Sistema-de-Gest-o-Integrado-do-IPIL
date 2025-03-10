import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware/index.middleware';
import { prisma } from '../../config/prisma.config';
import { IUsuario, IAluno_detalhes } from '../../database/models/index.models';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

interface IBodyProps extends 
  Omit<IUsuario, 'id' | 'tipo_de_usuario' | 'senha' | 'create_at' | 'update_at' | 'foto_perfil'>,
  Omit<IAluno_detalhes, 'id' | 'numero_processo' | 'numero_bi' | 'sexo' | 'data_nasc' | 'created_at' | 'updated_at' | 'curso_id' | 'aluno_id'> {
  nomeAluno?: string;
  nomePai?: string;
  nomeMae?: string;
  numeroBI?: string;
  areaForm?: string;      // ex: "Informática"
  numProc?: string;       // ex: "1234/2024"
  dataNasc?: string;      // ex: "22/02/2004"
  localNasc?: string;     // ex: "Luanda"
  classe?: string;        // ex: "12ª"
  nomeCurso?: string;     // ex: "Informática"
  periodo?: string;       // ex: "Tarde"
  dataDocumento?: string; // ex: "25 de Outubro de 2024"
}

export const CertifValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
      email: yup.string().required().email().min(5),
      // Outras validações se necessário
    })
  ),
}));

async function gerarPDF(
  declaracaoData: {
    nomeAluno?: string;
    nomePai?: string;
    nomeMae?: string;
    numeroBI?: string;
    areaForm?: string;
    dataNasc?: string;
    localNasc?: string;
    classe?: string;
    numProc?: string;
    nomeCurso?: string;
    periodo?: string;
    dataDocumento?: string;
  },
  logoPath: string
): Promise<Buffer> {
  // Lê a imagem do logo e converte para base64
  let logoBase64 = "";
  try {
    const imageBuffer = fs.readFileSync(logoPath);
    logoBase64 = imageBuffer.toString('base64');
  } catch (err) {
    console.error("Erro ao carregar a imagem", err);
  }

  // Exemplo de disciplinas e notas (baseado na imagem de exemplo).
  // Ajuste os valores conforme a necessidade.
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

  // Monta as linhas da tabela em HTML
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

  // Cria o template HTML simulando o boletim da imagem
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
      .center {
        text-align: center;
      }
      .bold {
        font-weight: bold;
      }
      .title {
        font-size: 16px;
        font-weight: bold;
      }
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
      .header-section {
        margin-bottom: 5px;
      }
      .sub-header {
        font-size: 14px;
        margin-top: 2px;
      }
      .info-section {
        margin: 10px 0;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <!-- Logo (opcional) -->
    <div class="center">
      ${
        logoBase64
          ? `<img src="data:image/jpeg;base64,${logoBase64}" width="70" height="70" />`
          : ""
      }
    </div>

    <!-- Cabeçalho principal -->
    <div class="center bold title">INSTITUTO POLITÉCNICO INDUSTRIAL DE LUANDA</div>
    <div class="center bold title">SUBDIRECÇÃO PEDAGÓGICA</div>
    <div class="center bold title">CURSO: TÉCNICO DE GESTÃO DE SISTEMAS INFORMÁTICOS</div>
    <div class="center bold bold title">BOLETIM DE NOTAS DO ALUNO - ANO LECTIVO 2023/2024</div>

    <!-- Informações do Aluno -->
    <div class="info-section">
      NOME: ${
        declaracaoData.nomeAluno || "NOME_DO_ALUNO"
      }<br/>
      Turma: IG12A; Nº: 47 - 68458
    </div>

    <div class="center bold">I TRIMESTRE</div>

    <!-- Tabela de Notas -->
    <table>
      <thead>
        <tr>
          <th>Disciplinas Curriculares</th>
          <th>Faltas</th>
          <th>J</th>
          <th>I</th>
          <th>P1</th>
          <th>P2</th>
          <th>PT</th>
          <th>MÉD</th>
        </tr>
      </thead>
      <tbody>
        ${linhasDisciplinas}
      </tbody>
    </table>
  </body>
</html>
  `;

  // Gera o PDF com o Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    printBackground: true,
  });
  await browser.close();
  return pdfBuffer;
}

export const EnviarCertificado = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  try {
    const {
      email,
      nomeAluno = 'NOME_DO_ALUNO',
      nomePai = 'NOME_DO_PAI',
      nomeMae = 'NOME_DA_MAE',
      numeroBI = 'NUMERO_DO_BI',
      dataNasc = 'DD/MM/AAAA',
      localNasc = 'LOCAL_DE_NASCIMENTO',
      classe = '12ª',
      nomeCurso = 'INFORMÁTICA',
      periodo = 'TARDE',
      dataDocumento = 'DD de Mês de AAAA',
    } = req.body;

    // Verifica se o usuário existe (opcional, se for necessário)
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
    });
    if (!usuario) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Email não encontrado' },
      });
    }

    const declaracaoData = {
      nomeAluno,
      nomePai,
      nomeMae,
      numeroBI,
      dataNasc,
      localNasc,
      classe,
      nomeCurso,
      periodo,
      dataDocumento,
    };

    // Caminho para o logo (caso queira exibir no boletim)
    const logoPath = 'src/server/public/assets/logo.png';
    const pdfBuffer = await gerarPDF(declaracaoData, logoPath);

    // Define o diretório onde o documento será salvo
    const documentsFolder = path.join(__dirname, '../../public/documents/Certificados');
    if (!fs.existsSync(documentsFolder)) {
      fs.mkdirSync(documentsFolder, { recursive: true });
    }
    // Cria um nome de arquivo único que inclua o nome do aluno para identificação
    const fileName = `${nomeAluno.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(documentsFolder, fileName);

    // Salva o arquivo PDF no backend
    fs.writeFileSync(filePath, pdfBuffer);

    // Insere os dados na tabela documentos_submetidos
    await prisma.documentos_submetidos.create({
      data: {
        url_documento: filePath,
        nome_documento: fileName,
        tipo_documento: 'Certificado', // Ajuste se tiver outro enum
        usuario_id: usuario.id,
      },
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
