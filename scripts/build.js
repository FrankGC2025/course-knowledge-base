const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const MarkdownIt = require('markdown-it');
const texmath = require('markdown-it-texmath');
const katex = require('katex');
const hljs = require('highlight.js');
const MiniSearch = require('minisearch');
const anchor = require('markdown-it-anchor');

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const BASE_URL = process.env.BASE_URL || ''; // e.g. '/course-knowledge-base' for GitHub Pages

// Preferred display order for courses (slugs). Unknown courses come last alphabetically.
const COURSE_ORDER = [
  'options-volatility-hedge-funds',
  'causal-inference',
  'risk-management',
  'data-structures'
];

// Custom tokenizer for Chinese + English mixed search
function tokenize(text) {
  if (!text) return [];
  // Split by whitespace and punctuation, but keep CJK characters as separate tokens
  const tokens = [];
  const regex = /[一-龥]|[a-zA-Z0-9]+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0].toLowerCase());
  }
  return tokens;
}

// Markdown renderer with math and code highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
      } catch (e) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  }
});

md.use(texmath, {
  engine: katex,
  delimiters: ['dollars', 'brackets'],
  katexOptions: {
    throwOnError: false,
    strict: false,
    macros: {
      '\\text': '\\mathrm{#1}'
    }
  }
});

// Heading anchors with CJK-safe slugify
function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

md.use(anchor, {
  level: [1, 2, 3, 4, 5, 6],
  slugify,
  permalink: false,
  uniqueSlugStartIndex: 1
});

// Ensure default table rendering
md.renderer.rules.table_open = () => '<div class="table-wrapper"><table>';
md.renderer.rules.table_close = () => '</table></div>';

// Utility: walk directory recursively
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// Utility: relative URL from content path
function urlFromContentPath(contentPath) {
  const rel = path.relative(CONTENT_DIR, contentPath);
  const noExt = rel.replace(/\.md$/, '');
  const normalized = noExt.split(path.sep).join('/');
  return `${BASE_URL}/${normalized}.html`;
}

// Utility: extract first h1 from HTML
function extractTitle(html, fallback) {
  const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : fallback;
}

// Utility: parse frontmatter and content
function parseMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let content = raw;
  let meta = {};

  if (raw.startsWith('---')) {
    const end = raw.indexOf('---', 3);
    if (end !== -1) {
      const yamlText = raw.slice(3, end).trim();
      content = raw.slice(end + 3).trim();
      try {
        meta = yaml.load(yamlText) || {};
      } catch (e) {
        console.warn(`Warning: failed to parse frontmatter in ${filePath}`);
      }
    }
  }

  return { meta, content, raw };
}

// Build all pages
function build() {
  console.log('Building site...');

  // Clean and recreate dist
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copy public assets
  copyPublic(PUBLIC_DIR, DIST_DIR);

  // Collect all pages
  const pages = [];
  walkDir(CONTENT_DIR, (filePath) => {
    if (path.extname(filePath) !== '.md') return;

    const { meta, content } = parseMarkdown(filePath);

    // Course detection from path
    const relParts = path.relative(CONTENT_DIR, filePath).split(path.sep);
    const isCourse = relParts[0] === 'courses' && relParts.length >= 2;
    const courseSlug = isCourse ? relParts[1] : null;
    const section = isCourse && relParts.length >= 3 ? relParts[2] : null;

    // Fix image paths for options course
    let processedContent = content;
    if (courseSlug === 'options-volatility-hedge-funds') {
      processedContent = processedContent.replace(
        /!\[([^\]]*)\]\(figures_Ch1-2\/([^)]+)\)/g,
        `![$1](${BASE_URL}/courses/options-volatility-hedge-funds/figures/$2)`
      );
    }

    const html = md.render(processedContent);
    const title = meta.title || extractTitle(html, path.basename(filePath, '.md'));
    const url = urlFromContentPath(filePath);

    // Generate snippet from plain text
    const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const snippet = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');

    pages.push({
      filePath,
      url,
      title,
      courseSlug,
      section,
      meta,
      html,
      snippet,
      plainText
    });
  });

  // Sort pages within courses for navigation
  pages.sort((a, b) => a.filePath.localeCompare(b.filePath));

  // Generate navigation structure
  const courses = buildCourseNav(pages);

  // Write each page
  for (const page of pages) {
    const prevNext = getPrevNext(page, pages);
    const outputHtml = renderPage(page, courses, prevNext);
    const outputPath = path.join(DIST_DIR, page.url.replace(BASE_URL, '').replace(/^\//, ''));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, outputHtml, 'utf-8');
  }

  // Build search index
  buildSearchIndex(pages);

  // Copy KaTeX and highlight.js CSS/JS to dist/assets
  copyVendorAssets();

  console.log(`Built ${pages.length} pages to ${DIST_DIR}`);
}

function copyPublic(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyPublic(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildCourseNav(pages) {
  const courseMap = {};

  for (const page of pages) {
    if (!page.courseSlug) continue;
    if (!courseMap[page.courseSlug]) {
      courseMap[page.courseSlug] = {
        slug: page.courseSlug,
        title: page.courseSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        overviewUrl: `${BASE_URL}/courses/${page.courseSlug}/overview.html`,
        sections: {}
      };
    }
    if (page.section && page.section !== 'overview.md') {
      if (!courseMap[page.courseSlug].sections[page.section]) {
        courseMap[page.courseSlug].sections[page.section] = [];
      }
      courseMap[page.courseSlug].sections[page.section].push({
        title: page.title,
        url: page.url
      });
    }
    // Use overview page title as course title
    if (path.basename(page.filePath) === 'overview.md') {
      courseMap[page.courseSlug].title = page.title;
      courseMap[page.courseSlug].overviewUrl = page.url;
    }
  }

  // Convert to array with preferred course ordering
  const courseList = Object.values(courseMap);
  courseList.sort((a, b) => {
    const idxA = COURSE_ORDER.indexOf(a.slug);
    const idxB = COURSE_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.title.localeCompare(b.title);
  });
  return courseList;
}

function getPrevNext(page, pages) {
  const coursePages = pages.filter(p => p.courseSlug === page.courseSlug && p.section);
  const idx = coursePages.findIndex(p => p.filePath === page.filePath);
  return {
    prev: idx > 0 ? { title: coursePages[idx - 1].title, url: coursePages[idx - 1].url } : null,
    next: idx < coursePages.length - 1 ? { title: coursePages[idx + 1].title, url: coursePages[idx + 1].url } : null
  };
}

function renderPage(page, courses, prevNext) {
  const isHome = page.url === `${BASE_URL}/index.html`;
  const isAbout = page.url === `${BASE_URL}/about.html`;
  const course = courses.find(c => c.slug === page.courseSlug);

  const sidebar = renderSidebar(courses, course, page);
  const topNav = renderTopNav();
  const breadcrumbs = renderBreadcrumbs(page, course);
  const prevNextNav = renderPrevNext(prevNext);

  const pageTitle = `${page.title}${page.courseSlug ? ` · ${course ? course.title : ''}` : ''}`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="stylesheet" href="${BASE_URL}/assets/katex.min.css">
  <link rel="stylesheet" href="${BASE_URL}/assets/highlight-github.min.css">
  <link rel="stylesheet" href="${BASE_URL}/assets/style.css">
  <script defer src="${BASE_URL}/assets/minisearch.js"></script>
  <script defer src="${BASE_URL}/assets/search.js"></script>
  <script defer src="${BASE_URL}/assets/ui.js"></script>
</head>
<body>
  ${topNav}
  <div class="layout">
    ${sidebar}
    <div class="sidebar-backdrop" aria-hidden="true"></div>
    <main class="main">
      <article class="content">
        ${breadcrumbs}
        ${page.html}
        ${prevNextNav}
      </article>
    </main>
  </div>
</body>
</html>`;
}

function renderTopNav() {
  return `<header class="top-nav">
  <div class="top-nav-inner">
    <div class="top-nav-left">
      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle navigation" aria-expanded="true" aria-controls="sidebar">
        <svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <a class="site-title" href="${BASE_URL}/index.html">Course KB</a>
      <nav class="top-links">
        <a href="${BASE_URL}/index.html">Home</a>
        <a href="${BASE_URL}/about.html">About</a>
      </nav>
    </div>
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search notes..." autocomplete="off" aria-label="Search notes">
      <div id="search-results" class="search-results"></div>
    </div>
  </div>
</header>`;
}

function renderSidebar(courses, currentCourse, currentPage) {
  let html = `<aside class="sidebar" id="sidebar" role="navigation" aria-label="Main">
    <div class="sidebar-inner">
    <div class="sidebar-section">
      <a class="sidebar-link ${!currentCourse ? 'active' : ''}" href="${BASE_URL}/index.html">Home</a>
      <a class="sidebar-link ${currentPage && currentPage.url === `${BASE_URL}/about.html` ? 'active' : ''}" href="${BASE_URL}/about.html">About</a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-heading">Courses</div>`;

  for (const course of courses) {
    const isActive = currentCourse && currentCourse.slug === course.slug;
    html += `<a class="sidebar-link ${isActive ? 'active' : ''}" href="${course.overviewUrl}">${escapeHtml(course.title)}</a>`;

    if (isActive) {
      html += `<div class="course-sections">`;
      const sectionOrder = ['lecture-notes', 'review', 'problems'];
      const sectionNames = {
        'lecture-notes': 'Lecture Notes',
        'review': 'Review',
        'problems': 'Problems'
      };
      for (const section of sectionOrder) {
        const items = course.sections[section];
        if (!items || items.length === 0) continue;
        html += `<div class="section-group">
          <div class="section-title">${sectionNames[section] || section}</div>`;
        for (const item of items) {
          const active = currentPage && currentPage.url === item.url;
          html += `<a class="sidebar-link nested ${active ? 'active' : ''}" href="${item.url}">${escapeHtml(item.title)}</a>`;
        }
        html += `</div>`;
      }
      html += `</div>`;
    }
  }

  html += `</div></div></aside>`;
  return html;
}

function renderBreadcrumbs(page, course) {
  const parts = [];
  parts.push({ title: 'Home', url: `${BASE_URL}/index.html` });
  if (course) {
    parts.push({ title: course.title, url: course.overviewUrl });
  }
  if (page.section && page.section !== 'overview.md') {
    const sectionNames = {
      'lecture-notes': 'Lecture Notes',
      'review': 'Review',
      'problems': 'Problems'
    };
    parts.push({ title: sectionNames[page.section] || page.section, url: page.url });
  }
  parts.push({ title: page.title, url: null });

  return `<nav class="breadcrumbs">
    ${parts.map((p, i) => {
      if (i === parts.length - 1) return `<span>${escapeHtml(p.title)}</span>`;
      return `<a href="${p.url}">${escapeHtml(p.title)}</a><span class="sep">/</span>`;
    }).join('')}
  </nav>`;
}

function renderPrevNext(prevNext) {
  if (!prevNext.prev && !prevNext.next) return '';
  return `<nav class="prev-next">
    <div class="prev">
      ${prevNext.prev ? `<a href="${prevNext.prev.url}">← ${escapeHtml(prevNext.prev.title)}</a>` : ''}
    </div>
    <div class="next">
      ${prevNext.next ? `<a href="${prevNext.next.url}">${escapeHtml(prevNext.next.title)} →</a>` : ''}
    </div>
  </nav>`;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractSections(page) {
  const html = page.html;
  const headingRe = /<h([1-6])(?:\s+[^>]*)?>(.*?)\s*<\/h\1>/gi;
  const headings = [];
  let m;
  while ((m = headingRe.exec(html)) !== null) {
    const idMatch = m[0].match(/\bid=["']([^"']+)["']/);
    headings.push({
      level: parseInt(m[1], 10),
      id: idMatch ? idMatch[1] : '',
      text: m[2].replace(/<[^>]+>/g, '').trim(),
      tagEnd: m.index + m[0].length
    });
  }

  const sections = [];

  // Always index the whole page once so title/whole-page matches still work
  sections.push({
    headingId: '',
    headingTitle: page.title,
    plainText: stripHtml(html)
  });

  // Index sub-sections (h2-h6) so search can deep-link into specific sections
  const subHeadings = headings.filter(h => h.id && h.level >= 2);
  for (let i = 0; i < subHeadings.length; i++) {
    const h = subHeadings[i];
    const start = h.tagEnd;
    const next = subHeadings.slice(i + 1).find(x => x.level <= h.level);
    const end = next ? next.tagEnd : html.length;
    sections.push({
      headingId: h.id,
      headingTitle: h.text,
      plainText: stripHtml(html.slice(start, end))
    });
  }

  return sections;
}

function buildSearchIndex(pages) {
  const miniSearch = new MiniSearch({
    fields: ['pageTitle', 'headingTitle', 'plainText'],
    storeFields: ['pageTitle', 'headingTitle', 'url', 'headingId', 'courseSlug', 'plainText'],
    tokenize: (text) => tokenize(text),
    processTerm: (term) => term.toLowerCase(),
    searchOptions: {
      boost: { pageTitle: 3, headingTitle: 2 },
      fuzzy: 0.2,
      prefix: true,
      tokenize: (text) => tokenize(text),
      processTerm: (term) => term.toLowerCase()
    }
  });

  const docs = [];
  for (const page of pages) {
    const sections = extractSections(page);
    for (const section of sections) {
      docs.push({
        id: section.headingId ? `${page.url}#${section.headingId}` : page.url,
        pageTitle: page.title,
        headingTitle: section.headingTitle,
        plainText: section.plainText,
        url: page.url,
        headingId: section.headingId,
        courseSlug: page.courseSlug || ''
      });
    }
  }

  miniSearch.addAll(docs);
  fs.mkdirSync(path.join(DIST_DIR, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'assets', 'search-index.json'), JSON.stringify(miniSearch.toJSON()), 'utf-8');
}

function copyVendorAssets() {
  const assetsDir = path.join(DIST_DIR, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });

  // Copy project assets from src/assets
  const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
  if (fs.existsSync(srcAssetsDir)) {
    const entries = fs.readdirSync(srcAssetsDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcAssetsDir, entry.name);
      const destPath = path.join(assetsDir, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyPublic(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // KaTeX CSS
  const katexCss = require.resolve('katex/dist/katex.min.css');
  fs.copyFileSync(katexCss, path.join(assetsDir, 'katex.min.css'));

  // KaTeX fonts directory
  const katexDir = path.dirname(katexCss);
  const fontsSrc = path.join(katexDir, 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  if (fs.existsSync(fontsSrc)) {
    fs.mkdirSync(fontsDest, { recursive: true });
    for (const file of fs.readdirSync(fontsSrc)) {
      fs.copyFileSync(path.join(fontsSrc, file), path.join(fontsDest, file));
    }
  }

  // Highlight.js CSS
  const hljsCss = require.resolve('highlight.js/styles/github.min.css');
  fs.copyFileSync(hljsCss, path.join(assetsDir, 'highlight-github.min.css'));

  // Minisearch UMD bundle for browser (resolve via main entry and traverse to umd build)
  const minisearchMain = require.resolve('minisearch');
  const minisearchUmd = path.join(path.dirname(minisearchMain), '..', 'umd', 'index.js');
  if (fs.existsSync(minisearchUmd)) {
    fs.copyFileSync(minisearchUmd, path.join(assetsDir, 'minisearch.js'));
  } else {
    console.warn('Warning: minisearch UMD bundle not found, search will not work');
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate homepage
function generateHomepage(pages, courses) {
  const courseCards = courses.map(c => {
    const count = Object.values(c.sections).flat().length;
    return `<a class="course-card" href="${c.overviewUrl}">
      <h3>${escapeHtml(c.title)}</h3>
      <p>${count} note${count !== 1 ? 's' : ''}</p>
    </a>`;
  }).join('');

  const html = `<h1 id="course-knowledge-base">Course Knowledge Base</h1>
<p>Personal study notes for selected courses this semester.</p>
<h2 id="courses">Courses</h2>
<div class="course-grid">
  ${courseCards}
</div>`;

  return {
    url: `${BASE_URL}/index.html`,
    title: 'Course Knowledge Base',
    html,
    filePath: path.join(CONTENT_DIR, 'index.md'),
    courseSlug: null,
    section: null,
    meta: {},
    snippet: 'Personal study notes for selected courses this semester.',
    plainText: 'Personal study notes for selected courses this semester.'
  };
}

// Override build to include homepage
function buildWithHomepage() {
  console.log('Building site...');

  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  copyPublic(PUBLIC_DIR, DIST_DIR);

  const pages = [];
  walkDir(CONTENT_DIR, (filePath) => {
    if (path.extname(filePath) !== '.md') return;

    const { meta, content } = parseMarkdown(filePath);
    const relParts = path.relative(CONTENT_DIR, filePath).split(path.sep);
    const isCourse = relParts[0] === 'courses' && relParts.length >= 2;
    const courseSlug = isCourse ? relParts[1] : null;
    const section = isCourse && relParts.length >= 3 ? relParts[2] : null;

    let processedContent = content;
    if (courseSlug === 'options-volatility-hedge-funds') {
      processedContent = processedContent.replace(
        /!\[([^\]]*)\]\(figures_Ch1-2\/([^)]+)\)/g,
        `![$1](${BASE_URL}/courses/options-volatility-hedge-funds/figures/$2)`
      );
    }

    const html = md.render(processedContent);
    const title = meta.title || extractTitle(html, path.basename(filePath, '.md'));
    const url = urlFromContentPath(filePath);
    const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const snippet = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');

    pages.push({
      filePath,
      url,
      title,
      courseSlug,
      section,
      meta,
      html,
      snippet,
      plainText
    });
  });

  pages.sort((a, b) => a.filePath.localeCompare(b.filePath));

  const courses = buildCourseNav(pages);
  const homepage = generateHomepage(pages, courses);
  pages.unshift(homepage);

  for (const page of pages) {
    const prevNext = page.courseSlug ? getPrevNext(page, pages) : { prev: null, next: null };
    const outputHtml = renderPage(page, courses, prevNext);
    const outputPath = path.join(DIST_DIR, page.url.replace(BASE_URL, '').replace(/^\//, ''));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, outputHtml, 'utf-8');
  }

  buildSearchIndex(pages);
  copyVendorAssets();

  console.log(`Built ${pages.length} pages to ${DIST_DIR}`);
}

buildWithHomepage();
