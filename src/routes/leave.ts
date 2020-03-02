import { googleUser, uuid } from "../utils";
import { db } from "../db";
import { Leave, LeaveStatus } from "../@types/leave";
import { getMonthInterval } from "./payroll";

global.leaveAdd = leaveAdd;
function leaveAdd(params) {
  const { startTime, endTime, reason, description } = params || {};
  const user = googleUser();
  const leavesQuery = db.from<Leave>('leave').query;
  const [statusCol, startTimeCol, endTimeCol] = ['status', 'startTime', 'endTime'].map(leavesQuery.getColId.bind(leavesQuery));
  leavesQuery.raw(
    `SELECT * WHERE ${statusCol} ='${user.id}' AND
     ((${startTimeCol} >='${startTime}' AND ${startTimeCol} <='${endTime}') OR (${endTimeCol} >= '${startTime}' AND ${endTimeCol} <='${endTime}'))`
  )
  const leaves = leavesQuery.toJSON();
  if (leaves.length) throw 'Đã có yêu cầu nghỉ trong thời gian này';
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
function leaveGet({ id }) {
  const user = googleUser();
  const [leave] = db.from<Leave>('leave').query.where('id', id).where('idRequester', user.id).toJSON();
  if (leave) {
    return { ...leave, requester: user };
  }
  throw 'Not found';
}

global.leaveList = leaveList;
function leaveList({ id, startTime, endTime, status }) {
  const user = googleUser();
  if (!startTime && !endTime) {
    const { start, end } = getMonthInterval(new Date());
    startTime = start;
    endTime = end;
  }
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
  const leaves = leavesQuery.toJSON();
  return leaves;
}
