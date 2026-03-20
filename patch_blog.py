import re

with open('app.js', 'r') as f:
    content = f.read()

old_blog_init = """      card.addEventListener('click', () => {
        // In a real app, this would open a modal or navigate to the article page
        alert(`Opening article: "${post.title}".\\n\\nIn a full deployment, this would load the markdown content.`);
        if(window.plausible) window.plausible('Blog Read Click', {props: {title: post.title}});
      });"""

new_blog_init = """      if (post.link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          window.open(post.link, '_blank');
          if(window.plausible) window.plausible('Blog Read Click', {props: {title: post.title}});
        });
      } else {
        card.addEventListener('click', () => {
          alert(`Opening article: "${post.title}".\\n\\nIn a full deployment, this would load the markdown content.`);
          if(window.plausible) window.plausible('Blog Read Click', {props: {title: post.title}});
        });
      }"""

if old_blog_init in content:
    content = content.replace(old_blog_init, new_blog_init)
    with open('app.js', 'w') as f:
        f.write(content)
    print("Blog click handler updated successfully.")
else:
    print("Could not find the blog click handler block to replace.")
