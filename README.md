# SMK Bandar Tasik Kesuma: student performance portal

A portal for parents, class teachers and school administrators: academic reports with COEx grades and Gears, daily attendance, absence notices, interventions, analytics and school administration. Interface in Bahasa Melayu.

The app is a Laravel 13 + MySQL backend that also serves the portal page:

```text
smk-bandar-tasik-kesuma-portal-v12/
├── backend/                         Laravel app (API + portal page)
│   ├── resources/portal/index.html  The portal page
│   ├── public/assets/app.js         Portal screens and logic (talks to /api)
│   ├── public/assets/styles.css     Portal styles
│   ├── app/, routes/, database/     API, access rules, schema, seeders
│   └── tests/                       Feature and unit tests
└── docs/                            Schema, API, audit, PDPA notice draft
```

## Run it locally

Requirements: PHP 8.3+, Composer, MySQL 8 (or MariaDB 10.6+).

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Open http://127.0.0.1:8000. The demo logins are listed in [backend/README.md](backend/README.md#demo-logins-local-only). They exist only outside production.

## Documents

- [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md): tables, access rules and the decisions behind them
- [docs/BACKEND-API.md](docs/BACKEND-API.md): every API endpoint and who may use it
- [docs/FRONTEND-AUDIT.md](docs/FRONTEND-AUDIT.md): the Phase 0 audit of the v12 prototype and what was fixed
- [docs/PDPA-PRIVACY-NOTICE-DRAFT.md](docs/PDPA-PRIVACY-NOTICE-DRAFT.md): privacy notice for the super admin to review and publish
- [docs/DEPLOY-EXABYTE.md](docs/DEPLOY-EXABYTE.md): step-by-step deployment to Exabyte cPanel (staging first)
- [docs/PROTOTYPE-NOTES.md](docs/PROTOTYPE-NOTES.md), [docs/VERIFICATION.md](docs/VERIFICATION.md): history of the original browser-only prototype

## How it works

After login the page loads one snapshot (`/api/portal/snapshot`) that contains only what that user may see: parents get their own children's published reports, class teachers their own class, admins the whole school. Every change goes to its API endpoint; the server checks permissions, saves to MySQL, writes the audit log, and the page reloads the snapshot.

There is no email at launch. Accounts are handed out on printed slips with one-time passwords that must be changed at first login. Parents can log in with their IC number, phone number or email.

The original browser-only v12 prototype is preserved in git history (commit `97fc05e`).
