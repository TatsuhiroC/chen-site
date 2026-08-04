// 小陈的网站 — 随机图片 + 从图片取色的光影 + 中英双语
"use strict";

// ---------- 安全存储 ----------
// 隐私模式（Safari 无痕、部分 webview）下 localStorage 会抛异常，
// 不处理会让整个脚本挂掉（按钮失灵）。用内存 fallback 兜底。
const makeStore = (kind) => {
  const mem = {};
  try {
    const k = "chen-site-t";
    window[kind].setItem(k, "1");
    window[kind].removeItem(k);
    return {
      get: (key) => window[kind].getItem(key),
      set: (key, val) => window[kind].setItem(key, val),
    };
  } catch {
    return { get: (key) => (key in mem ? mem[key] : null), set: (key, val) => { mem[key] = val; } };
  }
};
const store = makeStore("localStorage");
const sstore = makeStore("sessionStorage");

// ---------- i18n ----------
const I18N = {
  zh: {
    "site.title": "小陈的网站",
    "site.desc": "小陈的网站 — 一个收集了小工具的个人主页",
    "site.name": "小陈的网站",
    "hero.alt": "今日图片",
    "tools.title": "工具箱",
    "tool.tx.name": "光码互传",
    "tool.tx.desc": "扫码直接传文件",
    "tool.fend.name": "fend 计算器",
    "tool.fend.desc": "离线可用的计算器",
    "footer": "© 2026 小陈 · 每次打开都是不一样的风景",
    "lang.aria": "切换语言",
    langLabel: "EN",
  },
  en: {
    "site.title": "Chen's Site",
    "site.desc": "Chen's Site — a personal hub for small tools",
    "site.name": "Chen's Site",
    "hero.alt": "Photo of the day",
    "tools.title": "TOOLS",
    "tool.tx.name": "Optical Transfer",
    "tool.tx.desc": "Send files via QR codes",
    "tool.fend.name": "fend Calculator",
    "tool.fend.desc": "Offline calculator PWA",
    "footer": "© 2026 Chen · A different view every visit",
    "lang.aria": "Switch language",
    langLabel: "中文",
  },
};
const WEEK_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const WEEK_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let lang = store.get("chen-site-lang") ||
  (navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
}

// 应用到所有 data-i18n / data-i18n-attr 元素 + 文档级文案
function applyI18n() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = t("site.title");
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", t("site.desc"));
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of el.dataset.i18nAttr.split(";")) {
      const [attr, key] = pair.split(":");
      el.setAttribute(attr, t(key));
    }
  }
  const btn = $("lang-btn");
  if (btn) {
    btn.textContent = I18N[lang].langLabel;
    btn.setAttribute("aria-label", t("lang.aria"));
  }
  renderDate(new Date());
}

function switchLang() {
  lang = lang === "zh" ? "en" : "zh";
  store.set("chen-site-lang", lang);
  applyI18n();
}

// ---------- 图片与光影 ----------
// 单一主题（近黑 aurora-glass），图片每天随机换一张，光影跟随图片取色
const IMAGES = ["assets/img/aurora-1.svg", "assets/img/aurora-2.svg"];

const $ = (id) => document.getElementById(id);

// 每次打开都不同：也尽量避免与上次相同（sessionStorage 记忆）
function randomImage() {
  const last = sstore.get("chen-site-last-img");
  let pick = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  if (IMAGES.length > 1 && pick === last) pick = IMAGES[(IMAGES.indexOf(pick) + 1) % IMAGES.length];
  sstore.set("chen-site-last-img", pick);
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
  // 保持色相，把平均亮度归一化到亮部（深色图的光影也要是明亮的 accent 色）
  const avg = (r + g + b) / 3;
  const scale = 200 / Math.max(avg, 1);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const R = clamp(r * scale);
  const G = clamp(g * scale);
  const B = clamp(b * scale);
  return {
    glow: `rgba(${R}, ${G}, ${B}, 0.5)`,
    shadow: `rgba(${Math.round(R * 0.7)}, ${Math.round(G * 0.7)}, ${Math.round(B * 0.7)}, 0.3)`,
    accent: `rgb(${R}, ${G}, ${B})`,
    hex: "#" + [R, G, B].map((v) => v.toString(16).padStart(2, "0")).join(""),
  };
}

async function initTheme() {
  const src = randomImage();
  const img = $("hero-img");
  img.src = src;
  // 图片加载完成后，把光影/光斑色换成图片自己的颜色
  try {
    const col = await sampleImage(src);
    const s = document.body.style;
    s.setProperty("--glow", col.glow);
    s.setProperty("--shadow", col.shadow);
    s.setProperty("--accent", col.accent);
    s.setProperty("--aurora-a", col.glow);
    s.setProperty("--aurora-b", col.glow);
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", col.hex);
  } catch {
    // 取色失败（如网络问题）时保留默认 aurora 光影
  }
}

// ---------- 时钟 ----------
function renderDate(now) {
  const pad = (n) => String(n).padStart(2, "0");
  $("clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (lang === "zh") {
    $("date").textContent =
      `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · 星期${WEEK_ZH[now.getDay()]}`;
  } else {
    $("date").textContent =
      `${WEEK_EN[now.getDay()]}, ${MONTH_EN[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  $("big-clock").textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function tick() {
  renderDate(new Date());
}

// ---------- 启动 ----------
$("lang-btn").addEventListener("click", switchLang);
applyI18n();
initTheme();
tick();
setInterval(tick, 1000);
