const fs = require('fs');
let readme = fs.readFileSync('README.md', 'utf8');

const technicalImprovements = `
### Advanced Technical Improvements (v2.0)
1. **Dynamic Event Bus Architecture:** Implemented a robust global \`EventBus\` for decoupled state management across complex components like Web3 connectivity and Theme toggling.
2. **Resilient API Fetching:** Upgraded the GitHub integration with exponential backoff and retry mechanisms to gracefully handle API rate limiting.
3. **Optimized WebGL Rendering:** Introduced \`IntersectionObserver\` integration for heavy Three.js scenes (Swarm and GAPbot). Render loops now automatically pause when out of the viewport, significantly reducing CPU/GPU overhead.
4. **Web3 Session Persistence:** Enhanced the dApp experience by persisting Ethereum connection states using \`localStorage\`, allowing silent reconnections and a seamless user experience.
5. **Robust CSS Architecture:** Refactored the theming system to leverage \`data-theme\` attributes on the root HTML element, deeply scoping CSS Custom Properties for cleaner, more scalable code.
`;

const visualImprovements = `
### World-Class Visual Improvements (v2.0)
1. **Interactive Corax OS Boot Screen:** A brand new, immersive terminal-style boot sequence overlay masks the initial load, providing a futuristic first impression.
2. **Reactive Swarm Intelligence:** The WebGL particle swarm now dynamically reacts to user scrolling (increased rotation velocity) and clicks (ripple distortion effect).
3. **Immersive 3D Parallax Cards:** Upgraded the \`TiltEffect\` to utilize true Z-axis translation on child elements, creating a stunning holographic depth effect as cards tilt.
4. **Pill-Shaped Dynamic Navbar:** The navigation bar now elegantly morphs from a full-width header into a sleek, floating pill shape with dynamic glassmorphism when scrolling down the page.
5. **Cyberpunk Form Interactions:** Input fields and terminal interfaces now feature custom, high-tech glowing focus states that align perfectly with the deep-tech aesthetic.
`;

const imagesMarkup = `
## 📸 v2.0 Feature Showcase

<div align="center">
  <table style="border: none;">
    <tr>
      <td align="center"><img src="images/v1_boot_screen.png" alt="Corax OS Boot Sequence" width="400" style="border-radius: 8px;" /><br><b>Corax OS Boot Sequence</b></td>
      <td align="center"><img src="images/v2_main_hero.png" alt="Reactive Particle Swarm" width="400" style="border-radius: 8px;" /><br><b>Reactive Particle Swarm</b></td>
    </tr>
    <tr>
      <td align="center"><img src="images/v4_scrolled_nav.png" alt="Dynamic Floating Navbar" width="400" style="border-radius: 8px;" /><br><b>Dynamic Floating Navbar</b></td>
      <td align="center"><img src="images/v5_3d_parallax_card.png" alt="3D Parallax Depth Cards" width="400" style="border-radius: 8px;" /><br><b>3D Parallax Depth Cards</b></td>
    </tr>
  </table>
</div>
`;

// Insert after "## 🚀 Recent Improvements"
readme = readme.replace('## 🚀 Recent Improvements\n\nWe have recently shipped significant updates to the platform to ensure optimal performance, accessibility, and visual fidelity:', '## 🚀 Recent Improvements\n\n' + technicalImprovements + '\n' + visualImprovements + '\n' + imagesMarkup + '\n\n### Legacy Improvements (v1.0)\nWe have recently shipped significant updates to the platform to ensure optimal performance, accessibility, and visual fidelity:');

fs.writeFileSync('README.md', readme);
console.log('README.md patched successfully.');
