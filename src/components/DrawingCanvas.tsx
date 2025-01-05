import React, { forwardRef, useRef, useState } from "react";
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
    }: DrawingCanvasProps,
    ref
  ) => {
    console.log("DrawingCanvas");
    // constants
    const PIXEL_SIZE = width / gridSize;
    const currentColor = selectedColor;
    const activeTool = selectedTool;

    // refs
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    // mouse state in ref to prevent unnecessary rerenders
    const isMouseDown = useRef(false);

    // functions
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
      isMouseDown.current = true;
      handlePixelInteraction(event.clientX, event.clientY, event.buttons);
    };

    const handleMouseUp = () => {
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

    useCanvasActions(drawingCanvasRef, ref, width, height, gridSize);

    const handlePixelInteraction = (
      x: number,
      y: number,
      mouseButton: number
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
