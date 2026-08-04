// 小陈的网站 — 随机图片 + 从图片取色的光影
"use strict";

// 主题只决定页面背景氛围；光影（光晕/投影/强调色）跟随图片本身的颜色
const THEMES = {
  dawn:   { images: ["assets/img/dawn-1.svg",   "assets/img/dawn-2.svg"] },
  sunset: { images: ["assets/img/sunset-1.svg", "assets/img/sunset-2.svg"] },
  forest: { images: ["assets/img/forest-1.svg", "assets/img/forest-2.svg"] },
};
const THEME_ORDER = Object.keys(THEMES);

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];
const $ = (id) => document.getElementById(id);

// 主题选择：?theme=xx 固定（便于预览），否则随机
function pickTheme() {
  const wanted = new URLSearchParams(location.search).get("theme");
  if (wanted && THEMES[wanted]) return wanted;
  return THEME_ORDER[Math.floor(Math.random() * THEME_ORDER.length)];
}

// 每次打开都不同：也尽量避免与上次相同（sessionStorage 记忆）
function randomImage(themeId) {
  const imgs = THEMES[themeId].images;
  const last = sessionStorage.getItem("chen-site-last-img");
  let pick = imgs[Math.floor(Math.random() * imgs.length)];
  if (imgs.length > 1 && pick === last) pick = imgs[(imgs.indexOf(pick) + 1) % imgs.length];
  sessionStorage.setItem("chen-site-last-img", pick);
  return pick;
}

// 从图片采样主色：只平均有彩度的像素，再提饱和得到光影色
async function sampleImage(src) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = 48;
  c.height = 27;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, 48, 27);
  const d = ctx.getImageData(0, 0, 48, 27).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) {
    const rr = d[i], gg = d[i + 1], bb = d[i + 2];
    if (Math.max(rr, gg, bb) - Math.min(rr, gg, bb) > 24) { // 只取有彩度的像素
      r += rr; g += gg; b += bb; n++;
    }
  }
  if (!n) { r = d[0]; g = d[1]; b = d[2]; n = 1; }
  r /= n; g /= n; b /= n;
  const avg = (r + g + b) / 3;
  const boost = (v) => Math.round(v + (v - avg) * 0.9); // 向饱和方向拉伸
  const R = Math.max(0, Math.min(255, boost(r)));
  const G = Math.max(0, Math.min(255, boost(g)));
  const B = Math.max(0, Math.min(255, boost(b)));
  return {
    glow: `rgba(${R}, ${G}, ${B}, 0.5)`,
    shadow: `rgba(${Math.round(R * 0.7)}, ${Math.round(G * 0.7)}, ${Math.round(B * 0.7)}, 0.3)`,
    accent: `rgb(${R}, ${G}, ${B})`,
    hex: "#" + [R, G, B].map((v) => v.toString(16).padStart(2, "0")).join(""),
  };
}

async function initTheme() {
  const themeId = pickTheme();
  document.body.dataset.theme = themeId;
  const src = randomImage(themeId);
  const img = $("hero-img");
  img.src = src;
  $("photo-tag").textContent = themeId;
  // 图片加载完成后，把光影色换成图片自己的颜色
  try {
    const col = await sampleImage(src);
    const s = document.body.style;
    s.setProperty("--glow", col.glow);
    s.setProperty("--shadow", col.shadow);
    s.setProperty("--accent", col.accent);
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", col.hex);
  } catch {
    // 取色失败（如网络问题）时保留主题默认光影
  }
}

// 时钟：顶部 HH:MM，主卡日期 + 完整时间
function tick() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  $("clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $("date").textContent =
    `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · 星期${WEEK[now.getDay()]}`;
  $("big-clock").textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

initTheme();
tick();
setInterval(tick, 1000);
