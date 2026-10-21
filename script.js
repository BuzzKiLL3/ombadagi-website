/* UI wiring: nav, tabs (system / capabilities / method), reveals, contact composer */
(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  // ---------- config: email ----------
  var email = S.email || "";
  document.querySelectorAll("[data-email-text]").forEach(function (e) { e.textContent = email; });
  document.querySelectorAll("[data-mailto]").forEach(function (a) {
    a.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry via ombadagi.com");
  });
  var yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();

  // ---------- header + menu ----------
  var hdr = document.querySelector(".hdr");
  function onScroll() { hdr.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  function closeNav() { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Open menu"); document.body.classList.remove("nav-open"); }
  btn.addEventListener("click", function () {
    var o = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(o));
    btn.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", o);
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) closeNav(); });

  // ---------- generic accessible tabs ----------
  function tabs(container, items, renderBtn, renderPanel, panel, opts) {
    opts = opts || {};
    var btns = items.map(function (it, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab");
      b.id = container.id ? container.id + "-" + i : "tab-" + Math.random().toString(36).slice(2);
      b.setAttribute("aria-controls", panel.id);
      b.innerHTML = renderBtn(it, i);
      b.addEventListener("click", function () { select(i, true); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, n = items.length, j = -1;
        if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % n;
        else if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + n) % n;
        else if (k === "Home") j = 0; else if (k === "End") j = n - 1;
        if (j > -1) { e.preventDefault(); select(j, true); btns[j].focus(); }
      });
      if (container.tagName === "OL" || container.tagName === "UL") { li.setAttribute("role", "presentation"); li.appendChild(b); container.appendChild(li); }
      else container.appendChild(b);
      return b;
    });
    var cur = -1;
    function select(i, user) {
      if (i === cur) return; cur = i;
      btns.forEach(function (b, k) {
        var on = k === i;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        b.classList.toggle("is-on", on);
        b.classList.toggle("is-past", k < i);
      });
      panel.setAttribute("aria-labelledby", btns[i].id);
      panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
      panel.innerHTML = renderPanel(items[i], i);
      if (opts.onSelect) opts.onSelect(i, user);
    }
    select(opts.start || 0, false);
    return select;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- 02 system ----------
  var sysNodes = document.querySelector(".sys-nodes");
  if (sysNodes && S.layers) {
    sysNodes.id = "sys";
    tabs(sysNodes, S.layers,
      function (l) { return '<span class="n-dot"></span><span class="n-code mono">' + l.code + '</span><span class="n-name">' + esc(l.name) + "</span>"; },
      function (l) {
        return '<p class="mono pk">' + l.code + " · " + esc(l.name) + "</p><h3>" + esc(l.title) + "</h3><p>" + esc(l.text) + '</p><ul class="io mono">' +
          l.io.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      },
      document.getElementById("sys-panel"),
      { start: 2, onSelect: function (i) { document.querySelector(".sys").style.setProperty("--sel", i); } });
  }

  // ---------- 03 capabilities ----------
  var GLYPH = {
    iot: '<circle cx="40" cy="60" r="14"/><circle cx="40" cy="60" r="4" class="f"/><path d="M54 60h40M94 60l20-24M94 60l20 24M94 60h28"/><rect x="122" y="48" width="44" height="24"/><path d="M128 64l8-6 8 4 8-8 8 6" class="a"/>',
    lean: '<path d="M20 40h30v40H20zM70 40h30v40H70zM120 40h30v40h-30z"/><path d="M50 60h20M100 60h20" class="a"/><path d="M30 95h110" stroke-dasharray="3 4"/><path d="M85 30v-10" /><circle cx="85" cy="16" r="5" class="f"/>',
    auto: '<rect x="18" y="30" width="36" height="24"/><rect x="18" y="66" width="36" height="24"/><path d="M54 42h24v36H54M78 60h22" class="a"/><circle cx="114" cy="60" r="14"/><path d="M108 60l5 5 8-10"/><path d="M128 60h22"/><rect x="150" y="48" width="18" height="24"/>',
    kpi: '<path d="M20 95h150M20 95V25"/><rect x="32" y="60" width="16" height="35"/><rect x="58" y="48" width="16" height="47"/><rect x="84" y="70" width="16" height="25" class="w"/><rect x="110" y="40" width="16" height="55"/><path d="M30 50l40-12 30 20 40-26" class="a"/>',
    erp: '<rect x="70" y="40" width="44" height="40"/><path d="M70 52h44M70 64h44"/><circle cx="28" cy="34" r="8"/><circle cx="28" cy="86" r="8"/><circle cx="156" cy="34" r="8"/><circle cx="156" cy="86" r="8"/><path d="M36 38l34 10M36 82l34-10M148 38l-34 10M148 82l-34-10" class="a"/>',
    scm: '<rect x="16" y="46" width="28" height="28"/><rect x="78" y="46" width="28" height="28"/><rect x="140" y="46" width="28" height="28"/><path d="M44 60h34M106 60h34" class="a"/><path d="M58 54l6 6-6 6M120 54l6 6-6 6"/><path d="M30 86v12h124V86" stroke-dasharray="3 4"/>',
    mkt: '<circle cx="80" cy="60" r="34"/><circle cx="80" cy="60" r="20"/><circle cx="80" cy="60" r="6" class="f"/><path d="M80 18v10M80 92v10M38 60h10M112 60h10"/><path d="M80 60l42-30" class="a"/><circle cx="122" cy="30" r="4" class="f"/>'
  };
  var capList = document.querySelector(".caps-list");
  if (capList && S.capabilities) {
    capList.id = "cap";
    tabs(capList, S.capabilities,
      function (c) { return '<span class="mono c-code">' + c.code + '</span><span class="c-name">' + esc(c.name) + '</span><span class="c-arr" aria-hidden="true">→</span>'; },
      function (c) {
        return '<div class="cd-top"><svg class="glyph" viewBox="0 0 186 120" aria-hidden="true">' + GLYPH[c.glyph] + '</svg><p class="mono pk">' + c.code + "</p><h3>" + esc(c.name) + "</h3></div>" +
          '<dl class="pio"><div><dt class="mono">Problem</dt><dd>' + esc(c.problem) + '</dd></div><div><dt class="mono">Intervention</dt><dd>' + esc(c.action) +
          '</dd></div><div><dt class="mono">Intended outcome</dt><dd>' + esc(c.outcome) + "</dd></div></dl>";
      },
      document.getElementById("cap-panel"));
  }

  // ---------- 04 method ----------
  var stepsEl = document.querySelector(".steps");
  if (stepsEl && S.steps) {
    stepsEl.id = "step";
    var prog = document.getElementById("flow-prog");
    var selStep = tabs(stepsEl, S.steps,
      function (st) { return '<span class="s-n mono">' + st.n + '</span><span class="s-name">' + esc(st.name) + "</span>"; },
      function (st) { return '<p class="mono pk">Step ' + st.n + "</p><h3>" + esc(st.name) + "</h3><p>" + esc(st.text) + "</p>"; },
      document.getElementById("step-panel"),
      { onSelect: function (i) { if (prog) prog.style.transform = "scaleX(" + (i / (S.steps.length - 1)) + ")"; } });
    // auto-advance once when first seen (not under reduced motion; stops on interaction)
    if (!reduce && "IntersectionObserver" in window) {
      var k = 0, iv = 0, stopped = false;
      stepsEl.addEventListener("pointerdown", function () { stopped = true; clearInterval(iv); });
      stepsEl.addEventListener("focusin", function () { stopped = true; clearInterval(iv); });
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !stopped && !iv) {
          iv = setInterval(function () { k++; if (k >= S.steps.length || stopped) { clearInterval(iv); return; } selStep(k); }, 1700);
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(stepsEl);
    }
  }

  // ---------- reveals ----------
  var rev = document.querySelectorAll(".sec-head, .sys, .caps, .flow, .lab, .prof-l, .tl li, .stack-row, .contact-in > *");
  if (!reduce && "IntersectionObserver" in window) {
    rev.forEach(function (e) { e.classList.add("rv"); });
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rev.forEach(function (e) { ro.observe(e); });
  }

  // ---------- active nav ----------
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a:not(.btn)"));
  if ("IntersectionObserver" in window) {
    var no = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { no.observe(s); });
  }

  // ---------- contact composer (mailto) ----------
  var form = document.getElementById("brief");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.msg.value.trim(), err = document.getElementById("msg-err");
      if (msg.length < 10) { err.hidden = false; form.msg.setAttribute("aria-invalid", "true"); form.msg.focus(); return; }
      err.hidden = true; form.msg.removeAttribute("aria-invalid");
      var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || "General";
      var company = form.company.value.trim();
      var body = "Hello Om,\n\nMain challenge: " + topic + "\n" + (company ? "Company / site: " + company + "\n" : "") + "\n" + msg + "\n\n";
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry — " + topic) + "&body=" + encodeURIComponent(body);
    });
  }
})();
