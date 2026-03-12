with open('/app/index.html', 'r') as f:
    text = f.read()

# Let's insert the coraxcolabloggarund.png in the footer
import re
text = re.compile(r'(<div class="footer-links">)').sub(
    '<img src="images/coraxcolabloggarund.png" alt="Corax CoLAB Footer Logo" style="height: 60px; margin-bottom: 1rem;"><br>\\1',
    text
)

# Insert GAP logga next to GAPbot section
text = text.replace(
    '<div id="gapbot-3d-container"',
    '<div style="text-align: center; margin-bottom: 2rem;"><img src="images/gap_logga.jpg" alt="GAP Logo" style="height: 60px; border-radius: var(--border-radius-small);"></div>\n    <div id="gapbot-3d-container"'
)

with open('/app/index.html', 'w') as f:
    f.write(text)
