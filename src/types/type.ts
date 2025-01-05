export type Tool = "paint" | "erase" | "fill";

export type CanvasRef = {
  clearCanvas: () => void;
  exportSVG: () => string | undefined;
  exportPNG: () => void;
};

export type ReactPixelArtCanvasProps = {
  settings: {
    GRID_SIZE: number;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    styles?: React.CSSProperties;
    className?: string;
  };
  backGroundCanvasSettings: {
    backgroundImage?: HTMLImageElement | null;
    backgroundOpacity: number;
    backgroundVisible?: boolean;
    styles?: React.CSSProperties;
    className?: string;
  };
  drawingCanvasSettings: {
    styles?: React.CSSProperties;
    className?: string;
  };
  foregroundCanvasSettings: {
    foregroundVisible?: boolean;
    gridStrokeColor?: string;
    styles?: React.CSSProperties;
    className?: string;
  };
  selectedColor: string;
  selectedTool: Tool;
};
