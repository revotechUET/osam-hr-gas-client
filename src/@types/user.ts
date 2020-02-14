export interface GoogleUser {
  id: string,
  email: string,
  displayName: string,
  familyName: string,
  displayNameLastFirst: string,
  givenName: string,
}

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

export interface User {
  id: string,
  email: string,
  role: UserRole,
  name: string,
  active: number,
  idContract?: string,
}
