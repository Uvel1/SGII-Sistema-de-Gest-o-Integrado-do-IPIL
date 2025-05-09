import path from 'path';
import multer from "multer";
import { Router } from "express";
import { 
    UsersController, 
    GradesController,
    ClassesController, 
    FiledsOfStudyController, 
    StudentsDetailsController,
    TeachersDetailsController, 
    StudentsRequestsController, 
    SubmittedDocumentsController
} from "../controllers/index.controllers";
import {authenticateJWT} from "../shared/middleware/autheticateToken.middleware"

const router = Router();

const storage = multer.diskStorage({destination: (req, file, cb) => {
      
      const uploadPath = path.join(process.cwd(), 'src', 'server', 'public', 'uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage });



//Requests(This controllers doesn't exist, just for requests that has both, students a school requests)
router.get('/chart2',StudentsRequestsController.getChart2);
router.get('/Chart_pedidos',StudentsRequestsController.GetRequests);

//StudentsRequest
router.get('/tabela_pedidos_alunos',StudentsRequestsController.getSolicitacoesAlunos);
router.post('/Criar_pedido',StudentsRequestsController.createValidation,StudentsRequestsController.create);
router.delete('/pedidos/:id', StudentsRequestsController.IdDeleteValidation, StudentsRequestsController.Delete);
router.get('/pedidos_desc/:id',StudentsRequestsController.IdDescriptionValidation,StudentsRequestsController.GetRequestDescription);
router.put('/update_pedido/:id',StudentsRequestsController.UpdateSolicitacaoValidation,StudentsRequestsController.updateSolicitacaoAluno);

//SchoolRequest

//Users
router.get('/tabela_usuarios',UsersController.getUsers);
router.get('/refreshToken',UsersController.refreshToken);
router.get('/user/photo/:id', UsersController.getUserPhoto);
router.post('/enviar_email/:id',UsersController.enviarEmail);
router.post('/Entrar',UsersController.signInValidation,UsersController.signIn);
router.post('/Cadastrar',UsersController.signUpValidation,UsersController.signUp);
router.post('/criar_declaracao/:id',UsersController.IdPed,UsersController.EnviarDeclaração);
router.post('/upload-profile', upload.single('foto-perfil'), UsersController.updateProfilePicRoute);
router.post('/Cadastrar_aluno',UsersController.signUpStudentValidation,UsersController.signUpStudent);
router.post('/criar_certificado/:id',UsersController.idCertifValidation,UsersController.EnviarCertificado);

//Classes
router.get('/tabela_turmas_dashboard',ClassesController.AllClassesForTeacher);
router.get('/tabela_turmas/:id', ClassesController.TeacherIdValidation, ClassesController.GetData);
router.delete('/turmas/:id',ClassesController.IdDeleteClasseValidation,ClassesController.DeleteClasse);
router.get('/tabela_Prof/:id',ClassesController.IdTeacherValidation,ClassesController.ClassesForTeacher);

//Grades
router.post('/chartNotas',GradesController.Chart); //<--note: analise this request
router.get('/tabela_notas/:id',GradesController.IdStudentValidation, GradesController.StudentGrades);

//TeachersDetails
router.get('/tabela_professores',TeachersDetailsController.getTabelaProfessores);
router.get('/print/:professorId/:turmaId',TeachersDetailsController.imprimirRelatorioTurma);
router.get('/professores/:id/relatorio',TeachersDetailsController.gerarRelatorioPorProfessor);
router.get('/professores/:id/stats/aprovacao',TeachersDetailsController.getApprovalStats);
router.get("/professores/:id/stats/faltas",TeachersDetailsController.getFaltasStats);
router.delete('/professore/:id',TeachersDetailsController.IdDeleteValidation,TeachersDetailsController.Delete);

//StudentsDetails
router.get('/tabela_alunos',StudentsDetailsController.getTabelaAlunos);
router.post('/Entrar_alunos',StudentsDetailsController.signInValidation,StudentsDetailsController.signIn);
router.delete('/alunos/:id',StudentsDetailsController.IdDeleteValidation,StudentsDetailsController.Delete);
router.post('/declaracao',StudentsDetailsController.declaraçãoValidation,StudentsDetailsController.declaração);
router.post('/verificar',StudentsDetailsController.VerificationValidation,StudentsDetailsController.Verification);
router.post('/certificado',StudentsDetailsController.RequestCertificateValidation,StudentsDetailsController.RequestCertificate);

//FieldsOfStudy
router.get('/chartArea',FiledsOfStudyController.ChartFiels);

//SubmittedDocuments
router.get('/docs',SubmittedDocumentsController.docs);
router.get('/chartDocSub',SubmittedDocumentsController.documentsByType);
router.get('/print/:id',SubmittedDocumentsController.IdPrintValidationDoc,SubmittedDocumentsController.PrintDoc);
router.delete("/documentos/:id", SubmittedDocumentsController.IdDeleteValidationDoc, SubmittedDocumentsController.DeleteDoc);
router.post('/pedidos/:id/import',upload.single('file'),SubmittedDocumentsController.importDoc);
router.get('/documents/download/:id',SubmittedDocumentsController.IdPrintValidationDoc,SubmittedDocumentsController.DownloadDoc);
  

export {router};