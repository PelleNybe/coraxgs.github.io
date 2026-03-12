import glob
import os

with open('/app/index.html', 'r') as f:
    text = f.read()

screenshots = glob.glob('/app/images/1773*.png')
screenshots.sort()

# Build HTML gallery
gallery_html = """
    <section id="gallery" style="margin-top: 4rem; text-align: center;">
      <h3 style="color: var(--text-secondary); margin-bottom: 2rem;">Platform Dashboard Previews</h3>
      <div class="projects-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
"""

for img in screenshots:
    filename = os.path.basename(img)
    gallery_html += f'        <div class="project-card"><img src="images/{filename}" style="width: 100%; border-radius: var(--border-radius-small);" alt="Platform preview {filename}"></div>\n'

gallery_html += """      </div>
    </section>
"""

# Insert right after the featured section
import re
pattern = re.compile(r'(<div id="error-message".*?</div>\s*</section>)', re.DOTALL)
text = pattern.sub(r'\1' + '\n' + gallery_html, text)

with open('/app/index.html', 'w') as f:
    f.write(text)
