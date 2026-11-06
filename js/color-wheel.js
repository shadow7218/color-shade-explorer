/**
 * Color Wheel — interactive color picker
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('colorWheel');
  const cursor = document.getElementById('wheelCursor');
  const brightnessSlider = document.getElementById('brightnessSlider');
  const saturationSlider = document.getElementById('saturationSlider');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2 - 4;

  let currentHue = 239;
  let currentSat = 100;
  let currentBright = 100;

  // ===== Draw Color Wheel =====
  function drawWheel() {
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const color = hslToHex(angle, currentSat, currentBright);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  drawWheel();

  // ===== Get Color from Position =====
  function getColorFromPos(x, y) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    const dx = canvasX - center;
    const dy = canvasY - center;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius) return null;

    let hue = Math.atan2(dx, -dy) * 180 / Math.PI;
    if (hue < 0) hue += 360;

    currentHue = Math.round(hue);
    updateColor();

    // Update cursor
    cursor.style.left = (x - rect.left) + 'px';
    cursor.style.top = (y - rect.top) + 'px';
    cursor.style.display = 'block';

    return hue;
  }

  // ===== Update Display =====
  function updateColor() {
    const sat = parseInt(saturationSlider.value);
    const bright = parseInt(brightnessSlider.value);
    currentSat = sat;
    currentBright = bright;

    const hex = hslToHex(currentHue, sat, bright);
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const name = getColorName(hex);
    const shades = generateShades(hex);

    // Update preview
    const swatch = document.getElementById('previewSwatch');
    swatch.style.background = hex;

    document.getElementById('hexValue').textContent = formatHex(hex);
    document.getElementById('rgbValue').textContent = formatRgb(rgb.r, rgb.g, rgb.b);
    document.getElementById('hslValue').textContent = formatHsl(hsl.h, hsl.s, hsl.l);
    document.getElementById('colorName').textContent = name;

    // Update variants
    const variantsGrid = document.getElementById('shadeVariants');
    variantsGrid.innerHTML = '';
    shades.forEach(shade => {
      const s = document.createElement('div');
      s.className = 'variant-swatch';
      s.style.background = shade;
      s.title = formatHex(shade);
      s.addEventListener('click', () => {
        copyToClipboard(formatHex(shade), 'HEX');
        const srgb = hexToRgb(shade);
        copyToClipboard(formatRgb(srgb.r, srgb.g, srgb.b), 'RGB');
      });
      variantsGrid.appendChild(s);
    });

    // Redraw with new brightness/saturation
    redrawWheel();
  }

  function redrawWheel() {
    ctx.clearRect(0, 0, size, size);
    drawWheel();
  }

  // ===== Event Listeners =====
  let isDragging = false;

  canvas.addEventListener('mousedown', (e) => { getColorFromPos(e.clientX, e.clientY); isDragging = true; });
  canvas.addEventListener('mousemove', (e) => { if (isDragging) getColorFromPos(e.clientX, e.clientY); });
  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; cursor.style.display = 'none'; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    getColorFromPos(touch.clientX, touch.clientY);
    isDragging = true;
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging) {
      const touch = e.touches[0];
      getColorFromPos(touch.clientX, touch.clientY);
    }
  });
  canvas.addEventListener('touchend', () => { isDragging = false; cursor.style.display = 'none'; });

  brightnessSlider.addEventListener('input', updateColor);
  saturationSlider.addEventListener('input', updateColor);

  // ===== Init =====
  updateColor();
});
