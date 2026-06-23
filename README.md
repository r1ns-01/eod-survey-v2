# Lola Blankets Daily EOD Check-in · Learner and Senior Agent POV

A single-page End-of-Day check-in form for the Lola Blankets 2026 CX training
program. Two roles — **Trainee** and **Senior Agent** — each get the exact
question set for the current training day, pulled straight from the program's
Notion surveys:

- **Trainee POV** — Weeks 1–4, Days 1–20 (5 questions/day)
- **Senior Agent POV** — Weeks 2–4, Days 6–20 (5 questions/day; senior shadow
  feedback starts in Week 2)

Each submission appends a row to the Google Sheet **EOD Check-in Responses**
(<https://docs.google.com/spreadsheets/d/1_8SphH9-DzSN7BxhR-RDRsMTI6XlZ7cO5MuqHhqHLm4/edit>),
on a **Trainee Responses** tab and a **Senior Agent Responses** tab. Responses
also save locally in the browser and can be downloaded as JSON (backup).

## Files

- `index.html` — the form (open it in a browser or host it anywhere static).
- `EOD_AppsScript.gs` — the Google Apps Script web app that writes to the sheet.
- `favicon.png` — the tab icon.

## How the day is chosen

The person filling out the form picks the **training day** explicitly. After
choosing a role they answer two header fields up front — today's **date** and a
**"Which training day is this?"** dropdown — and that picked day (not the
calendar weekday) selects the question set. This means a new hire can start on
any weekday: there's no fixed cohort start date to configure.

- Trainee picker offers **Day 1–20** (Weeks 1–4).
- Senior picker offers **Day 6–20** (shadow feedback runs Weeks 2–4).

Both the date and the training day are saved with every response. Since start
dates vary per hire, post each new hire's start date somewhere visible before
the survey so people pick the right day.

## Google Sheet setup (5 minutes, one time)

1. Open the Google Sheet above.
2. **Extensions → Apps Script.** Delete any starter code.
3. Paste the entire contents of **`EOD_AppsScript.gs`**, then Save.
4. In the toolbar, select the function **`setup`** and click **Run**. Approve
   the permission prompt (it's your own script). This creates both tabs +
   headers.
5. **Deploy → New deployment → Web app.**
   - Description: EOD endpoint
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **copy the Web app URL**.
6. Open **`index.html`** in a text editor, find this near the top:
   `const SHEET_ENDPOINT = "";`
   Paste your Web app URL between the quotes and save.

That's it. Every time someone finishes the form, a new row is appended to the
right tab.

## Sheet columns

Each row carries the meta fields plus the day's questions inline:
`Q1 / Q1 Answer … Q5 / Q5 Answer`. Storing the question text next to the answer
means columns stay stable even if you reword questions later — no need to
regenerate the script. (Trainee tab: Submitted At, Date, Program Day, Week, Day
Label, Trainee, Q1…Q5. Senior tab adds Senior Agent and Mode.)

## Notes

- Re-running `setup()` only rewrites the header rows; it never deletes data.
- The form sends with `no-cors`, so it can't read the reply — it optimistically
  shows "Sent." To hard-verify, watch a test row land in the sheet.
- If `SHEET_ENDPOINT` is left blank, the form still works fully offline:
  responses save locally and can be downloaded/copied as JSON.

## Question source

Questions are transcribed verbatim from the program Notion pages:

- Trainee POV — EOD Surveys (Weeks 1–4)
- Senior Agent POV — Shadow Feedback (Weeks 2–4)
