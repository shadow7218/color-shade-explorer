/**
 * Image Color Picker — upload image and pick colors by tapping
 */

document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const imageCanvas = document.getElementById('imageCanvas');
  const imageSection = document.getElementById('imagePreviewSection');
  const pickedSection = document.getElementById('pickedColorSection');

  if (!imageInput || !imageCanvas) return;

  const ctx = imageCanvas.getContext('2d');

  // ===== Upload Image =====
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image too large. Max 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas size (limit max dimension for performance)
        let w = img.width;
        let h = img.height;
        const maxDim = 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = (h / w) * maxDim;
            w = maxDim;
          } else {
            w = (w / h) * maxDim;
            h = maxDim;
          }
        }
        imageCanvas.width = Math.round(w);
        imageCanvas.height = Math.round(h);
        ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

        imageSection.hidden = false;
        pickedSection.hidden = true;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // ===== Pick Color from Image =====
  function pickColor(x, y) {
    const rect = imageCanvas.getBoundingClientRect();
    const scaleX = imageCanvas.width / rect.width;
    const scaleY = imageCanvas.height / rect.height;
    const canvasX = Math.round((x - rect.left) * scaleX);
    const canvasY = Math.round((y - rect.top) * scaleY);

    if (canvasX < 0 || canvasY < 0 || canvasX >= imageCanvas.width || canvasY >= imageCanvas.height) return;

    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const name = getColorName(hex);
    const shades = generateShades(hex);

    // Update UI
    const swatch = document.getElementById('pickedSwatch');
    swatch.style.background = hex;

    document.getElementById('pickedHex').textContent = formatHex(hex);
    document.getElementById('pickedRgb').textContent = formatRgb(r, g, b);
    document.getElementById('pickedHsl').textContent = formatHsl(hsl.h, hsl.s, hsl.l);
    document.getElementById('pickedColorName').textContent = name;

    // Update variants
    const variantsGrid = document.getElementById('pickedVariants');
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

    pickedSection.hidden = false;
  }

  // Click/Tap on image
  imageCanvas.addEventListener('click', (e) => {
    pickColor(e.clientX, e.clientY);
  });

  imageCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    pickColor(touch.clientX, touch.clientY);
  });

  // ===== Copy buttons =====
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const text = document.getElementById(targetId).textContent;
      copyToClipboard(text, 'Copied');
      btn.classList.add('copied');
      btn.textContent = '✓';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'Copy';
      }, 1500);
    });
  });
});
