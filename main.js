// 小陈的网站 — 每次打开随机主题 + 随机图片
"use strict";

// 主题定义：图片与光影共用同一色系
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

function initTheme() {
  const themeId = pickTheme();
  document.body.dataset.theme = themeId;
  const img = $("hero-img");
  img.src = randomImage(themeId);
  $("photo-tag").textContent = themeId;
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", getComputedStyle(document.body).getPropertyValue("--bg-1").trim());
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
