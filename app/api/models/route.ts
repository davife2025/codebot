import {
  agentRouterHeaders,
  getAgentRouterConfig,
  normalizeModelList,
} from "@/lib/agentrouter";

export async function GET() {
  let config;
  try {
    config = getAgentRouterConfig();
  } catch (err) {
    // Missing/invalid config, not a server fault — 401, not 500.
    return Response.json(
      { error: err instanceof Error ? err.message : "Missing configuration" },
      { status: 401 }
    );
  }

  const upstream = await fetch(`${config.baseUrl}/models`, {
    headers: agentRouterHeaders(config.apiKey),
    // Model list changes rarely; avoid hammering AgentRouter on every load.
    next: { revalidate: 300 },
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: `AgentRouter returned ${upstream.status}: ${text}` },
      { status: upstream.status }
    );
  }

  const raw = await upstream.json();
  const models = normalizeModelList(raw);

  return Response.json({ models });
}
