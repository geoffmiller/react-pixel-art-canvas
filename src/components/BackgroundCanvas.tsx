import { useCallback, useEffect, useRef, forwardRef } from "react";
import { CanvasRef } from "../types/type";
import { useCanvasActions } from "../hooks/useCanvasActions";
import { getContext2d } from "../utils/getContext2d";

type BackgroundCanvasProps = {
  width: number;
  height: number;
  gridSize: number;
  backgroundImage?: HTMLImageElement | null;
  backgroundOpacity: number; // 0 to 1
  backgroundVisible?: boolean;
  styles?: React.CSSProperties;
  className?: string;
};

export const BackgroundCanvas = forwardRef<CanvasRef, BackgroundCanvasProps>(
  (
    {
      width,
      height,
      gridSize,
      backgroundImage,
      backgroundOpacity = 1,
      backgroundVisible = true,
      styles,
      className,
    }: BackgroundCanvasProps,
    ref
  ) => {
    console.log("BackgroundCanvas");
    // refs
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

    // functions
    const drawBackground = useCallback(() => {
      const bgCtx = getContext2d(backgroundCanvasRef);
      if (!bgCtx) return;

      // Always clear the canvas first
      bgCtx.clearRect(0, 0, width, height);

      // Set the opacity
      bgCtx.globalAlpha = backgroundOpacity;

      // If background image is available and visible, draw it
      if (backgroundImage && backgroundVisible) {
        bgCtx.drawImage(backgroundImage, 0, 0, width, height);
      } else {
        // Otherwise draw the default background
        bgCtx.fillStyle = "#bcbbbb";
        bgCtx.fillRect(0, 0, width, height);
      }
    }, [width, height, backgroundOpacity, backgroundImage, backgroundVisible]);

    useCanvasActions(backgroundCanvasRef, ref, width, height, gridSize);

    useEffect(() => {
      drawBackground();
    }, [drawBackground]);

    return (
      <canvas
        id="react-pixel-art-canvas-background"
        ref={backgroundCanvasRef}
        width={width}
        height={height}
        className={className}
        style={{
          visibility: backgroundVisible ? "visible" : "hidden",
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          ...styles,
        }}
      />
    );
  }
);
