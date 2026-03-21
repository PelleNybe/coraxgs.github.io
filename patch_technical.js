const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// T2: Event Bus Implementation
const eventBusCode = `
// T2: Global Event Bus for state management
class EventBus {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }
}
const coraxEventBus = new EventBus();
window.coraxEventBus = coraxEventBus;
`;
appJs = appJs.replace('const CoraxAnalytics = {', eventBusCode + '\nconst CoraxAnalytics = {');

// T1: Dynamic project fetching error handling & retry
appJs = appJs.replace(
  `    try {
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
          \`GitHub API error: \${response.status} \${response.statusText}\`,
        );
      }`,
  `    let retries = 3;
    let delay = 1000;
    while (retries > 0) {
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
          if (response.status === 403 || response.status === 429) {
            console.warn(\`Rate limited (\${response.status}). Retrying in \${delay}ms...\`);
            await new Promise(res => setTimeout(res, delay));
            retries--;
            delay *= 2; // Exponential backoff
            continue;
          }
          throw new Error(\`GitHub API error: \${response.status} \${response.statusText}\`);
        }`
);
appJs = appJs.replace(
  `      const data = await response.json();

      // Cache successful responses
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("GitHub API request failed:", error);
      throw error;
    }`,
  `        const data = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (error) {
        if (retries <= 1) {
          console.error("GitHub API request failed after retries:", error);
          throw error;
        }
        retries--;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }`
);

// T3: Optimize WebGL Rendering using IntersectionObserver
appJs = appJs.replace(
  `    this.animate();`,
  `    this.isVisible = true;

    // T3: IntersectionObserver for NeuralNetwork
    this.observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
      if (this.isVisible) this.animate();
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if(heroSection) this.observer.observe(heroSection);

    this.animate();`
);

appJs = appJs.replace(
  `  animate() {
    requestAnimationFrame(this.animate.bind(this));`,
  `  animate() {
    if (!this.isVisible) return; // Pause animation when not visible
    requestAnimationFrame(this.animate.bind(this));`
);

// Optimize init3DGAPbot loop as well
appJs = appJs.replace(
  `  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);`,
  `  // T3: Optimize GAPbot rendering
  let isVisible = true;
  const gapbotObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible) animate();
  }, { threshold: 0.1 });
  gapbotObserver.observe(container);

  // Animation Loop
  let time = 0;
  function animate() {
    if (!isVisible) return;
    requestAnimationFrame(animate);`
);

// T4: Web3 Wallet Persistence
appJs = appJs.replace(
  `  init() {
    this.connectBtn.addEventListener('click', async () => {`,
  `  init() {
    // T4: Auto-connect if previously connected
    const savedAccount = localStorage.getItem('corax_web3_account');
    if (savedAccount && typeof window.ethereum !== 'undefined') {
       this.checkConnection();
    }

    this.connectBtn.addEventListener('click', async () => {`
);

appJs = appJs.replace(
  `          if(window.plausible) window.plausible('Wallet Connected');
        } catch (error) {`,
  `          localStorage.setItem('corax_web3_account', this.account);
          if(window.plausible) window.plausible('Wallet Connected');
        } catch (error) {`
);

const checkConnectionMethod = `
  async checkConnection() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        this.account = accounts[0];
        this.statusText.textContent = \`Connected: \${this.account.substring(0, 6)}...\${this.account.substring(38)}\`;
        this.statusText.style.color = 'var(--success-color)';
        this.connectBtn.style.display = 'none';
        this.actionsDiv.style.display = 'flex';
      } else {
        localStorage.removeItem('corax_web3_account');
      }
    } catch (e) {
      console.error("Silent reconnect failed", e);
    }
  }
`;

appJs = appJs.replace(
  `  init() {`,
  checkConnectionMethod + `\n  init() {`
);

appJs = appJs.replace(
  `          this.account = null;
          this.statusText.textContent = 'Status: Disconnected';`,
  `          this.account = null;
          localStorage.removeItem('corax_web3_account');
          this.statusText.textContent = 'Status: Disconnected';`
);

// Broadcast theme toggle using event bus
appJs = appJs.replace(
  `    localStorage.setItem("corax-theme", this.theme);
    this.updateThemeButton();`,
  `    localStorage.setItem("corax-theme", this.theme);
    this.updateThemeButton();
    window.coraxEventBus.emit('themeChanged', this.theme);`
);

fs.writeFileSync('app.js', appJs);
console.log('Technical improvements patched in app.js');
