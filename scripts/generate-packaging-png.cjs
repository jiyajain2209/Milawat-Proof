const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// Ensure output directories exist
const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Read font buffers
const devaFontBuffer = fs.readFileSync('/tmp/NotoDeva-Bold.ttf');
const latinBoldBuffer = fs.readFileSync('/tmp/NotoSans-Bold.ttf');
const latinRegBuffer = fs.readFileSync('/tmp/NotoSans-Regular.ttf');

const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient (Studio Light Grey) -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FAF9F7" />
      <stop offset="60%" stop-color="#EBEAE5" />
      <stop offset="100%" stop-color="#D8D6CE" />
    </radialGradient>

    <!-- Ground Contact Shadow -->
    <filter id="blurShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="36" />
    </filter>

    <!-- Box Face Gradients -->
    <linearGradient id="topFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#F7F6F2" />
      <stop offset="100%" stop-color="#EAE8E2" />
    </linearGradient>

    <linearGradient id="leftFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E0D8" />
      <stop offset="80%" stop-color="#ECEAE4" />
      <stop offset="100%" stop-color="#F2F0EB" />
    </linearGradient>

    <linearGradient id="frontFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#FAFAF8" />
      <stop offset="100%" stop-color="#F0EFEA" />
    </linearGradient>

    <linearGradient id="edgeGleam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Studio Background -->
  <rect width="1024" height="1024" fill="url(#bgGrad)" />

  <!-- 1. Ambient & Ground Drop Shadows -->
  <g opacity="0.45" filter="url(#softShadow)">
    <ellipse cx="520" cy="890" rx="340" ry="55" fill="#141814" />
  </g>
  <g opacity="0.55" filter="url(#blurShadow)">
    <!-- Tight contact shadow right under the box base vertices: (180,830) -> (270,925) -> (835,890) -->
    <polygon points="175,830 270,928 840,892 780,940 260,945 160,845" fill="#0C100C" />
  </g>

  <!-- 2. TOP PANEL -->
  <polygon points="180,105 470,82 840,140 270,172" fill="url(#topFaceGrad)" stroke="#D8D6CE" stroke-width="1.5" stroke-linejoin="round" />
  
  <!-- Top Flap Graphics (slight rotation & perspective) -->
  <g transform="translate(480, 126) rotate(-4) scale(0.65)">
    <text x="0" y="0" font-family="'Noto Sans Devanagari', sans-serif" font-size="28" font-weight="bold" fill="#141414" text-anchor="middle">मिलावट</text>
    <line x1="-50" y1="-9" x2="50" y2="-9" stroke="#D6432E" stroke-width="3.5" stroke-linecap="round" />
    <text x="0" y="24" font-family="'Noto Sans', sans-serif" font-size="24" font-weight="900" fill="#1C9A6C" text-anchor="middle" letter-spacing="0.05em">PROOF</text>
  </g>

  <!-- 3. LEFT SIDE SPINE PANEL -->
  <polygon points="180,105 270,172 270,925 180,830" fill="url(#leftFaceGrad)" stroke="#D8D6CE" stroke-width="1.5" stroke-linejoin="round" />

  <!-- Left Spine Features -->
  <!-- Skew: top slope is (172-105)/(270-180) = 67/90 ~ 36.6 deg -->
  <g transform="translate(188, 140) skewY(36.6) scale(0.85)">
    <!-- Feature 1: Shield -->
    <g transform="translate(10, 20)">
      <path d="M11,0 L20,4.5 L20,13.5 C20,19 11,24 11,24 C11,24 2,19 2,13.5 L2,4.5 Z" stroke="#333333" stroke-width="1.8" fill="none" />
      <path d="M7,12 L10,15 L16,8" stroke="#1C9A6C" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <text x="28" y="11" font-family="'Noto Sans', sans-serif" font-size="10" font-weight="800" fill="#333333" letter-spacing="0.05em">TEST.</text>
      <text x="28" y="21" font-family="'Noto Sans', sans-serif" font-size="10" font-weight="800" fill="#333333" letter-spacing="0.05em">DETECT.</text>
      <text x="28" y="31" font-family="'Noto Sans', sans-serif" font-size="10" font-weight="800" fill="#1C9A6C" letter-spacing="0.05em">PROTECT.</text>
    </g>

    <!-- Feature 2: Flask -->
    <g transform="translate(10, 80)">
      <path d="M8,0 L14,0 M11,0 L11,7 L19,20 C20,22 18,24 11,24 C4,24 2,22 3,20 L11,7" stroke="#333333" stroke-width="1.8" fill="none" stroke-linejoin="round" />
      <text x="28" y="12" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#333333" letter-spacing="0.04em">EASY TO USE</text>
      <text x="28" y="23" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#555555" letter-spacing="0.04em">AT HOME</text>
    </g>

    <!-- Feature 3: Safe & Non-Toxic -->
    <g transform="translate(10, 138)">
      <path d="M3,20 Q12,18 19,3 Q10,10 3,20 Z M7,17 Q12,12 15,8" stroke="#333333" stroke-width="1.8" fill="none" />
      <text x="28" y="12" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#333333" letter-spacing="0.04em">SAFE &amp;</text>
      <text x="28" y="23" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#555555" letter-spacing="0.04em">NON-TOXIC</text>
    </g>

    <!-- Feature 4: Trusted by families -->
    <g transform="translate(10, 196)">
      <circle cx="11" cy="11" r="10" stroke="#333333" stroke-width="1.8" fill="none" />
      <path d="M6,11 L10,15 L16,8" stroke="#1C9A6C" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <text x="28" y="12" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#333333" letter-spacing="0.04em">TRUSTED</text>
      <text x="28" y="23" font-family="'Noto Sans', sans-serif" font-size="9.5" font-weight="800" fill="#555555" letter-spacing="0.04em">BY FAMILIES</text>
    </g>

    <!-- Dimensions Box -->
    <g transform="translate(10, 260)">
      <rect x="0" y="0" width="80" height="30" rx="3" fill="#FFFFFF" stroke="#BEBCB4" stroke-width="1.2" />
      <text x="8" y="15" font-family="'Noto Sans', sans-serif" font-size="10" font-weight="800" fill="#333333">7x5x4 cm</text>
      <text x="8" y="25" font-family="'Noto Sans', sans-serif" font-size="8" font-weight="600" fill="#666666">(LxHxW)</text>
    </g>
  </g>

  <!-- 4. FRONT PANEL -->
  <polygon points="270,172 840,140 835,890 270,925" fill="url(#frontFaceGrad)" stroke="#D8D6CE" stroke-width="1.5" stroke-linejoin="round" />

  <!-- Corner Fold Highlight -->
  <line x1="270" y1="172" x2="270" y2="925" stroke="#FFFFFF" stroke-width="2.5" opacity="0.9" />

  <!-- FRONT PANEL ARTWORK -->
  <!-- Top front slope: (140-172)/(840-270) = -32/570 ~ -3.2 deg -->
  <g transform="translate(295, 175) skewY(-3.2) scale(0.96)">
    
    <!-- BRAND LOCKUP -->
    <g transform="translate(260, 95)">
      <!-- मिलावट -->
      <text x="0" y="0" font-family="'Noto Sans Devanagari', sans-serif" font-size="64" font-weight="bold" fill="#141414" text-anchor="middle">मिलावट</text>
      <!-- Red Strike -->
      <line x1="-120" y1="-20" x2="120" y2="-20" stroke="#D6432E" stroke-width="8" stroke-linecap="round" />
      
      <!-- PROOF -->
      <text x="0" y="65" font-family="'Noto Sans', sans-serif" font-size="68" font-weight="900" fill="#1C9A6C" text-anchor="middle" letter-spacing="0.04em">PROOF</text>
      
      <!-- TEST BEFORE YOU TASTE -->
      <text x="0" y="98" font-family="'Noto Sans', sans-serif" font-size="14.5" font-weight="700" fill="#606060" text-anchor="middle" letter-spacing="0.26em">TEST BEFORE YOU TASTE</text>
    </g>

    <!-- TITLE & SUBTITLE -->
    <g transform="translate(260, 248)">
      <text x="0" y="0" font-family="'Noto Sans', sans-serif" font-size="22" font-weight="800" fill="#141414" text-anchor="middle" letter-spacing="0.04em">HOME ADULTERATION TEST KIT</text>
      <text x="0" y="28" font-family="'Noto Sans', sans-serif" font-size="19" font-weight="600" fill="#303030" text-anchor="middle">For Milk, Paneer &amp; Ghee</text>
    </g>

    <!-- THREE CIRCLES (MILK, PANEER, GHEE) -->
    <g transform="translate(260, 345)">
      <!-- Circle 1: MILK -->
      <g transform="translate(-150, 0)">
        <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="#1C9A6C" stroke-width="2.5" />
        <!-- Bottle Icon -->
        <g transform="translate(0, -5)">
          <path d="M-6,-18 L6,-18 L6,-11 L12,-3 L12,20 L-12,20 L-12,-3 L-6,-11 Z" stroke="#1C9A6C" stroke-width="2.4" fill="none" stroke-linejoin="round" />
          <line x1="-7" y1="-18" x2="7" y2="-18" stroke="#1C9A6C" stroke-width="2.8" stroke-linecap="round" />
          <line x1="-8" y1="5" x2="8" y2="5" stroke="#1C9A6C" stroke-width="1.8" stroke-dasharray="3 2" />
        </g>
        <text x="0" y="62" font-family="'Noto Sans', sans-serif" font-size="13" font-weight="800" fill="#141414" text-anchor="middle" letter-spacing="0.06em">MILK</text>
      </g>

      <!-- Circle 2: PANEER -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="#1C9A6C" stroke-width="2.5" />
        <!-- Paneer 3D Cube Icon -->
        <g transform="translate(0, -3)">
          <!-- Top face -->
          <polygon points="0,-18 16,-9 0,0 -16,-9" stroke="#1C9A6C" stroke-width="2.2" fill="none" stroke-linejoin="round" />
          <!-- Left face -->
          <polygon points="-16,-9 0,0 0,16 -16,7" stroke="#1C9A6C" stroke-width="2.2" fill="none" stroke-linejoin="round" />
          <!-- Right face -->
          <polygon points="0,0 16,-9 16,7 0,16" stroke="#1C9A6C" stroke-width="2.2" fill="none" stroke-linejoin="round" />
          <!-- Texture dots -->
          <circle cx="-6" cy="7" r="1.2" fill="#1C9A6C" />
          <circle cx="-10" cy="2" r="1" fill="#1C9A6C" />
          <circle cx="6" cy="5" r="1.2" fill="#1C9A6C" />
          <circle cx="10" cy="1" r="1" fill="#1C9A6C" />
          <circle cx="0" cy="-9" r="1" fill="#1C9A6C" />
        </g>
        <text x="0" y="62" font-family="'Noto Sans', sans-serif" font-size="13" font-weight="800" fill="#141414" text-anchor="middle" letter-spacing="0.06em">PANEER</text>
      </g>

      <!-- Circle 3: GHEE -->
      <g transform="translate(150, 0)">
        <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="#1C9A6C" stroke-width="2.5" />
        <!-- Ghee Jar Icon -->
        <g transform="translate(0, -4)">
          <!-- Lid -->
          <rect x="-13" y="-18" width="26" height="5" rx="1.5" stroke="#1C9A6C" stroke-width="2" fill="none" />
          <!-- Jar body -->
          <path d="M-12,-13 L12,-13 C17,-13 18,-6 18,3 C18,14 15,18 11,18 L-11,18 C-15,18 -18,14 -18,3 C-18,-6 -17,-13 -12,-13 Z" stroke="#1C9A6C" stroke-width="2.2" fill="none" />
          <!-- Cow silhouette -->
          <path d="M-6,2 Q-4,0 0,0 Q4,0 6,3 L6,9 L4,9 L4,5 L-4,5 L-4,9 L-6,9 Z" fill="#1C9A6C" />
        </g>
        <text x="0" y="62" font-family="'Noto Sans', sans-serif" font-size="13" font-weight="800" fill="#141414" text-anchor="middle" letter-spacing="0.06em">GHEE</text>
      </g>
    </g>

    <!-- GREEN DIVIDER LINE -->
    <line x1="20" y1="440" x2="500" y2="440" stroke="#1C9A6C" stroke-width="2" />

    <!-- WHAT'S INSIDE (LEFT) + QR CODE (RIGHT) -->
    <g transform="translate(20, 465)">
      <!-- Left: Bullets -->
      <g>
        <text x="0" y="0" font-family="'Noto Sans', sans-serif" font-size="14.5" font-weight="800" fill="#1C9A6C" letter-spacing="0.05em">WHAT'S INSIDE:</text>
        
        <g transform="translate(0, 14)">
          <circle cx="4" cy="11" r="3.2" fill="#1C9A6C" />
          <text x="16" y="15" font-family="'Noto Sans', sans-serif" font-size="13.5" font-weight="600" fill="#303030">Test Reagents</text>

          <circle cx="4" cy="35" r="3.2" fill="#1C9A6C" />
          <text x="16" y="39" font-family="'Noto Sans', sans-serif" font-size="13.5" font-weight="600" fill="#303030">Testing Strips &amp; Accessories</text>

          <circle cx="4" cy="59" r="3.2" fill="#1C9A6C" />
          <text x="16" y="63" font-family="'Noto Sans', sans-serif" font-size="13.5" font-weight="600" fill="#303030">Easy-to-Follow Instructions</text>

          <circle cx="4" cy="83" r="3.2" fill="#1C9A6C" />
          <text x="16" y="87" font-family="'Noto Sans', sans-serif" font-size="13.5" font-weight="600" fill="#303030">Result Interpretation Guide</text>
        </g>
      </g>

      <!-- Right: QR Code & Scan Label -->
      <g transform="translate(375, -5)">
        <!-- White container -->
        <rect x="-4" y="-4" width="88" height="88" fill="#FFFFFF" stroke="#D0CECA" stroke-width="1.2" rx="2" />
        
        <!-- QR Code Visual -->
        <g transform="translate(4, 4)">
          <!-- Finder pattern top-left -->
          <rect x="0" y="0" width="22" height="22" fill="#141414" />
          <rect x="3" y="3" width="16" height="16" fill="#FFFFFF" />
          <rect x="6" y="6" width="10" height="10" fill="#141414" />

          <!-- Finder pattern top-right -->
          <rect x="48" y="0" width="22" height="22" fill="#141414" />
          <rect x="51" y="3" width="16" height="16" fill="#FFFFFF" />
          <rect x="54" y="6" width="10" height="10" fill="#141414" />

          <!-- Finder pattern bottom-left -->
          <rect x="0" y="48" width="22" height="22" fill="#141414" />
          <rect x="3" y="51" width="16" height="16" fill="#FFFFFF" />
          <rect x="6" y="54" width="10" height="10" fill="#141414" />

          <!-- QR Data Modules -->
          <rect x="26" y="3" width="6" height="6" fill="#141414" />
          <rect x="36" y="7" width="6" height="6" fill="#141414" />
          <rect x="26" y="15" width="6" height="6" fill="#141414" />
          <rect x="6" y="26" width="6" height="6" fill="#141414" />
          <rect x="16" y="26" width="6" height="6" fill="#141414" />
          <rect x="28" y="26" width="6" height="6" fill="#141414" />
          <rect x="38" y="26" width="8" height="6" fill="#141414" />
          <rect x="52" y="26" width="6" height="6" fill="#141414" />
          <rect x="62" y="28" width="6" height="6" fill="#141414" />
          <rect x="16" y="36" width="8" height="6" fill="#141414" />
          <rect x="30" y="36" width="6" height="6" fill="#141414" />
          <rect x="44" y="36" width="6" height="6" fill="#141414" />
          <rect x="60" y="38" width="6" height="6" fill="#141414" />
          <rect x="26" y="48" width="8" height="6" fill="#141414" />
          <rect x="38" y="48" width="6" height="6" fill="#141414" />
          <rect x="52" y="48" width="6" height="6" fill="#141414" />
          <rect x="62" y="52" width="6" height="6" fill="#141414" />
          <rect x="26" y="60" width="6" height="8" fill="#141414" />
          <rect x="36" y="60" width="8" height="6" fill="#141414" />
          <rect x="50" y="60" width="6" height="8" fill="#141414" />
          <rect x="62" y="64" width="6" height="6" fill="#141414" />
        </g>

        <!-- Scan for instructions label -->
        <text x="40" y="100" font-family="'Noto Sans', sans-serif" font-size="10.5" font-weight="800" fill="#303030" text-anchor="middle" letter-spacing="0.06em">SCAN FOR</text>
        <text x="40" y="113" font-family="'Noto Sans', sans-serif" font-size="10.5" font-weight="800" fill="#303030" text-anchor="middle" letter-spacing="0.06em">INSTRUCTIONS</text>
      </g>
    </g>

    <!-- BATCH NUMBER -->
    <g transform="translate(260, 650)">
      <text x="0" y="0" font-family="'Noto Sans', sans-serif" font-size="12.5" font-weight="700" fill="#333333" text-anchor="middle" letter-spacing="0.06em">BATCH NO.: MP2405-001</text>
    </g>

  </g>
</svg>
`;

// Render using Resvg with font buffers
const resvg = new Resvg(svgContent, {
  fitTo: {
    mode: 'width',
    value: 1024,
  },
  font: {
    fontBuffers: [devaFontBuffer, latinBoldBuffer, latinRegBuffer],
    defaultFontFamily: 'Noto Sans',
  },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

// Save to public files
const outPath1 = path.join(publicDir, 'image.png');
const outPath2 = path.join(publicDir, 'packaging-box.png');
const outPath3 = path.join(imagesDir, 'packaging-box.png');

fs.writeFileSync(outPath1, pngBuffer);
fs.writeFileSync(outPath2, pngBuffer);
fs.writeFileSync(outPath3, pngBuffer);

console.log('Successfully generated packaging photo:');
console.log(' - ' + outPath1 + ' (' + pngBuffer.length + ' bytes)');
console.log(' - ' + outPath2 + ' (' + pngBuffer.length + ' bytes)');
console.log(' - ' + outPath3 + ' (' + pngBuffer.length + ' bytes)');
