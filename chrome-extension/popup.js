// Tab switching
document.getElementById('toolTabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('tool-' + tab.dataset.tool).classList.add('active');
});

// Copy helper
function copyOutput(id) {
  const el = document.getElementById(id);
  if (el.value) {
    navigator.clipboard.writeText(el.value);
    showTemporary(el, 'Copied!');
  }
}

function showTemporary(nearEl, msg) {
  const panel = nearEl.closest('.tool-panel');
  const status = panel?.querySelector('.status');
  if (status) {
    status.textContent = msg;
    status.className = 'status success';
    setTimeout(() => { status.textContent = ''; status.className = 'status'; }, 1500);
  }
}

// === JSON Formatter ===
function formatJSON() {
  const input = document.getElementById('json-input').value;
  const status = document.getElementById('json-status');
  try {
    const parsed = JSON.parse(input);
    document.getElementById('json-output').value = JSON.stringify(parsed, null, 2);
    status.textContent = 'Valid JSON';
    status.className = 'status success';
  } catch (e) {
    status.textContent = 'Invalid JSON: ' + e.message;
    status.className = 'status error';
  }
}

function minifyJSON() {
  const input = document.getElementById('json-input').value;
  const status = document.getElementById('json-status');
  try {
    document.getElementById('json-output').value = JSON.stringify(JSON.parse(input));
    status.textContent = 'Minified';
    status.className = 'status success';
  } catch (e) {
    status.textContent = 'Invalid JSON: ' + e.message;
    status.className = 'status error';
  }
}

// === Base64 ===
function base64Encode() {
  const input = document.getElementById('base64-input').value;
  try {
    document.getElementById('base64-output').value = btoa(unescape(encodeURIComponent(input)));
    setStatus('base64-status', 'Encoded', 'success');
  } catch (e) {
    setStatus('base64-status', 'Error: ' + e.message, 'error');
  }
}

function base64Decode() {
  const input = document.getElementById('base64-input').value;
  try {
    document.getElementById('base64-output').value = decodeURIComponent(escape(atob(input.trim())));
    setStatus('base64-status', 'Decoded', 'success');
  } catch (e) {
    setStatus('base64-status', 'Invalid Base64', 'error');
  }
}

// === URL Encode/Decode ===
function urlEncode() {
  const input = document.getElementById('url-input').value;
  document.getElementById('url-output').value = encodeURIComponent(input);
  setStatus('url-status', 'Encoded', 'success');
}

function urlDecode() {
  const input = document.getElementById('url-input').value;
  try {
    document.getElementById('url-output').value = decodeURIComponent(input);
    setStatus('url-status', 'Decoded', 'success');
  } catch (e) {
    setStatus('url-status', 'Invalid encoded string', 'error');
  }
}

// === UUID Generator ===
function generateUUID() {
  document.getElementById('uuid-output').value = crypto.randomUUID();
}

function generateBulkUUID() {
  const uuids = Array.from({ length: 5 }, () => crypto.randomUUID());
  document.getElementById('uuid-output').value = uuids.join('\n');
}

// === Hash Generator ===
async function generateHash(algo) {
  const input = document.getElementById('hash-input').value;
  if (!input) return;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('hash-output').value = algo + ':\n' + hashHex;
}

// === JWT Decoder ===
function decodeJWT() {
  const input = document.getElementById('jwt-input').value.trim();
  const status = document.getElementById('jwt-status');
  const parts = input.split('.');
  if (parts.length !== 3) {
    status.textContent = 'Invalid JWT: expected 3 parts, got ' + parts.length;
    status.className = 'status error';
    return;
  }
  try {
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    let result = '=== HEADER ===\n' + JSON.stringify(header, null, 2);
    result += '\n\n=== PAYLOAD ===\n' + JSON.stringify(payload, null, 2);
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const isExpired = expDate < new Date();
      result += '\n\n=== EXPIRATION ===\n' + expDate.toISOString();
      result += isExpired ? ' (EXPIRED)' : ' (valid)';
    }
    if (payload.iat) {
      result += '\nIssued: ' + new Date(payload.iat * 1000).toISOString();
    }
    document.getElementById('jwt-output').value = result;
    status.textContent = 'Decoded successfully';
    status.className = 'status success';
  } catch (e) {
    status.textContent = 'Failed to decode: ' + e.message;
    status.className = 'status error';
  }
}

// === Color Converter ===
function colorFromPicker() {
  document.getElementById('color-input').value = document.getElementById('color-picker').value;
  convertColor();
}

function convertColor() {
  const input = document.getElementById('color-input').value.trim();
  let r, g, b;

  // Try hex
  const hexMatch = input.match(/^#?([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  // Try rgb()
  if (r === undefined) {
    const rgbMatch = input.match(/rgb\w?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1]);
      g = parseInt(rgbMatch[2]);
      b = parseInt(rgbMatch[3]);
    }
  }

  if (r === undefined) {
    document.getElementById('color-output').value = 'Could not parse color. Try #hex or rgb(r,g,b)';
    return;
  }

  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  const hsl = rgbToHsl(r, g, b);

  document.getElementById('color-preview').style.background = hex;
  document.getElementById('color-picker').value = hex;
  document.getElementById('color-output').value =
    `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// === Timestamp Converter ===
function tsNow() {
  document.getElementById('ts-input').value = Math.floor(Date.now() / 1000);
  convertTimestamp();
}

function convertTimestamp() {
  const input = document.getElementById('ts-input').value.trim();
  if (!input) return;

  let result = '';
  const num = Number(input);

  if (!isNaN(num)) {
    // Unix timestamp (seconds or milliseconds)
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    result = `Unix: ${Math.floor(ms / 1000)}\nUnix (ms): ${ms}\n`;
    result += `ISO 8601: ${date.toISOString()}\n`;
    result += `Local: ${date.toLocaleString()}\n`;
    result += `UTC: ${date.toUTCString()}`;
  } else {
    // Try parsing date string
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      document.getElementById('ts-output').value = 'Could not parse date/timestamp';
      return;
    }
    result = `Unix: ${Math.floor(date.getTime() / 1000)}\nUnix (ms): ${date.getTime()}\n`;
    result += `ISO 8601: ${date.toISOString()}\n`;
    result += `Local: ${date.toLocaleString()}\n`;
    result += `UTC: ${date.toUTCString()}`;
  }

  document.getElementById('ts-output').value = result;
}

// === Text Case Converter ===
function toCase(type) {
  const input = document.getElementById('tc-input').value;
  let result = '';
  switch (type) {
    case 'upper': result = input.toUpperCase(); break;
    case 'lower': result = input.toLowerCase(); break;
    case 'title': result = input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()); break;
    case 'sentence': result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()); break;
    case 'camel': result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
    case 'snake': result = input.replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9_]/g, ''); break;
  }
  document.getElementById('tc-output').value = result;
}

// === Lorem Ipsum Generator ===
const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
  'Nulla facilisi morbi tempus iaculis urna id volutpat lacus.',
  'Viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor.',
  'Eget nulla facilisi etiam dignissim diam quis enim lobortis.',
  'Amet consectetur adipiscing elit pellentesque habitant morbi tristique.',
  'Turpis egestas integer eget aliquet nibh praesent tristique magna.',
  'Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.',
  'Faucibus scelerisque eleifend donec pretium vulputate sapien nec.',
  'Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
  'Arcu dictum varius duis at consectetur lorem donec massa sapien.',
  'Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium.',
];

function generateLorem() {
  const count = parseInt(document.getElementById('lorem-count').value) || 3;
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = 3 + Math.floor(Math.random() * 4);
    const sentences = [];
    for (let j = 0; j < sentenceCount; j++) {
      sentences.push(LOREM_SENTENCES[Math.floor(Math.random() * LOREM_SENTENCES.length)]);
    }
    paragraphs.push(sentences.join(' '));
  }
  document.getElementById('lorem-output').value = paragraphs.join('\n\n');
}

// Helper
function setStatus(id, msg, type) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.className = 'status ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'status'; }, 3000);
  }
}
