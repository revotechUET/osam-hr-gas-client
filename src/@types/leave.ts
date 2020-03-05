export interface Leave {
  id: string,
  startTime: string,
  endTime: string,
  reason: LeaveReason,
  description?: string,
  status: LeaveStatus,
  idRequester: string,
  idApprover?: string,
}

export enum LeaveReason {
  Personal = 0,
  Duty = 1,
  Business = 2,
}

export enum LeaveStatus {
  Waiting = 'waiting',
  Approved = 'approved',
  Rejected = 'rejected',
  Deleted = 'deleted',
}
