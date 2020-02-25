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

export function userInfo(): User {
  const email = Session.getActiveUser().getEmail();
  return db.from<User>('user').query.where('email', email).toJSON(1)[0];
}

export function dateString(date: Date = new Date()) {
  if (!date) return null
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  return Utilities.formatDate(date, "GMT", "yyyy-MM-dd'T'00:00:00'Z'");
}

export function uuid(prefix?: string, suffix?: string) {
  return uniqid(prefix, suffix);
}
