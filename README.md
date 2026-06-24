# Lola Blankets Daily EOD Check-in · Learner and Senior Agent POV

A single-page End-of-Day check-in form for the Lola Blankets 2026 CX training
program. Two roles — **Trainee** and **Senior Agent** — each get the exact
question set for the current training day, pulled straight from the program's
Notion surveys:

- **Trainee POV** — Weeks 1–4, Days 1–20. Week 1 has 5 questions/day; Weeks 2–4
  (Days 6–20) have 8 questions/day — the original 5 plus 3 senior-agent
  feedback questions (who you shadowed/were supervised by, a rating, and an
  open reflection).
- **Senior Agent POV** — Weeks 2–4, Days 6–20 (5 questions/day; senior shadow
  feedback starts in Week 2).

All rating questions use a **1–10** scale (1 = not at all, 10 = completely /
excellent).

Each submission is routed to a **per-day tab** in the Google Sheet
**EOD Check-in Responses**
(<https://docs.google.com/spreadsheets/d/1_8SphH9-DzSN7BxhR-RDRsMTI6XlZ7cO5MuqHhqHLm4/edit>),
named from the role and the chosen training day:

| Role | Day | Tab |
|------|-----|-----|
| Trainee | 1 | `Trainee D01` |
| Trainee | 20 | `Trainee D20` |
| Senior Agent | 6 | `Senior D06` |
| Senior Agent | 20 | `Senior D20` |

Responses also save locally in the browser and can be downloaded as JSON
(backup).

## Files

- `index.html` — the form (open it in a browser or host it anywhere static).
- `EOD_AppsScript.gs` — the Google Apps Script web app that writes to the sheet.
- `favicon.png` — the tab icon.

## How the day is chosen

The person filling out the form picks the **training day** explicitly. After
choosing a role they answer two header fields up front — today's **date** and a
**"Which training day is this?"** dropdown — and that picked day (not the
calendar weekday) selects the question set **and the destination tab**. This
means a new hire can start on any weekday: there's no fixed cohort start date to
configure.

- Trainee picker offers **Day 1–20** (Weeks 1–4) → `Trainee D01`–`Trainee D20`.
- Senior picker offers **Day 6–20** (shadow feedback runs Weeks 2–4) →
  `Senior D06`–`Senior D20`.

Both the date and the training day are saved with every response. Since start
dates vary per hire, post each new hire's start date somewhere visible before
the survey so people pick the right day.

## Google Sheet setup (5 minutes, one time)

1. Open the Google Sheet above.
2. **Extensions → Apps Script.** Delete any starter code.
3. Paste the entire contents of **`EOD_AppsScript.gs`**, then Save.
4. *(Optional)* In the toolbar, select **`setup`** and click **Run** to
   pre-create all per-day tabs as empty sheets. Approve the permission prompt.
   This is optional — each per-day tab is also created automatically the first
   time someone submits for that day.
5. **Deploy → New deployment → Web app.**
   - Description: EOD endpoint
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **copy the Web app URL**.
6. Open **`index.html`** in a text editor, find this near the top:
   `const SHEET_ENDPOINT = "";`
   Paste your Web app URL between the quotes and save.

That's it. Every time someone finishes the form, a new row is appended to the
correct `Trainee D##` / `Senior D##` tab.

## How each tab is laid out

Each per-day tab uses **answer-only columns whose header is the full question
text**, so a column reads `Q1. How clear are you on what Lola Blankets stands
for…` and the cells below it hold just the answers.

- **Trainee tabs:** Submitted At, Date, Program Day, Week, Day Label, Trainee,
  then `Q1.`…`Q5.` (Week 1) or `Q1.`…`Q8.` (Weeks 2–4).
- **Senior tabs:** the same meta columns plus Senior Agent and Mode, then
  `Q1.`…`Q5.`
- A **hidden `Raw JSON`** column sits at the far right of every tab as a backup
  of the full submission.

Headers are written automatically from each submission, so they always match
the live form. If a day's questions change (e.g. a trainee day grows from 5 to 8
questions), the header row updates itself on the next submission — no need to
edit the script.

## Notes

- The script never deletes tabs or rows; it only creates tabs, (re)writes the
  header row, and appends responses.
- The form sends with `no-cors`, so it can't read the reply — it optimistically
  shows "Sent." To hard-verify, watch a test row land in the right tab.
- If `SHEET_ENDPOINT` is left blank, the form still works fully offline:
  responses save locally and can be downloaded/copied as JSON.

## Question source

Questions are transcribed verbatim from the program Notion pages:

- Trainee POV — EOD Surveys (Weeks 1–4)
- Senior Agent POV — Shadow Feedback (Weeks 2–4)
