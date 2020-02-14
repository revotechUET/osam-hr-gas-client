import { googleUser, uuid, isValid } from "../utils";
import { db } from "../db";
import { Leave, LeaveStatus } from "../@types/leave";

global.leaveAdd = leaveAdd;
function leaveAdd({ startTime, endTime, reason, description }) {
  const user = googleUser();
  const leave: Leave = {
    id: uuid('lr-'),
    idRequester: user.id,
    startTime,
    endTime,
    reason,
    description,
    status: LeaveStatus.Waiting,
  }
  db.from<Leave>('leave').insert(leave);
  return leave;
}

global.leaveGet = leaveGet;
function leaveGet({id}) {
  const user = googleUser();
  const [leave] = db.from<Leave>('leave').query.where('id', id).where('idRequester', user.id).getResultsJson();
  if (isValid(leave)) {
    return { ...leave, requester: user };
  }
  throw 'Not found';
}

global.leaveList = leaveList;
function leaveList({ id, startTime, endTime, status }) {
  const user = googleUser();
  const leavesQuery = db.from<Leave>('leave').query.where('idRequester', user.id);
  if (id) {
    leavesQuery.where('id', id);
  }
  if (startTime) {
    leavesQuery.where('startTime', '>=', startTime);
  }
  if (endTime) {
    leavesQuery.where('endTime', '<=', endTime);
  }
  if (status) {
    leavesQuery.where('status', status);
  }
  const leaves = leavesQuery.getResultsJson().filter(i => isValid(i));
  return leaves;
}
