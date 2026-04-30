const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// Due to repeated patching we might have duplicated gapbotObserver
// Let's replace 'const gapbotObserver =' with 'let gapbotObserver =' to avoid redeclaration, or just remove duplicates.

content = content.replace(/const gapbotObserver =/g, 'var gapbotObserver =');

fs.writeFileSync('app.js', content, 'utf8');
