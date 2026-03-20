const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('id="architecture"')) {
    console.log("No architecture section found");
} else {
    console.log("Found architecture section");
}
