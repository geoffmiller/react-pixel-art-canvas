import { RefObject, useImperativeHandle } from "react";
import { canvasToSVG } from "../utils/canvasToSVG";
import { CanvasRef } from "../types/type";
import { useCanvasHistory } from "./useCanvasHistory";
import { getContext2d } from "../utils/getContext2d";

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
  const { addToHistory, undoHistory } = useCanvasHistory();

  // canvas actions
  const handleClear = () => {
    // TODO: add clear event to history that doesnt break history
    const ctx = getContext2d(canvasRef);
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  };

  const handleCanvasToSVG = () => {
    return canvasToSVG(canvasRef.current!, gridSize);
  };

  const handleCanvasToPNG = () => {
    return canvasRef.current?.toDataURL("image/png");
  };

  // history actions
  const handleUndo = () => {
    const ctx = getContext2d(canvasRef);
    if (ctx) {
      const previousState = undoHistory();
      if (previousState) {
        let image = new Image();
        image.onload = function () {
          handleClear();
          ctx.drawImage(image, 0, 0);
        };
        image.src = previousState;
      } else {
        handleClear();
      }
    }
  };

  useImperativeHandle(forwardRef, () => ({
    clearCanvas: handleClear,
    exportSVG: handleCanvasToSVG,
    exportPNG: handleCanvasToPNG,
    undoHistory: handleUndo,
    canvas: canvasRef.current,
  }));

  return {
    addToHistory,
  };
};
