-- 60 classes for the 2026 school year, from the enrolment sheet
-- ("ENROLMENT GURU, AKP DAN MURID 2026", updated 29/9/2026).
-- Run once in phpMyAdmin (SQL tab). Safe to run again: existing codes are skipped.
-- Class teachers are assigned in the portal (Akaun kakitangan), not here.

SET @year = (SELECT id FROM academic_years WHERE year = 2026);

INSERT IGNORE INTO classes
  (academic_year_id, form, form6_stage, name, code, is_dlp, session, created_at, updated_at)
VALUES
(@year, 1, NULL, '1 Andromeda', '1-ANDROMEDA', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Bumi', '1-BUMI', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Centaurus', '1-CENTAURUS', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Magellan', '1-MAGELLAN', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Marikh', '1-MARIKH', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Musytari', '1-MUSYTARI', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Neptun', '1-NEPTUN', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Phoenix', '1-PHOENIX', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Uranus', '1-URANUS', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Utarid', '1-UTARID', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Zuhal', '1-ZUHAL', 0, 'pagi', NOW(), NOW()),
(@year, 1, NULL, '1 Zuhrah DLP', '1-ZUHRAH', 1, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Andromeda', '2-ANDROMEDA', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Bumi', '2-BUMI', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Centaurus', '2-CENTAURUS', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Magellan', '2-MAGELLAN', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Marikh', '2-MARIKH', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Musytari', '2-MUSYTARI', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Neptun', '2-NEPTUN', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Phoenix', '2-PHOENIX', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Uranus', '2-URANUS', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Utarid', '2-UTARID', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Zuhal', '2-ZUHAL', 0, 'pagi', NOW(), NOW()),
(@year, 2, NULL, '2 Zuhrah DLP', '2-ZUHRAH', 1, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Andromeda', '3-ANDROMEDA', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Bumi', '3-BUMI', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Centaurus', '3-CENTAURUS', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Magellan', '3-MAGELLAN', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Marikh', '3-MARIKH', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Musytari', '3-MUSYTARI', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Neptun', '3-NEPTUN', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Phoenix', '3-PHOENIX', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Uranus', '3-URANUS', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Utarid', '3-UTARID', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Zuhal', '3-ZUHAL', 0, 'pagi', NOW(), NOW()),
(@year, 3, NULL, '3 Zuhrah DLP', '3-ZUHRAH', 1, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Andromeda', '4-ANDROMEDA', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Bumi', '4-BUMI', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Magellan', '4-MAGELLAN', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Marikh', '4-MARIKH', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Musytari', '4-MUSYTARI', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Neptun', '4-NEPTUN', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Uranus', '4-URANUS', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Utarid DLP', '4-UTARID', 1, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Zuhal', '4-ZUHAL', 0, 'pagi', NOW(), NOW()),
(@year, 4, NULL, '4 Zuhrah', '4-ZUHRAH', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Andromeda', '5-ANDROMEDA', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Bumi', '5-BUMI', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Magellan', '5-MAGELLAN', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Marikh', '5-MARIKH', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Musytari', '5-MUSYTARI', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Neptun', '5-NEPTUN', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Uranus', '5-URANUS', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Utarid DLP', '5-UTARID', 1, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Zuhal', '5-ZUHAL', 0, 'pagi', NOW(), NOW()),
(@year, 5, NULL, '5 Zuhrah', '5-ZUHRAH', 0, 'pagi', NOW(), NOW()),
(@year, 6, 'bawah', 'PRA U 27 UKM', 'PRAU27-UKM', 0, 'pagi', NOW(), NOW()),
(@year, 6, 'bawah', 'PRA U 27 UM', 'PRAU27-UM', 0, 'pagi', NOW(), NOW()),
(@year, 6, 'atas', 'PRA U 26 UKM', 'PRAU26-UKM', 0, 'pagi', NOW(), NOW()),
(@year, 6, 'atas', 'PRA U 26 UM', 'PRAU26-UM', 0, 'pagi', NOW(), NOW());

-- Check: should show 12, 12, 12, 10, 10, 4
SELECT form, COUNT(*) AS classes FROM classes WHERE academic_year_id = @year GROUP BY form;
