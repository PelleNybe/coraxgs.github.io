const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// Global cache manager utility
const cacheManagerCode = `
// Technical Improvement 5: TTL-based Local Storage Caching
const CacheManager = {
  set: (key, data, ttlMs) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  get: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
};
`;

content = cacheManagerCode + '\n' + content;

// Replace GH feed cache logic
const oldGHCache = `      // Tech 1: LocalStorage Cache for GitHub Feed
      const cached = localStorage.getItem('corax_gh_feed');
      if (cached) {
         const { data, timestamp } = JSON.parse(cached);
         if (Date.now() - timestamp < 3600000) { // 1 hour TTL
            this.renderEvents(data);
            return;
         }
      }`;
const newGHCache = `      // Use TTL CacheManager for GitHub Feed (1 hour TTL)
      const cachedData = CacheManager.get('corax_gh_feed');
      if (cachedData) {
         this.renderEvents(cachedData);
         return;
      }`;
content = content.replace(oldGHCache, newGHCache);

const oldGHSet1 = `localStorage.setItem('corax_gh_feed', JSON.stringify({ data: relevantEvents, timestamp: Date.now() }));`;
const newGHSet1 = `CacheManager.set('corax_gh_feed', relevantEvents, 3600000);`;
content = content.replace(oldGHSet1, newGHSet1);

const oldGHSet2 = `localStorage.setItem('corax_gh_feed', JSON.stringify({ data: relevantEvents, timestamp: Date.now() }));`;
const newGHSet2 = `CacheManager.set('corax_gh_feed', relevantEvents, 3600000);`;
content = content.replace(oldGHSet2, newGHSet2); // for fallback

// Replace Web3 Cache logic
const oldWeb3Get = `    const savedAccount = localStorage.getItem('corax_web3_account');`;
const newWeb3Get = `    // Use TTL CacheManager for Web3 Session (24 hours TTL)
    const savedAccount = CacheManager.get('corax_web3_account');`;
content = content.replace(oldWeb3Get, newWeb3Get);

const oldWeb3Set = `          localStorage.setItem('corax_web3_account', this.account);`;
const newWeb3Set = `          CacheManager.set('corax_web3_account', this.account, 86400000);`;
content = content.replace(oldWeb3Set, newWeb3Set);

const oldWeb3Remove = `        localStorage.removeItem('corax_web3_account');`;
const newWeb3Remove = `        CacheManager.remove('corax_web3_account');`;
content = content.replace(new RegExp(oldWeb3Remove, 'g'), newWeb3Remove);


fs.writeFileSync('app.js', content, 'utf8');
console.log('Cache patch applied');
