import type { ChatMessage } from "./types";

/**
 * Walks a flat message list and groups consecutive assistant messages that
 * share a turnId (produced by compare mode) so they can be rendered — or
 * reasoned about — as a single turn.
 */
export function groupMessages(messages: ChatMessage[]): ChatMessage[][] {
  const groups: ChatMessage[][] = [];
  let i = 0;
  while (i < messages.length) {
    const m = messages[i];
    if (m.role === "user") {
      groups.push([m]);
      i++;
      continue;
    }
    const group = [m];
    let j = i + 1;
    while (
      j < messages.length &&
      messages[j].role === "assistant" &&
      m.turnId !== undefined &&
      messages[j].turnId === m.turnId
    ) {
      group.push(messages[j]);
      j++;
    }
    groups.push(group);
    i = j;
  }
  return groups;
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

/** Keep the outgoing request bounded — see README for why this number. */
const MAX_HISTORY_TURNS = 30;

/**
 * Builds the message list sent to AgentRouter. Most chat APIs expect strict
 * user/assistant alternation; a compare-mode turn produces two consecutive
 * assistant messages, which some providers reject and all of them find
 * confusing (whose answer is whose?). This collapses each turn into a
 * single assistant message, labeling both models' answers when there were
 * two, so history stays a clean alternation no matter how the turn was
 * generated. Also truncates to the most recent turns so a long-running
 * conversation doesn't grow the request (and the model's context usage)
 * without bound.
 */
export function buildApiHistory(messages: ChatMessage[]): ApiMessage[] {
  const groups = groupMessages(messages);

  const collapsed: ApiMessage[] = groups.map((group) => {
    const first = group[0];
    if (first.role === "user") {
      return { role: "user", content: first.content };
    }
    if (group.length === 1) {
      return { role: "assistant", content: first.content };
    }
    const combined = group.map((m) => `[${m.model}]: ${m.content}`).join("\n\n");
    return { role: "assistant", content: combined };
  });

  return collapsed.slice(-MAX_HISTORY_TURNS);
}
