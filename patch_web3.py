import re

with open('index.html', 'r') as f:
    content = f.read()

old_web3 = """  <!-- Web3 Integration Demo -->
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
  </section>"""

new_web3 = """  <!-- Web3 Integration Demo -->
  <section id="web3-demo">
    <h2 class="section-title">Web3 & Blockchain Integration</h2>
    <p class="section-subtitle">
      Experience our trustless architecture. Connect your wallet to sign a secure payload, demonstrating our decentralized approach and seamless interactions with blockchain tech.
    </p>

    <div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; margin-top: 2rem;">
      <!-- Feature text -->
      <div style="flex: 1; min-width: 300px; max-width: 500px; text-align: left;">
        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Decentralized AI Ecosystem</h3>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
          Corax CoLAB merges cutting-edge AI and automation with Web3 infrastructure to ensure high-security, transparent, and auditable processes. Our integrations empower edge devices to securely authenticate, share data, and process commands leveraging decentralized smart contracts.
        </p>
        <ul style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.2rem;">
          <li>Secure cryptographic authorization for GAPbot endpoints.</li>
          <li>Smart contract-based device state management.</li>
          <li>Incentivized decentralized data exchange.</li>
        </ul>
        <a href="https://cryptop.coraxcolab.com" target="_blank" class="cta-button secondary-cta">Explore CryptoP Trading Bot &rarr;</a>
      </div>

      <!-- Demo Box -->
      <div style="flex: 1; min-width: 300px; max-width: 500px; padding: 2rem; background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid rgba(0, 255, 194, 0.2); text-align: center; box-shadow: var(--shadow-soft);">
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Interactive Signature Demo</h3>
        <div id="wallet-status" style="margin-bottom: 1.5rem; font-family: monospace; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 4px;">Status: Disconnected</div>

        <button id="connect-wallet-btn" class="cta-button primary-cta" style="margin-bottom: 1rem; width: 100%; justify-content: center;">
          Connect Wallet (MetaMask)
        </button>

        <div id="web3-actions" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
          <p style="font-size: 0.9rem; color: var(--text-secondary);">Sign a test message to verify your identity on the Edge node securely using personal_sign.</p>
          <button id="sign-message-btn" class="cta-button secondary-cta" style="width: 100%; justify-content: center;">
            Sign GAPbot Auth Payload
          </button>
          <div id="signature-result" style="margin-top: 1rem; font-family: monospace; font-size: 0.8rem; color: var(--success-color); word-break: break-all; background: rgba(0,255,194,0.1); padding: 1rem; border-radius: 4px; display: none;"></div>
        </div>
      </div>
    </div>
  </section>"""

if old_web3 in content:
    content = content.replace(old_web3, new_web3)
    with open('index.html', 'w') as f:
        f.write(content)
    print("Web3 demo section updated successfully.")
else:
    print("Could not find the web3 demo section block to replace.")
