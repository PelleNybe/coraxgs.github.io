with open('/app/index.html', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "    </nav>" in line and "<!-- Hero Section -->" in lines[i+2]:
        new_lines.append("  </nav>\n")
        skip = True
        continue
    if skip:
        if "<!-- Platform & GAPbot Section -->" in line:
            skip = False
            new_lines.append(line)
        continue
    new_lines.append(line)

with open('/app/index.html', 'w') as f:
    f.writelines(new_lines)
