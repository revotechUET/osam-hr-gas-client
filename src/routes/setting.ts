import { db } from "../db";

global.getSetting = getSetting;
export function getSetting() {
  const setting = db.from('setting').getDataJSON()[0];
  setting.workDays = JSON.parse(setting.workDays);
  return setting;
}
