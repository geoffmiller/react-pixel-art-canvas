import { useCallback, useEffect, useRef } from "react";

type ForegroundCanvasProps = {
  width: number;
  height: number;
  gridSize: number;
  pixelSize: number;
  foregroundVisible?: boolean;
  gridStrokeColor?: string;
  styles?: React.CSSProperties;
  className?: string;
};

export const ForegroundCanvas = ({
  width,
  height,
  gridSize = 16,
  pixelSize,
  foregroundVisible = true,
  gridStrokeColor = "#ccc",
  styles,
  className,
}: ForegroundCanvasProps) => {
  console.log("ForegroundCanvas");
  // refs
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);

  // functions
  const drawGrid = useCallback(() => {
    const gridCtx = foregroundCanvasRef.current?.getContext("2d");

    if (gridCtx) {
      gridCtx.clearRect(0, 0, width, height);

      gridCtx.strokeStyle = gridStrokeColor;
      for (let i = 0; i <= gridSize; i++) {
        gridCtx.beginPath();
        gridCtx.moveTo(i * pixelSize, 0);
        gridCtx.lineTo(i * pixelSize, gridSize * pixelSize);
        gridCtx.moveTo(0, i * pixelSize);
        gridCtx.lineTo(gridSize * pixelSize, i * pixelSize);
        gridCtx.stroke();
      }
    }
  }, [gridSize, gridStrokeColor, height, pixelSize, width]);

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
};
