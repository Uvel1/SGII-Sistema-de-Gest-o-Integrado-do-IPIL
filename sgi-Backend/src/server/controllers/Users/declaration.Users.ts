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

export const IdPed = validation((getSchema) => ({
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
  
    const formatNota = (nota: number | undefined) => {
      if (nota == null) return '-';
      return nota < 10 ? `<span style="color:red;">${nota}</span>` : `${nota}`;
    };
  
    const disciplinas = [
      { nome: 'PORTUGUÊS', t1: 13, t2: 12, t3: 14, exame: 12, final: 13 },
      { nome: 'INGLÊS', t1: 10, t2: 10, t3: 11, exame: 13, final: 11 },
      { nome: 'QUÍMICA', t1: 12, t2: 13, t3: 14, exame: 12, final: 13 },
      { nome: 'FORMAÇÃO DE ATITUDES INTEGRADORAS', t1: 13, t2: 14, t3: 12, exame: 11, final: 12 },
      { nome: 'MATEMÁTICA', t1: 9, t2: 12, t3: 13, exame: 10, final: 12 },
      { nome: 'EDUCAÇÃO FÍSICA', t1: 7, t3: 12, exame: 10, final: 12 },
      { nome: 'EMPREENDEDORISMO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'ORGANIZAÇÃO E GESTÃO EMPRESARIAL', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'TECNOLOGIA DE INFOR. E COMUNICAÇÃO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'DESENHO TÉCNICO', t1: 13, t2: 14, t3: 2, exame: 10, final: 12 },
      { nome: 'TÉCNICAS E LINGUAGENS DE PROGRAMAÇÃO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'SISTEMAS DE EXPLOR ARQUIT.DE COMPUTADORES', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'FÍSICA', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'REDES DE COMPUTADORES', t1: 13, t2: 1, t3: 12, exame: 10, final: 12 },
      { nome: 'INGLÊS TÉCNICO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
      { nome: 'PROJECTO TECNOLÓGICO', t1: 13, t2: 14, t3: 12, exame: 10, final: 12 },
    ];
    
    const linhasDisciplinas = disciplinas.map((disc) => {
      return `
        <tr>
          <td>${disc.nome}</td>
          <td>${formatNota(disc.t1)}</td>
          <td>${formatNota(disc.t2)}</td>
          <td>${formatNota(disc.t3)}</td>
          <td>${formatNota(disc.exame)}</td>
          <td>${formatNota(disc.final)}</td>
          <td>${disc.t4 != null ? formatNota(disc.t4) : formatNota(disc.final)}</td>
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
          font-family: Helvetica, sans-serif;
          font-size: 12px;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .title { font-size: 16px; font-weight: bold; }
        .underline { text-decoration: underline; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        table, th, td { border: 1px solid black; }
        thead th { font-weight: bold; text-align: center; }
        tbody td { font-weight: bold; text-align: center; }
        tbody td:first-child { text-align: left; }
      </style>
    </head>
    <body>
      <div class="center">
        ${logoBase64 ? `<img src="data:image/jpeg;base64,${logoBase64}" width="70" height="70" />` : ''}
      </div>
      <div class="center bold">REPÚBLICA DE ANGOLA</div>
      <div class="center bold">MINISTÉRIO DA EDUCAÇÃO</div>
      <div class="center">----------||----------</div>
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
  
  export const EnviarDeclaração = async (req: Request, res: Response) => {
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
  
      const declaracaoData = await prisma.$queryRaw`
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
  
      if (!declaracaoData || declaracaoData.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: { default: 'Detalhes do aluno não encontrados' },
        });
      }
  
      const dataDocumento = new Date().toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      declaracaoData[0].dataDocumento = dataDocumento;
  
      const nomeAluno = declaracaoData[0].nomeAluno;
  
      const usuarioData = await prisma.$queryRaw`
        SELECT u.id FROM usuarios u WHERE u.id = ${alunoId}
      `;
      if (!usuarioData || usuarioData.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: { default: 'Usuário não encontrado' },
        });
      }
      const usuarioId = usuarioData[0].id;
  
      const logoPath = 'src/server/public/assets/República.jpg';
      const pdfBuffer = await gerarPDF(declaracaoData[0], logoPath);
  
      const documentsFolder = path.join(process.cwd(), 'src', 'server', 'public', 'documents', 'Declarações');
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
          tipo_documento: 'Declaração' as any,
          usuario_id: usuarioId,
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
  