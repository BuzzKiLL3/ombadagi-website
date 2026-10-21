/* UI wiring: nav, capability explorer, operations↔business flow, DMAIC chart, reveals, contact composer */
(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- config ----------
  var email = S.email || "";
  document.querySelectorAll("[data-email-text]").forEach(function (e) { e.textContent = email; });
  document.querySelectorAll("[data-mailto]").forEach(function (a) { a.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry via ombadagi.com"); });
  if ($("yr")) $("yr").textContent = new Date().getFullYear();

  // ---------- header + menu ----------
  var hdr = document.querySelector(".hdr");
  function onScroll() { hdr.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var btn = document.querySelector(".menu-btn"), nav = $("nav");
  function closeNav() { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Open menu"); document.body.classList.remove("nav-open"); }
  btn.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(o)); btn.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", o);
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) closeNav(); });

  // ---------- generic accessible tabs ----------
  function tabs(container, items, renderBtn, panel, renderPanel, onSelect, start) {
    var btns = items.map(function (it, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.id = container.id + "-" + i;
      b.setAttribute("aria-controls", panel.id);
      b.innerHTML = renderBtn(it, i);
      b.addEventListener("click", function () { select(i); });
      b.addEventListener("keydown", function (e) {
        var n = items.length, j = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
        else if (e.key === "Home") j = 0; else if (e.key === "End") j = n - 1;
        if (j > -1) { e.preventDefault(); select(j); btns[j].focus(); }
      });
      container.appendChild(b);
      return b;
    });
    var cur = -1;
    function select(i) {
      if (i === cur) return; cur = i;
      btns.forEach(function (b, k) { var on = k === i; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle("is-on", on); b.classList.toggle("is-past", k < i); });
      panel.setAttribute("aria-labelledby", btns[i].id);
      if (renderPanel) { panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap"); panel.innerHTML = renderPanel(items[i], i); }
      if (onSelect) onSelect(i);
    }
    select(start || 0);
    return select;
  }

  // ---------- 02 capabilities explorer ----------
  var GLYPH = {
    machine: '<rect x="20" y="30" width="62" height="54"/><rect x="30" y="40" width="30" height="28"/><path d="M45 40v14"/><rect x="66" y="44" width="10" height="20"/><path d="M82 57h30M112 57l18-20M112 57l18 20M112 57h26" class="a"/><circle cx="148" cy="57" r="10"/><circle cx="148" cy="57" r="3" class="f"/>',
    line: '<path d="M14 72h158" /><rect x="22" y="44" width="26" height="28"/><rect x="66" y="44" width="26" height="28" class="w"/><rect x="110" y="44" width="26" height="28"/><path d="M48 58h18M92 58h18M136 58h18" class="a"/><path d="M79 30v8M73 34h12" class="w"/><path d="M14 92h158" stroke-dasharray="3 4"/>',
    maint: '<path d="M20 90V25M20 90h150"/><path d="M26 70l20-4 20 6 20-8 20 2 18-20 14-14 18-6" class="a"/><path d="M20 40h150" class="w" stroke-dasharray="4 4"/><circle cx="138" cy="34" r="5" class="f"/><path d="M118 60l10 10 22-22"/>',
    auto: '<rect x="18" y="30" width="36" height="24"/><rect x="18" y="66" width="36" height="24"/><path d="M54 42h24v36H54M78 60h22" class="a"/><circle cx="114" cy="60" r="14"/><path d="M108 60l5 5 8-10"/><path d="M128 60h22"/><rect x="150" y="48" width="18" height="24"/>',
    erp: '<rect x="70" y="40" width="44" height="40"/><path d="M70 52h44M70 64h44"/><circle cx="28" cy="34" r="8"/><circle cx="28" cy="86" r="8"/><circle cx="156" cy="34" r="8"/><circle cx="156" cy="86" r="8"/><path d="M36 38l34 10M36 82l34-10M148 38l-34 10M148 82l-34-10" class="a"/>',
    scm: '<rect x="16" y="46" width="28" height="28"/><rect x="78" y="46" width="28" height="28"/><rect x="140" y="46" width="28" height="28"/><path d="M44 60h34M106 60h34" class="a"/><path d="M58 54l6 6-6 6M120 54l6 6-6 6"/><path d="M30 86v12h124V86" stroke-dasharray="3 4"/>',
    lean: '<circle cx="93" cy="60" r="38"/><path d="M93 22a38 38 0 0 1 36 26" class="a"/><path d="M129 48l2-10M129 48l-10-2" class="a"/><text x="93" y="66" text-anchor="middle" class="gt">DMAIC</text>'
  };
  var capList = document.querySelector(".caps-list");
  if (capList && S.pathways) {
    capList.id = "cap";
    tabs(capList, S.pathways,
      function (c) { return '<span class="mono c-code">' + c.code + '</span><span class="c-name">' + esc(c.name) + '</span><span class="c-arr" aria-hidden="true">→</span>'; },
      $("cap-panel"),
      function (c) {
        return '<div class="cd-top"><svg class="glyph" viewBox="0 0 186 120" aria-hidden="true">' + (GLYPH[c.glyph] || "") + '</svg><p class="mono pk">' + c.code + " · pathway</p><h3>" + esc(c.name) + "</h3></div>" +
          '<dl class="pio"><div><dt class="mono">Problem</dt><dd>' + esc(c.problem) + '</dd></div><div><dt class="mono">Approach</dt><dd>' + esc(c.approach) +
          '</dd></div><div><dt class="mono">Possible solution</dt><dd>' + esc(c.solution) + '</dd></div></dl>' +
          '<a class="btn btn-line btn-s cap-cta" href="#contact" data-topic="' + esc(c.topic) + '">Discuss this →</a>';
      });
    $("cap-panel").addEventListener("click", function (e) {
      var a = e.target.closest("[data-topic]"); if (!a) return;
      var r = document.querySelector('#brief input[value="' + a.getAttribute("data-topic") + '"]'); if (r) r.checked = true;
    });
  }

  // ---------- 04 operations ↔ business graph ----------
  var graph = $("graph");
  if (graph && S.nodes && S.scenarios) {
    var NS = "http://www.w3.org/2000/svg", NW = 210, NH = 52;
    function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || graph).appendChild(e); return e; }
    var gE = el("g", {}), gN = el("g", {}), dot = el("circle", { r: 5, class: "g-dot", cx: -20, cy: -20 });
    var edgeEls = {};
    S.edges.forEach(function (e) {
      var a = S.nodes[e[0]], b = S.nodes[e[1]];
      var mx = (a.x + b.x) / 2;
      var d = a.x === b.x ? "M" + a.x + " " + a.y + " L" + b.x + " " + b.y : "M" + a.x + " " + a.y + " C" + mx + " " + a.y + " " + mx + " " + b.y + " " + b.x + " " + b.y;
      edgeEls[e[0] + ">" + e[1]] = edgeEls[e[1] + ">" + e[0]] = el("path", { d: d, class: "g-edge" }, gE);
    });
    var nodeEls = {};
    Object.keys(S.nodes).forEach(function (k) {
      var n = S.nodes[k], g = el("g", { class: "g-node", transform: "translate(" + (n.x - NW / 2) + "," + (n.y - NH / 2) + ")" }, gN);
      el("rect", { width: NW, height: NH, rx: 2 }, g);
      var t = el("text", { x: 16, y: NH / 2 + 5 }, g); t.textContent = n.label;
      nodeEls[k] = g;
    });
    var timer = 0, anim = 0;
    var scenSteps = $("scen-steps");
    function run(i) {
      clearTimeout(timer); cancelAnimationFrame(anim);
      var sc = S.scenarios[i], path = sc.path;
      Object.keys(edgeEls).forEach(function (k) { edgeEls[k].classList.remove("on", "done"); });
      Object.keys(nodeEls).forEach(function (k) { nodeEls[k].classList.remove("on", "done", "dim"); if (path.indexOf(k) < 0) nodeEls[k].classList.add("dim"); });
      scenSteps.innerHTML = path.map(function (k, j) { return '<li><span class="mono">' + S.nodes[k].label + "</span>" + esc(sc.steps[j] || "") + "</li>"; }).join("");
      var lis = scenSteps.children;
      function at(j) {
        nodeEls[path[j]].classList.add("on"); lis[j].classList.add("on");
        if (j > 0) { var e = edgeEls[path[j - 1] + ">" + path[j]]; if (e) e.classList.add("done"); nodeEls[path[j - 1]].classList.replace("on", "done"); lis[j - 1].classList.replace("on", "done"); }
      }
      if (reduce) { for (var j = 0; j < path.length; j++) at(j); return; }
      var j = 0; at(0);
      function hop() {
        if (j >= path.length - 1) return;
        var e = edgeEls[path[j] + ">" + path[j + 1]], fwd = !!S.edges.filter(function (x) { return x[0] === path[j] && x[1] === path[j + 1]; }).length;
        if (!e) { j++; at(j); timer = setTimeout(hop, 600); return; }
        e.classList.add("on");
        var L = e.getTotalLength(), t0 = performance.now(), dur = 900;
        (function f(now) {
          var p = Math.min(1, (now - t0) / dur), q = e.getPointAtLength((fwd ? p : 1 - p) * L);
          dot.setAttribute("cx", q.x); dot.setAttribute("cy", q.y);
          if (p < 1) anim = requestAnimationFrame(f);
          else { e.classList.remove("on"); j++; at(j); timer = setTimeout(hop, 500); }
        })(t0);
      }
      timer = setTimeout(hop, 500);
    }
    var scenEl = $("scen");
    var started = false;
    tabs(scenEl, S.scenarios,
      function (s, i) { return '<span class="mono">0' + (i + 1) + "</span>" + esc(s.name) + '<span class="run mono" aria-hidden="true">▶</span>'; },
      scenSteps, null, function (i) { if (started) run(i); }, 0);
    // start the first scenario when the section is seen; replay on click of the active one
    scenEl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b && b.classList.contains("is-on")) run(Array.prototype.indexOf.call(scenEl.children, b)); });
    if ("IntersectionObserver" in window) {
      var gio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { started = true; run(0); gio.disconnect(); } }, { threshold: 0.3 });
      gio.observe(document.querySelector(".flowx"));
    } else { started = true; run(0); }
  }

  // ---------- 05 DMAIC control chart ----------
  var spc = $("spc");
  if (spc && S.dmaic) {
    var sctx = spc.getContext("2d");
    var seed = 7; function r() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function gauss() { return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r()); }
    var NB = 40, before = [], after = [], flags = [];
    for (var i = 0; i < NB; i++) { var spike = (i % 9 === 4) ? 6 + r() * 2 : (i % 13 === 8 ? 4 : 0); before.push(33 + gauss() * 1.6 + spike); flags.push(spike > 0 ? (i % 9 === 4 ? "chg" : "mat") : ""); }
    for (var k = 0; k < 30; k++) after.push(30.3 + gauss() * 0.6);
    function stats(a) { var m = a.reduce(function (x, y) { return x + y; }, 0) / a.length; var sd = Math.sqrt(a.reduce(function (x, y) { return x + (y - m) * (y - m); }, 0) / (a.length - 1)); return [m, sd]; }
    var sb = stats(before), sa = stats(after);
    var phase = 0, W2 = 0, H2 = 0;
    function sz() { var rr = spc.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); W2 = rr.width; H2 = rr.height; spc.width = Math.round(W2 * d); spc.height = Math.round(H2 * d); sctx.setTransform(d, 0, 0, d, 0, 0); drawSpc(); }
    function drawSpc() {
      if (!W2) return;
      var c = sctx; c.clearRect(0, 0, W2, H2);
      var lo = 26, hi = 43, pl = 30, pr = 10, pt = 10, pb = 18, gw = W2 - pl - pr, gh = H2 - pt - pb;
      var total = phase >= 3 ? NB + after.length : NB;
      function X(i) { return pl + i / (total - 1) * gw; } function Y(v) { return pt + gh - (v - lo) / (hi - lo) * gh; }
      c.font = "10px 'IBM Plex Mono', monospace"; c.lineWidth = 1;
      for (var g = 28; g <= 42; g += 4) { c.strokeStyle = "rgba(236,235,230,.07)"; c.beginPath(); c.moveTo(pl, Y(g)); c.lineTo(W2 - pr, Y(g)); c.stroke(); c.fillStyle = "rgba(236,235,230,.4)"; c.fillText(g + "s", 0, Y(g) + 3); }
      // target band
      c.fillStyle = "rgba(95,212,224,.08)"; c.fillRect(pl, Y(31.5), gw, Y(29) - Y(31.5));
      c.fillStyle = "rgba(95,212,224,.7)"; c.fillText("target", pl + 4, Y(29) - 4);
      function series(a, off, col, dim) {
        c.strokeStyle = col; c.globalAlpha = dim ? 0.3 : 1; c.lineWidth = 1.2; c.beginPath();
        a.forEach(function (v, j) { var x = X(off + j), y = Y(Math.min(hi, v)); if (j) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
        a.forEach(function (v, j) {
          var hot = phase === 2 && off === 0 && flags[j];
          c.fillStyle = hot ? "#f0a63a" : col; c.beginPath(); c.arc(X(off + j), Y(Math.min(hi, v)), hot ? 3.5 : 2, 0, 7); c.fill();
        });
        c.globalAlpha = 1; c.lineWidth = 1;
      }
      if (phase === 0) series(before, 0, "rgba(236,235,230,.5)", true);
      if (phase >= 1) series(before, 0, phase >= 3 ? "rgba(236,235,230,.5)" : "#5fd4e0", phase >= 3);
      if (phase === 1 || phase === 2) { c.strokeStyle = "rgba(236,235,230,.5)"; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(pl, Y(sb[0])); c.lineTo(W2 - pr, Y(sb[0])); c.stroke(); c.setLineDash([]); c.fillStyle = "rgba(236,235,230,.6)"; c.fillText("mean", pl + 4, Y(sb[0]) - 4); }
      if (phase >= 3) {
        c.strokeStyle = "rgba(236,235,230,.35)"; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(NB - 0.5), pt); c.lineTo(X(NB - 0.5), H2 - pb); c.stroke(); c.setLineDash([]);
        c.fillStyle = "rgba(236,235,230,.6)"; c.fillText("change", X(NB - 0.5) + 4, pt + 10);
        series(after, NB, "#5fd4e0", false);
      }
      if (phase === 4) {
        var ucl = sa[0] + 3 * sa[1], lcl = sa[0] - 3 * sa[1];
        c.strokeStyle = "rgba(240,166,58,.85)"; c.setLineDash([4, 4]);
        [ucl, lcl].forEach(function (v) { c.beginPath(); c.moveTo(X(NB), Y(v)); c.lineTo(W2 - pr, Y(v)); c.stroke(); });
        c.setLineDash([]); c.fillStyle = "rgba(240,166,58,.9)"; c.fillText("UCL", X(NB) + 2, Y(ucl) - 4); c.fillText("LCL", X(NB) + 2, Y(lcl) + 12);
      }
    }
    var STAT = ["Problem framed — target 29–31.5 s", "Baseline mean " + sb[0].toFixed(1) + " s · σ " + sb[1].toFixed(1), "Outliers highlighted", "New mean " + sa[0].toFixed(1) + " s · σ " + sa[1].toFixed(1), "In control — limits ±3σ"];
    var LEG = ["", "", '<span class="lg"><i class="sw sw-o"></i>Changeover / material outliers</span>', "", '<span class="lg"><i class="sw sw-w"></i>Control limits</span>'];
    tabs($("dm-tabs"), S.dmaic,
      function (d) { return '<span class="dm-k">' + d.k + '</span><span class="dm-n">' + d.name + "</span>"; },
      $("dm-panel"),
      function (d) { return '<p class="mono pk">' + d.name + '</p><h3>' + esc(d.q) + '</h3><ul class="io mono">' + d.tools.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><p class="ex"><span class="mono">Example</span>' + esc(d.ex) + "</p>"; },
      function (i) { phase = i; $("dm-stat").textContent = STAT[i]; $("dm-legend").innerHTML = LEG[i]; drawSpc(); });
    window.addEventListener("resize", sz); sz();
  }

  // ---------- reveals ----------
  var rev = document.querySelectorAll(".sec-head, .caps, .lab, .flowx, .dmaic, .prof-l, .tl li, .stack-row, .contact-in > *");
  if (!reduce && "IntersectionObserver" in window) {
    rev.forEach(function (e) { e.classList.add("rv"); });
    var ro = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }); }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    rev.forEach(function (e) { ro.observe(e); });
    setTimeout(function () { rev.forEach(function (e) { e.classList.add("in"); }); }, 6000); // fail-safe
  }

  // ---------- active nav ----------
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a:not(.btn)"));
  if ("IntersectionObserver" in window) {
    var no = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); }); }); }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { no.observe(s); });
  }

  // ---------- contact composer (mailto) ----------
  var form = $("brief");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.msg.value.trim(), err = $("msg-err");
      if (msg.length < 10) { err.hidden = false; form.msg.setAttribute("aria-invalid", "true"); form.msg.focus(); return; }
      err.hidden = true; form.msg.removeAttribute("aria-invalid");
      var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || "General";
      var company = form.company.value.trim();
      var body = "Hello Om,\n\nTopic: " + topic + "\n" + (company ? "Company / site: " + company + "\n" : "") + "\n" + msg + "\n\n";
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry — " + topic) + "&body=" + encodeURIComponent(body);
    });
  }
})();
