const fs = require('fs');
let content = fs.readFileSync('styles.css', 'utf8');

// Find and enhance project-card
const oldProjectCard = `.project-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
}`;

const newProjectCard = `.project-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-soft);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: var(--border-radius);
  padding: 1px;
  background: linear-gradient(135deg, rgba(0,255,204,0.3), rgba(255,255,255,0));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`;

content = content.replace(oldProjectCard, newProjectCard);

fs.writeFileSync('styles.css', content, 'utf8');
console.log('Glassmorphism patch applied');
