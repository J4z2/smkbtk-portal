<?php

namespace App\Support;

/**
 * Normalises and hashes the identifiers people log in with.
 */
class Identity
{
    /**
     * IC / MyKid: keep letters and digits only, upper-case (passports may have letters).
     */
    public static function normalizeIc(?string $ic): ?string
    {
        $value = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string) $ic));

        return $value === '' ? null : $value;
    }

    /**
     * Phone: digits only, Malaysian local numbers converted to 60XXXXXXXXX.
     */
    public static function normalizePhone(?string $phone): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $phone);
        if ($digits === '') {
            return null;
        }

        return str_starts_with($digits, '0') ? '6'.$digits : $digits;
    }

    /**
     * Phone as people write it: 60123456789 → 012-3456789.
     */
    public static function displayPhone(?string $phone): ?string
    {
        if (! $phone) {
            return $phone;
        }
        $local = str_starts_with($phone, '60') ? '0'.substr($phone, 2) : $phone;

        return strlen($local) >= 10 ? substr($local, 0, 3).'-'.substr($local, 3) : $local;
    }

    /**
     * MyKad as printed: 780808088888 → 780808-08-8888. Other IDs unchanged.
     */
    public static function displayIc(?string $ic): ?string
    {
        return $ic && preg_match('/^\d{12}$/', $ic) ? substr($ic, 0, 6).'-'.substr($ic, 6, 2).'-'.substr($ic, 8) : $ic;
    }

    public static function hashIc(?string $ic): ?string
    {
        $value = self::normalizeIc($ic);

        return $value === null ? null : hash_hmac('sha256', $value, (string) config('portal.identity_key'));
    }

    /**
     * Columns a login identifier could match. A 12-digit number starting
     * with 60 may be a phone number or the IC of someone born in 1960, so
     * digits are checked against both phone and IC.
     *
     * @return array<string, string> column => value
     */
    public static function loginCandidates(string $login): array
    {
        $login = trim($login);
        if ($login === '') {
            return [];
        }
        if (str_contains($login, '@')) {
            return ['email' => strtolower($login)];
        }

        return array_filter([
            'ic_hash' => self::hashIc($login),
            'phone' => preg_match('/^[\d\s\-+]+$/', $login) ? self::normalizePhone($login) : null,
        ]);
    }
}
