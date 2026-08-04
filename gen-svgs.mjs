// 生成占位图：3 主题 x 2 张，每张 1600x900 (16:9)
import { writeFileSync, mkdirSync } from "node:fs";

const V = (inner, w = 1600, h = 900) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
<defs><filter id="b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="60"/></filter></defs>${inner}</svg>`;

const T = {
  dawn: {
    sky: ["#e3eaf8", "#c9d6f2"],
    far: "#b9c9ec", mid: "#97aee0", near: "#7c93cd",
    glow: "rgba(255,255,255,0.9)",
  },
  sunset: {
    sky: ["#fde6d4", "#f3c9a4"],
    far: "#f2bd8f", mid: "#df9a68", near: "#c47f52",
    glow: "rgba(255,244,214,0.95)",
  },
  forest: {
    sky: ["#e2efe4", "#c3dccb"],
    far: "#aecdb8", mid: "#8cb49b", near: "#6d9a82",
    glow: "rgba(255,255,255,0.9)",
  },
};

const out = {};
for (const [name, c] of Object.entries(T)) {
  const [g1, g2] = c.sky;
  // 1: 山峦 + 雾
  out[`${name}-1`] = V(`
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/>
  </linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="1" stop-color="#000000" stop-opacity="0.06"/>
  </linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<circle cx="1180" cy="240" r="150" fill="${c.glow}" filter="url(#b)" opacity="0.7"/>
<circle cx="1180" cy="240" r="52" fill="#ffffff" opacity="0.85"/>
<path d="M0 560 L260 320 L520 560 L800 380 L1100 600 L1360 430 L1600 560 L1600 900 L0 900 Z" fill="${c.far}"/>
<path d="M0 660 L300 440 L620 660 L980 500 L1300 680 L1600 560 L1600 900 L0 900 Z" fill="${c.mid}"/>
<path d="M0 760 L420 560 L820 770 L1220 620 L1600 780 L1600 900 L0 900 Z" fill="${c.near}"/>
<ellipse cx="800" cy="640" rx="900" ry="90" fill="#ffffff" opacity="0.35" filter="url(#b)"/>
<rect width="1600" height="900" fill="url(#shade)"/>`);

  // 2: 波浪 + 光
  out[`${name}-2`] = V(`
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/>
  </linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#000000" stop-opacity="0.05"/>
  </linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<circle cx="420" cy="280" r="170" fill="${c.glow}" filter="url(#b)" opacity="0.75"/>
<circle cx="420" cy="280" r="58" fill="#ffffff" opacity="0.9"/>
<path d="M0 520 Q200 440 400 520 T800 520 T1200 520 T1600 520 L1600 900 L0 900 Z" fill="${c.far}"/>
<path d="M0 640 Q200 560 400 640 T800 640 T1200 640 T1600 640 L1600 900 L0 900 Z" fill="${c.mid}"/>
<path d="M0 760 Q200 680 400 760 T800 760 T1200 760 T1600 760 L1600 900 L0 900 Z" fill="${c.near}"/>
<ellipse cx="800" cy="640" rx="760" ry="40" fill="#ffffff" opacity="0.2" filter="url(#b)"/>
<rect width="1600" height="900" fill="url(#shade)"/>`);
}

mkdirSync("assets/img", { recursive: true });
for (const [file, svg] of Object.entries(out)) {
  writeFileSync(`assets/img/${file}.svg`, svg);
  console.log("wrote", `assets/img/${file}.svg`, svg.length, "bytes");
}
