export type Tool = "paint" | "erase" | "fill";

export type CanvasRef = {
  clearCanvas: () => void;
  exportSVG: () => string | undefined;
  exportPNG: () => string | undefined;
  canvas: HTMLCanvasElement | null;
};
