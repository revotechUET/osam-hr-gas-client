import { User } from "../@types/user";
import { db } from "../db";

function testUserInfo() {
  const user = People.People.get('people/me', { personFields: 'names,emailAddresses' });
  return user;
}
global.testUserInfo = testUserInfo;

function test() {
  return db.from<User>('user').getDataJSON();
}
global.test = test;
