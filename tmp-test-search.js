const fs = require('fs');
const MiniSearch = require('minisearch');

function tokenize(text) {
  if (!text) return [];
  const tokens = [];
  const regex = /[一-龥]|[a-zA-Z0-9]+/g;
  let match;
  while ((match = regex.exec(text)) !== null) tokens.push(match[0].toLowerCase());
  return tokens;
}

function escapeRegex(term) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSnippet(plainText, match, maxLen = 130) {
  const terms = Object.keys(match || {});
  if (!terms.length || !plainText) {
    return plainText ? plainText.slice(0, maxLen) + (plainText.length > maxLen ? '...' : '') : '';
  }
  const pattern = new RegExp(terms.map(escapeRegex).join('|'), 'i');
  const m = plainText.match(pattern);
  if (!m) return plainText.slice(0, maxLen) + (plainText.length > maxLen ? '...' : '');
  const pos = m.index;
  const half = Math.floor(maxLen / 2);
  const start = Math.max(0, pos - half);
  const end = Math.min(plainText.length, start + maxLen);
  let snippet = plainText.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < plainText.length) snippet += '...';
  const hl = new RegExp('(' + terms.map(escapeRegex).join('|') + ')', 'gi');
  return snippet.replace(hl, '<mark>$1</mark>');
}

const data = JSON.parse(fs.readFileSync('dist/assets/search-index.json', 'utf-8'));
const miniSearch = MiniSearch.loadJS(data, {
  fields: ['pageTitle', 'headingTitle', 'plainText'],
  storeFields: ['pageTitle', 'headingTitle', 'url', 'headingId', 'courseSlug', 'plainText'],
  tokenize,
  processTerm: (term) => term.toLowerCase(),
  searchOptions: { boost: { pageTitle: 3, headingTitle: 2 }, fuzzy: 0.2, prefix: true, tokenize, processTerm: (term) => term.toLowerCase() }
});

const query = '线性表';
const results = miniSearch.search(query, { boost: { pageTitle: 3, headingTitle: 2 }, fuzzy: 0.2, prefix: true });
console.log('Top result URLs for query:', query);
results.slice(0, 3).forEach(r => {
  const q = encodeURIComponent(query);
  const hash = r.headingId ? '#' + r.headingId : '';
  console.log(r.url + '?q=' + q + hash);
  console.log('  snippet:', buildSnippet(r.plainText, r.match));
});
