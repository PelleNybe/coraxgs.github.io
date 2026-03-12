// Corax CoLAB Enhanced Website JavaScript v2.0

// Performance and Analytics
const CoraxAnalytics = {
  startTime: performance.now(),
  loadTime: 0,
  apiCallCount: 0,
  errors: [],

  init() {
    this.trackErrors();
    this.trackPerformance();
  },

  trackErrors() {
    window.addEventListener("error", (event) => {
      this.errors.push({
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        timestamp: new Date().toISOString(),
      });
    });
  },

  trackPerformance() {
    window.addEventListener("load", () => {
      this.loadTime = performance.now() - this.startTime;
      console.log(`🚀 Page loaded in ${this.loadTime.toFixed(2)}ms`);

      // Send to analytics (if configured)
      if (window.plausible) {
        window.plausible("Performance", {
          props: { loadTime: Math.round(this.loadTime) },
        });
      }
    });
  },
};

// Enhanced GitHub API with caching and rate limiting
class GitHubAPI {
  constructor(username) {
    this.username = username;
    this.cache = new Map();
    this.lastRequest = 0;
    this.rateLimitDelay = 100; // ms between requests
  }

  async fetchWithCache(endpoint, options = {}) {
    const cacheKey = endpoint + JSON.stringify(options);

    // Check cache (5 minute TTL)
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) {
        return cached.data;
      }
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest),
      );
    }

    try {
      this.lastRequest = Date.now();
      CoraxAnalytics.apiCallCount++;

      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Cache successful responses
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("GitHub API request failed:", error);
      throw error;
    }
  }

  async getRepos(options = {}) {
    const { sort = "updated", per_page = 20 } = options;
    return this.fetchWithCache(
      `https://api.github.com/users/${this.username}/repos?sort=${sort}&per_page=${per_page}`,
    );
  }

  async getUser() {
    return this.fetchWithCache(`https://api.github.com/users/${this.username}`);
  }

  async getRepoStats(repoName) {
    const [repo, contributors, languages] = await Promise.allSettled([
      this.fetchWithCache(
        `https://api.github.com/repos/${this.username}/${repoName}`,
      ),
      this.fetchWithCache(
        `https://api.github.com/repos/${this.username}/${repoName}/contributors`,
      ),
      this.fetchWithCache(
        `https://api.github.com/repos/${this.username}/${repoName}/languages`,
      ),
    ]);

    return {
      repo: repo.status === "fulfilled" ? repo.value : null,
      contributors:
        contributors.status === "fulfilled" ? contributors.value : [],
      languages: languages.status === "fulfilled" ? languages.value : {},
    };
  }
}

// Enhanced Project Renderer
class ProjectRenderer {
  constructor(container, errorContainer, loadingContainer) {
    this.container = container;
    this.errorContainer = errorContainer;
    this.loadingContainer = loadingContainer;
    this.languageColors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#dea584",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      Dockerfile: "#384d54",
      Vue: "#4FC08D",
      React: "#61DAFB",
      PHP: "#777BB4",
      Ruby: "#701516",
      Swift: "#FA7343",
      Kotlin: "#F18E33",
    };
  }

  showLoading() {
    this.loadingContainer.style.display = "flex";
    this.container.style.display = "none";
    this.errorContainer.style.display = "none";
  }

  showError(message) {
    this.loadingContainer.style.display = "none";
    this.container.style.display = "none";
    this.errorContainer.style.display = "block";

    const errorTitle = "⚠️ Could not load projects";
    const errorDescription =
      "There was a problem fetching our GitHub repositories. Visit our";
    const linkText = "GitHub profile";

    this.errorContainer.innerHTML = `
      <h3>${errorTitle}</h3>
      <p>${message}</p>
      <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
        ${errorDescription} <a href="https://github.com/coraxgs" target="_blank" style="color: var(--primary-color);">${linkText}</a> 
        directly to see all projects.
      </p>
    `;
  }

  showProjects(repos) {
    this.loadingContainer.style.display = "none";
    this.errorContainer.style.display = "none";
    this.container.style.display = "grid";
    this.container.innerHTML = "";

    if (!repos || repos.length === 0) {
      const noReposMessage = "No public repositories found.";
      this.showError(noReposMessage);
      return;
    }

    const filteredRepos = this.filterAndSortRepos(repos);
    filteredRepos.slice(0, 12).forEach((repo) => {
      this.container.appendChild(this.createProjectCard(repo));
    });

    // Add "View all" card if there are more repos
    if (repos.length > filteredRepos.length || filteredRepos.length > 12) {
      this.container.appendChild(this.createViewAllCard(repos.length));
    }
  }

  filterAndSortRepos(repos) {
    return repos
      .filter((repo) => !repo.fork && !repo.name.includes(".github.io"))
      .sort((a, b) => {
        const scoreA = this.calculateRepoScore(a);
        const scoreB = this.calculateRepoScore(b);
        return scoreB - scoreA;
      });
  }

  calculateRepoScore(repo) {
    let score = 0;

    // Star weight
    score += (repo.stargazers_count || 0) * 10;

    // Fork weight
    score += (repo.forks_count || 0) * 5;

    // Description bonus
    if (repo.description && repo.description.length > 10) score += 15;

    // Recent activity bonus
    const lastUpdate = new Date(repo.updated_at);
    const daysSinceUpdate =
      (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) score += 10;
    if (daysSinceUpdate < 7) score += 5;

    // Language bonus
    if (repo.language) score += 5;

    // Topics bonus
    if (repo.topics && repo.topics.length > 0) score += repo.topics.length * 2;

    // Homepage bonus
    if (repo.homepage) score += 8;

    return score;
  }

  createProjectCard(repo) {
    const card = document.createElement("github-repo-card");
    card.setAttribute("title", repo.name);
    card.setAttribute(
      "description",
      repo.description ||
        "An exciting project from Corax CoLAB exploring new technical possibilities.",
    );
    card.setAttribute("url", repo.html_url);

    let tags = [];
    if (repo.language) tags.push(repo.language);
    if (repo.topics) tags = tags.concat(repo.topics.slice(0, 3));
    if (tags.length > 0) {
      card.setAttribute("tags", tags.join(","));
    }

    return card;
  }

  createViewAllCard(totalCount) {
    const card = document.createElement("div");
    card.className = "project-card view-all-card";
    card.style.background = "var(--gradient-primary)";
    card.style.color = "white";
    card.style.textAlign = "center";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="view-all-content">
        <h3 style="color: white; margin-bottom: 1rem;">More projects</h3>
        <p style="color: rgba(255,255,255,0.9); margin-bottom: 2rem;">
          We have more exciting projects on our GitHub profile. Click here to explore them all!
        </p>
        <div style="font-size: 2rem; margin-bottom: 1rem;">🚀</div>
        <div style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
          Total ${totalCount} public repositories
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.open("https://github.com/coraxgs?tab=repositories", "_blank");
      if (window.plausible) {
        window.plausible("View All Projects Click");
      }
    });

    return card;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

// Main Application
class CoraxWebsite {
  constructor() {
    this.githubAPI = new GitHubAPI("coraxgs");
    this.projectRenderer = new ProjectRenderer(
      document.getElementById("projects-grid"),
      document.getElementById("error-message"),
      document.getElementById("loading"),
    );
    this.mobileMenuOpen = false;
    this.theme = "dark";
  }

  async init() {
    CoraxAnalytics.init();
    this.initializeTheme();
    this.setupEventListeners();
    await this.loadProjects();
    this.setupIntersectionObserver();
    this.setupPWA();

    // Mark page as loaded
    document.body.classList.add("loaded");
  }

  initializeTheme() {
    this.theme = localStorage.getItem("corax-theme") || "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    this.updateThemeButton();
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("corax-theme", this.theme);
    this.updateThemeButton();

    if (window.plausible) {
      window.plausible("Theme Toggle", { props: { theme: this.theme } });
    }
  }

  updateThemeButton() {
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = this.theme === "dark" ? "☀️" : "🌙";
      button.setAttribute(
        "aria-label",
        this.theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme",
      );
    }
  }

  setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => this.toggleMobileMenu());
    }

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Scroll events
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Close mobile menu if open
          if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    });

    // Logo scroll to top
    const logo = document.querySelector(".logo");
    if (logo) {
      logo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  handleScroll() {
    // Navbar scroll effect
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update scroll progress
    this.updateScrollProgress();
  }

  updateScrollProgress() {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = Math.min((window.scrollY / windowHeight) * 100, 100);

    let progressBar = document.getElementById("scroll-progress");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = "scroll-progress";
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ffcc, #0066ff);
        z-index: 10001;
        transition: width 0.2s ease;
        pointer-events: none;
      `;
      document.body.appendChild(progressBar);
    }

    progressBar.style.width = `${scrolled}%`;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const overlay = document.getElementById("mobile-nav-overlay");
    const btn = document.getElementById("mobile-menu-btn");

    if (this.mobileMenuOpen) {
      overlay.classList.add("active");
      btn.classList.add("active");
      document.body.style.overflow = "hidden";
      btn.setAttribute("aria-expanded", "true");
    } else {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    const overlay = document.getElementById("mobile-nav-overlay");
    const btn = document.getElementById("mobile-menu-btn");

    overlay.classList.remove("active");
    btn.classList.remove("active");
    document.body.style.overflow = "";
    btn.setAttribute("aria-expanded", "false");
  }

  async loadProjects() {
    try {
      this.projectRenderer.showLoading();

      const [repos, user] = await Promise.all([
        this.githubAPI.getRepos(),
        this.githubAPI.getUser().catch(() => null),
      ]);

      this.projectRenderer.showProjects(repos);

      if (window.plausible) {
        window.plausible("Projects Loaded", {
          props: { count: repos.length, apiCalls: CoraxAnalytics.apiCallCount },
        });
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      const errorMsg = `There was a problem fetching our GitHub repositories: ${error.message}`;
      this.projectRenderer.showError(errorMsg);

      if (window.plausible) {
        window.plausible("Projects Load Error", {
          props: { error: error.message },
        });
      }
    }
  }

  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll(
      "section, .feature-card, .project-card, .stat-card",
    );

    elementsToObserve.forEach((element) => {
      element.classList.add("animate-ready");
      observer.observe(element);
    });
  }

  setupPWA() {
    // Service Worker registration
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration);
          })
          .catch((error) => {
            console.log("❌ Service Worker registration failed:", error);
          });
      });
    }

    // Install prompt
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Show install button after a delay
      setTimeout(() => {
        this.showInstallPrompt(deferredPrompt);
      }, 10000); // 10 seconds delay
    });
  }

  showInstallPrompt(deferredPrompt) {
    const installBtn = document.createElement("button");
    installBtn.innerHTML = "📱 Install app";
    installBtn.className = "install-prompt-btn";
    installBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00ffcc, #0066ff);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 255, 204, 0.3);
      transition: all 0.3s ease;
      font-size: 0.9rem;
      animation: slideInRight 0.3s ease;
    `;

    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (window.plausible) {
          window.plausible("PWA Install Prompt", { props: { outcome } });
        }

        deferredPrompt = null;
        installBtn.remove();
      }
    });

    // Add close button
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      position: absolute;
      top: -5px;
      right: 5px;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
    `;
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      installBtn.remove();
    });

    installBtn.appendChild(closeBtn);
    document.body.appendChild(installBtn);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (installBtn.parentNode) {
        installBtn.remove();
      }
    }, 30000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize main application
  const app = new CoraxWebsite();
  app.init().catch(console.error);
});

// Export for potential external use
window.CoraxWebsite = CoraxWebsite;
// ==========================================
// 5 NEW WORLD CLASS FEATURES IMPLEMENTATION
// ==========================================

// Feature 1: Interactive Neural Network Canvas
// Feature 1: Advanced Swarm Intelligence Canvas
class NeuralNetwork {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    // Create WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Replace the 2D canvas with WebGL canvas
    if (this.container.tagName === 'CANVAS') {
      const parent = this.container.parentNode;
      const newContainer = document.createElement('div');
      newContainer.id = containerId;
      newContainer.style.position = 'fixed';
      newContainer.style.top = '0';
      newContainer.style.left = '0';
      newContainer.style.width = '100%';
      newContainer.style.height = '100%';
      newContainer.style.zIndex = '-1';
      newContainer.style.pointerEvents = 'none';
      newContainer.style.opacity = '0.8';
      parent.replaceChild(newContainer, this.container);
      this.container = newContainer;
    }

    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    // Dark background for deep tech feel
    // Fog for depth
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 500;

    this.particles = null;
    this.particleCount = window.innerWidth < 768 ? 1000 : 3000;
    this.mouse = new THREE.Vector2(0, 0);
    this.target = new THREE.Vector2(0, 0);
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.init();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.animate();
  }

  init() {
    // Geometry for particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    const colorPrimary = new THREE.Color(0x00ffc2);
    const colorSecondary = new THREE.Color(0x1a73e8);

    for (let i = 0; i < this.particleCount; i++) {
      // Random positions in a sphere-like distribution
      const r = 800 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Mix colors
      const mixedColor = colorPrimary.clone().lerp(colorSecondary, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0, 0, 0) },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        uniform float time;
        uniform vec3 mouse;
        uniform float pixelRatio;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Organic movement
          pos.x += sin(time * 0.5 + pos.y * 0.01) * 10.0;
          pos.y += cos(time * 0.3 + pos.x * 0.01) * 10.0;
          pos.z += sin(time * 0.4 + pos.z * 0.01) * 10.0;

          // Mouse interaction (repel)
          float dist = distance(pos.xy, mouse.xy);
          if(dist < 200.0) {
            vec2 dir = normalize(pos.xy - mouse.xy);
            pos.xy += dir * (200.0 - dist) * 0.5;
            pos.z += (200.0 - dist) * 0.5; // push outward
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Circular particle with soft edge
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - (dist * 2.0);
          alpha = pow(alpha, 1.5); // Smoother falloff

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    this.target.x = (event.clientX - this.windowHalfX) * 2;
    this.target.y = -(event.clientY - this.windowHalfY) * 2;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Smooth mouse follow
    this.mouse.x += (this.target.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.target.y - this.mouse.y) * 0.05;

    if (this.particles) {
      // Rotate the entire swarm slowly
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.001;

      // Update shader uniforms
      this.particles.material.uniforms.time.value = performance.now() * 0.001;
      this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y, 0);
    }

    // Slight camera movement based on mouse for parallax
    this.camera.position.x += (this.mouse.x * 0.1 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 0.1 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

// Feature 2: Custom Cursor
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    this.follower = document.querySelector('.custom-cursor-follower');
    if (!this.cursor || !this.follower) return;

    // Check if device supports hover (not a mobile device usually)
    if (window.matchMedia("(any-hover: none)").matches) {
      this.cursor.style.display = 'none';
      this.follower.style.display = 'none';
      return;
    }

    this.pos = { x: 0, y: 0 };
    this.followerPos = { x: 0, y: 0 };
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;

      this.cursor.style.left = this.pos.x + 'px';
      this.cursor.style.top = this.pos.y + 'px';
    });

    const loop = () => {
      // Follower easing
      this.followerPos.x += (this.pos.x - this.followerPos.x) * 0.15;
      this.followerPos.y += (this.pos.y - this.followerPos.y) * 0.15;

      this.follower.style.left = this.followerPos.x + 'px';
      this.follower.style.top = this.followerPos.y + 'px';

      requestAnimationFrame(loop);
    };
    loop();

    // Hover effects on links/buttons
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Add magnetic effect to CTA buttons
    const magneticElements = document.querySelectorAll('.cta-button, .logo');
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }
}

// Feature 3: 3D Tilt Cards
// Feature 5: Holographic 3D Glass Cards (Tilt + Glare)
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.tilt-card');
    if (!this.cards.length) return;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      // Add glare element if not exists
      if (!card.querySelector('.tilt-card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', this.handleMouseMove.bind(this));
      card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none'; // Snappier follow
        const glare = card.querySelector('.tilt-card-glare');
        if (glare) glare.style.opacity = '1';
      });
    });
  }

  handleMouseMove(e) {
    const card = e.currentTarget;
    const glare = card.querySelector('.tilt-card-glare');
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center (0 to 1)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-15deg to +15deg max)
    const rotateX = ((y - centerY) / centerY) * -15; // Invert Y
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply 3D transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Move Glare gradient opposite to mouse
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
    }
  }

  handleMouseLeave(e) {
    const card = e.currentTarget;
    const glare = card.querySelector('.tilt-card-glare');

    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    if (glare) {
      glare.style.transition = 'opacity 0.5s ease';
      glare.style.opacity = '0';
    }
  }
}

// Feature 5: Terminal Boot Sequence
// Feature 4: Interactive AI Terminal
class TerminalBoot {
  constructor(elementId) {
    this.container = document.getElementById(elementId);
    if (!this.container) return;
    this.lines = [
      "Initializing Corax OS v2.0...",
      "Loading kernel modules...",
      "[OK] Swarm Intelligence loaded.",
      "[OK] Post-Quantum Cryptography initialized.",
      "[OK] Edge AI Node connected.",
      "Connection established. Awaiting command."
    ];
    this.currentLine = 0;
    this.container.innerHTML = ''; // Clear initial content
    this.init();
  }

  async init() {
    // Boot sequence
    for (let i = 0; i < this.lines.length; i++) {
      await this.typeLine(this.lines[i]);
    }
    this.setupInput();
  }

  async typeLine(text, delay = 50) {
    return new Promise(resolve => {
      const lineElement = document.createElement("div");
      lineElement.className = "terminal-line";
      this.container.appendChild(lineElement);

      let i = 0;
      const interval = setInterval(() => {
        lineElement.textContent += text.charAt(i);
        i++;
        this.container.scrollTop = this.container.scrollHeight;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(resolve, 200);
        }
      }, delay);
    });
  }

  setupInput() {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'terminal-input-line';
    inputContainer.innerHTML = '<span class="prompt">root@corax:~#</span> <input type="text" id="terminal-input" autocomplete="off" autofocus>';
    this.container.appendChild(inputContainer);

    const inputField = document.getElementById('terminal-input');

    // Focus input when terminal is clicked
    this.container.parentElement.addEventListener('click', () => {
      inputField.focus();
    });

    inputField.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const cmd = inputField.value.trim().toLowerCase();
        inputField.value = '';
        inputContainer.remove(); // Remove input to print response

        await this.typeLine(`root@corax:~# ${cmd}`, 10);
        await this.processCommand(cmd);

        this.setupInput(); // Re-add input after response
        inputField.focus();
      }
    });
  }

  async processCommand(cmd) {
    switch (cmd) {
      case 'help':
        await this.typeLine("Available commands:");
        await this.typeLine("  status   - Show system diagnostics");
        await this.typeLine("  analyze  - Run environmental analysis");
        await this.typeLine("  deploy   - Initialize GAPbot swarm protocol");
        await this.typeLine("  clear    - Clear terminal output");
        break;
      case 'status':
        await this.typeLine("[System Status]");
        await this.typeLine("- Edge Nodes: 4/4 Online");
        await this.typeLine("- Swarm Latency: < 5ms");
        await this.typeLine("- Compliance Logic: ACTIVE (EU AI Act Compliant)");
        await this.typeLine("- GAPbot Fleet: Idle, charging via MPPT.");
        break;
      case 'analyze':
        await this.typeLine("Initiating Edge AI analysis (YOLOv8-Seg)...");
        await this.typeLine("[██████████] 100%");
        await this.typeLine("Result: Nominal. Resource usage optimized by 42%.");
        break;
      case 'deploy':
        await this.typeLine("WARNING: Authorized personnel only.");
        await this.typeLine("Authenticating via Web3 wallet...");
        setTimeout(async () => {
          await this.typeLine("Authentication successful. Deploying GAPbot unit Alpha.");
        }, 1000);
        break;
      case 'clear':
        this.container.innerHTML = '';
        break;
      case '':
        break;
      default:
        await this.typeLine(`Command not found: ${cmd}. Type 'help' for options.`);
    }
  }
}

// Initialize New Features
document.addEventListener('DOMContentLoaded', () => {
  // Add a slight delay to ensure original scripts are loaded
  setTimeout(() => {
    new NeuralNetwork('neural-canvas');
    new CustomCursor();
    new TiltEffect();
    new TerminalBoot('terminal-body');
      new HologramInteractive();
      new CoraxAudio();
      new AISimulator();
  }, 100);
});

// Feature 2: 3D GAPbot Wireframe (Three.js)
function init3DGAPbot() {
  const container = document.getElementById('gapbot-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(10, 8, 15);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Group to hold the entire robot
  const robotGroup = new THREE.Group();
  scene.add(robotGroup);

  // Modular components groups
  const bodyGroup = new THREE.Group();
  const visionGroup = new THREE.Group();
  const powerGroup = new THREE.Group();

  robotGroup.add(bodyGroup);
  robotGroup.add(visionGroup);
  robotGroup.add(powerGroup);

  // Materials
  const materialWire = new THREE.MeshBasicMaterial({ color: 0x00ffc2, wireframe: true, transparent: true, opacity: 0.5 });
  const materialSolid = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 100, emissive: 0x002211 });
  const materialAccent = new THREE.MeshBasicMaterial({ color: 0x00ffc2 });
  const materialWarning = new THREE.MeshBasicMaterial({ color: 0xff6b35 });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0x00ffc2, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // --- Build Base Chassis ---
  const bodyGeo = new THREE.CylinderGeometry(2, 2.5, 1, 6);
  const body = new THREE.Mesh(bodyGeo, materialSolid);
  const bodyWire = new THREE.Mesh(bodyGeo, materialWire);
  bodyGroup.add(body);
  bodyGroup.add(bodyWire);

  // Legs
  const numLegs = 6;
  const radius = 2.5;
  for (let i = 0; i < numLegs; i++) {
    const angle = (i / numLegs) * Math.PI * 2;
    const legGroup = new THREE.Group();

    const coxaGeo = new THREE.BoxGeometry(1.5, 0.5, 0.5);
    const coxa = new THREE.Mesh(coxaGeo, materialSolid);
    coxa.position.x = 0.75;
    legGroup.add(coxa);

    const femurGeo = new THREE.BoxGeometry(2, 0.4, 0.4);
    const femur = new THREE.Mesh(femurGeo, materialWire);
    femur.position.x = 2.5;
    femur.rotation.z = Math.PI / 4;
    legGroup.add(femur);

    const tibiaGeo = new THREE.BoxGeometry(2.5, 0.3, 0.3);
    const tibia = new THREE.Mesh(tibiaGeo, materialSolid);
    tibia.position.x = 3.5;
    tibia.position.y = -1.5;
    tibia.rotation.z = -Math.PI / 3;
    legGroup.add(tibia);

    legGroup.position.x = Math.cos(angle) * radius;
    legGroup.position.z = Math.sin(angle) * radius;
    legGroup.rotation.y = -angle;
    bodyGroup.add(legGroup);
  }

  // --- Build Modules ---

  // Vision: Standard (RGB)
  const visionStandard = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1.5), materialSolid);
  visionStandard.position.set(1.5, 0.75, 0);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), materialAccent);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(0.5, 0, 0);
  visionStandard.add(lens);
  visionGroup.add(visionStandard);

  // Vision: LiDAR
  const visionLidar = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16), materialSolid);
  visionLidar.position.set(0, 1, 0);
  const lidarScanner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), materialWarning);
  lidarScanner.position.y = 0.5;
  visionLidar.add(lidarScanner);
  visionLidar.visible = false;
  visionGroup.add(visionLidar);

  // Vision: Multispectral
  const visionMulti = new THREE.Group();
  const multiBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), materialSolid);
  visionMulti.add(multiBox);
  for(let i=-1; i<=1; i+=2) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), materialAccent);
    l.rotation.z = Math.PI/2;
    l.position.set(0.6, 0, i*0.3);
    visionMulti.add(l);
  }
  visionMulti.position.set(1.5, 0.8, 0);
  visionMulti.visible = false;
  visionGroup.add(visionMulti);

  // Power: Solar Wings
  const solarWings = new THREE.Group();
  const wingGeo = new THREE.BoxGeometry(3, 0.1, 2);
  const wingMat = new THREE.MeshBasicMaterial({color: 0x004488, wireframe: true});
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(0, 1.5, -3);
  leftWing.rotation.x = Math.PI / 6;
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0, 1.5, 3);
  rightWing.rotation.x = -Math.PI / 6;
  solarWings.add(leftWing);
  solarWings.add(rightWing);
  solarWings.visible = false;
  powerGroup.add(solarWings);


  // --- Interaction & Controls ---
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    container.style.cursor = 'grabbing';
  });
  container.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      targetRotation.y += deltaMove.x * 0.01;
      targetRotation.x += deltaMove.y * 0.01;

      // Limit vertical rotation
      targetRotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, targetRotation.x));
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });

  // Zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(5, Math.min(30, camera.position.z));
  }, { passive: false });

  // Config UI Logic
  const configBtns = document.querySelectorAll('.config-btn');
  const stats = {
    proc: document.getElementById('stat-proc'),
    energy: document.getElementById('stat-energy'),
    weight: document.getElementById('stat-weight')
  };

  configBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Handle UI toggle
      const module = btn.dataset.module;
      const type = btn.dataset.type;

      document.querySelectorAll(`.config-btn[data-module="${module}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Handle 3D Updates & Stats
      if (module === 'vision') {
        visionStandard.visible = (type === 'standard');
        visionMulti.visible = (type === 'multispectral');
        visionLidar.visible = (type === 'lidar');

        stats.proc.textContent = type === 'lidar' ? '95%' : (type === 'multispectral' ? '90%' : '85%');
      }
      else if (module === 'power') {
        solarWings.visible = (type === 'solar');
        stats.energy.textContent = type === 'solar' ? '120% (MPPT)' : '90%';
      }
      else if (module === 'armor') {
        materialSolid.wireframe = (type === 'light');
        stats.weight.textContent = type === 'heavy' ? '45% (Slow)' : '75% (Agile)';
      }

      // Flash effect on update
      robotGroup.scale.set(1.05, 1.05, 1.05);
      setTimeout(() => robotGroup.scale.set(1, 1, 1), 100);
      if(window.plausible) window.plausible('Configurator Used', {props: {module, type}});
    });
  });

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation interpolation
    robotGroup.rotation.y += (targetRotation.y - robotGroup.rotation.y) * 0.1;
    robotGroup.rotation.x += (targetRotation.x - robotGroup.rotation.x) * 0.1;

    // Auto idle rotation if not dragged
    if(!isDragging) {
      targetRotation.y += 0.002;
    }

    // Walking animation
    time += 0.05;
    let legIndex = 0;
    bodyGroup.children.forEach((child) => {
      if (child.type === 'Group') { // It's a leg
        const phase = (legIndex % 2 === 0) ? 0 : Math.PI;
        child.position.y = Math.sin(time + phase) * 0.2;
        legIndex++;
      }
    });

    // Spin LiDAR
    if(visionLidar.visible) {
      lidarScanner.rotation.y += 0.2;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Fade up headers
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Stagger feature cards
  gsap.utils.toArray('.features-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.feature-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    });
  });

  // Fade in 3D container
  const container3d = document.getElementById('gapbot-3d-container');
  if (container3d) {
    gsap.from(container3d, {
      scrollTrigger: {
        trigger: container3d,
        start: 'top 75%'
      },
      scale: 0.8,
      opacity: 0,
      rotationX: -20,
      duration: 1.5,
      ease: 'power2.out'
    });
  }

  // Projects Grid
  gsap.utils.toArray('.projects-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.project-card');
    if(cards.length) {
       gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  });
}

// Feature 3: Code as Architecture Hologram
class HologramInteractive {
  constructor() {
    this.container = document.querySelector('.hologram-container');
    this.scene = document.querySelector('.holo-scene');
    this.nodes = document.querySelectorAll('.holo-node');
    this.overlay = document.getElementById('holo-code-overlay');
    this.filename = document.getElementById('holo-filename');
    this.codeContent = document.getElementById('holo-code-content');

    if (!this.container || !this.scene) return;

    this.codeSnippets = {
      'pump': {
        file: 'irrigation_agent.py',
        code: `def analyze_soil_moisture(sensor_data):
    moisture = model.predict(sensor_data)
    if moisture < THRESHOLD_DRY:
        activate_pump(duration=optimal_flow())
        log_event("Irrigation executed", efficiency="+12%")
    return status.OK`
      },
      'sensor': {
        file: 'edge_hub.cpp',
        code: `void processTelemetry() {
    auto data = readSensors();
    if(anomalyDetected(data)) {
        // EU AI Act Compliant logging
        XAI_Logger::explain(data, "Anomaly Triggered");
        triggerSwarmAlert(data);
    }
}`
      },
      'solar': {
        file: 'mppt_tracker.rs',
        code: `fn optimize_mppt(voltage: f32, current: f32) -> Result<(), Error> {
    let power = voltage * current;
    if power > state.max_power {
        state.max_power = power;
        adjust_panel_angle(sun_vector());
    }
    Ok(())
}`
      }
    };

    this.init();
  }

  init() {
    // Parallax effect on mouse move
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      this.scene.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    });

    this.container.addEventListener('mouseleave', () => {
      this.scene.style.transform = 'rotateY(0deg) rotateX(0deg)';
      this.overlay.style.opacity = '0';
    });

    // Node interactions
    this.nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const target = node.dataset.target;
        const snippet = this.codeSnippets[target];

        this.filename.textContent = snippet.file;
        this.codeContent.textContent = '';
        this.overlay.style.opacity = '1';

        // Typing effect
        let i = 0;
        const text = snippet.code;
        this.typeInterval = setInterval(() => {
          this.codeContent.textContent += text.charAt(i);
          i++;
          if(i >= text.length) clearInterval(this.typeInterval);
        }, 15);

        if(window.plausible) window.plausible('Hologram Interacted', {props: {node: target}});
      });

      node.addEventListener('mouseleave', () => {
        clearInterval(this.typeInterval);
      });
    });
  }
}

// Instantiate it in the DOMContentLoaded

// Feature 4: Reactive Web Audio Soundscape
class CoraxAudio {
  constructor() {
    this.context = null;
    this.oscillators = [];
    this.gainNode = null;
    this.filterNode = null;
    this.isMuted = true;
    this.initialized = false;

    this.initUI();
  }

  initUI() {
    // Create Audio Toggle Button
    const btn = document.createElement('button');
    btn.id = 'audio-toggle';
    btn.innerHTML = '🔇 SOUND OFF';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(10, 10, 10, 0.8);
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      padding: 8px 16px;
      border-radius: 20px;
      font-family: monospace;
      font-size: 0.8rem;
      cursor: pointer;
      backdrop-filter: blur(5px);
      transition: all 0.3s;
    `;

    btn.addEventListener('mouseenter', () => btn.style.boxShadow = '0 0 10px rgba(0, 255, 194, 0.5)');
    btn.addEventListener('mouseleave', () => btn.style.boxShadow = 'none');

    btn.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      btn.innerHTML = this.isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
      btn.style.background = this.isMuted ? 'rgba(10, 10, 10, 0.8)' : 'rgba(0, 255, 194, 0.1)';

      if (!this.isMuted && !this.initialized) {
        this.initAudioContext();
      }

      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(this.isMuted ? 0 : 0.05, this.context.currentTime, 0.5);
      }
    });

    document.body.appendChild(btn);
  }

  initAudioContext() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.context.createGain();
    this.filterNode = this.context.createBiquadFilter();

    // Main volume very low
    this.gainNode.gain.value = 0.05;

    // Lowpass filter to muffle the drone
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 150;

    this.gainNode.connect(this.filterNode);
    this.filterNode.connect(this.context.destination);

    // Create 3 oscillators for a deep, rich drone (ambient hum)
    [50, 75, 100].forEach((freq, i) => {
      const osc = this.context.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.connect(this.gainNode);
      osc.start();
      this.oscillators.push(osc);
    });

    this.initialized = true;
    this.setupInteractions();
  }

  setupInteractions() {
    // 1. Scroll modulates filter frequency
    window.addEventListener('scroll', () => {
      if (!this.context || this.isMuted) return;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = scrollY / maxScroll;

      // Sweep filter from 150Hz to 600Hz based on scroll
      const targetFreq = 150 + (scrollRatio * 450);
      this.filterNode.frequency.setTargetAtTime(targetFreq, this.context.currentTime, 0.1);

      // Slight pitch shift
      this.oscillators.forEach((osc, i) => {
        const baseFreq = [50, 75, 100][i];
        osc.frequency.setTargetAtTime(baseFreq + (scrollRatio * 10), this.context.currentTime, 0.1);
      });
    });

    // 2. UI Hover Effects (High tech blips)
    document.querySelectorAll('a, button, .holo-node, .config-btn').forEach(el => {
      el.addEventListener('mouseenter', () => this.playBlip(600, 0.05, 'sine'));
      el.addEventListener('click', () => this.playBlip(1200, 0.1, 'square'));
    });

    // Terminal typing sounds
    document.addEventListener('keydown', (e) => {
      if(e.target.id === 'terminal-input' && !this.isMuted) {
        this.playBlip(800 + Math.random()*200, 0.02, 'triangle');
      }
    });
  }

  playBlip(freq, duration, type) {
    if (!this.context || this.isMuted) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq/2, this.context.currentTime + duration);

    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }
}

// Feature 5: Live Neuro-Symbolic AI Simulator
class AISimulator {
  constructor() {
    this.canvas = document.getElementById('vision-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.logContainer = document.getElementById('reasoning-log');
    this.actionState = document.getElementById('action-state');
    this.bbox = document.getElementById('bbox-overlay');
    this.bboxLabel = document.getElementById('bbox-label');
    this.fps = document.getElementById('fps-counter');

    this.scenario = 'nominal';
    this.matrixChars = '01'.split('');
    this.drops = [];

    this.init();
  }

  init() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    const columns = this.canvas.width / 15;
    for(let x = 0; x < columns; x++) {
      this.drops[x] = 1;
    }

    // Bind buttons
    document.querySelectorAll('.sim-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.scenario;
        this.scenario = type;
        this.runScenario(type);
      });
    });

    this.runScenario('nominal');
    this.animateMatrix();
    setInterval(() => {
      this.fps.textContent = `${Math.floor(Math.random() * 5 + 58)} FPS`;
    }, 500);
  }

  animateMatrix() {
    requestAnimationFrame(this.animateMatrix.bind(this));

    // Transparent black for trailing effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#0F0';
    this.ctx.font = '15px monospace';

    for(let i = 0; i < this.drops.length; i++) {
      const text = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      this.ctx.fillText(text, i * 15, this.drops[i] * 15);

      if(this.drops[i] * 15 > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }

  log(message, color = 'var(--text-secondary)') {
    const div = document.createElement('div');
    div.style.color = color;
    div.innerHTML = `<span style="opacity: 0.5;">[${new Date().toISOString().split('T')[1].slice(0,8)}]</span> ${message}`;
    this.logContainer.appendChild(div);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  async runScenario(type) {
    this.logContainer.innerHTML = '';
    this.log('> RECALIBRATING SENSORS...', 'var(--primary-color)');
    this.bbox.style.display = 'none';
    this.actionState.textContent = 'ANALYZING...';
    this.actionState.style.color = 'var(--text-muted)';

    await this.sleep(1000);

    if (type === 'nominal') {
      this.log('> Vision: Crop density 98%. Color index nominal.');
      this.log('> Sensor: Soil moisture 42% (Optimal).');
      this.log('> Symbolic: IF (Condition==Nominal) THEN (Maintain State)');

      this.bbox.style.display = 'block';
      this.bbox.style.top = '20%';
      this.bbox.style.left = '30%';
      this.bbox.style.width = '100px';
      this.bbox.style.height = '150px';
      this.bbox.style.borderColor = 'var(--success-color)';
      this.bboxLabel.textContent = 'Crop_Healthy 99%';
      this.bboxLabel.style.background = 'var(--success-color)';

      this.actionState.textContent = 'MONITORING';
      this.actionState.style.color = 'var(--success-color)';
    }
    else if (type === 'pest') {
      this.log('> Vision: Anomaly detected. Confidence: 92%.', 'var(--warning-color)');
      this.log('> Classification: Aphidoidea (Pest).', 'var(--warning-color)');
      this.log('> Symbolic: IF (Pest==True) THEN (Log + Isolate + Alert)');

      this.bbox.style.display = 'block';
      this.bbox.style.top = '40%';
      this.bbox.style.left = '50%';
      this.bbox.style.width = '60px';
      this.bbox.style.height = '60px';
      this.bbox.style.borderColor = 'var(--warning-color)';
      this.bboxLabel.textContent = 'Aphid_Detect 92%';
      this.bboxLabel.style.background = 'var(--warning-color)';

      await this.sleep(500);
      this.log('> Swarm Action: Dispatching localized organic deterrent.', 'var(--warning-color)');
      this.actionState.textContent = 'INTERVENING (PEST)';
      this.actionState.style.color = 'var(--warning-color)';
    }
    else if (type === 'drought') {
      this.log('> Vision: Leaf wilting detected.', 'var(--error-color)');
      this.log('> Sensor: Soil moisture < 15% (Critical).', 'var(--error-color)');
      this.log('> Logic: Moisture anomaly AND visual stress = Drought Risk.', 'var(--error-color)');

      this.bbox.style.display = 'block';
      this.bbox.style.top = '10%';
      this.bbox.style.left = '10%';
      this.bbox.style.width = '80%';
      this.bbox.style.height = '80%';
      this.bbox.style.borderColor = 'var(--error-color)';
      this.bboxLabel.textContent = 'Drought_Stress 98%';
      this.bboxLabel.style.background = 'var(--error-color)';

      await this.sleep(500);
      this.log('> Action: Initiating targeted micro-irrigation sequence.', 'var(--error-color)');
      this.actionState.textContent = 'IRRIGATING (CRITICAL)';
      this.actionState.style.color = 'var(--error-color)';
    }

    if(window.plausible) window.plausible('AI Simulator Run', {props: {scenario: type}});
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
