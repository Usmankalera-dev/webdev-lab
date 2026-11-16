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
  var REGISTERED_KEY = "webdevlab-registered-date";
  var COMPLETED_KEY = "webdevlab-completed-date";
  var QUIZ_KEY = "webdevlab-quiz-scores";
  var NOTES_KEY = "webdevlab-notes";
  var BOOKMARKS_KEY = "webdevlab-bookmarks";
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
    /* First unlock = registration date for the registration certificate. */
    try {
      if (!localStorage.getItem(REGISTERED_KEY)) {
        localStorage.setItem(REGISTERED_KEY, new Date().toISOString().slice(0, 10));
      }
    } catch (e) {}
  }

  /* Safe file name for a certificate download: "WebDev-Lab-Certificate-Ali-Raza.pdf". */
  function certFileName(name, kind) {
    var safe = String(name || "Student").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "Student";
    return "WebDev-Lab-" + kind + "-Certificate-" + safe + ".pdf";
  }

  /* The registration date: stored at first unlock, else the unlock date,
     else today (and then stored so it never changes). */
  function getRegisteredDate(acc) {
    var d = null;
    try { d = localStorage.getItem(REGISTERED_KEY); } catch (e) {}
    if (!d && acc && acc.date) d = acc.date;
    if (!d) d = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem(REGISTERED_KEY, d); } catch (e) {}
    return d;
  }

  /* ---------- lesson catalogue (23 items) ---------- */
  var LESSONS = [
    { id: "html-1", num: 1, title: "Your First Web Page", module: "HTML", href: "lessons/html-1.html" },
    { id: "html-2", num: 2, title: "Headings, Paragraphs & Links", module: "HTML", href: "lessons/html-2.html" },
    { id: "html-3", num: 3, title: "Images, Lists & Tables", module: "HTML", href: "lessons/html-3.html" },
    { id: "html-4", num: 4, title: "Forms & Inputs", module: "HTML", href: "lessons/html-4.html" },
    { id: "html-5", num: 5, title: "Semantic HTML & Page Structure", module: "HTML", href: "lessons/html-5.html" },
    { id: "css-1", num: 6, title: "What is CSS", module: "CSS", href: "lessons/css-1.html" },
    { id: "css-2", num: 7, title: "Colours, Fonts & Text", module: "CSS", href: "lessons/css-2.html" },
    { id: "css-3", num: 8, title: "Box Model", module: "CSS", href: "lessons/css-3.html" },
    { id: "css-4", num: 9, title: "Flexbox Layout", module: "CSS", href: "lessons/css-4.html" },
    { id: "css-5", num: 10, title: "Responsive Design", module: "CSS", href: "lessons/css-5.html" },
    { id: "js-1", num: 11, title: "What is JavaScript", module: "JavaScript", href: "lessons/js-1.html" },
    { id: "js-2", num: 12, title: "Variables & Data", module: "JavaScript", href: "lessons/js-2.html" },
    { id: "js-3", num: 13, title: "Functions", module: "JavaScript", href: "lessons/js-3.html" },
    { id: "js-4", num: 14, title: "DOM & Events", module: "JavaScript", href: "lessons/js-4.html" },
    { id: "js-5", num: 15, title: "Conditions & Loops", module: "JavaScript", href: "lessons/js-5.html" },
    { id: "js-6", num: 16, title: "Arrays & Objects", module: "JavaScript", href: "lessons/js-6.html" },
    { id: "js-7", num: 17, title: "Fetch & APIs (intro)", module: "JavaScript", href: "lessons/js-7.html" },
    { id: "js-8", num: 18, title: "Build a To-Do App", module: "JavaScript", href: "lessons/js-8.html" },
    { id: "proj-1", num: 19, title: "Profile Card", module: "Mini Projects", href: "lessons/proj-1.html" },
    { id: "proj-2", num: 20, title: "Contact Form", module: "Mini Projects", href: "lessons/proj-2.html" },
    { id: "proj-3", num: 21, title: "Navbar", module: "Mini Projects", href: "lessons/proj-3.html" },
    { id: "proj-4", num: 22, title: "Image Gallery", module: "Mini Projects", href: "lessons/proj-4.html" },
    { id: "proj-5", num: 23, title: "To-Do App", module: "Mini Projects", href: "lessons/proj-5.html" }
  ];

  /* ---------- Loop 4: testimonials (empty until Batch 1 graduates) ---------- */
  var TESTIMONIALS = [];
  (function renderTestimonials() {
    var list = document.getElementById("testimonialsList");
    if (!list) return;
    list.innerHTML = "";
    if (!TESTIMONIALS.length) {
      var p = document.createElement("p");
      p.className = "note";
      p.textContent = "Student reviews will appear here after Batch 1 graduates — starting 1 December 2026.";
      list.appendChild(p);
      return;
    }
    list.className = "grid grid-3";
    TESTIMONIALS.forEach(function (t) {
      var card = document.createElement("div");
      card.className = "card";
      var quote = document.createElement("p");
      quote.textContent = "\u201C" + t.text + "\u201D";
      var name = document.createElement("p");
      name.className = "testimonial-name";
      name.textContent = "\u2014 " + t.name;
      card.appendChild(quote);
      card.appendChild(name);
      list.appendChild(card);
    });
  })();


  /* ---------- Loop 3: quizzes ---------- */
  var QUIZZES = {
    "html-1": [
      { q: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Mode Language", "Home Tool Markup Language"], answer: 0, why: "HTML stands for HyperText Markup Language \u2014 it builds the structure of every web page." },
      { q: "Which tag is the main heading of a page?", options: ["<p>", "<h1>", "<head>", "<title>"], answer: 1, why: "The <h1> tag is the main heading of the page." },
      { q: "What goes inside the <head> of a page?", options: ["Everything visitors see", "Information about the page, like the title", "The page footer", "Images only"], answer: 1, why: "The <head> holds information about the page that visitors do not see, like the title in the browser tab." }
    ],
    "html-2": [
      { q: "How many heading levels does HTML have?", options: ["Three", "Six", "Ten", "One"], answer: 1, why: "HTML gives you six heading levels, from <h1> (biggest) to <h6> (smallest)." },
      { q: "Which attribute says where a link goes?", options: ["src", "link", "href", "target"], answer: 2, why: "The href attribute of the <a> tag says where the link goes." },
      { q: "How do you link to a section on the same page?", options: ["With a relative link to another file", "Give the section an id and link to #id", "With target=\"_blank\"", "With an absolute link"], answer: 1, why: "Give the section an id, then link to it with a hash in front of the name, like #menu." }
    ],
    "html-3": [
      { q: "Which two attributes does every <img> tag need?", options: ["src and alt", "width and height", "href and target", "class and id"], answer: 0, why: "src says where the image file is; alt describes the picture in words." },
      { q: "Which tag makes an ordered (numbered) list?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: 1, why: "<ol> is an ordered list \u2014 the browser numbers each item automatically." },
      { q: "In a table, which tag is a header cell?", options: ["<td>", "<tr>", "<th>", "<table>"], answer: 2, why: "<th> is a header cell (bold, centred); <td> is a normal data cell." }
    ],
    "html-4": [
      { q: "Which input type should you use for an email address?", options: ["type=\"text\"", "type=\"email\"", "type=\"number\"", "type=\"date\""], answer: 1, why: "type=\"email\" makes the browser check that the text looks like an email address." },
      { q: "What does the label tag's for attribute do?", options: ["It sets the label's colour", "It links the label to an input by its id", "It makes the field required", "It hides the label"], answer: 1, why: "for must match the input's id — then clicking the label focuses the field." },
      { q: "Which attribute stops a form from submitting until a field is filled?", options: ["placeholder", "value", "required", "name"], answer: 2, why: "required tells the browser the field must be filled before the form can submit." },
    ],
    "html-5": [
      { q: "Which tag holds the main content of a page?", options: ["<header>", "<main>", "<footer>", "<div>"], answer: 1, why: "There is exactly one <main> per page, holding the content that makes the page unique." },
      { q: "Which tag is for navigation links?", options: ["<nav>", "<aside>", "<section>", "<article>"], answer: 0, why: "<nav> marks the navigation block, so screen readers can jump to it." },
      { q: "Why use semantic tags instead of divs everywhere?", options: ["They make the page load faster", "Screen readers and search engines understand the page better", "They add colour automatically", "They are required by law"], answer: 1, why: "Semantic tags describe meaning — search engines and screen readers use that meaning." },
    ],
    "css-1": [
      { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Sheets"], answer: 1, why: "CSS is short for Cascading Style Sheets." },
      { q: "Which way of adding CSS is best for a whole website?", options: ["Inline styles in every tag", "An internal <style> tag on each page", "An external .css file linked from every page", "Writing CSS inside the HTML comments"], answer: 2, why: "One external file styles every page, so one change updates the whole site." },
      { q: "What does the selector .menu do?", options: ["It selects the element with id=\"menu\"", "It selects every <menu> tag", "It selects every element with class=\"menu\"", "It selects the whole page"], answer: 2, why: "A dot in front of a name selects elements by class." },
    ],
    "css-2": [
      { q: "Which hex code is black?", options: ["#ffffff", "#ff0000", "#000000", "#00ff00"], answer: 2, why: "#000000 means zero red, zero green, zero blue — black." },
      { q: "Which property changes the font of an element?", options: ["font-style", "font-family", "text-font", "typeface"], answer: 1, why: "font-family picks the typeface, with fallbacks in a comma-separated list." },
      { q: "What is 1rem relative to?", options: ["The parent element's font size", "The root element's font size", "The screen width", "The browser window height"], answer: 1, why: "rem is relative to the root (html) font size, usually 16px." },
    ],
    "css-3": [
      { q: "Which layer of the box model sits between the content and the border?", options: ["Margin", "Padding", "Outline", "Gap"], answer: 1, why: "From the inside out: content, padding, border, margin." },
      { q: "What does box-sizing: border-box do?", options: ["It removes all borders", "It makes the width include padding and border", "It centres the box on the page", "It makes the box invisible"], answer: 1, why: "With border-box, a 300px box stays 300px wide even with padding and a border." },
      { q: "How do you centre a block element that has a fixed width?", options: ["text-align: center", "margin: 0 auto", "padding: 0 auto", "align: center"], answer: 1, why: "margin: 0 auto splits the leftover space equally on the left and right." },
    ],
    "css-4": [
      { q: "Which property turns an element into a flex container?", options: ["display: block", "display: flex", "position: flex", "flex: true"], answer: 1, why: "display: flex makes the element a flex container and its children flex items." },
      { q: "justify-content aligns items along which axis?", options: ["The cross axis", "The main axis", "The vertical axis only", "No axis — it sets the size"], answer: 1, why: "justify-content works along the main axis; align-items works along the cross axis." },
      { q: "What is the default flex-direction?", options: ["column", "row", "row-reverse", "wrap"], answer: 1, why: "The default is row — items line up left to right." },
    ],
    "css-5": [
      { q: "What does the viewport meta tag do?", options: ["It makes the page load faster", "It tells the phone the page width matches the device width", "It blocks zooming", "It adds a dark mode"], answer: 1, why: "Without it, phones pretend to be 980px wide and shrink the page." },
      { q: "Which is a correct media query for small screens?", options: ["@media (max-width: 700px)", "@screen (width < 700px)", "@responsive (small)", "@media phone"], answer: 0, why: "@media (max-width: 700px) applies its rules only up to 700px wide." },
      { q: "Why set max-width: 100% on images?", options: ["To make images bigger", "So images never overflow a small screen", "To hide images on phones", "To make images load faster"], answer: 1, why: "A fixed-width image can overflow a 390px phone screen; max-width: 100% stops that." },
    ],
    "js-1": [
      { q: "What is JavaScript mainly used for?", options: ["Styling colours and fonts", "Page structure and headings", "Behaviour and interactivity", "Storing images"], answer: 2, why: "JavaScript makes pages do things: react to clicks, check forms, load data." },
      { q: "Where do you usually write JavaScript in an HTML file?", options: ["Inside <style> tags", "Inside <script> tags", "Inside <head> only, never the body", "In a .css file"], answer: 1, why: "JavaScript goes in <script> tags, usually at the end of the body." },
      { q: "What does console.log() do?", options: ["It prints a message to the browser console", "It shows an alert box", "It writes text on the page", "It saves a file"], answer: 0, why: "console.log() prints to the developer console, opened with F12." },
    ],
    "js-2": [
      { q: "Which keyword do you use for a value that never changes?", options: ["let", "var", "const", "static"], answer: 2, why: "const is for values that never change; trying to change one is an error." },
      { q: "What is typeof \"5\" in JavaScript?", options: ["\"number\"", "\"string\"", "\"boolean\"", "\"undefined\""], answer: 1, why: "Quotes make it a string, even though the character is a digit." },
      { q: "What is 5 + \"5\" in JavaScript?", options: ["10", "\"55\"", "0", "An error"], answer: 1, why: "When one side is a string, + joins the values instead of adding them." },
    ],
    "js-3": [
      { q: "What does return do in a function?", options: ["It prints the value on the page", "It sends a value back to the caller and ends the function", "It repeats the function", "It deletes the function"], answer: 1, why: "return hands a value back to the caller, and nothing after it runs." },
      { q: "What is the difference between parameters and arguments?", options: ["There is no difference", "Parameters are in the definition, arguments are the values passed when calling", "Arguments are in the definition, parameters are passed when calling", "Parameters are only for arrow functions"], answer: 1, why: "function add(a, b) has parameters a and b; add(3, 4) passes the arguments 3 and 4." },
      { q: "Which is a correct function declaration?", options: ["function greet() { }", "greet function() { }", "def greet() { }", "function = greet() { }"], answer: 0, why: "A function declaration starts with the keyword function, then the name and parentheses." },
    ],
    "js-4": [
      { q: "What does document.getElementById(\"title\") return?", options: ["The text inside the element", "The element with that id", "The number of elements on the page", "Nothing — it only works with classes"], answer: 1, why: "getElementById finds the one element with the given id." },
      { q: "What does textContent change?", options: ["The text inside an element", "The colour of the element", "The element's id", "The page title only"], answer: 0, why: "textContent sets the text inside an element, safely, without HTML." },
      { q: "What does addEventListener(\"click\", ...) do?", options: ["It clicks the element once", "It runs a function every time the element is clicked", "It deletes the element", "It changes the element's colour"], answer: 1, why: "addEventListener tells the browser to run a function when the event happens." },
    ],
    "js-5": [
      { q: "What is the difference between == and ===?", options: ["There is no difference", "== checks the value, === also checks the type", "=== is for strings only", "== is for numbers only"], answer: 1, why: "\"5\" == 5 is true, but \"5\" === 5 is false, because the types differ." },
      { q: "Which loop is best when you know how many times to repeat?", options: ["while", "for", "if", "switch"], answer: 1, why: "A for loop has a start, a condition and a step, so it fits a fixed count." },
      { q: "What does && mean in a condition?", options: ["At least one side must be true", "Both sides must be true", "Neither side must be true", "It adds the two sides"], answer: 1, why: "&& means 'and' — both sides must be true for the whole condition to be true." },
    ],
    "js-6": [
      { q: "What is the index of the first item in an array?", options: ["1", "0", "-1", "It has no index"], answer: 1, why: "Arrays are zero-based: the first item is at index 0." },
      { q: "What does push() do to an array?", options: ["It removes the first item", "It adds an item to the end", "It sorts the array", "It empties the array"], answer: 1, why: "push() adds a value to the end of the array." },
      { q: "How do you read the name property of an object called user?", options: ["user[name]", "user->name", "user.name", "name.user"], answer: 2, why: "Dot notation reads a property: user.name." },
    ],
    "js-7": [
      { q: "What does fetch() return?", options: ["The data itself", "A Promise", "A JSON object", "Nothing"], answer: 1, why: "fetch() returns a Promise — the data arrives later, and .then() or await receives it." },
      { q: "What does response.json() do?", options: ["It sends data to the server", "It reads the response body as JSON", "It checks the status code", "It deletes the response"], answer: 1, why: "response.json() turns the raw response body into a JavaScript object." },
      { q: "Why use async/await instead of chained .then() calls?", options: ["It is faster", "The code reads top to bottom, like normal code", "It works without the internet", "It is the only way fetch works"], answer: 1, why: "async/await pauses the function until the promise finishes, so the code stays readable." },
    ],
    "js-8": [
      { q: "Which array method adds a task to the end of the list?", options: ["pop()", "push()", "shift()", "splice()"], answer: 1, why: "push() adds a value to the end of the array." },
      { q: "How do you save an array in localStorage?", options: ["localStorage.setItem(\"key\", array)", "localStorage.setItem(\"key\", JSON.stringify(array))", "localStorage.save(array)", "localStorage.store(array)"], answer: 1, why: "localStorage only stores strings, so the array must be turned into JSON text first." },
      { q: "Which DOM method creates a new element in JavaScript?", options: ["document.createElement()", "document.newElement()", "document.make()", "document.build()"], answer: 0, why: "document.createElement(\"li\") builds a new element, which appendChild then puts on the page." },
    ],
    "proj-1": [
      { q: "How do you make a square image round with CSS?", options: ["border: 50%", "border-radius: 50%", "shape: circle", "radius: 50px"], answer: 1, why: "Make the image square, then border-radius: 50% turns it into a circle." },
      { q: "What does object-fit: cover do?", options: ["It hides the image", "It crops the photo to fill the box without stretching it", "It makes the image bigger", "It adds a border"], answer: 1, why: "object-fit: cover crops the photo to fill the square instead of stretching it, so faces never look squashed." },
      { q: "What does margin: 40px auto do to the card?", options: ["It adds a shadow", "It centres the card on the page", "It makes the card round", "It hides the card"], answer: 1, why: "margin: 40px auto centres a fixed-width block \u2014 the browser splits the leftover space equally on both sides." }
    ],
    "proj-2": [
      { q: "What does e.preventDefault() do in the submit handler?", options: ["It clears the form", "It stops the page from reloading so JavaScript stays in control", "It sends the form", "It hides the button"], answer: 1, why: "Without preventDefault(), the browser would try to send the form and reload the page." },
      { q: "Which check makes sure the message is at least 10 characters long?", options: ["text.length < 10", "text.size < 10", "text.count < 10", "text.words < 10"], answer: 0, why: "The code checks text.length < 10 and shows an error if the message is too short." },
      { q: "What does form.reset() do after a successful send?", options: ["It closes the form", "It clears all the fields", "It reloads the page", "It shows an error"], answer: 1, why: "form.reset() clears all the fields after a successful send." }
    ],
    "proj-3": [
      { q: "Which property pushes the logo to the left and the nav to the right?", options: ["align-items: center", "justify-content: space-between", "display: block", "text-align: right"], answer: 1, why: "justify-content: space-between pushes the logo to the left and the nav to the right." },
      { q: "What does position: sticky with top: 0 do?", options: ["It hides the bar", "The bar scrolls normally, then stops at the top and stays there", "It fixes the bar at the bottom", "It centres the bar"], answer: 1, why: "position: sticky means 'scroll normally, but stop at the top of the screen and stay there'." },
      { q: "Why does the navbar use z-index: 50?", options: ["To make it wider", "So the bar floats above the page content instead of sliding underneath it", "To change its colour", "To make it sticky"], answer: 1, why: "z-index: 50 makes sure the bar floats above the page content instead of sliding underneath it." }
    ],
    "proj-4": [
      { q: "What does repeat(auto-fill, minmax(200px, 1fr)) do?", options: ["It makes one fixed column", "It makes as many columns as fit, each at least 200px wide", "It hides the grid on phones", "It makes the pictures bigger"], answer: 1, why: "It means 'make as many columns as fit, each at least 200px wide, sharing the space equally'." },
      { q: "Which tag holds a picture's caption?", options: ["<caption>", "<figcaption>", "<label>", "<title>"], answer: 1, why: "Each picture is a <figure> with a <figcaption> underneath it." },
      { q: "What does transform: translateY(-4px) do on hover?", options: ["It moves the figure 4 pixels up", "It moves the figure 4 pixels down", "It hides the figure", "It rotates the figure"], answer: 0, why: "transform: translateY(-4px) moves the whole figure 4 pixels up \u2014 and transforms do not disturb the layout around them." }
    ],
    "proj-5": [
      { q: "What does filter do in the Clear completed button?", options: ["It deletes all tasks", "It returns a new array with only the items that pass a test", "It sorts the tasks", "It saves the tasks"], answer: 1, why: "filter takes a test function, runs it on every item, and keeps only the ones where the test returns true." },
      { q: "Why is the task list saved with JSON.stringify?", options: ["localStorage only stores strings", "It makes the list faster", "It hides the tasks", "JSON is required by the browser"], answer: 0, why: "localStorage only stores strings, so the array must be turned into JSON text first." },
      { q: "Which CSS rule puts a line through a finished task?", options: ["#taskList li.done { text-decoration: line-through; }", "#taskList li { color: red; }", ".todo-app { text-decoration: line-through; }", "li.done { display: none; }"], answer: 0, why: "#taskList li.done gives finished tasks a line-through style \u2014 the visual signal that a task is done." }
    ],
  };

  /* ---------- Loop 3: editor starter code ---------- */
  var STARTER_CODE = {
    "default": { html: "<h1>Hello, world!</h1>\n<p>Change this text and press Run.</p>", css: "body { font-family: sans-serif; }\nh1 { color: #d97706; }", js: "console.log(\"Hello from the editor!\");" },
    "html-4": { html: "<form>\n  <label for=\"name\">Name</label>\n  <input type=\"text\" id=\"name\" placeholder=\"Your name\">\n  <button type=\"submit\">Send</button>\n</form>", css: "label { display: block; font-weight: bold; margin: 8px 0 4px; }\ninput { padding: 8px; border: 1px solid #ccc; border-radius: 6px; }\nbutton { margin-top: 12px; padding: 8px 16px; background: #f59e0b; border: none; border-radius: 6px; font-weight: bold; }", js: "" },
    "html-5": { html: "<header>\n  <h1>My Bakery</h1>\n  <nav><a href=\"#\">Home</a> | <a href=\"#\">Menu</a></nav>\n</header>\n<main>\n  <section>\n    <h2>Fresh every morning</h2>\n    <p>Bread, cakes and biscuits.</p>\n  </section>\n</main>\n<footer><p>Since 2015.</p></footer>", css: "header { background: #111827; color: white; padding: 12px; }\nheader a { color: #f59e0b; }\nmain { padding: 12px; }", js: "" },
    "css-1": { html: "<h1>Hello, styled world!</h1>\n<p class=\"highlight\">This paragraph has a yellow background.</p>", css: "body { background-color: #f9fafb; }\nh1 { color: #d97706; }\np { color: #333333; font-size: 18px; }\n.highlight { background-color: #fef3c7; }", js: "" },
    "css-2": { html: "<h1>Colours and Fonts</h1>\n<p>Change the colours and fonts below and press Run.</p>\n<a href=\"#\">A link</a>", css: "body { font-family: Georgia, serif; }\nh1 { color: #1e40af; font-size: 2.5rem; text-align: center; }\np { line-height: 1.7; }\na { text-decoration: none; }\na:hover { text-decoration: underline; }", js: "" },
    "css-3": { html: "<div class=\"card\">\n  <h2>My Card</h2>\n  <p>A card with padding, border and margin.</p>\n</div>", css: "* { box-sizing: border-box; }\n.card {\n  width: 320px;\n  margin: 20px auto;\n  padding: 20px;\n  background: #f3f4f6;\n  border: 2px solid #d97706;\n  border-radius: 12px;\n}", js: "" },
    "css-4": { html: "<div class=\"navbar\">\n  <a class=\"logo\" href=\"#\">My Site</a>\n  <nav><a href=\"#\">Home</a><a href=\"#\">About</a><a href=\"#\">Contact</a></nav>\n</div>", css: ".navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 20px;\n  background: #111827;\n}\n.navbar a { color: white; text-decoration: none; }\n.navbar nav { display: flex; gap: 16px; }\n.logo { color: #f59e0b !important; font-weight: bold; }", js: "" },
    "css-5": { html: "<h1>Responsive Page</h1>\n<div class=\"cards\">\n  <div class=\"card\">Card 1</div>\n  <div class=\"card\">Card 2</div>\n  <div class=\"card\">Card 3</div>\n</div>", css: ".cards { display: flex; gap: 16px; }\n.card { background: #fef3c7; border: 1px solid #d97706; padding: 16px; flex: 1; }\n@media (max-width: 700px) {\n  .cards { flex-direction: column; }\n  h1 { font-size: 1.8rem; }\n}", js: "" },
    "js-1": { html: "<button id=\"countBtn\">Clicked 0 times</button>", css: "button { padding: 12px 20px; font-size: 1rem; background: #f59e0b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }", js: "var count = 0;\nvar button = document.getElementById(\"countBtn\");\nbutton.addEventListener(\"click\", function () {\n  count = count + 1;\n  button.textContent = \"Clicked \" + count + \" times\";\n});" },
    "js-2": { html: "<p id=\"output\">Press Run to see the total.</p>", css: "body { font-family: sans-serif; }", js: "let price = 500;\nlet quantity = 3;\nlet total = price * quantity;\ndocument.getElementById(\"output\").textContent =\n  \"Total: Rs \" + total + \" for \" + quantity + \" items.\";" },
    "js-3": { html: "<p id=\"output\">Press Run to see the greeting.</p>", css: "body { font-family: sans-serif; }", js: "function greet(name) {\n  return \"Hello, \" + name + \"!\";\n}\ndocument.getElementById(\"output\").textContent = greet(\"Usman\");" },
    "js-4": { html: "<h1 id=\"main-title\">Hello!</h1>\n<button id=\"changeBtn\">Change the heading</button>", css: "button { padding: 10px 18px; background: #f59e0b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }", js: "document.getElementById(\"changeBtn\").addEventListener(\"click\", function () {\n  let heading = document.getElementById(\"main-title\");\n  heading.textContent = \"Welcome to my page!\";\n  heading.style.color = \"darkblue\";\n});" },
    "js-5": { html: "<p id=\"output\">Press Run to see the grade.</p>", css: "body { font-family: sans-serif; }", js: "let marks = 85;\nlet grade;\nif (marks >= 90) { grade = \"A+\"; }\nelse if (marks >= 80) { grade = \"A\"; }\nelse if (marks >= 70) { grade = \"B\"; }\nelse { grade = \"C or below\"; }\ndocument.getElementById(\"output\").textContent = \"Grade: \" + grade;" },
    "js-6": { html: "<ul id=\"list\"></ul>", css: "body { font-family: sans-serif; }", js: "let students = [\n  { name: \"Usman\", city: \"Lahore\" },\n  { name: \"Ahmad\", city: \"Karachi\" },\n  { name: \"Sara\", city: \"Islamabad\" }\n];\nlet list = document.getElementById(\"list\");\nfor (let s of students) {\n  let li = document.createElement(\"li\");\n  li.textContent = s.name + \" lives in \" + s.city;\n  list.appendChild(li);\n}" },
    "js-7": { html: "<h2 id=\"postTitle\">Loading...</h2>\n<p id=\"postBody\"></p>", css: "body { font-family: sans-serif; }", js: "async function loadPost() {\n  let response = await fetch(\"https://jsonplaceholder.typicode.com/posts/1\");\n  let post = await response.json();\n  document.getElementById(\"postTitle\").textContent = post.title;\n  document.getElementById(\"postBody\").textContent = post.body;\n}\nloadPost();" },
    "js-8": { html: "<input id=\"taskInput\" placeholder=\"New task...\">\n<button id=\"addBtn\">Add</button>\n<ul id=\"taskList\"></ul>", css: "input { padding: 10px; border: 1px solid #ccc; border-radius: 6px; }\nbutton { padding: 10px 16px; background: #f59e0b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }", js: "let tasks = [];\nlet input = document.getElementById(\"taskInput\");\nlet list = document.getElementById(\"taskList\");\ndocument.getElementById(\"addBtn\").addEventListener(\"click\", function () {\n  let text = input.value.trim();\n  if (text === \"\") return;\n  tasks.push(text);\n  input.value = \"\";\n  list.innerHTML = \"\";\n  tasks.forEach(function (t) {\n    let li = document.createElement(\"li\");\n    li.textContent = t;\n    list.appendChild(li);\n  });\n});" },
    "proj-1": { html: "<div class=\"card\">\n  <img src=\"https://via.placeholder.com/150\" alt=\"Photo of Usman\">\n  <h2>Muhammad Usman</h2>\n  <p class=\"role\">AI Engineer &amp; Creator</p>\n  <p>Building AI video ads and websites in Lahore.</p>\n  <a href=\"#\">GitHub</a>\n  <a href=\"#\">Portfolio</a>\n</div>", css: ".card {\n  width: 90%;\n  max-width: 320px;\n  margin: 40px auto;\n  padding: 24px;\n  background: #ffffff;\n  border-radius: 16px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);\n  text-align: center;\n}\n.card img {\n  width: 120px;\n  height: 120px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #f59e0b;\n}\n.role { color: #6b7280; margin-top: -8px; }\n.card a {\n  display: inline-block;\n  margin: 4px;\n  padding: 8px 16px;\n  background: #f59e0b;\n  color: #111827;\n  text-decoration: none;\n  border-radius: 8px;\n  font-weight: bold;\n}", js: "" },
    "proj-2": { html: "<form id=\"contactForm\">\n  <label for=\"cName\">Your name</label>\n  <input type=\"text\" id=\"cName\" required>\n  <label for=\"cEmail\">Email</label>\n  <input type=\"email\" id=\"cEmail\" required>\n  <label for=\"cMsg\">Message</label>\n  <textarea id=\"cMsg\" rows=\"4\" required></textarea>\n  <button type=\"submit\">Send message</button>\n  <p id=\"formMsg\"></p>\n</form>", css: "form { max-width: 480px; margin: 0 auto; }\nlabel { display: block; font-weight: bold; margin: 12px 0 4px; }\ninput, textarea { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; }\nbutton[type=\"submit\"] { width: 100%; margin-top: 16px; padding: 12px; background: #f59e0b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }", js: "let form = document.getElementById(\"contactForm\");\nlet msg = document.getElementById(\"formMsg\");\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();\n  let text = document.getElementById(\"cMsg\").value.trim();\n  if (text.length < 10) {\n    msg.textContent = \"Please write a message of at least 10 characters.\";\n    msg.style.color = \"red\";\n    return;\n  }\n  msg.textContent = \"Thank you! Your message has been sent.\";\n  msg.style.color = \"green\";\n  form.reset();\n});" },
    "proj-3": { html: "<header class=\"navbar\">\n  <a class=\"logo\" href=\"#\">My Bakery</a>\n  <nav>\n    <a href=\"#\">Home</a>\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">About</a>\n    <a href=\"#\">Contact</a>\n  </nav>\n</header>\n<p style=\"padding: 16px;\">Scroll down — the navbar stays at the top.</p>", css: ".navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 20px;\n  background: #111827;\n  position: sticky;\n  top: 0;\n  z-index: 50;\n}\n.navbar nav { display: flex; gap: 20px; }\n.navbar a { color: #f9fafb; text-decoration: none; }\n.navbar .logo { font-size: 1.3rem; font-weight: 800; color: #f59e0b; }\n.navbar nav a { padding: 8px 10px; border-radius: 8px; }\n.navbar nav a:hover { background: #374151; }\n@media (max-width: 600px) {\n  .navbar { flex-wrap: wrap; gap: 8px; }\n  .navbar nav { gap: 8px; }\n}", js: "" },
    "proj-4": { html: "<div class=\"gallery\">\n  <figure><div class=\"photo\" style=\"background: #f59e0b;\">Hunza</div><figcaption>Hunza valley in autumn</figcaption></figure>\n  <figure><div class=\"photo\" style=\"background: #3b82f6;\">Sea</div><figcaption>The sea at Clifton beach</figcaption></figure>\n  <figure><div class=\"photo\" style=\"background: #10b981;\">Hills</div><figcaption>Green hills after rain</figcaption></figure>\n  <figure><div class=\"photo\" style=\"background: #ef4444;\">Desert</div><figcaption>Desert sunset</figcaption></figure>\n</div>", css: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 16px;\n}\n.gallery figure { margin: 0; transition: transform 0.2s ease; }\n.gallery figure:hover { transform: translateY(-4px); }\n.photo {\n  height: 160px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-weight: bold;\n  font-size: 1.2rem;\n}\n.gallery figcaption { text-align: center; margin-top: 8px; color: #4b5563; }", js: "" },
    "proj-5": { html: "<div class=\"todo-app\">\n  <h2>My Tasks</h2>\n  <input id=\"taskInput\" placeholder=\"New task...\">\n  <button id=\"addBtn\">Add</button>\n  <p id=\"counter\">0 tasks left</p>\n  <ul id=\"taskList\"></ul>\n  <button id=\"clearBtn\">Clear completed</button>\n</div>", css: ".todo-app { max-width: 480px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }\n#taskList { list-style: none; padding: 0; }\n#taskList li { padding: 10px; border-bottom: 1px solid #e5e7eb; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }\n#taskList li.done { text-decoration: line-through; color: #9ca3af; }", js: "let tasks = [];\nlet input = document.getElementById(\"taskInput\");\nlet list = document.getElementById(\"taskList\");\nlet counter = document.getElementById(\"counter\");\nfunction saveAndRender() {\n  localStorage.setItem(\"todo-tasks\", JSON.stringify(tasks));\n  render();\n}\nfunction render() {\n  list.innerHTML = \"\";\n  let left = 0;\n  tasks.forEach(function (task, index) {\n    if (!task.done) left++;\n    let li = document.createElement(\"li\");\n    li.textContent = task.text;\n    if (task.done) li.classList.add(\"done\");\n    li.addEventListener(\"click\", function () {\n      task.done = !task.done;\n      saveAndRender();\n    });\n    let del = document.createElement(\"button\");\n    del.textContent = \"Delete\";\n    del.addEventListener(\"click\", function (e) {\n      e.stopPropagation();\n      tasks.splice(index, 1);\n      saveAndRender();\n    });\n    li.appendChild(del);\n    list.appendChild(li);\n  });\n  counter.textContent = left + \" task\" + (left === 1 ? \"\" : \"s\") + \" left\";\n}\ndocument.getElementById(\"addBtn\").addEventListener(\"click\", function () {\n  let text = input.value.trim();\n  if (text === \"\") return;\n  tasks.push({ text: text, done: false });\n  input.value = \"\";\n  saveAndRender();\n});\ndocument.getElementById(\"clearBtn\").addEventListener(\"click\", function () {\n  tasks = tasks.filter(function (task) { return !task.done; });\n  saveAndRender();\n});\nlet saved = localStorage.getItem(\"todo-tasks\");\nif (saved) tasks = JSON.parse(saved);\nrender();" },
    "final": { html: "<header class=\"navbar\">\n  <a class=\"logo\" href=\"#\">My Bakery</a>\n  <nav>\n    <a href=\"#\">Home</a>\n    <a href=\"#\">Menu</a>\n    <a href=\"#\">Contact</a>\n  </nav>\n  <button id=\"themeBtn\">Dark mode</button>\n</header>\n<main>\n  <section class=\"hero\">\n    <h1>Fresh bread, every morning</h1>\n    <p>Warm bread, cakes and biscuits — baked at 5am.</p>\n    <a class=\"btn\" href=\"#contact\">Order now</a>\n  </section>\n  <section class=\"services\">\n    <h2>What we bake</h2>\n    <div class=\"cards\">\n      <div class=\"card\"><h3>Bread</h3><p>Fresh white and wholemeal loaves.</p></div>\n      <div class=\"card\"><h3>Cakes</h3><p>Birthday and wedding cakes to order.</p></div>\n      <div class=\"card\"><h3>Biscuits</h3><p>Crunchy biscuits in six flavours.</p></div>\n    </div>\n  </section>\n  <section id=\"contact\">\n    <h2>Contact us</h2>\n    <form id=\"contactForm\">\n      <label for=\"cName\">Your name</label>\n      <input type=\"text\" id=\"cName\" required>\n      <label for=\"cEmail\">Email</label>\n      <input type=\"email\" id=\"cEmail\" required>\n      <label for=\"cMsg\">Message</label>\n      <textarea id=\"cMsg\" rows=\"4\" required></textarea>\n      <button type=\"submit\">Send message</button>\n      <p id=\"formMsg\"></p>\n    </form>\n  </section>\n</main>", css: "body { font-family: sans-serif; margin: 0; }\n.navbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: #111827; }\n.navbar a { color: white; text-decoration: none; }\n.logo { color: #f59e0b !important; font-weight: bold; }\n.hero { text-align: center; padding: 48px 16px; background: #fef3c7; }\n.btn { display: inline-block; padding: 12px 24px; background: #f59e0b; color: #111827; text-decoration: none; border-radius: 8px; font-weight: bold; }\n.services { padding: 24px 16px; }\n.cards { display: flex; gap: 16px; }\n.card { flex: 1; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; }\nform { max-width: 480px; margin: 0 auto; }\nlabel { display: block; font-weight: bold; margin: 12px 0 4px; }\ninput, textarea { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; }\nbutton[type=\"submit\"] { width: 100%; margin-top: 16px; padding: 12px; background: #f59e0b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }\nbody.dark { background: #111827; color: #f9fafb; }\nbody.dark .hero { background: #1f2937; }\nbody.dark .card { border-color: #374151; }\n@media (max-width: 700px) { .cards { flex-direction: column; } }", js: "document.getElementById(\"themeBtn\").addEventListener(\"click\", function () {\n  document.body.classList.toggle(\"dark\");\n});\nlet form = document.getElementById(\"contactForm\");\nlet msg = document.getElementById(\"formMsg\");\nform.addEventListener(\"submit\", function (e) {\n  e.preventDefault();\n  let text = document.getElementById(\"cMsg\").value.trim();\n  if (text.length < 10) {\n    msg.textContent = \"Please write a message of at least 10 characters.\";\n    msg.style.color = \"red\";\n    return;\n  }\n  msg.textContent = \"Thank you! Your message has been sent.\";\n  msg.style.color = \"green\";\n  form.reset();\n});" },
  };

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

  /* ---------- sequential unlock: a lesson opens after the previous test is passed ---------- */
  function lessonIndex(id) {
    for (var i = 0; i < LESSONS.length; i++) {
      if (LESSONS[i].id === id) return i;
    }
    return -1;
  }
  function prevLesson(id) {
    var i = lessonIndex(id);
    return i > 0 ? LESSONS[i - 1] : null;
  }
  function nextLesson(id) {
    var i = lessonIndex(id);
    return i >= 0 && i < LESSONS.length - 1 ? LESSONS[i + 1] : null;
  }
  function isLessonAvailable(id) {
    var i = lessonIndex(id);
    if (i <= 0) return true;
    return getProgress().indexOf(LESSONS[i - 1].id) !== -1;
  }
  function lessonHrefFromHere(href) {
    /* LESSONS hrefs are root-relative ("lessons/html-2.html"); from a lesson
       page (inside lessons/) the same target is the bare file name. */
    return href.replace("lessons/", "");
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
      var row = lock.closest(".lesson-row");
      var lid = row ? row.getAttribute("data-lesson") : null;
      var lesson = null;
      if (lid) {
        for (var li = 0; li < LESSONS.length; li++) {
          if (LESSONS[li].id === lid) { lesson = LESSONS[li]; break; }
        }
      }
      /* sequential unlock: the next lesson opens only after the previous test is passed */
      if (lid && !isLessonAvailable(lid)) {
        var prev = prevLesson(lid);
        var seqNote = document.createElement("span");
        seqNote.className = "lock";
        seqNote.textContent = "🔒 Complete " + (prev ? prev.title : "the previous lesson") + "'s test to unlock";
        lock.replaceWith(seqNote);
        return;
      }
      var badge = document.createElement("span");
      badge.className = "badge-unlocked";
      badge.textContent = "✓ Unlocked";
      if (lesson && lesson.href) {
        var a = document.createElement("a");
        a.className = "open-link";
        a.href = lesson.href;
        a.textContent = "Open →";
        lock.replaceWith(badge, a);
      } else {
        var note = document.createElement("span");
        note.className = "coming-note";
        note.textContent = "Lesson page coming in Loop 3";
        lock.replaceWith(badge, note);
      }
    });
    document.querySelectorAll(".lesson-row .open-link").forEach(function (link) {
      if (link.parentNode.querySelector(".badge-unlocked")) return; /* rows unlocked above already have their badge — no double badge */
      var badge = document.createElement("span");
      badge.className = "badge-unlocked";
      badge.textContent = "✓ Unlocked";
      link.parentNode.insertBefore(badge, link.nextSibling);
    });
    if (lessonsCtaBtn) {
      lessonsCtaBtn.textContent = "Go to Dashboard";
      lessonsCtaBtn.href = "dashboard.html";
    }
  }

  /* ---------- Loop 4: lesson search ---------- */
  var lessonSearch = document.getElementById("lessonSearch");
  if (lessonSearch) {
    var noLessonMatch = document.getElementById("noLessonMatch");
    lessonSearch.addEventListener("input", function () {
      var q = lessonSearch.value.trim().toLowerCase();
      var anyVisible = false;
      document.querySelectorAll(".lesson-group").forEach(function (group) {
        var groupVisible = false;
        var heading = group.querySelector("h3");
        var moduleName = heading ? heading.textContent : "";
        group.querySelectorAll(".lesson-row").forEach(function (row) {
          var titleEl = row.querySelector(".lname");
          var title = titleEl ? titleEl.textContent : "";
          var match = !q ||
            title.toLowerCase().indexOf(q) !== -1 ||
            moduleName.toLowerCase().indexOf(q) !== -1;
          row.classList.toggle("hidden", !match);
          if (match) { groupVisible = true; anyVisible = true; }
        });
        group.classList.toggle("hidden", !groupVisible);
      });
      if (noLessonMatch) noLessonMatch.classList.toggle("hidden", anyVisible);
    });
  }

  /* ---------- lessons page: module progress, continue card, quiz badges ---------- */
  /* Runs only on lessons.html (guarded by the elements below). All numbers
     come from localStorage/LESSONS/QUIZZES — nothing invented. */
  (function lessonsEnhancements() {
    var contCard = document.getElementById("continueCard");
    var hasModProg = !!document.getElementById("modProgHtml");
    if (!contCard && !hasModProg) return;
    var done = getProgress();

    /* Per-module progress in each group heading, e.g. "3 / 5 done". */
    var MOD_PROG = [
      { mod: "HTML", el: "modProgHtml" },
      { mod: "CSS", el: "modProgCss" },
      { mod: "JavaScript", el: "modProgJs" },
      { mod: "Mini Projects", el: "modProgProj" }
    ];
    MOD_PROG.forEach(function (m) {
      var el = document.getElementById(m.el);
      if (!el) return;
      var total = 0, n = 0;
      LESSONS.forEach(function (l) {
        if (l.module === m.mod) {
          total++;
          if (done.indexOf(l.id) !== -1) n++;
        }
      });
      el.textContent = n + " / " + total + " done";
    });

    /* Continue card: only for enrolled students. */
    if (contCard && hasAccess()) {
      var next = null;
      for (var i = 0; i < LESSONS.length; i++) {
        if (done.indexOf(LESSONS[i].id) === -1) { next = LESSONS[i]; break; }
      }
      contCard.classList.remove("hidden");
      contCard.innerHTML = "";
      var h = document.createElement("h3");
      var p = document.createElement("p");
      p.style.marginBottom = "12px";
      var a = document.createElement("a");
      a.className = "btn btn-small";
      if (next) {
        h.textContent = "Continue where you left off";
        p.textContent = "Next: " + next.num + ". " + next.title;
        a.href = next.href;
        a.textContent = "Continue \u2192";
      } else {
        h.textContent = "Course complete!";
        p.textContent = "You finished all 23 lessons and projects.";
        a.href = "certificate.html";
        a.textContent = "View your certificate \u2192";
      }
      contCard.appendChild(h);
      contCard.appendChild(p);
      contCard.appendChild(a);
    }

    /* Per-row quiz best score, only where a score is stored. */
    var scores = getQuizScores();
    document.querySelectorAll(".lesson-row[data-lesson]").forEach(function (row) {
      var lid = row.getAttribute("data-lesson");
      if (!QUIZZES[lid] || scores[lid] === undefined) return;
      var badge = document.createElement("span");
      badge.className = "quiz-badge";
      badge.textContent = "Quiz " + scores[lid] + "/" + QUIZZES[lid].length;
      row.appendChild(badge);
    });

    /* Bookmarked rows show a "★ Bookmarked" badge. */
    var marks = getBookmarks();
    document.querySelectorAll(".lesson-row[data-lesson]").forEach(function (row) {
      var lid = row.getAttribute("data-lesson");
      if (marks.indexOf(lid) === -1) return;
      var bm = document.createElement("span");
      bm.className = "bookmark-badge";
      bm.textContent = "★ Bookmarked";
      row.appendChild(bm);
    });
  })();

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

      /* Second stat row: real numbers only, from localStorage. */
      var pctEl = document.getElementById("dashPct");
      if (pctEl) pctEl.textContent = Math.round((doneCount / TOTAL_LESSONS) * 100) + "%";
      var doneEl = document.getElementById("dashDone");
      if (doneEl) doneEl.textContent = doneCount + " / " + TOTAL_LESSONS;
      var quizScores = getQuizScores();
      var quizTotal = 0, quizMax = 0;
      Object.keys(QUIZZES).forEach(function (id) {
        quizMax += QUIZZES[id].length;
        if (quizScores[id] !== undefined) quizTotal += quizScores[id];
      });
      var quizEl = document.getElementById("dashQuiz");
      if (quizEl) quizEl.textContent = quizTotal + " / " + quizMax;

      /* Progress ring: same real percentage, drawn as a ring. */
      var ringFg = document.getElementById("dashRingFg");
      if (ringFg) {
        var circ = 2 * Math.PI * 52;
        ringFg.style.strokeDasharray = circ.toFixed(1);
        ringFg.style.strokeDashoffset = (circ * (1 - doneCount / TOTAL_LESSONS)).toFixed(1);
      }

      /* Progress by module: real counts from localStorage. */
      var MOD_BARS = [
        { mod: "HTML", fill: "modFillHtml", count: "modCountHtml" },
        { mod: "CSS", fill: "modFillCss", count: "modCountCss" },
        { mod: "JavaScript", fill: "modFillJs", count: "modCountJs" },
        { mod: "Mini Projects", fill: "modFillProj", count: "modCountProj" }
      ];
      MOD_BARS.forEach(function (m) {
        var total = 0, n = 0;
        LESSONS.forEach(function (l) {
          if (l.module === m.mod) {
            total++;
            if (done.indexOf(l.id) !== -1) n++;
          }
        });
        var fillEl = document.getElementById(m.fill);
        var countEl = document.getElementById(m.count);
        if (fillEl) fillEl.style.width = (total ? Math.round((n / total) * 100) : 0) + "%";
        if (countEl) countEl.textContent = n + " / " + total;
      });

      /* Next lesson card. */
      var nextCard = document.getElementById("nextLessonCard");
      if (nextCard) {
        var nextL = null;
        for (var ni = 0; ni < LESSONS.length; ni++) {
          if (done.indexOf(LESSONS[ni].id) === -1) { nextL = LESSONS[ni]; break; }
        }
        nextCard.classList.remove("hidden");
        nextCard.innerHTML = "";
        var nh = document.createElement("h3");
        var np = document.createElement("p");
        np.style.marginBottom = "12px";
        var na = document.createElement("a");
        na.className = "btn btn-small";
        if (nextL) {
          nh.textContent = "Next lesson";
          np.textContent = nextL.num + ". " + nextL.title;
          na.href = nextL.href;
          na.textContent = "Continue \u2192";
        } else {
          nh.textContent = "Course complete!";
          np.textContent = "You finished all 23 lessons and projects.";
          na.href = "certificate.html";
          na.textContent = "View your certificate \u2192";
        }
        nextCard.appendChild(nh);
        nextCard.appendChild(np);
        nextCard.appendChild(na);
      }

      var MOD_CLASS = { "HTML": "mod-html", "CSS": "mod-css", "JavaScript": "mod-js", "Mini Projects": "mod-proj" };
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
        row.className = "lesson-row" + (MOD_CLASS[l.module] ? " " + MOD_CLASS[l.module] : "");
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
        /* sequential unlock: the next lesson opens only after the previous test is passed */
        if (!isLessonAvailable(l.id)) {
          var prev = prevLesson(l.id);
          var seqNote = document.createElement("span");
          seqNote.className = "lock";
          seqNote.textContent = "🔒 Complete " + (prev ? prev.title : "the previous lesson") + "'s test to unlock";
          row.appendChild(seqNote);
          list.appendChild(row);
          return;
        }
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

      /* Bookmarked lessons section. */
      var bmList = document.getElementById("bookmarkList");
      if (bmList) {
        var bmIds = getBookmarks();
        bmList.innerHTML = "";
        if (!bmIds.length) {
          var bmEmpty = document.createElement("p");
          bmEmpty.className = "note";
          bmEmpty.textContent = "No bookmarks yet — tap ☆ on any lesson to save it here.";
          bmList.appendChild(bmEmpty);
        } else {
          LESSONS.forEach(function (l) {
            if (bmIds.indexOf(l.id) === -1) return;
            var bmRow = document.createElement("div");
            bmRow.className = "lesson-row";
            var bmNum = document.createElement("span");
            bmNum.className = "num";
            bmNum.textContent = l.num;
            var bmName = document.createElement("span");
            bmName.className = "lname";
            bmName.textContent = l.title;
            bmRow.appendChild(bmNum);
            bmRow.appendChild(bmName);
            var bmLink = document.createElement("a");
            bmLink.className = "open-link";
            bmLink.href = l.href;
            bmLink.textContent = "Open →";
            bmRow.appendChild(bmLink);
            bmList.appendChild(bmRow);
          });
        }
      }

      /* Share my progress card: real numbers only, from localStorage. */
      renderShareCard(document.getElementById("shareCard"), doneCount, quizTotal, quizMax, dacc);

      var certBox = document.getElementById("certBox");
      var regLine = "<div style=\"margin-top: 10px;\">Registration Certificate — <a href=\"registration-certificate.html\">Download (PDF)</a></div>";
      if (doneCount >= TOTAL_LESSONS) {
        certBox.className = "alert alert-ok";
        certBox.innerHTML = "<strong>Certificate ready!</strong> You finished all 23 lessons and projects." +
          regLine +
          "<div style=\"margin-top: 12px;\"><a class=\"btn btn-small\" href=\"certificate.html\">Download Completion Certificate</a></div>";
      } else {
        certBox.className = "alert";
        certBox.innerHTML = "<strong>Your certificates</strong>" +
          regLine +
          "<div style=\"margin-top: 10px;\">Completion Certificate: you have completed " + doneCount + " of " + TOTAL_LESSONS + " lessons and projects — " + (TOTAL_LESSONS - doneCount) + " remaining. <a href=\"certificate.html\">See your progress &rarr;</a></div>";
      }
    }
  }

  /* ---------- Loop 4: certificate page ---------- */
  function formatDate(iso) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return iso;
    var m = parseInt(parts[1], 10);
    if (!m || m < 1 || m > 12) return iso;
    return parseInt(parts[2], 10) + " " + months[m - 1] + " " + parts[0];
  }
  var certLocked = document.getElementById("certLocked");
  var certProgress = document.getElementById("certProgress");
  var certReady = document.getElementById("certReady");
  if (certLocked && certProgress && certReady) {
    var cacc = getAccess();
    var preview = false;
    try {
      preview = new URLSearchParams(window.location.search).get("preview") === "1";
    } catch (e) {}
    var certDone = getProgress().filter(function (id) {
      return LESSONS.some(function (l) { return l.id === id; });
    });
    var certDoneCount = certDone.length;
    var certCompletedAll = certDoneCount >= TOTAL_LESSONS;
    var certPdfDate = "";
    if (!cacc) {
      certLocked.classList.remove("hidden");
    } else if (certCompletedAll || preview) {
      document.getElementById("certName").textContent = cacc.name;
      document.getElementById("certId").textContent = "WDL-" + cacc.code;
      var certVerifyLink = document.getElementById("verifyCertLink");
      if (certVerifyLink) certVerifyLink.href = "verify.html?id=" + encodeURIComponent("WDL-" + cacc.code);
      document.getElementById("certBatch").textContent = WEBDEV_CONFIG.batch;
      var completedDate = null;
      try { completedDate = localStorage.getItem(COMPLETED_KEY); } catch (e) {}
      if (certCompletedAll && !completedDate) {
        completedDate = new Date().toISOString().slice(0, 10);
        try { localStorage.setItem(COMPLETED_KEY, completedDate); } catch (e) {}
      }
      if (!completedDate) completedDate = new Date().toISOString().slice(0, 10);
      certPdfDate = completedDate;
      document.getElementById("certDate").textContent = formatDate(completedDate);
      if (preview && !certCompletedAll) {
        document.getElementById("certPreviewNote").classList.remove("hidden");
      }
      certReady.classList.remove("hidden");
    } else {
      var remaining = LESSONS.filter(function (l) {
        return certDone.indexOf(l.id) === -1;
      });
      document.getElementById("certProgressText").textContent =
        "You have completed " + certDoneCount + " of " + TOTAL_LESSONS +
        " lessons and projects — " + remaining.length + " remaining.";
      var remList = document.getElementById("certRemaining");
      remList.innerHTML = "";
      remaining.forEach(function (l) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = l.href;
        a.textContent = l.num + ". " + l.title;
        li.appendChild(a);
        remList.appendChild(li);
      });
      certProgress.classList.remove("hidden");
    }
    var certPrintBtn = document.getElementById("certPrintBtn");
    if (certPrintBtn) {
      certPrintBtn.addEventListener("click", function () { window.print(); });
    }
    var certDownloadBtn = document.getElementById("certDownloadBtn");
    if (certDownloadBtn) {
      certDownloadBtn.addEventListener("click", function () {
        if (typeof buildCertificatePDF !== "function" || typeof downloadCertificatePDF !== "function") {
          window.print();
          return;
        }
        var pdfDate = certPdfDate || new Date().toISOString().slice(0, 10);
        var bytes = buildCertificatePDF({
          title: "Certificate of Completion",
          presentedTo: "This certificate is proudly presented to",
          name: cacc ? cacc.name : "Student",
          bodyLines: ["has successfully completed", "WebDev Lab - HTML, CSS & JavaScript"],
          batch: WEBDEV_CONFIG.batch,
          dateLabel: "Date Issued",
          date: formatDate(pdfDate),
          certId: "WDL-" + (cacc ? cacc.code : ""),
          signature: "Muhammad Usman",
          signatureSub: "Founder & CEO, Rakhzaar Tech",
          logoJpeg: (typeof WEBDEV_LAB_LOGO_JPEG !== "undefined" ? WEBDEV_LAB_LOGO_JPEG : null)
        });
        downloadCertificatePDF(bytes, certFileName(cacc ? cacc.name : "Student", "Completion"));
      });
    }
  }

  /* ---------- certificate logo: real image when available ---------- */
  /* On both certificate pages the <img id="certLogo"> shows the real logo
     from logo.js. If the logo did not load, the img stays hidden and the
     drawn "WL" monogram behind it stays visible — never a broken image. */
  (function setCertLogo() {
    var img = document.getElementById("certLogo");
    if (!img) return;
    if (typeof WEBDEV_LAB_LOGO_JPEG === "string" && WEBDEV_LAB_LOGO_JPEG.length > 1000) {
      img.src = "data:image/jpeg;base64," + WEBDEV_LAB_LOGO_JPEG;
      img.classList.remove("hidden");
      var fb = img.parentNode ? img.parentNode.querySelector(".cert-logo-fallback") : null;
      if (fb) fb.classList.add("hidden");
    }
  })();

  /* ---------- header + footer logos ---------- */
  /* Every .site-logo-img (header on all pages, footer brand column) shows
     the real logo from logo.js. If the logo did not load, the imgs stay
     hidden and the "WebDev Lab" text still shows — never a broken image. */
  (function setSiteLogos() {
    if (typeof WEBDEV_LAB_LOGO_JPEG !== "string" || WEBDEV_LAB_LOGO_JPEG.length <= 1000) return;
    var imgs = document.querySelectorAll(".site-logo-img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].src = "data:image/jpeg;base64," + WEBDEV_LAB_LOGO_JPEG;
      imgs[i].classList.add("show");
    }
  })();

  /* ---------- home page module illustrations ---------- */
  /* Each roadmap card shows its real illustration from illustrations.js.
     If an illustration did not load, its frame stays hidden — never a
     broken image. Runs on every page; on non-home pages the elements
     simply do not exist. */
  (function setModuleIllustrations() {
    function setOne(frameId, imgId, data) {
      var frame = document.getElementById(frameId);
      var img = document.getElementById(imgId);
      if (!frame || !img) return;
      if (typeof data === "string" && data.length > 1000) {
        img.src = "data:image/jpeg;base64," + data;
        frame.classList.remove("hidden");
      }
    }
    setOne("illuHtmlFrame", "illuHtml", typeof ILLU_HTML !== "undefined" ? ILLU_HTML : null);
    setOne("illuCssFrame", "illuCss", typeof ILLU_CSS !== "undefined" ? ILLU_CSS : null);
    setOne("illuJsFrame", "illuJs", typeof ILLU_JS !== "undefined" ? ILLU_JS : null);
    setOne("illuProjectsFrame", "illuProjects", typeof ILLU_PROJECTS !== "undefined" ? ILLU_PROJECTS : null);
  })();

  /* ---------- registration certificate page ---------- */
  var regLocked = document.getElementById("regLocked");
  var regReady = document.getElementById("regReady");
  if (regLocked && regReady) {
    var racc = getAccess();
    var regPreview = false;
    try {
      regPreview = new URLSearchParams(window.location.search).get("preview") === "1";
    } catch (e) {}
    if (!racc) {
      regLocked.classList.remove("hidden");
    } else {
      var regDate = getRegisteredDate(racc);
      document.getElementById("regName").textContent = racc.name;
      document.getElementById("regId").textContent = "WDL-REG-" + racc.code;
      var regVerifyLink = document.getElementById("verifyCertLink");
      if (regVerifyLink) regVerifyLink.href = "verify.html?id=" + encodeURIComponent("WDL-REG-" + racc.code);
      document.getElementById("regBatch").textContent = WEBDEV_CONFIG.batch;
      document.getElementById("regDate").textContent = formatDate(regDate);
      if (regPreview) document.getElementById("regPreviewNote").classList.remove("hidden");
      regReady.classList.remove("hidden");
      var regPrintBtn = document.getElementById("regPrintBtn");
      if (regPrintBtn) {
        regPrintBtn.addEventListener("click", function () { window.print(); });
      }
      var regDownloadBtn = document.getElementById("regDownloadBtn");
      if (regDownloadBtn) {
        regDownloadBtn.addEventListener("click", function () {
          if (typeof buildCertificatePDF !== "function" || typeof downloadCertificatePDF !== "function") {
            window.print();
            return;
          }
          var bytes = buildCertificatePDF({
            title: "Certificate of Registration",
            presentedTo: "This certificate is proudly presented to",
            name: racc.name,
            bodyLines: ["is registered for", "WebDev Lab - HTML, CSS & JavaScript"],
            batch: WEBDEV_CONFIG.batch,
            dateLabel: "Date Registered",
            date: formatDate(regDate),
            certId: "WDL-REG-" + racc.code,
            idLabel: "Registration ID",
            signature: "Muhammad Usman",
            signatureSub: "Founder & CEO, Rakhzaar Tech",
            logoJpeg: (typeof WEBDEV_LAB_LOGO_JPEG !== "undefined" ? WEBDEV_LAB_LOGO_JPEG : null)
          });
          downloadCertificatePDF(bytes, certFileName(racc.name, "Registration"));
        });
      }
    }
  }

  /* ---------- Loop 3: locked lesson / project pages ---------- */
  var lockBox = document.getElementById("lockBox");
  var lessonBody = document.getElementById("lessonBody");
  if (lockBox && lessonBody) {
    var quizBoxEl = document.getElementById("quizBox");
    var lockLid = quizBoxEl ? quizBoxEl.getAttribute("data-lesson") : null;
    var needsEnroll = lockLid ? lessonIndex(lockLid) >= 3 : false;
    if (!hasAccess() && needsEnroll) {
      /* not enrolled and this lesson needs enrollment — show the enroll lock */
      lockBox.classList.remove("hidden");
      lessonBody.classList.add("hidden");
    } else if (lockLid && !isLessonAvailable(lockLid)) {
      /* enrolled (or free lesson) but the previous test is not passed yet */
      var lockPrev = prevLesson(lockLid);
      lockBox.innerHTML =
        "<h3>\uD83D\uDD12 Complete " + (lockPrev ? lockPrev.title : "the previous lesson") + "'s test to unlock this lesson</h3>" +
        "<p>Pass the test in \"" + (lockPrev ? lockPrev.num + ". " + lockPrev.title : "the previous lesson") +
        "\" first \u2014 then this lesson opens.</p>" +
        (lockPrev ? "<a class=\"btn\" href=\"" + lessonHrefFromHere(lockPrev.href) + "\">Go to the previous lesson \u2192</a>" : "");
      lockBox.classList.remove("hidden");
      lessonBody.classList.add("hidden");
    } else {
      lockBox.classList.add("hidden");
      lessonBody.classList.remove("hidden");
    }
  }

  /* hide the static "Next" link in the lesson nav while the next lesson is still locked
     (a failed test must not show a Next button that only leads to a lock box) */
  function updateLessonNavNext(lid) {
    var nav = document.querySelector(".lesson-nav");
    if (!nav || !lid) return;
    var next = nextLesson(lid);
    var links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (href.indexOf("lessons.html") === -1 && href.slice(-5) === ".html") {
        if (next && isLessonAvailable(next.id)) {
          links[i].classList.remove("hidden");
        } else {
          links[i].classList.add("hidden");
        }
      }
    }
  }
  (function () {
    var qb = document.getElementById("quizBox");
    if (qb) updateLessonNavNext(qb.getAttribute("data-lesson"));
  })();

  /* ---------- Loop 3: quizzes ---------- */
  function getQuizScores() {
    try {
      var s = JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}");
      return s && typeof s === "object" ? s : {};
    } catch (e) { return {}; }
  }
  function saveQuizScore(id, score) {
    var scores = getQuizScores();
    if (scores[id] === undefined || score > scores[id]) {
      scores[id] = score;
      try { localStorage.setItem(QUIZ_KEY, JSON.stringify(scores)); } catch (e) {}
    }
    return scores[id];
  }
  /* ---------- congratulations overlay + flower shower (only when a test is passed) ---------- */
  function showCelebration(lid, score, total) {
    var lesson = null;
    for (var i = 0; i < LESSONS.length; i++) {
      if (LESSONS[i].id === lid) { lesson = LESSONS[i]; break; }
    }
    var overlay = document.createElement("div");
    overlay.className = "celebration-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Congratulations");

    var flowers = document.createElement("div");
    flowers.className = "celebration-flowers";
    var emojis = ["\uD83C\uDF38", "\uD83C\uDF3C", "\uD83C\uDF3A", "\uD83C\uDF37", "\uD83D\uDCAE"];
    for (var f = 0; f < 40; f++) {
      var flower = document.createElement("span");
      flower.className = "flower";
      flower.textContent = emojis[f % emojis.length];
      /* denser streams from the left and right edges, a few in the middle */
      var band = f % 10;
      var left;
      if (band < 3) left = Math.random() * 18;            /* left edge stream */
      else if (band < 6) left = 82 + Math.random() * 18;  /* right edge stream */
      else left = 18 + Math.random() * 64;                /* middle scatter */
      flower.style.left = left.toFixed(1) + "%";
      flower.style.fontSize = (18 + Math.floor(Math.random() * 23)) + "px";
      flower.style.animationDuration = (2.2 + Math.random() * 1.0).toFixed(2) + "s, " +
        (0.5 + Math.random() * 0.5).toFixed(2) + "s";
      flower.style.animationDelay = (Math.random() * 1.0).toFixed(2) + "s, 0s";
      flowers.appendChild(flower);
    }
    overlay.appendChild(flowers);

    var card = document.createElement("div");
    card.className = "celebration-card";
    var closeBtn = document.createElement("button");
    closeBtn.className = "celebration-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u00D7";
    closeBtn.addEventListener("click", function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
    card.appendChild(closeBtn);
    var title = document.createElement("h2");
    title.textContent = "\uD83C\uDF89 Congratulations!";
    card.appendChild(title);
    var msg = document.createElement("p");
    msg.textContent = "You passed the " + (lesson ? lesson.title : "lesson") + " test!";
    card.appendChild(msg);
    var scoreEl = document.createElement("p");
    scoreEl.className = "celebration-score";
    scoreEl.textContent = "Score: " + score + "/" + total;
    card.appendChild(scoreEl);
    var next = nextLesson(lid);
    var nextBtn = document.createElement("a");
    nextBtn.className = "btn";
    if (next) {
      nextBtn.href = lessonHrefFromHere(next.href);
      nextBtn.textContent = "Next Lesson \u2192";
    } else {
      nextBtn.href = "../certificate.html";
      nextBtn.textContent = "View your certificate \u2192";
    }
    card.appendChild(nextBtn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    /* the flowers stop after about 4 seconds; the card stays until closed or Next is clicked */
    setTimeout(function () {
      if (flowers.parentNode) flowers.parentNode.removeChild(flowers);
    }, 4500);
  }

  (function renderQuiz() {
    var box = document.getElementById("quizBox");
    if (!box) return;
    var lid = box.getAttribute("data-lesson");
    var quiz = QUIZZES[lid];
    var qWrap = document.getElementById("quizQuestions");
    var resultEl = document.getElementById("quizResult");
    var bestEl = document.getElementById("quizBest");
    var submitBtn = document.getElementById("quizSubmit");
    if (!quiz || !qWrap || !submitBtn) return;
    function showBest() {
      var scores = getQuizScores();
      if (bestEl) {
        bestEl.textContent = scores[lid] !== undefined
          ? "Best score: " + scores[lid] + "/" + quiz.length
          : "You have not taken this quiz yet.";
      }
    }
    function build() {
      qWrap.innerHTML = "";
      resultEl.innerHTML = "";
      submitBtn.classList.remove("hidden");
      quiz.forEach(function (item, qi) {
        var qDiv = document.createElement("div");
        qDiv.className = "quiz-q";
        var title = document.createElement("p");
        title.className = "quiz-q-title";
        title.textContent = (qi + 1) + ". " + item.q;
        qDiv.appendChild(title);
        item.options.forEach(function (opt, oi) {
          var label = document.createElement("label");
          label.className = "quiz-opt";
          var radio = document.createElement("input");
          radio.type = "radio";
          radio.name = "quiz-" + lid + "-" + qi;
          radio.value = oi;
          label.appendChild(radio);
          label.appendChild(document.createTextNode(" " + opt));
          qDiv.appendChild(label);
        });
        qWrap.appendChild(qDiv);
      });
      showBest();
    }
    build();
    submitBtn.addEventListener("click", function () {
      var score = 0;
      quiz.forEach(function (item, qi) {
        var picked = qWrap.querySelector('input[name="quiz-' + lid + '-' + qi + '"]:checked');
        var chosen = picked ? parseInt(picked.value, 10) : -1;
        var qDiv = qWrap.children[qi];
        var labels = qDiv.querySelectorAll(".quiz-opt");
        labels.forEach(function (lab, oi) {
          lab.classList.remove("quiz-right", "quiz-wrong");
          if (oi === item.answer) lab.classList.add("quiz-right");
          if (oi === chosen && chosen !== item.answer) lab.classList.add("quiz-wrong");
        });
        if (chosen === item.answer) score++;
        var why = document.createElement("p");
        why.className = "quiz-why";
        why.textContent = (chosen === item.answer ? "✓ Correct. " : "✗ The right answer is: " + item.options[item.answer] + ". ") + item.why;
        qDiv.appendChild(why);
      });
      var best = saveQuizScore(lid, score);
      resultEl.innerHTML = "";
      var scoreP = document.createElement("p");
      scoreP.className = "quiz-score";
      scoreP.textContent = "You scored " + score + " out of " + quiz.length + ". Best score: " + best + "/" + quiz.length + ".";
      resultEl.appendChild(scoreP);
      var actions = document.createElement("div");
      actions.className = "quiz-actions";
      if (score >= 2) {
        /* pass: the lesson is complete and the next lesson opens */
        var done = getProgress();
        if (done.indexOf(lid) === -1) {
          done.push(lid);
          saveProgress(done);
        }
        updateProgressBar();
        updateLessonNavNext(lid); /* the static nav Next link appears now that the next lesson is unlocked */
        var passP = document.createElement("p");
        passP.className = "quiz-pass";
        passP.textContent = "\u2713 You passed! This lesson is complete.";
        resultEl.appendChild(passP);
        var next = nextLesson(lid);
        var nextBtn = document.createElement("a");
        nextBtn.className = "btn";
        if (next) {
          nextBtn.href = lessonHrefFromHere(next.href);
          nextBtn.textContent = "Next Lesson \u2192";
        } else {
          nextBtn.href = "../certificate.html";
          nextBtn.textContent = "View your certificate \u2192";
        }
        actions.appendChild(nextBtn);
        var retakePass = document.createElement("button");
        retakePass.className = "btn btn-outline btn-small";
        retakePass.textContent = "Retake quiz";
        retakePass.addEventListener("click", build);
        actions.appendChild(retakePass);
        resultEl.appendChild(actions);
        showCelebration(lid, score, quiz.length);
      } else {
        var failP = document.createElement("p");
        failP.className = "quiz-fail-note";
        failP.textContent = "You need 2 out of 3 to pass. Read the lesson again and try as many times as you like.";
        resultEl.appendChild(failP);
        var retake = document.createElement("button");
        retake.className = "btn btn-outline btn-small";
        retake.textContent = "Retake quiz";
        retake.addEventListener("click", build);
        actions.appendChild(retake);
        resultEl.appendChild(actions);
      }
      submitBtn.classList.add("hidden");
      showBest();
      resultEl.scrollIntoView({ behavior: "smooth" });
    });
  })();

  /* ---------- Loop 3: project checklists ---------- */
  var CHECK_KEY = "webdevlab-checklists";
  function getChecklists() {
    try {
      var c = JSON.parse(localStorage.getItem(CHECK_KEY) || "{}");
      return c && typeof c === "object" ? c : {};
    } catch (e) { return {}; }
  }
  document.querySelectorAll("[data-checklist]").forEach(function (box) {
    var pid = box.getAttribute("data-checklist");
    var saved = getChecklists()[pid] || [];
    function refreshCount() {
      var el = box.querySelector(".checklist-count");
      if (!el) return;
      var boxes = box.querySelectorAll("input[type=checkbox]");
      var n = 0;
      boxes.forEach(function (cb) { if (cb.checked) n++; });
      el.textContent = n + " of " + boxes.length + " done";
    }
    box.querySelectorAll("input[type=checkbox]").forEach(function (cb, idx) {
      cb.checked = saved.indexOf(idx) !== -1;
      cb.addEventListener("change", function () {
        var lists = getChecklists();
        var cur = lists[pid] || [];
        var pos = cur.indexOf(idx);
        if (cb.checked && pos === -1) cur.push(idx);
        if (!cb.checked && pos !== -1) cur.splice(pos, 1);
        lists[pid] = cur;
        try { localStorage.setItem(CHECK_KEY, JSON.stringify(lists)); } catch (e) {}
        refreshCount();
      });
    });
    refreshCount();
  });

  /* ---------- Loop 3: code editor ---------- */
  var edHtml = document.getElementById("edHtml");
  if (edHtml) {
    var edCss = document.getElementById("edCss");
    var edJs = document.getElementById("edJs");
    var preview = document.getElementById("previewFrame");
    var runBtn = document.getElementById("runBtn");
    var resetBtn = document.getElementById("resetBtn");
    var copyBtn = document.getElementById("copyBtn");
    var editorMsg = document.getElementById("editorMsg");
    var activeTab = "html";
    var lessonId = null;
    try {
      var ep = new URLSearchParams(window.location.search);
      lessonId = ep.get("lesson");
    } catch (e) {}
    function starterFor(id) {
      if (id && STARTER_CODE[id]) return STARTER_CODE[id];
      return STARTER_CODE["default"];
    }
    function loadStarter() {
      var s = starterFor(lessonId);
      edHtml.value = s.html || "";
      edCss.value = s.css || "";
      edJs.value = s.js || "";
    }
    function buildDoc() {
      var safeJs = (edJs.value || "").split("</scr" + "ipt").join("<" + String.fromCharCode(92) + "/script");
      return "<!DOCTYPE html><html><head><meta charset=" + '"UTF-8"' + "><style>" + (edCss.value || "") + "</style></head><body>" + (edHtml.value || "") + "<script>" + safeJs + "</scr" + "ipt></body></html>";
    }
    function runPreview() {
      if (preview) preview.srcdoc = buildDoc();
    }
    function showTab(tab) {
      activeTab = tab;
      document.querySelectorAll(".tab-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-tab") === tab);
      });
      edHtml.classList.toggle("hidden", tab !== "html");
      edCss.classList.toggle("hidden", tab !== "css");
      edJs.classList.toggle("hidden", tab !== "js");
    }
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); });
    });
    var debounce = null;
    [edHtml, edCss, edJs].forEach(function (ta) {
      ta.addEventListener("input", function () {
        clearTimeout(debounce);
        debounce = setTimeout(runPreview, 800);
      });
    });
    if (runBtn) runBtn.addEventListener("click", runPreview);
    if (resetBtn) resetBtn.addEventListener("click", function () {
      loadStarter();
      runPreview();
      if (editorMsg) editorMsg.textContent = "Starter code restored.";
    });
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var text = activeTab === "css" ? edCss.value : activeTab === "js" ? edJs.value : edHtml.value;
      function done() { if (editorMsg) editorMsg.textContent = "Copied " + activeTab.toUpperCase() + " code."; }
      function fail() { if (editorMsg) editorMsg.textContent = "Copy failed — select the code and copy it by hand."; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fail);
      } else {
        var ta = activeTab === "css" ? edCss : activeTab === "js" ? edJs : edHtml;
        ta.focus();
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { fail(); }
      }
    });
    var lessonTitle = document.getElementById("editorLesson");
    if (lessonTitle) {
      var found = null;
      if (lessonId) {
        for (var li = 0; li < LESSONS.length; li++) {
          if (LESSONS[li].id === lessonId) { found = LESSONS[li]; break; }
        }
      }
      lessonTitle.textContent = found ? "Starter code: " + found.title : "Starter code: a blank page";
    }
    loadStarter();
    runPreview();
  }

  /* ---------- notes + bookmarks (lesson pages) ---------- */
  function getNotes() {
    try {
      var n = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
      return n && typeof n === "object" ? n : {};
    } catch (e) { return {}; }
  }
  function getBookmarks() {
    try {
      var b = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
      return Array.isArray(b) ? b : [];
    } catch (e) { return []; }
  }
  function saveBookmarks(list) {
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  (function lessonNotes() {
    var box = document.getElementById("notesBox");
    if (!box) return;
    var qb = document.getElementById("quizBox");
    var lid = qb ? qb.getAttribute("data-lesson") : null;
    if (!lid) return;
    var ta = document.getElementById("lessonNotes");
    var savedEl = document.getElementById("notesSaved");
    if (ta) {
      ta.value = getNotes()[lid] || "";
      var saveTimer = null;
      ta.addEventListener("input", function () {
        var notes = getNotes();
        notes[lid] = ta.value;
        try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (e) {}
        if (savedEl) savedEl.textContent = "Saved ✓";
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          if (savedEl) savedEl.textContent = "";
        }, 2000);
      });
    }
    var bmBtn = document.getElementById("bookmarkBtn");
    if (bmBtn) {
      function refreshBm() {
        var on = getBookmarks().indexOf(lid) !== -1;
        bmBtn.textContent = on ? "★ Bookmarked" : "☆ Bookmark this lesson";
        bmBtn.classList.toggle("bookmarked", on);
      }
      bmBtn.addEventListener("click", function () {
        var list = getBookmarks();
        var pos = list.indexOf(lid);
        if (pos === -1) list.push(lid); else list.splice(pos, 1);
        saveBookmarks(list);
        refreshBm();
      });
      refreshBm();
    }
  })();

  /* ---------- share my progress (dashboard + leaderboard) ---------- */
  function shareProgressText(doneCount, quizTotal, quizMax) {
    var pct = Math.round((doneCount / TOTAL_LESSONS) * 100);
    return "I've completed " + doneCount + "/23 lessons in WebDev Lab (Batch 1) — " +
      "Quiz best " + quizTotal + "/" + quizMax + " (" + pct + "%)! " +
      "Learn HTML, CSS & JavaScript: https://usmankalera-dev.github.io/webdev-lab/";
  }
  function renderShareCard(container, doneCount, quizTotal, quizMax, acc) {
    if (!container) return;
    container.innerHTML = "";
    var head = document.createElement("div");
    head.className = "share-head";
    var mark = document.createElement("span");
    mark.className = "share-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "\u2197";
    head.appendChild(mark);
    var h = document.createElement("h3");
    h.style.margin = "0";
    h.textContent = "Share my progress";
    head.appendChild(h);
    container.appendChild(head);
    var p = document.createElement("p");
    p.textContent = "Lessons " + doneCount + " / 23 · Quiz best " + quizTotal + " / " + quizMax +
      " · " + Math.round((doneCount / TOTAL_LESSONS) * 100) + "% complete";
    container.appendChild(p);
    var row = document.createElement("div");
    row.className = "share-actions";
    var wa = document.createElement("a");
    wa.className = "btn btn-small";
    if (container.getAttribute("data-share") === "leaderboard") {
      var name = acc && acc.name ? acc.name : "Student";
      wa.href = "https://wa.me/" + WEBDEV_CONFIG.whatsapp + "?text=" + encodeURIComponent(
        "Hi Usman, here are my WebDev Lab scores for the leaderboard. My name is " + name +
        ". Lessons " + doneCount + "/23, quiz best " + quizTotal + "/" + quizMax +
        ". Please add me to the leaderboard.");
      wa.textContent = "Send scores to Usman";
    } else {
      wa.href = "https://wa.me/?text=" + encodeURIComponent(shareProgressText(doneCount, quizTotal, quizMax));
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.textContent = "Share on WhatsApp";
    }
    row.appendChild(wa);
    var copyBtn = document.createElement("button");
    copyBtn.className = "btn btn-outline btn-small";
    copyBtn.type = "button";
    copyBtn.textContent = "Copy for Instagram";
    copyBtn.addEventListener("click", function () {
      var text = shareProgressText(doneCount, quizTotal, quizMax);
      function done() {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy for Instagram"; }, 2000);
      }
      function fail() { copyBtn.textContent = "Copy failed — select the text and copy it by hand."; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fail);
      } else { fail(); }
    });
    row.appendChild(copyBtn);
    container.appendChild(row);
  }

  /* ---------- certificate verify page ---------- */
  (function verifyPage() {
    var form = document.getElementById("verifyForm");
    if (!form) return;
    var input = document.getElementById("verifyInput");
    var result = document.getElementById("verifyResult");
    function check(raw) {
      var clean = String(raw || "").toUpperCase().replace(/[\s\-]/g, "");
      var type = null, code = null;
      if (clean.indexOf("WDLREG") === 0) { type = "Registration"; code = clean.slice(6); }
      else if (clean.indexOf("WDL") === 0) { type = "Completion"; code = clean.slice(3); }
      else return { ok: false };
      var found = null;
      for (var i = 0; i < ACCESS_CODES.length; i++) {
        if (normalizeCode(ACCESS_CODES[i]) === code) { found = ACCESS_CODES[i]; break; }
      }
      if (!found) return { ok: false };
      return { ok: true, type: type, code: found };
    }
    function show(raw) {
      var r = check(raw);
      result.classList.remove("hidden");
      if (r.ok) {
        result.className = "alert alert-ok";
        result.innerHTML = "<strong>Valid certificate.</strong> This ID matches a WebDev Lab Batch 1 " +
          r.type + " certificate — code " + r.code + ".";
      } else {
        result.className = "alert alert-err";
        result.textContent = "This is not a valid WebDev Lab certificate ID.";
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      show(input.value);
    });
    /* prefill from ?id= (certificate pages link here with their ID) */
    try {
      var id = new URLSearchParams(window.location.search).get("id");
      if (id) { input.value = id; show(id); }
    } catch (e) {}
  })();

  /* ---------- leaderboard page (manual list — no server) ---------- */
  (function leaderboardPage() {
    var list = document.getElementById("leaderboardList");
    if (!list) return;
    var done = getProgress();
    var scores = getQuizScores();
    var qt = 0, qm = 0;
    Object.keys(QUIZZES).forEach(function (id) {
      qm += QUIZZES[id].length;
      if (scores[id] !== undefined) qt += scores[id];
    });
    renderShareCard(document.getElementById("shareCard"), done.length, qt, qm, getAccess());
    function emptyState() {
      list.innerHTML = "";
      var card = document.createElement("div");
      card.className = "card empty-state";
      var podium = document.createElement("div");
      podium.className = "podium";
      [[2, "podium-rank-2", false], [1, "podium-rank-1", true], [3, "podium-rank-3", false]].forEach(function (slot) {
        var s = document.createElement("div");
        s.className = "podium-slot" + (slot[2] ? " podium-first" : "");
        var r = document.createElement("span");
        r.className = "podium-rank " + slot[1];
        r.textContent = slot[0];
        var n = document.createElement("span");
        n.className = "podium-name";
        n.textContent = "—";
        s.appendChild(r);
        s.appendChild(n);
        podium.appendChild(s);
      });
      card.appendChild(podium);
      var p = document.createElement("p");
      p.textContent = "No scores yet — Batch 1 starts 1 December 2026. Share your progress with Usman on WhatsApp and your name will appear here.";
      card.appendChild(p);
      list.appendChild(card);
    }
    fetch("leaderboard.json").then(function (resp) {
      if (!resp.ok) throw new Error("no file");
      return resp.json();
    }).then(function (data) {
      var entries = (data && Array.isArray(data.entries)) ? data.entries : [];
      entries = entries.filter(function (e) {
        return e && typeof e.name === "string" && typeof e.lessonsDone === "number" && typeof e.quizBest === "number";
      });
      if (!entries.length) { emptyState(); return; }
      entries.sort(function (a, b) {
        if (b.lessonsDone !== a.lessonsDone) return b.lessonsDone - a.lessonsDone;
        return b.quizBest - a.quizBest;
      });
      var wrap = document.createElement("div");
      wrap.className = "leaderboard-wrap";
      var table = document.createElement("table");
      table.className = "leaderboard-table";
      var head = document.createElement("tr");
      ["Rank", "Name", "Lessons", "Quiz best"].forEach(function (t, hi) {
        var th = document.createElement("th");
        if (hi === 0) th.className = "rank-cell";
        if (hi >= 2) th.className = "num-cell";
        th.textContent = t;
        head.appendChild(th);
      });
      table.appendChild(head);
      entries.forEach(function (e, i) {
        var tr = document.createElement("tr");
        var rank = document.createElement("td");
        rank.className = "rank-cell";
        if (i < 3) {
          var b = document.createElement("span");
          b.className = "rank-badge rank-" + (i + 1);
          b.textContent = i + 1;
          rank.appendChild(b);
        } else {
          rank.textContent = i + 1;
        }
        var name = document.createElement("td"); name.textContent = e.name;
        var lessons = document.createElement("td"); lessons.className = "num-cell"; lessons.textContent = e.lessonsDone + " / 23";
        var quiz = document.createElement("td"); quiz.className = "num-cell"; quiz.textContent = e.quizBest + " / " + qm;
        tr.appendChild(rank); tr.appendChild(name); tr.appendChild(lessons); tr.appendChild(quiz);
        table.appendChild(tr);
      });
      list.innerHTML = "";
      wrap.appendChild(table);
      list.appendChild(wrap);
    }).catch(function () { emptyState(); });
  })();

  /* ---------- final project page ---------- */
  (function finalProjectPage() {
    var wrap = document.getElementById("finalProject");
    if (!wrap) return;
    var acc = getAccess();
    var done = getProgress();
    var doneCount = 0;
    LESSONS.forEach(function (l) { if (done.indexOf(l.id) !== -1) doneCount++; });
    var lockEl = document.getElementById("finalLock");
    var bodyEl = document.getElementById("finalBody");
    if (!acc) {
      if (lockEl) lockEl.classList.remove("hidden");
      if (bodyEl) bodyEl.classList.add("hidden");
      return;
    }
    if (lockEl) lockEl.classList.add("hidden");
    if (bodyEl) bodyEl.classList.remove("hidden");
    var submitWrap = document.getElementById("finalSubmit");
    if (submitWrap) {
      submitWrap.innerHTML = "";
      if (doneCount >= TOTAL_LESSONS) {
        var a = document.createElement("a");
        a.className = "btn";
        a.target = "_blank";
        a.rel = "noopener";
        a.href = "https://wa.me/" + WEBDEV_CONFIG.whatsapp + "?text=" + encodeURIComponent(
          "Hi Usman, I finished my WebDev Lab Final Project! My name is " + acc.name +
          " (code " + acc.code + "). I built a complete business landing page with HTML, CSS and JavaScript.");
        a.textContent = "Submit my project";
        submitWrap.appendChild(a);
      } else {
        var p = document.createElement("p");
        p.className = "note";
        p.textContent = "Complete all 23 lessons to submit your Final Project. You have completed " + doneCount + " of 23.";
        submitWrap.appendChild(p);
      }
    }
    /* student showcase (manual list — no server) */
    var showList = document.getElementById("showcaseList");
    if (showList) {
      fetch("showcase.json").then(function (resp) {
        if (!resp.ok) throw new Error("no file");
        return resp.json();
      }).then(function (data) {
        var entries = (data && Array.isArray(data.entries)) ? data.entries : [];
        entries = entries.filter(function (e) {
          return e && typeof e.name === "string" && typeof e.projectTitle === "string" && typeof e.link === "string";
        });
        showList.innerHTML = "";
        if (!entries.length) {
          var ep = document.createElement("p");
          ep.className = "note";
          ep.textContent = "Student projects will appear here after Batch 1 graduates.";
          showList.appendChild(ep);
          return;
        }
        var grid = document.createElement("div");
        grid.className = "grid grid-3";
        entries.forEach(function (e) {
          var card = document.createElement("div");
          card.className = "card";
          var h = document.createElement("h3");
          h.textContent = e.projectTitle;
          var n = document.createElement("p");
          n.textContent = "by " + e.name;
          var link = document.createElement("a");
          link.className = "btn btn-small";
          link.href = e.link;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "View project →";
          card.appendChild(h); card.appendChild(n); card.appendChild(link);
          grid.appendChild(card);
        });
        showList.appendChild(grid);
      }).catch(function () {
        showList.innerHTML = "";
        var ep2 = document.createElement("p");
        ep2.className = "note";
        ep2.textContent = "Student projects will appear here after Batch 1 graduates.";
        showList.appendChild(ep2);
      });
    }
  })();

  /* ---------- free demo class booking (home page) ---------- */
  (function demoBooking() {
    var section = document.getElementById("demoSection");
    if (!section) return;
    var dateInput = document.getElementById("demoDate");
    var nameInput = document.getElementById("demoName");
    var phoneInput = document.getElementById("demoPhone");
    var msg = document.getElementById("demoMsg");
    var btn = document.getElementById("demoWaBtn");
    var chosen = null;
    if (dateInput) {
      var today = new Date();
      var max = new Date();
      max.setDate(max.getDate() + 14);
      function iso(d) {
        var m = d.getMonth() + 1, day = d.getDate();
        return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
      }
      dateInput.min = iso(today);
      dateInput.max = iso(max);
    }
    var chips = section.querySelectorAll(".demo-chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("selected"); });
        chip.classList.add("selected");
        chosen = chip.getAttribute("data-time");
        refreshBtn();
      });
    });
    function valid() {
      return dateInput && dateInput.value && chosen &&
        nameInput && nameInput.value.trim() &&
        phoneInput && phoneInput.value.replace(/[\s\-()]/g, "").length >= 10 &&
        /^[0-9+]+$/.test(phoneInput.value.replace(/[\s\-()]/g, ""));
    }
    function refreshBtn() {
      if (!btn) return;
      if (valid()) {
        var text = "Hello! I want to book a free demo class at WebDev Lab. My name is " +
          nameInput.value.trim() + ". WhatsApp: " + phoneInput.value.trim() +
          ". Preferred date: " + formatDate(dateInput.value) + " (" + chosen + ").";
        btn.href = "https://wa.me/" + WEBDEV_CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
        if (msg) msg.textContent = "";
      } else {
        btn.href = "#demo";
      }
    }
    [dateInput, nameInput, phoneInput].forEach(function (el) {
      if (el) el.addEventListener("input", refreshBtn);
    });
    if (btn) btn.addEventListener("click", function (e) {
      if (!valid()) {
        e.preventDefault();
        if (msg) {
          msg.textContent = "Please fill in your name, WhatsApp number, a date and a time preference first.";
          msg.className = "form-msg err";
        }
      }
    });
  })();

  /* ---------- cheat sheets page (data lives in cheatsheet-pdf.js) ---------- */
  (function cheatSheetsPage() {
    var list = document.getElementById("cheatSheetsList");
    if (!list) return;
    if (typeof CHEATSHEETS === "undefined" || !CHEATSHEETS.length) {
      list.innerHTML = "<p class=\"note\">Cheat sheets are on their way.</p>";
      return;
    }
    CHEATSHEETS.forEach(function (sheet) {
      var card = document.createElement("div");
      card.className = "card cheat-card";
      var illu = { html: (typeof ILLU_HTML !== "undefined" ? ILLU_HTML : null), css: (typeof ILLU_CSS !== "undefined" ? ILLU_CSS : null), js: (typeof ILLU_JS !== "undefined" ? ILLU_JS : null) }[sheet.id];
      if (typeof illu === "string" && illu.length > 1000) {
        var frame = document.createElement("div");
        frame.className = "module-illu-frame";
        var img = document.createElement("img");
        img.className = "module-illu";
        img.src = "data:image/jpeg;base64," + illu;
        img.alt = sheet.title + " illustration";
        frame.appendChild(img);
        card.appendChild(frame);
      }
      var h = document.createElement("h3");
      h.textContent = sheet.title;
      card.appendChild(h);
      var desc = document.createElement("p");
      desc.textContent = sheet.description;
      card.appendChild(desc);
      function pdfBtn() {
        var btn = document.createElement("button");
        btn.className = "btn btn-small";
        btn.type = "button";
        btn.textContent = "Download PDF";
        btn.addEventListener("click", function () {
          if (typeof downloadCheatSheetPDF === "function") {
            downloadCheatSheetPDF(sheet.id);
          }
        });
        return btn;
      }
      var topRow = document.createElement("div");
      topRow.className = "cheat-actions";
      topRow.appendChild(pdfBtn());
      card.appendChild(topRow);
      sheet.sections.forEach(function (sec) {
        var sh = document.createElement("h4");
        sh.textContent = sec.heading;
        card.appendChild(sh);
        var ul = document.createElement("ul");
        ul.className = "cheat-list";
        sec.rows.forEach(function (row) {
          var li = document.createElement("li");
          var code = document.createElement("code");
          code.className = "inline";
          code.textContent = row.code;
          li.appendChild(code);
          li.appendChild(document.createTextNode(row.desc));
          ul.appendChild(li);
        });
        card.appendChild(ul);
      });
      var botRow = document.createElement("div");
      botRow.className = "cheat-actions";
      botRow.appendChild(pdfBtn());
      card.appendChild(botRow);
      list.appendChild(card);
    });
  })();
})();
