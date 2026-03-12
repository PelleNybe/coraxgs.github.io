with open('/app/index.html', 'r') as f:
    text = f.read()

# Insert swarm-gapbot image into Platform section
# We have id="gapbot-3d-container", let's put it next to it or replace it if it's meant to be an image placeholder.
# Actually, the 3d container is for patch_3d.js. We can add an image right under the section title or inside the product cards.
swarm_html = """
    <div style="text-align: center; margin-top: 2rem;">
        <img src="images/swarm-gapbot-fisheye-group.jpg" alt="GAPbot Swarm" style="max-width: 100%; border-radius: var(--border-radius); box-shadow: var(--shadow-soft);">
    </div>
"""

text = text.replace(
    '<p class="section-subtitle">\n        The intelligent control center orchestrating fleets of robots for\n        resource optimization, and the versatile hexapod designed to navigate\n        complex environments autonomously.\n      </p>',
    '<p class="section-subtitle">\n        The intelligent control center orchestrating fleets of robots for\n        resource optimization, and the versatile hexapod designed to navigate\n        complex environments autonomously.\n      </p>\n' + swarm_html
)

# Insert GAPenterprise_grade_sec.png into "Compliance-as-Code" capability card
# Wait, we already have blockchain-illustration.svg there.
# Let's add gap_digital_bridge and GAPenterprise_grade_sec to the About / The Corax Commitment section.

about_images = """
      <div class="grid-2" style="margin-top: 3rem; margin-bottom: 3rem;">
        <div>
            <img src="images/gap_digital_bridge_between_old_industry_and_future_iot.png" alt="Digital Bridge" style="width: 100%; border-radius: var(--border-radius); box-shadow: var(--shadow-soft);">
        </div>
        <div>
            <img src="images/GAPenterprise_grade_sec.png" alt="Enterprise Grade Security" style="width: 100%; border-radius: var(--border-radius); box-shadow: var(--shadow-soft);">
        </div>
      </div>
"""

text = text.replace(
    '<h2 class="section-title">The Corax Commitment</h2>',
    '<h2 class="section-title">The Corax Commitment</h2>' + about_images
)

with open('/app/index.html', 'w') as f:
    f.write(text)
