/* WebDev Lab — shared script (Loop 1, Week 1) */
(function () {
  "use strict";

  var THEME_KEY = "webdevlab-theme";
  var PROGRESS_KEY = "webdevlab-progress";
  var WAITLIST_KEY = "webdevlab-waitlist";
  var TOTAL_LESSONS = 23;

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
      waBtn.href = "https://wa.me/923187579301?text=" + encodeURIComponent(text);
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
})();
