import re

with open('index.html', 'r') as f:
    content = f.read()

# Make sure the div wrapper for the arch nodes closes before the info box
old_arch_div = """            y2="80%"
            stroke="var(--primary-color)"
            stroke-width="2"
          />
        </svg>

      <div id="arch-info" style="margin-top: 2rem; padding: 1rem; background: rgba(0, 255, 194, 0.1); border-left: 4px solid var(--primary-color); color: var(--text-primary); border-radius: var(--border-radius-small); min-height: 50px; text-align: center;">
        Hover over a component to see details.
      </div>
  </section>"""

new_arch_div = """            y2="80%"
            stroke="var(--primary-color)"
            stroke-width="2"
          />
        </svg>
      </div> <!-- Close the diagram wrapper properly -->

      <div id="arch-info" style="margin-top: 2rem; padding: 1rem; background: rgba(0, 255, 194, 0.1); border-left: 4px solid var(--primary-color); color: var(--text-primary); border-radius: var(--border-radius-small); min-height: 50px; text-align: center;">
        Hover over a component to see details.
      </div>
    </section>"""

if old_arch_div in content:
    content = content.replace(old_arch_div, new_arch_div)
    with open('index.html', 'w') as f:
        f.write(content)
    print("Arch diagram structure updated successfully.")
else:
    print("Could not find the arch diagram block to replace. Attempting alternative.")
    # Search for alternative if the exact match fails
    old_arch_div_alt = """            y2="80%"
            stroke="var(--primary-color)"
            stroke-width="2"
          />
        </svg>

      <div id="arch-info\""""

    if old_arch_div_alt in content:
        print("Found alternative")
