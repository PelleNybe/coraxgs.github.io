const fs = require('fs');

// V1: Advanced Loading Screen
let indexHtml = fs.readFileSync('index.html', 'utf8');
const loadingScreenHtml = `
  <!-- V1: Advanced Loading Screen -->
  <div id="corax-os-boot" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: var(--primary-color); font-family: monospace; transition: opacity 1s ease-out;">
    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem; text-shadow: 0 0 20px var(--primary-color);">CORAX_OS v2.0</div>
    <div id="boot-progress-bar" style="width: 300px; height: 4px; background: rgba(0,255,194,0.2); position: relative; border-radius: 2px; overflow: hidden; margin-bottom: 1rem;">
      <div id="boot-progress-fill" style="width: 0%; height: 100%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-color); transition: width 0.1s;"></div>
    </div>
    <div id="boot-status-text" style="font-size: 0.8rem; color: var(--text-muted); min-height: 1.2rem;">Initializing boot sequence...</div>
  </div>
`;

indexHtml = indexHtml.replace('<body>', '<body>' + loadingScreenHtml);
fs.writeFileSync('index.html', indexHtml);

// App JS modifications
let appJs = fs.readFileSync('app.js', 'utf8');

// Advanced Boot logic in CoraxWebsite.init()
appJs = appJs.replace(
  `  async init() {
    CoraxAnalytics.init();`,
  `  async init() {
    CoraxAnalytics.init();

    // V1: Advanced Loading Screen Logic
    const bootScreen = document.getElementById('corax-os-boot');
    const bootFill = document.getElementById('boot-progress-fill');
    const bootText = document.getElementById('boot-status-text');

    if (bootScreen) {
      const steps = [
        { progress: 20, text: "Loading Kernel Modules..." },
        { progress: 40, text: "Mounting Virtual DOM..." },
        { progress: 60, text: "Initializing Swarm Protocols..." },
        { progress: 80, text: "Establishing Secure Edge Uplink..." },
        { progress: 100, text: "System Ready." }
      ];

      for (const step of steps) {
        bootFill.style.width = step.progress + '%';
        bootText.textContent = step.text;
        await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
      }

      bootScreen.style.opacity = '0';
      setTimeout(() => bootScreen.remove(), 1000);
    }
`
);

// V2: Particle Swarm Reactivity
appJs = appJs.replace(
  `      // Update shader uniforms
      this.particles.material.uniforms.time.value = performance.now() * 0.001;
      this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y, 0);`,
  `      // V2: Particle Swarm Reactivity (Scroll speed affects rotation)
      const scrollSpeed = Math.abs(window.scrollY - (this.lastScrollY || 0));
      this.lastScrollY = window.scrollY;
      const rotationBoost = Math.min(scrollSpeed * 0.0001, 0.05);

      this.particles.rotation.x += 0.0005 + rotationBoost;
      this.particles.rotation.y += 0.001 + rotationBoost;

      // Click ripple effect via event bus or local logic
      if (this.rippleTime > 0) {
        this.rippleTime -= 0.05;
        this.particles.material.uniforms.time.value += this.rippleTime * 0.1;
      }

      // Update shader uniforms
      this.particles.material.uniforms.time.value = performance.now() * 0.001;
      this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y, 0);`
);

appJs = appJs.replace(
  `    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));`,
  `    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // V2: Click ripple
    this.rippleTime = 0;
    window.addEventListener('click', () => { this.rippleTime = 2.0; });`
);

// V5: 3D Card Parallax Depth
appJs = appJs.replace(
  `    // Apply 3D transform
    card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;`,
  `    // V5: 3D Card Parallax Depth (Enhanced Transform)
    card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)\`;

    // Animate children dynamically based on depth
    const children = card.querySelectorAll(':scope > *:not(.tilt-card-glare)');
    children.forEach((child, index) => {
      // Deeper elements move more
      const depth = (index + 1) * 10;
      child.style.transform = \`translateZ(\${depth}px) translateX(\${rotateY * 0.5}px) translateY(\${-rotateX * 0.5}px)\`;
    });`
);

appJs = appJs.replace(
  `    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';`,
  `    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    // Reset V5 parallax children
    const children = card.querySelectorAll(':scope > *:not(.tilt-card-glare)');
    children.forEach((child) => {
      child.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      child.style.transform = 'translateZ(30px) translateX(0px) translateY(0px)';
    });`
);

fs.writeFileSync('app.js', appJs);

// CSS Modifications for V3 and V4
let css = fs.readFileSync('styles.css', 'utf8');

const enhancedVisualsCss = `
/* V3: Glowing Form Fields */
input[type="text"], input[type="email"], textarea {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 194, 0.3);
  color: var(--text-primary);
  padding: 10px 15px;
  border-radius: var(--border-radius-small);
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

input[type="text"]:focus, input[type="email"]:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(0, 255, 194, 0.4), inset 0 0 10px rgba(0, 255, 194, 0.1);
  background: rgba(0, 255, 194, 0.05);
}

/* V4: Enhanced Navigation Bar (Pill Shape on Scroll) */
nav {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  top: 0;
  width: 100%;
}

nav.scrolled {
  top: 20px;
  width: calc(100% - 40px);
  max-width: var(--max-width);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50px;
  background: rgba(10, 10, 10, 0.85);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0, 255, 194, 0.2);
  border: 1px solid rgba(0, 255, 194, 0.3);
  padding: 8px 0;
}

@media (max-width: 768px) {
  nav.scrolled {
    width: calc(100% - 20px);
    top: 10px;
    border-radius: 25px;
  }
}

/* Override input styling inside terminal to fit aesthetic */
#terminal-input {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  caret-color: var(--primary-color);
}
#terminal-input:focus {
  box-shadow: none !important;
  background: transparent !important;
}
`;

css += enhancedVisualsCss;
fs.writeFileSync('styles.css', css);

console.log('Visual improvements patched in app.js, index.html, and styles.css');
