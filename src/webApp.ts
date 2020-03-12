import { UserRole } from "./@types/contract";
import { db } from "./db";
import { userInfo } from "./routes/user";

function noPermission() {
  return ContentService.createTextOutput('Tài khoản không có quyền truy cập');
}

function initAdmin({ id, email, name }) {
  const contract = db.from('contract').getDataJSON()[0];
  const newUser = {
    id,
    email,
    active: true,
    name,
    role: UserRole.Admin,
    idContract: contract.id,
  }
  db.from('user').insert(newUser);
  return newUser;
}

function doGet() {
  userInfo();
  return HtmlService.createHtmlOutputFromFile("dist/index.html")
    .setTitle('HR Admin')
    .setFaviconUrl('https://static.wixstatic.com/media/22ad9e_22cd33c6ec194e1297270a96384a88f3~mv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/22ad9e_22cd33c6ec194e1297270a96384a88f3~mv2.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}
global.doGet = doGet;
