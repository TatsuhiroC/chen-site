// 小陈 — 深色 aurora-glass 页：中英双语 + 随机画布图 + 光影取色
"use strict";

// ---------- 安全存储 ----------
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
  en: {
    "site.title": "Chen's Site",
    "site.desc": "Chen's Site — a dark aurora-glass personal hub with tools.",
    "brand": "Chen",
    "nav.tools": "Tools",
    "nav.showcase": "Showcase",
    "hero.sub1": "Chen turns one prompt into a full glassmorphic marketing site:",
    "hero.sub2": "hero, bento grid, pricing, and all, rendered live on an infinite canvas.",
    "hero.sub3": "Real layouts, ready to ship.",
    "mockup.generate": "Generate",
    "mockup.export": "Export",
    "mockup.path": "Chen / canvas",
    "tools.badge": "MY TOOLS",
    "tools.title": "Made by me,",
    "tools.titleAccent": "free to use",
    "tool.tx.name": "Optical Transfer",
    "tool.tx.desc": "Send files between phones via QR codes, no upload needed.",
    "tool.tx.link": "Open the tool",
    "tool.fend.name": "fend Calculator",
    "tool.fend.desc": "A clean offline calculator PWA that works everywhere.",
    "tool.fend.link": "Open the tool",
    "bento.eyebrow": "Live canvas",
    "bento.desc": "Every layout is a living document. Edit a token, watch every glass panel across the page update in real time.",
    "bento.c1": "Frost, blur, and tint as design tokens",
    "bento.c2": "Duotone accents derived from one hue pair",
    "bento.c3": "One click from canvas to production",
    "bento.t1t": "Duotone aurora themes",
    "bento.t1d": "Pick a pair. Aqua to magenta, cyan to coral: every accent re-derives from it.",
    "footer.desc": "Glassmorphic sites, generated from a single prompt.",
    "footer.p1": "Product",
    "footer.p1c": "Tools",
    "footer.p1d": "Changelog",
    "footer.p2": "Library",
    "footer.p2a": "Landing pages",
    "footer.p2b": "Dashboards",
    "footer.p2c": "Marketing sites",
    "footer.p2d": "Aurora glass",
    "footer.copy": "© 2026 Chen",
    "footer.legal1": "Privacy",
    "footer.legal2": "Terms",
    "footer.status": "All systems normal",
    "lang.aria": "Switch language",
    langLabel: "中文",
  },
  zh: {
    "site.title": "小陈",
    "site.desc": "小陈的网站 — 深色极光玻璃个人主页与工具箱。",
    "brand": "小陈",
    "nav.tools": "工具",
    "nav.showcase": "展示",
    "hero.sub1": "小陈把一句提示词变成完整的玻璃拟态营销站：",
    "hero.sub2": "hero、bento 网格、定价，全都在无限画布上实时渲染。",
    "hero.sub3": "真实布局，拿来即用。",
    "mockup.generate": "生成",
    "mockup.export": "导出",
    "mockup.path": "小陈 / 画布",
    "tools.badge": "我的工具",
    "tools.title": "我做的，",
    "tools.titleAccent": "免费使用",
    "tool.tx.name": "光码互传",
    "tool.tx.desc": "手机之间用二维码传文件，无需上传。",
    "tool.tx.link": "打开工具",
    "tool.fend.name": "fend 计算器",
    "tool.fend.desc": "随处可用的清爽离线计算器 PWA。",
    "tool.fend.link": "打开工具",
    "bento.eyebrow": "实时画布",
    "bento.desc": "每个布局都是活文档。改一个令牌，全页的玻璃面板同步更新。",
    "bento.c1": "模糊、半透明、色调都是设计令牌",
    "bento.c2": "双色强调色从一对色相推导",
    "bento.c3": "从画布到上线只需一键",
    "bento.t1t": "双色极光主题",
    "bento.t1d": "选一对颜色。青到品红、青到珊瑚，所有强调色都由它派生。",
    "footer.desc": "一句提示词，生成玻璃拟态网站。",
    "footer.p1": "产品",
    "footer.p1c": "工具",
    "footer.p1d": "更新日志",
    "footer.p2": "提示词库",
    "footer.p2a": "落地页",
    "footer.p2b": "仪表盘",
    "footer.p2c": "营销站",
    "footer.p2d": "极光玻璃",
    "footer.copy": "© 2026 小陈",
    "footer.legal1": "隐私",
    "footer.legal2": "条款",
    "footer.status": "一切系统正常",
    "lang.aria": "切换语言",
    langLabel: "EN",
  },
};

// 默认中文；用户切换后持久化
let lang = store.get("chen-site-lang") || "zh";

const $ = (id) => document.getElementById(id);

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

// 应用到所有 data-i18n 元素（每个文案单元都是独立节点，无嵌套）
function applyI18n() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = t("site.title");
  document.querySelector('meta[name="description"]').setAttribute("content", t("site.desc"));
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  const btn = $("lang-btn");
  if (btn) {
    btn.textContent = I18N[lang].langLabel;
    btn.setAttribute("aria-label", t("lang.aria"));
  }
}

function switchLang() {
  lang = lang === "zh" ? "en" : "zh";
  store.set("chen-site-lang", lang);
  applyI18n();
}

// ---------- 随机画布图 + 光影取色 ----------
const IMAGES = ["assets/img/aurora-1.svg", "assets/img/aurora-2.svg"];

function randomImage() {
  const last = sstore.get("chen-site-last-img");
  let pick = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  if (IMAGES.length > 1 && pick === last) pick = IMAGES[(IMAGES.indexOf(pick) + 1) % IMAGES.length];
  sstore.set("chen-site-last-img", pick);
  return pick;
}

// 从图片采样主色：保持色相，亮度归一化到亮部（深色图光影也明亮）
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
    if (Math.max(rr, gg, bb) - Math.min(rr, gg, bb) > 24) {
      r += rr; g += gg; b += bb; n++;
    }
  }
  if (!n) { r = d[0]; g = d[1]; b = d[2]; n = 1; }
  r /= n; g /= n; b /= n;
  const avg = (r + g + b) / 3;
  const scale = 200 / Math.max(avg, 1);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const R = clamp(r * scale);
  const G = clamp(g * scale);
  const B = clamp(b * scale);
  return {
    glow: `rgba(${R}, ${G}, ${B}, 0.5)`,
    accent: `rgb(${R}, ${G}, ${B})`,
    hex: "#" + [R, G, B].map((v) => v.toString(16).padStart(2, "0")).join(""),
  };
}

async function initCanvasPhoto() {
  const src = randomImage();
  const img = $("canvas-img");
  if (!img) return;
  img.src = src;
  try {
    const col = await sampleImage(src);
    const s = document.body.style;
    s.setProperty("--aurora-a", col.glow);
    s.setProperty("--aurora-b", col.glow);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", col.hex);
  } catch {
    // 取色失败时保留默认 aurora 光斑
  }
}

// ---------- 启动 ----------
$("lang-btn").addEventListener("click", switchLang);
applyI18n();
initCanvasPhoto();
