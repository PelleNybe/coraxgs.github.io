const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// Add IntersectionObserver to pause requestAnimationFrame in GAPbot
const oldAnimateLoop = `  // Animation Loop
  let time = 0;
  function animate() {
    if (!isVisible) return;
    requestAnimationFrame(animate);`;

const newAnimateLoop = `  // Animation Loop
  let time = 0;
  let isIntersecting = true;

  const gapbotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) animate();
    });
  }, { threshold: 0.1 });
  gapbotObserver.observe(container);

  function animate() {
    if (!isVisible || !isIntersecting) return;
    requestAnimationFrame(animate);`;

content = content.replace(oldAnimateLoop, newAnimateLoop);

fs.writeFileSync('app.js', content, 'utf8');
console.log('Canvas optimization 3 applied');
