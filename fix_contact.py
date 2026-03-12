with open('/app/index.html', 'r') as f:
    text = f.read()

import re

# There is an unclosed div for features grid in the first contact section, and arch-info seems misplaced (should it be in Architecture diagram?)
# Let's fix Architecture section first
arch_info = """      <div id="arch-info" style="margin-top: 2rem; padding: 1rem; background: rgba(0, 255, 194, 0.1); border-left: 4px solid var(--primary-color); color: var(--text-primary); border-radius: var(--border-radius-small); min-height: 50px; text-align: center;">
        Hover over a component to see details.
      </div>
    </div>
  </section>"""

text = text.replace('    </div>\n  </section>\n\n  <!-- Contact Section -->', arch_info + '\n\n  <!-- Contact Section -->')

# Now fix the contact sections - remove the first malformed contact section
contact_pattern = re.compile(r'<!-- Contact Section -->\s*<section id="contact">.*?</section>\s*<section id="contact">', re.DOTALL)
text = contact_pattern.sub('<!-- Contact Section -->\n    <section id="contact">', text)

with open('/app/index.html', 'w') as f:
    f.write(text)
