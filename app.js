
// Feature: Web Components (Componentization)
class ProjectCardElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['name', 'url', 'description', 'stars', 'language', 'color', 'topics', 'tag'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('name') || '';
    const url = this.getAttribute('url') || '#';
    const description = this.getAttribute('description') || '';
    const stars = this.getAttribute('stars') || '0';
    const language = this.getAttribute('language') || '';
    const color = this.getAttribute('color') || '#ccc';
    let topics = this.getAttribute('topics') || '';
    const tag = this.getAttribute('tag') || ''; // 'Featured' or 'Core'

    // Parse topics
    try {
       topics = JSON.parse(topics);
    } catch(e) {
       topics = [];
    }

    let topicsHtml = '';
    if (Array.isArray(topics) && topics.length > 0) {
      topicsHtml = topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('');
    } else if (language) {
      topicsHtml = `<span class="tag">${language}</span>`;
    }

    let languageHtml = '';
    if (language) {
      languageHtml = `
        <span class="language">
          <span class="language-color" style="background-color: ${color}"></span>
          ${language}
        </span>
      `;
    }

    let statItemHtml = '';
    if (tag) {
       statItemHtml = `<span class="stat-item active">🔥 ${tag}</span>`;
    } else if (stars !== '0') {
       statItemHtml = `<span class="stat-item">⭐ ${stars}</span>`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
        }
        .project-card {
          background: var(--card-bg, rgba(10, 10, 10, 0.6));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius, 12px);
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color, #00FFC2), var(--secondary-color, #1A73E8));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .project-card:hover::before {
          transform: scaleX(1);
        }
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        a {
          color: var(--text-primary, #ffffff);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        a:hover {
          color: var(--primary-color, #00FFC2);
        }
        .project-description {
          color: var(--text-secondary, #a0aab2);
          margin-bottom: 1.5rem;
          flex-grow: 1;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .tag {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary, #a0aab2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }
        .project-link {
          color: var(--primary-color, #00FFC2);
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--text-muted, #737c85);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
        }
        .stat-item.active {
          color: var(--primary-color, #00FFC2);
          border: 1px solid var(--primary-color, #00FFC2);
          background: rgba(0, 255, 194, 0.1);
        }
        .language {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted, #737c85);
        }
        .language-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      </style>
      <div class="project-card">
        <div class="project-header">
          <h3>
            <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
          </h3>
          <div class="project-stats">
            ${statItemHtml}
          </div>
        </div>
        <p class="project-description">${description}</p>
        <div class="project-tags">
          ${topicsHtml}
        </div>
        <div class="project-footer">
          ${languageHtml}
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="project-link">
            📂 View on GitHub &rarr;
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('project-card', ProjectCardElement);


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
    const card = document.createElement("project-card");
    card.setAttribute("name", repo.name);
    card.setAttribute(
      "description",
      repo.description ||
        "An exciting project from Corax CoLAB exploring new technical possibilities."
    );
    card.setAttribute("url", repo.html_url);
    card.setAttribute("stars", repo.stargazers_count || "0");
    if (repo.language) card.setAttribute("language", repo.language);

    let color = "#ccc";
    const langColors = {
      Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6",
      HTML: "#e34c26", CSS: "#563d7c", "Jupyter Notebook": "#DA5B0B",
      Vue: "#41b883", Rust: "#dea584", Go: "#00ADD8", "C++": "#f34b7d",
      Shell: "#89e051"
    };
    if (repo.language && langColors[repo.language]) {
      color = langColors[repo.language];
    }
    card.setAttribute("color", color);

    let tags = [];
    if (repo.topics && repo.topics.length > 0) {
      tags = repo.topics.slice(0, 3);
    }
    card.setAttribute("topics", JSON.stringify(tags));

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
    /* Disabled hover media query check */

    this.pos = { x: 0, y: 0 };
    this.cursor.style.zIndex = '999999';
    this.follower.style.zIndex = '999998';
    this.cursor.style.display = 'block';
    this.follower.style.display = 'block';
    this.followerPos = { x: 0, y: 0 };
    this.cursor.style.zIndex = '999999';
    this.follower.style.zIndex = '999998';
    this.cursor.style.display = 'block';
    this.follower.style.display = 'block';
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
      new GitHubActivityFeed();
      new Web3Demo();
      new BlogSystem();
          init3DGAPbot();
          initScrollAnimations();
  }, 100);
});

// Feature 2: 3D GAPbot Wireframe (Three.js)

function init3DGAPbot() {
  const container = document.getElementById('gapbot-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(12, 10, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const robotGroup = new THREE.Group();
  scene.add(robotGroup);

  const bodyGroup = new THREE.Group();
  const visionGroup = new THREE.Group();
  const powerGroup = new THREE.Group();

  robotGroup.add(bodyGroup);
  robotGroup.add(visionGroup);
  robotGroup.add(powerGroup);

  // Advanced Materials
  const materialSolid = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
    metalness: 0.8
  });
  const materialArmor = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.6,
    metalness: 0.5
  });
  const materialWire = new THREE.MeshStandardMaterial({
    color: 0x00ffc2,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const materialAccent = new THREE.MeshStandardMaterial({
    color: 0x00ffc2,
    emissive: 0x00aa88,
    emissiveIntensity: 0.5
  });
  const materialWarning = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    emissive: 0xaa3300,
    emissiveIntensity: 0.8
  });
  const materialJoint = new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.9,
    metalness: 0.1
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0x00ffc2, 2, 20);
  pointLight.position.set(0, -2, 0);
  scene.add(pointLight);

  // --- Build Detailed Chassis ---
  // Main Core
  const coreGeo = new THREE.OctahedronGeometry(2.2, 1);
  const core = new THREE.Mesh(coreGeo, materialSolid);
  core.scale.y = 0.5;
  core.castShadow = true;
  bodyGroup.add(core);

  // Top Armor Plate
  const armorGeo = new THREE.CylinderGeometry(2.3, 2.5, 0.4, 8);
  const topArmor = new THREE.Mesh(armorGeo, materialArmor);
  topArmor.position.y = 1.2;
  topArmor.castShadow = true;
  bodyGroup.add(topArmor);

  const bottomArmor = new THREE.Mesh(armorGeo, materialArmor);
  bottomArmor.position.y = -1.2;
  bottomArmor.scale.set(0.9, 1, 0.9);
  bodyGroup.add(bottomArmor);

  // Legs with detailed joints
  const numLegs = 6;
  const radius = 2.4;
  for (let i = 0; i < numLegs; i++) {
    const angle = (i / numLegs) * Math.PI * 2;
    const legGroup = new THREE.Group();

    // Coxa (Shoulder)
    const coxaGeo = new THREE.BoxGeometry(1.2, 0.8, 0.8);
    const coxa = new THREE.Mesh(coxaGeo, materialSolid);
    coxa.position.x = 0.6;
    coxa.castShadow = true;
    legGroup.add(coxa);

    // Shoulder Joint
    const joint1Geo = new THREE.SphereGeometry(0.5, 16, 16);
    const joint1 = new THREE.Mesh(joint1Geo, materialJoint);
    joint1.position.x = 1.4;
    legGroup.add(joint1);

    // Femur (Upper Leg)
    const femurGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8);
    const femur = new THREE.Mesh(femurGeo, materialArmor);
    femur.position.set(2.4, 0.8, 0);
    femur.rotation.z = Math.PI / 4;
    femur.castShadow = true;
    legGroup.add(femur);

    // Knee Joint
    const joint2 = new THREE.Mesh(joint1Geo, materialJoint);
    joint2.position.set(3.4, 1.7, 0);
    legGroup.add(joint2);

    // Tibia (Lower Leg)
    const tibiaGeo = new THREE.CylinderGeometry(0.4, 0.1, 3.5, 8);
    const tibia = new THREE.Mesh(tibiaGeo, materialSolid);
    tibia.position.set(4.2, 0.2, 0);
    tibia.rotation.z = -Math.PI / 6;
    tibia.castShadow = true;
    legGroup.add(tibia);

    legGroup.position.x = Math.cos(angle) * radius;
    legGroup.position.z = Math.sin(angle) * radius;
    legGroup.rotation.y = -angle;
    bodyGroup.add(legGroup);
  }

  // --- Build Modules ---

  // Vision: Standard (RGB)
  const visionStandard = new THREE.Group();
  const headGeo = new THREE.BoxGeometry(1.2, 0.8, 1.4);
  const head = new THREE.Mesh(headGeo, materialArmor);
  visionStandard.add(head);
  const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16), materialAccent);
  lens1.rotation.z = Math.PI / 2;
  lens1.position.set(0.6, 0.1, 0.3);
  const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16), materialAccent);
  lens2.rotation.z = Math.PI / 2;
  lens2.position.set(0.6, 0.1, -0.3);
  visionStandard.add(lens1);
  visionStandard.add(lens2);
  visionStandard.position.set(2.0, 1.8, 0);
  visionGroup.add(visionStandard);

  // Vision: LiDAR
  const visionLidar = new THREE.Group();
  const lidarBaseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.5, 16);
  const lidarBase = new THREE.Mesh(lidarBaseGeo, materialSolid);
  visionLidar.add(lidarBase);
  const lidarScannerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
  const lidarScanner = new THREE.Mesh(lidarScannerGeo, materialWarning);
  lidarScanner.position.y = 0.45;
  visionLidar.add(lidarScanner);
  visionLidar.position.set(0, 1.8, 0);
  visionLidar.visible = false;
  visionGroup.add(visionLidar);

  // Vision: Multispectral
  const visionMulti = new THREE.Group();
  const multiBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.4), materialArmor);
  visionMulti.add(multiBox);
  for(let i=-1; i<=1; i++) {
    for(let j=-1; j<=1; j+=2) {
      if(i===0 && j===0) continue;
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), materialAccent);
      l.rotation.z = Math.PI/2;
      l.position.set(0.7, i*0.15, j*0.3);
      visionMulti.add(l);
    }
  }
  visionMulti.position.set(1.8, 1.8, 0);
  visionMulti.visible = false;
  visionGroup.add(visionMulti);

  // Power: Solar Wings
  const solarWings = new THREE.Group();
  const wingGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
  const wingMat = new THREE.MeshStandardMaterial({color: 0x002244, roughness: 0.2, metalness: 0.9});
  const gridTex = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.3), new THREE.MeshBasicMaterial({color: 0x0088ff, wireframe: true}));
  gridTex.rotation.x = -Math.PI / 2;
  gridTex.position.y = 0.06;

  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.add(gridTex.clone());
  leftWing.position.set(0, 2.0, -3.5);
  leftWing.rotation.x = Math.PI / 8;

  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.add(gridTex.clone());
  rightWing.position.set(0, 2.0, 3.5);
  rightWing.rotation.x = -Math.PI / 8;

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
    camera.position.z = Math.max(8, Math.min(30, camera.position.z));
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
      const module = btn.dataset.module;
      const type = btn.dataset.type;

      document.querySelectorAll(`.config-btn[data-module="${module}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
        topArmor.material = type === 'light' ? materialWire : materialArmor;
        bottomArmor.material = type === 'light' ? materialWire : materialArmor;
        stats.weight.textContent = type === 'heavy' ? '45% (Slow)' : '75% (Agile)';
      }

      robotGroup.scale.set(1.05, 1.05, 1.05);
      setTimeout(() => robotGroup.scale.set(1, 1, 1), 100);
    });
  });

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);

    robotGroup.rotation.y += (targetRotation.y - robotGroup.rotation.y) * 0.1;
    robotGroup.rotation.x += (targetRotation.x - robotGroup.rotation.x) * 0.1;

    if(!isDragging) {
      targetRotation.y += 0.002;
    }

    time += 0.05;
    let legIndex = 0;
    bodyGroup.children.forEach((child) => {
      if (child.type === 'Group') {
        const phase = (legIndex % 2 === 0) ? 0 : Math.PI;

        // Detailed walking kinematics simulation
        const lift = Math.sin(time + phase);
        const stride = Math.cos(time + phase);

        child.position.y = Math.max(0, lift * 0.5);
        child.position.x = Math.cos(-legIndex * Math.PI/3) * (2.4 + stride * 0.3);
        child.position.z = Math.sin(-legIndex * Math.PI/3) * (2.4 + stride * 0.3);

        legIndex++;
      }
    });

    if(visionLidar.visible) {
      visionGroup.children[1].children[1].rotation.y += 0.2;
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
    this.overlay = document.getElementById('holo-code-overlay');
    this.filename = document.getElementById('holo-filename');
    this.codeContent = document.getElementById('holo-code-content');

    if (!this.container || typeof THREE === 'undefined') return;

    // Clear old HTML nodes
    const sceneDiv = document.querySelector('.holo-scene');
    if (sceneDiv) sceneDiv.innerHTML = '';

    // Remove background grid from HTML since we will render it in WebGL
    const gridBg = this.container.querySelector('div[style*="background-image: linear-gradient"]');
    if (gridBg) gridBg.style.display = 'none';

    this.codeSnippets = {
      'pump': {
        name: 'Irrigation Pump',
        file: 'irrigation_agent.py',
        code: `def analyze_soil_moisture(sensor_data):
    moisture = model.predict(sensor_data)
    if moisture < THRESHOLD_DRY:
        activate_pump(duration=optimal_flow())
        log_event("Irrigation executed", efficiency="+12%")
    return status.OK`
      },
      'sensor': {
        name: 'Edge Sensor Hub',
        file: 'edge_hub.cpp',
        code: `void processTelemetry() {
    auto data = readSensors();
    if(anomalyDetected(data)) {
        XAI_Logger::explain(data, "Anomaly Triggered");
        triggerSwarmAlert(data);
    }
}`
      },
      'solar': {
        name: 'Solar MPPT Array',
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

    this.initWebGL();
    this.initInteraction();
  }

  initWebGL() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 150, 300);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    // Style the canvas
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '1';

    // Create a wrapper for WebGL canvas
    const webglWrapper = document.createElement('div');
    webglWrapper.style.position = 'absolute';
    webglWrapper.style.width = '100%';
    webglWrapper.style.height = '100%';
    webglWrapper.style.top = '0';
    webglWrapper.style.left = '0';
    webglWrapper.style.pointerEvents = 'none'; // Let mouse events pass to Raycaster
    this.container.appendChild(webglWrapper);
    webglWrapper.appendChild(this.renderer.domElement);

    // Grid Helper to simulate the hologram floor
    const gridHelper = new THREE.GridHelper(400, 40, 0x00ffc2, 0x004433);
    gridHelper.position.y = -20;
    this.scene.add(gridHelper);

    // Glowing Particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 400;
      positions[i*3+1] = Math.random() * 100 - 20;
      positions[i*3+2] = (Math.random() - 0.5) * 400;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x00ffc2, size: 2, transparent: true, opacity: 0.5 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.nodes = [];
    this.createNode('pump', -100, 20, 50, new THREE.CylinderGeometry(15, 15, 30, 16));
    this.createNode('sensor', 50, 10, -80, new THREE.BoxGeometry(20, 20, 20));
    this.createNode('solar', 80, 40, 60, new THREE.PlaneGeometry(40, 40));

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.particles.rotation.y += 0.001;

      // Animate Nodes
      this.nodes.forEach(node => {
        node.mesh.rotation.y += 0.01;
        if(node.mesh.geometry.type === 'PlaneGeometry') {
          node.mesh.rotation.x = -Math.PI / 2 + Math.sin(Date.now()*0.001)*0.2;
        } else {
          node.mesh.position.y = node.baseY + Math.sin(Date.now() * 0.002 + node.mesh.position.x) * 5;
        }
      });

      this.renderer.render(this.scene, this.camera);
    };
    animate();

    window.addEventListener('resize', () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });
  }

  createNode(id, x, y, z, geometry) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffc2,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    // Rotate Plane
    if (geometry.type === 'PlaneGeometry') {
      mesh.rotation.x = -Math.PI / 2;
    }

    // Add glowing core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const core = new THREE.Mesh(geometry, coreMat);
    core.scale.set(0.8, 0.8, 0.8);
    mesh.add(core);

    mesh.userData = { id: id };
    this.scene.add(mesh);
    this.nodes.push({ mesh: mesh, baseY: y });

    // HTML Label
    const label = document.createElement('div');
    label.className = 'node-label';
    label.textContent = this.codeSnippets[id].name;
    label.style.position = 'absolute';
    label.style.pointerEvents = 'none';
    label.style.zIndex = '10';
    this.container.appendChild(label);

    mesh.userData.label = label;
  }

  initInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.container.addEventListener('mousemove', (event) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Parallax camera
      this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.05;
      this.camera.position.y += (150 + this.mouse.y * 20 - this.camera.position.y) * 0.05;
      this.camera.lookAt(0, 0, 0);

      // Raycasting
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshes = this.nodes.map(n => n.mesh);
      const intersects = this.raycaster.intersectObjects(meshes);

      // Reset styles
      meshes.forEach(m => {
        m.material.color.setHex(0x00ffc2);
        m.material.opacity = 0.8;
      });
      this.overlay.style.opacity = '0';
      clearInterval(this.typeInterval);

      if (intersects.length > 0) {
        this.container.style.cursor = 'pointer';
        const hovered = intersects[0].object;

        // Ensure we get the main mesh and not the core
        const mainMesh = hovered.userData.id ? hovered : hovered.parent;

        if (mainMesh && mainMesh.userData.id) {
            mainMesh.material.color.setHex(0xffffff);
            mainMesh.material.opacity = 1.0;

            const id = mainMesh.userData.id;
            const snippet = this.codeSnippets[id];

            this.filename.textContent = snippet.file;
            this.codeContent.textContent = '';
            this.overlay.style.opacity = '1';

            let i = 0;
            const text = snippet.code;
            this.typeInterval = setInterval(() => {
            this.codeContent.textContent += text.charAt(i);
            i++;
            if(i >= text.length) clearInterval(this.typeInterval);
            }, 15);

            if(window.plausible) window.plausible('Hologram Interacted', {props: {node: id}});
        }
      } else {
        this.container.style.cursor = 'default';
      }

      // Update Labels positions
      this.nodes.forEach(n => {
        const pos = n.mesh.position.clone();
        pos.project(this.camera);

        const x = (pos.x * .5 + .5) * rect.width;
        const y = (pos.y * -.5 + .5) * rect.height;

        n.mesh.userData.label.style.left = `${x - 40}px`;
        n.mesh.userData.label.style.top = `${y + 20}px`;
      });
    });

    this.container.addEventListener('mouseleave', () => {
      this.overlay.style.opacity = '0';
      clearInterval(this.typeInterval);
    });
  }
}


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



// Feature: Live GitHub Activity Feed
class GitHubActivityFeed {
  constructor() {
    this.container = document.getElementById('github-activity');
    if (!this.container) return;
    this.init();
  }

  async init() {
    try {
      this.container.innerHTML = '<div style="text-align: center; color: var(--primary-color);">Loading activity...</div>';

      let response = await fetch('https://api.github.com/orgs/coraxgs/events');
      if (!response.ok) {
        response = await fetch('https://api.github.com/users/coraxgs/events');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub activity');
      }

      const events = await response.json();
      this.renderEvents(events);
    } catch (error) {
      console.error('Error fetching GitHub activity:', error);
      this.container.innerHTML = '<div style="text-align: center; color: var(--error-color);">Unable to load activity feed.</div>';
    }
  }

  renderEvents(events) {
    this.container.innerHTML = '';

    const relevantEvents = events.filter(e =>
      ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type)
    ).slice(0, 5);

    if (relevantEvents.length === 0) {
       this.container.innerHTML = '<div style="text-align: center; color: var(--text-muted);">No recent activity found.</div>';
       return;
    }

    relevantEvents.forEach(event => {
      const el = document.createElement('div');
      el.style.cssText = `
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-small);
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
      `;

      el.onmouseenter = () => {
         el.style.borderColor = 'var(--primary-color)';
         el.style.transform = 'translateX(5px)';
      };
      el.onmouseleave = () => {
         el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
         el.style.transform = 'translateX(0)';
      };

      const date = new Date(event.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
      });

      let icon = '📝';
      let actionText = '';
      let url = `https://github.com/${event.repo.name}`;

      switch(event.type) {
        case 'PushEvent':
          icon = '⬆️';
          const commitsCount = event.payload.commits ? event.payload.commits.length : 0;
          actionText = `Pushed ${commitsCount} commit${commitsCount !== 1 ? 's' : ''} to `;
          break;
        case 'PullRequestEvent':
          icon = '🔄';
          actionText = `${event.payload.action} pull request in `;
          if (event.payload.pull_request) url = event.payload.pull_request.html_url;
          break;
        case 'IssuesEvent':
          icon = '⚠️';
          actionText = `${event.payload.action} issue in `;
          if (event.payload.issue) url = event.payload.issue.html_url;
          break;
        case 'CreateEvent':
          icon = '✨';
          actionText = `Created ${event.payload.ref_type} in `;
          break;
      }

      el.innerHTML = `
        <div style="font-size: 1.5rem; width: 30px; text-align: center;">${icon}</div>
        <div style="flex: 1;">
          <div style="font-size: 0.9rem; color: var(--text-primary);">
            ${actionText}
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">
              ${event.repo.name.replace('coraxgs/', '')}
            </a>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
            ${date}
          </div>
        </div>
      `;

      this.container.appendChild(el);
    });
  }
}


// Feature: Web3 Integration Demo
class Web3Demo {
  constructor() {
    this.connectBtn = document.getElementById('connect-wallet-btn');
    this.signBtn = document.getElementById('sign-message-btn');
    this.statusText = document.getElementById('wallet-status');
    this.actionsDiv = document.getElementById('web3-actions');
    this.resultDiv = document.getElementById('signature-result');
    this.account = null;

    if (!this.connectBtn) return;
    this.init();
  }

  init() {
    this.connectBtn.addEventListener('click', async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          this.connectBtn.textContent = 'Connecting...';
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.account = accounts[0];

          this.statusText.textContent = `Connected: ${this.account.substring(0, 6)}...${this.account.substring(38)}`;
          this.statusText.style.color = 'var(--success-color)';

          this.connectBtn.style.display = 'none';
          this.actionsDiv.style.display = 'flex';

          if(window.plausible) window.plausible('Wallet Connected');
        } catch (error) {
          console.error("User denied account access", error);
          this.connectBtn.textContent = 'Connect Wallet (MetaMask)';
          this.statusText.textContent = 'Connection Refused';
          this.statusText.style.color = 'var(--error-color)';
        }
      } else {
        this.statusText.textContent = 'MetaMask is not installed. Please install it to use this feature.';
        this.statusText.style.color = 'var(--warning-color)';
      }
    });

    this.signBtn.addEventListener('click', async () => {
      if (!this.account) return;

      try {
        this.signBtn.textContent = 'Waiting for signature...';
        const message = "Corax CoLAB GAPbot Authorization payload.\nTimestamp: " + Date.now();

        // Use eth_personalSign
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, this.account]
        });

        this.resultDiv.textContent = `Signature: ${signature}`;
        this.signBtn.textContent = 'Message Signed ✓';
        this.signBtn.style.borderColor = 'var(--success-color)';
        this.signBtn.style.color = 'var(--success-color)';

        if(window.plausible) window.plausible('Message Signed');
      } catch (error) {
        console.error("Signature failed", error);
        this.signBtn.textContent = 'Sign GAPbot Auth Payload';
        this.resultDiv.textContent = 'Signature rejected or failed.';
        this.resultDiv.style.color = 'var(--error-color)';
      }
    });

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.statusText.textContent = `Connected: ${this.account.substring(0, 6)}...${this.account.substring(38)}`;
        } else {
          this.account = null;
          this.statusText.textContent = 'Status: Disconnected';
          this.statusText.style.color = 'var(--text-muted)';
          this.connectBtn.style.display = 'inline-block';
          this.actionsDiv.style.display = 'none';
          this.resultDiv.textContent = '';
        }
      });
    }
  }
}


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
      card.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2rem;
        cursor: pointer;
      `;

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="tag" style="background: rgba(0, 255, 194, 0.1); color: var(--primary-color); border: 1px solid var(--primary-color);">${post.tag}</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">${post.date}</span>
          </div>
          <h3 style="margin-bottom: 1rem; line-height: 1.4; font-size: 1.2rem;">${post.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${post.excerpt}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <span style="color: var(--text-muted); font-size: 0.8rem;">⏱️ ${post.readTime}</span>
          <span style="color: var(--primary-color); font-size: 0.9rem; font-weight: 500;">Read Article &rarr;</span>
        </div>
      `;

      card.addEventListener('click', () => {
        // In a real app, this would open a modal or navigate to the article page
        alert(`Opening article: "${post.title}".\n\nIn a full deployment, this would load the markdown content.`);
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
// Interactive Architecture Diagram
document.addEventListener('DOMContentLoaded', () => {
  const archNodes = document.querySelectorAll('.arch-node');
  const archInfo = document.getElementById('arch-info');

  if (archNodes.length > 0 && archInfo) {
    const defaultText = archInfo.textContent;

    archNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const info = node.getAttribute('data-info');
        if (info) {
          archInfo.textContent = info;
        }
      });

      node.addEventListener('mouseleave', () => {
        archInfo.textContent = defaultText;
      });
    });
  }
});
