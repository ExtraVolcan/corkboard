import { useEffect, useMemo } from "react";
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

type PolaroidData = { image: string; label: string; profileId: string };
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

function circleLayout(
  count: number,
  radius: number
): { x: number; y: number }[] {
  if (count === 0) return [];
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

function EvidenceBoardFlow() {
  const { isAdmin } = useAuth();
  const { data } = useCampaign();

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
    const r = Math.max(220, profiles.length * 36);
    const pos = circleLayout(profiles.length, r);
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
      return {
        id: p.id,
        type: "polaroid",
        position: pos[i] ?? { x: 0, y: 0 },
        data: {
          image,
          label,
          profileId: p.id,
        },
        draggable: true,
      };
    });
  }, [profiles, isAdmin]);

  const [nodes, setNodes, onNodesChange] = useNodesState<PolaroidNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(computedNodes);
  }, [computedNodes, setNodes]);

  useEffect(() => {
    setEdges(computedEdges);
  }, [computedEdges, setEdges]);

  return (
    <div>
      <div className="paper" style={{ marginBottom: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>Evidence board</h1>
        <p className="muted" style={{ marginBottom: 0 }}>
          Links come from mentions in dossier notes (<code>[[profile-id]]</code>
          ). Red strings connect related profiles. Drag photos to rearrange.
        </p>
      </div>
      <p className="graph-note">
        Click a polaroid to open that dossier.
      </p>
      <div className="graph-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
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
    </div>
  );
}

export function EvidenceBoard() {
  return (
    <ReactFlowProvider>
      <EvidenceBoardFlow />
    </ReactFlowProvider>
  );
}
