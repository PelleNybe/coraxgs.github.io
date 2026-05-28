import re

with open('index.html', 'r') as f:
    content = f.read()

new_card = """
        <project-card
          name="Agent-Commit Tracker"
          url="/agent-commit-tracker/"
          description="Agent-Commit Tracker - An automated transparency microservice for AI-generated Pull Requests, built by Corax CoLAB."
          language="HTML/CSS"
          color="#e34c26"
          topics='["AI", "GitHub App", "Transparency"]'
          tag="Developer Tool">
        </project-card>
"""

# Find the end of the <div class="projects-grid"> inside the featured section
# and insert the new card before the closing </div>
match = re.search(r'(<div class="projects-grid">.*?)(</div>\s*</div>\s*</section>)', content, re.DOTALL)
if match:
    new_content = content[:match.end(1)] + new_card + content[match.start(2):]
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Successfully patched index.html")
else:
    print("Could not find the target location in index.html")
