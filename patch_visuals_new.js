const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Vis 1: Enhanced 3D GAPbot Configurator (Add lights and shadows)
appJs = appJs.replace(
  `  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));`,
  `  // Vis 1: Enhanced Lighting
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(10, 20, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x00ffc2, 0.8);
  fillLight.position.set(-10, 5, -10);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xff00ff, 1, 50);
  rimLight.position.set(0, 15, -10);
  scene.add(rimLight);

  scene.add(new THREE.AmbientLight(0x202020));

  // Floor for shadows
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3;
  floor.receiveShadow = true;
  scene.add(floor);`
);

// Vis 2: Advanced AI Simulator Visuals (LiDAR effect)
appJs = appJs.replace(
  `    for (let x = 0; x < w; x += 4) {
      for (let y = 0; y < h; y += 4) {
        const noise = (Math.sin(x * 0.05 + this.zOff) + Math.cos(y * 0.05 + this.zOff)) * 50;
        const depth = Math.floor(128 + noise);

        this.ctx.fillStyle = \`rgb(\${depth}, \${Math.floor(depth*0.5)}, \${255 - depth})\`;
        if(this.scenario === 'pest' && Math.random() > 0.98) this.ctx.fillStyle = 'red';
        if(this.scenario === 'drought' && Math.random() > 0.95) this.ctx.fillStyle = 'orange';

        this.ctx.fillRect(x, y, 4, 4);
      }
    }`,
  `    // Vis 2: Advanced LiDAR Simulation
    const imageData = this.ctx.createImageData(w, h);
    const data = imageData.data;
    const centerX = w / 2;
    const centerY = h / 2;

    for (let x = 0; x < w; x+=2) {
      for (let y = 0; y < h; y+=2) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // LiDAR scanlines and radial waves
        const scanline = (y + this.zOff * 20) % 20 < 2 ? 255 : 0;
        const wave = Math.sin(dist * 0.1 - this.zOff * 5) * 128 + 128;
        const noise = Math.random() * 50;

        let r = 0, g = wave * 0.8 + scanline * 0.2 + noise, b = wave + scanline * 0.5;

        if (this.scenario === 'pest' && dist < 50 && Math.random() > 0.8) {
           r = 255; g = 50; b = 50;
        } else if (this.scenario === 'drought' && dist > 30 && dist < 80) {
           r = 255; g = 150; b = 0;
        }

        const idx = (y * w + x) * 4;
        data[idx] = r;
        data[idx+1] = g;
        data[idx+2] = b;
        data[idx+3] = 255; // Alpha

        // Fill 2x2 blocks for performance
        if(x+1<w) { data[idx+4]=r; data[idx+5]=g; data[idx+6]=b; data[idx+7]=255; }
        const idxNextRow = ((y+1) * w + x) * 4;
        if(y+1<h) { data[idxNextRow]=r; data[idxNextRow+1]=g; data[idxNextRow+2]=b; data[idxNextRow+3]=255; }
        if(x+1<w && y+1<h) { data[idxNextRow+4]=r; data[idxNextRow+5]=g; data[idxNextRow+6]=b; data[idxNextRow+7]=255; }
      }
    }
    this.ctx.putImageData(imageData, 0, 0);`
);

// Vis 3: Interactive Hologram Upgrades (SVG Lines glow)
indexHtml = indexHtml.replace(
  `          <line
            x1="50%"
            y1="20%"
            x2="20%"
            y2="50%"
            stroke="var(--primary-color)"
            stroke-width="2"
          />`,
  `          <!-- Vis 3: Glowing SVG Lines -->
          <line x1="50%" y1="20%" x2="20%" y2="50%" stroke="var(--primary-color)" stroke-width="3" style="filter: drop-shadow(0 0 5px var(--primary-color)); animation: dash 5s linear infinite; stroke-dasharray: 10, 5;" />
          <style>@keyframes dash { to { stroke-dashoffset: -50; } }</style>`
);

// Vis 4: Hero Particle Swarm Interactivity
appJs = appJs.replace(
  `    this.scene.add(this.particles);`,
  `    this.scene.add(this.particles);

    // Vis 4: Interactive attractor point for swarm
    this.attractor = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
        this.mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVec, this.camera);
        this.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1), 0), this.attractor);
    });`
);
appJs = appJs.replace(
  `      // Update shader uniforms
      this.particles.material.uniforms.time.value = performance.now() * 0.001;`,
  `      // Vis 4: Swarm behavior
      const positions = this.particles.geometry.attributes.position.array;
      const time = performance.now() * 0.001;
      for(let i=0; i<this.particleCount; i++) {
         const i3 = i*3;
         const px = positions[i3];
         const py = positions[i3+1];
         // Very basic attraction logic in JS (for demo, real would be in shader)
         const dx = this.attractor.x - px;
         const dy = this.attractor.y - py;
         const dist = Math.sqrt(dx*dx + dy*dy);
         if(dist < 200 && dist > 10) {
             positions[i3] += dx * 0.001;
             positions[i3+1] += dy * 0.001;
         }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;

      // Update shader uniforms
      this.particles.material.uniforms.time.value = time;`
);

// Vis 5: Theme Transition ripples
appJs = appJs.replace(
  `  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", this.theme);`,
  `  setTheme(theme, event) {
    this.theme = theme;

    // Vis 5: Theme transition effect
    if (event) {
      const x = event.clientX;
      const y = event.clientY;
      const ripple = document.createElement('div');
      ripple.style.cssText = \`
        position: fixed; top: \${y}px; left: \${x}px;
        width: 10px; height: 10px; background: var(--primary-color);
        border-radius: 50%; z-index: 9999999;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.8s ease-out, opacity 0.8s ease-out;
        pointer-events: none; opacity: 0.5; mix-blend-mode: screen;
      \`;
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(300)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 800);
    }

    document.documentElement.setAttribute("data-theme", this.theme);`
);
appJs = appJs.replace(
  `btn.addEventListener('click', () => {`,
  `btn.addEventListener('click', (e) => {`
);
appJs = appJs.replace(
  `        this.setTheme(themeName);`,
  `        this.setTheme(themeName, e);`
);

fs.writeFileSync('app.js', appJs);
fs.writeFileSync('index.html', indexHtml);
console.log('Visual improvements patched.');
