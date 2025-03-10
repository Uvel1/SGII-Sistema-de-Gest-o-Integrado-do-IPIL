import { Router } from "express";
import multer from "multer";
import path from 'path';
import { AlunosController, NotasController, PedidosController, ProfessoresController, TurmasController, UsuariosController, AreasDeFormaçãoController, DocumentosSubmetidosController } from "../controllers/index.controllers";
import {authenticateJWT} from "../shared/middleware/autheticateToken.middleware"

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Supondo que __dirname seja o diretório atual deste arquivo,
      // ajuste conforme a estrutura do seu projeto.
      const uploadPath = path.join(process.cwd(), 'src', 'server', 'public', 'uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage });

router.post('/upload-profile', upload.single('foto-perfil'), UsuariosController.updateProfilePicRoute);

router.get('/user/photo/:id', UsuariosController.getUserPhoto);


router.get('/',(req,res)=>{
  res.send('Olá,mundo!!');
})

// Pedidos
router.post('/Criar_pedido',PedidosController.createValidation,PedidosController.create);
router.get('/Chart_pedidos',PedidosController.getSolicitacoes);
router.get('/tabela_pedidos_alunos',PedidosController.getSolicitacoesAlunos);
router.delete('/pedidos/:id', PedidosController.IdDeleteValidation, PedidosController.Delete);
router.get('/docs',PedidosController.docs);
router.delete("/documentos/:id", PedidosController.IdDeleteValidationDoc, PedidosController.DeleteDoc);
router.get('/chart2',PedidosController.getChart2);
router.get('/print/:id',PedidosController.IdPrintValidationDoc,PedidosController.PrintDoc);


//Usuarios
router.post('/Cadastrar',UsuariosController.signUpValidation,UsuariosController.signUp);
router.post('/Entrar',UsuariosController.signInValidation,UsuariosController.signIn);
router.get('/refreshToken',UsuariosController.refreshToken);
router.post('/Cadastrar_aluno',UsuariosController.signUpStudentValidation,UsuariosController.signUpStudent);
router.get('/certif',UsuariosController.CertifValidation,UsuariosController.EnviarCertificado);
router.get('/declaração',UsuariosController.declarValidation,UsuariosController.EnviarDeclaração);

//turmas
router.get('/tabela_turmas/:id',TurmasController.IdProfInValidation,TurmasController.getNotasAlunos);
router.get('/tabela_turmas_dashboard',TurmasController.AllProfTurmas);
router.get('/tabela_Prof/:id',TurmasController.IdProfInValidation,TurmasController.ProfTurmas);
router.delete('/turmas/:id', TurmasController.IdDeleteValidation, TurmasController.Delete);


//Notas
router.post('/chartNotas',NotasController.chart);
router.get('/tabela_notas/:id', NotasController.IdAlunoInValidation, NotasController.AlunoNotas);

//professores
router.get('/tabela_professores',ProfessoresController.getTabelaProfessores);
router.delete('/professore/:id', ProfessoresController.IdDeleteValidation, ProfessoresController.Delete);

//alunos
router.post('/Entrar_alunos',AlunosController.signInValidation,AlunosController.signIn);
router.get('/tabela_alunos',AlunosController.getTabelaAlunos);
router.post('/verificar',AlunosController.VerificationValidation,AlunosController.Verification);
router.post('/certificado',AlunosController.PedidoCertificadoValidation,AlunosController.PedidoCertificado);
router.post('/declaracao', AlunosController.declaraçãoValidation, AlunosController.PedidoCertificado);
router.delete('/alunos/:id', AlunosController.IdDeleteValidation, AlunosController.Delete);

//áreas de formação
router.get('/chartArea',AreasDeFormaçãoController.chartArea);

//documentos submetidos
router.get('/chartDocSub',DocumentosSubmetidosController.documentsByType);


export {router};