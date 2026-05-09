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

/** Clears device-local “seen” markers so corkboard NEW badges show again. */
export function clearAckStorage(): void {
  try {
    localStorage.removeItem(ACK_KEY);
  } catch {
    // ignore quota / privacy mode
  }
}
