import re

with open('app.js', 'r') as f:
    content = f.read()

old_posts = """    this.posts = [
      {
        title: 'Optimizing YOLOv8-Seg for Hailo-8L Edge Accelerators',
        date: '2024-03-15',
        excerpt: 'A deep dive into how we achieved ultra-low latency inference for the GAPbot vision system without compromising on segmentation accuracy.',
        readTime: '8 min read',
        tag: 'Edge AI'
      },
      {
        title: 'Swarm Consensus: Beyond Basic Algorithms',
        date: '2024-02-28',
        excerpt: 'Exploring our custom implementation of the Consensus-Based Bundle Algorithm (CBBA) for decentralized task allocation among multiple GAPbot units.',
        readTime: '12 min read',
        tag: 'Robotics'
      },
      {
        title: 'Integrating Post-Quantum Cryptography in MQTT',
        date: '2024-02-10',
        excerpt: 'Why we are future-proofing our IoT communications now, and how we implemented PQC algorithms to secure the GAP platform data streams.',
        readTime: '10 min read',
        tag: 'Security'
      }
    ];"""

new_posts = """    this.posts = [
      {
        title: 'Optimizing YOLOv8-Seg for Hailo-8L Edge Accelerators',
        date: '2024-03-15',
        excerpt: 'A deep dive into how we achieved ultra-low latency inference for the GAPbot vision system without compromising on segmentation accuracy.',
        readTime: '8 min read',
        tag: 'Edge AI',
        link: 'https://github.com/PelleNybe/CoraxCoLABs-GAP-GreenAutomatedPlatform---GAPbot'
      },
      {
        title: 'Swarm Consensus: Beyond Basic Algorithms',
        date: '2024-02-28',
        excerpt: 'Exploring our custom implementation of the Consensus-Based Bundle Algorithm (CBBA) for decentralized task allocation among multiple GAPbot units.',
        readTime: '12 min read',
        tag: 'Robotics',
        link: 'https://github.com/PelleNybe/PelleNybe'
      },
      {
        title: 'Integrating Post-Quantum Cryptography in MQTT',
        date: '2024-02-10',
        excerpt: 'Why we are future-proofing our IoT communications now, and how we implemented PQC algorithms to secure the GAP platform data streams.',
        readTime: '10 min read',
        tag: 'Security',
        link: 'https://github.com/PelleNybe/Crypto-MCP-Server---by-Corax-CoLAB'
      }
    ];"""

if old_posts in content:
    content = content.replace(old_posts, new_posts)
    with open('app.js', 'w') as f:
        f.write(content)
    print("Blog posts data updated successfully.")
else:
    print("Could not find the blog posts block to replace.")
