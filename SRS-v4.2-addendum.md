# SRS v4.2 — Addendum (15 November 2026)

**Applies to:** SRS v4.0 + v4.1 addendum (WebDev Lab v1.0). This addendum records
the certificate redesign and the interface "real touch" pass. Everything else
stays as written.

## Why

The first real-PDF certificates (v4.1) were valid files but still looked plain
and fake to the user: white page, thin border, plain Times text. A real
certificate from a real institution has a designed layout — logo, ornamental
border, seal, signature and watermark.

## Certificate design (both types, both on-screen and PDF)

- Paper: ivory background, A4 landscape.
- Colours: deep navy + gold.
- Ornamental double border with corner flourishes.
- Top: circular "WL" logo monogram + "WEBDEV LAB" in spaced capitals + tagline.
- Title in large letter-spaced capitals.
- Student name large in an elegant italic face, gold underline.
- Bottom row: date (left), round seal (centre, "WEBDEV LAB • EST. 2026 •"
  around the rim, star in the middle), signature (right).
- Faint diagonal "WEBDEV LAB" watermark across the page.
- Certificate/Registration ID stays (`WDL-<code>` / `WDL-REG-<code>`).
- No verification portal, QR code or verification URL is invented anywhere.

## Interface "real touch" (same release)

- Hero: CSS-only browser mockup showing real course content (a Lesson 1 code
  snippet + its rendered preview) — no external images.
- "See inside the course" strip: 3 cards with REAL code snippets from real
  lessons (HTML Lesson 1, CSS Flexbox, JS Functions).
- Smooth transitions/hover, gentle hero fade-in, complete footer
  (brand, quick links, WhatsApp contact, Batch 1 date).
- No invented testimonials, counts or results.

*End of SRS v4.2 addendum.*
