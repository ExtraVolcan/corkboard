import type { VnScene } from "../../types";
import { chapter1Scenes } from "./chapter1";

/**
 * Assemble VN scenes in chapter order.
 * Add future chapters here: chapter2Scenes, chapter3Scenes, etc.
 */
export const VN_SCENES: VnScene[] = [...chapter1Scenes];

