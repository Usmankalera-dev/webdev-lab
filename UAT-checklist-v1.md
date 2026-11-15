# WebDev Lab — UAT Checklist (v1.0, Loop 4)

User Acceptance Testing for Batch 1 launch. Run by Usman + 2–3 friends on real
phones. Mark each test Pass / Fail and note what you saw.

**Test users:** use the test code WEB-1002 (Test User) or a fresh code from
WEB-1003..WEB-1020. Never use a real student's code for testing.

## 1. Sales page (index.html)
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-01 | Page loads in under 2 seconds on mobile data | | |
| TC-02 | Hero shows Batch 1 — 1 Dec 2026, 20 seats, Rs 999 early bird | | |
| TC-03 | "Free demo — first 3 lessons free" is visible and opens Lesson 1 | | |
| TC-04 | Pricing buttons go to the right enroll plan (Early Bird / Regular / Module) | | |
| TC-05 | Testimonials section says reviews come after Batch 1 (no fake reviews) | | |
| TC-06 | WhatsApp button opens a chat to 03187579301 | | |

## 2. Free lessons
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-07 | Lessons 1–3 open WITHOUT any code | | |
| TC-08 | Lesson text is readable on a 390px phone (no cut-off, no sideways scroll) | | |
| TC-09 | "Mark as complete" ticks the lesson and the dashboard progress moves | | |
| TC-10 | Prev/Next links walk 1 → 2 → 3 → 4 in order | | |

## 3. Enroll + pay
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-11 | Enroll form rejects an empty name and a short WhatsApp number | | |
| TC-12 | After submit, the payment page shows the EXACT amount (Rs 999 / 2,000 / 800) | | |
| TC-13 | All three payment numbers are correct: JazzCash 03187579301, Easypaisa 03202465855, Nayapay 03156074855 | | |
| TC-14 | WhatsApp button message includes the name, plan and amount | | |

## 4. Unlock + dashboard
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-15 | A wrong code shows a clear error (try WEB-9999) | | |
| TC-16 | A valid code unlocks and shows "Welcome, <name>!" | | |
| TC-17 | Dashboard shows the name, code, batch and 0/23 progress | | |
| TC-18 | After unlocking, all 23 lessons show "Open" (no "coming in Loop 3" text) | | |

## 5. Lessons, quizzes, editor
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-19 | A locked lesson (e.g. CSS 1) shows the lock box WITHOUT a code | | |
| TC-20 | Quiz: 3 questions, score shows instantly, wrong answers show the right answer + explanation | | |
| TC-21 | Retake keeps the BEST score (not the latest) | | |
| TC-22 | Editor: change the heading, press Run, preview updates | | |
| TC-23 | Editor "Try it" link from a lesson loads that lesson's starter code | | |
| TC-24 | Project page checklist boxes save (reload the page — boxes stay checked) | | |

## 6. Search
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-25 | Typing "flex" in lesson search shows only Flexbox Layout | | |
| TC-26 | Typing a nonsense word shows "No lessons match your search." | | |
| TC-27 | Clearing the search shows all 23 items again | | |

## 7. Certificate
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-28 | With 0/23 complete, the dashboard certificate box shows progress, not a download button | | |
| TC-29 | Certificate page with ?preview=1 shows the certificate design with the student's name | | |
| TC-30 | Print preview shows ONLY the certificate (no nav, no buttons) | | |

## 8. Mobile layout (390px phone)
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-31 | Lesson titles do NOT break across 3 lines (Forms & Inputs, What is CSS) | | |
| TC-32 | No page needs sideways scrolling | | |
| TC-33 | Hamburger menu opens and all links work | | |
| TC-34 | Dark/light toggle works and stays after reload | | |

## 9. Whole site
| # | Test | Pass/Fail | Notes |
|---|---|---|---|
| TC-35 | No broken links (click every nav link on the home page) | | |
| TC-36 | Waitlist form saves and shows a confirmation | | |

**Sign-off:** all 36 tests Pass = ready for Batch 1 launch. Any Fail = fix first,
re-test that row, then launch.
