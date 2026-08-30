const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
  /this\.checkConnection\(\);/,
  `// this.checkConnection() should be called from the instance, but it's defined globally? Wait, let's see.
      this.doCheckConnection();`
);

appJs = appJs.replace(
  /class Web3Demo \{/,
  `class Web3Demo {
  async doCheckConnection() {
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
  }`
);

fs.writeFileSync('app.js', appJs, 'utf8');
