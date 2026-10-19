# Packaging verification

Verified on 29 September 2026 against the original v12 file identified in PROTOTYPE-NOTES.md.

## Source integrity

- All **194 named JavaScript functions** are preserved.
- Original and extracted JavaScript syntax trees match exactly after ignoring source positions, raw formatting and comments.
- HTML elements, attributes, inline event handlers and significant text match the original after replacing the embedded stylesheet/script with relative file references.
- All **573 ordered CSS rules** match in the browser CSS parser after normalizing insignificant whitespace and equivalent decimal notation outside quoted strings.
- JavaScript syntax validation passed.
- The original input file's SHA-256 was unchanged after packaging.

## Browser checks

Run in isolated Chrome contexts on macOS, directly through `file://`, with network access disabled and a fixed test clock. No external network requests or uncaught JavaScript errors occurred in the tested workflows.

- Default parent, teacher and super-admin login.
- All **19 navigation views**, with matching rendered text and modal state compared with v12.
- **Nine pixel-identical screenshot comparisons:** desktop landing, desktop login, parent/teacher/admin home views, mobile landing, mobile login, mobile parent home and the open mobile menu. Desktop viewport: 1440 × 1000; mobile viewport: 390 × 844. SVG animations were frozen only in the test harness to compare the same animation frame.
- Parent profile edit persisted after page reload.
- Teacher report mark edit and submission.
- Admin report approval followed by publication; publication persisted after reload.
- JSON download produced the original export filename and a valid dataset.
- CSV upload/import added the test student through the existing import workflow.
- The resulting application data matched between original and extracted versions after the same interactions.

These are source-preservation and smoke checks, not an exhaustive audit of every data combination, browser, accessibility requirement or production security concern. Existing prototype limitations are documented in PROTOTYPE-NOTES.md and have not been redesigned in this extraction.

## Archive checks

The ZIP contains one root folder with the complete source package. Every archived file was compared byte-for-byte with its source file, and ZIP CRC validation passed. No local browser data, temporary tooling, screenshots or original project files are included.
