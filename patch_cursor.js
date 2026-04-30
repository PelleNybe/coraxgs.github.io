const fs = require('fs');
let cssContent = fs.readFileSync('styles.css', 'utf8');

const cursorCSS = `
/* Contextual Cursor additions */
.custom-cursor::after {
  content: attr(data-text);
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: var(--dark-bg);
  font-size: 8px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.cursor-hover .custom-cursor::after,
.cursor-drag .custom-cursor::after {
  opacity: 1;
}
.cursor-drag .custom-cursor {
  transform: translate(-50%, -50%) scale(3);
  background-color: var(--secondary-color);
  border-color: transparent;
}
`;
cssContent += cursorCSS;
fs.writeFileSync('styles.css', cssContent, 'utf8');


let jsContent = fs.readFileSync('app.js', 'utf8');
const oldCursorInit = `    // Hover effects on links/buttons
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });`;

const newCursorInit = `    // Hover effects on links/buttons
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        this.cursor.setAttribute('data-text', el.tagName === 'A' ? 'OPEN' : 'CLICK');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        this.cursor.removeAttribute('data-text');
      });
    });

    // Drag effects for 3D containers
    const draggableElements = document.querySelectorAll('#gapbot-3d-container, #hologram-container');
    draggableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-drag');
        this.cursor.setAttribute('data-text', 'DRAG');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-drag');
        this.cursor.removeAttribute('data-text');
      });
    });`;

jsContent = jsContent.replace(oldCursorInit, newCursorInit);
fs.writeFileSync('app.js', jsContent, 'utf8');

console.log('Cursor patch applied');
