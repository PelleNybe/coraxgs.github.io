const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf8');

const technicalImprovements = `
## 🛠️ Latest Technical Improvements

1. **Web Worker Data Fetching:** Offloaded GitHub API polling to a background \`Worker\`, completely unblocking the main thread during data acquisition.
2. **EventBus Architecture:** Implemented a central PubSub \`EventBus\` for decoupled component communication (e.g., dynamic theme switching in 3D canvases without reloads).
3. **Canvas Intersection & Resize Observers:** Canvases now automatically pause their \`requestAnimationFrame\` loop when off-screen via \`IntersectionObserver\`, and scale cleanly to \`devicePixelRatio\` via \`ResizeObserver\`.
4. **Advanced Service Worker (PWA):** Upgraded \`sw.js\` to utilize a *Stale-While-Revalidate* strategy for static assets and a *Network-First* fallback strategy for critical API requests.
5. **TTL-based Caching Manager:** Implemented a robust \`CacheManager\` with Time-To-Live validation for \`localStorage\`, automatically purging stale GitHub and Web3 connection data.

## 🎨 Latest Visual Enhancements

1. **Cyber Custom Scrollbar:** Replaced the default browser scrollbar with a sleek, neon-tracked cyber design that matches the site's dark aesthetic, alongside neon text-selection highlighting.
2. **Advanced Glassmorphism:** Elevated UI cards with multi-layered glass effects (\`backdrop-filter\`, blur, saturation) and hardware-accelerated subtle gradient borders via CSS masking.
3. **GSAP Scroll Reveal Stagger:** Integrated GSAP \`ScrollTrigger\` to orchestrate staggered reveal animations for section headers and content blocks as they enter the viewport.
4. **Contextual Morphing Cursor:** The custom cursor now detects interactive elements and changes form, displaying context-aware text (e.g., "DRAG" over 3D models, "OPEN" over external links).
5. **Scanning Laser UI Effect:** Added an animated, glowing CSS scanning laser effect that sweeps across terminal windows and code blocks, enhancing the sci-fi immersion.
`;

if (!content.includes('## 🛠️ Latest Technical Improvements')) {
    content = content.replace('## 🌟 The Vision', technicalImprovements + '\n## 🌟 The Vision');
    fs.writeFileSync('README.md', content, 'utf8');
    console.log('README patched');
} else {
    console.log('README already patched');
}
