/* Verom Solutions — site behaviour. No dependencies, no cookies, no trackers. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var I18N = window.VEROM_I18N || {};

  /* ---------- analytics hook: no-op until an analytics tool is configured ---------- */
  window.veromTrack = function (name, props) {
    try { document.dispatchEvent(new CustomEvent("verom:track", { detail: { name: name, props: props || {} } })); } catch (e) {}
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-track]");
    if (t) window.veromTrack(t.getAttribute("data-track"), { href: t.getAttribute("href") || "" });
  });

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(function (n) { n.textContent = String(new Date().getFullYear()); });

  /* ---------- navigation ---------- */
  var nav = $(".nav"), menuBtn = $(".menu-btn");
  var ddBtn = $("[data-dd]"), dd = ddBtn ? document.getElementById(ddBtn.getAttribute("aria-controls")) : null;
  var mobile = window.matchMedia("(max-width: 960px)");
  function setDD(open) { if (!ddBtn) return; ddBtn.setAttribute("aria-expanded", String(open)); dd.hidden = !open; }
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (open && mobile.matches) setDD(true);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  if (ddBtn) {
    ddBtn.addEventListener("click", function (e) { e.stopPropagation(); setDD(ddBtn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("click", function (e) { if (!mobile.matches && !e.target.closest(".has-dd")) setDD(false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (ddBtn && ddBtn.getAttribute("aria-expanded") === "true" && !mobile.matches) { setDD(false); ddBtn.focus(); }
    if (menuBtn && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
  });
  $$(".nav-links a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  mobile.addEventListener && mobile.addEventListener("change", function () { setMenu(false); setDD(false); });

  /* ---------- reveal on scroll ---------- */
  var rv = $$(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (n) { io.observe(n); });
  } else rv.forEach(function (n) { n.classList.add("in"); });

  /* ---------- helper: run an animation only while visible ---------- */
  function whileVisible(el, tick, ms) {
    if (!el || reduce) return;
    var id = null;
    function start() { if (!id) id = setInterval(tick, ms); }
    function stop() { clearInterval(id); id = null; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(el);
    } else start();
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });
  }

  /* ---------- illustrative series (random walk, clearly labelled on page) ---------- */
  function series(n, base, amp) { var a = [], v = base; for (var i = 0; i < n; i++) { v += (Math.random() - 0.5) * amp; v = base + (v - base) * 0.85; a.push(v); } return a; }
  function pathFrom(vals, w, h, lo, hi) {
    var step = w / (vals.length - 1);
    return vals.map(function (v, i) { var y = h - ((v - lo) / (hi - lo)) * h; return (i ? "L" : "M") + (i * step).toFixed(1) + " " + Math.max(1, Math.min(h - 1, y)).toFixed(1); }).join(" ");
  }

  /* hero sparkline */
  var spark = $("[data-spark]");
  if (spark) {
    var sv = series(32, 3, 1.2);
    var drawSpark = function () {
      var d = pathFrom(sv, 160, 44, 0, 6);
      spark.querySelector(".line").setAttribute("d", d);
      spark.querySelector(".area").setAttribute("d", d + " L160 44 L0 44 Z");
      var k = $("[data-spark-val]"); if (k) k.textContent = sv[sv.length - 1].toFixed(1);
    };
    drawSpark();
    whileVisible(spark, function () { sv.shift(); var last = sv[sv.length - 1]; sv.push(Math.max(0.8, Math.min(5.4, last + (Math.random() - 0.5) * 1.1 + (3 - last) * 0.15))); drawSpark(); }, 900);
  }

  /* hero automation steps cycle */
  var steps = $$("[data-fstep]");
  if (steps.length) {
    var si = 0;
    whileVisible(steps[0].parentNode, function () { steps.forEach(function (s, i) { s.classList.toggle("on", i === si); }); si = (si + 1) % steps.length; }, 1400);
  }

  /* digital twin dashboard */
  var twin = $("[data-twin]");
  if (twin) {
    var tv = series(60, 2.6, 0.9), W = 300, H = 96, LO = 0, HI = 6;
    var line = $(".line", twin), area = $(".area", twin);
    var vib = $("[data-k=vib]", twin), temp = $("[data-k=temp]", twin), spd = $("[data-k=speed]", twin);
    var t = 58, s = 1480;
    var drawTwin = function () {
      var d = pathFrom(tv, W, H, LO, HI);
      line.setAttribute("d", d); area.setAttribute("d", d + " L" + W + " " + H + " L0 " + H + " Z");
      vib.textContent = tv[tv.length - 1].toFixed(1);
      temp.textContent = t.toFixed(1);
      spd.textContent = Math.round(s).toLocaleString("en-US");
    };
    drawTwin();
    whileVisible(twin, function () {
      tv.shift(); var last = tv[tv.length - 1];
      tv.push(Math.max(0.6, Math.min(5.2, last + (Math.random() - 0.5) * 0.8 + (2.6 - last) * 0.12)));
      t += (Math.random() - 0.5) * 0.4 + (58 - t) * 0.05;
      s += (Math.random() - 0.5) * 12 + (1480 - s) * 0.1;
      drawTwin();
    }, 1000);
  }

  /* ---------- forms ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var params = new URLSearchParams(location.search);

  $$("form[data-lead]").forEach(function (form) {
    var kind = form.getAttribute("data-lead");
    var btn = $("button[type=submit]", form);
    var btnLabel = btn.innerHTML;
    var alertBox = $(".form-alert", form);
    var started = $("input[name=startedAt]", form);
    if (started) started.value = String(Date.now());

    // prefill product from ?product=
    var sel = $("select[name=product]", form), want = params.get("product");
    if (sel && want) { $$("option", sel).forEach(function (o) { if (o.value === want) sel.value = want; }); }

    function fieldErr(input, msg) {
      var box = document.getElementById(input.id + "-err");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (box) box.textContent = msg || "";
    }
    function check(el) {
      var v = el.type === "checkbox" ? el.checked : el.value.trim(), msg = "";
      if (el.required && !v) msg = el.type === "checkbox" ? I18N.consent : I18N.required;
      else if (el.type === "email" && v && !EMAIL.test(v)) msg = I18N.email;
      else if (el.maxLength > 0 && typeof v === "string" && v.length > el.maxLength) msg = I18N.tooLong;
      fieldErr(el, msg);
      return msg;
    }
    var fields = $$("input, select, textarea", form).filter(function (el) { return el.id && el.type !== "hidden" && !el.closest(".hp"); });
    function validate() { return fields.filter(check); }
    // Re-check a flagged field while the visitor fixes it (not on blur: a
    // disappearing message would shift the layout under the next click).
    fields.forEach(function (el) {
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", function () {
        if (el.getAttribute("aria-invalid") === "true") check(el);
      });
    });

    function mailtoHref(data) {
      var lines = [];
      Object.keys(data).forEach(function (k) { if (data[k] && ["startedAt", "website", "consent", "kind", "cf-turnstile-response"].indexOf(k) < 0) lines.push(k + ": " + data[k]); });
      return "mailto:" + (I18N.email_to || "") + "?subject=" + encodeURIComponent("Verom Solutions — " + (I18N.subjects[kind] || "Enquiry")) + "&body=" + encodeURIComponent(lines.join("\n"));
    }
    function showAlert(msg, data) {
      alertBox.hidden = false;
      alertBox.innerHTML = "";
      alertBox.appendChild(document.createTextNode(msg + " "));
      var a = document.createElement("a"); a.href = mailtoHref(data); a.textContent = I18N.emailLink; alertBox.appendChild(a);
      alertBox.focus();
    }
    function busy(on) {
      btn.disabled = on; btn.setAttribute("aria-busy", String(on));
      btn.innerHTML = on ? '<span class="spinner" aria-hidden="true"></span>' + I18N.sending : btnLabel;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (btn.disabled) return;          // duplicate-submission guard
      alertBox.hidden = true;
      var bad = validate();
      if (bad.length) { bad[0].focus(); alertBox.hidden = false; alertBox.textContent = I18N.summary; return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
      data.consent = !!$("input[name=consent]", form).checked;
      busy(true);
      fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data), credentials: "same-origin" })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.status >= 200 && res.status < 300 && res.body.ok) {
            window.veromTrack("lead_submitted", { kind: kind, product: data.product || "" });
            var ok = $("[data-ok]", form.parentNode);
            form.hidden = true; ok.hidden = false;
            var h = $("h3", ok); h.setAttribute("tabindex", "-1"); h.focus();
            return;
          }
          busy(false);
          if (res.status === 400 && res.body.fields) {
            res.body.fields.forEach(function (n) { var el = form.elements[n]; if (el && el.id) fieldErr(el, I18N.required); });
          }
          var code = res.body.error;
          showAlert(code === "not_configured" ? I18N.notConfigured : code === "rate_limited" ? I18N.rate : I18N.generic, data);
        })
        .catch(function () { busy(false); showAlert(I18N.generic, data); });
    });
  });
})();
