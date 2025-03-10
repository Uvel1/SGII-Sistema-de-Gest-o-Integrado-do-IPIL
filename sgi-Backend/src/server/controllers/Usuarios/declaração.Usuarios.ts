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

export const declarValidation = validation((getSchema) => ({
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

  // Exemplo de disciplinas e notas por trimestre, exame e final.
  const disciplinas = [
    { nome: 'PORTUGUÊS', t1: 13, t2: 12, t3: 14, exame: 12, final: 13 },
    { nome: 'INGLÊS', t1: 10, t2: 10, t3: 11, exame: 13, final: 11 },
    { nome: 'QUÍMICA', t1: 12, t2: 13, t3: 14, exame: 12, final: 13 },
    { nome: 'FORMAÇÃO DE ATITUDES INTEGRADORAS', t1: 13, t2: 14, t3: 12, exame: 11, final: 12 },
    { nome: 'MATEMÁTICA', t1: 12, t2: 12, t3: 13, exame: 10, final: 12 },
    { nome: 'EDUCAÇÃO FÍSICA', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'EMPREENDEDORISMO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'ORGANIZAÇÃO E GESTÃO EMPRESARIAL', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'TECNOLOGIA DE INFOR. E COMUNICAÇÃO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'DESENHO TÉCNICO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'TÉCNICAS E LINGUAGENS DE PROGRAMAÇÃO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'SISTEMAS DE EXPLOR ARQUIT.DE COMPUTADORES', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'FÍSICA', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'REDES DE COMPUTADORES', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'INGLÊS TÉCNICO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    { nome: 'PROJECTO TECNOLÓGICO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
  ];
  
  // Monta as linhas da tabela em HTML
  const linhasDisciplinas = disciplinas.map((disc) => {
    return `
      <tr>
      <td>${disc.nome}</td>
      <td>${disc.t1}</td>
      <td>${disc.t2}</td>
      <td>${disc.t3}</td>
      <td>${disc.exame}</td>
      <td>${disc.final}</td>
      <td>${disc.t4 || disc.final}</td>
    </tr>
    `;
  }).join('');
  
  // Cria o template HTML com estilos para o PDF
  const html = `
    <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 20px 40px 0 40px;
        font-family: Helvetica, sans-serif;
        font-size: 12px;
      }
      .center { text-align: center; }
      .left { text-align: left; }
      .right { text-align: right; }
      .justify { text-align: justify; }
      .bold { font-weight: bold; }
      .title { font-size: 16px; font-weight: bold; }
      .subtitle { font-size: 12px; font-weight: bold; }
      hr { width: 50%; border: 0.5px solid #000; }
      .logo { margin-bottom: 10px; }
      .header-text { margin: 2px 0; }
      /* Tabela de notas */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      table, th, td { border: 1px solid black; }
      thead th { font-weight: bold; text-align: center; }
      tbody td { font-weight: bold; text-align: center; }
      tbody td:first-child { text-align: left; }
      thead th:last-child, tbody td:last-child {
        width: 80px;
        text-align: center;
      }
      .table-title { margin-top: 10px; font-weight: bold; }
      .signatures { margin-top: 40px; }
      .signature-line { margin-top: 10px; }
      .observacoes { margin-top: 10px; font-size: 10px; }
      .underline { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="center logo">
      ${logoBase64 ? `<img src="data:image/jpeg;base64,${logoBase64}" width="70" height="70" />` : ''}
    </div>
    <div class="center bold header-text">REPÚBLICA DE ANGOLA</div>
    <div class="center bold header-text">MINISTÉRIO DA EDUCAÇÃO</div>
    <div class="center header-text">----------||----------</div>
    <div class="center bold title">INSTITUTO POLITÉCNICO INDUSTRIAL DE LUANDA</div>
    <div class="center" style="font-size:16px;">
      (RUA EUGÉNIO DE CASTRO / LARGO DO SOWETO - CP:2513 - LUANDA/ANGOLA)
    </div>
    <br/>
    <div style="text-align: left;">
      <div style="display: flex; flex-direction: column; align-items: center; width: fit-content;">
        <div style="font-size:14px; font-weight:bold;">O DIRECTOR DO INSTITUTO</div>
        <div style="font-size:12px;">__________________________________</div>
        <div style="font-size:12px; font-weight:bold;">MILTON ANTÓNIO LOPES DA SILVA</div>
      </div>
    </div>
    <br/>
    <div class="center title">DECLARAÇÃO DE FREQUÊNCIA COM NOTAS</div>
    <br/>
    <div class="justify" style="line-height: 1.5; margin-top: 5px; font-size:14px;">
      Para efeitos: <strong class="underline">Comprovativo</strong>, declara-se que,
      <strong class="underline">${declaracaoData.nomeAluno || 'NOME_DO_ALUNO'}</strong>, filho de
      <strong class="underline">${declaracaoData.nomePai || 'NOME_DO_PAI'}</strong> e de
      <strong class="underline">${declaracaoData.nomeMae || 'NOME_DA_MAE'}</strong> em 
      <strong class="underline">${declaracaoData.localNasc || 'LOCAL_DE_NASCIMENTO'}</strong> nascido aos 
      <strong class="underline">${declaracaoData.dataNasc || 'DD/MM/AAAA'}</strong> portador do Bilhete de identidade nº
      <strong class="underline">${declaracaoData.numeroBI || 'NUMERO_DO_BI'}</strong>, passado pelo
      Arquivo de Identificação Civil de <strong class="underline">Luanda</strong>, aos
      <strong class="underline">09/12/2019</strong>, sob o nº de processo
      <strong class="underline">${declaracaoData.numProc || 'NUMERO_DE_PROCESSO'}</strong> frequenta no ano lectivo á
      <strong class="underline">${declaracaoData.classe || '13ª'}</strong> classe; do _ curso de
      <strong class="underline">${declaracaoData.nomeCurso || 'Técnico de Gestão dos sistemas Informáticos'}</strong> da Área de Formação de
      <strong class="underline">${declaracaoData.areaForm || 'INFORMÁTICA'}</strong> da Formação Média Técnica, em regime
      <strong class="underline">${declaracaoData.periodo || 'TARDE'}</strong>, na turma
      <strong class="underline">IG13A</strong> com o nº <strong class="underline">22</strong>.
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
      Luanda, aos ${declaracaoData.dataDocumento || 'DD de Mês de AAAA'}.-
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

export const EnviarDeclaração = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
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

    const logoPath = 'src/server/public/assets/República.jpg';
    const pdfBuffer = await gerarPDF(declaracaoData, logoPath);

    // Define o diretório onde o documento será salvo
    const documentsFolder = path.join(__dirname, '../../public/documents/Declarações');
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
        tipo_documento: 'Declaração', // valor do enum documentos_submetidos_tipo_documento
        usuario_id: usuario.id,
      }
    });

    return res.status(StatusCodes.OK).json({
      mensagem: 'Declaração gerada e salva com sucesso!',
      documento: { caminho: filePath, nome: fileName }
    });
  } catch (error: any) {
    console.error('Erro ao salvar o documento', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: error.message },
    });
  }
};
