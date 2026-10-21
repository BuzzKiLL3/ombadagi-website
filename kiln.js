/* Hero: wireframe rotary kiln with sensor annotations (canvas 2D, no libraries) */
(function () {
  "use strict";
  var canvas = document.getElementById("kiln");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var fig = canvas.parentElement;
  var labels = Array.prototype.slice.call(document.querySelectorAll("#annotations .ann-l"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, DPR = 1;
  var spin = 0, yaw = -0.62, pitch = 0.32, tYaw = yaw, tPitch = pitch;
  var running = true, visible = true, raf = 0, last = 0;

  // ---- geometry (kiln axis along x) ----
  var L = 6.2, R = 0.62, SEG = 28;
  var tyreX = [-2.1, 0.15, 2.3];
  var gearX = 1.05;
  var incline = 0.07; // kiln slope

  function rotX(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
  function rotY(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
  function rotZ(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }

  function world(p) { return rotZ(p, incline); }
  function project(p) {
    var q = rotX(rotY(world(p), yaw), pitch);
    var d = 9;
    var sc = Math.min(W * 0.112, H * 0.24);
    var f = d / (d + q[2]);
    return [W * 0.52 + q[0] * sc * f, H * 0.5 - q[1] * sc * f, q[2]];
  }
  function ring(x, r, a0) {
    var pts = [];
    for (var i = 0; i <= SEG; i++) {
      var a = (i / SEG) * Math.PI * 2 + (a0 || 0);
      pts.push(project([x, Math.cos(a) * r, Math.sin(a) * r]));
    }
    return pts;
  }
  function poly(pts, close) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (close) ctx.closePath();
    ctx.stroke();
  }
  function line(a, b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }

  var C = {
    line: "rgba(236,235,230,0.22)",
    lineHi: "rgba(236,235,230,0.62)",
    faint: "rgba(236,235,230,0.09)",
    accent: "#5fd4e0",
    warn: "#f0a63a"
  };

  function anchors() {
    var tyreRoller = [tyreX[1], -R * 1.18 - 0.2, 0.42];
    return [
      project([-0.95, R, 0]),                 // shell temp (top of shell)
      project([tyreX[0], R * 1.2, 0]),       // tyre migration
      project(tyreRoller),                    // roller vibration
      project([gearX, -R * 1.42 - 0.22, -0.55]) // drive pinion
    ];
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;

    // floor grid (reference plane)
    ctx.strokeStyle = C.faint;
    for (var gx = -4; gx <= 4; gx += 0.5) line(project([gx, -1.75, -2]), project([gx, -1.75, 2]));
    for (var gz = -2; gz <= 2; gz += 0.5) line(project([-4, -1.75, gz]), project([4, -1.75, gz]));

    // shell rings
    var n = 18;
    for (var i = 0; i <= n; i++) {
      var x = -L / 2 + (i / n) * L;
      ctx.strokeStyle = (i === 0 || i === n) ? C.lineHi : C.line;
      poly(ring(x, R, spin), false);
    }
    // longitudinal shell lines (rotate with spin)
    var lon = 16;
    for (var k = 0; k < lon; k++) {
      var a = (k / lon) * Math.PI * 2 + spin;
      var y = Math.cos(a) * R, z = Math.sin(a) * R;
      ctx.strokeStyle = k % 4 === 0 ? C.lineHi : C.line;
      line(project([-L / 2, y, z]), project([L / 2, y, z]));
    }

    // tyres (exploded slightly outward) + support rollers + piers
    tyreX.forEach(function (tx, idx) {
      ctx.strokeStyle = C.lineHi;
      poly(ring(tx - 0.12, R * 1.2), false);
      poly(ring(tx + 0.12, R * 1.2), false);
      ctx.strokeStyle = C.line;
      for (var s = 0; s < 12; s++) {
        var a = (s / 12) * Math.PI * 2;
        var y = Math.cos(a) * R * 1.2, z = Math.sin(a) * R * 1.2;
        line(project([tx - 0.12, y, z]), project([tx + 0.12, y, z]));
      }
      [-0.42, 0.42].forEach(function (rz) {
        var cy = -R * 1.18 - 0.2, rr = 0.2;
        var a1 = [], a2 = [];
        for (var j = 0; j <= 14; j++) {
          var b = (j / 14) * Math.PI * 2;
          a1.push(project([tx - 0.15, cy + Math.cos(b) * rr, rz + Math.sin(b) * rr]));
          a2.push(project([tx + 0.15, cy + Math.cos(b) * rr, rz + Math.sin(b) * rr]));
        }
        var hot = idx === 1 && rz > 0;
        ctx.strokeStyle = hot ? C.warn : C.line;
        poly(a1); poly(a2);
        line(a1[0], a2[0]); line(a1[7], a2[7]);
      });
      ctx.strokeStyle = C.faint;
      var base = -1.75;
      [[-0.7, -0.7], [0.7, -0.7], [0.7, 0.7], [-0.7, 0.7]].forEach(function (c) {
        line(project([tx + c[0] * 0.4, base, c[1]]), project([tx + c[0] * 0.4, -R * 1.18 - 0.4, c[1] * 0.6]));
      });
    });

    // girth gear + pinion
    ctx.strokeStyle = C.lineHi;
    poly(ring(gearX, R * 1.42, spin), false);
    ctx.strokeStyle = C.line;
    for (var g = 0; g < 40; g++) {
      var ga = (g / 40) * Math.PI * 2 + spin;
      line(project([gearX, Math.cos(ga) * R * 1.42, Math.sin(ga) * R * 1.42]),
           project([gearX, Math.cos(ga) * R * 1.5, Math.sin(ga) * R * 1.5]));
    }
    var pc = [gearX, -R * 1.42 - 0.22, -0.55];
    var pin = [];
    for (var pi = 0; pi <= 12; pi++) {
      var pa = (pi / 12) * Math.PI * 2 - spin * 4;
      pin.push(project([pc[0], pc[1] + Math.cos(pa) * 0.2, pc[2] + Math.sin(pa) * 0.2]));
    }
    poly(pin);

    // end hoods
    ctx.strokeStyle = C.line;
    [-1, 1].forEach(function (sgn) {
      var x0 = sgn * (L / 2 + 0.08), x1 = sgn * (L / 2 + 0.6);
      var r1 = R * 1.35;
      var h0 = ring(x0, R * 1.05), h1 = [];
      for (var hi = 0; hi <= SEG; hi += 4) {
        var ha = (hi / SEG) * Math.PI * 2;
        var p1 = project([x1, Math.cos(ha) * r1, Math.sin(ha) * r1]);
        h1.push(p1);
        line(h0[hi], p1);
      }
      poly(h0); poly(h1);
    });

    // sensors + connectors
    var an = anchors();
    var frect = fig.getBoundingClientRect();
    an.forEach(function (p, i) {
      var warn = i === 2;
      var col = warn ? C.warn : C.accent;
      var pulse = reduce ? 0 : (Math.sin(t / 420 + i) + 1) / 2;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, 7); ctx.fill();
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.6 - pulse * 0.5;
      ctx.beginPath(); ctx.arc(p[0], p[1], 6 + pulse * 7, 0, 7); ctx.stroke();
      ctx.globalAlpha = 1;

      var el = labels[i];
      if (!el || el.offsetParent === null) return;
      var r = el.getBoundingClientRect();
      var lx = (r.left - frect.left), ly = (r.top - frect.top) + r.height / 2;
      var right = lx > p[0];
      var tx = right ? lx - 4 : lx + r.width + 4;
      ctx.strokeStyle = warn ? "rgba(240,166,58,.55)" : "rgba(95,212,224,.45)";
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      var mx = p[0] + (tx - p[0]) * 0.55;
      ctx.lineTo(mx, p[1]); ctx.lineTo(mx, ly); ctx.lineTo(tx, ly);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  function resize() {
    var r = fig.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    draw(performance.now());
  }

  function frame(t) {
    raf = 0;
    if (!running || !visible) return;
    var dt = Math.min(64, t - (last || t)); last = t;
    spin += dt * 0.00018;
    yaw += (tYaw - yaw) * 0.05;
    pitch += (tPitch - pitch) * 0.05;
    draw(t);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(frame); } }

  // simulated readings
  var vals = { temp: 298, mig: 11.6, vib: 3.9, load: 64 };
  function tick() {
    vals.temp = clamp(vals.temp + (Math.random() - 0.5) * 2.4, 286, 312);
    vals.mig = clamp(vals.mig + (Math.random() - 0.5) * 0.3, 10.5, 13);
    vals.vib = clamp(vals.vib + (Math.random() - 0.48) * 0.25, 3.4, 4.6);
    vals.load = clamp(vals.load + (Math.random() - 0.5) * 1.6, 58, 71);
    set("temp", Math.round(vals.temp) + " °C");
    set("mig", vals.mig.toFixed(1) + " mm");
    set("vib", vals.vib.toFixed(1) + " mm/s");
    set("load", Math.round(vals.load) + " %");
  }
  function set(k, v) { var e = document.querySelector('[data-v="' + k + '"]'); if (e) e.textContent = v; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  fig.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var r = fig.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    tYaw = -0.62 + nx * 0.35; tPitch = 0.32 + ny * 0.18;
  });
  fig.addEventListener("pointerleave", function () { tYaw = -0.62; tPitch = 0.32; });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(fig);
  }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) start(); });
  window.addEventListener("resize", resize);

  tick();
  setInterval(function () { if (running && visible) { tick(); if (reduce) draw(0); } }, 1400);
  resize();
  start();
})();
