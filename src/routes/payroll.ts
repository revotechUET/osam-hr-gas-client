import { areIntervalsOverlapping, eachDayOfInterval, eachMonthOfInterval, endOfDay, getDaysInMonth, isSameDay, startOfDay, subMonths } from 'date-fns';
import { Leave, LeaveReason, LeaveStatus } from '../@types/leave';
import { db } from '../db';
import { getEvents } from './calendar';
import { getSetting } from './setting';
import { userInfo } from './user';

global.getMonthInterval = getMonthInterval;
export function getMonthInterval(dateInMonth?, raw = false) {
  dateInMonth = new Date(dateInMonth || new Date());
  const setting = getSetting();
  let start = new Date(dateInMonth);
  start.setFullYear(dateInMonth.getFullYear(), dateInMonth.getMonth(), setting.monthEnd);
  let end = new Date(dateInMonth);
  end.setFullYear(dateInMonth.getFullYear(), dateInMonth.getMonth(), setting.monthEnd);
  const date = dateInMonth.getDate();
  const maxDay = getDaysInMonth(dateInMonth);
  if (date <= setting.monthEnd) {
    const prevMonth = subMonths(dateInMonth, 1);
    const prevMonthMaxDay = getDaysInMonth(prevMonth);
    start.setMonth(prevMonth.getMonth(), Math.min(prevMonthMaxDay, setting.monthEnd) + 1);
    end.setDate(Math.min(maxDay, setting.monthEnd));
  } else {
    const nextMonth = subMonths(dateInMonth, 1);
    const nextMonthMaxDay = getDaysInMonth(nextMonth);
    start.setDate(Math.min(maxDay, setting.monthEnd) + 1);
    end.setMonth(nextMonth.getMonth(), Math.min(nextMonthMaxDay, setting.monthEnd));
  }
  start = startOfDay(start);
  end = endOfDay(end);
  if (raw) {
    return { start, end };
  }
  return { start: start.toISOString(), end: end.toISOString() };
}

global.getPayroll = getPayroll;
function getPayroll({ startDate, endDate, setting = null }) {
  if (!startDate || !endDate) throw 'Không có khoảng thời gian tính công';
  startDate = startOfDay(new Date(startDate)).toISOString();
  endDate = endOfDay(new Date(endDate)).toISOString();
  const { id, contract } = userInfo({ loadContracts: true });
  if (!contract) throw 'User must have a contract'
  const checkings = db.from('checking').query
    .where('idUser', id)
    .where('checkoutTime', null, null, 'is not null')
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .toJSON()
    .map(c => ({ date: new Date(c.date), checkinTime: new Date(c.checkinTime), checkoutTime: new Date(c.checkoutTime) }));
  const leavesQuery = db.from<Leave>('leave').query
  const [statusCol, idRequesterCol, startTimeCol, endTimeCol] = ['status', 'idRequester', 'startTime', 'endTime'].map(leavesQuery.getColId.bind(leavesQuery));
  leavesQuery.raw(
    `SELECT * WHERE ${statusCol} ='${LeaveStatus.Approved}' AND ${idRequesterCol} ='${id}' AND
     ((${startTimeCol} >='${startDate}' AND ${startTimeCol} <='${endDate}') OR (${endTimeCol} >= '${startDate}' AND ${endTimeCol} <='${endDate}'))`
  )
  const leaves = leavesQuery.toJSON()
    .map(l => ({ startTime: new Date(l.startTime), endTime: new Date(l.endTime) }));
  setting = setting || getSetting();
  const events = getEvents(1, new Date(startDate), new Date(endDate)).events;
  console.log(events);
  const daysOff = [];
  for (const event of events) {
    daysOff.push(...eachDayOfInterval({ start: new Date(event.start), end: new Date(event.end) }));
  }
  return getSummaries({ checkings, leaves, startDate, endDate, setting: { ...setting, daysOff }, contract });
}

global.getPayrollThisMonth = getPayrollThisMonth;
function getPayrollThisMonth({ dateInMonth = null } = {}) {
  dateInMonth = new Date(dateInMonth || new Date());
  const setting = getSetting();
  const startDate = new Date(dateInMonth);
  startDate.setFullYear(dateInMonth.getFullYear(), dateInMonth.getMonth(), setting.monthEnd);
  const endDate = new Date(dateInMonth);
  endDate.setFullYear(dateInMonth.getFullYear(), dateInMonth.getMonth(), setting.monthEnd);
  const date = dateInMonth.getDate();
  const maxDay = getDaysInMonth(dateInMonth);
  if (date <= setting.monthEnd) {
    const prevMonth = subMonths(dateInMonth, 1);
    const prevMonthMaxDay = getDaysInMonth(prevMonth);
    startDate.setMonth(prevMonth.getMonth(), Math.min(prevMonthMaxDay, setting.monthEnd) + 1);
    endDate.setDate(Math.min(maxDay, setting.monthEnd));
  } else {
    const nextMonth = subMonths(dateInMonth, 1);
    const nextMonthMaxDay = getDaysInMonth(nextMonth);
    startDate.setDate(Math.min(maxDay, setting.monthEnd) + 1);
    endDate.setMonth(nextMonth.getMonth(), Math.min(nextMonthMaxDay, setting.monthEnd));
  }
  return getPayroll({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
}

function getSummaries({ startDate, endDate, checkings, leaves, setting, contract }) {
  const dates = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map(d => ({ start: d, end: endOfDay(d) }));
  let points = 0, lunches = 0, permittedLeaves = 0, unpermittedLeaves = 0;
  for (const date of dates) {
    if (setting.daysOff.find(d => isSameDay(d, date.start))) {
      const workDay = setting.workDays[date.start.getDay()];
      if (workDay === 0) continue;
      else if (workDay === 3) points += 1;
      else points += 0.5;
    }
    const checking = checkings.find(c => isSameDay(c.date, date.start));
    const leave = leaves.find(l => areIntervalsOverlapping({ start: l.startTime, end: l.endTime }, date));
    if (!checking && !leave) continue;
    const { point, lunch, permittedLeave, unpermittedLeave } = getDateSummaries(date.start, checking, leave, setting, contract);
    points += point;
    lunches += lunch;
    permittedLeaves += permittedLeave;
    unpermittedLeaves += unpermittedLeave;
  }
  return { points, lunches, permittedLeaves, unpermittedLeaves };
}

function getDateSummaries(date: Date, checking, leave, setting, contract) {
  let point = 0, lunch = 0, permittedLeave = 0, unpermittedLeave = 0;
  const workDay = setting.workDays[date.getDay()];
  if (workDay === 0 || !checking && !leave) return { point, lunch, permittedLeave, unpermittedLeave };
  const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()];
  const [
    morningStart,
    morningEnd,
    afternoonStart,
    afternoonEnd
  ] = [
    setting.morningStart,
    setting.morningEnd,
    setting.afternoonStart,
    setting.afternoonEnd,
  ].map(v => {
    const ret = new Date(v);
    ret.setFullYear(y, m, d);
    return ret;
  });
  if (leave) {
    leave = {
      ...leave,
      startTime: new Date(leave.startTime),
      endTime: new Date(leave.endTime),
    }
  }
  let checkin: Date, checkout: Date;
  if (checking) {
    checkin = new Date(checking.checkinTime);
    checkin.setFullYear(y, m, d);
    checkout = new Date(checking.checkoutTime);
    checkout.setFullYear(y, m, d);
  }

  let late1 = 0, early1 = 0, total1 = 0, permittedLeave1 = 0, unpermittedLeave1 = 0, point1 = 0;
  let late2 = 0, early2 = 0, total2 = 0, permittedLeave2 = 0, unpermittedLeave2 = 0, point2 = 0;
  const ratio = setting.contractType === 'parttime' ? 1 : 0.5;
  if (workDay === 1 || workDay === 3) {
    total1 = +morningEnd - +morningStart;
    let leaveValid = false, checkingValid = false;
    if (leave && areIntervalsOverlapping({ start: leave.startTime, end: leave.endTime }, { start: morningStart, end: morningEnd })) {
      leaveValid = true;
      permittedLeave1 = Math.min(+morningEnd, +leave.endTime) - Math.max(+morningStart, +leave.startTime);
    }
    if (checking && areIntervalsOverlapping({ start: checkin, end: checkout }, { start: morningStart, end: morningEnd })) {
      checkingValid = true;
      late1 = Math.max(0, +checkin - +morningStart);
      early1 = Math.max(0, +morningEnd - +checkout);
    }
    if (checkingValid || leaveValid) {
      unpermittedLeave1 = Math.max(0, late1 + early1 - permittedLeave1);
    } else {
      unpermittedLeave1 = total1;
    }
    point1 = (total1 - unpermittedLeave1 - permittedLeave1) / total1 * ratio;
    permittedLeave1 = permittedLeave1 / total1 * ratio;
    unpermittedLeave1 = unpermittedLeave1 / total1 * ratio;
  }
  if (workDay === 2 || workDay === 3) {
    let leaveValid = false, checkingValid = false;
    total2 = +afternoonEnd - +afternoonStart;
    if (leave && areIntervalsOverlapping({ start: leave.startTime, end: leave.endTime }, { start: afternoonStart, end: afternoonEnd })) {
      leaveValid = true;
      permittedLeave2 = Math.min(+afternoonEnd, +leave.endTime) - Math.max(+afternoonStart, +leave.startTime);
    }
    if (checking && areIntervalsOverlapping({ start: checkin, end: checkout }, { start: afternoonStart, end: afternoonEnd })) {
      checkingValid = true;
      late2 = Math.max(0, +checkin - +afternoonStart);
      early2 = Math.max(0, +afternoonEnd - +checkout);
    }
    if (checkingValid || leaveValid) {
      unpermittedLeave2 = Math.max(0, late2 + early2 - permittedLeave2);
    } else {
      unpermittedLeave2 = total2;
    }
    point2 = (total2 - unpermittedLeave2 - permittedLeave2) / total2 * ratio;
    permittedLeave2 = permittedLeave2 / total2 * ratio;
    unpermittedLeave2 = unpermittedLeave2 / total2 * ratio;
  }
  if (workDay === 3 && contract.lunch) {
    const lunchStart = new Date(setting.lunchStart);
    lunchStart.setFullYear(y, m, d);
    const lunchEnd = new Date(setting.lunchEnd);
    lunchEnd.setFullYear(y, m, d);
    if (checkin < lunchStart && checkout > lunchEnd) lunch = 1;
    if (leave && leave.startTime <= lunchStart && leave.endTime >= lunchEnd) lunch = 0;
  }
  point = point1 + point2;
  permittedLeave = permittedLeave1 + permittedLeave2;
  unpermittedLeave = unpermittedLeave1 + unpermittedLeave2;
  if (leave && leave.reason != LeaveReason.Personal) {
    point += permittedLeave;
    permittedLeave = 0;
  } else if (!contract.leaveRequest) {
    unpermittedLeave += permittedLeave;
    permittedLeave = 0;
  }
  return { point: +point.toFixed(2), lunch, permittedLeave: +permittedLeave.toFixed(2), unpermittedLeave: +unpermittedLeave.toFixed(2) };
}

global.getRemainingLeaves = getRemainingLeaves;
function getRemainingLeaves() {
  const { id, contract } = userInfo({ loadContracts: true });
  if (!contract.leaveRequest) return 0;
  let setting = getSetting();
  const { start, end } = _getThisYearInterval(setting);
  const leaves = db.from<Leave>('leave').query.where('idRequester', id).where('status', LeaveStatus.Approved).where('endTime', '>', start.toISOString()).toJSON();
  const daysOff = [];
  const events = getEvents(1, new Date(start), new Date(end)).events;
  for (const event of events) {
    daysOff.push(...eachDayOfInterval({ start: new Date(event.start), end: new Date(event.end) }));
  }
  setting = { ...setting, daysOff, contractType: contract.type };
  return _getTotalPermittedLeaves(setting) - _getPermittedLeaves(leaves, setting);
}

function _getThisYearInterval(setting) {
  setting = setting || getSetting();
  const yearEnd = setting.yearEnd;
  const now = new Date();
  const currentMonth = new Date().getMonth();
  const start = new Date();
  start.setMonth(yearEnd);
  if (currentMonth <= yearEnd) {
    start.setFullYear(now.getFullYear() - 1);
  }
  const maxDay = getDaysInMonth(start);
  start.setDate(Math.min(maxDay, setting.monthEnd) + 1);
  return { start: startOfDay(start), end: now };
}
function _getTotalPermittedLeaves(setting) {
  return eachMonthOfInterval(_getThisYearInterval(setting)).length;
}
function _getPermittedLeaves(leaves, setting) {
  const ratio = setting.contractType === 'parttime' ? 1 : 0.5;
  let permittedLeaves = 0;
  for (const leave of leaves) {
    const startTime = new Date(leave.startTime);
    const endTime = new Date(leave.endTime);
    const dates = eachDayOfInterval({ start: startTime, end: endTime });
    for (const date of dates) {
      const workDay = setting.workDays[date.getDay()];
      if (workDay === 0 || setting.daysOff.find(d => isSameDay(d, date))) continue;
      const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()];
      const [
        morningStart,
        morningEnd,
        afternoonStart,
        afternoonEnd
      ] = [
        setting.morningStart,
        setting.morningEnd,
        setting.afternoonStart,
        setting.afternoonEnd,
      ].map(v => {
        const ret = new Date(v);
        ret.setFullYear(y, m, d);
        return ret;
      });
      if (workDay === 1 || workDay === 3) {
        if (areIntervalsOverlapping({ start: startTime, end: endTime }, { start: morningStart, end: morningEnd })) {
          permittedLeaves += (Math.min(+morningEnd, +endTime) - Math.max(+morningStart, +startTime)) / (+morningEnd - +morningStart) * ratio;
        }
      }
      if (workDay === 2 || workDay === 3) {
        if (areIntervalsOverlapping({ start: startTime, end: endTime }, { start: afternoonStart, end: afternoonEnd })) {
          permittedLeaves += (Math.min(+afternoonEnd, +endTime) - Math.max(+afternoonStart, +startTime)) / (+afternoonEnd - +afternoonStart) * ratio;
        }
      }
    }
  }
  return permittedLeaves;
}
