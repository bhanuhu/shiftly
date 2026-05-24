const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const assetsDir = path.join(__dirname, '..', 'assets');
const sourcePath = path.join(assetsDir, 'shiftly-logo.png');

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function writePng(image, file) {
  fs.writeFileSync(path.join(assetsDir, file), PNG.sync.write(image));
}

function sample(source, x, y) {
  const sx = Math.max(0, Math.min(source.width - 1, Math.round(x)));
  const sy = Math.max(0, Math.min(source.height - 1, Math.round(y)));
  const i = (sy * source.width + sx) * 4;
  return [
    source.data[i],
    source.data[i + 1],
    source.data[i + 2],
    source.data[i + 3] ?? 255,
  ];
}

function resizeCrop(source, crop, width, height) {
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = crop.x + (x / Math.max(1, width - 1)) * crop.w;
      const sourceY = crop.y + (y / Math.max(1, height - 1)) * crop.h;
      const color = sample(source, sourceX, sourceY);
      const i = (y * width + x) * 4;
      out.data[i] = color[0];
      out.data[i + 1] = color[1];
      out.data[i + 2] = color[2];
      out.data[i + 3] = color[3];
    }
  }
  return out;
}

function createSplash(source) {
  const out = new PNG({ width: 1242, height: 2436 });
  const bg = sample(source, 24, 24);
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = bg[0];
    out.data[i + 1] = bg[1];
    out.data[i + 2] = bg[2];
    out.data[i + 3] = 255;
  }

  const logo = resizeCrop(source, { x: 185, y: 190, w: 880, h: 635 }, 900, 650);
  const startX = Math.floor((out.width - logo.width) / 2);
  const startY = 650;
  for (let y = 0; y < logo.height; y += 1) {
    for (let x = 0; x < logo.width; x += 1) {
      const si = (y * logo.width + x) * 4;
      const ti = ((startY + y) * out.width + (startX + x)) * 4;
      out.data[ti] = logo.data[si];
      out.data[ti + 1] = logo.data[si + 1];
      out.data[ti + 2] = logo.data[si + 2];
      out.data[ti + 3] = 255;
    }
  }
  return out;
}

const source = readPng(sourcePath);

writePng(
  resizeCrop(source, { x: 185, y: 190, w: 880, h: 635 }, 1024, 740),
  'shiftly-logo-main.png',
);
writePng(
  resizeCrop(source, { x: 78, y: 960, w: 240, h: 235 }, 1024, 1024),
  'icon.png',
);
writePng(
  resizeCrop(source, { x: 78, y: 960, w: 240, h: 235 }, 1024, 1024),
  'adaptive-icon.png',
);
writePng(createSplash(source), 'splash.png');
