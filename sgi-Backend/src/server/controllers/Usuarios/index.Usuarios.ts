import * as signIn from './SignIn.Usuarios';
import * as signUp from './SignUp.Usuarios';
import * as refreshToken from './refreshToken.Usuarios';
import * as signUpStudent from './SignUpStudent.Usuarios';
import * as updateProfilePic from './updateProfilePic.Usuarios';
import * as getUserPhotos from './getUserPhotos.Usuarios';
import * as declaração from './declaração.Usuarios';
import * as certficado from './certificado.Pedidos';

export const UsuariosController = {
  ...signIn,
  ...signUp,
  ...refreshToken,
  ...signUpStudent,
  ...updateProfilePic,
  ...getUserPhotos,
  ...declaração,
  ...certficado,

};