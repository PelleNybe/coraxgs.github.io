with open('/app/index.html', 'r') as f:
    text = f.read()

import re
repo3_duplicate = re.compile(r'      <!-- Repo 3: PelleNybe Profile/Core -->\s*<div class="project-card tilt-card">.*?</div>\s*</section>', re.DOTALL)
replacement = '''      <div id="projects-grid" class="projects-grid" style="display: none"></div>
      <div id="error-message" class="error-message" style="display: none"></div>
    </section>'''
text = repo3_duplicate.sub(replacement, text)

with open('/app/index.html', 'w') as f:
    f.write(text)
