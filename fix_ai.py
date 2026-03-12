with open('/app/index.html', 'r') as f:
    text = f.read()

replacement = """        <div class="feature-illustration">
          <img src="images/ai-illustration.svg" alt="AI Illustration" style="width: 100%; height: auto;">
        </div>
        <h3>Neuro-Symbolic Hybrid AI</h3>
        <p>Combining industrial Edge AI for ultra-low latency perception with Generative AI for complex cognition and autonomous reasoning.</p>"""

import re
pattern = re.compile(r'<div class="feature-illustration">\s*<img src="images/ai-illustration.svg"[^>]*>\s*</div>', re.DOTALL)
text = pattern.sub(replacement, text)

with open('/app/index.html', 'w') as f:
    f.write(text)
