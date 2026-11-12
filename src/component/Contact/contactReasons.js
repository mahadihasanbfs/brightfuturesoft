// Why someone is contacting us (ids match portfolio-server/Modules/contact_reasons.js).
export const CONTACT_REASONS = [
      { id: "sales", label: "Sales & Product Inquiry", hint: "Pricing, demos and questions about our products." },
      { id: "proposal", label: "Project Proposal", hint: "You have a project and want a proposal or estimate." },
      { id: "partnership", label: "Business Partnership", hint: "Agencies, vendors and companies who want to work with us." },
      { id: "career", label: "Career & Internship", hint: "Jobs, internships and joining our team." },
      { id: "support", label: "Customer Support", hint: "Help with something we built for you." },
      { id: "general", label: "General Inquiry", hint: "Anything else you would like to ask." },
      { id: "media", label: "Media & Press", hint: "Interviews, articles and press requests." },
      { id: "feedback", label: "Complaints & Feedback", hint: "Tell us what we can do better." },
];

export const reasonLabel = (id) => CONTACT_REASONS.find((r) => r.id === id)?.label || "";
