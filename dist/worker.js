
// Deterministic PRNG to replace Math.random for mathematical noise generation
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
const sysRand = mulberry32(1337);
// worker.js

// Perlin noise configuration and implementation
const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;
let perlin_octaves = 4;
let perlin_amp_falloff = 0.5;
let perlin = null;

function noise(x, y, z) {
  y = y || 0;
  z = z || 0;
  if (perlin == null) {
    perlin = new Float32Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = sysRand();
    }
  }
  let xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  let xf = x - xi, yf = y - yi, zf = z - zi;
  let rxf, ryf;
  let r = 0;
  let ampl = 0.5;
  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
    rxf = 0.5 * (1.0 - Math.cos(xf * Math.PI));
    ryf = 0.5 * (1.0 - Math.cos(yf * Math.PI));
    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);
    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);
    n1 += 0.5 * (1.0 - Math.cos(zf * Math.PI)) * (n2 - n1);
    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1; xf *= 2;
    yi <<= 1; yf *= 2;
    zi <<= 1; zf *= 2;
    if (xf >= 1.0) { xi++; xf--; }
    if (yf >= 1.0) { yi++; yf--; }
    if (zf >= 1.0) { zi++; zf--; }
  }
  return r;
}

self.onmessage = function(e) {
  const { width, height, zOff, inc, scenario } = e.data;
  const size = width * height * 4;
  const pixels = new Uint8ClampedArray(size);

  let xOff = 0;
  for (let x = 0; x < width; x++) {
    let yOff = 0;
    for (let y = 0; y < height; y++) {
      let index = (x + y * width) * 4;

      let n = noise(xOff, yOff, zOff);
      let colorVal = Math.floor(n * 255);

      if (scenario === 'pest' && x > width*0.4 && x < width*0.6 && y > height*0.3 && y < height*0.5) {
           colorVal = Math.floor(noise(xOff*5, yOff*5, zOff*2) * 255) + 50;
      }
      if (scenario === 'drought') {
          colorVal = Math.max(0, colorVal - 40);
      }

      pixels[index + 0] = colorVal; // R
      pixels[index + 1] = colorVal; // G
      pixels[index + 2] = colorVal; // B
      pixels[index + 3] = 255; // Alpha

      yOff += inc;
    }
    xOff += inc;
  }

  self.postMessage({ pixels, width, height }, [pixels.buffer]);
};
