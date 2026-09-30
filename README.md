# PAGCOR游戏分类需求

789Bingo 管理后台 · PAGCOR 游戏分类修正（NG / eBINGO / EGAMES）的可交互原型与 PRD 文档，V1.0（2026-09-30）。

## 查看方式

打开 `index.html`：

- 左侧栏固定显示，点「原型」或「PRD 文档」切换。
- 「文档目录」列出 PRD 各章节，点击后自动滚动到对应位置；滚动时当前章节会高亮。
- 原型按 1920×960 设计，默认适应宽度，可切到原始尺寸或在新窗口打开。刷新后原型数据恢复初始状态。

## 发布到 GitHub Pages

1. 把 `pagcor-game-category` 文件夹解压到本地仓库里，提交并推送。
2. 仓库 Settings → Pages → Build and deployment，Source 选 “Deploy from a branch”，选择对应分支和 `/ (root)`，保存。
3. 稍等片刻后访问 `https://<用户名>.github.io/<仓库名>/pagcor-game-category/`。

如果希望直接用 `https://<用户名>.github.io/<仓库名>/` 访问，把本文件夹里的内容（而不是文件夹本身）放到仓库根目录即可。所有链接都是相对路径，放在哪一层都能正常打开。

站点为纯静态文件，不依赖构建工具，也不访问外部网络。

> 注意：GitHub Pages 发布后的页面是公开可访问的（私有仓库的 Pages 访问控制取决于账号套餐）。请确认内容可以对外公开后再发布。

## 目录结构

```
index.html                 左侧栏 + 原型 / 文档切换 + 文档目录
assets/site.css            站点样式
assets/site.js             切换、目录、滚动定位、章节高亮
assets/vendor/             htm + Preact 运行库（Apache-2.0 / MIT）
prototype/index.html       可交互原型（可单独打开）
prototype/prototype.js     原型逻辑与数据
prototype/prototype.css    原型样式
docs/PAGCOR游戏分类修正 PRD.docx   PRD Word 版
docs/prd.md                PRD Markdown 源文
.nojekyll                  让 GitHub Pages 原样发布静态文件
```

## 更新内容

- 修改 PRD：更新 `docs/prd.md` 后，需同步更新 `index.html` 中 `<article id="doc">` 内的内容（章节标题需保留 `id`，目录会自动生成）。
- 修改原型：编辑 `prototype/prototype.js`。
