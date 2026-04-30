const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// The toggleTheme function already uses window.coraxEventBus but we defined window.EventBus
// Let's fix that inconsistency by standardizing on window.EventBus
content = content.replace(/window\.coraxEventBus\.emit/g, 'window.EventBus.emit');

fs.writeFileSync('app.js', content, 'utf8');
console.log('EventBus reference fixed');
