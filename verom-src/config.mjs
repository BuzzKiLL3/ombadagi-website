/* =============================================================================
   VEROM SOLUTIONS — SITE CONFIGURATION
   Business facts that must stay verifiable. Leave a field null until you have
   the verified value; the build hides anything that is null.
   ============================================================================= */
export const config = {
  name: "Verom Solutions",
  url: "https://verom.ombadagi.com",          // canonical origin, no trailing slash
  parentUrl: "https://ombadagi.com",
  parentName: "Om Badagi",

  // Public contact address. Shown on the Contact page and used as the
  // fallback when the form delivery service is not configured.
  contactEmail: "contact@ombadagi.com",

  // Offices shown on Contact, About and in the footer (city level only).
  offices: [
    { country: "India", countryCode: "IN", city: "Belgaum", region: "Karnataka", postalCode: "590001", phone: "+919448380069", phoneDisplay: "+91 94483 80069" },
    { country: "France", countryCode: "FR", city: "Lille", region: null, postalCode: "59000", phone: "+33644071981", phoneDisplay: "+33 6 44 07 19 81" }
  ],
  linkedin: "https://www.linkedin.com/in/om-badagi",

  // Legal and registration details. Add verified values only.
  legal: {
    registrationNote: "Registered in India under the Udyam (MSME) registration system.",
    udyamNumber: null,        // e.g. "UDYAM-XX-00-0000000"
    gstin: null,
    registeredAddress: null,
    governingLaw: null        // e.g. "the laws of India" — confirm with an adviser
  },

  // Cloudflare Turnstile public site key (optional). When set, the forms show
  // the Turnstile widget and the server verifies it with TURNSTILE_SECRET_KEY.
  turnstileSiteKey: null,

  // Date the legal pages were last reviewed (shown on Privacy / Terms).
  legalUpdated: "2026-10-23",
  // Date the Quotation ERP feature status was last checked.
  featureStatusDate: "October 2026",

  defaultLocale: "en",
  locales: ["en"]             // add "fr" once a reviewed translation exists
};
