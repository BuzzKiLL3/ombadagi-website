/* Hero: isometric connected factory — several machine types, data flowing to business systems.
   Canvas 2D, no libraries. Hotspots are real buttons layered over the canvas. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var fig = document.getElementById("eco");
  var cv = document.getElementById("eco-canvas");
  if (!fig || !cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var hotWrap = document.getElementById("eco-hot");
  var card = document.getElementById("eco-card");
  var sysList = document.getElementById("eco-sys");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var C = {
    grid: "rgba(236,235,230,0.06)", edge: "rgba(236,235,230,0.16)",
    line: "rgba(236,235,230,0.34)", hi: "rgba(236,235,230,0.72)", back: "rgba(236,235,230,0.10)",
    acc: "#5fd4e0", accDim: "rgba(95,212,224,0.28)", warn: "#f0a63a"
  };

  // systems strip (HTML so text stays crisp + accessible order irrelevant: decorative)
  var systems = S.systems || [];
  systems.forEach(function (n) { var li = document.createElement("li"); li.textContent = n; sysList.appendChild(li); });
  var sysEls = Array.prototype.slice.call(sysList.children);

  // machine definitions: id, footprint, sensor point, systems it feeds
  var M = [
    { id: "cnc", x: 0.6, y: 0.8, feeds: [0, 1, 4] },
    { id: "robot", x: 4.6, y: 1.0, feeds: [0, 1, 4] },
    { id: "press", x: 8.4, y: 0.6, feeds: [0, 1, 4] },
    { id: "pump", x: 0.8, y: 5.0, feeds: [1, 4] },
    { id: "conveyor", x: 4.2, y: 4.9, feeds: [0, 4] },
    { id: "rack", x: 9.4, y: 4.2, feeds: [2, 3, 4] }
  ];
  var FW = 12, FD = 8;
  var W = 0, H = 0, s = 30, ox = 0, oy = 0, px = 0, py = 0, tpx = 0, tpy = 0;
  var sel = -1, hov = -1, t0 = performance.now(), raf = 0, visible = true;

  function P(x, y, z) {
    return [ox + (x - y) * 0.866 * s + px * (1 + z * 0.15), oy + (x + y) * 0.5 * s - z * s + py * (1 + z * 0.15)];
  }
  function ln(a, b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  function pl(pts, close) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); if (close) ctx.closePath(); ctx.stroke(); }

  function box(x, y, z, w, d, h, col) {
    var a = P(x, y, z), b = P(x + w, y, z), c = P(x + w, y + d, z), e = P(x, y + d, z);
    var a2 = P(x, y, z + h), b2 = P(x + w, y, z + h), c2 = P(x + w, y + d, z + h), e2 = P(x, y + d, z + h);
    ctx.strokeStyle = C.back; ln(a, b); ln(a, e); ln(a, a2);
    ctx.strokeStyle = col; ln(b, c); ln(c, e); ln(b, b2); ln(c, c2); ln(e, e2); pl([a2, b2, c2, e2], true);
  }
  function ringV(cx, cy, z, r, n) { var p = []; for (var i = 0; i <= (n || 20); i++) { var a = i / (n || 20) * Math.PI * 2; p.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z)); } return p; }
  function cylV(cx, cy, z, r, h, col) {
    ctx.strokeStyle = col; pl(ringV(cx, cy, z, r)); pl(ringV(cx, cy, z + h, r));
    [-Math.PI / 4, Math.PI * 3 / 4].forEach(function (a) { ln(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z), P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + h)); });
  }
  function ringX(x, cy, cz, r) { var p = []; for (var i = 0; i <= 20; i++) { var a = i / 20 * Math.PI * 2; p.push(P(x, cy + Math.cos(a) * r, cz + Math.sin(a) * r)); } return p; }
  function cylX(x0, x1, cy, cz, r, col) {
    ctx.strokeStyle = col; pl(ringX(x0, cy, cz, r)); pl(ringX(x1, cy, cz, r));
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(function (a) { ln(P(x0, cy + Math.cos(a) * r, cz + Math.sin(a) * r), P(x1, cy + Math.cos(a) * r, cz + Math.sin(a) * r)); });
  }

  // ---- machines; each returns its sensor point in world coords ----
  var draw = {
    cnc: function (m, col, t) {
      var x = m.x, y = m.y;
      box(x, y, 0, 2.4, 1.8, 1.9, col);
      // door window on front (+y) face
      ctx.strokeStyle = col; pl([P(x + 0.35, y + 1.8, 0.55), P(x + 1.55, y + 1.8, 0.55), P(x + 1.55, y + 1.8, 1.55), P(x + 0.35, y + 1.8, 1.55)], true);
      // spindle inside (seen through window)
      ctx.strokeStyle = C.accDim; ln(P(x + 0.95, y + 1.0, 1.7), P(x + 0.95, y + 1.0, 1.0 + Math.sin(t / 700) * 0.15));
      // control pendant
      box(x + 2.4, y + 1.2, 0.9, 0.15, 0.5, 0.7, col);
      return [x + 1.2, y + 0.9, 1.9];
    },
    robot: function (m, col, t) {
      var cx = m.x + 0.9, cy = m.y + 0.9;
      box(m.x, m.y, 0, 1.8, 1.8, 0.12, C.edge); // cell floor plate
      cylV(cx, cy, 0.12, 0.42, 0.4, col);
      var a = reduce ? 0.6 : 0.6 + Math.sin(t / 1300) * 0.9;
      var sh = P(cx, cy, 1.25);
      var el = [cx + Math.cos(a) * 0.9, cy + Math.sin(a) * 0.9, 1.75];
      var wr = [cx + Math.cos(a) * 1.55, cy + Math.sin(a) * 1.55, 1.05 + Math.sin(t / 650) * 0.12];
      ctx.strokeStyle = col; ctx.lineWidth = 2.2;
      ln(P(cx, cy, 0.52), sh); ln(sh, P(el[0], el[1], el[2])); ln(P(el[0], el[1], el[2]), P(wr[0], wr[1], wr[2]));
      ctx.lineWidth = 1;
      [P(cx, cy, 0.52), sh, P(el[0], el[1], el[2])].forEach(function (j) { ctx.beginPath(); ctx.arc(j[0], j[1], 3.2, 0, 7); ctx.stroke(); });
      var g = P(wr[0], wr[1], wr[2]); ln(g, [g[0] - 5, g[1] + 7]); ln(g, [g[0] + 5, g[1] + 7]);
      return [cx, cy, 1.9];
    },
    press: function (m, col, t) {
      var x = m.x, y = m.y;
      box(x, y, 0, 2.0, 1.5, 0.55, col);            // bed
      box(x, y, 0.55, 0.3, 1.5, 2.0, col);          // left column
      box(x + 1.7, y, 0.55, 0.3, 1.5, 2.0, col);    // right column
      box(x, y, 2.55, 2.0, 1.5, 0.45, col);         // crown
      var r = reduce ? 0 : (Math.sin(t / 900) + 1) / 2;
      box(x + 0.45, y + 0.25, 1.15 + r * 0.9, 1.1, 1.0, 0.35, C.accDim); // ram
      return [x + 1.0, y + 0.75, 3.0];
    },
    pump: function (m, col) {
      var x = m.x, y = m.y;
      box(x, y, 0, 2.6, 1.0, 0.18, C.edge);        // skid
      cylX(x + 0.15, x + 1.45, y + 0.5, 0.62, 0.38, col); // motor
      ctx.strokeStyle = col; ln(P(x + 1.45, y + 0.5, 0.62), P(x + 1.75, y + 0.5, 0.62)); // coupling
      pl(ringX(x + 1.95, y + 0.5, 0.66, 0.5)); pl(ringX(x + 2.25, y + 0.5, 0.66, 0.5));
      ln(P(x + 2.1, y + 0.5, 1.16), P(x + 2.1, y + 0.5, 1.55)); // discharge pipe
      ln(P(x + 2.1, y + 0.5, 1.55), P(x + 2.6, y + 0.5, 1.55));
      return [x + 0.8, y + 0.5, 1.0];
    },
    conveyor: function (m, col, t) {
      var x = m.x, y = m.y, L = 4.4;
      box(x, y, 0.55, L, 0.8, 0.15, col);
      ctx.strokeStyle = C.edge;
      for (var i = 0; i <= 4; i++) { ln(P(x + 0.2 + i * 1.0, y + 0.05, 0), P(x + 0.2 + i * 1.0, y + 0.05, 0.55)); ln(P(x + 0.2 + i * 1.0, y + 0.75, 0), P(x + 0.2 + i * 1.0, y + 0.75, 0.55)); }
      var off = reduce ? 0 : ((t / 1400) % 1.1);
      for (var k = 0; k < 4; k++) { var bx = x + 0.15 + ((k * 1.1 + off) % (L - 0.5)); box(bx, y + 0.2, 0.7, 0.4, 0.4, 0.35, C.accDim); }
      return [x + L / 2, y + 0.4, 1.1];
    },
    rack: function (m, col) {
      var x = m.x, y = m.y, w = 1.4, d = 2.8;
      [0, 0.9, 1.8, 2.6].forEach(function (z) { ctx.strokeStyle = col; pl([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)], true); });
      ctx.strokeStyle = col; [[0, 0], [w, 0], [w, d], [0, d]].forEach(function (c) { ln(P(x + c[0], y + c[1], 0), P(x + c[0], y + c[1], 2.6)); });
      [[0.2, 0.2, 0], [0.2, 1.4, 0], [0.25, 0.4, 0.9], [0.2, 1.7, 1.8]].forEach(function (b) { box(x + b[0], y + b[1], b[2] + 0.02, 1.0, 0.9, 0.55, C.accDim); });
      return [x + 0.7, y + 1.4, 2.6];
    }
  };

  var HUBZ = 5.4, HUB = [6.2, 3.6];
  var packets = [];
  function hubPt() { return P(HUB[0], HUB[1], HUBZ); }

  function sysAnchor(i) {
    var el = sysEls[i]; if (!el) return null;
    var fr = fig.getBoundingClientRect(), r = el.getBoundingClientRect();
    return [r.left - fr.left + r.width / 2, r.bottom - fr.top + 2];
  }

  function frame(now) {
    raf = 0;
    var t = now - t0;
    px += (tpx - px) * 0.06; py += (tpy - py) * 0.06;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;

    // floor
    ctx.strokeStyle = C.grid;
    for (var gx = 0; gx <= FW; gx++) ln(P(gx, 0, 0), P(gx, FD, 0));
    for (var gy = 0; gy <= FD; gy++) ln(P(0, gy, 0), P(FW, gy, 0));
    ctx.strokeStyle = C.edge; pl([P(0, 0, 0), P(FW, 0, 0), P(FW, FD, 0), P(0, FD, 0)], true);
    // aisle markings
    ctx.setLineDash([4, 6]); ctx.strokeStyle = "rgba(236,235,230,.08)";
    ln(P(0, 3.6, 0), P(FW, 3.6, 0)); ln(P(0, 4.4, 0), P(FW, 4.4, 0)); ctx.setLineDash([]);

    var hub = hubPt();
    // machines (back to front for overlap)
    var order = M.map(function (m, i) { return i; }).sort(function (a, b) { return (M[a].x + M[a].y) - (M[b].x + M[b].y); });
    var sensors = [];
    order.forEach(function (i) {
      var m = M[i]; var on = i === sel || i === hov;
      var sp = draw[m.id](m, on ? C.hi : C.line, t);
      sensors[i] = P(sp[0], sp[1], sp[2]);
    });

    // machine → hub links
    M.forEach(function (m, i) {
      var a = sensors[i], on = i === sel || i === hov;
      ctx.strokeStyle = on ? "rgba(95,212,224,.75)" : "rgba(95,212,224,.16)";
      ctx.setLineDash(on ? [] : [2, 5]); ln(a, hub); ctx.setLineDash([]);
      ctx.fillStyle = on ? C.acc : "rgba(95,212,224,.7)";
      ctx.beginPath(); ctx.arc(a[0], a[1], on ? 3.5 : 2.5, 0, 7); ctx.fill();
    });

    // hub → systems
    var lit = sel >= 0 ? M[sel].feeds : null;
    sysEls.forEach(function (el, k) {
      var b = sysAnchor(k); if (!b) return;
      var on = lit && lit.indexOf(k) > -1;
      el.classList.toggle("on", !!on);
      ctx.strokeStyle = on ? "rgba(95,212,224,.75)" : "rgba(236,235,230,.14)";
      ctx.beginPath(); ctx.moveTo(hub[0], hub[1]); var my = (hub[1] + b[1]) / 2;
      ctx.lineTo(hub[0], my); ctx.lineTo(b[0], my); ctx.lineTo(b[0], b[1]); ctx.stroke();
    });

    // hub
    ctx.strokeStyle = C.acc; ctx.fillStyle = "#0b0c0d";
    var hs = 9; ctx.beginPath(); ctx.moveTo(hub[0], hub[1] - hs); ctx.lineTo(hub[0] + hs * 1.5, hub[1]); ctx.lineTo(hub[0], hub[1] + hs); ctx.lineTo(hub[0] - hs * 1.5, hub[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.acc; ctx.beginPath(); ctx.arc(hub[0], hub[1], 2.5, 0, 7); ctx.fill();

    // packets
    if (!reduce) {
      if (Math.random() < 0.07) { var mi = Math.floor(Math.random() * M.length); packets.push({ m: mi, p: 0, sys: M[mi].feeds[Math.floor(Math.random() * M[mi].feeds.length)] }); }
      if (sel >= 0 && Math.random() < 0.08) packets.push({ m: sel, p: 0, sys: M[sel].feeds[Math.floor(Math.random() * M[sel].feeds.length)] });
      packets = packets.filter(function (k) { return k.p < 2; });
      packets.forEach(function (k) {
        k.p += 0.012;
        var pos;
        if (k.p < 1) { var a = sensors[k.m]; pos = [a[0] + (hub[0] - a[0]) * k.p, a[1] + (hub[1] - a[1]) * k.p]; }
        else {
          var b = sysAnchor(k.sys); if (!b) return; var q = k.p - 1, my = (hub[1] + b[1]) / 2;
          var seg = [[hub[0], hub[1]], [hub[0], my], [b[0], my], [b[0], b[1]]];
          var lens = [Math.abs(my - hub[1]), Math.abs(b[0] - hub[0]), Math.abs(b[1] - my)], tot = lens[0] + lens[1] + lens[2], d = q * tot;
          for (var j = 0; j < 3; j++) { if (d <= lens[j] || j === 2) { var f = lens[j] ? Math.min(1, d / lens[j]) : 1; pos = [seg[j][0] + (seg[j + 1][0] - seg[j][0]) * f, seg[j][1] + (seg[j + 1][1] - seg[j][1]) * f]; break; } d -= lens[j]; }
        }
        ctx.fillStyle = (k.m === sel) ? C.acc : "rgba(95,212,224,.55)";
        ctx.fillRect(pos[0] - 1.5, pos[1] - 1.5, 3, 3);
      });
    }

    // hotspot positions
    M.forEach(function (m, i) {
      var b = hots[i], a = sensors[i];
      b.style.transform = "translate(" + Math.round(a[0]) + "px," + Math.round(a[1]) + "px)";
    });

    if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  // hotspots
  var hots = M.map(function (m, i) {
    var info = (S.hero || {})[m.id] || { name: m.id };
    var b = document.createElement("button");
    b.type = "button"; b.className = "hot"; b.setAttribute("aria-pressed", "false");
    b.innerHTML = '<span class="hot-dot" aria-hidden="true"></span><span class="hot-lbl"></span>';
    b.lastChild.textContent = info.name;
    b.addEventListener("click", function () { select(sel === i ? -1 : i); });
    b.addEventListener("mouseenter", function () { hov = i; kick(); });
    b.addEventListener("mouseleave", function () { hov = -1; kick(); });
    b.addEventListener("focus", function () { hov = i; kick(); });
    b.addEventListener("blur", function () { hov = -1; kick(); });
    hotWrap.appendChild(b);
    return b;
  });

  function select(i) {
    sel = i;
    hots.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); b.classList.toggle("on", k === i); });
    if (i < 0) { card.classList.remove("show"); card.innerHTML = ""; kick(); return; }
    var info = (S.hero || {})[M[i].id];
    var feeds = M[i].feeds.map(function (k) { return systems[k]; }).join(" · ");
    card.innerHTML = '<p class="mono pk">Machine</p><h3></h3><dl><dt class="mono">Signals</dt><dd class="sig"></dd><dt class="mono">Typical source</dt><dd class="src"></dd><dt class="mono">Feeds</dt><dd class="fd"></dd></dl><a class="mono card-link" href="#machines">Explore in the machine lab →</a>';
    card.querySelector("h3").textContent = info.name;
    card.querySelector(".sig").textContent = info.signals;
    card.querySelector(".src").textContent = info.link;
    card.querySelector(".fd").textContent = feeds;
    card.classList.add("show");
    kick();
  }

  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  function resize() {
    var r = fig.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var band = W < 700 ? 150 : 118; // space for the info card + caption
    s = Math.min(W / ((FW + FD) * 0.866 + 1.2), (H - 60 - band) / ((FW + FD) * 0.5 + HUBZ + 0.6));
    ox = W / 2 - (FW - FD) / 2 * 0.866 * s;
    oy = H - (FW + FD) * 0.5 * s - band;
    kick();
  }

  fig.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || reduce) return;
    var r = fig.getBoundingClientRect();
    tpx = ((e.clientX - r.left) / r.width - 0.5) * -10; tpy = ((e.clientY - r.top) / r.height - 0.5) * -6;
  });
  fig.addEventListener("pointerleave", function () { tpx = 0; tpy = 0; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sel >= 0) select(-1); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }).observe(fig);
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
  window.addEventListener("resize", resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  resize();
})();
