const fs = require('fs');
const { minify } = require('html-minifier-terser');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const CleanCSS = require('clean-css');
const { minify: terserMinify } = require('terser');

async function minifyFiles() {
  try {
    // 1. Minify HTML
    const html = fs.readFileSync('index.html', 'utf8');
    const minifiedHtml = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    });
    fs.writeFileSync('dist/index.html', minifiedHtml);
    console.log('HTML minified.');

    // 2. Minify CSS
    const css = fs.readFileSync('styles.css', 'utf8');
    const minifiedCss = new CleanCSS().minify(css).styles;
    fs.writeFileSync('dist/styles.css', minifiedCss);
    console.log('CSS minified.');

    // 3. Minify JS
    const js = fs.readFileSync('app.js', 'utf8');
    const minifiedJs = await terserMinify(js);
    fs.writeFileSync('dist/app.js', minifiedJs.code);
    console.log('JS minified.');

    // Copy images
    if (fs.existsSync('images')) {
      copyDirSync('images', 'dist/images');
      console.log('Images copied.');
    }

    // Copy worker.js
    if (fs.existsSync('worker.js')) {
      fs.copyFileSync('worker.js', 'dist/worker.js');
      console.log('Worker.js copied.');
    }

    // Copy search_worker.js
    if (fs.existsSync('search_worker.js')) {
      fs.copyFileSync('search_worker.js', 'dist/search_worker.js');
      console.log('search_worker.js copied.');
    }

    // Copy blogs.json
    if (fs.existsSync('blogs.json')) {
      fs.copyFileSync('blogs.json', 'dist/blogs.json');
      console.log('blogs.json copied.');
    }

    // Copy blogs_out
    if (fs.existsSync('blogs_out')) {
      copyDirSync('blogs_out', 'dist/blogs_out');
      console.log('blogs_out copied.');
    }


  } catch (error) {
    console.error('Error during minification:', error);
  }
}

if (!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}
minifyFiles();
