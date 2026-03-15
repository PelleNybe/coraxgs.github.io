const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf8');
const web3Section = `
  <!-- Web3 Integration Demo -->
  <section id="web3-demo">
    <h2 class="section-title">Web3 & Blockchain Integration</h2>
    <p class="section-subtitle">
      Experience our trustless architecture. Connect your wallet to sign a secure payload, demonstrating our decentralized approach.
    </p>

    <div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid rgba(0, 255, 194, 0.2); text-align: center;">
      <div id="wallet-status" style="margin-bottom: 1.5rem; font-family: monospace; color: var(--text-muted);">Status: Disconnected</div>

      <button id="connect-wallet-btn" class="cta-button primary-cta" style="margin-bottom: 1rem;">
        Connect Wallet (MetaMask)
      </button>

      <div id="web3-actions" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Sign a test message to verify your identity on the Edge node.</p>
        <button id="sign-message-btn" class="cta-button secondary-cta">
          Sign GAPbot Auth Payload
        </button>
        <div id="signature-result" style="margin-top: 1rem; font-family: monospace; font-size: 0.8rem; color: var(--success-color); word-break: break-all;"></div>
      </div>
    </div>
  </section>
`;

// Insert before the contact section
const modifiedIndex = indexContent.replace('  <!-- Contact Section -->\n    <!-- Theme Customization Toolbar -->', web3Section + '\n  <!-- Contact Section -->\n    <!-- Theme Customization Toolbar -->');
fs.writeFileSync('index.html', modifiedIndex);

const appContent = fs.readFileSync('app.js', 'utf8');
const web3Logic = `
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

          this.statusText.textContent = \`Connected: \${this.account.substring(0, 6)}...\${this.account.substring(38)}\`;
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
        const message = "Corax CoLAB GAPbot Authorization payload.\\nTimestamp: " + Date.now();

        // Use eth_personalSign
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, this.account]
        });

        this.resultDiv.textContent = \`Signature: \${signature}\`;
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
          this.statusText.textContent = \`Connected: \${this.account.substring(0, 6)}...\${this.account.substring(38)}\`;
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
`;

const newAppContent = appContent.replace("new GitHubActivityFeed();", "new GitHubActivityFeed();\n      new Web3Demo();");
fs.writeFileSync('app.js', newAppContent + '\n' + web3Logic);
