import os

with open('minify.js', 'r') as f:
    content = f.read()

replacement = """    // Copy agent-commit-tracker
    if (fs.existsSync('agent-commit-tracker')) {
      copyDirSync('agent-commit-tracker', 'dist/agent-commit-tracker');
      console.log('agent-commit-tracker copied.');
    }

  } catch (error) {"""

content = content.replace("  } catch (error) {", replacement)

with open('minify.js', 'w') as f:
    f.write(content)
