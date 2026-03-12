with open('/app/index.html', 'r') as f:
    text = f.read()

import re
featured_1 = re.compile(r'<!-- Featured GitHub Repositories -->\s*<section id="featured">.*?<!-- Featured GitHub Repositories -->', re.DOTALL)
text = featured_1.sub('<!-- Featured GitHub Repositories -->', text)

with open('/app/index.html', 'w') as f:
    f.write(text)
