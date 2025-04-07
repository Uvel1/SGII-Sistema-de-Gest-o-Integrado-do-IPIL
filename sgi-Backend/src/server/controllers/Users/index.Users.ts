import * as signIn from './SignIn.Users';
import * as signUp from './SignUp.Users';
import * as refreshToken from './refreshToken.Users';
import * as signUpStudent from './SignUpStudent.Users';
import * as updateProfilePic from './updateProfilePic.Users';
import * as getUserPhotos from './getUserPhotos.Users';
import * as declaração from './declaration.Users';
import * as certficado from './certificate.Users';
import * as email from './SendEmailUsers';

export const UsersController = {
  ...signIn,
  ...signUp,
  ...refreshToken,
  ...signUpStudent,
  ...updateProfilePic,
  ...getUserPhotos,
  ...declaração,
  ...certficado,
  ...email,

};