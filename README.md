# Alpha status - expect breaking changes

Demo [https://stackblitz.com/edit/react-pixel-art-canvas](https://stackblitz.com/edit/react-pixel-art-canvas?file=src%2FApp.tsx)

<img src="https://raw.githubusercontent.com/geoffmiller/react-pixel-art-canvas/refs/heads/main/docs/demo_screenshot.png">

# React Pixel Art Canvas

Demo [https://stackblitz.com/edit/react-pixel-art-canvas](https://stackblitz.com/edit/react-pixel-art-canvas?file=src%2FApp.tsx)

A simple, customizable, and headless pixel art canvas component for React applications.

## Installation

```bash
npm install react-pixel-art-canvas
# or
yarn add react-pixel-art-canvas
```

## Basic Concept

This is a "as headless as possible" HTML Canvas pixel art creator React component. It was originally embedded into an app I was building but I wanted something less tied to a particular UI/CSS/Component framework so I abstracted it out into it's own thing. It's very much built for my current usecase but I figured it might work for someone else too (or at least have some copy/pastable bits).

#### It's composed of 3 canvas elements all stacked up as "layers"

`background | drawing | foreground`

**background** - is used to add background images that you want to "trace" or reference. It can be toggled on/off.

**drawing** - this is were all the actually drawing happens. Cannot be toggled on/off. Has an optional history for undo functionality.

**foreground** - this is where we create a grid based on the pixel size set/selected. It can be toggled on/off

## Usage

See [demo/src/App.tsx](./demo/src/App.tsx) for a working example

```tsx
import { useRef } from "react";
import {
  ReactPixelArtCanvas,
  BackgroundCanvas,
  DrawingCanvas,
  ForegroundCanvas
} from "react-pixel-art-canvas";
import type { CanvasRef, Tool } from "react-pixel-art-canvas";

function App() {
  // Canvas setup - this could be stored in state
  // canvas width/height should be divisible by GRID_SIZE(s)
  const GRID_SIZE = 16;
  const CANVAS_SIZE = {
    width: 896,
    height: 896,
  };
  // This will give you a direct React.ref to each canvas type
  const drawingCanvasRef = useRef<CanvasRef>(null);
  const backgroundCanvasRef = useRef<CanvasRef>(null);
  const foregroundCanvasRef = useRef<CanvasRef>(null);

  // All canvasRefs share a common interafce (CanvasRef)
  // type CanvasRef = {
  //   clearCanvas: () => void;
  //   exportSVG: () => string | undefined;
  //   exportPNG: () => string | undefined;
  //   undoHistory: () => void; // only available for the drawing canvas
  //   canvas: HTMLCanvasElement | null;
  // };

  // Example of using the CanvasRef actions
  const handleClear = () => {
    drawingCanvasRef.current.clearCanvas();
  }

  const handleExportToSVG = () => {
    drawingCanvasRef.current.exportSVG();
  }

  const handleExportPNG = () => {
    drawingCanvasRef.current.exportPNG;
  }

  const handleUndo = () => {
    // history must be set to `true` in the DrawingCanvas props for undo functionality
    drawingCanvasRef.current.undoHistory();
  }

  const drawingCanvasCtx = drawingCanvasRef.current.canvas.getContext("2d");
  // use any Canvas API methods
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
  drawingCanvasCtx.putImage(...)

  // Use the Canvas components with your desired settings
  // Feel free to only use one or some of the child Canvas components
  return (
    <>
      <ReactPixelArtCanvas
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        styles={{ border: "1px solid #ccc" }}
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
          history={true} // defaults to `false`
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
    </>
  );
}
```

## Online Demo

Online Demo [https://stackblitz.com/edit/react-pixel-art-canvas](https://stackblitz.com/edit/react-pixel-art-canvas?file=src%2FApp.tsx)

## Running the Demo Locally

_Demo created with the default Vite React-TS template_ `npm create vite@latest my-app -- --template react-ts`

To run the demo application locally:

1. Clone the repository

```bash
git clone https://github.com/geoffmiller/react-pixel-art-canvas.git
cd react-pixel-art-canvas
```

2. Change to the demo directoy

```bash
cd demo
```

3. Start the demo app

```bash
npm install
npm start
```

The demo will be available at http://localhost:5173

It's "unstyled" in the sense that I did not modify the default CSS that ships with the Vite react-ts template

## TODO

- ~~Add undo/history~~
- Fix undo with "clear" canvas state. History breaks after a sencond undo action if a clear action happened.
- Add a max history size setting (each history state item is ~30kb).
- Write tests.
- Work on responsive design.
- Decide if the image importer/cropper/alignment code should live in here.
- Research [better flood fill algorithm performance](https://shaneosullivan.wordpress.com/2023/05/23/instant-colour-fill-with-html-canvas/) (plenty fast as is).
