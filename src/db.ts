import { SpreadSheetDB } from 'gsheetdb';
import config from '../config';

export let db: SpreadSheetDB;
export function init() {
  db = new SpreadSheetDB({
    source_url: config.sheetUrl,
    sheetSpecs: {},
  });
}
