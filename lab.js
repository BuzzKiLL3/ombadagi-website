/* Section 05: simulated production cell — vibration trend, OEE, downtime Pareto, automation trace.
   Everything here is generated in the browser. Nothing is a real installation. */
(function () {
  "use strict";
  var root = document.getElementById("lab-root");
  if (!root) return;
  var cv = document.getElementById("trend");
  var ctx = cv.getContext("2d");
  var faultBtn = document.getElementById("fault-btn");
  var pauseBtn = document.getElementById("pause-btn");
  var traceEl = document.getElementById("trace");
  var paretoEl = document.getElementById("pareto");
  var clockEl = document.getElementById("lab-clock");

  var LIMIT = 4.5, N = 120;
  var series = [];
  var s = {
    vib: 2.1, fault: false, sev: 0, above: 0, alerted: false, stopped: false,
    planned: 0, run: 0, total: 0, good: 0, simMin: 6 * 60, // shift starts 06:00
    down: { "Changeover": 0, "Material wait": 0, "Minor stops": 0, "Bearing / mechanical": 0, "Quality check": 0 },
    wo: 4800 + Math.floor(Math.random() * 100)
  };
  var paused = false, visible = false, timer = 0;

  // pre-roll ~3 hours so numbers start realistic
  for (var i = 0; i < 180; i++) step(true);
  for (var j = 0; j < N; j++) series.push(noiseVib());

  function noiseVib() { return Math.max(0.6, 2.1 + (Math.random() - 0.5) * 0.6 + Math.sin(s.simMin / 7) * 0.15); }

  function step(silent) {
    s.simMin += 1; s.planned += 1;
    // vibration
    if (s.fault) s.sev = Math.min(1, s.sev + 0.08); else s.sev = Math.max(0, s.sev - 0.08);
    s.vib = noiseVib() + s.sev * 3.9 + (s.sev > 0.2 ? (Math.random() - 0.5) * 0.8 * s.sev : 0);
    if (!silent) { series.push(s.vib); if (series.length > N) series.shift(); }

    // detection rule: 3 consecutive readings above limit
    if (s.vib > LIMIT) s.above++; else s.above = 0;
    if (!silent && s.above >= 3 && !s.alerted) alertFlow();
    if (s.alerted && s.sev > 0.95 && !s.stopped) {
      s.stopped = true;
      log("warn", "Machine stopped for bearing inspection — downtime reason auto-tagged");
    }

    // production
    if (s.stopped) {
      s.down["Bearing / mechanical"] += 1;
    } else {
      var r = Math.random();
      if (r < 0.025) s.down["Changeover"] += 4;
      else if (r < 0.055) s.down["Material wait"] += 2;
      else if (r < 0.12) s.down["Minor stops"] += 1;
      else if (r < 0.13) s.down["Quality check"] += 2;
      else {
        s.run += 1;
        var made = 12 * (0.86 + Math.random() * 0.08);
        s.total += made;
        s.good += made * (0.978 + Math.random() * 0.015);
      }
    }
  }

  function alertFlow() {
    s.alerted = true;
    log("warn", "Vibration > " + LIMIT + " mm/s on press P-2, drive-end bearing (3 consecutive readings)");
    later(900, "ok", "Rule confirmed — not a single spike; trend rising");
    later(1800, "ok", "Work order WO-" + (++s.wo) + " drafted in maintenance system");
    later(2700, "ok", "Maintenance lead notified with trend snapshot attached");
    later(3600, "ok", "Spare bearing availability checked against stock list");
  }
  function later(ms, kind, msg) { setTimeout(function () { if (s.alerted) log(kind, msg); }, ms); }

  function log(kind, msg) {
    var idle = traceEl.querySelector(".t-idle"); if (idle) idle.remove();
    var li = document.createElement("li");
    li.className = "t-" + kind;
    li.innerHTML = "<time>" + hhmm(s.simMin) + "</time><span></span>";
    li.lastChild.textContent = msg;
    traceEl.prepend(li);
    while (traceEl.children.length > 6) traceEl.lastChild.remove();
  }
  function hhmm(m) { m = m % 1440; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function render() {
    // OEE
    var A = s.run / s.planned, P = s.total / (s.run * 12 || 1), Q = s.good / (s.total || 1);
    var O = A * P * Q;
    txt("oee", (O * 100).toFixed(1));
    txt("o-a", (A * 100).toFixed(1) + "%"); bar("b-a", A);
    txt("o-p", (P * 100).toFixed(1) + "%"); bar("b-p", P);
    txt("o-q", (Q * 100).toFixed(1) + "%"); bar("b-q", Q);
    txt("vib-now", s.vib.toFixed(2));
    document.getElementById("vib-now").classList.toggle("is-warn", s.vib > LIMIT);
    clockEl.textContent = hhmm(s.simMin) + " sim";

    // Pareto
    var items = Object.keys(s.down).map(function (k) { return [k, s.down[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
    var max = items[0][1] || 1;
    paretoEl.innerHTML = "";
    items.forEach(function (it) {
      var li = document.createElement("li");
      if (it[0] === "Bearing / mechanical" && it[1] > 0) li.className = "hot";
      li.innerHTML = '<span class="pn"></span><i class="pb"><b style="width:' + (it[1] / max * 100).toFixed(1) + '%"></b></i><span class="pv num">' + it[1] + "</span>";
      li.firstChild.textContent = it[0];
      paretoEl.appendChild(li);
    });

    drawTrend();
  }
  function txt(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  function bar(id, v) { var e = document.getElementById(id); if (e) e.style.width = Math.max(0, Math.min(1, v)) * 100 + "%"; }

  var W = 0, H = 0;
  function size() {
    var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    drawTrend();
  }
  function drawTrend() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    var pad = { l: 28, r: 6, t: 8, b: 16 }, max = 8;
    var gw = W - pad.l - pad.r, gh = H - pad.t - pad.b;
    function y(v) { return pad.t + gh - (v / max) * gh; }
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(236,235,230,.4)";
    ctx.strokeStyle = "rgba(236,235,230,.07)";
    ctx.lineWidth = 1;
    for (var g = 0; g <= max; g += 2) {
      ctx.beginPath(); ctx.moveTo(pad.l, y(g)); ctx.lineTo(W - pad.r, y(g)); ctx.stroke();
      ctx.fillText(String(g), 4, y(g) + 3);
    }
    ctx.fillText("−2 h", pad.l, H - 3);
    ctx.fillText("now", W - pad.r - 20, H - 3);
    // limit
    ctx.strokeStyle = "rgba(240,166,58,.8)"; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y(LIMIT)); ctx.lineTo(W - pad.r, y(LIMIT)); ctx.stroke();
    ctx.setLineDash([]);
    // signal
    ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    for (var i = 1; i < series.length; i++) {
      var x0 = pad.l + ((i - 1) / (N - 1)) * gw, x1 = pad.l + (i / (N - 1)) * gw;
      ctx.strokeStyle = series[i] > LIMIT ? "#f0a63a" : "#5fd4e0";
      ctx.beginPath(); ctx.moveTo(x0, y(series[i - 1])); ctx.lineTo(x1, y(series[i])); ctx.stroke();
    }
    var lx = pad.l + gw, ly = y(series[series.length - 1]);
    ctx.fillStyle = series[series.length - 1] > LIMIT ? "#f0a63a" : "#5fd4e0";
    ctx.beginPath(); ctx.arc(lx, ly, 3, 0, 7); ctx.fill();
  }

  function loop() {
    if (!paused && visible) { step(false); render(); }
  }
  function run() { if (!timer) timer = setInterval(loop, 700); }

  faultBtn.addEventListener("click", function () {
    s.fault = !s.fault;
    faultBtn.setAttribute("aria-pressed", String(s.fault));
    faultBtn.textContent = s.fault ? "Clear fault" : "Inject bearing fault";
    if (s.fault) {
      log("ok", "Bearing wear simulated on press P-2 — watch the trend");
    } else {
      if (s.alerted) log("ok", "Bearing replaced — trend back to normal, WO-" + s.wo + " closed");
      s.alerted = false; s.stopped = false; s.above = 0;
    }
  });
  pauseBtn.addEventListener("click", function () {
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.textContent = paused ? "Resume" : "Pause";
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(root);
  } else visible = true;

  window.addEventListener("resize", size);
  size(); render(); run();
})();
