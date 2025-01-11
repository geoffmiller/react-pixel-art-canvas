export type ReactPixelArtCanvasProps = {
  children: React.ReactNode;
  width: number;
  height: number;
  styles?: React.CSSProperties;
  className?: string;
};

export const ReactPixelArtCanvas = ({
  children,
  width,
  height,
  styles,
  className,
}: ReactPixelArtCanvasProps) => {
  return (
    <div
      id="react-pixel-art-canvas-container"
      className={className}
      style={{
        width,
        height,
        margin: "0 auto",
        position: "relative",
        ...styles,
      }}
    >
      {children}
    </div>
  );
};
