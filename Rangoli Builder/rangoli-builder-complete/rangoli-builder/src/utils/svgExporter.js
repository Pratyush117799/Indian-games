// src/utils/svgExporter.js
import { GRID } from "./constants";

/**
 * Serialize the current canvas SVG to a downloadable file.
 * Adds a white/cream background and strips interaction attributes.
 */
export function exportCanvasSVG(filename = "rangoli.svg") {
  const svgEl = document.querySelector(".canvas-glow");
  if (!svgEl) return;

  // Clone so we don't mutate the live DOM
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  clone.removeAttribute("style");  // remove cursor:crosshair etc.

  const serializer = new XMLSerializer();
  let   svgString  = serializer.serializeToString(clone);

  // Ensure proper XML declaration
  if (!svgString.startsWith("<?xml")) {
    svgString = `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;
  }

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert SVG to PNG via canvas (for sharing / thumbnail generation).
 * Returns a data-URL string.
 */
export async function svgToPNG(svgEl, size = 600) {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgStr     = serializer.serializeToString(svgEl);
    const blob       = new Blob([svgStr], { type: "image/svg+xml" });
    const url        = URL.createObjectURL(blob);
    const img        = new Image();
    img.onload = () => {
      const canvas    = document.createElement("canvas");
      canvas.width    = size;
      canvas.height   = size;
      const ctx       = canvas.getContext("2d");
      ctx.fillStyle   = "#0F0A1E";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src     = url;
  });
}

/**
 * Build a compact tile-data JSON for saving to the backend.
 */
export function tilesToJSON(tiles, meta = {}) {
  return JSON.stringify({
    version: 1,
    meta,
    tiles: tiles.map(({ id, placedAt, ...rest }) => rest), // strip runtime fields
  });
}
