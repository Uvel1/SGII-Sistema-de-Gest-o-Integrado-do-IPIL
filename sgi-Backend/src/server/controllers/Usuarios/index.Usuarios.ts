import * as signIn from './SignIn.Usuarios';
import * as signUp from './SignUp.Usuarios';
import * as refreshToken from './refreshToken.Usuarios';
import * as signUpStudent from './SignUpStudent.Usuarios';
import * as updateProfilePic from './updateProfilePic.Usuarios';
import * as getUserPhotos from './getUserPhotos.Usuarios';

export const UsuariosController = {
  ...signIn,
  ...signUp,
  ...refreshToken,
  ...signUpStudent,
  ...updateProfilePic,
    ...getUserPhotos,

};