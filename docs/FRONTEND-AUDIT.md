# Frontend audit (Phase 0)

Audit of the v12 frontend before production work. Date: 20 October 2026.
Method: full read of `app.js` and `index.html`, then every view opened for every demo account in Chrome (desktop and 375 px phone width), with scripted checks for the bugs below.

Status key: **Fix now** = fix in the current frontend. **Backend** = goes away or gets fixed when the Laravel backend replaces browser storage. **School** = needs a decision from the school.

## A. Confirmed bugs

| # | Problem | Where | Plan |
|---|---|---|---|
| A1 | "Simpan tetapan" on the COEx settings page calls `saveCoexSettings()`, which does not exist. The button does nothing and COEx rule changes cannot be saved. | `app.js:3550` | Fix now |
| A2 | Saving a teacher report rewrites the student's attendance history. `adjustAttendanceToRate()` turns every day into P or A to match the "Kehadiran (%)" box, wiping Lewat, MC, Urusan rasmi and moving absences to different dates. Tested: absences on days 3 and 7 moved to the last two days after a plain "Simpan draf". | `app.js:1924`, `app.js:1960` | Fix now: make the % box read-only; attendance only changes through daily attendance |
| A3 | Marks are stored twice and drift apart. "Rekod laporan" saves `s.scores`; "Rekod Prestasi Pelajar" saves COEx checkpoint marks. Tested: changing BM to 12 in the report left COEx/Gear at 44. Parents then see one mark in the report and another in the COEx page. | `app.js:1915`, `app.js:3479`, `app.js:2913` | Fix now: one source of marks (checkpoint marks); report reads from it |
| A4 | Marks 0–39 get grade "G1"/"G2" from the COEx rules, but every grade count and filter uses "G". Students in Gear 1–2 disappear from the grade analytics for teachers and admin. | `app.js:2674`, `app.js:2684`, `app.js:806` | Fix now (see School question S1) |
| A5 | Parents can see marks that are not approved. The report page hides unpublished marks, but the dashboard (marks, average, Gear) and the COEx page show draft and submitted marks. Tested with a draft report: the draft mark appeared on both pages. | `app.js:1662`, `app.js:3341` | Fix now: parents only see published checkpoints |
| A6 | Wrong exam timeline. Forms 1–3 and 6 are shown the Form 5 SPM timeline ("Percubaan SPM", "SPM sebenar"). Form 4 timeline marks "Percubaan SPM" as the current point while the rest of the page calls the same checkpoint "PAT Tingkatan 4". | `app.js:1084`, `app.js:1012`, `app.js:1251` | Fix now: timeline per form, labels from one place |
| A7 | Teacher comment and support note cannot be cleared; an empty box restores the old text. | `app.js:1936` | Fix now |
| A8 | Deleting a subject permanently deletes that subject's marks for every student, in every form level, even if it was only removed from one level. | `app.js:2595` | Fix now: remove from a level only; keep historical marks (archive, not delete) |
| A9 | CSV import help text says class codes like "2A, 2B, 3A", which do not exist (codes are 1A, 2B, 3C, 4M…). Rows with those codes are skipped silently. | `app.js:2326`, `app.js:2355` | Fix now: show valid codes and list skipped rows with reasons |
| A10 | COEx mark preview replaces the coloured grade badge with plain text while typing. | `app.js:3441` | Fix now |
| A11 | Parent profile edit says "disimpan untuk semakan sekolah" but changes the guardian name and phone on the student records immediately. | `app.js:1791` | Backend: change requests reviewed by admin |
| A12 | e-Certificate always shows level badge "5". | `app.js:1109` | Fix now: show the student's real level |

## B. Invented data shown as real

These are fine for a demo but would show parents numbers that were never entered.

| # | Problem | Where | Plan |
|---|---|---|---|
| B1 | The academic trend graph invents 6 of its 7 points from the current average. The heading is hard-coded "Apa maksud 84% ini?" whatever the real average is. | `app.js:975`, `app.js:1007` | Fix now: plot only real checkpoint averages; hide the graph when there is fewer than 2 |
| B2 | When a student has no COEx record, earlier checkpoint marks (TOV, PAT, PPT) and targets are generated from the current marks and marked "published". One student (`SMK2026-002`) has hand-written marks in code. | `app.js:2824`, `app.js:2861` | Fix now: empty checkpoints stay empty; demo data moves to seed data only |
| B3 | Moving a student to another class deletes their COEx record, which then regenerates invented history. | `app.js:1200` | Fix now |

## C. Security and privacy

| # | Problem | Where | Plan |
|---|---|---|---|
| C1 | Passwords and accounts are in the JavaScript and browser storage; login is checked in the browser. JSON export includes passwords. | `app.js:1488`, `app.js:2626` | Backend |
| C2 | IDs and subject names are put inside inline `onclick="...('${id}')"` handlers. `esc()` does not protect text inside a JavaScript string in an HTML attribute, and CSV-imported IDs are not validated, so a crafted ID or subject name can run script. | e.g. `app.js:2502`, `app.js:2121`, `app.js:2351` | Fix now: validate IDs; pass values through `data-` attributes instead of building JS strings |
| C3 | The real principal's name is assigned to a demo teacher account and written into the audit log. | `app.js:604` | Fix now: remove; real names only come from the school's data |
| C4 | Audit log keeps only the last 80 entries. | `app.js:1398` | Backend: full audit table |

## D. Hard-coded dates and placeholders

| # | Problem | Where | Plan |
|---|---|---|---|
| D1 | Daily attendance always saves to 6 July 2026, whatever the real date. | `app.js:1970`, `app.js:1992` | Backend (server date); frontend gets a date picker |
| D2 | Parent attendance calendar is fixed to June 2026; "Kehadiran bulan Jun" shows all-time figures. | `app.js:1710`, `app.js:1672`, `app.js:1730` | Fix now: month selector, correct totals |
| D3 | Meeting dates/slots, intervention follow-up date, absence date range, session card "Penggal 1, 1 Januari hingga 30 Jun" are fixed values. | `app.js:1813`, `app.js:3648`, `app.js:1730`, `index.html:335` | Backend (school settings) |
| D4 | Footer address and phone, school email `smkseribestari@moe.edu.my`, `@smkseribestari.edu.my` demo logins, storage key and export filename are placeholders. | `index.html:187`, `app.js:1784`, `app.js:9`, `app.js:2632` | Fix now: one school-settings object; real values from super admin |
| D5 | Avatar initials "PN"/"CF" are fixed regardless of who logs in. | `app.js:1530` | Fix now |

## E. Phone layout (375 px)

Pages that scroll sideways on a phone: Parent "Metrik Prestasi Pelajar" (504 px wide, the 6-level ladder and checkpoint chart), Admin home (623 px), Data sekolah (616 px), Tetapan COEx (948 px), Teacher home (398 px). Parent dashboard, report and attendance fit. Plan: **Fix now**, parent COEx page first since most parents use phones.

## F. Structural issues for the backend design

- Two separate approval flows exist for the same marks (report status per student, and status per COEx checkpoint). Production should have one: class teacher submits a checkpoint for a class, admin approves and publishes.
- Each student has one `report` object, so there is no history of past terms. Production stores one record per student per checkpoint per year.
- Roles are free text (`roles.includes("Guru Kelas")`). Production uses fixed roles: parent, class teacher, admin, super admin.
- All screen text is Malay inside template strings. Bilingual support means moving text into translation files.

## School questions

- **S1:** For marks 0–39, should the portal show one grade "G" (as in the presentation report) or "G1"/"G2"? Suggested: show "G", keep Gear 1 and 2 for colour and intervention.
- **S2:** When a Form 4/5 student fails BM or Sejarah (TLMS), the portal counts **0 credits** even if they have A's in other subjects. Is that the intended rule?
- **S3:** Form 4 checkpoint names: TOV, PPT, PAT (current code) or "Awal Tingkatan 4 / Pentaksiran Tingkatan 4 / Percubaan SPM" (current timeline)?
