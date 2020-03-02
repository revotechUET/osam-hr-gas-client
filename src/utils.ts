import uniqid from 'uniqid';
import { GoogleUser, User } from "./@types/user";
import { db } from "./db";

export function googleUser(): GoogleUser {
  const userCache = CacheService.getUserCache();
  let userInfo = JSON.parse(userCache.get('INFO'));
  if (!userInfo) {
    const user = People.People.get('people/me', { personFields: 'names' });
    const { metadata, ...names } = user.names.filter(n => n.metadata.primary)[0];
    const id = metadata.source.id;
    const current = Session.getActiveUser();
    const email = current.getEmail();
    userInfo = { id, email, ...names };
    userCache.put('INFO', JSON.stringify(userInfo), 3600);
  }
  return userInfo;
}

export function uuid(prefix?: string, suffix?: string) {
  return uniqid(prefix, suffix);
}
