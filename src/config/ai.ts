/**
 * AI model defaults for licensed deployments.
 * Customers receive Gemini only — no OpenRouter or free-tier providers.
 */
export const aiConfig = {
  defaultModel: "gemini-2.5-flash",
  provider: "google",
  allowedModels: ["gemini-2.5-flash", "gemini-2.5-pro"] as const,
} as const;
