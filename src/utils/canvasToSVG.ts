export const canvasToSVG = (
  canvas: HTMLCanvasElement,
  gridSize: number
): string => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const pixelSize = canvas.width / gridSize;
  const pixels: string[] = [];

  // Scan the canvas and create SVG rectangles for non-empty pixels
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const imageData = ctx.getImageData(
        x * pixelSize,
        y * pixelSize,
        1,
        1
      ).data;

      // Skip transparent pixels
      if (imageData[3] === 0) continue;

      const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
      pixels.push(
        `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`
      );
    }
  }

  // Create the SVG document
  return `
    <svg
      viewBox="0 0 ${gridSize} ${gridSize}"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${pixels.join("\n      ")}
    </svg>
  `.trim();
};
