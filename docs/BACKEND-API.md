# Backend API

All endpoints are under `/api`, return JSON, and use the session cookie. Requests that change data need the `X-XSRF-TOKEN` header (copied from the `XSRF-TOKEN` cookie). Errors: `401` not logged in, `403` not allowed (or account not ready, see `code`), `422` validation (`errors` object or `message`), `429` too many login attempts.

Roles: **P** parent, **T** class teacher, **A** admin, **S** super admin.

## Account

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/login` | anyone | `{login, password}`; login is email, phone or IC |
| POST | `/logout` | all | |
| GET | `/me` | all | `{id, name, role, locale, must_change_password}` |
| POST | `/password` | all | `{current_password, password, password_confirmation}` (8+ chars, letters and numbers) |
| GET | `/privacy-notice` | all | Current published notice, or `null` |
| POST | `/privacy-notice/accept` | P | |
| GET | `/public/school` | anyone | Name, address, phone for the landing page |

Every endpoint below returns `403` with `code` = `password_change_required`, `consent_required` (parents) or `account_inactive` until the account is ready.

## Shared

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/portal/snapshot` | all | Everything the portal page shows, in the page's own data shape, filtered by role |
| GET | `/bootstrap` | all | School details, COEx rules and thresholds, subjects, this year's checkpoints, and classes (staff: own class; admin: all) |
| GET | `/students` | all | P: own children. T: own class. A/S: all. Filters: `class_id`, `status`, `q`. 100 per page |
| GET | `/students/{id}` | all | Sensitive fields (IC, race, religion, citizenship) only for T (own class) and A/S. Guardians only for staff |
| GET | `/students/{id}/reports` | all | P: published only |
| GET | `/students/{id}/attendance?month=YYYY-MM` | all | Days, totals, rate, and months that have records |
| GET | `/students/{id}/photo` | all | Image, if allowed to see the student |
| GET | `/reports/{id}` | all | P: published only |
| POST | `/reports/{id}/acknowledge` | P | "Sahkan telah dibaca" |
| GET | `/announcements` | all | P: only those for all, their child's form or class |
| POST | `/meeting-slots/{id}/book` | P | `{student_id, topic}`; slot must be for the child's class and not full |
| PATCH | `/meeting-bookings/{id}` | P | `{status: cancelled}` for their own booking |
| GET, POST | `/absence-notices` | P creates; all list | Optional `document` upload (PDF/JPG/PNG, 4 MB) |

## Class teacher (and admin)

| Method | Path | Notes |
|---|---|---|
| GET | `/classes/{id}/reports?assessment_id=` | Creates missing reports and blank marks for the class |
| PATCH | `/reports/{id}` | `{marks: [{subject_id, mark, is_absent}], teacher_comment, support_note, discipline_note, co_score}`. Teacher: draft and checkpoint open only |
| POST | `/reports/{id}/submit` | Draft → submitted |
| GET, PUT | `/classes/{id}/attendance?date=` | PUT `{date, records: [{student_id, status, note}]}`. No future dates |
| POST | `/absence-notices/{id}/review` | `{status: acknowledged | rejected}` |
| GET, POST | `/interventions`, `/interventions/{id}/resolve` | |
| PUT | `/students/{id}/targets` | `{targets: [{subject_id, target_mark}]}`; `null` removes a target |
| GET | `/analytics/grades?subject_id=&assessment_key=&form=` | Grade counts and averages, overall and per form |
| POST | `/classes/{id}/parent-accounts` | Logins for guardians without one; returns printable slips with one-time passwords |
| POST, DELETE | `/classes/{id}/meeting-slots`, `/meeting-slots/{id}` | Open a slot `{date, starts_at, ends_at, capacity}`; delete only if nobody has booked |
| PATCH | `/meeting-bookings/{id}` | `{status: done | cancelled}` |
| POST | `/guardians/{id}/reset-password` | New one-time password (creates the login if missing) |

## Admin and super admin

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/reports/{id}/approve`, `/publish`, `/return` | A, S | Publishing freezes grades and Gears |
| POST | `/classes/{id}/reports/bulk` | A, S | `{assessment_id, action: approve | publish}` |
| POST, PATCH | `/students`, `/students/{id}` | A, S | Create needs `class_id`; `student_no` generated if blank |
| POST | `/students/{id}/move`, `/status`, `/photo` | A, S | Move needs a `reason` |
| POST, PATCH | `/announcements` | A, S | |
| POST, PATCH, DELETE | `/admin/classes`, `/admin/classes/{id}` | A, S | Code, name, form, session, DLP, `class_teacher_id` (one class per teacher per year). Delete only if empty |
| POST | `/admin/subjects`, `/admin/subjects/{id}/remove` | A, S | `{name_ms, band}` / `{band}`; band is `lower`, `upper`, `form6` or `all`. Removing keeps existing marks |
| GET | `/admin/privacy-notice` | A, S | Latest notice (draft or published) |
| POST | `/admin/privacy-notice/publish` | S | After this, parents must accept it |
| PATCH | `/admin/assessments/{id}` | A, S | Name, `exam_date`, `is_open`, `is_current` |
| GET | `/admin/audit-logs` | A, S | Filter `q` (user name), `action` |
| GET, POST | `/admin/imports`, `/admin/imports/students` | A, S | CSV upload; returns skipped rows with reasons |
| GET, POST, PATCH | `/admin/users`, `/admin/users/{id}` | A: class teachers. S: all staff | Create returns a one-time password |
| POST | `/admin/users/{id}/reset-password` | as above | |
| PUT | `/admin/settings/school` | S | Name, address, phone, email, office hours |
| PUT | `/admin/settings/coex` | S | All 11 rules plus LMS / credit / Purple thresholds; ranges must cover 0–100 |

## Student CSV import columns

Header row required; Malay headings, any order. Required: `nama`, `kelas` (class code like `1-ANDROMEDA`, or the class name in any spelling: `1 Andromeda`, `1 ZUHRAH DLP`, `PRA U 27 UKM`), `jantina` (L/P or Lelaki/Perempuan).
Optional: `no_pelajar`, `ic`, `tarikh_lahir` (YYYY-MM-DD or DD/MM/YYYY), `kaum`, `agama`, `warganegara` (Y/N), `penjaga`, `ic_penjaga`, `telefon_penjaga`, `emel_penjaga`, `hubungan` (bapa/ibu/penjaga).

Students are matched by `no_pelajar`, then IC, and updated. Guardians are matched by IC, so siblings share one guardian and one login. Excel files: save as CSV (UTF-8) first.
