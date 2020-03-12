import { endOfDay, format, startOfDay } from "date-fns";
import { Department } from "../@types/department";
import { Leave, LeaveReason, LeaveStatus } from "../@types/leave";
import { User, UserRole } from "../@types/user";
import { User_Department } from "../@types/user_department";
import { db } from "../db";
import { googleUser, sendMail, uuid } from "../utils";
import { updateEvent } from "./calendar";
import { getMonthInterval } from "./payroll";
import { userInfo } from "./user";

global.leaveAdd = leaveAdd;
function leaveAdd(params) {
  const { startTime, endTime, reason, description, notifyList } = params || {};
  const user = googleUser();
  const leavesQuery = db.from<Leave>('leave').query;
  const [idRequesterCol, statusCol, startTimeCol, endTimeCol] = ['idRequester', 'status', 'startTime', 'endTime'].map(leavesQuery.getColId.bind(leavesQuery));
  leavesQuery.raw(
    `SELECT * WHERE ${idRequesterCol} ='${user.id}' AND (${statusCol} ='${LeaveStatus.Approved}' OR ${statusCol} ='${LeaveStatus.Waiting}')
      ((${startTimeCol} >='${startTime}' AND ${startTimeCol} <='${endTime}') OR (${endTimeCol} >= '${startTime}' AND ${endTimeCol} <='${endTime}'))`
  )
  const leaves = leavesQuery.toJSON();
  if (leaves.length) throw 'Đã có yêu cầu nghỉ trong thời gian này';

  const requester = db.from<User>('user').query.where('id', user.id).toJSON(1)[0];
  const leave: Leave = {
    id: uuid('lr-'),
    idRequester: user.id,
    startTime,
    endTime,
    reason,
    description,
    status: LeaveStatus.Waiting,
  }
  const ok = db.from<Leave>('leave').insert(leave);
  if (!ok) return ok;

  // Send notificaton via mail
  if (notifyList.length) {
    sendMail('new', notifyList, {
      requester: requester.name,
      startTime: format(new Date(startTime), 'HH:mm dd/MM/yyyy'),
      endTime: format(new Date(endTime), 'HH:mm dd/MM/yyyy'),
      reason: LeaveReason[reason],
      description: description
    });
  }

  return leave;
}

global.leaveGet = leaveGet;
function leaveGet({ id }) {
  const user = userInfo();
  let leave = db.from<Leave>('leave').query.where('id', id).where('idRequester', user.id).toJSON()[0];
  if (leave) {
    return { ...leave, requester: user };
  } else {
    // leave to approve
    leave = db.join<Leave, User>('leave', 'user', 'idRequester', 'requester').sWhere('id', id).toJSON()[0];
  }
  if (leave) {
    const requester = db.from<User>('user').query.where('id', leave.idRequester).toJSON()[0];
    return { ...leave, requester };
  }
  throw 'Không tìm thấy yêu cầu nghỉ';
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
    leavesQuery.where('id', id.toLowerCase());
  }
  if (startTime) {
    leavesQuery.where('startTime', '>=', startOfDay(new Date(startTime)));
  }
  if (endTime) {
    leavesQuery.where('endTime', '<=', endOfDay(new Date(endTime)));
  }
  if (status) {
    leavesQuery.where('status', status);
  }
  const leaves = leavesQuery.toJSON();
  return leaves;
}

global.isApprover = isApprover;
function isApprover(id) {
  const gUser = googleUser();
  if (!id) {
    const departments = db.from<Department>('department').getDataJSON();
    if (departments.map(d => d.idApprovers).join(' ').includes(gUser.id)) {
      return true;
    }
    return false;
  }
  const leave = db.from<Leave>('leave').query.where('id', id).toJSON()[0];
  const leaveDepartments = db.from<User_Department>('user_department').query.where('idUser', leave.idRequester).toJSON();
  const departments = db.from<Department>('department').getDataJSON().filter(d => leaveDepartments.find(ud => ud.idDepartment === d.id));
  if (departments.find(d => d.idApprovers.includes(id))) {
    return true;
  }
  return false;
}

global.getLeavesToApprove = getLeavesToApprove;
function getLeavesToApprove({ id, status, startTime, endTime }) {
  const user = userInfo();
  const leavesQuery = db.from<Leave>('leave').query
    .where('reason', LeaveReason.Personal)
    .where('status', '!=', LeaveStatus.Rejected)
    .where('status', '!=', LeaveStatus.Deleted);
  if (id) {
    leavesQuery.where('id', id.toLowerCase());
  }
  if (startTime) {
    leavesQuery.where('startTime', '>=', startOfDay(new Date(startTime)));
  }
  if (endTime) {
    leavesQuery.where('endTime', '<=', endOfDay(new Date(endTime)));
  }
  if (status) {
    leavesQuery.where('status', status);
  }
  const leaves = leavesQuery.toJSON();
  const users = db.from<User>('user').getDataJSON();
  if (user.role === UserRole.Admin || user.role === UserRole.Manager) {
    return leaves.map(l => ({ ...l, requester: users.find(u => u.id === l.idRequester) }));
  }
  const departments = db.from<Department>('department').getDataJSON().map(d => ({ ...d, idApprovers: JSON.parse(d.idApprovers) }));
  const user_department = db.from<User_Department>('user_department').getDataJSON();
  for (let i = 0; i < users.length; i++) {
    const idDepartments = user_department.filter((e) => e.idUser == users[i].id).map((e) => e.idDepartment);
    users[i].departments = departments.filter(d => idDepartments.includes(d.id));
  }
  const departmentsToApprove = departments.filter(d => d.idApprovers.find(id => id === user.id));
  if (!startTime && !endTime) {
    const { start, end } = getMonthInterval(new Date());
    startTime = start;
    endTime = end;
  }
  const leavesToApprove = [];
  for (const leave of leaves) {
    const requester = users.find(u => u.id === leave.idRequester);
    if (!requester) continue;
    if (requester.departments.find(d => departmentsToApprove.find(d1 => d1.id === d.id))) {
      leavesToApprove.push({ ...leave, requester });
    }
  }
  return leavesToApprove;
}

global.leaveApprove = leaveApprove;
function leaveApprove({ id, status, deletedReason }) {
  const user = userInfo();
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Approved, idApprover: user.id, deletedReason });

  const leaveWithUser = db.join<Leave, User>('leave', 'user', 'idRequester', 'user').sWhere('id', id).toJSON()[0];
  let requester = leaveWithUser.user;
  let action = (status === LeaveStatus.Approved) ? "approve" : "reject";

  sendMail(action, [requester.email], {
    approver: user.name,
    startTime: leaveWithUser.startTime,
    endTime: leaveWithUser.endTime,
    reason: LeaveReason[leaveWithUser.reason],
    id: leaveWithUser.id,
    description: leaveWithUser.description
  });

  // Update calendar
  if (leaveWithUser.eventId && leaveWithUser.eventId.length) {
    updateEvent({
      calendarIdx: 0, eventId: leaveWithUser.eventId,
      summary: `[${action}] - ${requester.name} - ${LeaveReason[leaveWithUser.reason]}`,
      description: leaveWithUser.description,
      start: leaveWithUser.startTime,
      end: leaveWithUser.endTime
    });

    return ok;
  }
}

global.leaveDelete = leaveDelete;
function leaveDelete({ id, status, deletedReason }) {
  const user = userInfo();
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Deleted, idApprover: user.id, deletedReason });
  const leaveWithUser = db.join<Leave, User>('leave', 'user', 'idRequester', 'user').sWhere('id', id).toJSON()[0];
  let requester = leaveWithUser.user;
  sendMail('delete', [requester.email], {
    approver: user.name,
    startTime: leaveWithUser.startTime,
    endTime: leaveWithUser.endTime,
    reason: LeaveReason[leaveWithUser.reason],
    id: leaveWithUser.id,
    description: deletedReason
  });
  return ok;
}

global.leaveEdit = leaveEdit;
function leaveEdit({ id, startTime, endTime, reason, description, idRequester, idApprover }) {
  const ok = db.from<Leave>('leave').update(id, { startTime, endTime, reason, description, idRequester, idApprover });
  if (!ok) return ok;
  const user = userInfo();
  const leaveWithUser = db.join<Leave, User>('leave', 'user', 'idRequester', 'user').sWhere('id', id).toJSON()[0];
  const requester = leaveWithUser.user;
  if (user.id === requester.id) return ok;
  sendMail('new', [requester.email], {
    approver: user.name,
    startTime: leaveWithUser.startTime,
    endTime: leaveWithUser.endTime,
    reason: LeaveReason[leaveWithUser.reason],
    id: leaveWithUser.id,
    description: leaveWithUser.description
  });
  return ok;
}
