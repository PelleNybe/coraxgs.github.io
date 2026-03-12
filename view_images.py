import os
import json

images_dir = "images"
html_content = "<html><body><h1>Images</h1>"

for filename in sorted(os.listdir(images_dir)):
    if filename.endswith(('.png', '.jpg', '.jpeg', '.svg')):
        html_content += f"<h2>{filename}</h2>"
        html_content += f'<img src="{images_dir}/{filename}" style="max-width: 500px;"/><br><br>'

html_content += "</body></html>"
with open("images_preview.html", "w") as f:
    f.write(html_content)
