/* WebDev Lab — cheat sheets.
   ONE data structure (CHEATSHEETS) is the single source of truth:
   cheatsheets.html renders it on the page, and buildCheatSheetPDF()
   turns the same data into a real multi-page A4 PDF in the browser.
   Content comes ONLY from what the lessons actually teach
   (HTML Lessons 1-5, CSS Lessons 6-10, JavaScript Lessons 11-18).
   No libraries, no CDN, no server — same hand-written PDF 1.4 pattern
   as pdf.js (Times fonts, xref table, trailer). Works in the browser
   (globals) and in Node (module.exports). */

var CHEATSHEETS = [
  {
    id: "html",
    title: "HTML Cheat Sheet",
    description: "Every tag and attribute from the HTML module — Lessons 1–5.",
    sections: [
      {
        heading: "Page skeleton",
        rows: [
          { code: "<!DOCTYPE html>", desc: "Tells the browser this is a modern HTML document." },
          { code: "<html>", desc: "Root element — everything on the page lives inside it." },
          { code: "<head>", desc: "Information about the page that visitors do not see." },
          { code: "<title>", desc: "The page title shown in the browser tab." },
          { code: "<body>", desc: "Everything visitors see: headings, text, images, links." }
        ]
      },
      {
        heading: "Text",
        rows: [
          { code: "<h1> to <h6>", desc: "Six heading levels — h1 is the biggest, h6 the smallest." },
          { code: "<p>", desc: "A paragraph of text." },
          { code: "<strong>", desc: "Important text, shown bold." },
          { code: "<em>", desc: "Emphasised text, shown italic." },
          { code: "<br>", desc: "A line break (empty element, no closing tag)." }
        ]
      },
      {
        heading: "Links",
        rows: [
          { code: "<a href=\"...\">", desc: "A link. href says where the link goes." },
          { code: "href=\"#section\"", desc: "Links to the part of the page with id=\"section\"." },
          { code: "target=\"_blank\"", desc: "Opens the link in a new tab." }
        ]
      },
      {
        heading: "Images, lists & tables",
        rows: [
          { code: "<img src=\"...\" alt=\"...\">", desc: "An image. src is the file, alt describes it in words." },
          { code: "<ul>", desc: "An unordered (bulleted) list." },
          { code: "<ol>", desc: "An ordered (numbered) list." },
          { code: "<li>", desc: "One item inside a list." },
          { code: "<table>", desc: "A table." },
          { code: "<tr>", desc: "One row of a table." },
          { code: "<td>", desc: "A normal data cell." },
          { code: "<th>", desc: "A header cell — bold and centred." }
        ]
      },
      {
        heading: "Forms",
        rows: [
          { code: "<form>", desc: "Groups inputs and a submit button." },
          { code: "<input type=\"text\">", desc: "A one-line text field." },
          { code: "<input type=\"email\">", desc: "An email field — the browser checks the format." },
          { code: "<input type=\"password\">", desc: "A password field — typed text is hidden." },
          { code: "<input type=\"number\">", desc: "A number field." },
          { code: "<input type=\"date\">", desc: "A date picker." },
          { code: "<input type=\"checkbox\">", desc: "A tick box." },
          { code: "<input type=\"radio\">", desc: "One choice from a group." },
          { code: "<button type=\"submit\">", desc: "A button that sends the form." },
          { code: "<label for=\"...\">", desc: "Labels an input. for must match the input's id." },
          { code: "required", desc: "The field must be filled before the form can submit." },
          { code: "placeholder=\"...\"", desc: "Hint text shown inside an empty field." },
          { code: "name=\"...\"", desc: "Names the field so its value can be sent." }
        ]
      },
      {
        heading: "Page structure",
        rows: [
          { code: "<header>", desc: "The top of the page — logo and navigation." },
          { code: "<nav>", desc: "The navigation block." },
          { code: "<main>", desc: "The main content — exactly one per page." },
          { code: "<section>", desc: "A themed group of content." },
          { code: "<article>", desc: "A self-contained piece, like a blog post." },
          { code: "<aside>", desc: "Side content, like a sidebar." },
          { code: "<footer>", desc: "The bottom of the page." },
          { code: "<div>", desc: "A generic box with no meaning of its own." }
        ]
      }
    ]
  },
  {
    id: "css",
    title: "CSS Cheat Sheet",
    description: "Selectors, colours, fonts, box model, flexbox and responsive design — Lessons 6–10.",
    sections: [
      {
        heading: "Adding CSS",
        rows: [
          { code: "<link rel=\"stylesheet\" href=\"style.css\">", desc: "External file — one file styles every page. Best for a whole website." },
          { code: "<style> ... </style>", desc: "CSS written inside the HTML page." },
          { code: "style=\"...\"", desc: "Inline CSS on one tag — use it rarely." }
        ]
      },
      {
        heading: "Selectors",
        rows: [
          { code: "p { }", desc: "Selects every <p> tag." },
          { code: ".menu { }", desc: "Selects every element with class=\"menu\"." },
          { code: "#title { }", desc: "Selects the one element with id=\"title\"." },
          { code: "* { }", desc: "Selects every element." }
        ]
      },
      {
        heading: "Colours & fonts",
        rows: [
          { code: "color: #ff0000;", desc: "Text colour. #ff0000 is red." },
          { code: "background-color: #ffffff;", desc: "Background colour. #ffffff is white." },
          { code: "#000000", desc: "Hex black — zero red, green and blue." },
          { code: "rgb(255, 0, 0)", desc: "Red as three numbers: red, green, blue." },
          { code: "font-family: Georgia, serif;", desc: "The typeface, with fallbacks." },
          { code: "font-size: 18px;", desc: "Text size in pixels." },
          { code: "font-size: 2.5rem;", desc: "Text size in rem — relative to the root font size." },
          { code: "font-weight: bold;", desc: "Bold text." },
          { code: "text-align: center;", desc: "Centres the text." },
          { code: "line-height: 1.7;", desc: "Space between lines of text." },
          { code: "text-decoration: none;", desc: "Removes the underline from a link." },
          { code: "text-decoration: underline;", desc: "Underlines the text." }
        ]
      },
      {
        heading: "Box model",
        rows: [
          { code: "width: 320px;", desc: "The width of the box." },
          { code: "padding: 20px;", desc: "Space inside the box, between content and border." },
          { code: "border: 2px solid #d97706;", desc: "A line around the box: width, style, colour." },
          { code: "border-radius: 12px;", desc: "Rounded corners." },
          { code: "margin: 20px auto;", desc: "Space outside the box. auto centres a fixed-width block." },
          { code: "box-sizing: border-box;", desc: "Width includes padding and border." },
          { code: "margin: 0 auto;", desc: "Centres a block with a fixed width." }
        ]
      },
      {
        heading: "Flexbox",
        rows: [
          { code: "display: flex;", desc: "Turns an element into a flex container." },
          { code: "flex-direction: row;", desc: "Items line up left to right (the default)." },
          { code: "flex-direction: column;", desc: "Items stack top to bottom." },
          { code: "justify-content: space-between;", desc: "Spreads items along the main axis." },
          { code: "align-items: center;", desc: "Aligns items along the cross axis." },
          { code: "gap: 16px;", desc: "Space between flex items." },
          { code: "flex-wrap: wrap;", desc: "Items wrap onto a new line when they run out of room." },
          { code: "flex: 1;", desc: "The item grows to share the free space." }
        ]
      },
      {
        heading: "Responsive",
        rows: [
          { code: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", desc: "Tells the phone the page width matches the device." },
          { code: "@media (max-width: 700px) { ... }", desc: "Rules that apply only up to 700px wide." },
          { code: "max-width: 100%;", desc: "Images never overflow a small screen." }
        ]
      }
    ]
  },
  {
    id: "js",
    title: "JavaScript Cheat Sheet",
    description: "Variables, functions, DOM, events, conditions, loops, arrays, objects and fetch — Lessons 11–18.",
    sections: [
      {
        heading: "Adding JavaScript",
        rows: [
          { code: "<script> ... </script>", desc: "JavaScript goes inside <script> tags, usually at the end of the body." },
          { code: "console.log(\"Hello\");", desc: "Prints a message to the browser console (F12)." }
        ]
      },
      {
        heading: "Variables & data",
        rows: [
          { code: "let count = 0;", desc: "A value that can change." },
          { code: "const price = 500;", desc: "A value that never changes." },
          { code: "\"text\"", desc: "A string — text in quotes." },
          { code: "42 / 3.14", desc: "Numbers." },
          { code: "true / false", desc: "Booleans — yes or no." },
          { code: "typeof x", desc: "Tells you the type of a value." },
          { code: "5 + \"5\"", desc: "Gives \"55\" — when one side is a string, + joins." },
          { code: "price * quantity", desc: "Multiply. Also + - / for add, subtract, divide." }
        ]
      },
      {
        heading: "Functions",
        rows: [
          { code: "function greet() { }", desc: "Declares a function." },
          { code: "return value;", desc: "Sends a value back and ends the function." },
          { code: "greet(\"Usman\")", desc: "Calls the function with an argument." },
          { code: "const add = (a, b) => a + b;", desc: "An arrow function — a shorter way to write a function." }
        ]
      },
      {
        heading: "DOM — finding & changing",
        rows: [
          { code: "document.getElementById(\"title\")", desc: "Finds the element with that id." },
          { code: "document.querySelector(\".card\")", desc: "Finds the first element matching a CSS selector." },
          { code: "el.textContent = \"Hi\";", desc: "Changes the text inside an element." },
          { code: "el.style.color = \"red\";", desc: "Changes one CSS style." },
          { code: "document.createElement(\"li\")", desc: "Builds a new element." },
          { code: "list.appendChild(li)", desc: "Puts the new element on the page." },
          { code: "el.innerHTML = \"...\";", desc: "Sets the HTML inside an element." }
        ]
      },
      {
        heading: "Events",
        rows: [
          { code: "btn.addEventListener(\"click\", function () { ... });", desc: "Runs a function every time the button is clicked." },
          { code: "form.addEventListener(\"submit\", function (e) { ... });", desc: "Runs when the form is submitted." },
          { code: "e.preventDefault()", desc: "Stops the page from reloading on submit." }
        ]
      },
      {
        heading: "Conditions & loops",
        rows: [
          { code: "if (marks >= 80) { ... } else { ... }", desc: "Runs code only when the condition is true." },
          { code: "===", desc: "Strict equal — checks value AND type." },
          { code: "==", desc: "Loose equal — checks value only (\"5\" == 5 is true)." },
          { code: "&&", desc: "And — both sides must be true." },
          { code: "||", desc: "Or — at least one side must be true." },
          { code: "!", desc: "Not — flips true to false." },
          { code: "for (let i = 0; i < 5; i++) { ... }", desc: "Repeats a fixed number of times." },
          { code: "for (let fruit of fruits) { ... }", desc: "Loops over every item in an array." },
          { code: "while (condition) { ... }", desc: "Repeats while the condition is true." }
        ]
      },
      {
        heading: "Arrays & objects",
        rows: [
          { code: "let fruits = [\"apple\", \"banana\"];", desc: "An array — a list of values." },
          { code: "fruits[0]", desc: "The first item (arrays start at 0)." },
          { code: "fruits.length", desc: "How many items are in the array." },
          { code: "fruits.push(\"mango\")", desc: "Adds an item to the end." },
          { code: "fruits.pop()", desc: "Removes the last item." },
          { code: "fruits.filter(t => !t.done)", desc: "Returns a new array with only the items that pass the test." },
          { code: "fruits.forEach(function (f) { ... });", desc: "Runs a function once for every item." },
          { code: "let user = { name: \"Usman\", city: \"Lahore\" };", desc: "An object — labelled values." },
          { code: "user.name", desc: "Reads the name property." }
        ]
      },
      {
        heading: "Fetch & storage",
        rows: [
          { code: "fetch(\"https://...\")", desc: "Asks a server for data. Returns a Promise." },
          { code: "await fetch(...)", desc: "Waits for the Promise to finish (inside an async function)." },
          { code: "async function load() { ... }", desc: "A function that can use await." },
          { code: "response.json()", desc: "Reads the response body as JSON." },
          { code: "localStorage.setItem(\"key\", value)", desc: "Saves a string in the browser." },
          { code: "localStorage.getItem(\"key\")", desc: "Reads a saved string back." },
          { code: "JSON.stringify(array)", desc: "Turns an array into text for storage." },
          { code: "JSON.parse(text)", desc: "Turns stored text back into an array." }
        ]
      }
    ]
  }
];

(function (root) {
  "use strict";

  /* Font widths (units per 1000 em) for printable ASCII 32-126 — same
     tables as pdf.js (Times-Roman / Times-Bold). */
  var TIMES_ROMAN = [250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541];
  var TIMES_BOLD = [250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,581,500,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,500,278,611,500,722,500,500,500,394,280,394,599];

  var PAGE_W = 595; /* A4 portrait, points */
  var PAGE_H = 842;
  var MARGIN = 56;
  var CONTENT_W = PAGE_W - 2 * MARGIN;

  function asciiText(s) {
    return String(s || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[^\x20-\x7E]/g, "?");
  }

  function esc(s) {
    return asciiText(s)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/[\r\n]/g, " ");
  }

  function textWidth(s, font, size) {
    var table = font === "F1" ? TIMES_BOLD : TIMES_ROMAN;
    var w = 0;
    var clean = asciiText(s);
    for (var i = 0; i < clean.length; i++) {
      var code = clean.charCodeAt(i);
      w += (code >= 32 && code <= 126) ? table[code - 32] : 500;
    }
    return w * size / 1000;
  }

  /* Split text into lines that fit maxWidth (word wrap). */
  function wrapText(s, font, size, maxWidth) {
    var words = asciiText(s).split(/\s+/).filter(function (w) { return w.length; });
    var lines = [];
    var cur = "";
    words.forEach(function (word) {
      var next = cur ? cur + " " + word : word;
      if (textWidth(next, font, size) <= maxWidth || !cur) {
        cur = next;
      } else {
        lines.push(cur);
        cur = word;
      }
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  }

  function f1(n) { return (+n).toFixed(1); }

  function textLine(s, font, size, x, y, color) {
    return color + " rg BT /" + font + " " + size + " Tf " +
      f1(x) + " " + f1(y) + " Td (" + esc(s) + ") Tj ET\n";
  }

  function centeredLine(s, font, size, y, color) {
    var w = textWidth(s, font, size);
    return textLine(s, font, size, (PAGE_W - w) / 2, y, color);
  }

  function hline(x1, x2, y, width, color) {
    return color + " RG " + width + " w " + f1(x1) + " " + f1(y) + " m " + f1(x2) + " " + f1(y) + " l S\n";
  }

  /* Build the content streams (one per page) for one cheat sheet. */
  function buildPages(sheet) {
    var NAVY = "0.10 0.16 0.29";
    var GOLD = "0.79 0.64 0.15";
    var GREY = "0.29 0.33 0.39";
    var LIGHT_GREY = "0.45 0.45 0.45";
    var pages = [];
    var s = "";
    var y = PAGE_H - 56;
    var pageNum = 1;

    function newPage() {
      pages.push(s);
      s = "";
      pageNum++;
      y = PAGE_H - 56;
    }
    function footer() {
      s += centeredLine("WebDev Lab — " + sheet.title + " · Page " + pageNum, "F2", 8, 34, LIGHT_GREY);
    }
    function ensureSpace(need) {
      if (y - need < 56) {
        footer();
        newPage();
      }
    }

    /* Title + description (first page only). */
    s += centeredLine(sheet.title, "F1", 22, y, NAVY);
    y -= 20;
    wrapText(sheet.description, "F2", 10.5, CONTENT_W).forEach(function (line) {
      s += centeredLine(line, "F2", 10.5, y, GREY);
      y -= 14;
    });
    y -= 8;
    s += hline(MARGIN, PAGE_W - MARGIN, y, 1.5, GOLD);
    y -= 26;

    sheet.sections.forEach(function (sec) {
      ensureSpace(44);
      s += textLine(sec.heading, "F1", 13.5, MARGIN, y, NAVY);
      y -= 6;
      s += hline(MARGIN, PAGE_W - MARGIN, y, 0.75, GOLD);
      y -= 18;
      sec.rows.forEach(function (row) {
        /* code line (bold) */
        var codeLines = wrapText(row.code, "F1", 11, CONTENT_W);
        ensureSpace(16 + codeLines.length * 14 + 6);
        codeLines.forEach(function (line) {
          s += textLine(line, "F1", 11, MARGIN, y, NAVY);
          y -= 14;
        });
        /* description (roman, wrapped) */
        var descLines = wrapText(row.desc, "F2", 10, CONTENT_W - 12);
        descLines.forEach(function (line) {
          s += textLine(line, "F2", 10, MARGIN + 12, y, GREY);
          y -= 13;
        });
        y -= 9;
      });
      y -= 8;
    });
    footer();
    pages.push(s);
    return pages;
  }

  function buildCheatSheetPDF(id) {
    var sheet = null;
    for (var i = 0; i < CHEATSHEETS.length; i++) {
      if (CHEATSHEETS[i].id === id) { sheet = CHEATSHEETS[i]; break; }
    }
    if (!sheet) return null;
    var pages = buildPages(sheet);
    var n = pages.length;

    /* Objects: 1 Catalog, 2 Pages, then per page: Page + Contents,
       then fonts F1 (Times-Bold) and F2 (Times-Roman). */
    var pageObjNum = [];
    var contentObjNum = [];
    var objCount = 2 + n * 2 + 2;
    for (var p = 0; p < n; p++) {
      pageObjNum.push(3 + p * 2);
      contentObjNum.push(4 + p * 2);
    }
    var fontBoldNum = 3 + n * 2;
    var fontRomanNum = 4 + n * 2;
    var kids = pageObjNum.map(function (num) { return num + " 0 R"; }).join(" ");
    var objs = [];
    objs[0] = "<< /Type /Catalog /Pages 2 0 R >>";
    objs[1] = "<< /Type /Pages /Kids [" + kids + "] /Count " + n + " >>";
    for (var k = 0; k < n; k++) {
      objs[pageObjNum[k] - 1] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
        "/Resources << /Font << /F1 " + fontBoldNum + " 0 R /F2 " + fontRomanNum + " 0 R >> >> " +
        "/Contents " + contentObjNum[k] + " 0 R >>";
      objs[contentObjNum[k] - 1] = "<< /Length " + pages[k].length + " >>\nstream\n" + pages[k] + "\nendstream";
    }
    objs[fontBoldNum - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>";
    objs[fontRomanNum - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>";

    var out = "%PDF-1.4\n";
    var offsets = [];
    for (var o = 0; o < objCount; o++) {
      offsets.push(out.length);
      out += (o + 1) + " 0 obj\n" + objs[o] + "\nendobj\n";
    }
    var xrefPos = out.length;
    out += "xref\n0 " + (objCount + 1) + "\n";
    out += "0000000000 65535 f \n";
    for (var j = 0; j < offsets.length; j++) {
      out += ("0000000000" + offsets[j]).slice(-10) + " 00000 n \n";
    }
    out += "trailer\n<< /Size " + (objCount + 1) + " /Root 1 0 R >>\nstartxref\n" +
      xrefPos + "\n%%EOF";

    var bytes = new Uint8Array(out.length);
    for (var b = 0; b < out.length; b++) bytes[b] = out.charCodeAt(b) & 0xff;
    return bytes;
  }

  function downloadCheatSheetPDF(id) {
    var bytes = buildCheatSheetPDF(id);
    if (!bytes) return;
    var sheet = null;
    for (var i = 0; i < CHEATSHEETS.length; i++) {
      if (CHEATSHEETS[i].id === id) { sheet = CHEATSHEETS[i]; break; }
    }
    var filename = "WebDev-Lab-Cheat-Sheet-" + (sheet ? sheet.id.toUpperCase() : id.toUpperCase()) + ".pdf";
    var blob = new Blob([bytes], { type: "application/pdf" });
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      (window.URL || window.webkitURL).revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1000);
  }

  root.buildCheatSheetPDF = buildCheatSheetPDF;
  root.downloadCheatSheetPDF = downloadCheatSheetPDF;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      CHEATSHEETS: CHEATSHEETS,
      buildCheatSheetPDF: buildCheatSheetPDF,
      downloadCheatSheetPDF: downloadCheatSheetPDF
    };
  }
})(typeof window !== "undefined" ? window : this);
