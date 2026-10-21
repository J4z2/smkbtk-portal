# Project status

Last updated: 20 October 2026. Everything below is committed and pushed to `main` on https://github.com/J4z2/smkbtk-portal (private).

## Done

| Phase | What | Commit |
|---|---|---|
| 0 | Frontend audit and fixes of the v12 prototype ([FRONTEND-AUDIT.md](FRONTEND-AUDIT.md)) | `97fc05e` |
| 1 | Laravel 13 project and MySQL schema ([DATABASE-SCHEMA.md](DATABASE-SCHEMA.md)) | `bc16d26` |
| 2 | Backend: login (email/phone/IC), roles and access rules, report workflow, attendance, absence notices, interventions, analytics, CSV import, parent login slips, audit log | `c8532c3` |
| 3 | Portal page served by Laravel and connected to the API; every screen and button works against MySQL | `490a758` |
| 4 | Performance at full school size (2,628 students): admin page 0.3 s / 45 MB on the server | `6729d2a` |
| 4 | Parent–teacher meeting slots and bookings | `d67b10b` |
| 4 | PDPA retention job: anonymise leavers after 5 years (daily, 02:00) | `2bb82c1` |
| 4 | Exabyte deployment guide, production `.env` template, `deploy.sh` ([DEPLOY-EXABYTE.md](DEPLOY-EXABYTE.md)) | `dd306ea` |
| 4 | Bahasa Melayu / English switch | `4bf7c82` |
| 4 | Security fix: escape teacher text on the parent dashboard | `55759f5` |

Tests: 44 feature and unit tests, all passing on SQLite and on MySQL 8.4. Each role was also tested end to end in a browser.

## Defaults chosen while you were away

You asked me to continue without waiting for approval, so these were decided using the defaults below. Each can be changed.

- **Laravel 13 needs PHP 8.3 or 8.4** on Exabyte (not 8.2). PHP 8.2 also stops getting security fixes at the end of 2026.
- Schema questions Q1–Q7: see the table at the end of [DATABASE-SCHEMA.md](DATABASE-SCHEMA.md#6-defaults-used-while-you-were-away).
- Marks 0–39 show as grade **G** (S1). Form 4 checkpoints are **TOV / PPT / Pentaksiran 2 / PAT** (S3).
- One class teacher per class per year; a teacher can lead only one class.
- Parents cannot edit their own profile in the portal (change requests go through the school office), but they can change their password.
- The demo "reset data" and "export all data" buttons were removed. A one-click download of every student's data is a PDPA risk.
- "Muat turun PDF" now opens the print dialog, where browsers offer "Save as PDF".
- The privacy notice is loaded as an **unpublished draft**. Parents are only asked to accept it after the super admin publishes it.

## Needs you

1. **Exabyte:** check the account offers PHP 8.3 or 8.4, then follow [DEPLOY-EXABYTE-PLESK.md](DEPLOY-EXABYTE-PLESK.md) (Plesk) or [DEPLOY-EXABYTE.md](DEPLOY-EXABYTE.md) (cPanel), starting with staging.smkbtk.com.
2. **School spreadsheet:** when it arrives, save it as CSV with the columns in [BACKEND-API.md](BACKEND-API.md#student-csv-import-columns), or send it to me and I'll match the importer to its layout.
3. **Privacy notice:** fill in the [placeholders] in `backend/resources/privacy/notice.ms.md` and `notice.en.md`, have the school review it, then publish it from Audit & privasi.
4. **Open school question S2:** should a TLMS student (failed BM or Sejarah) get **0 credits** even with A's in other subjects? This is the current behaviour.
5. **Laravel Boost:** the Laravel installer added `backend/CLAUDE.md` and `AGENTS.md`, which ask for the `laravel/boost` dev package. It's optional tooling for AI assistants; I haven't installed it. Say if you want it.
6. **Running locally:** you need MySQL on your Mac (for example the free DBngin app), then follow the README. My test MySQL ran from a temporary folder and isn't kept.

## Known limits

- **Excel:** the import reads CSV only. Excel files need "Save as → CSV UTF-8" first.
- **Co-curricular activities:** the tables exist, but there are no screens to enter activities yet.
- **Absence notices:** parents can't attach a supporting document from the portal yet. The API supports it.
- **Email:** none at launch. Password resets and new accounts use printed one-time passwords.
- **English mode:** translates the existing screens. New Malay text added later stays Malay until it's added to `public/assets/i18n.js`.
