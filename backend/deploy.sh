#!/usr/bin/env bash
# Update the portal on the server after new commits are pushed.
# Run from the backend folder: bash deploy.sh
set -euo pipefail

PHP="${PHP:-php}"
COMPOSER="${COMPOSER:-composer}"

$PHP artisan down --retry=30 || true
git pull --ff-only
$COMPOSER install --no-dev --optimize-autoloader --no-interaction
$PHP artisan migrate --force
$PHP artisan optimize:clear
$PHP artisan optimize
$PHP artisan up
echo "Deployed $(git log --oneline -1)"
