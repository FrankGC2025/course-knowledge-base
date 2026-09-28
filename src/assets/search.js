(function () {
  const BASE_URL = document.querySelector('link[href$="/assets/style.css"]')
    ?.getAttribute('href')
    ?.replace('/assets/style.css', '') || '';

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  let miniSearch = null;
  let indexLoaded = false;

  // Simple tokenizer supporting CJK and alphanumeric (must match scripts/build.js)
  function tokenize(text) {
    if (!text) return [];
    const tokens = [];
    const regex = /[一-龥]|[a-zA-Z0-9]+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push(match[0].toLowerCase());
    }
    return tokens;
  }

  function escapeRegex(term) {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async function loadIndex() {
    if (indexLoaded) return;
    try {
      const response = await fetch(`${BASE_URL}/assets/search-index.json`);
      const data = await response.json();
      miniSearch = MiniSearch.loadJS(data, {
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
      indexLoaded = true;
    } catch (e) {
      console.error('Failed to load search index:', e);
    }
  }

  function buildSnippet(plainText, match, query, maxLen = 130) {
    const terms = Object.keys(match || {});
    if (!terms.length || !plainText) {
      return plainText
        ? plainText.slice(0, maxLen) + (plainText.length > maxLen ? '...' : '')
        : '';
    }

    // Prefer highlighting the original query as a whole; fall back to matched terms
    const termPattern = new RegExp(terms.map(escapeRegex).join('|'), 'i');
    const queryPattern = query ? new RegExp(escapeRegex(query), 'i') : null;
    const pattern = (queryPattern && queryPattern.test(plainText)) ? queryPattern : termPattern;

    const m = plainText.match(pattern);
    if (!m) {
      return plainText.slice(0, maxLen) + (plainText.length > maxLen ? '...' : '');
    }

    const pos = m.index;
    const half = Math.floor(maxLen / 2);
    const start = Math.max(0, pos - half);
    const end = Math.min(plainText.length, start + maxLen);
    let snippet = plainText.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < plainText.length) snippet += '...';

    return snippet.replace(pattern, '<mark>$&</mark>');
  }

  function renderResults(results, query) {
    if (!results || results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    const courseNames = {
      'options-volatility-hedge-funds': '期权波动率与对冲基金',
      'causal-inference': '因果推断与商业应用',
      'risk-management': '风险管理',
      'data-structures': '数据结构与算法'
    };

    searchResults.innerHTML = results.slice(0, 10).map(r => {
      const course = courseNames[r.courseSlug] || r.courseSlug || 'General';
      const headingLabel = r.headingId && r.headingTitle !== r.pageTitle
        ? `${escapeHtml(r.pageTitle)} › ${escapeHtml(r.headingTitle)}`
        : escapeHtml(r.pageTitle);
      const snippet = buildSnippet(r.plainText, r.match, query);
      const q = encodeURIComponent(query);
      const hash = r.headingId ? `#${r.headingId}` : '';
      return `
        <a class="search-result-item" href="${r.url}?q=${q}${hash}">
          <div class="search-result-title">${headingLabel}</div>
          <div class="search-result-meta">${escapeHtml(course)}</div>
          <div class="search-result-snippet">${snippet}</div>
        </a>
      `;
    }).join('');
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function closeSearch() {
    searchResults.classList.remove('active');
  }

  searchInput.addEventListener('focus', () => {
    loadIndex();
    if (searchInput.value.trim()) {
      searchResults.classList.add('active');
    }
  });

  searchInput.addEventListener('input', async () => {
    await loadIndex();
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.innerHTML = '';
      closeSearch();
      return;
    }

    if (!miniSearch) return;

    const results = miniSearch.search(query, {
      boost: { pageTitle: 3, headingTitle: 2 },
      fuzzy: 0.2,
      prefix: true
    });
    renderResults(results, query);
    searchResults.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      closeSearch();
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      searchInput.blur();
    }
  });

  // Highlight search terms on page load when ?q=... is present
  function highlightSearchTerms() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (!query) return;

    const terms = tokenize(query).filter(Boolean);
    if (!terms.length) return;

    const container = document.querySelector('.content');
    if (!container) return;

    // Prefer highlighting the original query as a whole; fall back to individual terms
    const termPattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi');
    const queryPattern = new RegExp(`(${escapeRegex(query)})`, 'gi');
    const pattern = queryPattern.test(container.textContent) ? queryPattern : termPattern;

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest('pre, code, script, style, mark')) return NodeFilter.FILTER_REJECT;
          return pattern.test(node.nodeValue)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = match[0];
        frag.appendChild(mark);
        lastIndex = match.index + match[0].length;
      }
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.parentNode.replaceChild(frag, node);
    });

    // If the URL has no heading hash, scroll to the first highlight
    if (!window.location.hash) {
      const first = container.querySelector('mark.search-highlight');
      if (first) {
        requestAnimationFrame(() => {
          first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }
  }

  highlightSearchTerms();
})();
