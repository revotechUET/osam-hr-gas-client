import { GoogleUser, User, UserRole } from "../@types/user";
import { db } from "../db";
import { googleUser, userInfo, isValid } from "../utils";

global.googleUser = googleUser;
global.userInfo = userInfo;

global.verifyUser = verifyUser;
function verifyUser() {
  const gUser: GoogleUser = googleUser();
  const [user] = db.from<User>('user').query.select().where('id', gUser.id).getResultsJson();
  // if (!isValid(user)) {
  //   const newUser: User = {
  //     id: gUser.id,
  //     email: gUser.email,
  //     active: 1,
  //     name: gUser.displayName,
  //     role: UserRole.User,
  //   }
  //   db.from('user').insert(newUser);
  //   return newUser;
  // }
  if (!isValid(user) || !user.active) {
    throw 'User is not activated';
  }
  return user;
}
