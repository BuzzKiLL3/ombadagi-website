/* Section 05 — interactive "instrument". Every value here is simulated in the browser. */
(function () {
  "use strict";
  var root = document.getElementById("inst");
  if (!root) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function rnd(n) { return (Math.random() - 0.5) * 2 * n; }
  var visible = false, mode = 0;

  /* ---------- tabs ---------- */
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return $(t.getAttribute("aria-controls")); });
  function setMode(i, focus) {
    mode = i;
    tabs.forEach(function (t, k) { var on = k === i; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; panels[k].hidden = !on; });
    if (focus) tabs[i].focus();
    if (i === 0) sizeTrend();
    if (i === 1) renderOE();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { setMode(i); });
    t.addEventListener("keydown", function (e) {
      var j = -1; if (e.key === "ArrowRight") j = (i + 1) % 3; if (e.key === "ArrowLeft") j = (i + 2) % 3; if (e.key === "Home") j = 0; if (e.key === "End") j = 2;
      if (j > -1) { e.preventDefault(); setMode(j, true); }
    });
  });

  /* =================== 1. MACHINE INTELLIGENCE =================== */
  var dial = $("dial"), MAX = 10, LIMIT = 4.5, A0 = -135, A1 = 135;
  function ang(v) { return A0 + (A1 - A0) * Math.min(1, Math.max(0, v / MAX)); }
  function pt(a, r) { var t = (a - 90) * Math.PI / 180; return [120 + r * Math.cos(t), 120 + r * Math.sin(t)]; }
  function arc(v0, v1, r) { var a = pt(ang(v0), r), b = pt(ang(v1), r), large = (ang(v1) - ang(v0)) > 180 ? 1 : 0; return "M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + " A" + r + " " + r + " 0 " + large + " 1 " + b[0].toFixed(2) + " " + b[1].toFixed(2); }
  el("circle", { cx: 120, cy: 120, r: 112, class: "face" }, dial);
  el("circle", { cx: 120, cy: 120, r: 112, class: "bezel" }, dial);
  el("path", { d: arc(0, LIMIT, 96), class: "arc-ok", fill: "none", "stroke-width": 6 }, dial);
  el("path", { d: arc(LIMIT, MAX, 96), class: "arc-alert", fill: "none", "stroke-width": 6 }, dial);
  for (var v = 0; v <= MAX + 0.001; v += 0.5) {
    var major = Math.abs(v % 2) < 0.001, a = ang(v), p1 = pt(a, major ? 84 : 88), p2 = pt(a, 92);
    el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "tick" + (major ? " major" : "") }, dial);
    if (major) { var lp = pt(a, 72); var tx = el("text", { x: lp[0], y: lp[1] + 4, class: "lbl" }, dial); tx.textContent = String(v); }
  }
  var needle = el("line", { x1: 120, y1: 132, x2: 120, y2: 34, class: "needle" }, dial);
  el("circle", { cx: 120, cy: 120, r: 7, class: "hub" }, dial);

  var wearIn = $("in-wear"), loadIn = $("in-load"), trend = $("mi-trend"), tctx = trend.getContext("2d");
  var series = [], above = 0, lastState = "";
  function model() {
    var w = wearIn.value / 100, l = loadIn.value / 100;
    return {
      vib: Math.max(0.3, 0.8 + 1.4 * l + 5.4 * w * w + rnd(0.14 + w * 0.3)),
      temp: 38 + 14 * l + 32 * w * w + rnd(0.6),
      cur: 12 + 14 * l + 2.2 * w + rnd(0.25)
    };
  }
  for (var i = 0; i < 60; i++) series.push(model().vib);
  function miTick() {
    var m = model();
    series.push(m.vib); if (series.length > 60) series.shift();
    above = m.vib > LIMIT ? above + 1 : 0;
    needle.style.transform = "rotate(" + ang(m.vib).toFixed(2) + "deg)";
    $("mi-vib").textContent = m.vib.toFixed(2);
    $("mi-temp").textContent = m.temp.toFixed(1);
    $("mi-cur").textContent = m.cur.toFixed(1);
    var st = above >= 3 ? "alert" : (m.vib > 2.8 ? "watch" : "ok");
    var s = $("mi-state"); s.className = "state" + (st === "ok" ? "" : " " + st);
    s.textContent = st === "alert" ? "Plan maintenance" : st === "watch" ? "Watch" : "Normal";
    if (st !== lastState) {
      lastState = st;
      $("mi-insight").textContent = st === "alert"
        ? "Vibration has stayed above 4.5 mm/s for three readings while load is steady — consistent with bearing wear. Suggested: inspect at the next planned stop and order the spare now."
        : st === "watch" ? "Vibration is rising faster than load explains. Worth trending daily and checking lubrication before it reaches the alert limit."
        : "Readings are within normal range for this load. No action needed — the value is in seeing the trend before it changes.";
    }
    drawTrend();
  }
  function sizeTrend() { var r = trend.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); if (!r.width) return; trend.width = Math.round(r.width * d); trend.height = Math.round(r.height * d); tctx.setTransform(d, 0, 0, d, 0, 0); drawTrend(); }
  function drawTrend() {
    var W = trend.clientWidth, H = trend.clientHeight; if (!W) return;
    var c = tctx; c.clearRect(0, 0, W, H);
    var pl = 26, pt2 = 8, pb = 16, gw = W - pl - 4, gh = H - pt2 - pb;
    function y(v) { return pt2 + gh - Math.min(v, MAX) / MAX * gh; }
    c.font = "11px 'Hanken Grotesk', sans-serif"; c.lineWidth = 1;
    [0, 2, 4, 6, 8, 10].forEach(function (g) { c.strokeStyle = "rgba(243,235,221,.07)"; c.beginPath(); c.moveTo(pl, y(g)); c.lineTo(W - 4, y(g)); c.stroke(); c.fillStyle = "rgba(243,235,221,.45)"; c.fillText(String(g), 2, y(g) + 4); });
    c.strokeStyle = "rgba(176,80,92,.9)"; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(pl, y(LIMIT)); c.lineTo(W - 4, y(LIMIT)); c.stroke(); c.setLineDash([]);
    var grad = c.createLinearGradient(0, pt2, 0, H - pb); grad.addColorStop(0, "rgba(210,188,138,.28)"); grad.addColorStop(1, "rgba(210,188,138,0)");
    c.beginPath(); series.forEach(function (v, k) { var x = pl + k / 59 * gw; if (k) c.lineTo(x, y(v)); else c.moveTo(x, y(v)); });
    c.lineTo(pl + gw, H - pb); c.lineTo(pl, H - pb); c.closePath(); c.fillStyle = grad; c.fill();
    c.beginPath(); series.forEach(function (v, k) { var x = pl + k / 59 * gw; if (k) c.lineTo(x, y(v)); else c.moveTo(x, y(v)); });
    c.strokeStyle = "#F3EBDD"; c.lineWidth = 1.4; c.lineJoin = "round"; c.stroke();
    var lv = series[series.length - 1]; c.fillStyle = lv > LIMIT ? "#E08A96" : "#D2BC8A"; c.beginPath(); c.arc(pl + gw, y(lv), 3.5, 0, 7); c.fill();
    c.fillStyle = "rgba(243,235,221,.4)"; c.fillText("last 60 readings", pl, H - 2);
  }
  function syncOut() { $("o-wear").textContent = wearIn.value + "%"; $("o-load").textContent = loadIn.value + "%"; }
  wearIn.addEventListener("input", function () { syncOut(); miTick(); });
  loadIn.addEventListener("input", function () { syncOut(); miTick(); });
  syncOut();

  /* =================== 2. OPERATIONAL EXCELLENCE =================== */
  var SHIFT = 480, P = 0.91, Q = 0.976;
  var BASE = [["run", 55], ["chg", 25], ["run", 80], ["stop", 12], ["run", 85], ["chg", 25], ["run", 60], ["stop", 18], ["run", 120]];
  var segs = BASE.map(function (s) { return s.slice(); });
  var sub = $("subdials"), dials = {};
  [["oee", "OEE", true], ["a", "Availability"], ["p", "Performance"], ["q", "Quality"]].forEach(function (d) {
    var w = document.createElement("div"); w.className = "subdial" + (d[2] ? " big" : "");
    var s = el("svg", { viewBox: "0 0 120 120", role: "img", "aria-label": d[1] }, null);
    el("circle", { cx: 60, cy: 60, r: 50, fill: "none", class: "track", "stroke-width": 5 }, s);
    var C = 2 * Math.PI * 50;
    var val = el("circle", { cx: 60, cy: 60, r: 50, fill: "none", class: "val", "stroke-width": 5, "stroke-dasharray": C.toFixed(1), "stroke-dashoffset": C.toFixed(1), transform: "rotate(-90 60 60)", "stroke-linecap": "butt" }, s);
    var t = el("text", { x: 60, y: 69 }, s);
    w.appendChild(s); var p = document.createElement("p"); p.textContent = d[1]; w.appendChild(p); sub.appendChild(w);
    dials[d[0]] = { val: val, t: t, C: C, svg: s, name: d[1] };
  });
  function setDial(k, f) { var d = dials[k]; d.val.setAttribute("stroke-dashoffset", (d.C * (1 - f)).toFixed(1)); d.t.textContent = Math.round(f * 100) + "%"; d.svg.setAttribute("aria-label", d.name + " " + Math.round(f * 100) + " percent"); }
  function totals() { var t = { run: 0, chg: 0, stop: 0 }; segs.forEach(function (s) { t[s[0]] += s[1]; }); return t; }
  function renderOE() {
    var tl = $("timeline"); tl.innerHTML = "";
    segs.forEach(function (s) { var i = document.createElement("i"); i.className = s[0]; i.style.flexGrow = s[1]; i.title = (s[0] === "run" ? "Running" : s[0] === "chg" ? "Changeover" : "Unplanned stop") + " · " + Math.round(s[1]) + " min"; tl.appendChild(i); });
    var t = totals(), A = t.run / SHIFT;
    setDial("a", A); setDial("p", P); setDial("q", Q); setDial("oee", A * P * Q);
    tl.setAttribute("aria-label", "Shift timeline: " + Math.round(t.run) + " minutes running, " + Math.round(t.chg) + " minutes changeover, " + Math.round(t.stop) + " minutes unplanned stops");
    var big = t.chg >= t.stop ? "changeovers (" + Math.round(t.chg) + " min)" : "unplanned stops (" + Math.round(t.stop) + " min)";
    $("oe-insight").textContent = "Availability is the weakest factor this shift. The largest loss is " + big + " — that is where a Lean study would start, before any new technology.";
  }
  function takeFromRun(min, type) {
    var runs = segs.map(function (s, i) { return [s, i]; }).filter(function (x) { return x[0][0] === "run" && x[0][1] > min + 10; });
    if (!runs.length) return false;
    var pick = runs[Math.floor(Math.random() * runs.length)], s = pick[0], idx = pick[1];
    var before = Math.round((s[1] - min) * (0.3 + Math.random() * 0.4));
    segs.splice(idx, 1, ["run", before], [type, min], ["run", s[1] - min - before]);
    return true;
  }
  root.querySelectorAll("[data-oe]").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-oe");
      if (a === "chg") takeFromRun(20, "chg");
      if (a === "stop") takeFromRun(10 + Math.round(Math.random() * 15), "stop");
      if (a === "smed") { segs = segs.map(function (s) { return s[0] === "chg" ? ["chg", Math.max(6, s[1] * 0.45)] : s; }); var t = totals(); var rest = SHIFT - t.chg - t.stop - t.run; segs.push(["run", rest]); merge(); }
      if (a === "reset") segs = BASE.map(function (s) { return s.slice(); });
      renderOE();
    });
  });
  function merge() { var out = []; segs.forEach(function (s) { if (out.length && out[out.length - 1][0] === s[0]) out[out.length - 1][1] += s[1]; else out.push(s.slice()); }); segs = out; }

  /* =================== 3. BUSINESS AUTOMATION =================== */
  var ICON = {
    alarm: '<path d="M12 3v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M17.7 6.3l1.4-1.4"/><path d="M7 18v-5a5 5 0 0 1 10 0v5"/><path d="M4 18h16"/>',
    note: '<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h4"/>',
    send: '<path d="M4 12 20 4l-4 16-4-6-8-2z"/><path d="m12 14 8-10"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>'
  };
  var FLOW = {
    manual: [["alarm", "Alarm noticed", "Operator, on the shop floor", 720], ["note", "Written down", "Paper log or spreadsheet", 480], ["send", "Passed on", "Phone call or a walk to maintenance", 1200], ["db", "Logged", "Re-typed into the maintenance system", 900], ["chart", "Reported", "Weekly report compiled by hand", 2700]],
    auto: [["alarm", "Alarm detected", "Rule on the live signal", 2], ["note", "Captured", "Event stored with the trend", 1], ["send", "Notified", "Message to maintenance, with context", 5], ["db", "Logged", "Work order drafted for approval", 20], ["chart", "Reported", "Dashboard updates itself", 30]]
  };
  var flowEl = $("flow"), runBtn = $("ba-run"), timeEl = $("ba-time"), baMode = "manual", running = false;
  function fmt(sec) { if (sec < 60) return Math.round(sec) + " s"; var m = Math.round(sec / 60); if (m < 60) return m + " min"; return Math.floor(m / 60) + " h " + (m % 60) + " min"; }
  function buildFlow() {
    var f = FLOW[baMode];
    flowEl.innerHTML = f.map(function (s) { return '<li><span class="node"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[s[0]] + "</svg></span><h4>" + s[1] + '</h4><p class="who">' + s[2] + '</p><span class="t">' + fmt(s[3]) + "</span></li>"; }).join("") + '<li class="token" aria-hidden="true"></li>';
    timeEl.textContent = "0 min";
    var total = f.reduce(function (a, s) { return a + s[3]; }, 0);
    $("ba-insight").textContent = baMode === "manual"
      ? "Today: about " + fmt(total) + " of people's time between the alarm and the report, with three re-typing steps where errors creep in."
      : "Automated: about " + fmt(total) + " end to end. A person still approves the work order — automation removes the carrying, not the judgement.";
  }
  document.querySelectorAll('input[name="ba-mode"]').forEach(function (r) { r.addEventListener("change", function () { if (running) return; baMode = r.value; buildFlow(); }); });
  runBtn.addEventListener("click", function () {
    if (running) return; running = true; runBtn.disabled = true;
    var f = FLOW[baMode], lis = Array.prototype.slice.call(flowEl.querySelectorAll("li:not(.token)")), token = flowEl.querySelector(".token");
    lis.forEach(function (l) { l.classList.remove("on", "done"); });
    var elapsed = 0, i = 0, stepMs = reduce ? 0 : 750;
    function step() {
      if (i > 0) lis[i - 1].classList.replace("on", "done");
      if (i >= f.length) { running = false; runBtn.disabled = false; runBtn.textContent = "Run again"; if (token) token.style.opacity = 0; return; }
      lis[i].classList.add("on");
      if (token && !reduce && window.innerWidth > 640) {
        var r = flowEl.getBoundingClientRect(), n = lis[i].getBoundingClientRect();
        token.style.opacity = 1; token.style.transition = "left .7s cubic-bezier(.16,1,.3,1)"; token.style.left = (n.left - r.left + n.width / 2) + "px";
      }
      var from = elapsed; elapsed += f[i][3]; var t0 = performance.now(), to = elapsed;
      (function count(now) { var p = stepMs ? Math.min(1, (now - t0) / stepMs) : 1; timeEl.textContent = fmt(from + (to - from) * p); if (p < 1) requestAnimationFrame(count); })(t0);
      i++; setTimeout(step, stepMs + (reduce ? 0 : 150));
    }
    step();
  });
  buildFlow();

  /* ---------- run only while visible ---------- */
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) sizeTrend(); }, { threshold: 0.05 }).observe(root);
  else visible = true;
  setInterval(function () { if (visible && mode === 0 && !document.hidden) miTick(); }, reduce ? 2000 : 900);
  window.addEventListener("resize", sizeTrend);
  setMode(0); miTick();
})();
