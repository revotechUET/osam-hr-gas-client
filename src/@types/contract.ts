export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user'
}

export enum ContractType {
  fulltime = 'fulltime',
  parttime = 'parttime'
}

export interface Contract {
  id: string,
  name: string,
  type: ContractType,
  lunch: boolean,
  leaveRequest: boolean
}
