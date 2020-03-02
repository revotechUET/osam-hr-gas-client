import { Contract } from "../@types/contract";
import { Department } from "../@types/department";
import { User } from "../@types/user";
import { User_Department } from "../@types/user_department";
import { db } from "../db";
import { googleUser } from "../utils";

global.googleUser = googleUser;

global.userInfo = userInfo;
export function userInfo({ full = false, loadDepartments = false, loadContracts = false } = {}) {
  const email = Session.getActiveUser().getEmail();
  const user = db.from<User>('user').query.where('email', email).toJSON(1)[0];
  // if (!user) {
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
  if (!user || !user.active) {
    throw 'User is not activated';
  }
  if (full || loadContracts) {
    user.contract = db.from<Contract>('contract').query.where('id', user.idContract).toJSON(1)[0];
  }
  if (full || loadDepartments) {
    const userDepartments = db.from<User_Department>('user_department').query.where('idUser', user.id).toJSON();
    const departments = db.from<Department>('department').getDataJSON();
    user.departments = departments.filter(d => userDepartments.find(ud => ud.idDepartment === d.id));
  }
  return user;
}
