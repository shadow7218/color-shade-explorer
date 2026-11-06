/**
 * Main page — Color shades gallery and spectrum
 */

document.addEventListener('DOMContentLoaded', () => {
  generateShadesGrid();
  generateSpectrum();
  setActiveNavLink('index.html');
});

// ===== Popular Color Shades =====
const POPULAR_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#1DD1A1',
  '#5F27CD', '#01A3A4', '#F368E0', '#FF9FF3', '#54A0FF',
  '#5F27CD', '#01A3A4', '#FF6348', '#7BED9F', '#70A1FF',
  '#FFA502', '#2ED573', '#FF4757', '#1E90FF', '#FF6B81',
];

function generateShadesGrid() {
  const grid = document.getElementById('shades-grid');
  if (!grid) return;

  POPULAR_COLORS.forEach(color => {
    const card = document.createElement('div');
    card.className = 'shade-card';
    card.style.background = color;

    const rgb = hexToRgb(color);
    const label = document.createElement('span');
    label.className = 'shade-label';
    label.textContent = formatHex(color);

    card.appendChild(label);

    card.addEventListener('click', () => {
      copyToClipboard(formatHex(color), 'HEX');
      copyToClipboard(formatRgb(rgb.r, rgb.g, rgb.b), 'RGB');
    });

    grid.appendChild(card);
  });
}

// ===== Full Spectrum =====
function generateSpectrum() {
  const spectrum = document.getElementById('spectrum');
  if (!spectrum) return;

  for (let h = 0; h < 360; h += 3) {
    const hex = hslToHex(h, 80, 55);
    const cell = document.createElement('div');
    cell.className = 'spectrum-cell';
    cell.style.background = hex;

    cell.addEventListener('click', () => {
      const rgb = hexToRgb(hex);
      copyToClipboard(formatHex(hex), 'HEX');
      copyToClipboard(formatRgb(rgb.r, rgb.g, rgb.b), 'RGB');
    });

    spectrum.appendChild(cell);
  }
}

// ===== Active Nav Link =====
function setActiveNavLink(currentFile) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('active');
    }
  });
}

// ===== Copy to Clipboard =====
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied: ${text}`);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`${label} copied: ${text}`);
  });
}

// ===== Toast Notification =====
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--primary)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: '600',
    zIndex: '9999',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s',
    maxWidth: '90vw',
    textAlign: 'center',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
