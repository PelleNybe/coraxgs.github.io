const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// Update init3DGAPbot to use ResizeObserver for scaling
const oldRendererCode = `  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);`;

const newRendererCode = `  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });
  resizeObserver.observe(container);`;

content = content.replace(oldRendererCode, newRendererCode);

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

// The old animate loop code has 'if (!isVisible) return;' so let's match that carefully
if (content.includes('  // Animation Loop\n  let time = 0;\n  function animate() {\n    if (!isVisible) return;\n    requestAnimationFrame(animate);')) {
    content = content.replace(
        `  // Animation Loop\n  let time = 0;\n  function animate() {\n    if (!isVisible) return;\n    requestAnimationFrame(animate);`,
        newAnimateLoop
    );
} else {
    console.log('Animate loop for GAPbot not found or different');
}


// HologramInteractive already has a ResizeObserver and animation pausing logic

fs.writeFileSync('app.js', content, 'utf8');
console.log('Canvas optimizations applied');
