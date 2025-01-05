import { useState, useRef } from "react";
import "./App.css";
import ReactPixelArtCanvas from "../../src/components/ReactPixelArtCanvas";
import { Tool, CanvasRef } from "../../src/types/type";

function App() {
  const canvasRef = useRef<CanvasRef>(null);

  const [tool, setTool] = useState<Tool>("paint");
  const [color, setColor] = useState("#c90000");
  const [showBackground, setShowBackground] = useState(true);
  const [showForeground, setShowForeground] = useState(true);
  const [gridSize, setGridSize] = useState(16);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);

  const handleToolChange = (tool: Tool) => {
    console.log(tool);
    setTool(tool);
  };

  const toggleForeground = () => {
    console.log("toggleForeground");
    setShowForeground(!showForeground);
  };

  const toggleBackground = () => {
    console.log("toggleBackground");
    setShowBackground(!showBackground);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleExportToSVG = () => {
    const svg = canvasRef.current?.exportSVG();
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
    const pngData = canvasRef.current?.exportPNG();
    console.log(pngData);

    if (!pngData) return;
    // force a download
    const a = document.createElement("a");
    a.href = pngData as unknown as string;
    a.download = "react-pixel-art-canvas.png";
    a.click();
    a.remove();
  };

  // temp
  const img = new Image();
  img.src =
    "https://images.unsplash.com/photo-1604383393193-ce637a2f9c17?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
          ref={canvasRef}
          settings={{
            GRID_SIZE: gridSize,
            CANVAS_WIDTH: 896, //768 or 896 // canvas width should be divisible by GRID_SIZE(s)
            CANVAS_HEIGHT: 896,
          }}
          selectedColor={color}
          selectedTool={tool}
          backGroundCanvasSettings={{
            backgroundImage: img,
            backgroundOpacity: backgroundOpacity,
            backgroundVisible: showBackground,
          }}
          drawingCanvasSettings={{}}
          foregroundCanvasSettings={{
            foregroundVisible: showForeground,
            gridStrokeColor: "#d1d1d1",
          }}
        />
      </div>
    </>
  );
}

export default App;
