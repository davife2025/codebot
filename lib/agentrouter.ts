import type { ModelOption } from "./types";

const DEFAULT_BASE_URL = "https://agentrouter.org/v1";

export function getAgentRouterConfig() {
  const apiKey = process.env.AGENTROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AGENTROUTER_API_KEY is not set. Add it to your .env.local file."
    );
  }
  const baseUrl = process.env.AGENTROUTER_BASE_URL || DEFAULT_BASE_URL;
  return { apiKey, baseUrl };
}

export function agentRouterHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * AgentRouter's /v1/models response follows the OpenAI list format:
 * { object: "list", data: [{ id: "...", ... }, ...] }
 * We normalize it into a small, UI-friendly shape.
 */
export function normalizeModelList(raw: unknown): ModelOption[] {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !("data" in raw) ||
    !Array.isArray((raw as { data: unknown }).data)
  ) {
    return [];
  }

  const data = (raw as { data: Array<{ id?: unknown }> }).data;

  return data
    .filter((entry): entry is { id: string } => typeof entry?.id === "string")
    .map((entry) => ({ id: entry.id, label: entry.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
