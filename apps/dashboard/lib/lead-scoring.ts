export type LeadIntent =
  | "training"
  | "products"
  | "installation"
  | "digital_bid"
  | "contractor_partner"
  | "support"
  | "unknown";

export function scoreLead(input: { intent: LeadIntent; hasProject?: boolean; hasLocation?: boolean; isPastAttendee?: boolean }) {
  let score = 0;

  if (input.intent === "digital_bid" || input.intent === "installation") score += 40;
  if (input.intent === "products" || input.intent === "training") score += 25;
  if (input.intent === "contractor_partner") score += 30;
  if (input.hasProject) score += 25;
  if (input.hasLocation) score += 15;
  if (input.isPastAttendee) score += 10;

  return Math.min(score, 100);
}
