const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, '..', 'blogs');
const outputJson = path.join(__dirname, '..', 'blogs.json');

const files = fs.readdirSync(blogsDir);
const posts = [];

for (const file of files) {
  if (file.endsWith('.md')) {
    const content = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
    const lines = content.split('\n');
    let title = '', date = '', tag = '', link = '', excerpt = '';
    let inFrontMatter = false;
    let contentLines = [];

    for (const line of lines) {
      if (line.trim() === '---') {
        inFrontMatter = !inFrontMatter;
        continue;
      }
      if (inFrontMatter) {
        if (line.startsWith('title:')) title = line.replace('title:', '').trim();
        else if (line.startsWith('date:')) date = line.replace('date:', '').trim();
        else if (line.startsWith('tag:')) tag = line.replace('tag:', '').trim();
        else if (line.startsWith('link:')) link = line.replace('link:', '').trim();
      } else {
        if(line.trim() !== '') {
          contentLines.push(line.trim());
        }
      }
    }

    // First non-empty paragraph as excerpt
    if(contentLines.length > 0) excerpt = contentLines[0];

    posts.push({
      title,
      date,
      excerpt,
      readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)) + ' min read',
      tag,
      link
    });
  }
}

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputJson, JSON.stringify(posts, null, 2));
console.log('Successfully generated blogs.json');
