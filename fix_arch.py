import re

with open('styles.css', 'r') as f:
    content = f.read()

# Make sure arch-node has pointer-events and maybe adjust custom cursor stuff if needed
old_arch = """  box-shadow: 0 0 10px rgba(0, 255, 194, 0.5);
  cursor: none; /* Rely on custom cursor */
  transition:
    transform 0.3s,
    box-shadow 0.3s,
    background 0.3s;
  z-index: 10;
  font-weight: bold;
  text-align: center;"""

new_arch = """  box-shadow: 0 0 10px rgba(0, 255, 194, 0.5);
  cursor: pointer; /* Changed to pointer to ensure interactive feel */
  transition:
    transform 0.3s,
    box-shadow 0.3s,
    background 0.3s;
  z-index: 100; /* Increased z-index to ensure it is above other elements */
  font-weight: bold;
  text-align: center;
  pointer-events: auto; /* Force pointer events */"""

if old_arch in content:
    content = content.replace(old_arch, new_arch)
    with open('styles.css', 'w') as f:
        f.write(content)
    print("styles.css updated successfully.")
else:
    print("Could not find block in styles.css to replace.")
