import type { VnCharacter } from "../types";
import { characterNameRevealFlag } from "../nameReveal";

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
    nameRevealFlag: characterNameRevealFlag("detective"),
  },
  {
    id: "assistant",
    name: "Assistant",
    accent: "#0f766e",
    // No unknownName → name always visible (no flag).
  },
  {
    id: "ariel",
    name: "Ariel",
    accent: "#a0998c",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("ariel"),
  },
  {
    id: "miranda",
    name: "Miranda",
    accent: "#f4eee6",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("miranda"),
  },
  {
    id: "prospero",
    name: "Prospero",
    accent: "#fde68a",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("prospero"),
  },
  {
    id: "puck",
    name: "Puck",
    accent: "#e7e2da",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("puck"),
  },
  {
    id: "portia",
    name: "Portia",
    accent: "#c8a060",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("portia"),
  },
  {
    id: "juliet",
    name: "Juliet",
    accent: "#8b5c3c",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("juliet"),
  },
  {
    id: "bianca",
    name: "Bianca",
    accent: "#574f4a",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("bianca"),
  },
  {
    id: "cressida",
    name: "Cressida",
    accent: "#3c3836",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("cressida"),
  },
  {
    id: "desdemona",
    name: "Desdemona",
    accent: "#282828",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("desdemona"),
  },
  {
    id: "stephano",
    name: "Stephano",
    accent: "#1c1c1c",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("stephano"),
  },
  {
    id: "francisco",
    name: "Francisco",
    accent: "#d6cec2",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("francisco"),
  },
  {
    id: "ferdinand",
    name: "Ferdinand",
    accent: "#b2a69a",
    unknownName: "???",
    nameRevealFlag: characterNameRevealFlag("ferdinand"),
  },
];
