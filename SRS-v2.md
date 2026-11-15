# Software Requirements Specification (SRS) — WebDev Lab
## Version 2.0 — 15 November 2026 (Loop 2, Week 2)

**Project:** WebDev Lab — Learn HTML, CSS & JavaScript by doing
**Author:** Muhammad Usman (Usman Kalera), BS Artificial Intelligence, Superior University Lahore
**Method:** Spiral Model — this SRS covers Loop 2 (Weeks 3–4) and will be updated every loop
**Status:** Draft for review

### Version history
| Version | Date | Loop | Change |
|---|---|---|---|
| 1.0 | 15 Nov 2026 | Loop 1 | First version: sales page, free lessons, waitlist |
| 2.0 | 15 Nov 2026 | Loop 2 | Enrollment + payment flow, access codes, student dashboard |

---

## 1. Introduction

### 1.1 Purpose
This document describes the requirements for WebDev Lab, an interactive website
that teaches HTML, CSS and JavaScript through hands-on practice, and earns money
through paid enrollments (Batch system, JazzCash/Easypaisa payments).

### 1.2 Scope
Version 2.0 adds the complete enrollment flow: enroll form, payment
instructions, manual payment verification, access-code unlock, and the student
dashboard. The live code editor, quizzes, certificates and full course content
are built in Loops 3–4 (see the project plan).

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
by the Admin on WhatsApp. Access codes are a fixed list in the site's code;
one-time use is tracked in the browser, and the Admin's own sheet is the real
record of which code belongs to which student.

### 2.2 User classes
| User | What they do |
|---|---|
| Visitor | Reads free lessons, views the course and price, joins the waitlist, enrolls |
| Student | Unlocks the course with an access code, takes quizzes, uses the editor, downloads the certificate |
| Admin | Verifies payments, issues access codes, manages batches |

### 2.3 Operating environment
Modern browsers (Chrome, Edge, Firefox) on mobile and desktop. No login, no
app install, no account needed for free lessons.

### 2.4 Constraints
- Hosting must be free (GitHub Pages).
- No payment gateway in v2 — manual verification only.
- No user accounts or database in v2.
- All pages must work on a phone (most students use phones).
- Payment numbers on the site must be exactly correct (a wrong number means lost money).

### 2.5 Assumptions
- Students have WhatsApp (for payment proof and support).
- The Admin checks every payment screenshot in the JazzCash/Easypaisa app
  before issuing any access code.
- One access code belongs to one student; sharing a code can block access.

---

## 3. Functional requirements

| ID | Requirement | Priority | Status in v2.0 |
|---|---|---|---|
| FR-01 | The home page shows the course, roadmap, price, batch date and seats | Must | Done (Loop 1) |
| FR-02 | 3 HTML lessons are free and open to every visitor | Must | Done (Loop 1) |
| FR-03 | The full lesson list (23 items) is visible; unpaid lessons show a lock | Must | Done (Loop 1) |
| FR-04 | A waitlist form collects name + WhatsApp number and confirms submission | Must | Done (Loop 1) |
| FR-05 | The enroll flow shows JazzCash/Easypaisa payment instructions and the exact amount | Must | **Done (Loop 2)** |
| FR-06 | A student can enter an access code to unlock the full course | Must | **Done (Loop 2)** |
| FR-07 | A student dashboard shows progress, unlocked lessons and certificate status | Must | **Done (Loop 2)** |
| FR-08 | Every lesson has a quiz with instant score and explanation | Must | Planned (Loop 3) |
| FR-09 | A live code editor (HTML/CSS/JS tabs) shows instant preview in a sandboxed iframe | Must | Planned (Loop 3) |
| FR-10 | On finishing the course, a student can download a PDF certificate with their name | Must | Planned (Loop 4) |
| FR-11 | The site has a dark/light mode toggle, saved in the browser | Should | Done (Loop 1) |
| FR-12 | Lessons can be searched by name | Should | Planned (Loop 4) |
| FR-13 | Students can contact support through a WhatsApp button | Should | Done (Loop 1) |
| FR-14 | The site shows real testimonials (added after Batch 1) | Should | Planned (Loop 4) |

## 4. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page load time | Under 2 seconds on normal mobile internet |
| NFR-02 | Responsive design | Usable at 390 px (phone) and 1280 px (desktop) |
| NFR-03 | Browser support | Chrome, Edge, Firefox (latest versions) |
| NFR-04 | Editor safety | User code runs only inside a sandboxed iframe |
| NFR-05 | Usability | A new visitor reaches Lesson 1 in under 30 seconds; enrollment takes under 2 minutes |
| NFR-06 | Reliability | No broken links; every page returns 200 |
| NFR-07 | Payment clarity | Payment number and amount are correct and unmistakable |
| NFR-08 | Access-code safety | A wrong or already-used code shows a clear error; a valid code unlocks immediately |

---

## 5. Use cases

Diagram: `use-case-diagram.svg` (same folder, from SRS v1.0 — still valid).

| ID | Use case | Actor | Main flow | Status in v2.0 |
|---|---|---|---|---|
| UC-01 | View free lessons | Visitor | Opens a free lesson, reads it, tries the example | Done |
| UC-02 | Join waitlist | Visitor | Fills name + WhatsApp, submits, sees confirmation | Done |
| UC-03 | Enroll and pay | Visitor | Fills enroll form, sees payment instructions, pays, sends screenshot on WhatsApp | **Done** |
| UC-04 | Verify payment | Admin | Checks the payment in JazzCash/Easypaisa app | **Done (manual)** |
| UC-05 | Issue access code | Admin | Sends a unique code to the student on WhatsApp | **Done (manual)** |
| UC-06 | Enter access code | Student | Enters the code once; full course unlocks | **Done** |
| UC-07 | Take quiz | Student | Answers questions, sees instant score | Planned (Loop 3) |
| UC-08 | Use code editor | Student | Writes HTML/CSS/JS, sees live preview | Planned (Loop 3) |
| UC-09 | Track progress | Student | Sees completed lessons and progress bar | **Done (dashboard)** |
| UC-10 | Download certificate | Student | Finishes the course, downloads PDF certificate | Planned (Loop 4) |

---

## 6. Sequence diagrams (Loop 2 flows)

### 6.1 Enrollment and payment flow

```mermaid
sequenceDiagram
    actor V as Visitor
    participant S as Site (enroll.html)
    participant W as WhatsApp
    actor A as Admin (Usman)
    V->>S: Fill enroll form (name, WhatsApp, plan)
    S->>S: Save enrollment in browser (localStorage)
    S->>V: Show payment instructions (JazzCash/Easypaisa + exact amount)
    V->>W: Send payment screenshot
    A->>A: Verify payment in JazzCash/Easypaisa app
    A->>V: Send access code on WhatsApp
    V->>S: Enter access code (unlock.html)
    S->>S: Validate code (in list + not used)
    S->>V: Full course unlocked + dashboard
```

### 6.2 Access-code validation (detail)

```mermaid
sequenceDiagram
    actor St as Student
    participant U as unlock.html
    participant C as Code list (script.js)
    participant L as Browser storage
    St->>U: Enter code + name
    U->>U: Normalize code (uppercase, remove spaces/dashes)
    U->>C: Is the code in the Batch 1 list (WEB-1001..WEB-1020)?
    alt Code not in list
        U->>St: Error: code is not valid
    else Code in list
        U->>L: Is the code already used?
        alt Already used
            U->>St: Error: code already used
        else Not used
            U->>L: Save access + mark code used
            U->>St: Success: course unlocked, open dashboard
        end
    end
```

---

## 7. Data (v2 — browser only)

| Data | Stored where | Notes |
|---|---|---|
| Waitlist entries | Browser localStorage (+ WhatsApp message) | Name + WhatsApp number |
| Enrollment | Browser localStorage | Name, WhatsApp, email, plan, amount, date |
| Access codes | `script.js` list (WEB-1001..WEB-1020) + Admin's sheet | One code per student; sheet is the real record |
| Used codes | Browser localStorage | Per-device only — Admin's sheet is the authority |
| Lesson progress | Browser localStorage | Which lessons are complete |
| Payment proof | WhatsApp chat | Screenshot checked in the payment app |

No personal data is sent to any server by this website in v2.

---

## 8. Future scope (after v2.0)

- Loops 3–4: full course content, quizzes, live code editor, certificates, search, testimonials
- Later: user accounts and automatic payment verification (payment gateway)
- Video lessons and a student community group; referral discounts

---

*End of SRS v2.0 — to be reviewed after Loop 2 and updated in Loop 3.*
