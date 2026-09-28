# Course Knowledge Base

个人课程知识库。整理本学期部分课程的 Markdown 笔记，生成可搜索、可导航的静态网站。

## 已包含课程

1. **期权波动率与对冲基金** — 对冲基金介绍、基础衍生品
2. **因果推断与商业应用** — 因果推断方法论与识别策略
3. **风险管理** — 银行、保险、基金与风险管理基础

## 本地开发

```bash
# 安装依赖
npm install

# 构建网站（本地路径）
npm run build

# 本地预览
npm run serve
```

打开浏览器访问 `http://localhost:3000`。

## 如何添加新笔记

1. 在 `content/courses/<课程slug>/<分类>/` 下新建 `.md` 文件。
2. 可选添加 YAML frontmatter：

```markdown
---
title: 笔记标题
---

# 笔记标题

正文内容……
```

3. 运行 `npm run build`。
4. 网站会自动生成对应的 HTML 页面、侧边栏链接和搜索索引。

### 课程分类约定

- `lecture-notes/`：课堂笔记
- `review/`：复习资料
- `problems/`：练习题与作业

## 如何添加新课程

1. 在 `content/courses/` 下新建课程文件夹：

```
content/courses/new-course/
├── overview.md
├── lecture-notes/
├── review/
└── problems/
```

2. 在 `scripts/build.js` 的 `COURSE_ORDER` 数组中加入新课程 slug，控制显示顺序。
3. 将课程相关图片放入 `public/courses/new-course/figures/`。
4. 运行 `npm run build`。

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库，命名为 `course-knowledge-base`（或你喜欢的名字）。
2. 将本项目推送至 GitHub。
3. 进入仓库 **Settings → Pages → Build and deployment**，选择 **GitHub Actions**。
4. GitHub Actions 工作流会自动构建并部署。

如果仓库名称不是 `course-knowledge-base`，请修改 `.github/workflows/deploy.yml` 中的 `BASE_URL` 环境变量，使其与仓库名一致。

## 技术栈

- 静态站点生成：自定义 Node.js 构建脚本
- Markdown 渲染：markdown-it
- 数学公式：KaTeX
- 代码高亮：highlight.js
- 站内搜索：Minisearch
- 部署：GitHub Pages

## 内容声明

- 本站笔记为个人学习整理，部分经 AI 辅助生成，会明确标注。
- 受版权保护的课程材料（教材、课件、答案等）不会公开发布。
