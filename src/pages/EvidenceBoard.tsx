import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { buildLinkEdges } from "../graph";
import { profileHasAnyNew } from "../newBadges";

type PolaroidData = {
  image: string;
  label: string;
  profileId: string;
  showNew?: boolean;
};
type PolaroidNodeType = Node<PolaroidData, "polaroid">;

function PolaroidNode({ data }: NodeProps<PolaroidNodeType>) {
  return (
    <div className="polaroid-node">
      <Handle type="target" position={Position.Left} id="L" />
      <Handle type="target" position={Position.Top} id="T" />
      <Handle type="source" position={Position.Right} id="R" />
      <Handle type="source" position={Position.Bottom} id="B" />
      <Link to={`/profile/${data.profileId}`} className="polaroid-link">
        <div className="polaroid-frame">
          {data.showNew ? (
            <span
              className="badge-new"
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                zIndex: 2,
              }}
            >
              NEW
            </span>
          ) : null}
          <div className="polaroid-photo-wrap">
            <img src={data.image} alt="" draggable={false} />
          </div>
          <div className="polaroid-caption">{data.label}</div>
        </div>
      </Link>
    </div>
  );
}

const nodeTypes: NodeTypes = { polaroid: PolaroidNode };

/** Evenly space node centers on a circle so adjacent pairs are at least `minChord` px apart (chord length). */
function circleLayout(
  count: number,
  minChord: number
): { x: number; y: number }[] {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: 0 }];
  const radius = minChord / (2 * Math.sin(Math.PI / count));
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const a = (2 * Math.PI * i) / count - Math.PI / 2;
    out.push({
      x: radius * Math.cos(a),
      y: radius * Math.sin(a),
    });
  }
  return out;
}

function FitViewOnLoad() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = requestAnimationFrame(() =>
      fitView({ padding: 0.25, duration: 200 })
    );
    return () => cancelAnimationFrame(t);
  }, [fitView]);
  return null;
}

function EvidenceBoardIntro() {
  const { isAdmin } = useAuth();
  const { data, ack, refresh, resetToSeed, saveFullCampaign } = useCampaign();
  const importRef = useRef<HTMLInputElement>(null);

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mystery-campaign.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      void (async () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (!parsed?.profiles || !Array.isArray(parsed.profiles)) {
            alert("Invalid file: expected { profiles: [...] }");
            return;
          }
          await saveFullCampaign(parsed);
        } catch {
          alert("Could not import (check JSON and admin session).");
        }
        await refresh();
      })();
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="paper" style={{ marginBottom: "1rem" }}>
      <h1 style={{ marginTop: 0 }}>Corkboard</h1>
      <p className="muted" style={{ marginBottom: 0 }}>
        {isAdmin
          ? "Open a polaroid for the full dossier. Reveal profiles and entries from each dossier page."
          : "Persons of interest and how they connect. New intel is marked until you leave that dossier."}{" "}
        Red strings follow mentions in notes.
      </p>
      {isAdmin ? (
        <div
          className="admin-strip"
          style={{
            marginTop: "0.75rem",
            background: "#e0f2fe",
            borderColor: "#7dd3fc",
          }}
        >
          <strong>Campaign data</strong> — lives on the server. Everyone sees the
          same reveals. This device only stores which items you have dismissed as
          “NEW” (in <code>localStorage</code>).
          <div className="admin-controls" style={{ marginTop: "0.5rem" }}>
            <Link to="/admin" className="btn btn-small" style={{ display: "inline-block" }}>
              Edit profiles & entries
            </Link>
            <button type="button" className="btn btn-small" onClick={exportJson}>
              Export JSON backup
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => importRef.current?.click()}
            >
              Import JSON…
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => {
                if (
                  confirm(
                    "Reset campaign on the server to the bundled sample from src/data/seed.json?"
                  )
                ) {
                  void (async () => {
                    try {
                      await resetToSeed();
                    } catch {
                      alert("Reset failed. Sign in as admin and try again.");
                    }
                  })();
                }
              }}
            >
              Reset server to sample
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={onImportFile}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EvidenceBoardFlow() {
  const { isAdmin } = useAuth();
  const { data, ack } = useCampaign();

  const profiles = useMemo(
    () =>
      isAdmin
        ? data.profiles
        : data.profiles.filter((p) => p.profileRevealed),
    [data.profiles, isAdmin]
  );

  const computedEdges: Edge[] = useMemo(() => {
    const raw = buildLinkEdges(data.profiles, {
      includeUnrevealedEntries: isAdmin,
    });
    const ids = new Set(profiles.map((p) => p.id));
    return raw
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e, i) => ({
        id: `e-${i}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: "straight" as const,
        style: { stroke: "#b91c1c", strokeWidth: 2.5 },
        zIndex: 0,
      }));
  }, [data.profiles, isAdmin, profiles]);

  const computedNodes: PolaroidNodeType[] = useMemo(() => {
    /** Minimum straight-line distance between centers of neighboring polaroids on the ring. */
    const minChord = 300;
    const pos = circleLayout(profiles.length, minChord);
    return profiles.map((p, i) => {
      const label =
        p.profileRevealed && p.nameRevealed
          ? p.name
          : isAdmin && p.nameRevealed
            ? p.name
            : "?";
      const image =
        p.profileRevealed && p.imageRevealed
          ? p.image
          : isAdmin && p.imageRevealed
            ? p.image
            : "data:image/svg+xml," +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"><rect fill="%23ddd" width="120" height="150"/><text x="60" y="85" font-size="48" text-anchor="middle" fill="%23999">?</text></svg>`
              );
      const showNew = profileHasAnyNew(p, ack, isAdmin);
      return {
        id: p.id,
        type: "polaroid",
        position: pos[i] ?? { x: 0, y: 0 },
        data: {
          image,
          label,
          profileId: p.id,
          showNew,
        },
        draggable: false,
      };
    });
  }, [profiles, isAdmin, ack]);

  const [nodes, setNodes, onNodesChange] = useNodesState<PolaroidNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(computedNodes);
  }, [computedNodes, setNodes]);

  useEffect(() => {
    setEdges(computedEdges);
  }, [computedEdges, setEdges]);

  if (profiles.length === 0) {
    return (
      <p className="graph-note">
        Nothing published on the board yet. Check back later.
      </p>
    );
  }

  return (
    <>
      <p className="graph-note">Click a polaroid to open that dossier.</p>
      <div className="graph-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          fitView
          minZoom={0.25}
          maxZoom={1.5}
        >
          <FitViewOnLoad />
          <Background color="#3d2e22" gap={24} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeStrokeWidth={2}
            maskColor="rgba(20,12,8,0.65)"
            style={{ background: "#2a1810" }}
          />
        </ReactFlow>
      </div>
    </>
  );
}

export function EvidenceBoard() {
  return (
    <>
      <EvidenceBoardIntro />
      <ReactFlowProvider>
        <EvidenceBoardFlow />
      </ReactFlowProvider>
    </>
  );
}
