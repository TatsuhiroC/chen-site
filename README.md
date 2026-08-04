# Chen's Site — Prismline Aurora Glass

个人主页 + 工具箱聚合站，采用深色极光玻璃拟态（aurora-glass）设计：近黑画布 + aqua/magenta 光斑 + 磨砂玻璃卡片。

**在线地址：https://tatsuhiroc.github.io/chen-site/**

## 特点

- **Prismline 式完整页面**：悬浮玻璃胶囊导航、双色渐变 Hero、浮动画布 mockup、功能网格、bento 展示、三档定价、CTA 横幅、五列页脚
- **玻璃拟态**：`backdrop-filter` 模糊 + 渐变半透明白 + 1px 发丝描边，永不实心
- **aurora 光场**：6 个模糊光斑（aqua/magenta/cyan）+ 56px 网格纹理 + 噪点覆盖
- **光影跟随图片**：mockup 画布每天随机一张极光占位图，canvas 采样主色驱动光斑颜色
- **中英双语**：右上角一键切换，全站文案与 meta 同步，选择持久化
- **工具箱**：光码互传、fend 计算器两个真实工具入口，代码中预留第 3、4 个位置

## 本地运行

纯静态站点，无构建步骤：

```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

生成占位图（可选，已内置在 `assets/img/`）：

```bash
node gen-svgs.mjs
```

## 结构

```
index.html   完整页面结构（导航 / hero / mockup / 功能 / 工具 / bento / 定价 / CTA / 页脚）
style.css    aurora-glass 全套组件（玻璃、双色渐变、渐变环、光斑、响应式断点）
main.js      中英 i18n、语言切换、随机画布图与光影取色
assets/img/  极光占位图（两张 SVG，换真图直接替换同名文件）
```

## 部署

`main` 分支为源码，`gh-pages` 分支为部署产物（GitHub Pages）。

```bash
git worktree add /tmp/chen-gh gh-pages
cp -r index.html style.css main.js assets .nojekyll /tmp/chen-gh/
# commit + push gh-pages
```

## 技术

原生 HTML / CSS / JavaScript，零运行时依赖。Google Fonts（Space Grotesk + Inter）按需加载，SVG 占位图 + canvas 取色 + `backdrop-filter` 玻璃效果。
