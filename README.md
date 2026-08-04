# 我的小岛 (chen-site)

一个放照片、灵感与离线小工具的个人角落。纸感清新风格（米白 + 珊瑚 + 衬线大标题），两个页面：首页 + 工具箱。

**在线地址：https://tatsuhiroc.github.io/chen-site/**

## 页面

- `index.html` 首页：玻璃质感 hero 文案 + 岛屿主视觉照片 + 工具箱入口
- `toolbox.html` 工具箱：两个可离线运行的小工具（Fend 离线计算器、光学文件传输），工具数据由 `app.js` 渲染

## 修改工具

编辑 `app.js` 顶部的 `tools` 数组：名称、简介、线上地址（`liveUrl`）、源码地址（`repoUrl`）都在这里改。

## 替换主视觉图片

把图片存为 `assets/scan-islands.jpg`（横图，建议至少 1600×1100），页面自动裁切适配。无需改代码。

## 本地运行

纯静态，无构建：

```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## 部署

`main` 分支为源码，`gh-pages` 分支为部署产物（GitHub Pages）：

```bash
git worktree add /tmp/chen-gh gh-pages
cp -r index.html toolbox.html styles.css app.js assets .nojekyll /tmp/chen-gh/
# commit + push gh-pages
```

## 技术

原生 HTML / CSS / JavaScript，零运行时依赖。Google Fonts（Playfair Display + DM Mono + Manrope）按需加载。
