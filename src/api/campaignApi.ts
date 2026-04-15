import type { CampaignData } from "../types";

const TOKEN_KEY = "mystery-corkboard-jwt";

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function fetchCampaign(): Promise<CampaignData> {
  const r = await fetch("/api/campaign");
  if (!r.ok) throw new Error(`Failed to load campaign (${r.status})`);
  return r.json() as Promise<CampaignData>;
}

export async function putCampaign(
  data: CampaignData,
  token: string
): Promise<void> {
  const r = await fetch("/api/campaign", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `Save failed (${r.status})`);
  }
}

export async function resetCampaignOnServer(token: string): Promise<void> {
  const r = await fetch("/api/campaign/reset", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`Reset failed (${r.status})`);
}

export async function loginRequest(password: string): Promise<string> {
  const r = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!r.ok) throw new Error("login failed");
  const j = (await r.json()) as { token?: string };
  if (!j.token) throw new Error("no token");
  return j.token;
}

export async function meRequest(token: string): Promise<boolean> {
  const r = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return false;
  const j = (await r.json()) as { admin?: boolean };
  return j.admin === true;
}
