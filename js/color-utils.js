/**
 * Color Utilities — HEX, RGB, HSL conversions and color naming
 */

// ===== Named CSS Colors (approximate) =====
const NAMED_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Orange', hex: '#FF7F00' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Lime Green', hex: '#00FF00' },
  { name: 'Spring Green', hex: '#00FF7F' },
  { name: 'Green', hex: '#008000' },
  { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Violet', hex: '#8F00FF' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Fuchsia', hex: '#FF007F' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Sienna', hex: '#A0522D' },
  { name: 'Tomato', hex: '#FF6347' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Peach', hex: '#FFCBA4' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Honeydew', hex: '#F0FFF0' },
  { name: 'Mint', hex: '#98FF98' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Dodger Blue', hex: '#1E90FF' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Slate Blue', hex: '#6A5ACD' },
  { name: 'Medium Slate Blue', hex: '#7B68EE' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Snow', hex: '#FFFAFA' },
  { name: 'Honeydew', hex: '#F0FFF0' },
  { name: 'Azure', hex: '#F0FFFF' },
  { name: 'Alice Blue', hex: '#F0F8FF' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Seashell', hex: '#FFF5EE' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Khaki', hex: '#F0E68C' },
  { name: 'Pale Goldenrod', hex: '#EEE8AA' },
  { name: 'Light Yellow', hex: '#FFFFE0' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Dark Gray', hex: '#A9A9A9' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Dim Gray', hex: '#696969' },
  { name: 'Light Black', hex: '#525252' },
  { name: 'Black', hex: '#000000' },
];

// ===== Conversion Functions =====

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ===== Color Naming =====

function getColorName(hex) {
  const rgb = hexToRgb(hex);
  let minDist = Infinity;
  let closestName = 'Unknown';

  for (const color of NAMED_COLORS) {
    const cRgb = hexToRgb(color.hex);
    const dist = Math.sqrt(
      Math.pow(rgb.r - cRgb.r, 2) +
      Math.pow(rgb.g - cRgb.g, 2) +
      Math.pow(rgb.b - cRgb.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closestName = color.name;
    }
  }
  return closestName;
}

// ===== Shade Generation =====

function generateShades(hex, count = 8) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = [];

  for (let i = 0; i < count; i++) {
    const newL = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(count / 2)) * 10));
    const newS = Math.max(20, Math.min(100, hsl.s - 10));
    const shadeHex = hslToHex(hsl.h, newS, newL);
    shades.push(shadeHex);
  }
  return shades;
}

// ===== Format Helpers =====

function formatHex(hex) {
  return hex.toUpperCase();
}

function formatRgb(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

function formatHsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}
