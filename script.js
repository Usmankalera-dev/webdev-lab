/* WebDev Lab — config (Loop 2). Payment numbers are set here. */
const WEBDEV_CONFIG = {
  jazzcash: "03187579301",
  easypaisa: "03202465855",
  nayapay: "03156074855",
  whatsapp: "923187579301",
  earlyBirdPrice: 999,
  regularPrice: 2000,
  modulePrice: 800,
  batch: "Batch 1 — 1 Dec 2026",
  seats: 20
};

/* WebDev Lab — shared script (Loop 1 + Loop 2) */
(function () {
  "use strict";

  var THEME_KEY = "webdevlab-theme";
  var PROGRESS_KEY = "webdevlab-progress";
  var WAITLIST_KEY = "webdevlab-waitlist";
  var ACCESS_KEY = "webdevlab-access";
  var USED_CODES_KEY = "webdevlab-used-codes";
  var ENROLLMENT_KEY = "webdevlab-enrollment";
  var TOTAL_LESSONS = 23;

  /* ---------- access codes: WEB-1001 to WEB-1020 (Batch 1, 20 seats) ---------- */
  var ACCESS_CODES = [];
  (function () {
    for (var i = 1; i <= 20; i++) ACCESS_CODES.push("WEB-" + (1000 + i));
  })();

  function normalizeCode(raw) {
    return String(raw || "").toUpperCase().replace(/[\s\-]/g, "");
  }

  function getUsedCodes() {
    try {
      var list = JSON.parse(localStorage.getItem(USED_CODES_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function markCodeUsed(code) {
    var used = getUsedCodes();
    if (used.indexOf(code) === -1) {
      used.push(code);
      try { localStorage.setItem(USED_CODES_KEY, JSON.stringify(used)); } catch (e) {}
    }
  }

  /* Returns { ok: true, code } or { ok: false, reason: "invalid" | "used" } */
  function validateAccessCode(raw) {
    var wanted = normalizeCode(raw);
    var found = null;
    for (var i = 0; i < ACCESS_CODES.length; i++) {
      if (normalizeCode(ACCESS_CODES[i]) === wanted) { found = ACCESS_CODES[i]; break; }
    }
    if (!found) return { ok: false, reason: "invalid" };
    if (getUsedCodes().indexOf(found) !== -1) return { ok: false, reason: "used" };
    return { ok: true, code: found };
  }

  function getAccess() {
    try {
      var acc = JSON.parse(localStorage.getItem(ACCESS_KEY) || "null");
      if (acc && acc.code && ACCESS_CODES.indexOf(acc.code) !== -1) return acc;
    } catch (e) {}
    return null;
  }

  function hasAccess() {
    return getAccess() !== null;
  }

  function saveAccess(code, name) {
    try {
      localStorage.setItem(ACCESS_KEY, JSON.stringify({
        code: code, name: name, date: new Date().toISOString().slice(0, 10)
      }));
    } catch (e) {}
  }

  /* ---------- lesson catalogue (23 items) ---------- */
  var LESSONS = [
    { id: "html-1", num: 1, title: "Your First Web Page", module: "HTML", href: "lessons/html-1.html" },
    { id: "html-2", num: 2, title: "Headings, Paragraphs & Links", module: "HTML", href: "lessons/html-2.html" },
    { id: "html-3", num: 3, title: "Images, Lists & Tables", module: "HTML", href: "lessons/html-3.html" },
    { id: "html-4", num: 4, title: "Forms & Inputs", module: "HTML", href: null },
    { id: "html-5", num: 5, title: "Semantic HTML & Page Structure", module: "HTML", href: null },
    { id: "css-1", num: 6, title: "What is CSS", module: "CSS", href: null },
    { id: "css-2", num: 7, title: "Colours, Fonts & Text", module: "CSS", href: null },
    { id: "css-3", num: 8, title: "Box Model", module: "CSS", href: null },
    { id: "css-4", num: 9, title: "Flexbox Layout", module: "CSS", href: null },
    { id: "css-5", num: 10, title: "Responsive Design", module: "CSS", href: null },
    { id: "js-1", num: 11, title: "What is JavaScript", module: "JavaScript", href: null },
    { id: "js-2", num: 12, title: "Variables & Data", module: "JavaScript", href: null },
    { id: "js-3", num: 13, title: "Functions", module: "JavaScript", href: null },
    { id: "js-4", num: 14, title: "DOM & Events", module: "JavaScript", href: null },
    { id: "js-5", num: 15, title: "Conditions & Loops", module: "JavaScript", href: null },
    { id: "js-6", num: 16, title: "Arrays & Objects", module: "JavaScript", href: null },
    { id: "js-7", num: 17, title: "Fetch & APIs (intro)", module: "JavaScript", href: null },
    { id: "js-8", num: 18, title: "Build a To-Do App", module: "JavaScript", href: null },
    { id: "proj-1", num: 19, title: "Profile Card", module: "Mini Projects", href: null },
    { id: "proj-2", num: 20, title: "Contact Form", module: "Mini Projects", href: null },
    { id: "proj-3", num: 21, title: "Navbar", module: "Mini Projects", href: null },
    { id: "proj-4", num: 22, title: "Image Gallery", module: "Mini Projects", href: null },
    { id: "proj-5", num: 23, title: "To-Do App", module: "Mini Projects", href: null }
  ];

  var PLAN_LABELS = {
    earlybird: "Full Course — Early Bird (Batch 1)",
    regular: "Full Course — Regular",
    module: "Single Module"
  };

  function planAmount(plan, module) {
    if (plan === "earlybird") return WEBDEV_CONFIG.earlyBirdPrice;
    if (plan === "regular") return WEBDEV_CONFIG.regularPrice;
    return WEBDEV_CONFIG.modulePrice;
  }

  function planLabel(plan, module) {
    if (plan === "module" && module) {
      var names = { html: "HTML", css: "CSS", javascript: "JavaScript" };
      return "Single Module — " + (names[module] || module);
    }
    return PLAN_LABELS[plan] || "Full Course";
  }

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveProgress(list) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable — ignore */ }
  }

  /* ---------- dark / light theme ---------- */
  var themeBtn = document.getElementById("themeToggle");
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light");
      if (themeBtn) themeBtn.textContent = "\u2600\uFE0F";
    } else {
      document.body.classList.remove("light");
      if (themeBtn) themeBtn.textContent = "\uD83C\uDF19";
    }
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(savedTheme === "light" ? "light" : "dark");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = document.body.classList.contains("light") ? "dark" : "light";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---------- smooth scrolling for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* ---------- waitlist form ---------- */
  var form = document.getElementById("waitlistForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("wlName");
      var phoneInput = document.getElementById("wlPhone");
      var msg = document.getElementById("waitlistMsg");
      var waBtn = document.getElementById("waitlistWa");
      var name = nameInput.value.trim();
      var phone = phoneInput.value.replace(/[\s\-()]/g, "");
      if (!name || phone.length < 10 || !/^[0-9+]+$/.test(phone)) {
        msg.textContent = "Please enter your name and a valid WhatsApp number (at least 10 digits).";
        msg.className = "form-msg err";
        return;
      }
      var list = [];
      try { list = JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]"); } catch (err) {}
      list.push({ name: name, phone: phone, date: new Date().toISOString().slice(0, 10) });
      try { localStorage.setItem(WAITLIST_KEY, JSON.stringify(list)); } catch (err) {}
      msg.textContent = "You are on the Batch 1 waitlist, " + name + "! We will message you on WhatsApp when enrollment opens.";
      msg.className = "form-msg ok";
      var text = "I want to join WebDev Lab Batch 1 waitlist. My name is " + name + ".";
      waBtn.href = "https://wa.me/" + WEBDEV_CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
      waBtn.classList.remove("hidden");
      form.querySelector("button[type=submit]").disabled = true;
    });
  }

  /* ---------- mark lesson as complete ---------- */
  var completeBtns = document.querySelectorAll("[data-complete]");
  completeBtns.forEach(function (btn) {
    var id = btn.getAttribute("data-complete");
    if (getProgress().indexOf(id) !== -1) {
      btn.textContent = "\u2713 Completed";
      btn.disabled = true;
    }
    btn.addEventListener("click", function () {
      var done = getProgress();
      if (done.indexOf(id) === -1) {
        done.push(id);
        saveProgress(done);
      }
      btn.textContent = "\u2713 Completed";
      btn.disabled = true;
      updateProgressBar();
    });
  });

  /* ---------- progress bar on lesson pages ---------- */
  function updateProgressBar() {
    var fill = document.getElementById("progressFill");
    var label = document.getElementById("progressCount");
    if (!fill) return;
    var done = getProgress().length;
    fill.style.width = Math.round((done / TOTAL_LESSONS) * 100) + "%";
    if (label) label.textContent = done + " of " + TOTAL_LESSONS + " lessons complete";
  }
  updateProgressBar();

  /* ---------- tick completed lessons on the lessons list ---------- */
  document.querySelectorAll(".lesson-row[data-lesson]").forEach(function (row) {
    if (getProgress().indexOf(row.getAttribute("data-lesson")) !== -1) {
      row.classList.add("done");
    }
  });

  /* ---------- lessons page: unlock state ---------- */
  var lessonsIntro = document.getElementById("lessonsIntro");
  var unlockBar = document.getElementById("unlockBar");
  var lessonsCtaBtn = document.getElementById("lessonsCtaBtn");
  if (lessonsIntro && hasAccess()) {
    lessonsIntro.textContent = "You have full access — all 23 lessons and projects are unlocked for you.";
    if (unlockBar) unlockBar.classList.add("hidden");
    document.querySelectorAll(".lesson-row .lock").forEach(function (lock) {
      var badge = document.createElement("span");
      badge.className = "badge-unlocked";
      badge.textContent = "\u2713 Unlocked";
      var note = document.createElement("span");
      note.className = "coming-note";
      note.textContent = "Lesson page coming in Loop 3";
      lock.replaceWith(badge, note);
    });
    document.querySelectorAll(".lesson-row .open-link").forEach(function (link) {
      var badge = document.createElement("span");
      badge.className = "badge-unlocked";
      badge.textContent = "\u2713 Unlocked";
      link.parentNode.insertBefore(badge, link.nextSibling);
    });
    if (lessonsCtaBtn) {
      lessonsCtaBtn.textContent = "Go to Dashboard";
      lessonsCtaBtn.href = "dashboard.html";
    }
  }

  /* ---------- enroll page ---------- */
  var enrollForm = document.getElementById("enrollForm");
  if (enrollForm) {
    var planCards = document.querySelectorAll(".plan-card");
    var moduleWrap = document.getElementById("moduleWrap");
    var moduleSelect = document.getElementById("moduleSelect");
    var amountEl = document.getElementById("planAmount");
    var enrollMsg = document.getElementById("enrollMsg");

    function selectedPlan() {
      var checked = document.querySelector('input[name="plan"]:checked');
      return checked ? checked.value : "earlybird";
    }
    function selectedModule() {
      return moduleSelect ? moduleSelect.value : "html";
    }
    function refreshPlanUI() {
      var plan = selectedPlan();
      planCards.forEach(function (card) {
        var input = card.querySelector('input[name="plan"]');
        card.classList.toggle("selected", input && input.checked);
      });
      if (moduleWrap) moduleWrap.classList.toggle("hidden", plan !== "module");
      if (amountEl) amountEl.textContent = "Rs " + planAmount(plan, selectedModule()).toLocaleString("en-PK");
    }
    planCards.forEach(function (card) {
      var input = card.querySelector('input[name="plan"]');
      if (input) input.addEventListener("change", refreshPlanUI);
    });
    if (moduleSelect) moduleSelect.addEventListener("change", refreshPlanUI);

    /* preselect from ?plan=earlybird|regular|module */
    try {
      var params = new URLSearchParams(window.location.search);
      var wanted = params.get("plan");
      if (wanted === "earlybird" || wanted === "regular" || wanted === "module") {
        var radio = document.querySelector('input[name="plan"][value="' + wanted + '"]');
        if (radio) radio.checked = true;
      }
    } catch (e) {}
    refreshPlanUI();

    enrollForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("enName").value.trim();
      var phoneRaw = document.getElementById("enPhone").value;
      var phone = phoneRaw.replace(/[\s\-()]/g, "");
      var email = document.getElementById("enEmail").value.trim();
      if (!name) {
        enrollMsg.textContent = "Please enter your full name.";
        enrollMsg.className = "form-msg err";
        return;
      }
      if (phone.length < 10 || !/^[0-9+]+$/.test(phone)) {
        enrollMsg.textContent = "Please enter a valid WhatsApp number (at least 10 digits).";
        enrollMsg.className = "form-msg err";
        return;
      }
      if (email && email.indexOf("@") === -1) {
        enrollMsg.textContent = "Please enter a valid email address, or leave it empty.";
        enrollMsg.className = "form-msg err";
        return;
      }
      var plan = selectedPlan();
      var module = selectedModule();
      var amount = planAmount(plan, module);
      var label = planLabel(plan, module);
      var enrollment = {
        name: name, whatsapp: phone, email: email,
        plan: plan, module: plan === "module" ? module : null,
        planLabel: label, amount: amount,
        date: new Date().toISOString().slice(0, 10)
      };
      try { localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(enrollment)); } catch (err) {}

      /* show the payment section */
      document.getElementById("enrollStep1").classList.add("hidden");
      var paySection = document.getElementById("paySection");
      paySection.classList.remove("hidden");
      document.getElementById("payAmountBig").textContent = "Rs " + amount.toLocaleString("en-PK");
      document.getElementById("enrollSummary").textContent =
        name + " — " + label + " — Rs " + amount.toLocaleString("en-PK");

      var methods = document.getElementById("payMethods");
      var defs = [
        { name: "JazzCash", num: WEBDEV_CONFIG.jazzcash },
        { name: "Easypaisa", num: WEBDEV_CONFIG.easypaisa },
        { name: "Nayapay", num: WEBDEV_CONFIG.nayapay }
      ];
      methods.innerHTML = "";
      defs.forEach(function (m) {
        if (!m.num) return;
        var row = document.createElement("div");
        row.className = "pay-method";
        var lab = document.createElement("span");
        lab.className = "pay-name";
        lab.textContent = m.name;
        var num = document.createElement("span");
        num.className = "pay-num";
        num.textContent = m.num;
        row.appendChild(lab);
        row.appendChild(num);
        methods.appendChild(row);
      });

      var waText = "Hello! I enrolled in WebDev Lab. My name is " + name +
        ". Plan: " + label + ". Amount: Rs " + amount +
        ". I am sending my payment screenshot now.";
      var waBtn = document.getElementById("payWa");
      waBtn.href = "https://wa.me/" + WEBDEV_CONFIG.whatsapp + "?text=" + encodeURIComponent(waText);
      paySection.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- unlock page ---------- */
  var unlockForm = document.getElementById("unlockForm");
  if (unlockForm) {
    var alreadyBox = document.getElementById("alreadyBox");
    var unlockSuccess = document.getElementById("unlockSuccess");
    var unlockMsg = document.getElementById("unlockMsg");
    var acc = getAccess();
    if (acc) {
      alreadyBox.classList.remove("hidden");
      document.getElementById("alreadyText").textContent =
        "You already have access, " + acc.name + " — your code is " + acc.code + ".";
      unlockForm.classList.add("hidden");
    }
    unlockForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("unName").value.trim();
      var rawCode = document.getElementById("unCode").value;
      if (!name) {
        unlockMsg.textContent = "Please enter your name.";
        unlockMsg.className = "form-msg err";
        return;
      }
      if (!rawCode.trim()) {
        unlockMsg.textContent = "Please enter your access code.";
        unlockMsg.className = "form-msg err";
        return;
      }
      var result = validateAccessCode(rawCode);
      if (!result.ok) {
        unlockMsg.textContent = "This code is not valid or already used. Check the code or message us on WhatsApp.";
        unlockMsg.className = "form-msg err";
        return;
      }
      saveAccess(result.code, name);
      markCodeUsed(result.code);
      unlockForm.classList.add("hidden");
      unlockMsg.textContent = "";
      document.getElementById("unlockSuccessText").textContent =
        "Welcome, " + name + "! Your course is unlocked with code " + result.code + ".";
      unlockSuccess.classList.remove("hidden");
      unlockSuccess.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- dashboard page ---------- */
  var dashLocked = document.getElementById("dashLocked");
  var dashMain = document.getElementById("dashMain");
  if (dashLocked && dashMain) {
    var dacc = getAccess();
    if (!dacc) {
      dashLocked.classList.remove("hidden");
      dashMain.classList.add("hidden");
    } else {
      dashLocked.classList.add("hidden");
      dashMain.classList.remove("hidden");
      document.getElementById("dashWelcome").textContent = "Welcome, " + dacc.name + "!";
      document.getElementById("dashCode").textContent = dacc.code;
      document.getElementById("dashBatch").textContent = WEBDEV_CONFIG.batch;
      var done = getProgress();
      var doneCount = 0;
      LESSONS.forEach(function (l) {
        if (done.indexOf(l.id) !== -1) doneCount++;
      });
      var dashFill = document.getElementById("dashFill");
      var dashCount = document.getElementById("dashCount");
      dashFill.style.width = Math.round((doneCount / TOTAL_LESSONS) * 100) + "%";
      dashCount.textContent = doneCount + " of " + TOTAL_LESSONS + " lessons complete";

      var list = document.getElementById("dashLessons");
      var currentModule = "";
      LESSONS.forEach(function (l) {
        if (l.module !== currentModule) {
          currentModule = l.module;
          var h = document.createElement("h3");
          h.textContent = currentModule;
          h.style.marginTop = "24px";
          list.appendChild(h);
        }
        var row = document.createElement("div");
        row.className = "lesson-row";
        row.setAttribute("data-lesson", l.id);
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = l.num;
        var name = document.createElement("span");
        name.className = "lname";
        name.textContent = l.title;
        row.appendChild(num);
        row.appendChild(name);
        if (done.indexOf(l.id) !== -1) row.classList.add("done");
        if (l.href) {
          var a = document.createElement("a");
          a.className = "open-link";
          a.href = l.href;
          a.textContent = "Open \u2192";
          row.appendChild(a);
        } else {
          var badge = document.createElement("span");
          badge.className = "badge-unlocked";
          badge.textContent = "\u2713 Unlocked";
          var note = document.createElement("span");
          note.className = "coming-note";
          note.textContent = "Lesson page coming in Loop 3";
          row.appendChild(badge);
          row.appendChild(note);
        }
        list.appendChild(row);
      });

      var certBox = document.getElementById("certBox");
      if (doneCount >= TOTAL_LESSONS) {
        certBox.className = "alert alert-ok";
        certBox.innerHTML = "<strong>Certificate ready!</strong> You finished all 23 lessons. Your certificate will be available in the final version (Loop 4).";
      } else {
        certBox.className = "alert";
        certBox.innerHTML = "<strong>Certificate:</strong> Complete all 23 lessons to unlock your certificate. Your certificate will be available in the final version (Loop 4).";
      }
    }
  }
})();
