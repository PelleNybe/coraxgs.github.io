import re

with open('app.js', 'r') as f:
    content = f.read()

old_web3_app = """        this.resultDiv.textContent = `Signature: ${signature}`;
        this.signBtn.textContent = 'Message Signed ✓';
        this.signBtn.style.borderColor = 'var(--success-color)';"""

new_web3_app = """        this.resultDiv.style.display = 'block';
        this.resultDiv.textContent = `Signature:\\n${signature}`;
        this.signBtn.textContent = 'Message Signed ✓';
        this.signBtn.style.borderColor = 'var(--success-color)';"""

if old_web3_app in content:
    content = content.replace(old_web3_app, new_web3_app)
    with open('app.js', 'w') as f:
        f.write(content)
    print("Web3 app logic updated successfully.")
else:
    print("Could not find the web3 app logic block to replace.")
