import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CampaignData, Profile } from "./types";
import {
  fetchCampaign,
  getToken,
  putCampaign,
  resetCampaignOnServer,
} from "./api/campaignApi";
import { ACK_KEY, type AckState, loadAck } from "./storage";

type CampaignContextValue = {
  data: CampaignData;
  ready: boolean;
  loadError: string | null;
  ack: AckState;
  /** @param silent If true, do not toggle the global loading / error UI (e.g. after login). */
  refresh: (silent?: boolean) => Promise<void>;
  setProfile: (profileId: string, updater: (p: Profile) => Profile) => void;
  resetToSeed: () => Promise<void>;
  saveFullCampaign: (data: CampaignData) => Promise<void>;
  mergeAck: (profileId: string, tokens: string[]) => void;
};

const CampaignContext = createContext<CampaignContextValue | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CampaignData>({ profiles: [] });
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ack, setAck] = useState<AckState>(() => loadAck());

  const refresh = useCallback(async (silent?: boolean) => {
    if (!silent) {
      setLoadError(null);
      setReady(false);
    }
    try {
      const d = await fetchCampaign();
      setData(d);
      if (!silent) setLoadError(null);
    } catch (e) {
      if (!silent) {
        setLoadError(e instanceof Error ? e.message : "Failed to load");
      }
    } finally {
      if (!silent) setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setProfile = useCallback(
    (profileId: string, updater: (p: Profile) => Profile) => {
      let nextData: CampaignData | null = null;
      setData((prev) => {
        const idx = prev.profiles.findIndex((p) => p.id === profileId);
        if (idx < 0) return prev;
        nextData = {
          ...prev,
          profiles: prev.profiles.map((p) =>
            p.id === profileId ? updater(p) : p
          ),
        };
        return nextData;
      });

      if (!nextData) return;

      const t = getToken();
      if (!t) return;

      void (async () => {
        try {
          await putCampaign(nextData!, t);
        } catch {
          await refresh();
          alert(
            "Could not save changes. If you are admin, sign in again and retry."
          );
        }
      })();
    },
    [refresh]
  );

  const resetToSeed = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    await resetCampaignOnServer(t);
    await refresh();
  }, [refresh]);

  const saveFullCampaign = useCallback(
    async (next: CampaignData) => {
      const t = getToken();
      if (!t) throw new Error("Not signed in");
      await putCampaign(next, t);
      setData(next);
    },
    []
  );

  const mergeAck = useCallback((profileId: string, tokens: string[]) => {
    const current = loadAck();
    const set = new Set(current[profileId] ?? []);
    for (const t of tokens) set.add(t);
    current[profileId] = [...set];
    localStorage.setItem(ACK_KEY, JSON.stringify(current));
    setAck(current);
  }, []);

  const value = useMemo(
    () => ({
      data,
      ready,
      loadError,
      ack,
      refresh,
      setProfile,
      resetToSeed,
      saveFullCampaign,
      mergeAck,
    }),
    [
      data,
      ready,
      loadError,
      ack,
      refresh,
      setProfile,
      resetToSeed,
      saveFullCampaign,
      mergeAck,
    ]
  );

  if (!ready) {
    return (
      <div className="paper" style={{ maxWidth: 360, margin: "2rem auto" }}>
        <p className="muted">Loading corkboard…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="paper" style={{ maxWidth: 480, margin: "2rem auto" }}>
        <h1>Could not load corkboard</h1>
        <p className="error">{loadError}</p>
        <p className="muted">
          If you are developing locally, run{" "}
          <code>npm run dev</code> (starts the API and the Vite app) so{" "}
          <code>/api/campaign</code> is available.
        </p>
        <p style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void refresh(false)}
          >
            Retry
          </button>
        </p>
      </div>
    );
  }

  return (
    <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>
  );
}

export function useCampaign(): CampaignContextValue {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error("useCampaign outside CampaignProvider");
  return ctx;
}
