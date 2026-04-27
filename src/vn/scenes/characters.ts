import type { VnCharacter } from "../types";

// Named after moons of Uranus (Shakespeare / myth).

export const VN_CHARACTERS: VnCharacter[] = [
  {
    id: "narrator",
    name: "Narrator",
    hideSpeakerLabel: true,
  },
  {
    id: "detective",
    name: "Caliban",
    accent: "#7c2d12",
    unknownName: "???",
  },
  {
    id: "assistant",
    name: "Assistant",
    accent: "#0f766e",
  },
  { id: "ariel", name: "Ariel", accent: "#a0998c", unknownName: "???" },
  { id: "miranda", name: "Miranda", accent: "#f4eee6", unknownName: "???" },
  { id: "prospero", name: "Prospero", accent: "#fde68a", unknownName: "???" },
  { id: "puck", name: "Puck", accent: "#e7e2da", unknownName: "???" },
  { id: "portia", name: "Portia", accent: "#c8a060", unknownName: "???" },
  { id: "juliet", name: "Juliet", accent: "#8b5c3c", unknownName: "???" },
  { id: "bianca", name: "Bianca", accent: "#574f4a", unknownName: "???" },
  { id: "cressida", name: "Cressida", accent: "#3c3836", unknownName: "???" },
  { id: "desdemona", name: "Desdemona", accent: "#282828", unknownName: "???" },
  { id: "stephano", name: "Stephano", accent: "#1c1c1c", unknownName: "???" },
  { id: "francisco", name: "Francisco", accent: "#d6cec2", unknownName: "???" },
  { id: "ferdinand", name: "Ferdinand", accent: "#b2a69a", unknownName: "???" },
];
