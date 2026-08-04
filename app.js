// 只需编辑这里：替换名称、简介和两个工具的链接。
const tools = [
  {
    id: 'fend',
    name: 'Fend Offline',
    label: '离线计算器',
    description: '一个可以离线使用的计算器与单位换算工具。适合在没有网络时，依然快速算清楚眼前的问题。',
    liveUrl: 'https://tatsuhiroc.github.io/fend-offline/',
    repoUrl: 'https://github.com/TatsuhiroC/fend-offline',
    icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="5.5" width="30" height="37" rx="5"/><path d="M16 14h16M16 22h4m8 0h4M16 30h4m8 0h4M16 36h16"/></svg>'
  },
  {
    id: 'transfer',
    name: 'Optical Transfer',
    label: '光学文件传输',
    description: '用屏幕和摄像头传输文件：一端播放动态二维码，另一端扫描还原。无需配对，也不需要网络。',
    liveUrl: 'https://tatsuhiroc.github.io/optical-transfer-pwa/',
    repoUrl: 'https://github.com/TatsuhiroC/optical-transfer-pwa',
    icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="12" height="12"/><rect x="28" y="8" width="12" height="12"/><rect x="8" y="28" width="12" height="12"/><path d="M28 28h4m4 0h4m-12 4v8m4-4h8"/></svg>'
  }
];

const grid = document.querySelector('#tool-grid');
if (grid) {
  grid.innerHTML = tools.map((tool) => `
    <article class="tool-card tool-card--${tool.id}">
      <div class="tool-meta"><span><i class="status-dot"></i>OFFLINE READY</span><span>${tool.label}</span></div>
      <div class="tool-icon">${tool.icon}</div>
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <div class="card-footer">
        <a href="${tool.repoUrl}" target="_blank" rel="noreferrer">查看项目源码 ↗</a>
        <a class="launch-link" href="${tool.liveUrl}" target="_blank" rel="noreferrer">打开工具 ↗</a>
      </div>
    </article>
  `).join('');
}
