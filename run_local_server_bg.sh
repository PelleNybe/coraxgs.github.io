#!/bin/bash
node scripts/generate_blog_json.js
node minify.js
npx http-server dist -p 8000 &
sleep 2
