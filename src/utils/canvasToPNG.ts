export const canvasToPNG = (
  canvas: HTMLCanvasElement,
  gridSize: number,
  filename?: string
) => {
  const OUTPUT_SIZE = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const sourceData = imageData.data;
  const pixelSize = canvas.width / gridSize;

  const pngCanvas = document.createElement("canvas");
  pngCanvas.width = OUTPUT_SIZE;
  pngCanvas.height = OUTPUT_SIZE;
  const pngCtx = pngCanvas.getContext("2d");
  if (!pngCtx) return;

  const outputPixelSize = OUTPUT_SIZE / gridSize;

  // Clear the canvas with a transparent background
  pngCtx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  // Draw each pixel scaled up
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const sourceX = Math.floor(x * pixelSize);
      const sourceY = Math.floor(y * pixelSize);
      const sourceIndex = (sourceY * canvas.width + sourceX) * 4;

      pngCtx.fillStyle = `rgba(${sourceData[sourceIndex]}, 
                               ${sourceData[sourceIndex + 1]}, 
                               ${sourceData[sourceIndex + 2]}, 
                               ${sourceData[sourceIndex + 3] / 255})`;

      pngCtx.fillRect(
        x * outputPixelSize,
        y * outputPixelSize,
        outputPixelSize,
        outputPixelSize
      );
    }
  }

  const pngData = pngCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = pngData;
  a.download = filename || "drawing.png";
  a.click();
};
