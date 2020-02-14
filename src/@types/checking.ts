export enum ReportStatus {
  None = 'none',
  Reported = 'reported',
  Done = 'done',
}

export interface Checking {
  id: string,
  idUser: string,
  date: string,
  checkinTime: string,
  checkoutTime?: string,
  reportContent?: string,
  responseContent?: string,
  reportStatus?: ReportStatus,
}

export enum CheckingStatus {
  None = 0,
  CheckedIn = 1,
  CheckedOut = 2,
}
