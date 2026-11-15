# Software Requirements Specification (SRS) — WebDev Lab
## Version 1.0 — 15 November 2026 (Loop 1, Week 1)

**Project:** WebDev Lab — Learn HTML, CSS & JavaScript by doing
**Author:** Muhammad Usman (Usman Kalera), BS Artificial Intelligence, Superior University Lahore
**Method:** Spiral Model — this SRS covers Loop 1 (Weeks 1–2) and will be updated every loop
**Status:** Draft for review

---

## 1. Introduction

### 1.1 Purpose
This document describes the requirements for WebDev Lab, an interactive website
that teaches HTML, CSS and JavaScript through hands-on practice, and earns money
through paid enrollments (Batch system, JazzCash/Easypaisa payments).

### 1.2 Scope
Version 1.0 covers: a public sales/landing page, 3 free preview lessons, the
full lesson list (23 items), a waitlist form, and the enrollment + payment flow
design. The live code editor, quizzes, certificates and full course content are
built in Loops 2–4 (see the project plan).

### 1.3 Intended audience
Students in Pakistan (school, college and university) who want to learn web
development in English with practical examples. No prior experience is assumed.

### 1.4 Definitions
- **Visitor:** anyone who opens the site without enrolling.
- **Student:** a person who paid and received an access code.
- **Admin:** Muhammad Usman — verifies payments and issues access codes.
- **Access code:** a one-time code (e.g. `WEB-1001`) that unlocks the full course.
- **Batch:** a group of students starting together (Batch 1: 1 December 2026, 20 seats).

---

## 2. Overall description

### 2.1 Product perspective
A static website (HTML + CSS + JavaScript, no server backend) hosted free on
GitHub Pages. Progress is saved in the visitor's browser (localStorage).
Payments are made outside the site (JazzCash/Easypaisa) and verified manually
by the Admin on WhatsApp.

### 2.2 User classes
| User | What they do |
|---|---|
| Visitor | Reads free lessons, views the course and price, joins the waitlist |
| Student | Unlocks the course with an access code, takes quizzes, uses the editor, downloads the certificate |
| Admin | Verifies payments, issues access codes, manages batches |

### 2.3 Operating environment
Modern browsers (Chrome, Edge, Firefox) on mobile and desktop. No login, no
app install, no account needed for free lessons.

### 2.4 Constraints
- Hosting must be free (GitHub Pages).
- No payment gateway in v1 — manual verification only.
- No user accounts or database in v1.
- All pages must work on a phone (most students use phones).

### 2.5 Assumptions
- Students have WhatsApp (for payment proof and support).
- The Admin checks payment screenshots in the JazzCash/Easypaisa app before
  issuing any access code.

---

## 3. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The home page shows the course, roadmap, price, batch date and seats | Must |
| FR-02 | 3 HTML lessons are free and open to every visitor | Must |
| FR-03 | The full lesson list (23 items) is visible; unpaid lessons show a lock | Must |
| FR-04 | A waitlist form collects name + WhatsApp number and confirms submission | Must |
| FR-05 | The enroll flow shows JazzCash/Easypaisa payment instructions and the exact amount | Must |
| FR-06 | A student can enter an access code to unlock the full course | Must |
| FR-07 | A student dashboard shows progress, unlocked lessons and certificate status | Must |
| FR-08 | Every lesson has a quiz with instant score and explanation | Must |
| FR-09 | A live code editor (HTML/CSS/JS tabs) shows instant preview in a sandboxed iframe | Must |
| FR-10 | On finishing the course, a student can download a PDF certificate with their name | Must |
| FR-11 | The site has a dark/light mode toggle, saved in the browser | Should |
| FR-12 | Lessons can be searched by name | Should |
| FR-13 | Students can contact support through a WhatsApp button | Should |
| FR-14 | The site shows real testimonials (added after Batch 1) | Should |

## 4. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page load time | Under 2 seconds on normal mobile internet |
| NFR-02 | Responsive design | Usable at 390 px (phone) and 1280 px (desktop) |
| NFR-03 | Browser support | Chrome, Edge, Firefox (latest versions) |
| NFR-04 | Editor safety | User code runs only inside a sandboxed iframe |
| NFR-05 | Usability | A new visitor reaches Lesson 1 in under 30 seconds |
| NFR-06 | Reliability | No broken links; every page returns 200 |
| NFR-07 | Payment clarity | Payment number and amount are correct and unmistakable |

---

## 5. Use cases

Diagram: `use-case-diagram.svg` (same folder).

| ID | Use case | Actor | Main flow |
|---|---|---|---|
| UC-01 | View free lessons | Visitor | Opens a free lesson, reads it, tries the example |
| UC-02 | Join waitlist | Visitor | Fills name + WhatsApp, submits, sees confirmation |
| UC-03 | Enroll and pay | Visitor | Fills enroll form, sees payment instructions, pays, sends screenshot on WhatsApp |
| UC-04 | Verify payment | Admin | Checks the payment in JazzCash/Easypaisa app |
| UC-05 | Issue access code | Admin | Sends a unique code to the student on WhatsApp |
| UC-06 | Enter access code | Student | Enters the code once; full course unlocks |
| UC-07 | Take quiz | Student | Answers questions, sees instant score |
| UC-08 | Use code editor | Student | Writes HTML/CSS/JS, sees live preview |
| UC-09 | Track progress | Student | Sees completed lessons and progress bar |
| UC-10 | Download certificate | Student | Finishes the course, downloads PDF certificate |

---

## 6. Data (v1 — browser only)

| Data | Stored where | Notes |
|---|---|---|
| Waitlist entries | Browser localStorage (+ WhatsApp message) | Name + WhatsApp number |
| Lesson progress | Browser localStorage | Which lessons are complete |
| Access codes | Admin's own sheet | Code, student name, WhatsApp, date, batch |
| Payment proof | WhatsApp chat | Screenshot checked in the payment app |

No personal data is sent to any server by this website in v1.

---

## 7. Future scope (after v1.0)

- User accounts and automatic payment verification (payment gateway)
- Video lessons and a student community group
- Referral discounts and more batches

---

*End of SRS v1.0 — to be reviewed after Loop 1 and updated in Loop 2.*
