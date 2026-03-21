const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const stylesCss = fs.readFileSync('styles.css', 'utf8');

console.log('V1 (Boot Screen in HTML):', indexHtml.includes('corax-os-boot'));
console.log('V1 (Boot Screen Logic in JS):', appJs.includes('Advanced Loading Screen Logic'));
console.log('V2 (Swarm Reactivity):', appJs.includes('scrollSpeed') && appJs.includes('rippleTime'));
console.log('V5 (Parallax Depth):', appJs.includes('child.style.transform = `translateZ'));
console.log('V3 (Glowing Inputs):', stylesCss.includes('input[type="text"]:focus'));
console.log('V4 (Enhanced Navbar):', stylesCss.includes('nav.scrolled {') && stylesCss.includes('border-radius: 50px'));
