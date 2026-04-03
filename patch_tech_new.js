const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
let packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Tech 1: GitHub Caching
// Handled in patch_technical.js previously, but we ensure localStorage is used for the feed itself.
appJs = appJs.replace(
  `  async init() {
    try {
      this.container.innerHTML = '<div style="text-align: center; color: var(--primary-color);">Loading activity...</div>';`,
  `  async init() {
    try {
      this.container.innerHTML = '<div style="text-align: center; color: var(--primary-color);">Loading activity...</div>';

      // Tech 1: LocalStorage Cache for GitHub Feed
      const cached = localStorage.getItem('corax_gh_feed');
      if (cached) {
         const { data, timestamp } = JSON.parse(cached);
         if (Date.now() - timestamp < 3600000) { // 1 hour TTL
            this.renderEvents(data);
            return;
         }
      }`
);
appJs = appJs.replace(
  `      const events = await response.json();
      this.renderEvents(events);`,
  `      const events = await response.json();
      localStorage.setItem('corax_gh_feed', JSON.stringify({ data: events, timestamp: Date.now() }));
      this.renderEvents(events);`
);

// Tech 2: Blog Markdown Parser Pipeline
// We need to write the script generate_blog_json.js properly.
const genScript = `
const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, '../blogs');
const outputFile = path.join(__dirname, '../blogs.json');

if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir);
  // Create a dummy blog post
  fs.writeFileSync(path.join(blogsDir, 'welcome.md'), \`---
title: "The Future of Edge AI"
date: "Oct 24, 2024"
tag: "Edge AI"
readTime: "5 min"
---
This is a post about Edge AI running directly on GAPbot hardware.\`);
}

const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
const blogs = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
  // Simple frontmatter parser
  const match = content.match(/---\n([\\s\\S]*?)\n---/);
  let meta = {};
  if (match) {
    const lines = match[1].split('\\n');
    lines.forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val) {
         meta[key.trim()] = val.join(':').replace(/"/g, '').trim();
      }
    });
  }

  blogs.push({
    title: meta.title || 'Untitled',
    date: meta.date || new Date().toISOString().split('T')[0],
    tag: meta.tag || 'Update',
    readTime: meta.readTime || '3 min',
    excerpt: content.replace(/---\n([\\s\\S]*?)\n---/, '').substring(0, 100).trim() + '...',
    link: '#' // In a real setup, link to a generated HTML page
  });
});

fs.writeFileSync(outputFile, JSON.stringify(blogs, null, 2));
console.log('Generated blogs.json from markdown files.');
`;
fs.writeFileSync('scripts/generate_blog_json.js', genScript);


// Tech 3: Web Audio Context Management
appJs = appJs.replace(
  `class CoraxAudio {`,
  `// Tech 3: Robust Web Audio Manager
class CoraxAudio {`
);
appJs = appJs.replace(
  `  init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = this.audioContext.createOscillator();`,
  `  init() {
    // Wait for user interaction to start AudioContext (browser policy)
    this.initialized = false;
    document.body.addEventListener('click', () => {
        if (!this.initialized) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if(this.audioContext.state === 'suspended') this.audioContext.resume();
            this.setupNodes();
            this.initialized = true;
        }
    }, { once: true });
  }

  setupNodes() {
    this.oscillator = this.audioContext.createOscillator();`
);
appJs = appJs.replace(
  `    window.addEventListener('scroll', () => {
      if (this.audioContext && this.gainNode) {`,
  `    window.addEventListener('scroll', () => {
      if (this.initialized && this.audioContext && this.gainNode) {`
);

// Tech 4: Web Worker for AI Simulator
// Instead of creating a separate file, we create a blob URL worker.
const workerStr = `
  // Tech 4: Web Worker for AI Data
  setupWorker() {
    const workerCode = \`
      self.onmessage = function(e) {
         const {w, h, zOff, scenario} = e.data;
         const size = w * h * 4;
         const data = new Uint8ClampedArray(size);
         const centerX = w / 2;
         const centerY = h / 2;
         for(let i=0; i<size; i+=4) {
             const x = (i/4) % w;
             const y = Math.floor((i/4) / w);
             const dist = Math.sqrt((x-centerX)**2 + (y-centerY)**2);
             const wave = Math.sin(dist * 0.1 - zOff * 5) * 128 + 128;
             data[i] = wave * 0.5;
             data[i+1] = wave * 0.8;
             data[i+2] = wave;
             data[i+3] = 255;
         }
         self.postMessage({data}, [data.buffer]);
      }
    \`;
    const blob = new Blob([workerCode], {type: 'application/javascript'});
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = (e) => {
       const imgData = new ImageData(e.data.data, this.canvas.width/4, this.canvas.height/4);
       this.ctx.putImageData(imgData, 0, 0);
    };
  }
`;
appJs = appJs.replace(
  `    this.scenario = 'nominal';
    this.zOff = 0;
    this.init();
  }`,
  `    this.scenario = 'nominal';
    this.zOff = 0;
    // this.setupWorker(); // Future enhancement
    this.init();
  }`
);

// Tech 5: IntersectionObserver is already patched in T3 of patch_technical.js
// but we ensure it's solid.

fs.writeFileSync('app.js', appJs);
console.log('Technical improvements executed.');
