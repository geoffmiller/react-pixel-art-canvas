// reseach https://shaneosullivan.wordpress.com/2023/05/23/instant-colour-fill-with-html-canvas/ for performance improvements
export const canvasFloodFill = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: string,
  pixelSize: number
) => {
  console.log("Starting flood fill:", { startX, startY, fillColor, pixelSize });

  // Align start coordinates to pixel grid
  startX = Math.floor(startX / pixelSize) * pixelSize;
  startY = Math.floor(startY / pixelSize) * pixelSize;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Get target color from the aligned position
  const targetPos = (startY * width + startX) * 4;
  const targetR = pixels[targetPos];
  const targetG = pixels[targetPos + 1];
  const targetB = pixels[targetPos + 2];
  const targetA = pixels[targetPos + 3];

  console.log("Target color:", {
    targetR,
    targetG,
    targetB,
    targetA,
    targetPos,
  });

  // Get fill color components
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.fillStyle = fillColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const fillData = tempCtx.getImageData(0, 0, 1, 1).data;
  const fillR = fillData[0];
  const fillG = fillData[1];
  const fillB = fillData[2];
  const fillA = fillData[3];

  console.log("Fill color:", {
    fillR,
    fillG,
    fillB,
    fillA,
    originalFillColor: fillColor,
  });

  // Don't fill if colors are the same
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return;
  }

  const stack = [[startX, startY]];
  const visited = new Set<string>();

  while (stack.length) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;

    if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }

    const pos = (y * width + x) * 4;

    if (
      pixels[pos] === targetR &&
      pixels[pos + 1] === targetG &&
      pixels[pos + 2] === targetB &&
      pixels[pos + 3] === targetA
    ) {
      // Fill entire pixel square
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, pixelSize, pixelSize);

      visited.add(key);

      // Add adjacent pixels using pixelSize
      stack.push(
        [x + pixelSize, y],
        [x - pixelSize, y],
        [x, y + pixelSize],
        [x, y - pixelSize]
      );
    }
  }

  // Get the final state after using fillRect
  const finalImageData = ctx.getImageData(0, 0, width, height);
  ctx.putImageData(finalImageData, 0, 0);

  console.log("Flood fill complete:", {
    visitedPixels: visited.size,
    pixelSize,
    startCoords: { startX, startY },
  });
};
