import { useCallback, useEffect, useRef } from "react";

type BackgroundCanvasProps = {
  width: number;
  height: number;
  backgroundImage?: HTMLImageElement | null;
  backgroundOpacity: number; // 0 to 1
  backgroundVisible?: boolean;
  styles?: React.CSSProperties;
  className?: string;
};

export const BackgroundCanvas = ({
  width,
  height,
  backgroundImage,
  backgroundOpacity = 1,
  backgroundVisible = true,
  styles,
  className,
}: BackgroundCanvasProps) => {
  console.log("BackgroundCanvas");
  // refs
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  // functions
  const drawBackground = useCallback(() => {
    const bgCanvas = backgroundCanvasRef.current;
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
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
};
