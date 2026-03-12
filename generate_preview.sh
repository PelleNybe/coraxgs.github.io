#!/bin/bash
echo '<!DOCTYPE html><html><head><title>Images</title></head><body><h1>Images</h1><div style="display:flex; flex-wrap:wrap; gap:10px;">' > images_preview.html
for img in images/*.*; do
  echo "<div style='border:1px solid #ccc; padding:5px;'><p>$img</p><img src='$img' width='300'></div>" >> images_preview.html
done
echo '</div></body></html>' >> images_preview.html
