/**
 * Client-side corporate headshot background remover & 3x2 grid splitter.
 * Converts uploaded photos into transparent PNG cutouts without a background.
 */

export async function removeBackgroundFromImageElement(
  img: HTMLImageElement,
  cropRect?: { sx: number; sy: number; sw: number; sh: number },
  tolerance: number = 38
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return img.src;

  const sx = cropRect ? cropRect.sx : 0;
  const sy = cropRect ? cropRect.sy : 0;
  const sw = cropRect ? cropRect.sw : img.naturalWidth || img.width;
  const sh = cropRect ? cropRect.sh : img.naturalHeight || img.height;

  // Target output size for crisp performance
  const maxDim = 720;
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Sample top-left and top-right corners to detect background color
  let tlR = 0, tlG = 0, tlB = 0, trR = 0, trG = 0, trB = 0, count = 0;
  const sampleBox = Math.max(4, Math.min(16, Math.floor(width * 0.05)));
  for (let y = 0; y < sampleBox; y++) {
    for (let x = 0; x < sampleBox; x++) {
      const iL = (y * width + x) * 4;
      tlR += data[iL];
      tlG += data[iL + 1];
      tlB += data[iL + 2];

      const iR = (y * width + (width - 1 - x)) * 4;
      trR += data[iR];
      trG += data[iR + 1];
      trB += data[iR + 2];
      count++;
    }
  }
  tlR /= count;
  tlG /= count;
  tlB /= count;
  trR /= count;
  trG /= count;
  trB /= count;

  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qStart = 0;
  let qEnd = 0;

  function isBg(idx: number, x: number, y: number): boolean {
    const p = idx * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Pure white check
    if (r >= 242 && g >= 242 && b >= 240) {
      return true;
    }

    // Interpolated studio backdrop check
    const t = x / Math.max(1, width - 1);
    const refR = tlR * (1 - t) + trR * t;
    const refG = tlG * (1 - t) + trG * t;
    const refB = tlB * (1 - t) + trB * t;

    const dr = r - refR;
    const dg = g - refG;
    const db = b - refB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const spread = maxC - minC;

    // Protect central face area
    const nx = (x - width * 0.5) / (width * 0.12);
    const ny = (y - height * 0.28) / (height * 0.14);
    if (nx * nx + ny * ny <= 1.0) {
      return false;
    }

    return dist < tolerance && spread < 42 && r > 115;
  }

  function trySeed(x: number, y: number) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    if (isBg(idx, x, y)) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(1, y);
    trySeed(width - 1, y);
    trySeed(width - 2, y);
  }

  while (qStart < qEnd) {
    const curr = queue[qStart++];
    const cx = curr % width;
    const cy = (curr / width) | 0;

    const cp = curr * 4;
    const cr = data[cp];
    const cg = data[cp + 1];
    const cb = data[cp + 2];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx]) {
          const np = nidx * 4;
          const step =
            Math.abs(data[np] - cr) +
            Math.abs(data[np + 1] - cg) +
            Math.abs(data[np + 2] - cb);
          if (step < 32 && isBg(nidx, nx, ny)) {
            visited[nidx] = 1;
            queue[qEnd++] = nidx;
          }
        }
      }
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  // Soft edge feathering
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (!visited[idx]) {
        let bgN = 0;
        if (visited[idx - 1]) bgN++;
        if (visited[idx + 1]) bgN++;
        if (visited[idx - width]) bgN++;
        if (visited[idx + width]) bgN++;
        if (bgN >= 2) {
          data[idx * 4 + 3] = 140;
        } else if (bgN === 1) {
          data[idx * 4 + 3] = 210;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const webpDataUrl = canvas.toDataURL('image/webp', 0.92);
  if (webpDataUrl.startsWith('data:image/webp')) {
    return webpDataUrl;
  }
  return canvas.toDataURL('image/png');
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processSingleHeadshotFile(
  file: File,
  removeBg: boolean = true
): Promise<string> {
  const img = await loadImageFromFile(file);
  if (!removeBg) {
    return img.src;
  }
  return removeBackgroundFromImageElement(img);
}

/**
 * Splits a 3x2 grid image (3 columns, 2 rows of employee portraits) into 6 individual
 * transparent-background corporate headshots.
 */
export async function splitGridImageIntoSixCutouts(
  file: File,
  removeBg: boolean = true
): Promise<string[]> {
  const img = await loadImageFromFile(file);
  const totalW = img.naturalWidth || img.width;
  const totalH = img.naturalHeight || img.height;

  const cols = 3;
  const rows = 2;
  const cellW = Math.floor(totalW / cols);
  const cellH = Math.floor(totalH / rows);

  const results: string[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Slight horizontal inset (2%) to avoid any grid seam lines
      const padX = Math.floor(cellW * 0.015);
      const padY = Math.floor(cellH * 0.01);
      const sx = col * cellW + padX;
      const sy = row * cellH + padY;
      const sw = cellW - padX * 2;
      const sh = cellH - padY;

      if (removeBg) {
        const cutoutUrl = await removeBackgroundFromImageElement(
          img,
          { sx, sy, sw, sh },
          40
        );
        results.push(cutoutUrl);
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          const webpUrl = canvas.toDataURL('image/webp', 0.92);
          results.push(
            webpUrl.startsWith('data:image/webp')
              ? webpUrl
              : canvas.toDataURL('image/png')
          );
        }
      }
    }
  }

  return results;
}
