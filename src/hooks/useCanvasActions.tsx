import { RefObject, useImperativeHandle } from "react";
import { canvasToSVG } from "../utils/canvasToSVG";
import { CanvasRef } from "../types/type";

export const useCanvasActions = (
  canvasRef: RefObject<HTMLCanvasElement>,
  forwardRef:
    | ((instance: CanvasRef | null) => void)
    | RefObject<unknown>
    | null
    | undefined,
  width: number,
  height: number,
  gridSize: number
) => {
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.clearRect(0, 0, width, height); // Clear the drawing canvas
    }
  };

  const handleCanvasToSVG = () => {
    return canvasToSVG(canvasRef.current!, gridSize);
  };

  const handleCanvasToPNG = () => {
    return canvasRef.current?.toDataURL("image/png");
  };

  useImperativeHandle(forwardRef, () => ({
    clearCanvas: handleClear,
    exportSVG: handleCanvasToSVG,
    exportPNG: handleCanvasToPNG,
    canvas: canvasRef.current,
  }));
};
