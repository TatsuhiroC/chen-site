# 小陈的网站 (chen-site)

个人主页 + 工具箱聚合站。把散落的小工具收进一个链接，分享给朋友就能直接用。

**在线地址：https://tatsuhiroc.github.io/chen-site/**

## 特点

- **每次打开都不一样**：随机主题（晨雾 / 日落 / 森林三种氛围）+ 随机图片
- **光影跟随图片**：用 canvas 采样图片主色，光晕、投影、强调色自动匹配当天的图片配色，换图即换气质
- **玻璃拟态**：半透明白 + `backdrop-filter` 模糊 + 白色描边 + 柔和投影，清新通透
- **实时时钟**：顶栏时分 + 主卡日期与秒级时间
- **中英双语**：右上角一键切换，日期格式同步本地化，选择持久化
- **工具箱**：目前两个工具（光码互传、fend 计算器），代码中已预留第 3、4 个位置，复制一张卡片即可扩展

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
index.html   页面结构（工具卡片、语言切换、i18n 属性）
style.css    三套主题变量（--bg/--ink/--glass…）+ 玻璃与光影样式
main.js      随机主题与图片、canvas 取色、时钟、中英切换
assets/img/  占位图（每主题两张 SVG，换真图直接替换同名文件）
```

## 部署

`main` 分支为源码，`gh-pages` 分支为部署产物（GitHub Pages）。

```bash
npm run build  # 本仓库无构建，此步即 git add/commit/push
git worktree add /tmp/chen-gh gh-pages
cp -r index.html style.css main.js assets .nojekyll /tmp/chen-gh/
# commit + push gh-pages
```

## 技术

原生 HTML / CSS / JavaScript，零依赖。SVG 占位图 + canvas 取色 + `backdrop-filter` 玻璃效果。
