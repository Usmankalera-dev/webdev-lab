/* WebDev Lab — pure-JavaScript PDF certificate generator.
   No libraries, no CDN, no server. It writes a valid PDF file by hand
   (header, objects, xref table, trailer) using only the standard built-in
   PDF fonts (Times-Bold F1, Times-Roman F2, Times-Italic F3). All text is
   plain ASCII. A4 landscape 842 x 595 pt, beige-tinted paper, dark-brown + tan design:
   double border with corner diamonds, logo monogram, letter-spaced title,
   script-style name, diagonal watermark, round seal with circular text
   and a 5-point star, and a three-part bottom row (date / seal / signature).
   Works in the browser (global functions) and in Node (module.exports). */
(function (root) {
  "use strict";

  /* ---------- font widths (units per 1000 em) for printable ASCII 32-126 ---------- */
  var TIMES_ROMAN = [250,333,408,500,500,833,778,180,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541];
  var TIMES_BOLD = [250,333,555,500,500,1000,833,278,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,581,500,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,500,278,611,500,722,500,500,500,394,280,394,599];
  /* Times-Italic widths are close to Times-Roman; reuse that table. */
  var TIMES_ITALIC = TIMES_ROMAN;

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

  /* Decode a base64 string to a byte array. Works in the browser and Node
     (no atob / Buffer dependency). Padding ("=") stops the group. */
  function b64ToBytes(b64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var clean = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
    var bytes = [];
    var i, a, b, c, d;
    for (i = 0; i + 3 < clean.length; i += 4) {
      a = chars.indexOf(clean.charAt(i));
      b = chars.indexOf(clean.charAt(i + 1));
      c = chars.indexOf(clean.charAt(i + 2));
      d = chars.indexOf(clean.charAt(i + 3));
      if (a < 0 || b < 0) break;
      bytes.push((a << 2) | (b >> 4));
      if (c >= 0) bytes.push(((b & 15) << 4) | (c >> 2));
      if (d >= 0) bytes.push(((c & 3) << 6) | d);
    }
    return bytes;
  }

  function widthTable(font) {
    if (font === "F1") return TIMES_BOLD;
    if (font === "F3") return TIMES_ITALIC;
    return TIMES_ROMAN;
  }

  function textWidth(s, font, size) {
    var table = widthTable(font || "F2");
    var w = 0;
    var clean = asciiText(s);
    for (var i = 0; i < clean.length; i++) {
      var code = clean.charCodeAt(i);
      w += (code >= 32 && code <= 126) ? table[code - 32] : 500;
    }
    return w * size / 1000;
  }

  /* Shrink the font until the text fits inside maxWidth (never below minSize). */
  function fitSize(s, font, startSize, maxWidth, minSize) {
    var size = startSize;
    while (size > minSize && textWidth(s, font, size) > maxWidth) size -= 1;
    return size;
  }

  function f1(n) { return (+n).toFixed(1); }
  function f2(n) { return (+n).toFixed(2); }

  /* One centered line of text. color is "r g b" (0-1). font is "F1"/"F2"/"F3". */
  function centeredLine(s, font, size, y, color) {
    var w = textWidth(s, font, size);
    var x = (CX - w / 2).toFixed(1);
    return color + " rg BT /" + font + " " + size + " Tf " +
      x + " " + y + " Td (" + esc(s) + ") Tj ET\n";
  }

  /* One centered line at an explicit centre x. */
  function centeredLineAt(s, font, size, cx, y, color) {
    var w = textWidth(s, font, size);
    var x = (cx - w / 2).toFixed(1);
    return color + " rg BT /" + font + " " + size + " Tf " +
      x + " " + y + " Td (" + esc(s) + ") Tj ET\n";
  }

  /* Centered text with extra space between letters (each char drawn alone).
     Tracking is added between letters only — never after a space, whose own
     width is the word gap (otherwise word gaps look twice as wide). */
  function spacedCentered(s, font, size, y, color, tracking) {
    var clean = asciiText(s);
    var total = 0;
    for (var i = 0; i < clean.length; i++) {
      total += textWidth(clean.charAt(i), font, size);
      if (i < clean.length - 1 && clean.charAt(i) !== " ") total += tracking;
    }
    var x = CX - total / 2;
    var out = "";
    for (var j = 0; j < clean.length; j++) {
      var ch = clean.charAt(j);
      out += color + " rg BT /" + font + " " + size + " Tf " +
        f1(x) + " " + y + " Td (" + esc(ch) + ") Tj ET\n";
      x += textWidth(ch, font, size);
      if (j < clean.length - 1 && ch !== " ") x += tracking;
    }
    return out;
  }

  /* Width of a spaced string, for fitting (same tracking rule as above). */
  function spacedWidth(s, font, size, tracking) {
    var clean = asciiText(s);
    var total = 0;
    for (var i = 0; i < clean.length; i++) {
      total += textWidth(clean.charAt(i), font, size);
      if (i < clean.length - 1 && clean.charAt(i) !== " ") total += tracking;
    }
    return total;
  }

  /* A horizontal line from x1 to x2 at height y. */
  function hline(x1, x2, y, width, color) {
    return color + " RG " + width + " w " +
      f1(x1) + " " + y + " m " + f1(x2) + " " + y + " l S\n";
  }

  /* A stroked rectangle. */
  function rect(x, y, w, h, width, color) {
    return color + " RG " + width + " w " +
      f1(x) + " " + f1(y) + " " + f1(w) + " " + f1(h) + " re S\n";
  }

  /* A filled rectangle. */
  function fillRect(x, y, w, h, color) {
    return color + " rg " + f1(x) + " " + f1(y) + " " + f1(w) + " " + f1(h) + " re f\n";
  }

  /* A circle (stroked) built from 4 cubic bezier segments. */
  function circle(cx, cy, r, width, color) {
    var k = 0.5522847498 * r;
    return color + " RG " + width + " w " +
      f2(cx + r) + " " + f2(cy) + " m " +
      f2(cx + r) + " " + f2(cy + k) + " " + f2(cx + k) + " " + f2(cy + r) + " " + f2(cx) + " " + f2(cy + r) + " c " +
      f2(cx - k) + " " + f2(cy + r) + " " + f2(cx - r) + " " + f2(cy + k) + " " + f2(cx - r) + " " + f2(cy) + " c " +
      f2(cx - r) + " " + f2(cy - k) + " " + f2(cx - k) + " " + f2(cy - r) + " " + f2(cx) + " " + f2(cy - r) + " c " +
      f2(cx + k) + " " + f2(cy - r) + " " + f2(cx + r) + " " + f2(cy - k) + " " + f2(cx + r) + " " + f2(cy) + " c S\n";
  }

  /* A filled circle (same bezier path, filled). */
  function fillCircle(cx, cy, r, color) {
    var k = 0.5522847498 * r;
    return color + " rg " +
      f2(cx + r) + " " + f2(cy) + " m " +
      f2(cx + r) + " " + f2(cy + k) + " " + f2(cx + k) + " " + f2(cy + r) + " " + f2(cx) + " " + f2(cy + r) + " c " +
      f2(cx - k) + " " + f2(cy + r) + " " + f2(cx - r) + " " + f2(cy + k) + " " + f2(cx - r) + " " + f2(cy) + " c " +
      f2(cx - r) + " " + f2(cy - k) + " " + f2(cx - k) + " " + f2(cy - r) + " " + f2(cx) + " " + f2(cy - r) + " c " +
      f2(cx + k) + " " + f2(cy - r) + " " + f2(cx + r) + " " + f2(cy - k) + " " + f2(cx + r) + " " + f2(cy) + " c f\n";
  }

  /* A filled diamond (rotated square) centred at (cx, cy), half-diagonal d. */
  function diamond(cx, cy, d, color) {
    return color + " rg " +
      f1(cx) + " " + f1(cy + d) + " m " +
      f1(cx + d) + " " + f1(cy) + " l " +
      f1(cx) + " " + f1(cy - d) + " l " +
      f1(cx - d) + " " + f1(cy) + " l h f\n";
  }

  /* A filled 5-point star centred at (cx, cy), outer radius ro, inner ri. */
  function star(cx, cy, ro, ri, color) {
    var pts = [];
    var i, ang;
    for (i = 0; i < 10; i++) {
      ang = (90 - i * 36) * Math.PI / 180;
      var r = (i % 2 === 0) ? ro : ri;
      pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
    }
    var out = color + " rg " + f2(pts[0][0]) + " " + f2(pts[0][1]) + " m ";
    for (i = 1; i < 10; i++) out += f2(pts[i][0]) + " " + f2(pts[i][1]) + " l ";
    return out + "h f\n";
  }

  /* One line of text rotated about (cx, cy) by angleDeg (counter-clockwise). */
  function rotatedText(s, font, size, cx, cy, angleDeg, color) {
    var a = angleDeg * Math.PI / 180;
    var cos = Math.cos(a), sin = Math.sin(a);
    var w = textWidth(s, font, size);
    var ox = cx - (w / 2) * cos;
    var oy = cy - (w / 2) * sin;
    return "q " + f2(cos) + " " + f2(sin) + " " + f2(-sin) + " " + f2(cos) + " " +
      f1(ox) + " " + f1(oy) + " cm " + color + " rg BT /" + font + " " + size + " Tf " +
      " 0 0 Td (" + esc(s) + ") Tj ET Q\n";
  }

  /* Text around a circle: one character at a time, each rotated so its top
     points outward from the centre. Starts at the top, goes clockwise. */
  function circularText(s, font, size, cx, cy, r, color) {
    var clean = asciiText(s);
    var n = clean.length;
    var out = "";
    for (var i = 0; i < n; i++) {
      var ch = clean.charAt(i);
      var theta = (90 - i * (360 / n)) * Math.PI / 180;
      var px = cx + r * Math.cos(theta);
      var py = cy + r * Math.sin(theta);
      var aDeg = (90 - i * (360 / n)) - 90; /* glyph rotation: top points outward */
      var a = aDeg * Math.PI / 180;
      var cos = Math.cos(a), sin = Math.sin(a);
      var w = textWidth(ch, font, size);
      /* advance direction is (cos a, sin a); centre the glyph on the point */
      var ox = px - (w / 2) * cos;
      var oy = py - (w / 2) * sin;
      out += "q " + f2(cos) + " " + f2(sin) + " " + f2(-sin) + " " + f2(cos) + " " +
        f1(ox) + " " + f1(oy) + " cm " + color + " rg BT /" + font + " " + size + " Tf " +
        " 0 0 Td (" + esc(ch) + ") Tj ET Q\n";
    }
    return out;
  }

  /* ---------- the certificate layout ---------- */
  function buildContent(o) {
    var NAVY = "0.10 0.07 0.05";      /* #1a120e */
    var GOLD = "0.66 0.52 0.38";      /* #a88462 */
    var DARK_GOLD = "0.42 0.29 0.18"; /* #6b4a2e */
    var GREY = "0.29 0.29 0.27";      /* #4a4a46 */
    var LIGHT_GREY = "0.45 0.45 0.45";
    var WATER = "0.90 0.86 0.80";     /* very light watermark beige */

    var s = "";

    /* Beige-tinted paper. */
    s += fillRect(0, 0, PAGE_W, PAGE_H, "0.97 0.95 0.91");

    /* Watermark first, so everything else draws over it. */
    s += rotatedText("WEBDEV LAB", "F1", 64, CX, 300, -30, WATER);

    /* Borders: outer thin navy, inner gold. */
    s += rect(24, 24, 794, 547, 2, NAVY);
    s += rect(36, 36, 770, 523, 1.25, GOLD);

    /* Corner diamonds on the inner border corners. */
    var corners = [[36, 36], [806, 36], [36, 559], [806, 559]];
    corners.forEach(function (c) {
      s += diamond(c[0], c[1], 8, GOLD);
      s += diamond(c[0], c[1], 3.5, NAVY);
    });

    /* Logo: the real image when supplied (88pt square, centred where the
       drawn monogram was); otherwise the drawn gold-ringed "WL" monogram. */
    if (o.hasLogo) {
      s += "q 88 0 0 88 " + f1(CX - 44) + " 464 cm /Im1 Do Q\n";
    } else {
      s += circle(CX, 508, 34, 2, GOLD);
      s += circle(CX, 508, 27, 0.75, NAVY);
      s += centeredLine("WL", "F1", 26, 499, NAVY);
    }

    /* Institution name, letter-spaced, + tagline. */
    s += spacedCentered("WEBDEV LAB", "F1", 15, 447, NAVY, 4);
    s += centeredLine("Learn HTML, CSS & JavaScript by Building Real Things", "F2", 9.5, 431, GREY);

    /* Title, letter-spaced, auto-fit so it never overflows. */
    var titleSize = 30;
    while (titleSize > 20 && spacedWidth(o.title, "F1", titleSize, 1.5) > 700) titleSize -= 1;
    s += spacedCentered(o.title, "F1", titleSize, 395, NAVY, 1.5);
    s += hline(CX - 70, CX + 70, 381, 1.5, GOLD);

    /* Presented to + name (script-style italic, gold underline). */
    s += centeredLine(o.presentedTo, "F2", 12.5, 357, GREY);
    var nameSize = fitSize(o.name, "F3", 34, 660, 18);
    var nameW = textWidth(o.name, "F3", nameSize);
    s += centeredLine(o.name, "F3", nameSize, 321, NAVY);
    s += hline(CX - nameW / 2 - 14, CX + nameW / 2 + 14, 313, 1.5, GOLD);

    /* Body lines. */
    var y = 287;
    (o.bodyLines || []).forEach(function (line) {
      s += centeredLine(line, "F2", 13.5, y, NAVY);
      y -= 22;
    });

    /* Batch line. */
    y -= 6;
    s += centeredLine(o.batch, "F1", 13, y, NAVY);

    /* Certificate / registration ID line (or the old combined meta string). */
    y -= 26;
    if (o.certId) {
      s += centeredLine(o.idLabel + ": " + o.certId, "F2", 11.5, y, GREY);
    } else if (o.meta) {
      s += centeredLine(o.meta, "F2", 11.5, y, GREY);
    }

    /* ---- Bottom row: date (left) / seal (centre) / signature (right) ---- */
    var sealCX = CX, sealCY = 148, sealR = 42;
    /* Date block, centred on x = 150. */
    s += centeredLineAt(o.dateLabel, "F1", 8.5, 150, 172, GREY);
    s += centeredLineAt(o.date, "F1", 12, 150, 152, NAVY);
    s += hline(95, 205, 140, 0.75, GOLD);
    /* Seal: concentric circles, circular rim text, 5-point star. */
    s += circle(sealCX, sealCY, sealR, 1.5, GOLD);
    s += circle(sealCX, sealCY, sealR - 6, 0.75, NAVY);
    s += circularText("WEBDEV LAB * EST. 2026 *", "F1", 8.5, sealCX, sealCY, sealR - 12.5, NAVY);
    s += star(sealCX, sealCY, 14, 5.5, GOLD);
    /* Signature block, centred on x = 692. */
    s += hline(622, 762, 172, 1, NAVY);
    s += centeredLineAt(o.signature, "F1", 12, 692, 152, NAVY);
    s += centeredLineAt(o.signatureSub, "F2", 9.5, 692, 138, GREY);

    /* Footer. */
    s += centeredLine("WebDev Lab - Learn HTML, CSS & JavaScript by building real things",
      "F2", 9, 56, LIGHT_GREY);
    s += centeredLine("Verify at: usmankalera-dev.github.io/webdev-lab/verify.html",
      "F2", 8.5, 42, LIGHT_GREY);

    return s;
  }

  /* Build the full PDF and return it as a Uint8Array.
     opts: { eyebrow, title, presentedTo, name, bodyLines[], batch,
             dateLabel, date, certId, idLabel, meta (legacy fallback),
             signature, signatureSub,
             logoJpeg (base64 JPEG string, no data: prefix — optional) }
     When logoJpeg is a valid JPEG it is embedded as a DCTDecode image
     XObject and drawn at the top; otherwise the drawn "WL" monogram is
     used. All text is plain ASCII. */
  function buildCertificatePDF(opts) {
    var o = opts || {};

    /* Decode + validate the logo: must be a real JPEG (SOI marker FFD8). */
    var logoBytes = null;
    if (o.logoJpeg) {
      try {
        var decoded = b64ToBytes(o.logoJpeg);
        if (decoded.length > 1000 && decoded[0] === 0xff && decoded[1] === 0xd8) {
          logoBytes = decoded;
        }
      } catch (e) { logoBytes = null; }
    }

    var content = buildContent({
      eyebrow: o.eyebrow || "WEBDEV LAB",
      title: o.title || "Certificate",
      presentedTo: o.presentedTo || "This certificate is proudly presented to",
      name: o.name || "Student",
      bodyLines: o.bodyLines || [],
      batch: o.batch || "",
      dateLabel: o.dateLabel || "Date Issued",
      date: o.date || "",
      certId: o.certId || "",
      idLabel: o.idLabel || (/Registration/i.test(o.title || "") ? "Registration ID" : "Certificate ID"),
      meta: o.meta || "",
      signature: o.signature || "Muhammad Usman",
      signatureSub: o.signatureSub || "Founder & CEO, Rakhzaar Tech",
      hasLogo: !!logoBytes
    });

    var pageRes = "<< /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >>" +
      (logoBytes ? " /XObject << /Im1 8 0 R >>" : "") + " >>";
    var objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources " + pageRes + " /Contents 7 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>",
      "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
    ];

    /* Object 8 (only when a logo is embedded): the JPEG image XObject.
       Raw bytes go in as a binary string — every char is 0-255, so string
       length still equals byte length and the xref offsets stay exact. */
    if (logoBytes) {
      var bin = "";
      for (var bi = 0; bi < logoBytes.length; bi++) bin += String.fromCharCode(logoBytes[bi]);
      objs.push("<< /Type /XObject /Subtype /Image /Width 480 /Height 480 " +
        "/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode " +
        "/Length " + logoBytes.length + " >>\nstream\n" + bin + "\nendstream");
    }

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
