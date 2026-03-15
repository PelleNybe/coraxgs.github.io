const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf8');
const blogSection = `
  <!-- Insights & Updates Section (Blog) -->
  <section id="insights">
    <h2 class="section-title">Insights & Updates</h2>
    <p class="section-subtitle">
      Deep dives into our neuro-symbolic AI models, hardware iterations, and Web3 infrastructure developments.
    </p>

    <div id="blog-grid" class="projects-grid" style="margin-top: 2rem;">
      <!-- Blog posts will be loaded here dynamically via app.js -->
    </div>
  </section>
`;

// Insert before the contact section
const modifiedIndex = indexContent.replace('  <!-- Web3 Integration Demo -->', blogSection + '\n  <!-- Web3 Integration Demo -->');
fs.writeFileSync('index.html', modifiedIndex);

const appContent = fs.readFileSync('app.js', 'utf8');
const blogLogic = `
// Feature: Insights & Updates (Blog)
class BlogSystem {
  constructor() {
    this.container = document.getElementById('blog-grid');
    if (!this.container) return;

    // Simulate fetching markdown posts or an API endpoint
    this.posts = [
      {
        title: 'Optimizing YOLOv8-Seg for Hailo-8L Edge Accelerators',
        date: '2024-03-15',
        excerpt: 'A deep dive into how we achieved ultra-low latency inference for the GAPbot vision system without compromising on segmentation accuracy.',
        readTime: '8 min read',
        tag: 'Edge AI'
      },
      {
        title: 'Swarm Consensus: Beyond Basic Algorithms',
        date: '2024-02-28',
        excerpt: 'Exploring our custom implementation of the Consensus-Based Bundle Algorithm (CBBA) for decentralized task allocation among multiple GAPbot units.',
        readTime: '12 min read',
        tag: 'Robotics'
      },
      {
        title: 'Integrating Post-Quantum Cryptography in MQTT',
        date: '2024-02-10',
        excerpt: 'Why we are future-proofing our IoT communications now, and how we implemented PQC algorithms to secure the GAP platform data streams.',
        readTime: '10 min read',
        tag: 'Security'
      }
    ];

    this.init();
  }

  init() {
    this.renderPosts();
  }

  renderPosts() {
    this.container.innerHTML = '';

    this.posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'feature-card tilt-card';
      card.style.cssText = \`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2rem;
        cursor: pointer;
      \`;

      card.innerHTML = \`
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="tag" style="background: rgba(0, 255, 194, 0.1); color: var(--primary-color); border: 1px solid var(--primary-color);">\${post.tag}</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">\${post.date}</span>
          </div>
          <h3 style="margin-bottom: 1rem; line-height: 1.4; font-size: 1.2rem;">\${post.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">\${post.excerpt}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <span style="color: var(--text-muted); font-size: 0.8rem;">⏱️ \${post.readTime}</span>
          <span style="color: var(--primary-color); font-size: 0.9rem; font-weight: 500;">Read Article &rarr;</span>
        </div>
      \`;

      card.addEventListener('click', () => {
        // In a real app, this would open a modal or navigate to the article page
        alert(\`Opening article: "\${post.title}".\\n\\nIn a full deployment, this would load the markdown content.\`);
        if(window.plausible) window.plausible('Blog Read Click', {props: {title: post.title}});
      });

      this.container.appendChild(card);
    });

    // Re-initialize tilt effect for new cards
    if(typeof TiltEffect !== 'undefined') {
       new TiltEffect();
    }
  }
}
`;

const newAppContent = appContent.replace("new Web3Demo();", "new Web3Demo();\n      new BlogSystem();");
fs.writeFileSync('app.js', newAppContent + '\n' + blogLogic);
