/* =============================================================================
   VEROM SOLUTIONS — ENGLISH CONTENT
   Every word on the site lives here. To add French later, copy this file to
   fr.mjs, translate it properly, and add "fr" to config.locales.

   PRODUCT TRUTHFULNESS: feature status values must match the real product.
     "available"  = implemented and tested
     "validation" = implemented, not yet fully verified
     "planned"    = not built yet
   ============================================================================= */

export const en = {
  lang: "en",

  ui: {
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    products: "Products",
    allProducts: "All products",
    solutions: "Solutions",
    about: "About",
    contact: "Contact",
    exploreProducts: "Explore products",
    getInTouch: "Get in touch",
    learnMore: "Learn more",
    illustrative: "Illustrative interface · sample data",
    demoData: "Demo visualization · illustrative data, not real measurements",
    status: {
      trial: "Trial on request",
      soon: "Coming soon",
      available: "In current build",
      validation: "In validation",
      planned: "Planned"
    }
  },

  /* ---------------------------------------------------------------- products */
  products: {
    "quotation-erp": {
      name: "Quotation ERP V1.1",
      short: "Quotation ERP",
      status: "trial",
      hue: "erp",
      tagline: "Structured quotations for engineering and manufacturing businesses.",
      card: "Create professional quotations, organize the rules and costs behind them, and bring your quotation workflow into one structured workspace.",
      highlights: [
        "Configurable quotation calculations",
        "Costing and pricing rules",
        "Quotation status workflow",
        "PDF quotation output"
      ],
      cta: "Explore Quotation ERP",
      cta2: "Request a trial"
    },
    "whatsapp-automation": {
      name: "WhatsApp Automation",
      short: "WhatsApp Automation",
      status: "soon",
      hue: "wa",
      tagline: "Messaging workflows for customer enquiries and follow-ups.",
      card: "Build more responsive customer workflows with messaging automation, business notifications and structured communication.",
      highlights: [
        "Customer notifications",
        "Lead qualification workflows",
        "Follow-up reminders",
        "Enquiry handling"
      ],
      planNote: "In development. Not yet available.",
      cta: "Register your interest"
    },
    "digital-twins": {
      name: "Digital Twins",
      short: "Digital Twins",
      status: "soon",
      hue: "dt",
      tagline: "Industrial data turned into visibility you can act on.",
      card: "Connected industrial systems that turn operational data into useful visibility for monitoring, analysis and decision support.",
      highlights: [
        "Industrial data visualization",
        "Equipment monitoring",
        "Operational dashboards",
        "Historical trend analysis"
      ],
      planNote: "General product in development. Custom industrial projects can be discussed now.",
      cta: "Discuss an industrial project"
    }
  },

  /* -------------------------------------------------------------------- home */
  home: {
    title: "Verom Solutions — Quotation, automation and industrial software",
    description: "Verom Solutions builds practical software for growing businesses: Quotation ERP for structured quotations, WhatsApp Automation for customer workflows, and Digital Twins for industrial data.",
    hero: {
      eyebrow: "Business software · Automation · Industrial data",
      title: "Software that simplifies business. Automation that moves it forward.",
      text: "Verom Solutions builds practical software for quotations, business workflows, WhatsApp automation and industrial intelligence, helping growing businesses work smarter and operate with greater clarity.",
      cta: "Explore our products",
      cta2: "Discuss your requirements"
    },
    portfolio: {
      eyebrow: "Products",
      title: "Three products. One mission: better business operations.",
      text: "One product you can trial today, two in active development. Each status below is stated as it is."
    },
    problems: {
      eyebrow: "Solutions",
      title: "The everyday problems we build for.",
      text: "Most operational friction is not exotic. It is scattered information, repeated messages and data nobody can read. That is where we start.",
      items: [
        { icon: "doc", problem: "Quotations are scattered across spreadsheets, emails and documents.", answer: "Bring rules, costs and quotation documents into one structured workflow.", product: "quotation-erp" },
        { icon: "chat", problem: "Customer follow-ups are repetitive and hard to track.", answer: "Automate supported, consent-based notifications and follow-up workflows.", product: "whatsapp-automation" },
        { icon: "pulse", problem: "Industrial data exists, but it is difficult to interpret.", answer: "Turn operational signals into clear dashboards and monitoring views.", product: "digital-twins" }
      ],
      problemLabel: "Problem",
      answerLabel: "What we build"
    },
    how: {
      eyebrow: "How we work",
      title: "Practical technology. Clear execution.",
      text: "We focus on useful software, transparent communication and practical implementation. No large transformation programme is needed to start.",
      steps: [
        { title: "Understand the problem", text: "Start from how the work is done today, and where time or accuracy is actually lost." },
        { title: "Find the simplest useful solution", text: "Choose the smallest piece of software that removes the friction. Not the biggest system possible." },
        { title: "Build and validate", text: "Deliver a working workflow and check it against real cases before it is relied on." },
        { title: "Improve with feedback", text: "Refine based on how people use it, one release at a time." }
      ]
    },
    why: {
      eyebrow: "Why Verom Solutions",
      title: "Built by an engineer, around how operations really run.",
      items: [
        { title: "Engineering-informed", text: "Problems are approached from the process and the physics first, then the software." },
        { title: "Workflow first", text: "We design around the quotation, the message or the machine, not around a feature list." },
        { title: "Real operational needs", text: "Software is shaped by actual enquiries, offers and shop-floor questions." },
        { title: "Business and industrial", text: "One portfolio spanning business software and industrial technology." },
        { title: "Iterative", text: "Small releases, validated with users, improved with their feedback." }
      ]
    },
    final: {
      title: "Let’s simplify your next business workflow.",
      text: "Whether you need a better quotation process, customer communication automation or industrial data visibility, let’s explore a practical solution.",
      cta: "Try Quotation ERP",
      cta2: "Contact Verom Solutions"
    }
  },

  /* ---------------------------------------------------------------- products */
  productsPage: {
    title: "Products — Verom Solutions",
    description: "The Verom Solutions product portfolio: Quotation ERP V1.1 (trial on request), WhatsApp Automation and Digital Twins (coming soon).",
    eyebrow: "Product portfolio",
    heading: "Software for quotations, conversations and machines.",
    text: "Each product solves one operational problem well. Availability is shown exactly as it stands today.",
    roadmapTitle: "Where each product stands",
    roadmap: [
      { product: "quotation-erp", state: "Core engine built and tested. Windows desktop application in validation. Trials arranged individually." },
      { product: "whatsapp-automation", state: "In development. Register interest to help shape the first release." },
      { product: "digital-twins", state: "General product in development. Custom industrial projects can be discussed now." }
    ],
    customTitle: "Need something that is not listed?",
    customText: "We also build focused custom software when a workflow does not fit an off-the-shelf tool.",
    customCta: "Describe your project"
  },

  /* ----------------------------------------------------------- quotation erp */
  erp: {
    title: "Quotation ERP V1.1 — Quotation software for manufacturing and engineering",
    description: "Quotation ERP is quotation management software for manufacturers, job shops and engineering suppliers: configurable calculations, costing, pricing, quotation workflow and PDF quotations. Request a trial.",
    eyebrow: "Quotation ERP V1.1",
    heading: "Create professional quotations. Keep your sales workflow organized.",
    text: "A practical quotation tool designed to help businesses prepare, calculate, organize and manage customer quotations more consistently.",
    cta: "Request your trial",
    cta2: "See how it works",
    mock: {
      app: "Quotation ERP",
      nav: ["Projects", "Intake", "Calculation", "Costing", "Quotations", "Licence"],
      active: 4,
      heading: "Quotations",
      create: "Create quotation",
      search: "Search quotations",
      kpis: [
        { label: "Drafts", value: "7" },
        { label: "In review", value: "3" },
        { label: "Issued", value: "12" }
      ],
      cols: ["No.", "Customer", "Subject", "Total", "Status"],
      rows: [
        ["Q-0142", "Example Fabrication Pvt Ltd", "Sheet-metal enclosures", "12,480.00", "Issued"],
        ["Q-0141", "Sample Pumps SARL", "Pump skid frame", "8,915.50", "In review"],
        ["Q-0140", "Demo Engineering GmbH", "Conveyor guarding", "4,260.00", "Draft"],
        ["Q-0139", "Placeholder Tools Ltd", "Machined brackets", "2,140.75", "Accepted"],
        ["Q-0138", "Example Fabrication Pvt Ltd", "Laser-cut panels", "3,602.00", "Issued"]
      ],
      detail: {
        title: "Q-0141 · Sample Pumps SARL",
        lines: [["Frame fabrication", "5,430.00"], ["Surface treatment", "1,215.50"], ["Assembly & testing", "2,270.00"]],
        subtotal: "8,915.50",
        subtotalLabel: "Subtotal",
        totalLabel: "Quotation total"
      },
      activityTitle: "Recent activity",
      activity: ["Calculation run · fabrication pack", "Q-0142 issued as PDF", "Costing rates updated", "Q-0141 sent for review"]
    },
    howTitle: "How it works",
    howText: "From the customer’s enquiry to an issued quotation, in four structured steps.",
    how: [
      { title: "Capture the enquiry", text: "Record the customer’s requirements in a structured intake instead of free-form notes." },
      { title: "Calculate with your rules", text: "Your sizing and estimating rules run as configured formulas, with a trace of every result." },
      { title: "Cost and price", text: "Quantities roll into material, labour and process costs, then your pricing rules apply." },
      { title: "Issue the quotation", text: "Move the quotation through its statuses and produce a PDF document for the customer." }
    ],
    featuresTitle: "What the software does",
    featuresText: "Feature status is published openly. Only items marked “In current build” are part of the product today.",
    featuresAsOf: "Status as of",
    features: [
      { status: "available", title: "Configurable calculation engine", text: "Encode your own estimating and sizing rules in a closed formula language. Each result keeps a trace of the inputs and formulas behind it." },
      { status: "available", title: "Costing and pricing", text: "Calculated quantities roll into material, labour and process-rate costs, then your pricing rules are applied." },
      { status: "available", title: "Quotation workflow", text: "Each quotation moves through defined statuses, from draft through review to issued." },
      { status: "available", title: "PDF quotations", text: "Generate a PDF quotation document from the finished quotation." },
      { status: "available", title: "Industry configuration packs", text: "Business behaviour is stored as configuration, so the same software can be set up for different industries. Two reference packs exist today." },
      { status: "available", title: "Structured enquiry intake", text: "Capture the enquiry data a quotation depends on before any calculation runs." },
      { status: "validation", title: "Windows desktop application", text: "A desktop application with a local database, so quotation data stays on your machine." },
      { status: "validation", title: "Device licensing and audit log", text: "Licences bound to the device, and a log of the actions taken in the software." },
      { status: "planned", title: "Product and supplier catalogue", text: "An interface to maintain catalogue items and supplier prices." },
      { status: "planned", title: "Document extraction", text: "Reading data from incoming enquiry documents automatically." }
    ],
    forTitle: "Who it is for",
    forItems: [
      { title: "Manufacturers", text: "Repeatable products with configurable options and calculated costs." },
      { title: "Job shops and fabricators", text: "One-off parts where every quotation starts from a calculation." },
      { title: "Engineering suppliers", text: "Equipment quotations driven by sizing rules and technical inputs." }
    ],
    trialTitle: "Request your trial",
    trialText: "Trials are arranged individually, so the software can be set up for the way your business quotes. Tell us a little about your quotations and we will reply by email.",
    trialPoints: [
      "No payment details requested",
      "Set up around one of your real quotation types",
      "Reply from a person, not an automated sequence"
    ],
    faqTitle: "Questions",
    faq: [
      { q: "Is there an instant free trial?", a: "Not yet. Trials are set up individually after you request one, so that the software is configured for a real quotation from your business." },
      { q: "What does it cost?", a: "Pricing has not been published yet. It will be discussed openly during the trial." },
      { q: "Will it fit my industry?", a: "The software is built to be configured through industry packs. During the trial request, describe what you quote and we will tell you honestly whether it fits." },
      { q: "Where is my data stored?", a: "The application is designed as a Windows desktop application with a local database. The desktop build is currently in validation." }
    ]
  },

  /* ------------------------------------------------------------ whatsapp */
  wa: {
    title: "WhatsApp Automation — Business messaging workflows (coming soon)",
    description: "WhatsApp Automation by Verom Solutions: consent-based messaging workflows for enquiries, follow-ups and business notifications. In development — register your interest.",
    eyebrow: "WhatsApp Automation · Coming soon",
    heading: "Turn repetitive conversations into structured workflows.",
    text: "Practical automation for customer enquiries, follow-ups, business notifications and operational information capture.",
    cta: "Register your interest",
    devNote: "This product is in development and not yet available. No WhatsApp integration is live today.",
    flowTitle: "How a workflow is meant to run",
    flow: [
      { title: "Customer message", text: "A customer who has opted in sends an enquiry or replies." },
      { title: "Automation workflow", text: "Rules read the message and decide what should happen next." },
      { title: "Business system", text: "The relevant record is created or updated where your team works." },
      { title: "Action or notification", text: "The right person, or the customer, is informed." }
    ],
    flowCaption: "Concept illustration of the planned workflow.",
    casesTitle: "Use cases we are designing for",
    cases: [
      { title: "Lead capture", text: "Turn inbound enquiries into structured lead records." },
      { title: "Enquiry routing", text: "Send each enquiry to the right person or team." },
      { title: "Follow-up reminders", text: "Remind your team, and opted-in customers, when a follow-up is due." },
      { title: "Order and quotation notifications", text: "Notify customers when an order or quotation changes status." },
      { title: "Maintenance reporting", text: "Let field or shop-floor staff report issues in a structured way." },
      { title: "Voice notes to records", text: "A possible future workflow: turning voice notes into structured data." }
    ],
    dependsTitle: "What every workflow depends on",
    depends: [
      "Access to an official business messaging platform and its approved APIs.",
      "Customer opt-in and consent, following the platform’s rules and applicable law.",
      "Approved message templates where the platform requires them.",
      "Integration access to the business systems involved."
    ],
    dependsNote: "Automation never replaces consent requirements or platform policies. Capabilities will be confirmed per project.",
    formTitle: "Register your interest",
    formText: "Tell us what you want to automate. Early input shapes the first release, and we will contact you when it is ready.",
    trademark: "WhatsApp is a trademark of its respective owner. Verom Solutions is not affiliated with or endorsed by it."
  },

  /* ------------------------------------------------------------ digital twins */
  dt: {
    title: "Digital Twins — Industrial monitoring and data visualization",
    description: "Digital Twins by Verom Solutions: equipment monitoring, sensor data visualization and operational dashboards for industrial sites. Coming soon — custom industrial projects can be discussed now.",
    eyebrow: "Digital Twins · Coming soon",
    heading: "Make industrial data easier to understand.",
    text: "Connected industrial systems for equipment monitoring, operational visualization and data-driven insight.",
    cta: "Discuss an industrial project",
    devNote: "The general Digital Twins product is in development. Custom industrial projects can be discussed now.",
    dash: {
      asset: "Asset · Line 2",
      state: "Running",
      sensors: [
        { id: "vib", label: "Vibration", unit: "mm/s" },
        { id: "temp", label: "Bearing temp.", unit: "°C" },
        { id: "speed", label: "Speed", unit: "rpm" }
      ],
      trend: "Vibration · last 60 s",
      events: "Events",
      eventItems: ["Speed setpoint changed", "Bearing temperature within range", "Vibration below alert level"]
    },
    casesTitle: "What it is for",
    cases: [
      { title: "Equipment monitoring", text: "See the state of each machine without walking the line." },
      { title: "Sensor data visualization", text: "Present vibration, temperature, speed and other signals in one readable view." },
      { title: "Historical analysis", text: "Compare today’s behaviour against past runs to spot drift." },
      { title: "Operational dashboards", text: "Give each level, from operator to manager, the view it needs." },
      { title: "Process visibility", text: "Follow a process end to end, not one machine at a time." },
      { title: "Predictive maintenance (future)", text: "A possible later step, only where suitable data and models exist." }
    ],
    approachTitle: "How an industrial project starts",
    approach: [
      { title: "Pick one asset and one question", text: "For example: why does this machine stop, or when does this bearing need attention?" },
      { title: "Find the signals that answer it", text: "Use existing controller data first, and add sensors only where needed." },
      { title: "Build the view", text: "A monitoring interface that answers the question clearly." },
      { title: "Extend from there", text: "More assets, history, and analytics once the first view proves useful." }
    ]
  },

  /* ------------------------------------------------------------------ about */
  about: {
    title: "About Verom Solutions",
    description: "Verom Solutions builds practical business software and industrial digitalization tools for small and medium-sized businesses in India, France and beyond.",
    eyebrow: "About",
    heading: "Practical software, built with an engineer’s discipline.",
    text: "Verom Solutions builds business software for quotation and operational workflows, and explores industrial digitalization for companies that want clearer visibility of their processes.",
    focusTitle: "What we work on",
    focus: [
      "Business process automation",
      "Quotation workflows",
      "ERP-related tools",
      "Messaging automation",
      "Industrial software",
      "Digital twins",
      "Connected operational data"
    ],
    stanceTitle: "Ambitious, and honest about where we are",
    stance: [
      "Verom Solutions is a young company building a focused product portfolio.",
      "Our first product, Quotation ERP, is ready for individual trials. The other two are in development.",
      "Every product is validated with real business cases and improved through customer feedback before it is promoted further."
    ],
    principlesTitle: "Principles",
    principles: [
      { title: "Practical first", text: "Software has to solve a real business problem." },
      { title: "Automate the repetitive", text: "People should spend their time on judgement, not on retyping." },
      { title: "Data that leads to decisions", text: "Industrial data matters when it changes what someone does next." }
    ],
    founderTitle: "Founder",
    founderText: "Verom Solutions was founded by Om Badagi, a mechanical engineer working in industrial digitalization, automation and operations.",
    founderLink: "Professional profile",
    legalTitle: "Company"
  },

  /* ---------------------------------------------------------------- contact */
  contact: {
    title: "Contact Verom Solutions",
    description: "Contact Verom Solutions about Quotation ERP, WhatsApp Automation, Digital Twins or custom software. Tell us what you want to improve.",
    eyebrow: "Contact",
    heading: "Tell us what you want to improve.",
    text: "Describe the workflow, the product you are interested in, or the problem you want to solve. We reply by email.",
    directTitle: "Prefer email?",
    directText: "Write to us directly at",
    expectTitle: "What happens next",
    expect: [
      "We read your message and reply by email.",
      "If useful, we suggest a short call to understand the workflow.",
      "You get an honest answer on whether we can help."
    ]
  },

  /* ------------------------------------------------------------------ forms */
  forms: {
    fields: {
      name: "Full name",
      email: "Business email",
      company: "Company",
      country: "Country",
      product: "Product of interest",
      message: "Project description",
      volume: "Approximate quotations per month",
      intended: "Intended use",
      useCase: "What would you like to automate?",
      optional: "optional",
      consent: "I agree that Verom Solutions may use these details to respond to my request, as described in the Privacy Policy."
    },
    placeholders: {
      message: "What do you want to improve, and how is it done today?",
      intended: "What do you quote, and how do you prepare quotations today?",
      useCase: "For example: notify customers when a quotation is sent"
    },
    productOptions: [
      { value: "quotation-erp", label: "Quotation ERP V1.1" },
      { value: "whatsapp-automation", label: "WhatsApp Automation" },
      { value: "digital-twins", label: "Digital Twins" },
      { value: "custom-software", label: "Custom software" },
      { value: "other", label: "Other" }
    ],
    volumeOptions: [
      { value: "", label: "Select (optional)" },
      { value: "1-10", label: "1–10" },
      { value: "11-50", label: "11–50" },
      { value: "51-200", label: "51–200" },
      { value: "200+", label: "More than 200" }
    ],
    submit: { contact: "Send message", trial: "Request trial", interest: "Register interest" },
    sending: "Sending…",
    privacy: "We use these details only to reply to you. No newsletters, no sharing for marketing.",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address, like name@company.com.",
      tooLong: "This is too long.",
      consent: "Please confirm so we can reply to you.",
      summary: "Please correct the highlighted fields."
    },
    success: {
      title: "Thank you. Your request has been received.",
      text: "We will reply by email to the address you provided."
    },
    failure: {
      generic: "Your message could not be sent. Please try again in a moment, or email us directly.",
      notConfigured: "Online form delivery is not active yet, so your message has not been sent. Please email us instead; your details are pre-filled.",
      rate: "Too many attempts from your connection. Please wait a few minutes, or email us directly.",
      emailLink: "Email us instead"
    }
  },

  /* ------------------------------------------------------------------ legal */
  privacy: {
    title: "Privacy Policy — Verom Solutions",
    description: "How Verom Solutions collects, uses and protects the personal information you submit through this website, and the rights you have.",
    heading: "Privacy Policy",
    review: "Starter text. It reflects how this website works today and must be reviewed by a qualified adviser before you rely on it.",
    sections: [
      { h: "Who we are", p: ["This website is operated by Verom Solutions, a business registered in India under the Udyam (MSME) registration system. Registered details are listed on the About page once verified.", "Contact for privacy questions: {email}."] },
      { h: "What we collect", p: ["Only what you type into our forms: your name, business email, company, country, the product you are interested in and your message. Trial and interest forms may also ask for an approximate quotation volume and intended use, both optional.", "Our hosting provider processes technical data such as your IP address to deliver the site and protect it from abuse. We do not use cookies, analytics or advertising trackers on this website."] },
      { h: "Why we use it", p: ["To reply to your enquiry, arrange a trial you requested, or contact you about a product you registered interest in. The basis is your request and your consent given on the form.", "We do not sell your information and do not use it for unrelated marketing."] },
      { h: "Who processes it", p: ["The website and its form endpoint run on Cloudflare. When form delivery is configured, your submission is passed to an email delivery or storage service so it reaches us. These providers act on our behalf.", "Information may be processed outside your country, including in India, the European Union and the United States, depending on the provider."] },
      { h: "How long we keep it", p: ["Enquiries are kept as long as needed to respond and follow up, and then deleted. A defined retention period will be stated here after review."] },
      { h: "Your rights", p: ["You can ask to access, correct or delete your information, or withdraw consent, by writing to {email}. Depending on where you live, laws such as the EU General Data Protection Regulation or India’s Digital Personal Data Protection Act may give you further rights, including complaining to a supervisory authority."] },
      { h: "Changes", p: ["We will update this page when our practices change. The date below shows the latest version."] }
    ]
  },

  terms: {
    title: "Terms of Service — Verom Solutions",
    description: "Terms for using the Verom Solutions website, including how product information, illustrations and trial requests should be understood.",
    heading: "Terms of Service",
    review: "Starter text for website use only. It must be reviewed by a qualified adviser. Product trials and licences will be covered by separate agreements.",
    sections: [
      { h: "About these terms", p: ["These terms apply to your use of verom.ombadagi.com, operated by Verom Solutions. By using the site you accept them."] },
      { h: "Information on this site", p: ["We describe our products and their status as accurately as we can. Products marked “Coming soon” or features marked “Planned” or “In validation” are not available or not yet fully verified, and may change.", "Product interfaces and dashboards shown on this site are illustrations with sample data unless stated otherwise."] },
      { h: "Trials and products", p: ["Submitting a trial request does not create a contract. Any trial, licence or service will be governed by a separate written agreement."] },
      { h: "Intellectual property", p: ["The content, design, logo and software described on this site belong to Verom Solutions or its licensors. You may not copy them for commercial use without permission.", "Third-party names mentioned on this site belong to their owners and are used only to describe compatibility or intended use."] },
      { h: "Acceptable use", p: ["Do not misuse the forms, attempt to disrupt the site, or submit information about other people without their permission."] },
      { h: "Liability", p: ["The site is provided as it is. To the extent the law allows, we are not liable for losses arising from its use. Nothing in these terms limits liability that cannot be limited by law."] },
      { h: "Governing law", p: ["{law}"] }
    ],
    lawPending: "The governing law and jurisdiction will be stated here after review."
  },

  notFound: {
    title: "Page not found — Verom Solutions",
    description: "The page you were looking for does not exist on the Verom Solutions website. Browse our products or return to the home page.",
    heading: "This page does not exist.",
    text: "The link may be old, or the address may contain a typo.",
    cta: "Back to home",
    cta2: "View products"
  },

  footer: {
    about: "Practical software for quotations, business automation and industrial data.",
    productsTitle: "Products",
    companyTitle: "Company",
    legalTitle: "Legal",
    parent: "A venture of",
    rights: "All rights reserved."
  }
};
