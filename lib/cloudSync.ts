import type { Conversation } from "./types";
import { getSupabaseClient } from "./supabaseClient";

const TABLE = "conversations";

/**
 * Returns the current Supabase user id, signing in anonymously if there's no
 * session yet. Requires "Allow anonymous sign-ins" enabled in the Supabase
 * project's Auth settings — see README for the exact toggle.
 */
export async function ensureAnonymousSession(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) return session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error("Supabase anonymous sign-in failed:", error.message);
    return null;
  }
  return data.user?.id ?? null;
}

export async function fetchRemoteConversations(userId: string): Promise<Conversation[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch remote conversations:", error.message);
    return [];
  }

  return (data || []).map((row) => row.data as Conversation);
}

export async function upsertRemoteConversation(userId: string, conversation: Conversation) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.from(TABLE).upsert({
    id: conversation.id,
    user_id: userId,
    data: conversation,
    updated_at: new Date().toISOString(),
  });

  if (error) console.error("Failed to sync conversation:", error.message);
}

export async function deleteRemoteConversation(userId: string, id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.from(TABLE).delete().eq("id", id).eq("user_id", userId);
  if (error) console.error("Failed to delete remote conversation:", error.message);
}
