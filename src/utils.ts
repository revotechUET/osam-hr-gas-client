import uniqid from 'uniqid';
import { GoogleUser } from "./@types/user";

import newTemplate from './email-templates/new-leave-request.html';
import approveTmpl from './email-templates/approve-leave-request.html';
import rejectTmpl from './email-templates/reject-leave-request.html';
import deleteTmpl from './email-templates/delete-leave-request.html';
import responseTmpl from './email-templates/response-checking-request.html';

export function googleUser(): GoogleUser {
  const userCache = CacheService.getUserCache();
  let userInfo = JSON.parse(userCache.get('GOOGLE_USER'));
  if (!userInfo) {
    const user = People.People.get('people/me', { personFields: 'names' });
    const { metadata, ...names } = user.names.filter(n => n.metadata.primary)[0];
    const id = metadata.source.id;
    const current = Session.getActiveUser();
    const email = current.getEmail();
    userInfo = { id, email, ...names };
    userCache.put('GOOGLE_USER', JSON.stringify(userInfo), 21600);
  }
  return userInfo;
}

export function uuid(prefix?: string, suffix?: string) {
  return uniqid(prefix, suffix);
}

const templates = {
  new: newTemplate, approve: approveTmpl,
  delete: deleteTmpl, reject: rejectTmpl,
  response: responseTmpl
}

const subjectTemplates = {
  new: '[hr][leave-new] <?= requester ?> gửi yêu cầu nghỉ',
  approve: '[hr][leave-approved] <?= approver ?> chấp nhận yêu cầu nghỉ',
  delete: '[hr][leave-deleted] <?= approver ?> huỷ yêu cầu nghỉ',
  reject: '[hr][leave-rejected] <?= approver ?> từ chối yêu cầu nghỉ',
  response: '[hr][checking-response] <?= approver ?> gửi phản hồi'
}

export function sendMail(templateKey, emailAddresses, params) {
  let template = templates[templateKey];
  let sTemplate = subjectTemplates[templateKey];

  const bodyTemplate = HtmlService.createTemplate(template);
  const subjectTemplate = HtmlService.createTemplate(sTemplate);

  Object.assign(bodyTemplate, params);
  Object.assign(subjectTemplate, params);

  const htmlBody = bodyTemplate.evaluate().getContent();
  const subject = subjectTemplate.evaluate().getContent();
  MailApp.sendEmail({
    to: emailAddresses.join(','),
    subject, htmlBody,
    noReply: true,
  })
}
