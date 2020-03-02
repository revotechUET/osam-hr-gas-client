import { endOfDay, startOfDay, lightFormat } from "date-fns";
import { Checking, CheckingStatus, ReportStatus } from "../@types/checking";
import { db } from "../db";
import { googleUser, uuid } from "../utils";
import { getMonthInterval } from "./payroll";

export function todayDateString() {
  return startOfDay(new Date()).toISOString();
}

global.checkingStatus = checkingStatus;
function checkingStatus() {
  const user = googleUser();
  const [checking] = db.from<Checking>('checking').query.select().where('date', todayDateString()).where('idUser', user.id).toJSON();
  if (checking) {
    if (checking.checkoutTime) {
      return { status: CheckingStatus.CheckedOut };
    }
    return { status: CheckingStatus.CheckedIn, checking };
  }
  return { status: CheckingStatus.None };
}

global.checkin = checkin;
function checkin() {
  const { status } = checkingStatus();
  if (status !== CheckingStatus.None) {
    throw 'Not valid';
  }
  const user = googleUser();
  const checking: Checking = {
    id: uuid(),
    idUser: user.id,
    date: todayDateString(),
    checkinTime: new Date().toISOString(),
    reportStatus: ReportStatus.None,
  }
  db.from<Checking>('checking').insert(checking);
  return checking;
}

global.checkout = checkout;
function checkout() {
  const { status, checking } = checkingStatus();
  if (status !== CheckingStatus.CheckedIn) {
    throw 'Not valid';
  }
  checking.checkoutTime = new Date().toISOString();
  const setting = db.from('setting').getDataJSON()[0];
  db.from<Checking>('checking').update(checking.id, { checkoutTime: checking.checkoutTime });
  return checking;
}

global.checkingList = checkingList;
function checkingList({ fromDate, toDate, reportStatus }) {
  const user = googleUser();
  if (!fromDate && !toDate) {
    const { start, end } = getMonthInterval(new Date());
    fromDate = start;
    toDate = end;
  }
  const checkingsQuery = db.from<Checking>('checking').query
    .where('idUser', user.id);
  if (fromDate) {
    checkingsQuery.where('date', '>=', startOfDay(new Date(fromDate)));
  }
  if (toDate) {
    checkingsQuery.where('date', '<=', endOfDay(new Date(toDate)));
  }
  if (reportStatus) {
    checkingsQuery.where('reportStatus', reportStatus);
  }
  const checkings = checkingsQuery.toJSON();
  return checkings;
}

global.checkingReport = checkingReport;
function checkingReport({ id, reportContent }) {
  const ok = db.from<Checking>('checking').update(id, 'reportContent', reportContent);
  if (ok) {
    db.from<Checking>('checking').update(id, 'reportStatus', ReportStatus.Reported);
  }
  return ok;
}
