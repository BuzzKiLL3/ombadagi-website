/* Section 03: multi-machine monitoring demo. Every value is simulated in the browser. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var list = S.machines || [];
  var tabsEl = document.getElementById("mtabs");
  if (!tabsEl || !list.length) return;

  var cv = document.getElementById("trend"), ctx = cv.getContext("2d");
  var faultBtn = document.getElementById("fault-btn"), pauseBtn = document.getElementById("pause-btn");
  var traceEl = document.getElementById("trace"), kpiEl = document.getElementById("kpis"), sensEl = document.getElementById("sens");
  var root = document.getElementById("lab-root");
  var N = 90, cur = 0, m = null, st = null, paused = false, visible = false;

  var ICON = {
    cnc: '<rect x="6" y="8" width="36" height="28"/><rect x="11" y="13" width="18" height="16"/><path d="M20 13v8"/><rect x="33" y="14" width="5" height="10"/>',
    motor: '<rect x="6" y="14" width="24" height="18" rx="2"/><path d="M30 23h6"/><circle cx="40" cy="23" r="4"/><path d="M10 14v-3M16 14v-3M22 14v-3"/>',
    pump: '<circle cx="28" cy="24" r="11"/><path d="M28 13v-6h12M6 24h11"/><circle cx="28" cy="24" r="3"/>',
    conveyor: '<rect x="4" y="22" width="40" height="5" rx="2.5"/><rect x="10" y="13" width="8" height="8"/><rect x="26" y="13" width="8" height="8"/><path d="M10 27v9M38 27v9"/>',
    robot: '<path d="M10 38h14M17 38v-8l8-12 10 6"/><circle cx="17" cy="30" r="2"/><circle cx="25" cy="18" r="2"/><path d="M35 24l4 4M35 24l5-1"/>',
    line: '<rect x="4" y="18" width="9" height="12"/><rect x="19" y="18" width="9" height="12"/><rect x="34" y="18" width="9" height="12"/><path d="M13 24h6M28 24h6"/><path d="M4 36h39" stroke-dasharray="2 3"/>'
  };

  var btns = list.map(function (mc, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.id = "mt-" + i; b.setAttribute("aria-controls", "mpanel");
    b.innerHTML = '<svg viewBox="0 0 48 44" aria-hidden="true">' + (ICON[mc.id] || "") + '</svg><span>' + mc.short + "</span>";
    b.addEventListener("click", function () { pick(i); });
    b.addEventListener("keydown", function (e) {
      var j = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % list.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + list.length) % list.length;
      if (j > -1) { e.preventDefault(); pick(j); btns[j].focus(); }
    });
    tabsEl.appendChild(b);
    return b;
  });

  function rnd(n) { return (Math.random() - 0.5) * 2 * n; }
  function alerting(v) { return m.signal.low ? v < m.signal.limit : v > m.signal.limit; }
  function sample() { return m.signal.base + rnd(m.signal.noise) + st.sev * m.signal.fault + (st.sev > 0.2 ? rnd(m.signal.noise) * st.sev : 0); }

  function pick(i) {
    cur = i; m = list[i];
    btns.forEach(function (b, k) { var on = k === i; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle("is-on", on); });
    document.getElementById("mpanel").setAttribute("aria-labelledby", "mt-" + i);
    st = { sev: 0, fault: false, above: 0, alerted: false, min: 8 * 60, series: [], kpi: m.kpis.map(function (k) { return k[2]; }) };
    for (var n = 0; n < N; n++) st.series.push(sample());
    document.getElementById("m-title").textContent = m.name.toUpperCase();
    document.getElementById("sig-name").textContent = m.signal.name + " · " + m.signal.unit;
    document.getElementById("lim-lbl").textContent = (m.signal.low ? "Low limit " : "Alert limit ") + m.signal.limit;
    document.getElementById("m-link").textContent = m.link;
    sensEl.innerHTML = "";
    m.sensors.forEach(function (s) { var li = document.createElement("li"); li.innerHTML = "<span></span><em></em>"; li.firstChild.textContent = s[0]; li.lastChild.textContent = s[1]; sensEl.appendChild(li); });
    faultBtn.textContent = m.fault; faultBtn.setAttribute("aria-pressed", "false");
    traceEl.innerHTML = '<li class="t-idle">Normal operation. Press “' + m.fault + '”.</li>';
    render();
  }

  function log(kind, msg) {
    var idle = traceEl.querySelector(".t-idle"); if (idle) idle.remove();
    var li = document.createElement("li"); li.className = "t-" + kind;
    li.innerHTML = "<time></time><span></span>";
    li.firstChild.textContent = hhmm(st.min); li.lastChild.textContent = msg;
    traceEl.prepend(li);
    while (traceEl.children.length > 5) traceEl.lastChild.remove();
  }
  function hhmm(x) { x = x % 1440; return pad(Math.floor(x / 60)) + ":" + pad(x % 60); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function step() {
    st.min += 1;
    st.sev = st.fault ? Math.min(1, st.sev + 0.08) : Math.max(0, st.sev - 0.1);
    var v = sample();
    st.series.push(v); if (st.series.length > N) st.series.shift();
    st.kpi = st.kpi.map(function (k, j) { var b = m.kpis[j]; return b[2] + rnd(b[3]) + (j === 0 ? b[2] * 0.06 * st.sev * (m.signal.low ? -1 : 1) : 0); });
    if (alerting(v)) st.above++; else st.above = 0;
    if (st.above >= 3 && !st.alerted) {
      st.alerted = true; var mid = m.id;
      log("warn", m.insight[0]);
      setTimeout(function () { if (st.alerted && m.id === mid) log("ok", m.insight[1]); }, 1100);
    }
  }

  function render() {
    var v = st.series[st.series.length - 1];
    var now = document.getElementById("sig-now");
    now.textContent = fmt(v); now.classList.toggle("is-warn", alerting(v));
    document.getElementById("lab-clock").textContent = hhmm(st.min) + " sim";
    kpiEl.innerHTML = "";
    m.kpis.forEach(function (k, j) {
      var d = document.createElement("div");
      d.innerHTML = "<dt></dt><dd><span class='num'></span><small></small></dd>";
      d.querySelector("dt").textContent = k[0]; d.querySelector(".num").textContent = fmt(st.kpi[j]); d.querySelector("small").textContent = k[1];
      kpiEl.appendChild(d);
    });
    drawTrend();
  }
  function fmt(v) { return Math.abs(v) >= 100 ? Math.round(v).toString() : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2); }

  var W = 0, H = 0;
  function size() {
    var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    ctx.setTransform(d, 0, 0, d, 0, 0); if (m) drawTrend();
  }
  function drawTrend() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    var sg = m.signal, lo = Math.min(sg.base - sg.noise * 3, sg.limit, sg.base + sg.fault) , hi = Math.max(sg.base + sg.noise * 3, sg.limit, sg.base + sg.fault);
    var padv = (hi - lo) * 0.15; lo -= padv; hi += padv; if (lo < 0 && sg.base > 0) lo = 0;
    var pl = 40, pr = 8, pt = 8, pb = 18, gw = W - pl - pr, gh = H - pt - pb;
    function y(v) { return pt + gh - (v - lo) / (hi - lo) * gh; }
    ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var gv = lo + (hi - lo) * i / 4, gy = y(gv);
      ctx.strokeStyle = "rgba(236,235,230,.07)"; ctx.beginPath(); ctx.moveTo(pl, gy); ctx.lineTo(W - pr, gy); ctx.stroke();
      ctx.fillStyle = "rgba(236,235,230,.4)"; ctx.fillText(fmt(gv), 2, gy + 3);
    }
    ctx.fillText("−90 min", pl, H - 4); ctx.fillText("now", W - pr - 20, H - 4);
    ctx.strokeStyle = "rgba(240,166,58,.8)"; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pl, y(sg.limit)); ctx.lineTo(W - pr, y(sg.limit)); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    var s = st.series;
    for (var k = 1; k < s.length; k++) {
      ctx.strokeStyle = alerting(s[k]) ? "#f0a63a" : "#5fd4e0";
      ctx.beginPath(); ctx.moveTo(pl + (k - 1) / (N - 1) * gw, y(s[k - 1])); ctx.lineTo(pl + k / (N - 1) * gw, y(s[k])); ctx.stroke();
    }
    ctx.fillStyle = alerting(s[s.length - 1]) ? "#f0a63a" : "#5fd4e0";
    ctx.beginPath(); ctx.arc(pl + gw, y(s[s.length - 1]), 3, 0, 7); ctx.fill();
  }

  faultBtn.addEventListener("click", function () {
    st.fault = !st.fault;
    faultBtn.setAttribute("aria-pressed", String(st.fault));
    faultBtn.textContent = st.fault ? "Resolve issue" : m.fault;
    if (st.fault) log("ok", "Issue injected — watch the " + m.signal.name.toLowerCase() + " trend.");
    else { if (st.alerted) log("ok", "Issue resolved — signal returning to normal."); st.alerted = false; st.above = 0; }
  });
  pauseBtn.addEventListener("click", function () {
    paused = !paused; pauseBtn.setAttribute("aria-pressed", String(paused)); pauseBtn.textContent = paused ? "Resume" : "Pause";
  });

  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(root);
  else visible = true;
  setInterval(function () { if (!paused && visible && !document.hidden) { step(); render(); } }, 700);
  window.addEventListener("resize", size);
  pick(0); size();
})();
