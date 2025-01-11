import { useState } from "react";

// hook to manage canvas history as png base64 strings
// pngs are ~10x smaller than the raw canvas.data Uint8UnclampedArray
export const useCanvasHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (imageData: string) => {
    setHistory((prev) => [...prev, imageData]);
  };

  const undoHistory = () => {
    if (history.length === 0) return null;

    if (history.length === 1) {
      setHistory([]);
      return null;
    }
    // get second to last state so we dont have
    // to worry about setStates async nature
    const previousState = history[history.length - 2];
    setHistory((prev) => prev.slice(0, -1));

    // return the previous state so a "handleUndo" action
    // can use it to `ctx.drawImage(previousState)` to the canvas
    return previousState;
  };

  return {
    addToHistory,
    undoHistory,
  };
};
