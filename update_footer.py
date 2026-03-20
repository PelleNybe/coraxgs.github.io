import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the specific footer block
old_footer = """        <img src="images/coraxcolabloggarund.png" alt="Corax CoLAB Footer Logo" style="height: 60px; margin-bottom: 1rem;"><br><div class="footer-links">
          <a href="https://coraxcolab.com" target="_blank">Official Website</a>
          <a href="https://github.com/PelleNybe" target="_blank"
            >GitHub (PelleNybe)</a
          >
          <a href="https://github.com/PelleNybe" target="_blank"
            >GitHub (PelleNybe)</a
          >
          <a href="#platform">GAP Platform</a>
        </div>"""

new_footer = """        <img src="images/coraxcolabloggarund.png" alt="Corax CoLAB Footer Logo" style="height: 60px; margin-bottom: 1rem;"><br><div class="footer-links">
          <a href="https://coraxcolab.com" target="_blank">Corax CoLAB Website</a>
          <a href="https://cryptop.coraxcolab.com" target="_blank">CryptoP Trading Bot</a>
          <a href="https://github.com/PelleNybe" target="_blank">GitHub (PelleNybe)</a>
          <a href="#platform">GAP Platform</a>
        </div>"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    with open('index.html', 'w') as f:
        f.write(content)
    print("Footer updated successfully.")
else:
    print("Could not find the exact footer block to replace.")
