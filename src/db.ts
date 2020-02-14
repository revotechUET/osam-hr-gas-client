import { SpreadSheetDB } from 'gsheetdb';

export let db: SpreadSheetDB;
export function init() {
  const sheetDBUrl = "https://docs.google.com/spreadsheets/d/1SRg3FBaOiS_8Tb7M7zgVeneXx45DiAsb9T8L-tClEHM/edit";
  db = new SpreadSheetDB({
    source_url: sheetDBUrl,
    sheetSpecs: {},
  });
}
