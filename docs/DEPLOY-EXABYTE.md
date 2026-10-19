# Deploying to Exabyte (smkbtk.com)

For the ebiz17 AI Pro plan (cPanel with SSH). Nothing here has been run yet: follow it step by step, and do the whole thing on **staging.smkbtk.com** first.

## 0. What the server needs

- **PHP 8.3 or 8.4** for the domain (cPanel → *MultiPHP Manager* or *Select PHP Version*). Laravel 13 does not run on 8.2.
- PHP extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`, `bcmath`, `curl`, `zip`. Usually on by default.
- PHP `memory_limit` of at least 256M. A full-school admin page uses about 45 MB.
- A MySQL database. Exabyte gives MySQL or MariaDB; both work.

## 1. Database (cPanel → MySQL Databases)

1. Create a database, e.g. `cpuser_smkbtk` (cPanel adds your username as a prefix).
2. Create a user with a long random password.
3. Add the user to the database with **All Privileges**.

For staging, create a separate `cpuser_smkbtk_staging` database and user.

## 2. Get the code onto the server (SSH)

The repository is private, so the server needs a read-only **deploy key**:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/smkbtk_deploy -N ""
cat ~/.ssh/smkbtk_deploy.pub
```

Add that public key on GitHub: repository → *Settings* → *Deploy keys* → *Add deploy key* (leave "Allow write access" off). Then:

```bash
cat >> ~/.ssh/config <<'CFG'
Host github-smkbtk
  HostName github.com
  IdentityFile ~/.ssh/smkbtk_deploy
CFG
git clone git@github-smkbtk:J4z2/smkbtk-portal.git ~/smkbtk
cd ~/smkbtk/backend
```

Keep the app **outside** `public_html`. Only `backend/public` is served to the web.

## 3. Install

If `composer` is not available on the server:

```bash
cd ~ && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php && rm composer-setup.php
# then use: php ~/composer.phar
```

```bash
cd ~/smkbtk/backend
composer install --no-dev --optimize-autoloader
cp .env.production.example .env
php artisan key:generate
openssl rand -hex 32        # paste into IDENTITY_HASH_KEY in .env
nano .env                   # DB_DATABASE, DB_USERNAME, DB_PASSWORD, APP_URL
```

**Back up `.env` somewhere safe** (for example a password manager). `APP_KEY` decrypts the stored IC numbers, and `IDENTITY_HASH_KEY` is needed for IC logins. If either is lost, IC logins stop working and stored IC numbers cannot be read.

```bash
php artisan migrate --force
php artisan db:seed --class=ReferenceDataSeeder --force
php artisan portal:create-super-admin you@example.com "Your Name"
php artisan optimize
chmod -R 775 storage bootstrap/cache
```

Never run `php artisan db:seed` without `--class=ReferenceDataSeeder` in production. The demo seeder refuses to run when `APP_ENV=production`, but don't rely on that.

## 4. Point the domain at `backend/public`

**Option A (preferred):** cPanel → *Domains* → smkbtk.com → *Manage*, and set the document root to `smkbtk/backend/public`.

**Option B:** if the main domain's root can't be changed, replace `public_html` with a link:

```bash
mv ~/public_html ~/public_html.old
ln -s ~/smkbtk/backend/public ~/public_html
```

For staging, create the subdomain `staging.smkbtk.com` with its document root at the staging copy's `backend/public`.

## 5. HTTPS

1. cPanel → *SSL/TLS Status* → run **AutoSSL** for smkbtk.com and staging.smkbtk.com.
2. Force HTTPS: add these lines at the top of `backend/public/.htaccess`, inside `<IfModule mod_rewrite.c>` after `RewriteEngine On`:

```apache
    RewriteCond %{HTTPS} !=on
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

`SESSION_SECURE_COOKIE=true` in `.env` means logins only work over HTTPS.

## 6. Cron (cPanel → Cron Jobs)

Once a minute, so the daily PDPA retention job runs at 02:00:

```
* * * * * cd ~/smkbtk/backend && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

Use the PHP binary of the version you selected. On Exabyte/cPanel this is often `/opt/cpanel/ea-php83/root/usr/bin/php`. Check with `which php` over SSH.

## 7. Staging protection

cPanel → *Directory Privacy* → the staging folder (`backend/public` of the staging copy) → turn on password protection and add a user. Only people with that password reach the staging login page.

## 8. First day checklist

1. Log in as the super admin and change the one-time password.
2. **Data sekolah:** fill in address, phone, email and office hours.
3. **Akaun kakitangan:** create class teachers and admins, then assign each class teacher a class.
4. **Data sekolah:** create the classes for the year if the import doesn't, then check subjects per form.
5. **Pelajar & penjaga → Import spreadsheet:** upload the school's CSV and fix any skipped rows.
6. **Tetapan COEx:** check rules, exam dates, and which checkpoint is open.
7. **Audit & privasi:** fill in the [placeholders] in the privacy notice (in `resources/privacy/`, then redeploy), then publish it.
8. Class teachers: **Pelajar saya → Cipta akaun ibu bapa**, print the slips and hand them to parents.

## 9. Updating after new commits

```bash
cd ~/smkbtk/backend
bash deploy.sh
```

This puts the site into maintenance mode, pulls, installs, migrates, rebuilds caches and brings the site back. If the server's PHP or Composer is not on the PATH, run it as `PHP=/path/to/php COMPOSER="php ~/composer.phar" bash deploy.sh`.

## 10. If something goes wrong

- Blank page or "Server Error": read `backend/storage/logs/laravel-YYYY-MM-DD.log`.
- "419" or "Sesi tamat" on login: check `APP_URL` and that the site is opened over https.
- After changing `.env`: run `php artisan optimize:clear && php artisan optimize`.
- Never set `APP_DEBUG=true` on the live site: it shows secrets in error pages.
