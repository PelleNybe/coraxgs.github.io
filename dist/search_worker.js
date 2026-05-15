importScripts('https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js');

let searchIndex = null;
let documents = [];

self.onmessage = function(e) {
  const { type, payload } = e.data;

  if (type === 'init') {
    documents = payload;
    searchIndex = lunr(function () {
      this.ref('link');
      this.field('title');
      this.field('tag');
      this.field('excerpt');

      documents.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
    self.postMessage({ type: 'ready' });
  } else if (type === 'search') {
    if (!searchIndex) {
      self.postMessage({ type: 'results', payload: [] });
      return;
    }
    const query = payload;
    if (!query) {
       self.postMessage({ type: 'results', payload: documents.map(d => d.link) });
       return;
    }
    try {
        const results = searchIndex.search(query);
        const matchedLinks = results.map(r => r.ref);
        self.postMessage({ type: 'results', payload: matchedLinks });
    } catch (err) {
        // Lunr throws if query is malformed
        self.postMessage({ type: 'results', payload: [] });
    }
  }
};
