export type ReactPixelArtCanvasProps = {
  children: React.ReactNode;
  settings: {
    GRID_SIZE: number;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    styles?: React.CSSProperties;
    className?: string;
  };
};

export const ReactPixelArtCanvas = ({
  children,
  settings,
}: ReactPixelArtCanvasProps) => {
  // constants
  const { CANVAS_WIDTH, CANVAS_HEIGHT } = settings;

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
      {children}
    </div>
  );
};
