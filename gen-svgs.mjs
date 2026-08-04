// 生成占位图：深色 aurora 系 x 2 张（aqua 主导 / magenta 主导），1600x900 (16:9)
import { writeFileSync, mkdirSync } from "node:fs";

const V = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs><filter id="b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="70"/></filter></defs>${inner}</svg>`;

const scenes = {
  // aqua 主导：深底 + aqua/cyan 光斑 + 暗山 + 高光带
  "aurora-1": `
<rect width="1600" height="900" fill="#0b0f14"/>
<circle cx="1150" cy="220" r="260" fill="#2dd4bf" filter="url(#b)" opacity="0.5"/>
<circle cx="420" cy="680" r="300" fill="#22d3ee" filter="url(#b)" opacity="0.32"/>
<circle cx="150" cy="180" r="180" fill="#5eead4" filter="url(#b)" opacity="0.28"/>
<path d="M0 560 L260 340 L520 560 L800 400 L1100 600 L1360 460 L1600 580 L1600 900 L0 900 Z" fill="#131c28"/>
<path d="M0 680 L320 480 L640 680 L980 540 L1300 700 L1600 600 L1600 900 L0 900 Z" fill="#0e1520"/>
<path d="M0 780 L420 600 L820 790 L1220 660 L1600 800 L1600 900 L0 900 Z" fill="#0a101a"/>
<ellipse cx="800" cy="640" rx="900" ry="70" fill="#2dd4bf" opacity="0.08" filter="url(#b)"/>
<path d="M0 560 Q400 520 800 540 T1600 540 L1600 560 L0 560 Z" fill="#5eead4" opacity="0.16"/>`,
  // magenta 主导：深底 + magenta/pink 光斑 + 极光带
  "aurora-2": `
<rect width="1600" height="900" fill="#0b0f14"/>
<circle cx="430" cy="240" r="280" fill="#e879f9" filter="url(#b)" opacity="0.42"/>
<circle cx="1240" cy="620" r="320" fill="#c084fc" filter="url(#b)" opacity="0.28"/>
<circle cx="900" cy="140" r="200" fill="#f0abfc" filter="url(#b)" opacity="0.22"/>
<path d="M-100 480 Q300 380 700 500 T1700 460 L1700 900 L-100 900 Z" fill="#1c1428"/>
<path d="M-100 620 Q400 520 900 640 T1700 600 L1700 900 L-100 900 Z" fill="#140e1e"/>
<path d="M-100 760 Q500 680 1100 780 T1700 740 L1700 900 L-100 900 Z" fill="#0e0a16"/>
<path d="M-100 420 Q400 340 900 460 T1700 420" fill="none" stroke="#e879f9" stroke-width="26" opacity="0.14" filter="url(#b)"/>
<ellipse cx="800" cy="660" rx="900" ry="70" fill="#e879f9" opacity="0.08" filter="url(#b)"/>`,
};

mkdirSync("assets/img", { recursive: true });
for (const [file, inner] of Object.entries(scenes)) {
  const svg = V(inner);
  writeFileSync(`assets/img/${file}.svg`, svg);
  console.log("wrote", `assets/img/${file}.svg`, svg.length, "bytes");
}
