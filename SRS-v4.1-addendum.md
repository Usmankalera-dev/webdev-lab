# SRS v4.1 — Addendum (15 November 2026)

**Applies to:** SRS v4.0 (WebDev Lab v1.0). This addendum changes FR-10, adds
FR-17 and NFR-11, and records the interface polish pass. Everything else in
SRS v4.0 stays as written.

## What changed and why

The user asked for the interface and the certificates to feel "real". Two
things were not real enough in v4.0:

1. The completion certificate was a print-to-PDF of a web page (browser print
   dialog), not a real PDF file.
2. There was no registration certificate — a student had no document proving
   they had enrolled until they finished the whole course.

## Updated requirements

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-10 (updated) | On finishing the course, a student can download a REAL PDF certificate file (not a print dialog) with their name, course, batch, date and certificate ID `WDL-<access code>` | Must | Done |
| FR-17 (new) | On unlocking the course, a student can download a REAL PDF "Certificate of Registration" with their name, course, batch, registration date and Registration ID `WDL-REG-<access code>` | Must | Done |
| NFR-11 (new) | PDF validity: every downloaded certificate must be a valid PDF (opens in any PDF reader, 1 page, landscape) — verified with `pdfinfo` before release | Must | Done |

## How it works (no server, no library)

- A small pure-JavaScript PDF writer (`site/pdf.js`, no external libraries)
  builds the PDF by hand (standard fonts only) and the browser downloads it
  as a real `.pdf` file.
- Print stays as a secondary option on both certificate pages.
- The registration date is the unlock date (stored in the browser on first
  unlock); the completion date is stored the first time all 23 items are
  complete, so neither date shifts on later visits.
- The certificate ID is the certificate's own number. There is NO
  verification portal and no verification URL anywhere on the site — nothing
  invented.

## Interface polish (same release)

Whole-site premium pass on the dark/amber brand: richer hero (gradient,
stats row, trust line), consistent section headings, module colour dots on
lesson rows, dashboard stat cards (real numbers only), payment method cards
with clear amount, one consistent button style. All element ids and script
hooks unchanged; mobile-first (390 px) checked by CSS structure, the user's
phone is the authority.

*End of SRS v4.1 addendum.*
