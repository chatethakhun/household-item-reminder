import type { Messages } from "./messages";

export function getMessageString(messages: Messages, key: string): string | undefined {
  const parts = key.split(".").filter(Boolean);
  let cur: unknown = messages;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object" || Array.isArray(cur)) {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}
