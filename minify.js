const fs = require('fs');
const { minify } = require('html-minifier-terser');
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

  } catch (error) {
    console.error('Error during minification:', error);
  }
}

if (!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}
minifyFiles();
