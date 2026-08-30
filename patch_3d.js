const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// There is no explicit .dispose() logic, but the objects are permanent and never deleted from the scene.
// So memory leaking via untracked geometries isn't a huge issue unless they are regenerated.
// Let's verify if geometry is generated inside a loop.

// In GAPbot, it uses BoxGeometry for parts:
// new THREE.BoxGeometry(2, 4, 2)
// Since they are only created once on init(), it's fine.
