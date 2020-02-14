import { googleUser, userInfo, dateString, isValid, uuid } from "../utils";
import { db } from "../db";
import { Checking, CheckingStatus, ReportStatus } from "../@types/checking";


global.checkingStatus = checkingStatus;
function checkingStatus() {
  const user = googleUser();
  const [checking] = db.from<Checking>('checking').query.select().where('date', dateString()).where('idUser', user.id).getResultsJson();
  if (isValid(checking)) {
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
    date: dateString(),
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
  db.from<Checking>('checking').update(checking.id, 'checkoutTime', checking.checkoutTime);
  return checking;
}

global.checkingList = checkingList;
function checkingList({ fromDate, toDate, reportStatus }) {
  console.log(fromDate);
  const user = googleUser();
  const checkingsQuery = db.from<Checking>('checking').query
    .where('idUser', user.id);
  if (fromDate) {
    checkingsQuery.where('date', '>=', dateString(fromDate));
  }
  if (toDate) {
    checkingsQuery.where('date', '<=', dateString(toDate));
  }
  if (reportStatus) {
    checkingsQuery.where('reportStatus', reportStatus);
  }
  const checkings = checkingsQuery.getResultsJson().filter(c => isValid(c));
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
