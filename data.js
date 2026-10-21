/* ============================================================
   SITE CONTENT & CONFIG — edit text here, not in the HTML.
   ============================================================ */
window.SITE = {
  // Change this once you have contact@ombadagi.com
  email: "ombadagi@gmail.com",
  linkedin: "https://www.linkedin.com/in/om-badagi",

  /* ---------- HERO: machines in the ecosystem (illustrative) ---------- */
  hero: {
    cnc:      { name: "CNC machining centre", signals: "Spindle load · vibration · cycle time", link: "Controller data (e.g. OPC UA / MTConnect)" },
    robot:    { name: "Robotic cell", signals: "Cycle time · joint torque · gripper faults", link: "Robot controller / PLC" },
    press:    { name: "Forming / moulding press", signals: "Pressure · temperature · cycle count", link: "Machine PLC" },
    pump:     { name: "Pump & motor", signals: "Vibration · motor current · pressure", link: "Retrofit sensors + gateway" },
    conveyor: { name: "Conveyor line", signals: "Speed · jams · throughput", link: "Line PLC + photo-eyes" },
    rack:     { name: "Warehouse & intralogistics", signals: "Stock levels · picks · moves", link: "WMS / ERP records" }
  },
  systems: ["Production", "Maintenance", "Inventory", "ERP", "Dashboards"],

  /* ---------- 02 CAPABILITIES EXPLORER ---------- */
  pathways: [
    { code: "P1", name: "Machines & equipment", topic: "Equipment & production monitoring", glyph: "machine",
      problem: "Equipment behaviour is invisible until something stops.",
      approach: "Audit what each machine already exposes — controller, PLC or nothing — and add only the sensors that predict real failure modes.",
      solution: "Machine connectivity and condition-monitoring views, chosen per machine type." },
    { code: "P2", name: "Manufacturing & production", topic: "Operational improvement", glyph: "line",
      problem: "Output varies and nobody agrees why.",
      approach: "Capacity and throughput analysis, bottleneck identification, planning and scheduling review.",
      solution: "Production KPIs, loss tracking and a clear improvement plan for the constraint." },
    { code: "P3", name: "Maintenance & visibility", topic: "Equipment & production monitoring", glyph: "maint",
      problem: "Maintenance is reactive; history lives in notebooks.",
      approach: "Downtime and failure analysis, condition indicators, structured maintenance records.",
      solution: "Equipment-health dashboards, alert rules and digital maintenance logs." },
    { code: "P4", name: "Business workflows & automation", topic: "Business automation", glyph: "auto",
      problem: "Skilled people re-type data and build the same reports every week.",
      approach: "Map the repetitive work, then automate data flows, reports and tool integrations — using AI only where it is reliable.",
      solution: "Automated reporting, integrations and AI-assisted information processing." },
    { code: "P5", name: "ERP & enterprise processes", topic: "ERP & workflow optimisation", glyph: "erp",
      problem: "The ERP holds the data, but processes around it are slow or broken.",
      approach: "Business-process mapping, requirements gathering, data-flow and reporting analysis. Vendor-neutral — not a reseller or certified partner.",
      solution: "Clean processes, better reporting and integrations that match how the business works." },
    { code: "P6", name: "Logistics & supply chain", topic: "Supply chain & logistics", glyph: "scm",
      problem: "Material flow, stock and supplier lead times are hard to see and control.",
      approach: "Supply-chain and logistics workflow analysis, inventory visibility, supplier-process review, market and sourcing research incl. India–Europe.",
      solution: "Material-flow visibility, leaner inventory and evidence-based sourcing decisions." },
    { code: "P7", name: "Operational excellence & Lean Six Sigma", topic: "Operational improvement", glyph: "lean",
      problem: "Waste, waiting, rework and inconsistent processes hide inside daily routine.",
      approach: "Process mapping, root-cause analysis and DMAIC-based problem solving, backed by real data.",
      solution: "Standardised, measurable processes and a team that can keep improving them." }
  ],

  /* ---------- 03 MACHINE LAB (all simulated) ---------- */
  machines: [
    { id: "cnc", name: "CNC machining centre", short: "CNC",
      link: "Controller data via OPC UA / MTConnect where available — often no extra sensors needed.",
      sensors: [["Spindle load", "controller"], ["Spindle vibration", "retrofit accelerometer"], ["Cycle time", "controller"], ["Part count", "controller"]],
      signal: { name: "Spindle load", unit: "%", base: 52, noise: 5, limit: 85, fault: 38 },
      kpis: [["Cycle time", "s", 74, 2], ["Parts / h", "", 48, 2]],
      fault: "Simulate tool wear",
      insight: ["Spindle load climbing at constant feed — consistent with tool wear.", "Suggested: tool change at next part; log tool life against part count."] },
    { id: "motor", name: "Electric motor & gearbox", short: "Motor",
      link: "Usually no controller data. Retrofit: vibration + current sensors over a wireless or wired gateway.",
      sensors: [["Vibration (RMS)", "retrofit accelerometer"], ["Motor current", "current clamp"], ["Bearing temperature", "retrofit probe"]],
      signal: { name: "Vibration RMS", unit: "mm/s", base: 2.1, noise: 0.3, limit: 4.5, fault: 3.6 },
      kpis: [["Current", "A", 18.4, 0.6], ["Bearing temp.", "°C", 47, 1]],
      fault: "Simulate bearing wear",
      insight: ["Vibration trend above alert limit for 3 readings — early bearing wear pattern.", "Suggested: schedule inspection in planned stop; order spare bearing."] },
    { id: "pump", name: "Centrifugal pump", short: "Pump",
      link: "Pressure and flow transmitters (often already present) plus motor current from the drive.",
      sensors: [["Discharge pressure", "transmitter"], ["Flow", "flowmeter"], ["Motor current", "VFD"], ["Vibration", "retrofit"]],
      signal: { name: "Discharge pressure", unit: "bar", base: 6.2, noise: 0.15, limit: 5.0, fault: -1.9, low: true },
      kpis: [["Flow", "m³/h", 41, 1], ["Motor current", "A", 22, 0.5]],
      fault: "Simulate suction blockage",
      insight: ["Pressure dropping while current stays flat — possible suction restriction or cavitation.", "Suggested: check suction strainer; alert operator before dry running."] },
    { id: "conveyor", name: "Belt conveyor", short: "Conveyor",
      link: "Line PLC states, an encoder for belt speed and photo-eyes for jams.",
      sensors: [["Belt speed", "encoder"], ["Jam detection", "photo-eye"], ["Drive current", "VFD"]],
      signal: { name: "Belt speed", unit: "m/s", base: 1.2, noise: 0.03, limit: 1.0, fault: -0.35, low: true },
      kpis: [["Throughput", "items/min", 64, 2], ["Micro-stops", "/h", 3, 0.6]],
      fault: "Simulate belt slip",
      insight: ["Belt speed below set-point while drive runs normally — slip likely.", "Suggested: check belt tension; count micro-stops by cause on the shift report."] },
    { id: "robot", name: "Robotic cell", short: "Robot",
      link: "Robot controller and cell PLC: cycle times, faults, joint data where the vendor exposes it.",
      sensors: [["Cycle time", "robot controller"], ["Gripper faults", "cell PLC"], ["Joint torque", "controller (if exposed)"]],
      signal: { name: "Cycle time", unit: "s", base: 11.8, noise: 0.25, limit: 13.5, fault: 2.6 },
      kpis: [["Picks / h", "", 302, 6], ["Gripper faults", "/shift", 1, 0.3]],
      fault: "Simulate gripper misses",
      insight: ["Cycle time rising with retry events — gripper missing picks.", "Suggested: inspect vacuum cups/fingers; correlate with part batch."] },
    { id: "line", name: "Assembly line", short: "Line",
      link: "Station states and counts from each PLC — the line is only as fast as its slowest station.",
      sensors: [["Station states", "PLC"], ["Good / reject counts", "PLC / vision"], ["Buffer levels", "sensors"]],
      signal: { name: "Station 3 wait time", unit: "s/cycle", base: 1.4, noise: 0.3, limit: 4.0, fault: 4.1 },
      kpis: [["OEE", "%", 71, 1], ["Output", "units/h", 186, 4]],
      fault: "Simulate bottleneck",
      insight: ["Station 3 waiting on station 2 — bottleneck has moved upstream.", "Suggested: rebalance tasks between stations 2 and 3; verify with a time study."] }
  ],

  /* ---------- 04 OPERATIONS ↔ BUSINESS ---------- */
  nodes: {
    machine: { label: "Machine & production data", x: 120, y: 130 },
    maint:   { label: "Maintenance records", x: 120, y: 300 },
    ai:      { label: "AI-assisted processing", x: 420, y: 60 },
    report:  { label: "Production reporting", x: 420, y: 210 },
    stock:   { label: "Inventory & logistics", x: 420, y: 370 },
    erp:     { label: "ERP & business apps", x: 720, y: 300 },
    dash:    { label: "Management dashboard", x: 720, y: 130 }
  },
  edges: [["machine","ai"],["machine","report"],["machine","maint"],["ai","report"],["report","dash"],["ai","dash"],["maint","erp"],["maint","report"],["stock","erp"],["erp","dash"],["erp","stock"],["report","erp"]],
  scenarios: [
    { name: "Shift report writes itself", path: ["machine","ai","report","dash"],
      steps: ["Counts, stops and alarms collected at shift end", "Stops grouped by cause; a short summary drafted", "Report assembled in the agreed format", "Published for the morning meeting — no re-typing"] },
    { name: "Alarm → maintenance log", path: ["machine","maint","erp","stock"],
      steps: ["Machine raises a confirmed alarm", "Maintenance entry created with the trend attached", "Spare part requested in the ERP", "Stock reserved; reorder if below minimum"] },
    { name: "Stock → reorder", path: ["stock","erp","dash"],
      steps: ["Stock falls below reorder point", "Purchase proposal prepared in the ERP for approval", "Buyer and planner see it on the dashboard"] },
    { name: "Weekly KPI pack", path: ["machine","report","erp","dash"],
      steps: ["Production data aggregated for the week", "OEE and losses calculated consistently", "Joined with orders and costs from the ERP", "One management view instead of five spreadsheets"] }
  ],

  /* ---------- 05 LEAN SIX SIGMA — DMAIC ---------- */
  dmaic: [
    { k: "D", name: "Define", q: "What problem, for whom, and what does better look like?",
      tools: ["Problem statement", "SIPOC", "Project charter"],
      ex: "Packaging line output varies a lot between shifts. Goal: stable cycle time near target." },
    { k: "M", name: "Measure", q: "How does the process really perform today?",
      tools: ["Data collection plan", "Baseline capability", "Measurement check"],
      ex: "Cycle-time data captured automatically from the line — wide spread, frequent outliers." },
    { k: "A", name: "Analyse", q: "What causes the variation?",
      tools: ["Pareto", "Fishbone / 5 Whys", "Data stratification"],
      ex: "Outliers cluster around changeovers and one material supplier." },
    { k: "I", name: "Improve", q: "Which change removes the root cause?",
      tools: ["Countermeasures", "Pilot run", "SMED for changeovers"],
      ex: "Standard changeover + incoming material check piloted on one shift." },
    { k: "C", name: "Control", q: "How do we keep the gain?",
      tools: ["Control chart", "Standard work", "Automated alerts"],
      ex: "Control limits monitored automatically; drift triggers an alert, not a meeting." }
  ]
};
