import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { canvasFloodFill } from "../utils/canvasFloodFill";
import { Tool, CanvasRef } from "../types/type";
import { canvasToSVG } from "../utils/canvasToSVG";

type DrawingCanvasProps = {
  width: number;
  height: number;
  gridSize: number;
  pixelSize: number;
  selectedTool: Tool;
  selectedColor: string;
  styles?: React.CSSProperties;
  className?: string;
};

export const DrawingCanvas = forwardRef<CanvasRef, DrawingCanvasProps>(
  (
    {
      width,
      height,
      gridSize = 16,
      pixelSize,
      selectedColor,
      selectedTool,
      styles,
      className,
    }: DrawingCanvasProps,
    ref
  ) => {
    console.log("DrawingCanvas");
    const currentColor = selectedColor;
    const activeTool = selectedTool;

    // state
    const [isMouseDown, setIsMouseDown] = useState(false);

    // refs
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

    // functions
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(true);
      handlePixelInteraction(event.clientX, event.clientY, event.button === 2);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (isMouseDown && (activeTool !== "fill" || event.button === 2)) {
        handlePixelInteraction(
          event.clientX,
          event.clientY,
          event.button === 2
        );
      }
    };

    const handleClear = () => {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, width, height); // Clear the drawing canvas
      }
    };

    const handleCanvasToSVG = () => {
      return canvasToSVG(drawingCanvasRef.current!, gridSize);
    };

    const handleCanvasToPNG = () => {
      return drawingCanvasRef.current?.toDataURL("image/png");
    };

    useImperativeHandle(ref, () => ({
      clearCanvas: handleClear,
      exportSVG: handleCanvasToSVG,
      exportPNG: handleCanvasToPNG,
    }));

    const handlePixelInteraction = (
      x: number,
      y: number,
      isErasing = false
    ) => {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });

      if (ctx && canvas) {
        if (!isMouseDown) {
          // saveToHistory();
        }
        const rect = canvas.getBoundingClientRect();
        const scale = width / rect.width; // border is on the parent now
        // const scale = width / (rect.width + 2); //account for border ???
        const col = Math.floor(((x - rect.left) * scale) / pixelSize);
        const row = Math.floor(((y - rect.top) * scale) / pixelSize);

        if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
          if (isErasing) {
            ctx.clearRect(
              col * pixelSize,
              row * pixelSize,
              pixelSize,
              pixelSize
            );
          } else if (activeTool === "fill") {
            canvasFloodFill(
              ctx,
              col * pixelSize,
              row * pixelSize,
              currentColor,
              pixelSize // Make sure this parameter is included
            );
          } else if (activeTool === "erase") {
            ctx.clearRect(
              col * pixelSize,
              row * pixelSize,
              pixelSize,
              pixelSize
            );
          } else {
            ctx.fillStyle = currentColor;
            ctx.fillRect(
              col * pixelSize,
              row * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }
    };

    return (
      <canvas
        id="react-pixel-art-canvas-drawing"
        ref={drawingCanvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={(e) => e.preventDefault()}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          position: "absolute",
          left: 0,
          top: 0,
          ...styles,
        }}
      />
    );
  }
);
