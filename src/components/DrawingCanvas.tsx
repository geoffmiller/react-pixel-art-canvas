import React, { forwardRef, useRef } from "react";
import { canvasFloodFill } from "../utils/canvasFloodFill";
import { Tool, CanvasRef } from "../types/type";
import { useCanvasActions } from "../hooks/useCanvasActions";

type DrawingCanvasProps = {
  width: number;
  height: number;
  gridSize: number;
  selectedTool: Tool;
  selectedColor: string;
  styles?: React.CSSProperties;
  className?: string;
  history?: boolean;
  historyMaxSize?: number; // TODO: implement historyMaxSize
};

export const DrawingCanvas = forwardRef<CanvasRef, DrawingCanvasProps>(
  (
    {
      width,
      height,
      gridSize = 16,
      selectedColor,
      selectedTool,
      styles,
      className,
      history,
    }: DrawingCanvasProps,
    ref
  ) => {
    console.log("DrawingCanvas");
    // refs
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    // mouse state in ref to prevent unnecessary rerenders
    const isMouseDown = useRef(false);

    // custom hooks
    const { addToHistory } = useCanvasActions(
      drawingCanvasRef,
      ref,
      width,
      height,
      gridSize
    );

    // constants
    const PIXEL_SIZE = width / gridSize;
    const currentColor = selectedColor;
    const activeTool = selectedTool;

    // functions
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
      isMouseDown.current = true;
      handlePixelInteraction(event.clientX, event.clientY, event.buttons);
    };

    const handleMouseUp = () => {
      if (history) {
        const canvas = drawingCanvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });
        const png = canvas?.toDataURL("image/png");
        png && addToHistory(png as string);
      }
      isMouseDown.current = false;
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (
        isMouseDown.current &&
        (activeTool !== "fill" || event.buttons === 2)
      ) {
        handlePixelInteraction(event.clientX, event.clientY, event.buttons);
      }
    };

    const handlePixelInteraction = (
      x: number,
      y: number,
      mouseButton: number
    ) => {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });

      if (ctx && canvas) {
        const rect = canvas.getBoundingClientRect();
        const scale = width / rect.width;
        const col = Math.floor(((x - rect.left) * scale) / PIXEL_SIZE);
        const row = Math.floor(((y - rect.top) * scale) / PIXEL_SIZE);

        if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
          if (activeTool === "erase" || mouseButton === 2) {
            ctx.clearRect(
              col * PIXEL_SIZE,
              row * PIXEL_SIZE,
              PIXEL_SIZE,
              PIXEL_SIZE
            );
          } else if (activeTool === "fill" || mouseButton === 4) {
            canvasFloodFill(
              ctx,
              col * PIXEL_SIZE,
              row * PIXEL_SIZE,
              currentColor,
              PIXEL_SIZE
            );
          } else if (activeTool === "paint") {
            ctx.fillStyle = currentColor;
            ctx.fillRect(
              col * PIXEL_SIZE,
              row * PIXEL_SIZE,
              PIXEL_SIZE,
              PIXEL_SIZE
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
