/* ============================================================
   SITE CONTENT & CONFIG — edit text here, not in the HTML.
   ============================================================ */
window.SITE = {
  // Change this once you have contact@ombadagi.com
  email: "ombadagi@gmail.com",
  linkedin: "https://www.linkedin.com/in/om-badagi",

  // Section 02 — connected system layers
  layers: [
    { id: "machine", code: "L0", name: "Machine",
      title: "The asset",
      text: "Kilns, presses, conveyors, pumps. Each one already tells you how it is doing — through heat, vibration, current and cycle time.",
      io: ["Physical behaviour", "Wear & failure modes"] },
    { id: "sensor", code: "L1", name: "Sensors",
      title: "Measure what matters",
      text: "Pick the few signals that actually predict trouble, and place the right sensor where it survives the environment.",
      io: ["Temperature", "Vibration", "Current", "Position"] },
    { id: "edge", code: "L2", name: "Acquisition",
      title: "Collect reliably",
      text: "PLC and OPC UA connections, edge gateways and Node-RED flows that read data on time, buffer it and pass it on cleanly.",
      io: ["OPC UA", "PLC tags", "Edge buffering"] },
    { id: "monitor", code: "L3", name: "Monitoring",
      title: "Make it visible",
      text: "Live views for operators, maintenance and managers — each showing only what that person needs to act on.",
      io: ["Live status", "Alerts", "Shift views"] },
    { id: "analytics", code: "L4", name: "Analytics",
      title: "Find the pattern",
      text: "Trend analysis, loss breakdowns and condition indicators that turn readings into early warnings and root causes.",
      io: ["OEE", "Pareto of losses", "Condition trends"] },
    { id: "erp", code: "L5", name: "ERP & workflow",
      title: "Close the loop",
      text: "Push events into the systems people already use: a work order, a report, an email, a planning update — without retyping.",
      io: ["Work orders", "Automated reports", "Planning data"] },
    { id: "decision", code: "L6", name: "Decision",
      title: "Act earlier",
      text: "Planned maintenance instead of breakdowns, fewer surprises in planning, and meetings that start from facts.",
      io: ["Fewer surprises", "Faster response", "Shared facts"] }
  ],

  // Section 03 — capabilities
  capabilities: [
    { code: "C1", name: "Industry 4.0 & Industrial IoT",
      problem: "Machines run blind. Problems surface only when production stops.",
      action: "Sensor selection, data acquisition (PLC / OPC UA / edge), monitoring dashboards and a phased digitalisation roadmap.",
      outcome: "Equipment status and condition visible in real time, with early warnings instead of surprises.",
      glyph: "iot" },
    { code: "C2", name: "Lean & operational excellence",
      problem: "Waste, waiting and rework hide inside daily routine.",
      action: "Process mapping, bottleneck and root-cause analysis, standard work, and DMAIC-style improvement projects where they fit.",
      outcome: "A leaner flow, clearer standards and a team that can keep improving it.",
      glyph: "lean" },
    { code: "C3", name: "Business automation & practical AI",
      problem: "Skilled people spend hours copying data between spreadsheets and systems.",
      action: "Identify repetitive tasks, automate reporting and data flows, integrate tools, and use AI only where it reliably saves time.",
      outcome: "Less manual handling, fewer errors, more time for real work.",
      glyph: "auto" },
    { code: "C4", name: "Production & KPI visibility",
      problem: "Nobody agrees on why output was low yesterday.",
      action: "KPI design, OEE and downtime/loss tracking, capacity and throughput analysis, planning and scheduling review.",
      outcome: "One shared version of performance, and losses ranked by real impact.",
      glyph: "kpi" },
    { code: "C5", name: "ERP & process optimisation",
      problem: "The ERP holds data, but the processes around it are slow or broken.",
      action: "Process mapping before implementation, requirements gathering, data-flow and integration analysis, reporting improvements. Vendor-neutral — not a reseller or certified partner.",
      outcome: "Systems that match how the business actually works.",
      glyph: "erp" },
    { code: "C6", name: "Supply chain & logistics",
      problem: "Material flow, stock and supplier lead times are hard to see and control.",
      action: "Supply-chain process analysis, logistics workflow improvement, inventory visibility, procurement and supplier-process review.",
      outcome: "Materials where they are needed, with less stock tied up.",
      glyph: "scm" },
    { code: "C7", name: "Market research & industrial strategy",
      problem: "Entering a market or choosing a supplier without solid facts.",
      action: "Market and competitor research, benchmarking, opportunity analysis, and India–Europe industrial sourcing questions.",
      outcome: "Decisions based on structured evidence, not guesswork.",
      glyph: "mkt" }
  ],

  // Section 04 — engagement steps
  steps: [
    { n: "01", name: "Discover", text: "Site visit and conversations with the people involved. Define the real problem and how success will be measured." },
    { n: "02", name: "Map", text: "Map the process and the information flow as it really runs today — not as the procedure says." },
    { n: "03", name: "Analyse", text: "Collect and study the data. Separate symptoms from root causes." },
    { n: "04", name: "Design", text: "Choose the simplest solution that solves the root cause, using existing equipment and systems where possible." },
    { n: "05", name: "Pilot", text: "Run it on one line, machine or team. Check the results against the goal set in step 01." },
    { n: "06", name: "Measure", text: "Track the agreed indicators, adjust, and document so your team can own it." },
    { n: "07", name: "Scale", text: "Extend what proved itself to more lines, sites or teams — only where it pays back." }
  ]
};
