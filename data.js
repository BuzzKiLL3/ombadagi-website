/* ==========================================================================
   SITE CONTENT, CONTACT CONFIG & MEDIA MANIFEST
   Edit words and media here — no HTML changes needed for most updates.
   ========================================================================== */
window.SITE = {
  email: "ombadagi@gmail.com",
  linkedin: "https://www.linkedin.com/in/om-badagi",

  /* ---------- MEDIA ----------
     All media is used under free licences and loaded from the provider's CDN.
     To self-host: download the file, put it in /assets/media/, and replace the
     URL below with "assets/media/<file>". Credits are listed in README.md.     */
  media: {
    heroVideo: "https://videos.pexels.com/video-files/9033891/9033891-hd_1280_720_24fps.mp4",
    heroPoster: "https://images.pexels.com/videos/9033891/cnc-engineering-machining-manufacturing-9033891.jpeg?auto=compress&cs=tinysrgb&w=1600",
    heroPosterSmall: "https://images.pexels.com/videos/9033891/cnc-engineering-machining-manufacturing-9033891.jpeg?auto=compress&cs=tinysrgb&w=900"
  },

  /* Unsplash photo ids (images.unsplash.com/photo-<id>) — see README for credits */
  photo: function (id, w, h) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&q=72&w=" + w + (h ? "&h=" + h : "");
  },

  /* ---------- 03 MACHINES GALLERY (illustrative application examples) ---------- */
  machines: [
    { key: "machining", name: "Precision machining", img: "1713371398485-7bde1bde9def",
      alt: "CNC milling spindle cutting a metal part",
      kind: "CNC machining centres, turning and milling",
      signals: ["Spindle load", "Vibration", "Cycle time", "Tool life"],
      question: "Is tool wear, not the programme, driving scrap and cycle-time drift?",
      opportunity: "Controller data plus a few retrofit sensors → tool-change timing and part-quality trends." },
    { key: "robotics", name: "Robotics & automation", img: "1647427060118-4911c9821b82",
      alt: "Row of orange industrial robot arms on a production line",
      kind: "Robotic cells, pick-and-place, welding lines",
      signals: ["Cycle time", "Fault codes", "Gripper retries", "Joint torque (if exposed)"],
      question: "Where does the cell actually lose time — the robot, or waiting on its neighbours?",
      opportunity: "Cell-level event logging → micro-stop analysis and balanced line takt." },
    { key: "rotating", name: "Motors & rotating equipment", img: "1567093322102-6bdd32fba67d",
      alt: "Macro photograph of interlocking metal gears",
      kind: "Motors, gearboxes, pumps, compressors, fans",
      signals: ["Vibration RMS", "Motor current", "Bearing temperature", "Pressure / flow"],
      question: "Can we see bearing or alignment problems weeks before they stop the line?",
      opportunity: "Condition indicators and alert rules → planned instead of emergency maintenance." },
    { key: "handling", name: "Material handling", img: "1535923430552-0ce3cd477cc7",
      alt: "Industrial conveyor machine in a manufacturing hall",
      kind: "Conveyors, AGVs, warehouse and intralogistics",
      signals: ["Belt speed", "Jam events", "Throughput", "Buffer levels"],
      question: "Are material-flow stoppages hiding the real bottleneck?",
      opportunity: "Flow and jam data → buffer sizing, routing and staffing decisions." },
    { key: "assembly", name: "Production & assembly lines", img: "1717386255773-1e3037c81788",
      alt: "Automated assembly line inside a large modern factory",
      kind: "Multi-station lines, manual and automated assembly",
      signals: ["Station states", "Good / reject counts", "Takt vs. cycle", "Changeover time"],
      question: "Which station sets the pace today — and does it change by shift?",
      opportunity: "Line-wide OEE and loss tracking → focused Lean improvements." },
    { key: "process", name: "Process & packaging", img: "1764745021344-317b80f09e40",
      alt: "Industrial conveyor and processing machine with metal components",
      kind: "Packaging, filling, forming, thermal processing",
      signals: ["Temperatures", "Pressures", "Speeds", "Reject reasons"],
      question: "Which process parameters actually predict a bad batch?",
      opportunity: "Parameter logging and SPC → fewer rejects, faster root cause." }
  ],

  /* ---------- 04 CAPABILITIES ---------- */
  capabilities: [
    { n: "01", name: "Industry 4.0 & Industrial Intelligence", img: "1757981989497-fa816e1f1634",
      line: "Sensors, data acquisition and dashboards that make machines and lines visible." },
    { n: "02", name: "Equipment Monitoring & Condition Insights", img: "1666634157070-6fd830fb5672",
      line: "Choosing the right signals per machine, then turning trends into maintenance decisions." },
    { n: "03", name: "Operational Excellence & Lean Six Sigma", img: "1701328778019-e95dedbf5346",
      line: "Process mapping, root cause, DMAIC and OEE — fix the flow before digitising it." },
    { n: "04", name: "Automation & Practical AI", img: "1716191299980-a6e8827ba10b",
      line: "Removing repetitive reporting and data handling, with AI only where it is reliable." },
    { n: "05", name: "Production, ERP & Process Integration", img: "1781330173666-11f8818d6eb2",
      line: "Mapping how information really flows, and connecting production with the ERP. Vendor-neutral." },
    { n: "06", name: "Supply Chain, Logistics & Industrial Strategy", img: "1684695747561-9372850cf165",
      line: "Logistics analysis, sourcing and feasibility studies — including India–Europe opportunities." }
  ],

  /* ---------- 06 APPROACH ---------- */
  steps: [
    { name: "Understand", text: "Start from the business or engineering problem — on site, with the people who live with it. Agree what success would look like.", out: "A clear problem statement and success measure" },
    { name: "Measure", text: "Capture how the process or machine really behaves today, using existing data first and adding sensors only where needed.", out: "A trustworthy baseline" },
    { name: "Analyse", text: "Separate symptoms from causes with data, process maps and engineering judgement.", out: "Ranked root causes and options" },
    { name: "Improve", text: "Design the simplest practical change and run it as a small pilot on one machine, line or team.", out: "A working pilot" },
    { name: "Validate", text: "Compare the pilot with the baseline. Keep what proves itself, document it, and decide whether to scale.", out: "Evidence for the next decision" }
  ],

  /* ---------- PHOTO CREDITS (Unsplash License / Pexels License) ---------- */
  credits: [
    ["Hero video", "Daniel Smyth", "Pexels", "https://www.pexels.com/video/a-machine-is-cutting-metal-with-a-metal-cutting-tool-9033891/"],
    ["Drill sparks", "Greg Rosenke", "Unsplash", "https://unsplash.com/photos/drill-bit-cutting-with-sparks-xoxnfVIE7Qw"],
    ["Lathe", "Sven Daniel", "Unsplash", "https://unsplash.com/photos/a-close-up-of-a-machine-DV_rG1mjDxs"],
    ["CNC spindle", "Jelifer Maniago", "Unsplash", "https://unsplash.com/photos/a-machine-that-is-cutting-a-piece-of-metal-8MBTn3Z71zI"],
    ["Robot line", "Simon Kadula", "Unsplash", "https://unsplash.com/photos/a-factory-filled-with-lots-of-orange-machines-8gr6bObQLOI"],
    ["Gears", "Jonathan Borba", "Unsplash", "https://unsplash.com/photos/assorted-gears-macro-photography-5Taa8b9E55k"],
    ["Conveyor", "Markus Winkler", "Unsplash", "https://unsplash.com/photos/black-and-brown-industrial-machine-tkpK5vuBqaY"],
    ["Assembly line", "Homa Appliances", "Unsplash", "https://unsplash.com/photos/a-large-machine-in-a-large-building-pWUyHVJgLhg"],
    ["Process machine", "Zero Vo", "Unsplash", "https://unsplash.com/photos/industrial-conveyor-belt-machine-with-metal-parts-E_B09LIHS9Q"],
    ["Robotic cell", "Anonymous Fox", "Unsplash", "https://unsplash.com/photos/complex-industrial-machinery-with-robotic-arms-W0wonxdZsbI"],
    ["Metal turning", "Sven Daniel", "Unsplash", "https://unsplash.com/photos/metal-rod-machining-on-lathe-eaanLTG7TCU"],
    ["Factory floor", "Hyundai Motor Group", "Unsplash", "https://unsplash.com/photos/a-factory-filled-with-lots-of-machines-and-boxes-h2rWePLKxvs"],
    ["Robot arm", "Homa Appliances", "Unsplash", "https://unsplash.com/photos/blue-industrial-robot-arm-in-factory-sz1CHL7Pky0"],
    ["Machinery row", "Daniel Miksha", "Unsplash", "https://unsplash.com/photos/a-row-of-complex-industrial-machinery-in-a-modern-facility-K-AGcjpmU-c"],
    ["Warehouse conveyor", "Alberto Rodríguez", "Unsplash", "https://unsplash.com/photos/a-conveyor-belt-in-a-large-warehouse-qVpGF1mlaM8"],
    ["Laser sparks", "Le Trung", "Unsplash", "https://unsplash.com/photos/a-piece-of-metal-being-cut-with-a-machine-fBCQz7OUUww"],
    ["Black gears", "Isis França", "Unsplash", "https://unsplash.com/photos/close-up-photography-of-black-metal-gears-hsPFuudRg5I"]
  ]
};
