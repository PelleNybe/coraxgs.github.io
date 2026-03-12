with open('/app/index.html', 'r') as f:
    text = f.read()

# Replace text logo with image
text = text.replace(
    '<span class="logo-text">Corax CoLAB</span>',
    '<img src="images/logo.png" alt="Corax CoLAB Logo" style="height: 40px; margin-right: 10px;">\n        <span class="logo-text">Corax CoLAB</span>'
)

# Insert hero-bg.svg into hero-bg-video-placeholder
text = text.replace(
    '<div class="hero-bg-video-placeholder"></div>',
    '<div class="hero-bg-video-placeholder" style="background-image: url(\'images/hero-bg.svg\'); background-size: cover; background-position: center; opacity: 0.5;"></div>'
)

# Insert capability SVGs
text = text.replace(
    '<div class="tech-icon-wrapper">🧠</div>',
    '<img src="images/ai-illustration.svg" alt="AI Illustration" style="width: 100%; height: auto;">'
)
text = text.replace(
    '<div class="tech-icon-wrapper">🕸️</div>',
    '<img src="images/automation-illustration.svg" alt="Automation Illustration" style="width: 100%; height: auto;">'
)
text = text.replace(
    '<div class="tech-icon-wrapper">🔒</div>',
    '<img src="images/blockchain-illustration.svg" alt="Blockchain Illustration" style="width: 100%; height: auto;">'
)

with open('/app/index.html', 'w') as f:
    f.write(text)
