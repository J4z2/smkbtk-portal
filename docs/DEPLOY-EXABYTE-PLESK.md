# Deploying to Exabyte with Plesk (from GitHub)

For Exabyte hosting managed with **Plesk**. Do everything on **staging.smkbtk.com** first, then repeat for smkbtk.com.

Layout used below: the GitHub repository is cloned to a folder **outside** the web folder, and only `backend/public` is served.

```text
/var/www/vhosts/smkbtk.com/
├── httpdocs/          (Plesk default, not used)
└── smkbtk/            ← GitHub repository
    ├── backend/       ← Laravel app (artisan, .env, vendor/)
    │   └── public/    ← document root
    └── docs/
```

Plesk menus differ a little between versions. Where a name doesn't match, look in **Websites & Domains → smkbtk.com**.

**Paths:** below, `/var/www/vhosts/smkbtk.com` is the usual Plesk home folder. On the Exabyte server it is **`/home/smkbtk.com`** (check with `pwd` after logging in over SSH), so use that wherever this guide says `/var/www/vhosts/smkbtk.com`. Over SSH, plain `php` is PHP 8.1 on Exabyte, which is too old ("Composer detected issues in your platform"). Always use the full path `/opt/plesk/php/8.3/bin/php`, the same version as the website's PHP setting.

## 1. PHP version

Websites & Domains → smkbtk.com → **PHP** (or *PHP Settings*):

- PHP version: **8.3 or 8.4**, FPM. Laravel 13 does not run on 8.2.
- `memory_limit`: **256M** or more.
- Leave the default extensions on. Laravel needs `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`, `bcmath`, `curl`, `zip`.

Note the PHP path for later. Over SSH, `ls /opt/plesk/php/` lists the versions; the binary is `/opt/plesk/php/8.3/bin/php` (or `8.4`).

## 2. Database

Websites & Domains → **Databases → Add Database**:

- Database name: e.g. `smkbtk`
- Create a user with a long random password and keep it somewhere safe.
- Note the host. It is usually `localhost`.

For staging, create a separate `smkbtk_staging` database and user.

## 3. Connect GitHub (Git in Plesk)

Websites & Domains → **Git → Add Repository**:

1. **Remote Git hosting**, Repository URL: `git@github.com:J4z2/smkbtk-portal.git`
2. Plesk shows an **SSH public key**. Copy it and add it on GitHub: repository → *Settings* → *Deploy keys* → *Add deploy key*. Name it "Exabyte Plesk" and leave "Allow write access" off.
3. Back in Plesk:
   - Deployment mode: **Manual**. You click *Deploy* when you want an update, which is safer than updating on every push.
   - Server path / deployment path: **`/smkbtk`** (not `/httpdocs`).
   - Branch: `main`.
4. Click **OK**, then **Pull updates** and **Deploy**. The files appear in `/var/www/vhosts/smkbtk.com/smkbtk`.

## 4. Point the domain at Laravel's public folder

Websites & Domains → smkbtk.com → **Hosting Settings** (or *Hosting & DNS → Hosting*):

- Document root: **`smkbtk/backend/public`**

The `.htaccess` in `backend/public` is used automatically while Plesk runs PHP through Apache (the default: nginx in front, Apache behind). If your plan serves PHP through **nginx only**, add this under **Apache & nginx Settings → Additional nginx directives**:

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## 5. First-time setup (SSH, once)

Websites & Domains → **SSH Access** (or *Web Hosting Access*): make sure SSH is allowed (`/bin/bash`). Then log in and run the steps below. Replace `8.3` with your version.

```bash
cd /var/www/vhosts/smkbtk.com/smkbtk/backend
PHP=/opt/plesk/php/8.3/bin/php

# Composer (if `composer` is not already available)
$PHP -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
$PHP composer-setup.php --install-dir=$HOME --filename=composer.phar && rm composer-setup.php

$PHP ~/composer.phar install --no-dev --optimize-autoloader
cp .env.production.example .env
$PHP artisan key:generate
openssl rand -hex 32          # copy the output into IDENTITY_HASH_KEY in .env
nano .env                     # DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, APP_URL
$PHP artisan migrate --force
$PHP artisan db:seed --class=ReferenceDataSeeder --force
$PHP artisan portal:create-super-admin you@example.com "Your Name"
$PHP artisan optimize
chmod -R 775 storage bootstrap/cache
```

For staging, set `APP_URL=https://staging.smkbtk.com` in its `.env`.

**Back up the `.env` file** (for example in a password manager). `APP_KEY` decrypts the stored IC numbers, and `IDENTITY_HASH_KEY` is needed for IC logins; if either is lost, IC logins stop working. `.env` is not in GitHub, so Plesk deployments never overwrite it.

Never run `php artisan db:seed` on its own in production. The demo seeder refuses to run when `APP_ENV=production`, but use only `--class=ReferenceDataSeeder` anyway.

## 6. Run Laravel's commands on every deploy

Git → the repository → **Repository settings** → turn on **Enable additional deployment actions** and paste:

```bash
cd backend
/opt/plesk/php/8.3/bin/php ~/composer.phar install --no-dev --optimize-autoloader --no-interaction
/opt/plesk/php/8.3/bin/php artisan migrate --force
/opt/plesk/php/8.3/bin/php artisan optimize:clear
/opt/plesk/php/8.3/bin/php artisan optimize
```

From now on, **updating = push to GitHub, then Plesk → Git → Pull updates → Deploy.**

## 6b. Check debug mode is off

Open `https://smkbtk.com/api/nonexistent`. It must show only a short "not found" message. If it shows `file`, `line` or `trace`, set `APP_ENV=production` and `APP_DEBUG=false` in `.env`, then run `php artisan optimize:clear && php artisan optimize`. Run those two commands after **every** `.env` change.

## 7. HTTPS

1. Websites & Domains → **SSL/TLS Certificates** → **Let's Encrypt** → issue for smkbtk.com and www.smkbtk.com (and staging.smkbtk.com).
2. Hosting Settings → turn on **Permanent SEO-safe 301 redirect from HTTP to HTTPS**.

`SESSION_SECURE_COOKIE=true` in `.env` means logins only work over HTTPS.

## 8. Scheduled task (PDPA retention job)

Websites & Domains → **Scheduled Tasks → Add Task**:

- Task type: **Run a command**
- Command: `cd /var/www/vhosts/smkbtk.com/smkbtk/backend && /opt/plesk/php/8.3/bin/php artisan schedule:run`
- Run: **Cron style**, `* * * * *` (every minute; Laravel decides what actually runs)
- Notify: on errors only

## 9. Staging protection

For staging.smkbtk.com: Websites & Domains → staging → **Password-Protected Directories** → protect `/` and add a user. Only people with that password reach the staging login page.

## 10. Check it works

1. Open https://smkbtk.com: the landing page with the school logo appears.
2. https://smkbtk.com/up should show a green "Application up" page.
3. Log in as the super admin and change the one-time password.
4. Go through [TEST-CHECKLIST.md](TEST-CHECKLIST.md).

## If something goes wrong

| Problem | Where to look |
|---|---|
| "500 Server Error" or blank page | `backend/storage/logs/laravel-YYYY-MM-DD.log`, or Plesk → **Logs** |
| Folder listing or "403 Forbidden" | Document root must be `smkbtk/backend/public` |
| 404 on every page except `/` | nginx-only PHP: add the nginx directive in step 4 |
| "419" / "Sesi tamat" on login | `APP_URL` must match the address, and the site must be opened over https |
| Deploy action fails | Check the PHP path (`ls /opt/plesk/php/`) and that `~/composer.phar` exists |
| Changed `.env` but nothing changed | `php artisan optimize:clear && php artisan optimize` |

Never set `APP_DEBUG=true` on the live site: error pages would show passwords and keys.

## Using Plesk's "Laravel Toolkit" instead

Some Plesk plans have a **Laravel** item in the menu (Laravel Toolkit). It runs Composer, Artisan and the scheduler with buttons. It expects Laravel at the top of the repository, but here it is in `backend/`, so the Git and SSH method above is the safe choice. If your plan has the Toolkit and you'd prefer it, the repository can be rearranged so Laravel sits at the top.
