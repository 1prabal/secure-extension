// Simple PNG generator for extension icons
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createShieldPNG(size) {
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.44;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = (x - cx) / (width * 0.44);
      const dy = (y - cy) / (height * 0.44);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded shield/circle
      if (dist <= 1.0) {
        // Gradient from cyan (#00d2ff) to purple (#3a7bd5)
        const factor = (y / height);
        const red = Math.floor(10 + factor * 20);
        const green = Math.floor(180 - factor * 80);
        const blue = Math.floor(255 - factor * 40);

        // Draw inner lock / shield emblem
        const inShieldX = Math.abs(x - cx) / (width * 0.28);
        const inShieldY = (y - (cy - height * 0.05)) / (height * 0.35);

        // Check if inside inner shield shape
        const isShield = inShieldX <= 1.0 && inShieldY >= -0.7 && inShieldY <= (1.0 - inShieldX * 0.5);

        if (isShield && (inShieldX > 0.8 || inShieldY < -0.55 || (inShieldY > 0.6 - inShieldX * 0.5))) {
          // Shield border (white / bright cyan)
          buffer[idx] = 255;
          buffer[idx + 1] = 255;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else if (dist > 0.92) {
          // Outer subtle rim
          buffer[idx] = 200;
          buffer[idx + 1] = 240;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else {
          buffer[idx] = red;
          buffer[idx + 1] = green;
          buffer[idx + 2] = blue;
          buffer[idx + 3] = 255;
        }
      } else {
        // Transparent outside
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
      }
    }
  }

  return encodePNG(width, height, buffer);
}

function encodePNG(width, height, rgbaBuffer) {
  // Raw scanlines with filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // Filter None
    rgbaBuffer.copy(rawData, y * scanlineLength + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.alloc(4 + len);
  chunk.copy(crcTarget, 0, 4, 8 + len);
  const crc = crc32(crcTarget);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 implementation
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const pngBuf = createShieldPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), pngBuf);
  console.log(`Generated icon${size}.png (${pngBuf.length} bytes)`);
});
