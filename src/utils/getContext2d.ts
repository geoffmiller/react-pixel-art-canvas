import { RefObject } from "react";

export const getContext2d = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  return canvas?.getContext("2d", { willReadFrequently: true });
};
