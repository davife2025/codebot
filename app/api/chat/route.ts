import { agentRouterHeaders, getAgentRouterConfig } from "@/lib/agentrouter";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  model: string;
  messages: IncomingMessage[];
}

export async function POST(request: Request) {
  let config;
  try {
    config = getAgentRouterConfig();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Missing configuration" },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.model || !Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json(
      { error: "Request must include a model and a non-empty messages array" },
      { status: 400 }
    );
  }

  // Only forward the fields the upstream API expects.
  const messages = body.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const upstream = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: agentRouterHeaders(config.apiKey),
    body: JSON.stringify({
      model: body.model,
      messages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: `AgentRouter returned ${upstream.status}: ${text}` },
      { status: upstream.status || 502 }
    );
  }

  // Pass the upstream SSE stream straight through to the client.
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
