import { useState, useRef, useEffect } from "react";
import "./App.css";
import { ReactPixelArtCanvas } from "../../src/components/ReactPixelArtCanvas";
import { BackgroundCanvas } from "../../src/components/BackgroundCanvas";
import { DrawingCanvas } from "../../src/components/DrawingCanvas";
import { ForegroundCanvas } from "../../src/components/ForegroundCanvas";
import { Tool, CanvasRef } from "../../src/types/type";

function App() {
  const GRID_SIZE = 16;
  const CANVAS_SIZE = {
    width: 896,
    height: 896,
  };
  const drawingCanvasRef = useRef<CanvasRef>(null);
  const backgroundCanvasRef = useRef<CanvasRef>(null);
  const foregroundCanvasRef = useRef<CanvasRef>(null);

  const [tool, setTool] = useState<Tool>("paint");
  const [color, setColor] = useState("#113db8");
  const [showBackground, setShowBackground] = useState(true);
  const [showForeground, setShowForeground] = useState(true);
  const [gridSize, setGridSize] = useState(GRID_SIZE);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>();

  const handleToolChange = (tool: Tool) => {
    setTool(tool);
  };

  const toggleForeground = () => {
    setShowForeground(!showForeground);
  };

  const toggleBackground = () => {
    setShowBackground(!showBackground);
  };

  const handleClear = () => {
    drawingCanvasRef.current?.clearCanvas();
  };

  const handleExportToSVG = () => {
    const svg = drawingCanvasRef.current?.exportSVG();
    console.log(svg);

    if (!svg) return;
    // force a download
    const blob = new Blob([svg.toString()]);
    const a = document.createElement("a");
    a.download = "react-pixel-art-canvas.svg";
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  };

  const handleExportToPNG = () => {
    // raw png data
    const pngData = drawingCanvasRef.current?.exportPNG();
    console.log(pngData);

    if (!pngData) return;
    // force a download
    const a = document.createElement("a");
    a.href = pngData as unknown as string;
    a.download = "react-pixel-art-canvas.png";
    a.click();
    a.remove();
  };

  useEffect(() => {
    const img = new Image();
    img.src = "/flower-bg.png";
    img.onload = () => {
      setBackgroundImage(img);
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={() => handleToolChange("paint")}>paint</button>
        <button onClick={() => handleToolChange("erase")}>erase</button>
        <button onClick={() => handleToolChange("fill")}>fill</button>
        <button onClick={handleClear}>clear</button>
        <div>
          <button onClick={toggleBackground}>
            {showBackground ? "hide" : "show"} background
          </button>
          <button onClick={toggleForeground}>
            {showForeground ? "hide" : "show"} grid
          </button>
        </div>
        <div>
          <input type="color" onChange={(e) => setColor(e.target.value)} />
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          >
            <option value="16">16x16</option>
            <option value="32">32x32</option>
            <option value="64">64x64</option>
            <option value="128">128x128</option>
          </select>
          <div>
            <label>
              Background Opacity:
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
              />
              {backgroundOpacity}
            </label>
          </div>
          <div>
            <button onClick={handleExportToSVG}>Export to SVG</button>
            <button onClick={handleExportToPNG}>Export to PNG</button>
          </div>
        </div>
        <ReactPixelArtCanvas
          settings={{
            GRID_SIZE: gridSize,
            CANVAS_WIDTH: 896, //768 or 896 // canvas width should be divisible by GRID_SIZE(s)
            CANVAS_HEIGHT: 896,
            styles: { border: "1px solid #ccc" },
          }}
        >
          <BackgroundCanvas
            ref={backgroundCanvasRef}
            gridSize={gridSize}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            backgroundImage={backgroundImage}
            backgroundOpacity={backgroundOpacity}
            backgroundVisible={showBackground}
          />
          <DrawingCanvas
            ref={drawingCanvasRef}
            gridSize={gridSize}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            selectedColor={color}
            selectedTool={tool}
          />
          <ForegroundCanvas
            ref={foregroundCanvasRef}
            gridSize={gridSize}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            foregroundVisible={showForeground}
            gridStrokeColor="#d1d1d1"
          />
        </ReactPixelArtCanvas>
      </div>
    </>
  );
}

export default App;
