/** Device-local “seen / not NEW” flags only. Campaign data lives on the server. */

export const ACK_KEY = "mystery-corkboard-ack";

export type AckState = Record<string, string[]>;

export function loadAck(): AckState {
  try {
    const raw = localStorage.getItem(ACK_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AckState;
  } catch {
    return {};
  }
}
