#!/bin/bash
urls=(
  "https://pin.it/6HlQqSy3d"
  "https://pin.it/3mBqtq7rF"
)
for url in "${urls[@]}"; do
  final_url=$(curl -Ls -o /dev/null -w %{url_effective} "$url")
  html=$(curl -Ls "$final_url")
  img_url=$(echo "$html" | grep -o 'https://i.pinimg.com/[^"]*\.jpg' | head -1)
  echo "$url -> $img_url"
done
