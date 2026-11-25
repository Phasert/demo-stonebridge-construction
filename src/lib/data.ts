// Imagery: the only photograph is /public/construction.webp (see ASSETS.md for source and licence).
// All other visuals are original SVG / WebGL illustrations drawn in code for this demo.
// Every project below is a conceptual case study for a fictional company — not completed work.

export const images = { site: "/construction.webp" };

export type Service = { slug: string; index: string; name: string; summary: string; detail: string; scope: string[] };

export const services: Service[] = [
  {
    slug: "residential",
    index: "01",
    name: "Residential Construction",
    summary: "Bespoke homes built with the patience and precision of fine joinery.",
    detail: "From private residences to boutique multi-unit dwellings, we manage every trade on site so the finished home reads as one considered piece of architecture.",
    scope: ["Custom homes", "Multi-unit dwellings", "Heritage extensions", "Landscape integration"],
  },
  {
    slug: "commercial",
    index: "02",
    name: "Commercial Construction",
    summary: "Workplaces, retail and hospitality spaces delivered on programme.",
    detail: "Structured programmes, transparent cost reporting and site safety practices designed for complex commercial environments.",
    scope: ["Office buildings", "Retail & hospitality", "Light industrial", "Education & civic"],
  },
  {
    slug: "renovations",
    index: "03",
    name: "Renovations",
    summary: "Thoughtful transformations that respect what came before.",
    detail: "Structural upgrades, adaptive reuse and interior refurbishments, sequenced to minimise disruption for the people who live and work there.",
    scope: ["Adaptive reuse", "Structural upgrades", "Interior refurbishment", "Facade restoration"],
  },
  {
    slug: "project-management",
    index: "04",
    name: "Project Management",
    summary: "One accountable lead from feasibility to final handover.",
    detail: "Programme, budget, procurement and stakeholder reporting held together by a single team that answers for the outcome.",
    scope: ["Cost planning", "Programme control", "Procurement", "Stakeholder reporting"],
  },
  {
    slug: "design-build",
    index: "05",
    name: "Design & Build",
    summary: "Architecture and construction under a single, integrated contract.",
    detail: "Designers and builders at the same table from day one, so buildability, cost and craft are resolved before the first excavation.",
    scope: ["Concept design", "Value engineering", "Planning approvals", "Integrated delivery"],
  },
  {
    slug: "property-development",
    index: "06",
    name: "Property Development",
    summary: "Partnering with landowners and investors to unlock considered places.",
    detail: "Site appraisal, feasibility modelling and delivery partnerships for developments that hold their value for decades.",
    scope: ["Site appraisal", "Feasibility studies", "Joint ventures", "Delivery partnerships"],
  },
];

export type Project = {
  slug: string;
  name: string;
  type: string;
  location: string;
  year: string;
  area: string;
  duration: string;
  excerpt: string;
  brief: string;
  approach: string[];
  stats: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "harbour-line-residence",
    name: "Harbour Line Residence",
    type: "Residential",
    location: "Coastal concept",
    year: "Concept",
    area: "640 m²",
    duration: "14 months (est.)",
    excerpt: "A low, horizontal family home stepping down a coastal slope in limestone and timber.",
    brief: "A conceptual private residence that explores how a heavy masonry base and a light timber pavilion can share one slope, framing the horizon from every principal room.",
    approach: ["Cut-and-fill strategy to settle the house into the landscape", "Off-site fabricated timber roof cassettes", "Locally quarried limestone for the plinth walls"],
    stats: [{ label: "Bedrooms", value: "5" }, { label: "Storeys", value: "2" }, { label: "Glazing", value: "42 m" }],
  },
  {
    slug: "meridian-house",
    name: "Meridian House",
    type: "Commercial",
    location: "City centre concept",
    year: "Concept",
    area: "12,400 m²",
    duration: "26 months (est.)",
    excerpt: "A nine-storey workplace with a deep bronze-toned facade and a public ground floor.",
    brief: "A speculative commercial building study for flexible workplace floors above an open, publicly accessible ground plane.",
    approach: ["Post-tensioned slabs for column-free floor plates", "Unitised facade for a faster weathertight programme", "Phased fit-out for incoming tenants"],
    stats: [{ label: "Storeys", value: "9" }, { label: "Floor plates", value: "1,300 m²" }, { label: "Target rating", value: "5-star" }],
  },
  {
    slug: "the-old-mill-renewal",
    name: "The Old Mill Renewal",
    type: "Renovation",
    location: "Riverside concept",
    year: "Concept",
    area: "2,100 m²",
    duration: "18 months (est.)",
    excerpt: "Adaptive reuse of a brick industrial shell into studios and a ground-floor dining hall.",
    brief: "A conceptual renovation retaining an industrial shell while inserting new structure, services and light for a contemporary mixed-use life.",
    approach: ["Retain and repair original masonry", "Independent steel frame for new mezzanines", "Concealed services within new floor zones"],
    stats: [{ label: "Original fabric retained", value: "80%" }, { label: "Studios", value: "24" }, { label: "Levels", value: "3" }],
  },
  {
    slug: "ashgrove-terraces",
    name: "Ashgrove Terraces",
    type: "Development",
    location: "Suburban concept",
    year: "Concept",
    area: "8,900 m²",
    duration: "30 months (est.)",
    excerpt: "Thirty-two terraced homes arranged around shared gardens and a quiet lane.",
    brief: "A development study for medium-density housing that feels generous at street level, with private gardens and shared green space.",
    approach: ["Repeatable structural bays for efficient delivery", "Staged release in three phases", "Shared landscape delivered in phase one"],
    stats: [{ label: "Homes", value: "32" }, { label: "Phases", value: "3" }, { label: "Green space", value: "35%" }],
  },
];

export const process = [
  { step: "01", title: "Consultation", text: "We listen first — understanding the site, ambitions, budget and constraints before anything is drawn.", duration: "Weeks 1–2" },
  { step: "02", title: "Design & Planning", text: "Concept design, engineering coordination and approvals, with cost checked at every stage.", duration: "Months 1–4" },
  { step: "03", title: "Preconstruction", text: "Detailed programme, procurement and site logistics so day one on site is calm and prepared.", duration: "Months 4–5" },
  { step: "04", title: "Construction", text: "A dedicated site team, weekly reporting and quality inspections at every structural milestone.", duration: "Months 5–18" },
  { step: "05", title: "Handover & Aftercare", text: "Commissioning, documentation and a defects period that treats handover as the start of a relationship.", duration: "Ongoing" },
];

export const milestones = [
  { label: "Groundworks", detail: "Excavation, drainage and foundations set the building true to its survey.", pct: 15 },
  { label: "Structure", detail: "Frame, slabs and core rise floor by floor under daily quality checks.", pct: 40 },
  { label: "Envelope", detail: "Roof and facade close the building in, making it weathertight.", pct: 60 },
  { label: "Services", detail: "Mechanical, electrical and plumbing systems installed and tested.", pct: 80 },
  { label: "Finishes", detail: "Joinery, stone and detailing — where craft becomes visible.", pct: 95 },
  { label: "Handover", detail: "Commissioning, documentation and the keys.", pct: 100 },
];
