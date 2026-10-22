/* Om Badagi — page interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function photo(id, w, h) { return S.photo ? S.photo(id, w, h) : ""; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  doc.classList.add("js");

  /* ---------- config ---------- */
  var email = S.email || "";
  $$("[data-email-text]").forEach(function (e) { e.textContent = email; });
  $$("[data-mailto]").forEach(function (a) { a.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry via ombadagi.com"); });
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
  var cr = $("#credits");
  if (cr && S.credits) cr.innerHTML = S.credits.map(function (c) { return '<li>' + esc(c[0]) + ' — <a href="' + esc(c[3]) + '" target="_blank" rel="noopener noreferrer">' + esc(c[1]) + '</a>, ' + esc(c[2]) + '</li>'; }).join("");

  /* ---------- hero: split headline + intro ---------- */
  var h1 = $("[data-split]");
  if (h1 && !reduce) {
    var txt = h1.textContent.trim();
    h1.setAttribute("aria-label", txt);
    var lines = txt.replace(/\.\s+/g, ".\n").split("\n");
    var k = 0;
    h1.innerHTML = lines.map(function (ln, li) {
      return '<span class="' + (li ? "l2" : "l1") + '" aria-hidden="true">' + ln.split(" ").map(function (w) {
        return '<span class="w"><span style="transition-delay:' + (0.25 + 0.07 * k++).toFixed(2) + 's">' + esc(w) + "</span></span>";
      }).join(" ") + "</span>";
    }).join('<span class="br"></span>');
    doc.classList.add("js-intro");
    $$("[data-intro]").forEach(function (el, i) { el.style.transitionDelay = (0.15 + (i === 0 ? 0 : 0.55 + i * 0.12)) + "s"; });
    var go = function () { requestAnimationFrame(function () { doc.classList.add("is-in"); }); };
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 900); })]).then(go); else go();
  } else if (h1) {
    var parts = h1.textContent.trim().replace(/\.\s+/g, ".\n").split("\n");
    if (parts.length === 2) h1.innerHTML = esc(parts[0]) + ' <span class="l2" style="display:block">' + esc(parts[1]) + "</span>";
  }

  /* ---------- hero video (desktop / tablet, not on data-saver or reduced motion) ---------- */
  var video = $(".hero-video");
  var conn = navigator.connection || {};
  var heroVisible = true;
  if (video && S.media && S.media.heroVideo && !reduce && !conn.saveData && window.innerWidth >= 700) {
    video.src = S.media.heroVideo;
    video.preload = "auto";
    video.addEventListener("playing", function () { video.classList.add("is-playing"); });
    video.addEventListener("error", function () { video.remove(); }); // poster image stays as fallback
    var tryPlay = function () { var p = video.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: poster remains */ }); };
    tryPlay();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        heroVisible = es[0].isIntersecting;
        if (heroVisible) tryPlay(); else video.pause();
      }).observe($(".hero"));
    }
  }

  /* ---------- nav ---------- */
  var nav = $(".nav"), menu = $("#menu"), mbtn = $(".menu-btn");
  function navState() { nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.12); }
  window.addEventListener("scroll", navState, { passive: true }); navState();
  function closeMenu() { menu.classList.remove("open"); nav.classList.remove("menu-open"); mbtn.setAttribute("aria-expanded", "false"); mbtn.querySelector(".menu-lbl").textContent = "Menu"; document.body.style.overflow = ""; }
  mbtn.addEventListener("click", function () {
    var o = !menu.classList.contains("open");
    if (!o) return closeMenu();
    menu.classList.add("open"); nav.classList.add("menu-open"); mbtn.setAttribute("aria-expanded", "true"); mbtn.querySelector(".menu-lbl").textContent = "Close";
    document.body.style.overflow = "hidden";
    var first = menu.querySelector("a"); if (first) first.focus();
  });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { closeMenu(); mbtn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 900 && menu.classList.contains("open")) closeMenu(); });

  if ("IntersectionObserver" in window) {
    var links = $$('.menu a[href^="#"]:not(.btn)');
    var no = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { no.observe(s); });
  }

  /* ---------- curtain reveals ---------- */
  var curtains = $$(".curtain");
  if (reduce || !("IntersectionObserver" in window)) curtains.forEach(function (c) { c.classList.add("is-in"); });
  else {
    // observe the parent: a fully clipped element reports zero intersection
    var co = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { curtains.forEach(function (c) { if (c.parentElement === en.target) c.classList.add("is-in"); }); co.unobserve(en.target); } }); }, { threshold: 0.12 });
    curtains.forEach(function (c) { co.observe(c.parentElement); });
  }

  /* ---------- machines gallery ---------- */
  var gList = $("#g-list"), gFrames = $("#g-frames"), gPanel = $("#g-panel"), gStage = $("#g-stage");
  var gSel = -1, frames = [];
  if (gList && S.machines) {
    var gBtns = S.machines.map(function (m, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.id = "g-tab-" + i; b.setAttribute("aria-controls", "g-panel");
      b.innerHTML = esc(m.name) + '<span class="g-kind">' + esc(m.kind) + "</span>";
      b.addEventListener("click", function () { gSelect(i, true); });
      b.addEventListener("keydown", function (e) {
        var j = -1, n = S.machines.length;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % n;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + n) % n;
        if (e.key === "Home") j = 0; if (e.key === "End") j = n - 1;
        if (j > -1) { e.preventDefault(); gSelect(j, true); gBtns[j].focus(); }
      });
      if (fine) b.addEventListener("mouseenter", function () { preload(i); });
      gList.appendChild(b);
      var f = document.createElement("div"); f.className = "g-frame";
      f.innerHTML = '<img alt="" decoding="async" width="1400" height="1120">';
      gFrames.appendChild(f); frames.push(f);
      return b;
    });
    function preload(i) { var im = frames[i].querySelector("img"); if (!im.getAttribute("src")) { var id = S.machines[i].img; im.src = photo(id, 1400, 1120); im.srcset = photo(id, 800, 640) + " 800w, " + photo(id, 1400, 1120) + " 1400w, " + photo(id, 2000, 1600) + " 2000w"; im.sizes = "(max-width: 900px) 100vw, 62vw"; } }
    function gSelect(i, user) {
      if (i === gSel) return; gSel = i; preload(i);
      var m = S.machines[i];
      gBtns.forEach(function (b, k) { var on = k === i; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
      frames.forEach(function (f, k) { f.classList.toggle("is-on", k === i); });
      frames[i].querySelector("img").alt = m.alt;
      gPanel.setAttribute("aria-labelledby", "g-tab-" + i);
      gPanel.classList.remove("swap"); void gPanel.offsetWidth; gPanel.classList.add("swap");
      gPanel.innerHTML = "<h3>" + esc(m.name) + "</h3>" +
        "<dl><dt>Possible signals</dt><dd><ul>" + m.signals.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></dd></dl>" +
        "<dl><dt>Operational question</dt><dd>" + esc(m.question) + "</dd></dl>" +
        "<dl><dt>Digitalisation opportunity</dt><dd>" + esc(m.opportunity) + "</dd></dl>";
      if (user && gList.scrollWidth > gList.clientWidth) { var sel = gBtns[i]; gList.scrollTo({ left: sel.getBoundingClientRect().left - gList.getBoundingClientRect().left + gList.scrollLeft - 20, behavior: reduce ? "auto" : "smooth" }); }
    }
    gSelect(0);
    // lazy-load the rest once the section is near
    if ("IntersectionObserver" in window) {
      var gio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { S.machines.forEach(function (_, i) { preload(i); }); gio.disconnect(); } }, { rootMargin: "300px" });
      gio.observe(gStage);
    }
    // pointer depth on stage
    if (fine && !reduce) {
      var gx = 0, gy = 0, tgx = 0, tgy = 0, gRaf = 0;
      gStage.addEventListener("pointermove", function (e) { var r = gStage.getBoundingClientRect(); tgx = ((e.clientX - r.left) / r.width - 0.5) * -22; tgy = ((e.clientY - r.top) / r.height - 0.5) * -16; if (!gRaf) gRaf = requestAnimationFrame(gTick); });
      gStage.addEventListener("pointerleave", function () { tgx = 0; tgy = 0; if (!gRaf) gRaf = requestAnimationFrame(gTick); });
      function gTick() { gRaf = 0; gx = lerp(gx, tgx, 0.08); gy = lerp(gy, tgy, 0.08); frames.forEach(function (f) { f.querySelector("img").style.transform = "translate3d(" + gx.toFixed(2) + "px," + gy.toFixed(2) + "px,0)"; }); if (Math.abs(gx - tgx) > 0.1 || Math.abs(gy - tgy) > 0.1) gRaf = requestAnimationFrame(gTick); }
    }
  }

  /* ---------- capabilities: floating image follows the cursor ---------- */
  var capItems = $$(".cap-item"), float = $("#cap-float");
  capItems.forEach(function (it) {
    var id = it.getAttribute("data-img"), th = it.querySelector(".cap-thumb img");
    if (th) { th.src = photo(id, 800, 450); }
  });
  if (fine && float && capItems.length) {
    var fImg = float.querySelector("img"), fx = 0, fy = 0, tfx = 0, tfy = 0, fRaf = 0, fOn = false, vx = 0;
    function fTick() { fRaf = 0; var px = fx; fx = lerp(fx, tfx, reduce ? 1 : 0.14); fy = lerp(fy, tfy, reduce ? 1 : 0.14); vx = lerp(vx, fx - px, 0.2); float.style.transform = "translate3d(" + fx.toFixed(1) + "px," + fy.toFixed(1) + "px,0) translate(-50%,-50%) rotate(" + Math.max(-8, Math.min(8, vx * 0.5)).toFixed(2) + "deg) scale(" + (fOn ? 1 : 0.9) + ")"; if (fOn || Math.abs(fx - tfx) > 0.5) fRaf = requestAnimationFrame(fTick); }
    capItems.forEach(function (it) {
      it.addEventListener("pointerenter", function (e) {
        var id = it.getAttribute("data-img"); var src = photo(id, 600, 760);
        if (fImg.getAttribute("src") !== src) fImg.src = src;
        if (!fOn) { var lane0 = $("#cap-list").getBoundingClientRect(); fx = tfx = lane0.right - lane0.width * 0.17; fy = tfy = e.clientY; }
        fOn = true; float.classList.add("is-on"); if (!fRaf) fRaf = requestAnimationFrame(fTick);
      });
      it.addEventListener("pointermove", function (e) { var lane = $("#cap-list").getBoundingClientRect(); var cx = lane.right - lane.width * 0.17; tfx = cx + (e.clientX - cx) * 0.08; tfy = e.clientY; });
    });
    $("#cap-list").addEventListener("pointerleave", function () { fOn = false; float.classList.remove("is-on"); });
    // warm the cache when the section approaches
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { capItems.forEach(function (it) { var im = new Image(); im.src = photo(it.getAttribute("data-img"), 600, 760); }); cio.disconnect(); } }, { rootMargin: "400px" });
      cio.observe($("#cap-list"));
    }
  }

  /* ---------- approach stepper ---------- */
  var stepsEl = $("#steps"), stepPanel = $("#step-panel"), railFill = $("#rail-fill");
  if (stepsEl && S.steps) {
    var sBtns = S.steps.map(function (st, i) {
      var li = document.createElement("li"); li.setAttribute("role", "presentation");
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.id = "st-" + i; b.setAttribute("aria-controls", "step-panel");
      b.innerHTML = '<span class="dot" aria-hidden="true">' + (i + 1) + '</span><span class="nm">' + esc(st.name) + "</span>";
      b.setAttribute("aria-label", "Stage " + (i + 1) + ": " + st.name);
      b.addEventListener("click", function () { sSelect(i); });
      b.addEventListener("keydown", function (e) { var j = -1, n = S.steps.length; if (e.key === "ArrowRight") j = (i + 1) % n; if (e.key === "ArrowLeft") j = (i - 1 + n) % n; if (j > -1) { e.preventDefault(); sSelect(j); sBtns[j].focus(); } });
      li.appendChild(b); stepsEl.appendChild(li); return b;
    });
    var sCur = -1;
    function sSelect(i) {
      if (i === sCur) return; sCur = i; var st = S.steps[i];
      sBtns.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1; b.classList.toggle("is-past", k < i); });
      // rail spans dot 1 → dot 5; buttons are equal columns so centre of dot k ≈ k/5 of width (+ dot radius)
      if (railFill) railFill.style.transform = "scaleX(" + (i / (S.steps.length - 1)).toFixed(4) + ")";
      stepPanel.setAttribute("aria-labelledby", "st-" + i);
      stepPanel.classList.remove("swap"); void stepPanel.offsetWidth; stepPanel.classList.add("swap");
      stepPanel.innerHTML = "<h3>" + esc(st.name) + '</h3><p class="t">' + esc(st.text) + '</p><p class="out"><span>Outcome</span><strong>' + esc(st.out) + "</strong></p>";
    }
    sSelect(0);
    window.addEventListener("resize", function () { var c = sCur; sCur = -1; sSelect(c); });
  }

  /* ---------- scroll parallax + hero depth (one rAF loop) ---------- */
  var plx = (reduce || window.innerWidth < 900) ? [] : $$("[data-parallax]"); // no scroll parallax on phones/tablets
  var heroMedia = $("[data-hero-media]");
  var hx = 0, hy = 0, thx = 0, thy = 0, ticking = false;
  if (fine && !reduce && heroMedia) {
    $(".hero").addEventListener("pointermove", function (e) { thx = (e.clientX / window.innerWidth - 0.5) * -18; thy = (e.clientY / window.innerHeight - 0.5) * -12; req(); });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function frame() {
    ticking = false;
    var vh = window.innerHeight, sy = window.scrollY;
    if (heroMedia && !reduce && sy < vh * 1.2) {
      hx = lerp(hx, thx, 0.07); hy = lerp(hy, thy, 0.07);
      heroMedia.style.transform = "translate3d(" + hx.toFixed(2) + "px," + (hy + sy * 0.28).toFixed(2) + "px,0) scale(" + (1 + sy / vh * 0.06).toFixed(4) + ")";
      if (Math.abs(hx - thx) > 0.1 || Math.abs(hy - thy) > 0.1) req();
    }
    plx.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var f = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * f).toFixed(1) + "px,0)";
    });
  }
  if (!reduce) { window.addEventListener("scroll", req, { passive: true }); window.addEventListener("resize", req); req(); }

  /* ---------- custom cursor + magnetic buttons (fine pointers only) ---------- */
  if (fine && !reduce) {
    var ring = document.createElement("div"); ring.className = "cursor"; ring.setAttribute("aria-hidden", "true"); ring.innerHTML = "<span></span>";
    var dot = document.createElement("div"); dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);
    var mx = -100, my = -100, rx = -100, ry = -100, cRaf = 0, seen = false;
    function cTick() {
      cRaf = 0; rx = lerp(rx, mx, 0.2); ry = lerp(ry, my, 0.2);
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      if (Math.abs(rx - mx) > 0.2 || Math.abs(ry - my) > 0.2) cRaf = requestAnimationFrame(cTick);
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; rx = mx; ry = my; doc.classList.add("has-cursor"); }
      var t = e.target;
      var lab = t.closest && t.closest("[data-cursor]");
      var hot = t.closest && t.closest("a, button, label, input, textarea, summary, .cap-item");
      var txt = t.closest && t.closest('input[type="text"], textarea');
      ring.classList.toggle("is-label", !!lab && !hot);
      ring.querySelector("span").textContent = lab ? lab.getAttribute("data-cursor") : "";
      ring.classList.toggle("is-hover", !!hot);
      ring.classList.toggle("is-hidden", !!txt); dot.classList.toggle("is-hidden", !!txt);
      doc.classList.toggle("on-ivory", !!(t.closest && t.closest(".ivory")));
      if (!cRaf) cRaf = requestAnimationFrame(cTick);
    });
    document.addEventListener("pointerleave", function () { ring.classList.add("is-hidden"); dot.classList.add("is-hidden"); });
    document.addEventListener("pointerenter", function () { ring.classList.remove("is-hidden"); dot.classList.remove("is-hidden"); });
    window.addEventListener("blur", function () { ring.classList.add("is-hidden"); dot.classList.add("is-hidden"); });

    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + (dx * 0.18).toFixed(1) + "px," + (dy * 0.28).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1), background-size .5s, color .35s"; el.style.transform = ""; setTimeout(function () { el.style.transition = ""; }, 600); });
    });
  }

  /* ---------- contact: mailto composer ---------- */
  var form = $("#brief");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.msg.value.trim(), err = $("#msg-err");
      if (msg.length < 10) { err.hidden = false; form.msg.setAttribute("aria-invalid", "true"); form.msg.focus(); return; }
      err.hidden = true; form.msg.removeAttribute("aria-invalid");
      var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || "General";
      var company = form.company.value.trim();
      var body = "Hello Om,\n\nArea: " + topic + "\n" + (company ? "Company / site: " + company + "\n" : "") + "\n" + msg + "\n\n";
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project enquiry — " + topic) + "&body=" + encodeURIComponent(body);
    });
    form.msg.addEventListener("input", function () { if (form.msg.value.trim().length >= 10) { $("#msg-err").hidden = true; form.msg.removeAttribute("aria-invalid"); } });
  }
})();
