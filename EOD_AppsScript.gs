/**
 * EOD Check-in → Google Sheet
 * ---------------------------------------------------------------------------
 * Receives submissions from index.html and appends one row per submission to
 * the "Trainee Responses" or "Senior Agent Responses" tab.
 *
 * The form sends a structured payload that already carries each question's
 * TEXT alongside the answer, so columns stay stable even when you edit the
 * questions later — Q1..Q8 columns hold the question text + the answer.
 *
 * SETUP
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Delete any starter code and paste this whole file. Save.
 *   3. Select the function `setup` in the toolbar and click Run. Approve the
 *      permission prompt. This creates both tabs + header rows.
 *   4. Deploy → New deployment → Web app:
 *        Execute as: Me   |   Who has access: Anyone
 *      Deploy, then copy the Web app URL.
 *   5. Paste that URL into SHEET_ENDPOINT near the top of index.html.
 *
 * Re-running setup() only rewrites header rows; it never deletes data.
 */

var TRAINEE_TAB = "Trainee Responses";
var SENIOR_TAB = "Senior Agent Responses";
var MAX_Q = 8; // max questions per day. Trainee Weeks 2-4 (Days 6-20) carry 8
               // questions (5 original + 3 senior-agent); shorter days and the
               // Senior bank (5 each) simply leave the extra columns blank.

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, TRAINEE_TAB, traineeHeaders_());
  ensureSheet_(ss, SENIOR_TAB, seniorHeaders_());
}

function traineeHeaders_() {
  var h = ["Submitted At", "Date", "Program Day", "Week", "Day Label", "Trainee"];
  for (var i = 1; i <= MAX_Q; i++) { h.push("Q" + i); h.push("Q" + i + " Answer"); }
  h.push("Raw JSON");
  return h;
}

function seniorHeaders_() {
  var h = ["Submitted At", "Date", "Program Day", "Week", "Day Label", "Trainee", "Senior Agent", "Mode"];
  for (var i = 1; i <= MAX_Q; i++) { h.push("Q" + i); h.push("Q" + i + " Answer"); }
  h.push("Raw JSON");
  return h;
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sh.setFrozenRows(1);
  return sh;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var isSenior = data._role === "senior";
    var name = isSenior ? SENIOR_TAB : TRAINEE_TAB;
    var headers = isSenior ? seniorHeaders_() : traineeHeaders_();
    var sh = ss.getSheetByName(name) || ensureSheet_(ss, name, headers);

    var row = [
      data._submitted_at || new Date().toISOString(),
      data.date || "",
      data.program_day || "",
      data.week || "",
      data.day_label || "",
      data.trainee_name || ""
    ];
    if (isSenior) {
      row.push(data.senior_agent_name || "");
      row.push(data.mode || "");
    }
    var responses = data.responses || [];
    for (var i = 0; i < MAX_Q; i++) {
      var r = responses[i];
      row.push(r ? r.label : "");
      row.push(r ? formatVal_(r.value) : "");
    }
    row.push(JSON.stringify(data));

    sh.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function formatVal_(v) {
  if (v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Array]") return v.join(", ");
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional: confirms the web app is reachable in a browser. */
function doGet() {
  return json_({ ok: true, service: "EOD Check-in endpoint" });
}
