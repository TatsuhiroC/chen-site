# 我的小岛 (chen-site)

小陈的个人项目入口。保留海岛图片、雾绿与珊瑚配色，将 Fend Offline 和 Optical Transfer 直接展示在同一个首页。

**在线地址：https://tatsuhiroc.github.io/chen-site/**

## 页面与布局

- `index.html`：海岛图片、简短介绍、两个项目的使用入口和源码链接。
- 电脑：左侧图片，右侧介绍和两个项目卡片。
- 手机：图片、介绍、两个紧凑卡片依次排列，按可用屏幕高度收紧间距。
- 常见桌面和手机竖屏尺寸一屏展示；极小屏幕、横屏及放大文字时允许自然滚动，保持内容完整、按钮可操作。
- `toolbox.html`：兼容旧链接，自动转到首页。

项目入口直接写在 HTML 中，不依赖 JavaScript 或外部字体加载。

## 修改项目

编辑 `index.html` 中的两个 `.tool-card`：中文标题、英文名称、简短介绍、项目源码链接和打开工具链接。

## 主视觉图片

原图位于 `assets/scan-islands.jpg`。通过 `styles.css` 中 `.island-view img` 的 `object-position` 调整裁切位置。

## 本地运行

纯静态，无构建：

```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## 部署

`main` 分支为源码，`gh-pages` 分支为 GitHub Pages 部署产物。将 `index.html`、`toolbox.html`、`styles.css`、`assets` 和 `.nojekyll` 同步到部署分支后提交并推送。

## 技术

原生 HTML / CSS，零运行时依赖。使用系统字体、键盘焦点提示和减少动画偏好；项目按钮至少 44px 高。
