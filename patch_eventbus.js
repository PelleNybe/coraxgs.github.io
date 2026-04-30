const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

const eventBusCode = `
// Technical Improvement 2: EventBus Architecture
class EventBus {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}
window.EventBus = new EventBus();
`;

// Insert after the component class definitions or at the top
content = eventBusCode + '\n' + content;

// Find ThemeCustomizer and update it to emit event
const oldThemeSet = `      this.setTheme(e.target.value);`;
const newThemeSet = `      this.setTheme(e.target.value);
      window.EventBus.emit('themeChanged', e.target.value);`;
content = content.replace(oldThemeSet, newThemeSet);

// Update init3DGAPbot to listen to theme changes
const oldInitGapbot = `function init3DGAPbot() {`;
const newInitGapbot = `function init3DGAPbot() {
  if (window.gapbotInitialized) return;
  window.gapbotInitialized = true;`;
content = content.replace(oldInitGapbot, newInitGapbot);

// Find scene setup in GAPbot to add theme listener
const oldGapbotScene = `  const scene = new THREE.Scene();`;
const newGapbotScene = `  const scene = new THREE.Scene();
  window.EventBus.on('themeChanged', (theme) => {
    // Basic dynamic response to theme
    if(theme === 'light') {
       scene.background = new THREE.Color(0xf8f9fa);
       if(container) container.style.background = 'radial-gradient(circle at center, rgba(0, 123, 181, 0.05), transparent 70%)';
    } else {
       scene.background = null;
       if(container) container.style.background = 'radial-gradient(circle at center, rgba(0, 255, 194, 0.05), transparent 70%)';
    }
  });`;
content = content.replace(oldGapbotScene, newGapbotScene);

// Add event listener to AISimulator
const oldAISimInit = `    this.init();`;
const newAISimInit = `    this.init();
    window.EventBus.on('themeChanged', (theme) => {
      if(theme === 'light') {
         this.canvas.style.filter = 'contrast(1.2) sepia(0) hue-rotate(0deg) saturate(1)';
      } else {
         this.canvas.style.filter = 'contrast(1.5) sepia(1) hue-rotate(100deg) saturate(2)';
      }
    });`;
content = content.replace(oldAISimInit, newAISimInit);

fs.writeFileSync('app.js', content, 'utf8');
console.log('EventBus patch applied');
