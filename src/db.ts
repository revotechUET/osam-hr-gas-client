// import { SpreadSheetDB } from 'gsheetdb';
import { SpreadSheetDB } from '../../gsheetdb';
import config from '../config';
import { getService } from './services';

let _db: SpreadSheetDB;
(() => {
  const service = getService();
  if (service.hasAccess()) {
    _db = new SpreadSheetDB({
      ...config.spreadsheet,
      accessToken: service.getAccessToken(),
      init: true,
    });
  } else {
    throw service.getLastError();
  }
})();

export const db = _db;

/*
// @ts-ignore
export const db = new gsheetdb.SpreadSheetDB({
  ...config.spreadsheet,
  // init: true,
});
 */
