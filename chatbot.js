/* ============================================================
   WebDev Lab AI Chatbot — general web-dev questions, no key
   needed from the student.
   ------------------------------------------------------------
   How it works:
   1. CONFIG — on load, this file fetches chatbot-config.json
      (the backend chat URL + the model list). There is NO key in
      this file and NO key in this page.
   2. ASK — the question goes to the portfolio backend
      (POST /api/chat). The backend reads the chatbot key from
      its Postgres database (app_secrets table) and forwards the
      request to the AI endpoint, trying GPT-6 Astra first and
      GPT-6 Luna if Astra fails. The key is never sent to any
      browser, so students just type and ask.
   3. ANSWER — the reply is shown with a small "Answered by …"
      line. The last 20 exchanges are kept in this browser only.
   ============================================================ */
(function () {
  "use strict";

  var CONFIG_URL = "chatbot-config.json";
  var SYSTEM_PROMPT =
    "You are the WebDev Lab AI Chatbot. Answer web development " +
    "questions (HTML, CSS, JavaScript) in the same language as the " +
    "student (English, Urdu or Roman Urdu). Keep answers short, " +
    "simple and practical, with a small code example when it helps. " +
    "If you do not know the answer, say so plainly instead of guessing.";
  var HISTORY_NAME = "webdevlab-chatbot-history";
  var HISTORY_MAX = 20;

  var config = null;
  var model = "";
  var chatEl, inputEl, askBtn, statusEl;

  /* ---------- small helpers (same safe pattern as tutor.js) ---------- */

  function escapeHtml(text) {
    return (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inlineMd(text) {
    var codes = [];
    text = text.replace(/`([^`]+)`/g, function (m, c) {
      codes.push(c);
      return "\u0001" + (codes.length - 1) + "\u0001";
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\u0001(\d+)\u0001/g, function (m, i) {
      return "<code>" + codes[+i] + "</code>";
    });
    return text;
  }

  function renderAnswer(text) {
    return text.split(/\n\s*\n/).map(function (block) {
      if (/^\s*-\s+/m.test(block)) {
        var items = block.split("\n")
          .filter(function (line) { return /^\s*-\s+/.test(line); })
          .map(function (line) {
            return "<li>" + inlineMd(line.replace(/^\s*-\s+/, "")) + "</li>";
          }).join("");
        return "<ul>" + items + "</ul>";
      }
      return "<p>" + block.split("\n").map(inlineMd).join("<br>") + "</p>";
    }).join("");
  }

  function friendlyError(err, res) {
    if (res && res.status === 503) {
      return "Chatbot abhi set up nahi hai — database mein key nahi " +
        "mili. Thori dair baad dobara try karo, ya <a href='tutor.html'>" +
        "AI Tutor</a> se pooch lo.";
    }
    if (res && res.status === 502) {
      return "Chatbot down hai — AI endpoint se jawab nahi mila. " +
        "Thori dair baad dobara try karo, ya <a href='tutor.html'>" +
        "AI Tutor</a> se pooch lo.";
    }
    if (res && res.status === 429) {
      return "Bohat sare sawal pooch liye — kuch dair baad dobara try karo.";
    }
    if (res) {
      return "Chatbot se jawab nahi mila (error " + res.status +
        ") — thori dair baad dobara try karo.";
    }
    if (err) {
      return "Chatbot server nahi mil raha — apna connection check " +
        "karo aur dobara try karo.";
    }
    return "Kuch ghalat ho gaya — dobara try karo.";
  }

  /* ---------- chat UI ---------- */

  function addMessage(kind, html) {
    var div = document.createElement("div");
    div.className = "tutor-msg tutor-msg-" + kind;
    div.innerHTML = html;
    if (kind === "ai") {
      var copy = document.createElement("button");
      copy.type = "button";
      copy.className = "tutor-copy-btn";
      copy.textContent = "📋 Copy";
      div.appendChild(copy);
    }
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
    return div;
  }

  function loadHistory() {
    try {
      var list = JSON.parse(localStorage.getItem(HISTORY_NAME) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function saveExchange(question, aiHtml) {
    try {
      var list = loadHistory();
      list.push({ q: question, a: aiHtml });
      while (list.length > HISTORY_MAX) list.shift();
      localStorage.setItem(HISTORY_NAME, JSON.stringify(list));
    } catch (e) {}
  }

  function addAi(html, question) {
    var div = addMessage("ai", html);
    if (question) saveExchange(question, html);
    return div;
  }

  function clearChat() {
    try { localStorage.removeItem(HISTORY_NAME); } catch (e) {}
    chatEl.innerHTML = "";
    var div = document.createElement("div");
    div.className = "tutor-msg tutor-msg-ai";
    div.innerHTML = "<p>Assalam-o-Alaikum! 👋 Main WebDev Lab ka AI Chatbot " +
      "hoon. Mujh se HTML, CSS ya JavaScript ke baare mein kuch bhi " +
      "pooch lo.</p>";
    chatEl.appendChild(div);
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {}
  }

  function setLoading(on) {
    askBtn.disabled = on;
    inputEl.disabled = on;
    if (on) {
      addMessage("loading", "<span class='tutor-dots'>" +
        "<i></i><i></i><i></i></span> Soch raha hoon…");
    } else {
      var loading = chatEl.querySelector(".tutor-msg-loading");
      if (loading) loading.remove();
    }
  }

  /* ---------- model picker ---------- */

  function setModel(name, silent) {
    model = name;
    var astra = document.getElementById("modelAstra");
    var luna = document.getElementById("modelLuna");
    if (astra) astra.setAttribute("aria-pressed",
      name === "gpt-6-astra" ? "true" : "false");
    if (luna) luna.setAttribute("aria-pressed",
      name === "gpt-6-luna" ? "true" : "false");
    if (!silent && statusEl) {
      statusEl.textContent = "Model: " +
        (name === "gpt-6-astra" ? "GPT-6 Astra" : "GPT-6 Luna");
    }
  }

  function modelLabel(name) {
    return name === "gpt-6-astra" ? "GPT-6 Astra"
      : name === "gpt-6-luna" ? "GPT-6 Luna" : name;
  }

  /* ---------- backend call ---------- */

  function ask(question) {
    question = (question || "").trim();
    if (!question || askBtn.disabled) return;
    inputEl.value = "";
    addMessage("user", escapeHtml(question));

    if (!config) {
      addAi("<p>Chatbot ki config nahi mili — page reload karo. " +
        "Agar error bar bar aaye to <a href='tutor.html'>AI Tutor</a> " +
        "use karo.</p>", question);
      return;
    }

    setLoading(true);

    // Last 4 exchanges as context, so follow-up questions make sense.
    var history = loadHistory().slice(-4);
    var messages = [{ role: "system", content: SYSTEM_PROMPT }];
    history.forEach(function (ex) {
      messages.push({ role: "user", content: ex.q });
      var tmp = document.createElement("div");
      tmp.innerHTML = ex.a || "";
      messages.push({ role: "assistant",
        content: tmp.innerText || tmp.textContent || "" });
    });
    messages.push({ role: "user", content: question });

    fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages, model: model })
    }).then(function (res) {
      if (!res.ok) throw { res: res };
      return res.json();
    }).then(function (data) {
      setLoading(false);
      var answer = (data && data.answer ? String(data.answer) : "").trim();
      if (!answer) {
        addMessage("ai", "<p>Jawab khaali aaya — dobara try karo.</p>");
        return;
      }
      var html = renderAnswer(escapeHtml(answer)) +
        "<p class='chatbot-answered'>Answered by " +
        escapeHtml(modelLabel(data.model || model)) + "</p>";
      addAi(html, question);
    }).catch(function (err) {
      setLoading(false);
      var res = err && err.res ? err.res : null;
      addAi("<p>" + friendlyError(err, res) + "</p>", question);
    });
  }

  /* ---------- config load ---------- */

  function loadConfig() {
    statusEl.textContent = "Loading…";
    fetch(CONFIG_URL).then(function (res) {
      if (!res.ok) throw new Error("config " + res.status);
      return res.json();
    }).then(function (cfg) {
      if (!cfg || !cfg.apiUrl || !(cfg.models || []).length) {
        throw new Error("config incomplete");
      }
      config = cfg;
      setModel(cfg.models[0]);
      statusEl.textContent = "Ready — " + modelLabel(cfg.models[0]);
    }).catch(function () {
      statusEl.textContent = "Config nahi mili — chatbot abhi nahi chal raha.";
    });
  }

  /* ---------- start ---------- */

  function init() {
    chatEl = document.getElementById("chatbotChat");
    inputEl = document.getElementById("chatbotInput");
    askBtn = document.getElementById("chatbotAskBtn");
    statusEl = document.getElementById("chatbotModelStatus");
    if (!chatEl || !inputEl || !askBtn) return;

    document.getElementById("chatbotForm").addEventListener("submit",
      function (e) { e.preventDefault(); ask(inputEl.value); });
    document.getElementById("chatbotNewChat").addEventListener("click", clearChat);
    document.getElementById("modelAstra").addEventListener("click",
      function () { setModel("gpt-6-astra"); });
    document.getElementById("modelLuna").addEventListener("click",
      function () { setModel("gpt-6-luna"); });

    chatEl.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".tutor-copy-btn") : null;
      if (!btn) return;
      var clone = btn.parentElement.cloneNode(true);
      var copyBtn = clone.querySelector(".tutor-copy-btn");
      if (copyBtn) copyBtn.remove();
      var text = clone.innerText || clone.textContent || "";
      var done = function () {
        btn.textContent = "✓ Copied";
        setTimeout(function () { btn.textContent = "📋 Copy"; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text); done();
        });
      } else { fallbackCopy(text); done(); }
    });

    var chips = document.querySelectorAll("[data-question]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () { ask(chip.dataset.question); });
    });

    var history = loadHistory();
    if (history.length) {
      var welcome = document.getElementById("chatbotWelcome");
      if (welcome) welcome.remove();
      history.forEach(function (ex) {
        addMessage("user", escapeHtml(ex.q));
        addMessage("ai", ex.a || "");
      });
    }

    loadConfig();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
