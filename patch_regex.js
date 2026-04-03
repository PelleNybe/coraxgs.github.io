const fs = require('fs');

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
  const match = content.match(/---\\n([\\s\\S]*?)\\n---/);
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
    excerpt: content.replace(/---\\n([\\s\\S]*?)\\n---/, '').substring(0, 100).trim() + '...',
    link: '#' // In a real setup, link to a generated HTML page
  });
});

fs.writeFileSync(outputFile, JSON.stringify(blogs, null, 2));
console.log('Generated blogs.json from markdown files.');
`;
fs.writeFileSync('scripts/generate_blog_json.js', genScript);
