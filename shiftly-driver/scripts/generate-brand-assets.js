const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const OUT = path.join(__dirname, '..', 'assets');
const GREEN = [111, 143, 58, 255];
const GREEN_DARK = [79, 111, 36, 255];
const NAVY = [8, 20, 42, 255];
const WHITE = [255, 255, 255, 255];

function png(width, height, bg = [0, 0, 0, 0]) {
  const image = new PNG({ width, height });
  for (let i = 0; i < image.data.length; i += 4) {
    image.data[i] = bg[0];
    image.data[i + 1] = bg[1];
    image.data[i + 2] = bg[2];
    image.data[i + 3] = bg[3];
  }
  return image;
}

function blendPixel(image, x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) return;
  const i = (Math.floor(y) * image.width + Math.floor(x)) * 4;
  if (color[3] === 0) {
    image.data[i] = 0;
    image.data[i + 1] = 0;
    image.data[i + 2] = 0;
    image.data[i + 3] = 0;
    return;
  }
  const a = (color[3] / 255) * alpha;
  const ia = 1 - a;
  image.data[i] = Math.round(color[0] * a + image.data[i] * ia);
  image.data[i + 1] = Math.round(color[1] * a + image.data[i + 1] * ia);
  image.data[i + 2] = Math.round(color[2] * a + image.data[i + 2] * ia);
  image.data[i + 3] = Math.round(255 * (a + (image.data[i + 3] / 255) * ia));
}

function drawPolygon(image, points, color) {
  const minY = Math.max(0, Math.floor(Math.min(...points.map((p) => p[1]))));
  const maxY = Math.min(image.height - 1, Math.ceil(Math.max(...points.map((p) => p[1]))));
  for (let y = minY; y <= maxY; y += 1) {
    const xs = [];
    for (let i = 0; i < points.length; i += 1) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      if ((p1[1] <= y && p2[1] > y) || (p2[1] <= y && p1[1] > y)) {
        xs.push(p1[0] + ((y - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]));
      }
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i < xs.length; i += 2) {
      const x1 = Math.max(0, Math.floor(xs[i]));
      const x2 = Math.min(image.width - 1, Math.ceil(xs[i + 1]));
      for (let x = x1; x <= x2; x += 1) blendPixel(image, x, y, color);
    }
  }
}

function drawCircle(image, cx, cy, r, color) {
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(image.width - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(image.height - 1, Math.ceil(cy + r));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= r) blendPixel(image, x, y, color);
    }
  }
}

function drawRoundedRect(image, x, y, w, h, r, color) {
  for (let yy = Math.floor(y); yy <= Math.ceil(y + h); yy += 1) {
    for (let xx = Math.floor(x); xx <= Math.ceil(x + w); xx += 1) {
      const dx = Math.max(x - xx, 0, xx - (x + w));
      const dy = Math.max(y - yy, 0, yy - (y + h));
      const cornerX = xx < x + r ? x + r : xx > x + w - r ? x + w - r : xx;
      const cornerY = yy < y + r ? y + r : yy > y + h - r ? y + h - r : yy;
      if ((dx === 0 && dy === 0) || Math.hypot(xx - cornerX, yy - cornerY) <= r) {
        blendPixel(image, xx, yy, color);
      }
    }
  }
}

function drawLogoMark(image, x, y, w, withShadow = false, cutColor = [0, 0, 0, 0]) {
  const s = w / 1000;
  const p = (px, py) => [x + px * s, y + py * s];
  const c = (color) => color;
  const cut = cutColor;

  if (withShadow) {
    drawCircle(image, x + 520 * s, y + 340 * s, 330 * s, [111, 143, 58, 35]);
  }

  [[75, 145, 430, 130], [5, 235, 400, 110], [42, 336, 405, 112], [90, 444, 420, 95]].forEach(
    ([lx, ly, len, thick], index) => {
      drawPolygon(
        image,
        [p(lx, ly), p(lx + len, ly + 6), p(lx + len - 35, ly + thick * 0.45), p(lx + 60, ly + thick * 0.65)],
        c(index === 1 ? GREEN_DARK : GREEN),
      );
    },
  );

  drawRoundedRect(image, x + 315 * s, y + 130 * s, 440 * s, 112 * s, 58 * s, c(GREEN));
  drawCircle(image, x + 320 * s, y + 310 * s, 118 * s, c(GREEN));
  drawRoundedRect(image, x + 320 * s, y + 272 * s, 360 * s, 96 * s, 48 * s, c(GREEN));
  drawCircle(image, x + 635 * s, y + 430 * s, 120 * s, c(GREEN));
  drawRoundedRect(image, x + 260 * s, y + 438 * s, 380 * s, 108 * s, 54 * s, c(GREEN));

  drawPolygon(image, [p(520, 220), p(760, 220), p(705, 350), p(475, 350)], cut);
  drawPolygon(image, [p(225, 345), p(510, 352), p(458, 438), p(245, 430)], cut);
  drawPolygon(image, [p(645, 120), p(785, 120), p(720, 546), p(575, 546)], cut);

  drawPolygon(image, [p(730, 170), p(890, 170), p(950, 270), p(990, 390), p(980, 455), p(915, 455), p(910, 545), p(700, 545), p(742, 250)], c(GREEN));
  drawRoundedRect(image, x + 805 * s, y + 246 * s, 150 * s, 118 * s, 28 * s, cut);
  drawPolygon(image, [p(828, 260), p(925, 260), p(970, 370), p(940, 382), p(810, 356)], cut);
  drawRoundedRect(image, x + 925 * s, y + 430 * s, 74 * s, 20 * s, 8 * s, cut);
  drawRoundedRect(image, x + 915 * s, y + 468 * s, 74 * s, 20 * s, 8 * s, cut);
  drawRoundedRect(image, x + 905 * s, y + 506 * s, 74 * s, 20 * s, 8 * s, cut);
  drawPolygon(image, [p(768, 115), p(812, 115), p(905, 168), p(752, 168)], c(GREEN));

  drawPolygon(image, [p(200, 475), p(300, 475), p(258, 545), p(145, 545)], c(GREEN));
  drawPolygon(image, [p(445, 545), p(760, 545), p(735, 574), p(415, 574)], c(GREEN));

  [
    [310, 575, 70],
    [805, 575, 75],
  ].forEach(([cx, cy, r]) => {
    drawCircle(image, x + cx * s, y + cy * s, r * s, c(GREEN));
    drawCircle(image, x + cx * s, y + cy * s, r * 0.46 * s, cut);
  });
}

function downsample(source, scale) {
  const target = png(source.width / scale, source.height / scale);
  for (let y = 0; y < target.height; y += 1) {
    for (let x = 0; x < target.width; x += 1) {
      const sum = [0, 0, 0, 0];
      for (let yy = 0; yy < scale; yy += 1) {
        for (let xx = 0; xx < scale; xx += 1) {
          const si = ((y * scale + yy) * source.width + (x * scale + xx)) * 4;
          for (let k = 0; k < 4; k += 1) sum[k] += source.data[si + k];
        }
      }
      const ti = (y * target.width + x) * 4;
      for (let k = 0; k < 4; k += 1) target.data[ti + k] = Math.round(sum[k] / (scale * scale));
    }
  }
  return target;
}

function save(image, filename) {
  fs.writeFileSync(path.join(OUT, filename), PNG.sync.write(image));
}

function createMark() {
  const scale = 3;
  const image = png(1024 * scale, 720 * scale);
  drawLogoMark(image, 50 * scale, 42 * scale, 925 * scale);
  save(downsample(image, scale), 'logo-mark.png');
}

function createIcon() {
  const scale = 3;
  const image = png(1024 * scale, 1024 * scale, NAVY);
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const glow = Math.max(0, 1 - Math.hypot(x - image.width * 0.5, y - image.height * 0.36) / (image.width * 0.75));
      const i = (y * image.width + x) * 4;
      image.data[i] = Math.round(image.data[i] + glow * 6);
      image.data[i + 1] = Math.round(image.data[i + 1] + glow * 13);
      image.data[i + 2] = Math.round(image.data[i + 2] + glow * 22);
    }
  }
  drawLogoMark(image, 72 * scale, 205 * scale, 880 * scale, true, NAVY);
  save(downsample(image, scale), 'icon.png');
  save(downsample(image, scale), 'adaptive-icon.png');
}

function drawTextBars(image, x, y, w) {
  const s = w / 740;
  const letters = [
    [0, 0, 96, 34],
    [0, 70, 96, 34],
    [134, 0, 34, 104],
    [134, 42, 92, 30],
    [226, 0, 34, 104],
    [292, 0, 96, 34],
    [292, 42, 82, 30],
    [292, 70, 34, 34],
    [410, 0, 112, 34],
    [449, 0, 34, 104],
    [540, 0, 34, 104],
    [540, 70, 94, 34],
    [660, 0, 34, 50],
    [698, 0, 42, 34],
    [660, 54, 34, 50],
  ];
  letters.forEach(([lx, ly, lw, lh]) => {
    drawPolygon(image, [[x + lx * s, y + ly * s], [x + (lx + lw) * s, y + ly * s], [x + (lx + lw - 10) * s, y + (ly + lh) * s], [x + (lx - 10) * s, y + (ly + lh) * s]], WHITE);
  });
}

function createSplash() {
  const scale = 2;
  const image = png(1242 * scale, 2436 * scale, NAVY);
  drawLogoMark(image, 175 * scale, 650 * scale, 900 * scale, true, NAVY);
  drawTextBars(image, 250 * scale, 1380 * scale, 740 * scale);
  drawRoundedRect(image, 327 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 389 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 451 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 513 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 575 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 637 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 699 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 761 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 823 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  drawRoundedRect(image, 885 * scale, 1585 * scale, 24 * scale, 7 * scale, 3 * scale, GREEN);
  save(downsample(image, scale), 'splash.png');
}

fs.mkdirSync(OUT, { recursive: true });
createMark();
createIcon();
createSplash();
