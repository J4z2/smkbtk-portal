# SMK Bandar Tasik Kesuma portal: backend

Laravel 13 + MySQL. Serves a JSON API under `/api` for the portal frontend (the HTML/CSS/JS in the repository root). Login uses the web session cookie with CSRF protection, so the frontend must be served from the same domain.

Schema and decisions: [../docs/DATABASE-SCHEMA.md](../docs/DATABASE-SCHEMA.md). API list: [../docs/BACKEND-API.md](../docs/BACKEND-API.md).

## Requirements

- PHP **8.3 or newer** (Laravel 13 does not run on 8.2). Composer is pinned to 8.3 features so the code also runs on 8.4.
- MySQL 8 (or MariaDB 10.6+) with `utf8mb4`.

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Set the `DB_*` values in `.env`, then:

```bash
php artisan migrate --seed
php artisan serve
```

`--seed` loads the reference data (COEx rules, subjects, checkpoints for 2026, draft privacy notice) and, outside production, a demo school.

### Demo logins (local only)

| Role | Login | Password |
|---|---|---|
| Super admin | admin@smkbtk.com | admin123 |
| Admin | pentadbir@smkbtk.com | admin123 |
| Class teacher, 5M | guru@smkbtk.com | guru123 |
| Class teacher, 1A | guru.demo@smkbtk.com | guru123 |
| Parent (2 children, Form 5) | parent@smkbtk.com, or phone 012-888 7312, or IC 800101-01-1234 | parent123 |
| Parent (Forms 1–3) | parent.lower@smkbtk.com | parent123 |
| Parent (Form 4) | parent.form4@smkbtk.com | parent123 |
| Parent (Form 6) | parent.form6@smkbtk.com | parent123 |

The demo seeder refuses to run when `APP_ENV=production`.

## Tests

```bash
php artisan test
```

This uses an in-memory SQLite database. To run the same tests on MySQL (recommended before deploying):

```bash
DB_CONNECTION=mysql DB_DATABASE=smkbtk_testing php artisan test
```

## First production login

There are no demo accounts in production. Create the first super admin on the server:

```bash
php artisan portal:create-super-admin you@example.com "Your Name"
```

It prints a one-time password, which must be changed at first login.

## Settings worth knowing

- `IDENTITY_HASH_KEY` (in `.env`): key for the IC-number hashes used for login and sibling matching. Set it once in production and **never change it**, or IC logins stop working. If unset, `APP_KEY` is used.
- `PORTAL_RETENTION_YEARS`: years to keep a leaver's record before anonymising (default 5).
- Student photos and absence documents are stored in `storage/app/private`, never in the public folder.
