/* ============================================================
   WebDev Lab AI Tutor — browser-only RAG, no server, no cost.
   ------------------------------------------------------------
   How it works (three steps, all in this file):
   1. RETRIEVE — the question is matched against the lesson index
      (tutor-index.js) with a simple keyword scorer (TF-IDF style).
      No key is needed for this step.
   2. SHOW — without a key, the tutor shows the matching lesson
      passages and links. The student reads the real lesson text.
   3. GENERATE — with the visitor's own free key, the top passages
      are sent to Claude Fable (via Coarena, free) and Fable writes
      a short answer using ONLY those passages.
   The key lives only in this browser (localStorage). It is never
   written into the page, never logged, and never sent anywhere
   except the Coarena API.
   ============================================================ */
(function () {
  "use strict";

  var INDEX = window.TUTOR_INDEX || { items: [] };
  var CHUNKS = INDEX.items || [];
  var KEY_NAME = "webdevlab-tutor-key";
  // Free model on Coarena (2026-11-16): Claude Fable 5.2 left the free
  // tier, so the tutor uses Gemini 3.8 Flash instead — same free
  // $5/day, Coarena pays, no card. Other free models: GPT-6 Luna,
  // DeepSeek V4.1 Flash. If the free tier changes again, change this
  // one line (and check https://coarena.ai/api/v1/models).
  var MODEL = "gemini-3-8-flash";
  var API_URL = "https://coarena.ai/api/v1/messages";
  var TOP_N = 4;          // how many passages we use as context
  var MIN_SCORE = 2.5;    // below this, nothing is "relevant"

  /* ---------- words that carry no meaning ----------
     English question words + common Roman Urdu words. They are
     removed before scoring, so "kya hai" never decides a match. */
  var STOPWORDS = {};
  ("a an the is are was were be been am do does did can could will would " +
   "should what how why when where which who whom whose this that these those " +
   "there here it its in on at to of for with by and or but from about " +
   "into as me my you your we our he she they them his her their i have has " +
   "had not no so then than too very just only if all any some each more " +
   "kya hai hain ho hota hoti hote hun tha thi karna karein " +
   "karo kar ke ki ka ko se pe par aur ya bhi nahi nahin mujhe mujhay main " +
   "mai ye yeh wo woh jaisa jaisi kaise kaisa kaisi batao bataiye bataein " +
   "chahiye chaiey samjhao samjhaein seekho seekhna samajhna lagayein lagao " +
   "lagana milega milta milay hoga do de lo le aa jao jaye jayega").split(" ").forEach(function (w) {
    if (w) STOPWORDS[w] = true;
  });

  /* ---------- small synonym map ----------
     Students write "photo" and the lesson says "image". These pairs
     let the search see them as the same word (at a lower weight). */
  var SYNONYMS = {
    image: ["img"], img: ["image"], photo: ["image"], picture: ["image"],
    colour: ["color"], color: ["colour"],
    function: ["functions"], functions: ["function"],
    flexbox: ["flex"], flex: ["flexbox"],
    responsive: ["mobile"], mobile: ["responsive"],
    quiz: ["test"], test: ["quiz"],
    loop: ["loops"], loops: ["loop"],
    array: ["arrays"], arrays: ["array"],
    button: ["buttons"], buttons: ["button"],
    link: ["links"], links: ["link"],
    form: ["forms"], forms: ["form"],
    table: ["tables"], tables: ["table"],
    list: ["lists"], lists: ["list"],
    navbar: ["nav"], nav: ["navbar"],
    variable: ["variables"], variables: ["variable"],
    object: ["objects"], objects: ["object"],
    certificate: ["certified"], certified: ["certificate"],
    // Roman Urdu verbs -> the English word the lesson uses.
    rokain: ["stop", "prevent"], rokna: ["stop", "prevent"],
    roko: ["stop", "prevent"],
    banao: ["build"], banayein: ["build"],
    chalao: ["run"], dikhao: ["show"], likho: ["write"],
    badlo: ["change"], hatayein: ["remove"]
  };

  /* ---------- text helpers ---------- */

  // Lowercase, split on anything that is not a letter or digit.
  // Code words are split at camelCase first (preventDefault becomes
  // "prevent" + "default"), so a question about "prevent" can find
  // them. "JavaScript" and "TypeScript" are real words, not code,
  // so they are kept whole.
  function tokenize(text) {
    text = (text || "").replace("JavaScript", "Javascript")
      .replace("TypeScript", "Typescript")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }

  // Tiny stemmer: "functions" -> "function", "properties" -> "property",
  // "submitting" -> "submit". Only the endings change; "class" and
  // "css" stay as they are.
  function stem(word) {
    if (word.length > 5 && word.slice(-3) === "ing") {
      word = word.slice(0, -3);
      // "submitting" -> "submitt" -> "submit" (double letter drops one).
      if (word.length > 1 && word.slice(-1) === word.slice(-2, -1)) {
        word = word.slice(0, -1);
      }
      return word;
    }
    if (word.length > 4 && word.slice(-3) === "ies") {
      return word.slice(0, -3) + "y";
    }
    if (word.length > 3 && word.slice(-1) === "s" &&
        word.slice(-2) !== "ss" && word.slice(-2) !== "us") {
      return word.slice(0, -1);
    }
    return word;
  }

  // Turn a question into weighted search tokens: the real word counts
  // 1.0, a synonym counts 0.6. Stopwords are dropped first. Then the
  // tokens are sorted rarest-first, and each later token counts a
  // little less: the rarest word in a question is usually the topic,
  // so "function" should beat "javascript" in "what is a function
  // in JavaScript".
  function questionTokens(question) {
    var seen = {};
    var out = [];
    tokenize(question).forEach(function (raw) {
      var word = stem(raw);
      if (STOPWORDS[word] || word.length < 2 || seen[word]) return;
      seen[word] = true;
      out.push({ word: word, weight: 1.0 });
      (SYNONYMS[word] || []).forEach(function (syn) {
        if (!seen[syn]) {
          seen[syn] = true;
          out.push({ word: syn, weight: 0.6 });
        }
      });
    });
    out.sort(function (a, b) { return idf(b.word) - idf(a.word); });
    out.forEach(function (tok, i) {
      tok.weight = tok.weight / (1 + 0.3 * i);
    });
    return out;
  }

  /* ---------- the search index (built once, when the page loads) ----------
     For every chunk we count its words once. IDF = how rare a word is
     across all chunks: a rare word ("flexbox") counts more than a
     common word ("page"), because a rare word points at one lesson. */
  var docFreq = {};
  var chunkData = CHUNKS.map(function (chunk) {
    var counts = {};
    var words = tokenize(chunk.x);
    words.forEach(function (raw) {
      var word = stem(raw);
      if (STOPWORDS[word]) return;
      counts[word] = (counts[word] || 0) + 1;
    });
    var seen = {};
    Object.keys(counts).forEach(function (word) {
      if (!seen[word]) {
        seen[word] = true;
        docFreq[word] = (docFreq[word] || 0) + 1;
      }
    });
    return {
      chunk: chunk,
      counts: counts,
      words: words.length,
      heading: tokenize(chunk.h).map(stem),
      title: tokenize(chunk.t).map(stem)
    };
  });

  function idf(word) {
    var df = docFreq[word] || 0;
    return Math.log((CHUNKS.length + 1) / (df + 1)) + 1;
  }

  /* ---------- retrieve: score every chunk, return the best few ----------
     Score = (how often the word appears, capped at 3) x rarity,
     plus a bonus when the word is in the chunk heading or the lesson
     title. Long chunks are divided by their length, so a short exact
     match is not beaten by a long chunk that mentions the word once. */
  function retrieve(question, topN) {
    var tokens = questionTokens(question);
    if (!tokens.length) return [];
    // "Banayein / banao" means the student wants to BUILD something:
    // the Mini Projects lessons are the build lessons, so they get a
    // small bonus for build questions.
    var wantsBuild = tokens.some(function (tok) {
      return tok.word === "build";
    });
    var scored = chunkData.map(function (entry) {
      var score = 0;
      tokens.forEach(function (tok) {
        var w = tok.weight;
        var rare = idf(tok.word);
        var tf = Math.min(entry.counts[tok.word] || 0, 3);
        score += w * tf * rare;
        if (entry.heading.indexOf(tok.word) !== -1) score += w * 1.2 * rare;
        if (entry.title.indexOf(tok.word) !== -1) score += w * 1.0 * rare;
      });
      if (wantsBuild && entry.chunk.m === "Mini Projects") {
        score += 1.0 * idf("build");
      }
      var norm = Math.sqrt(entry.words / 180);
      norm = Math.min(1.4, Math.max(0.75, norm));
      return { chunk: entry.chunk, score: score / norm };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored
      .filter(function (s) { return s.score >= MIN_SCORE; })
      .slice(0, topN || TOP_N);
  }

  /* ---------- Coarena call (the proven pattern from AI WebDev Studio) ----------
     POST https://coarena.ai/api/v1/messages with the key in the
     Authorization header. Fable gets output_config effort "low".
     If Coarena rejects output_config (400), retry once without it. */
  function callFable(key, systemText, userText, maxTokens) {
    var body = {
      model: MODEL,
      max_tokens: maxTokens || 1024,
      messages: [{ role: "user", content: systemText + "\n\n" + userText }]
    };
    body.output_config = { effort: "low" };
    // output_config (effort) is an Anthropic-only option: send it only
    // for Claude Fable models, never for Gemini/GPT/DeepSeek models.
    if (MODEL.indexOf("claude-fable-") !== 0) delete body.output_config;
    var send = function (b) {
      return fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(b)
      });
    };
    return send(body).then(function (res) {
      if (res.status === 400) {
        var retry = {
          model: body.model,
          max_tokens: body.max_tokens,
          messages: body.messages
        };
        return send(retry);
      }
      return res;
    });
  }

  function extractText(data) {
    try {
      return (data.content || [])
        .filter(function (b) { return b.type === "text"; })
        .map(function (b) { return b.text || ""; })
        .join("");
    } catch (e) {
      return "";
    }
  }

  // Turn an HTTP/network failure into one plain sentence for the student.
  // The key itself is never shown in any message.
  function friendlyError(err, res) {
    if (res && (res.status === 401 || res.status === 403)) {
      return "Key galat hai — Settings mein apni key dobara check karo aur save karo.";
    }
    if (res && res.status === 429) {
      return "Free limit khatam ho gaya (aaj ke $5) — kal dobara try karo, ya bina key ke lessons dekho.";
    }
    if (res && res.status === 402) {
      return "Ye model ab free nahi raha — Coarena ne free tier badal diya hai. Tutor ka model update karna parega; bina key ke lessons abhi bhi dekh sakte ho.";
    }
    if (res) {
      return "Coarena se jawab nahi mila (error " + res.status +
        ") — thori dair baad dobara try karo.";
    }
    if (err) {
      return "Internet nahi mil raha — apna connection check karo aur dobara try karo.";
    }
    return "Kuch ghalat ho gaya — dobara try karo.";
  }

  /* ---------- page wiring ---------- */

  var chatEl, inputEl, askBtn, statusEl;
  var savedKey = "";
  try { savedKey = localStorage.getItem(KEY_NAME) || ""; } catch (e) {}

  function lessonHref(chunk) {
    return "lessons/" + chunk.l + ".html";
  }

  function escapeHtml(text) {
    return (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* Small safe Markdown for AI answers: **bold**, `code`, "- " lists.
     The text is HTML-escaped FIRST, so no tag can sneak in — these
     replacements only add <strong>, <code> and <ul>/<li> of our own.
     Code spans are hidden while bold runs, so ** inside code stays. */
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

  // Paragraphs become <p>; a block of "- " lines becomes a <ul>.
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

  function addMessage(kind, html) {
    var div = document.createElement("div");
    div.className = "tutor-msg tutor-msg-" + kind;
    div.innerHTML = html;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
    return div;
  }

  function lessonLabel(chunk) {
    return "Lesson " + chunk.n + " — " + chunk.t;
  }

  // One passage card: the real lesson text, shortened, with its link.
  function passageHtml(hit) {
    var text = hit.chunk.x;
    var excerpt = text.length > 300
      ? text.slice(0, 300).replace(/\s+\S*$/, "") + "…"
      : text;
    return "<div class='tutor-passage'><p class='tutor-passage-head'>" +
      escapeHtml(lessonLabel(hit.chunk)) +
      (hit.chunk.h ? " · " + escapeHtml(hit.chunk.h) : "") + "</p><p>" +
      escapeHtml(excerpt) + "</p><a href='" + lessonHref(hit.chunk) +
      "'>Open lesson &rarr;</a></div>";
  }

  function sourcesHtml(hits) {
    var links = hits.map(function (hit) { return hit.chunk; })
      .filter(function (c, i, arr) {
        return arr.findIndex(function (x) { return x.l === c.l; }) === i;
      })
      .map(function (c) {
        return "<a class='tutor-chip' href='" + lessonHref(c) + "'>" +
          escapeHtml(lessonLabel(c)) + "</a>";
      }).join("");
    return "<p class='tutor-sources-label'>Sources — from these lessons:</p>" +
      "<div class='tutor-chips'>" + links + "</div>";
  }

  function noMatchHtml() {
    return "<p><strong>Ye is course ke lessons mein nahi hai.</strong></p>" +
      "<p>The 23 lessons do not cover this question, so I will not guess " +
      "an answer. Course questions (certificate, price, seats) are on " +
      "the <a href='enroll.html'>Enroll page</a>, and the full list of " +
      "lessons is on the <a href='lessons.html'>Lessons page</a>.</p>";
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

  function ask(question) {
    question = (question || "").trim();
    if (!question || askBtn.disabled) return;
    inputEl.value = "";
    addMessage("user", escapeHtml(question));
    setLoading(true);

    var hits = retrieve(question, TOP_N);

    // Nothing relevant in the lessons: say so plainly, never guess.
    if (!hits.length) {
      setLoading(false);
      addMessage("ai", noMatchHtml());
      return;
    }

    // No key saved: show the real lesson passages instead of an
    // AI answer. This needs no key and no internet call.
    if (!savedKey) {
      setLoading(false);
      var html = "<p>AI jawab ke liye free key chahiye — neeche " +
        "<strong>Settings</strong> mein apni key save karo. " +
        "Filhal ye lessons dekho, jawab inhi mein hai:</p>" +
        hits.map(passageHtml).join("");
      addMessage("ai", html);
      return;
    }

    // Key saved: ask Fable, grounded ONLY in the retrieved passages.
    var systemText =
      "You are the WebDev Lab AI Tutor. Answer ONLY from the lesson " +
      "passages below. Reply in the same language as the student " +
      "(English, Urdu or Roman Urdu). Keep the answer short and simple. " +
      "After the answer, list the lesson names you used. If the " +
      "passages do not contain the answer, say exactly: " +
      "'Ye is course ke lessons mein nahi hai.' Do not invent anything.";
    var userText = "Question: " + question + "\n\nLesson passages:\n" +
      hits.map(function (hit) {
        return "[Lesson " + hit.chunk.n + " — " + hit.chunk.t +
          (hit.chunk.h ? " — " + hit.chunk.h : "") + "]\n" + hit.chunk.x;
      }).join("\n\n");

    callFable(savedKey, systemText, userText, 1024)
      .then(function (res) {
        if (!res.ok) throw { res: res };
        return res.json();
      })
      .then(function (data) {
        setLoading(false);
        var answer = extractText(data).trim();
        if (!answer) {
          addMessage("ai", "<p>Jawab khaali aaya — dobara try karo.</p>");
          return;
        }
        var html = renderAnswer(escapeHtml(answer)) + sourcesHtml(hits);
        addMessage("ai", html);
      })
      .catch(function (err) {
        setLoading(false);
        var res = err && err.res ? err.res : null;
        addMessage("ai", "<p>" + escapeHtml(friendlyError(err, res)) +
          "</p>" + sourcesHtml(hits));
      });
  }

  /* ---------- settings: the visitor's own key ---------- */

  function refreshKeyStatus() {
    if (!statusEl) return;
    statusEl.textContent = savedKey
      ? "Key saved ✓ — sirf is browser mein hai, kahin aur nahi jati."
      : "No key saved — tutor bina key ke bhi lessons dikhata hai.";
  }

  function saveKey() {
    var input = document.getElementById("tutorKeyInput");
    var key = (input.value || "").trim();
    if (!key) {
      statusEl.textContent = "Pehle apni key likho, phir Save dabao.";
      return;
    }
    savedKey = key;
    try { localStorage.setItem(KEY_NAME, key); } catch (e) {}
    input.value = "";
    refreshKeyStatus();
  }

  function removeKey() {
    savedKey = "";
    try { localStorage.removeItem(KEY_NAME); } catch (e) {}
    var input = document.getElementById("tutorKeyInput");
    if (input) input.value = "";
    refreshKeyStatus();
  }

  function testKey() {
    if (!savedKey) {
      statusEl.textContent = "Pehle key save karo, phir Test dabao.";
      return;
    }
    statusEl.textContent = "Testing key…";
    callFable(savedKey, "You are a test.", "Reply with exactly: OK", 16)
      .then(function (res) {
        if (!res.ok) throw { res: res };
        return res.json();
      })
      .then(function (data) {
        var text = extractText(data);
        statusEl.textContent = text.indexOf("OK") !== -1
          ? "Key works ✓ — Fable ne jawab diya."
          : "Key ne jawab diya, lekin saaf nahi — dobara try karo.";
      })
      .catch(function (err) {
        var res = err && err.res ? err.res : null;
        statusEl.textContent = friendlyError(err, res);
      });
  }

  /* ---------- start ---------- */

  function init() {
    chatEl = document.getElementById("tutorChat");
    inputEl = document.getElementById("tutorInput");
    askBtn = document.getElementById("tutorAskBtn");
    statusEl = document.getElementById("tutorKeyStatus");
    if (!chatEl || !inputEl || !askBtn) return;

    document.getElementById("tutorForm").addEventListener("submit",
      function (e) { e.preventDefault(); ask(inputEl.value); });
    document.getElementById("tutorSaveKey").addEventListener("click", saveKey);
    document.getElementById("tutorTestKey").addEventListener("click", testKey);
    document.getElementById("tutorRemoveKey").addEventListener("click", removeKey);

    var chips = document.querySelectorAll("[data-question]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () { ask(chip.dataset.question); });
    });

    refreshKeyStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Small window into the tutor, for testing and for learning:
  // open the browser console and try WebDevTutor.retrieve("flexbox kya hai").
  window.WebDevTutor = { retrieve: retrieve, chunks: CHUNKS.length };
})();
