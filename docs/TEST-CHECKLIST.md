# Manual test checklist

Run this on **staging** after each deploy, and once more on the live site before handing out parent slips. The automated tests (`php artisan test`) cover the server rules; this list covers what people actually click.

Last full run: 20 October 2026, local MySQL with the demo data. All steps passed after the fixes listed at the end.

## 1. Language and login

- [ ] Landing page loads with the school logo; the BM/EN button switches the whole page and back.
- [ ] Login works with an email, with a phone number typed as `013-463 7012`, and with an IC typed as `800101-01-1234`.
- [ ] A wrong password shows "Maklumat log masuk tidak sepadan"; after 5 tries the login waits a minute.
- [ ] After logout, the login box is empty.
- [ ] A one-time password forces a password change; a password with no number is refused.

## 2. Teacher → admin → parent (the main flow)

- [ ] **Teacher:** Rekod laporan → choose a student with a draft → change marks and comment → *Hantar untuk semakan*. The form locks.
- [ ] **Admin:** home page shows "N laporan menunggu semakan" → Kelulusan laporan → *Semak* shows the new marks → *Luluskan* → *Terbitkan*.
- [ ] **Parent:** sees only their own children; the dashboard and report show the new marks; *Sahkan telah dibaca* changes to *Telah disahkan*.
- [ ] Before publishing, the parent sees "belum diterbitkan" and no marks.
- [ ] Admin *Kembalikan* sends a report back to draft; the teacher can edit it again.

Database checks (cPanel → phpMyAdmin):
- `reports`: status moves draft → submitted → approved → published, with `submitted_by`, `approved_by`, `published_by` filled.
- `marks`: `grade` and `gear` are filled only after publishing.
- `audit_logs`: one row per step.

## 3. Daily work

- [ ] Parent sends an absence notice; the class teacher sees it on their home page and presses *Terima*.
- [ ] Teacher saves today's attendance (MC with a note, Lewat); the parent's attendance page shows it for the month.
- [ ] Teacher sets targets on Rekod Prestasi Pelajar → Sasaran → *Simpan sasaran*.
- [ ] Teacher opens a meeting slot; parent books it; teacher marks it *Selesai*.

## 4. Admin

- [ ] Register a student with the guardian's name and phone **of an existing parent** → that parent now sees both children (no duplicate guardian).
- [ ] Move class (needs a reason), archive, restore, upload a passport photo.
- [ ] Import a CSV with one bad class code: good rows are imported, the bad row is listed with its reason, re-importing does not duplicate.
- [ ] *Akaun ibu bapa* for a class: slips show usernames as `013-4637012` or `780808-08-8888`; print works.
- [ ] Create a class teacher with a class; a class that already has a teacher can't be picked; the new teacher must change the password at first login and sees only their class.
- [ ] Add and delete an empty class; deleting a class with students is refused.
- [ ] Add and remove a subject.
- [ ] Super admin: change the LMS pass mark and save; a broken Gear range is refused; change an exam date.
- [ ] Record and resolve an intervention.

## 5. Who can see what

- [ ] A teacher cannot open students, reports or attendance of another class.
- [ ] A parent cannot open another family's child.
- [ ] Logged out, every `/api/...` call returns 401.

## 6. Phone and print

- [ ] On a phone (or a narrow browser window), no page scrolls sideways.
- [ ] Parent report → *Cetak laporan* / *Simpan PDF* keeps the colours.

## Bugs found and fixed in the 20 Oct run

1. The previous user's login stayed in the login box after logout (shared school computers). Now cleared.
2. Slips and forms showed phones as `60134637012` and ICs without dashes. Now `013-4637012` and `780808-08-8888`.
3. Error messages from the server could start with a lowercase letter. Now capitalised.
4. The target screen offered "Hantar untuk semakan", which doesn't apply to targets. Now only *Simpan sasaran*.
5. **Registering a sibling without the guardian's IC created a duplicate guardian**, so the parent didn't see the new child and couldn't get a login for them. Guardians are now matched by IC, or by phone and name together, in both the student form and the CSV import.
6. Two English translations were missing (CSV help text, slip footer).
