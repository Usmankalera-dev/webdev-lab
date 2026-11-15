/* WebDev Lab — pure-JavaScript PDF certificate generator.
   No libraries, no CDN, no server. It writes a valid PDF file by hand
   (header, objects, xref table, trailer) using only the standard built-in
   PDF fonts (Times-Bold, Times-Roman). All text is plain ASCII.
   Works in the browser (global functions) and in Node (module.exports). */
(function (root) {
  "use strict";

  /* ---------- font widths (units per 1000 em) for printable ASCII 32-126 ---------- */
  var TIMES_ROMAN = [250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541];
  var TIMES_BOLD = [250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,581,500,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,500,278,611,500,722,500,500,500,394,280,394,599];

  var PAGE_W = 842; /* A4 landscape, points */
  var PAGE_H = 595;
  var CX = PAGE_W / 2;

  /* Keep every string plain ASCII so the PDF bytes are always valid. */
  function asciiText(s) {
    return String(s || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[^\x20-\x7E]/g, "?");
  }

  /* Escape the three characters that are special inside a PDF literal string. */
  function esc(s) {
    return asciiText(s)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/[\r\n]/g, " ");
  }

  function textWidth(s, bold, size) {
    var table = bold ? TIMES_BOLD : TIMES_ROMAN;
    var w = 0;
    var clean = asciiText(s);
    for (var i = 0; i < clean.length; i++) {
      var code = clean.charCodeAt(i);
      w += (code >= 32 && code <= 126) ? table[code - 32] : 500;
    }
    return w * size / 1000;
  }

  /* Shrink the font until the text fits inside maxWidth (never below minSize). */
  function fitSize(s, bold, startSize, maxWidth, minSize) {
    var size = startSize;
    while (size > minSize && textWidth(s, bold, size) > maxWidth) size -= 1;
    return size;
  }

  /* One centered line of text. color is "r g b" (0-1). */
  function centeredLine(s, bold, size, y, color) {
    var w = textWidth(s, bold, size);
    var x = (CX - w / 2).toFixed(1);
    return "BT /" + (bold ? "F1" : "F2") + " " + size + " Tf " + color + " " +
      x + " " + y + " Td (" + esc(s) + ") Tj ET\n";
  }

  /* A horizontal line from x1 to x2 at height y. */
  function hline(x1, x2, y, width, color) {
    return width + " w " + color + " " +
      x1.toFixed(1) + " " + y + " m " + x2.toFixed(1) + " " + y + " l S\n";
  }

  /* A stroked rectangle. */
  function rect(x, y, w, h, width, color) {
    return width + " w " + color + " " +
      x + " " + y + " " + w + " " + h + " re S\n";
  }

  /* ---------- the certificate layout ---------- */
  function buildContent(o) {
    var GOLD = "0.96 0.62 0.04";   /* #f59e0b — site accent */
    var DARK_GOLD = "0.85 0.47 0.02"; /* #d97706 */
    var BLACK = "0.07 0.07 0.07";
    var GREY = "0.29 0.33 0.39";
    var LIGHT_GREY = "0.45 0.45 0.45";

    var s = "";

    /* Borders: outer gold, inner dark gold. */
    s += rect(36, 36, 770, 523, 3, GOLD);
    s += rect(48, 48, 746, 499, 1, DARK_GOLD);

    /* Eyebrow. */
    s += centeredLine(o.eyebrow || "WEBDEV LAB", true, 13, 508, DARK_GOLD);

    /* Title, auto-fit so it never overflows. */
    var titleSize = fitSize(o.title, true, 30, 700, 20);
    s += centeredLine(o.title, true, titleSize, 468, BLACK);
    s += hline(CX - 60, CX + 60, 452, 1.5, GOLD);

    /* Presented to + name. */
    s += centeredLine(o.presentedTo, false, 13, 424, GREY);
    var nameSize = fitSize(o.name, true, 26, 660, 16);
    var nameW = textWidth(o.name, true, nameSize);
    s += centeredLine(o.name, true, nameSize, 390, BLACK);
    s += hline(CX - nameW / 2 - 12, CX + nameW / 2 + 12, 382, 1.5, GOLD);

    /* Body lines. */
    var y = 352;
    (o.bodyLines || []).forEach(function (line) {
      s += centeredLine(line, false, 13.5, y, BLACK);
      y -= 22;
    });

    /* Batch line. */
    y -= 8;
    s += centeredLine(o.batch, true, 13, y, BLACK);
    y -= 26;

    /* Meta line: date and certificate ID. */
    s += centeredLine(o.meta, false, 12, y, GREY);

    /* Signature: line, name, role. */
    s += hline(CX - 85, CX + 85, 150, 1, DARK_GOLD);
    s += centeredLine(o.signature, true, 12, 134, BLACK);
    s += centeredLine(o.signatureSub, false, 11, 118, GREY);

    /* Footer. */
    s += centeredLine("WebDev Lab - Learn HTML, CSS & JavaScript by building real things",
      false, 9, 72, LIGHT_GREY);

    return s;
  }

  /* Build the full PDF and return it as a Uint8Array.
     opts: { eyebrow, title, presentedTo, name, bodyLines[], batch, meta,
             signature, signatureSub } — all plain ASCII text. */
  function buildCertificatePDF(opts) {
    var o = opts || {};
    var content = buildContent({
      eyebrow: o.eyebrow || "WEBDEV LAB",
      title: o.title || "Certificate",
      presentedTo: o.presentedTo || "This certificate is proudly presented to",
      name: o.name || "Student",
      bodyLines: o.bodyLines || [],
      batch: o.batch || "",
      meta: o.meta || "",
      signature: o.signature || "Muhammad Usman",
      signatureSub: o.signatureSub || "Founder & CEO, Rakhzaar Tech"
    });

    var objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>",
      "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
    ];

    var out = "%PDF-1.4\n";
    var offsets = [];
    for (var i = 0; i < objs.length; i++) {
      offsets.push(out.length);
      out += (i + 1) + " 0 obj\n" + objs[i] + "\nendobj\n";
    }
    var xrefPos = out.length;
    out += "xref\n0 " + (objs.length + 1) + "\n";
    out += "0000000000 65535 f \n";
    for (var j = 0; j < offsets.length; j++) {
      out += ("0000000000" + offsets[j]).slice(-10) + " 00000 n \n";
    }
    out += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" +
      xrefPos + "\n%%EOF";

    var bytes = new Uint8Array(out.length);
    for (var k = 0; k < out.length; k++) bytes[k] = out.charCodeAt(k) & 0xff;
    return bytes;
  }

  /* Browser only: download the PDF bytes as a real .pdf file. */
  function downloadCertificatePDF(bytes, filename) {
    var blob = new Blob([bytes], { type: "application/pdf" });
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename || "WebDev-Lab-Certificate.pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      (window.URL || window.webkitURL).revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1000);
  }

  root.buildCertificatePDF = buildCertificatePDF;
  root.downloadCertificatePDF = downloadCertificatePDF;
  root.asciiText = asciiText;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      buildCertificatePDF: buildCertificatePDF,
      downloadCertificatePDF: downloadCertificatePDF,
      asciiText: asciiText
    };
  }
})(typeof window !== "undefined" ? window : this);
