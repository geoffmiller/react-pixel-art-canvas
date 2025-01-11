import { forwardRef, useCallback, useEffect, useRef } from "react";
import { CanvasRef } from "../types/type";
import { useCanvasActions } from "../hooks/useCanvasActions";
import { getContext2d } from "../utils/getContext2d";

type ForegroundCanvasProps = {
  width: number;
  height: number;
  gridSize: number;
  foregroundVisible?: boolean;
  gridStrokeColor?: string;
  styles?: React.CSSProperties;
  className?: string;
};

export const ForegroundCanvas = forwardRef<CanvasRef, ForegroundCanvasProps>(
  (
    {
      width,
      height,
      gridSize = 16,
      foregroundVisible = true,
      gridStrokeColor = "#ccc",
      styles,
      className,
    }: ForegroundCanvasProps,
    ref
  ) => {
    console.log("ForegroundCanvas");
    // constants
    const PIXEL_SIZE = width / gridSize;

    // refs
    const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);

    // functions
    const drawGrid = useCallback(() => {
      const gridCtx = getContext2d(foregroundCanvasRef);
      if (gridCtx) {
        gridCtx.clearRect(0, 0, width, height);

        gridCtx.strokeStyle = gridStrokeColor;
        for (let i = 0; i <= gridSize; i++) {
          gridCtx.beginPath();
          gridCtx.moveTo(i * PIXEL_SIZE, 0);
          gridCtx.lineTo(i * PIXEL_SIZE, gridSize * PIXEL_SIZE);
          gridCtx.moveTo(0, i * PIXEL_SIZE);
          gridCtx.lineTo(gridSize * PIXEL_SIZE, i * PIXEL_SIZE);
          gridCtx.stroke();
        }
      }
    }, [gridSize, gridStrokeColor, height, PIXEL_SIZE, width]);

    useCanvasActions(foregroundCanvasRef, ref, width, height, gridSize);

    useEffect(() => {
      drawGrid();
    }, [drawGrid]);

    return (
      <canvas
        id="react-pixel-art-canvas-foreground"
        ref={foregroundCanvasRef}
        width={width}
        height={height}
        className={className}
        style={{
          visibility: foregroundVisible ? "visible" : "hidden", // Add this line
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          position: "absolute",
          left: 0,
          top: 0,
          ...styles,
        }}
      />
    );
  }
);
