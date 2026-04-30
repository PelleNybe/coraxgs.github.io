const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const blogsDir = path.join(__dirname, '../blogs');
const outputDir = path.join(__dirname, '../blogs_out');
const outputFile = path.join(__dirname, '../blogs.json');
const templatePath = path.join(__dirname, 'blog_template.html');

if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir);
  fs.writeFileSync(path.join(blogsDir, 'welcome.md'), `---
title: "The Future of Edge AI"
date: "Oct 24, 2024"
tag: "Edge AI"
readTime: "5 min"
---
This is a post about Edge AI running directly on GAPbot hardware.

## Why Edge AI?
It is fast, secure, and operates without continuous cloud connectivity.`);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const template = fs.readFileSync(templatePath, 'utf8');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
const blogs = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
  const match = content.match(/---\n([\s\S]*?)\n---/);
  let meta = {};
  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val) {
         meta[key.trim()] = val.join(':').replace(/"/g, '').trim();
      }
    });
  }

  const rawMarkdown = content.replace(/---\n([\s\S]*?)\n---/, '').trim();
  const htmlContent = marked.parse(rawMarkdown);

  const title = meta.title || 'Untitled';
  const date = meta.date || new Date().toISOString().split('T')[0];
  const tag = meta.tag || 'Update';
  const readTime = meta.readTime || '3 min';

  const outputFileName = file.replace('.md', '.html');

  let finalHtml = template
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DATE}}/g, date)
    .replace(/{{TAG}}/g, tag)
    .replace(/{{READ_TIME}}/g, readTime)
    .replace(/{{CONTENT}}/g, htmlContent);

  fs.writeFileSync(path.join(outputDir, outputFileName), finalHtml);

  blogs.push({
    title: title,
    date: date,
    tag: tag,
    readTime: readTime,
    excerpt: rawMarkdown.substring(0, 100).trim() + '...',
    link: `blogs_out/${outputFileName}`
  });
});

fs.writeFileSync(outputFile, JSON.stringify(blogs, null, 2));
console.log(`Generated blogs.json and HTML pages from markdown files.`);
