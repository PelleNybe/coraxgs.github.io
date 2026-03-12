with open('/app/index.html', 'r') as f:
    text = f.read()

text = text.replace('      </div>\n  </nav>\n    <!-- Platform & GAPbot Section -->',
                    '      </div>\n    </div>\n  </section>\n\n  <!-- Platform & GAPbot Section -->')

with open('/app/index.html', 'w') as f:
    f.write(text)
