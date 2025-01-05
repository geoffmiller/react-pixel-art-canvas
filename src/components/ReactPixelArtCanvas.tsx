import { forwardRef, ForwardRefExoticComponent, RefAttributes } from "react";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { ForegroundCanvas } from "./ForegroundCanvas";
import { DrawingCanvas } from "./DrawingCanvas";
import { ReactPixelArtCanvasProps, CanvasRef } from "../types/type";

const ReactPixelArtCanvas: ForwardRefExoticComponent<
  ReactPixelArtCanvasProps & RefAttributes<CanvasRef>
> = forwardRef<CanvasRef, ReactPixelArtCanvasProps>(
  (
    {
      settings,
      selectedColor,
      selectedTool,
      backGroundCanvasSettings,
      drawingCanvasSettings,
      foregroundCanvasSettings,
    },
    ref
  ) => {
    // constants
    const { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } = settings;
    const PIXEL_SIZE = CANVAS_WIDTH / GRID_SIZE;

    return (
      <div
        id="react-pixel-art-canvas-container"
        className={settings.className}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          margin: "0 auto",
          position: "relative",
          ...settings.styles,
        }}
      >
        <BackgroundCanvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          backgroundImage={backGroundCanvasSettings.backgroundImage}
          backgroundOpacity={backGroundCanvasSettings.backgroundOpacity}
          backgroundVisible={backGroundCanvasSettings.backgroundVisible}
          styles={backGroundCanvasSettings.styles}
          className={backGroundCanvasSettings.className}
        />
        <DrawingCanvas
          ref={ref}
          gridSize={settings.GRID_SIZE}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          pixelSize={PIXEL_SIZE}
          selectedColor={selectedColor}
          selectedTool={selectedTool}
          styles={drawingCanvasSettings.styles}
          className={drawingCanvasSettings.className}
        />
        <ForegroundCanvas
          gridSize={settings.GRID_SIZE}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          pixelSize={PIXEL_SIZE}
          foregroundVisible={foregroundCanvasSettings.foregroundVisible} // Add this prop
          gridStrokeColor={foregroundCanvasSettings.gridStrokeColor}
          styles={foregroundCanvasSettings.styles}
          className={foregroundCanvasSettings.className}
        />
      </div>
    );
  }
);

export default ReactPixelArtCanvas;
