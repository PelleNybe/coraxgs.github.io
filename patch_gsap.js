const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

const oldGSAP = `  // Fade up headers
  gsap.utils.toArray('.section-title').forEach(title => {`;

const newGSAP = `  // Visual Improvement 3: GSAP Scroll Reveal Stagger
  // Animate content blocks
  gsap.utils.toArray('.content-block').forEach(block => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Fade up headers
  gsap.utils.toArray('.section-title').forEach(title => {`;

content = content.replace(oldGSAP, newGSAP);

fs.writeFileSync('app.js', content, 'utf8');
console.log('GSAP patch applied');
