<?php

namespace App\Support;

/**
 * Passwords printed on slips: easy to read aloud and type, no 0/O or 1/I/L.
 */
class OneTimePassword
{
    private const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    public static function generate(int $length = 8): string
    {
        $out = '';
        for ($i = 0; $i < $length; $i++) {
            $out .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
        }

        return $out;
    }
}
