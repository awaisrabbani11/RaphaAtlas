#!/bin/bash
urls=(
  "https://pin.it/3YyHInf8g"
  "https://pin.it/5URSKvKfN"
  "https://pin.it/1V8uHBS2b"
  "https://pin.it/r8apIMW80"
  "https://pin.it/2IHmUWz0L"
  "https://pin.it/3eCIMFmfH"
  "https://pin.it/4w8srMN9b"
  "https://pin.it/5oRA3VIGz"
  "https://pin.it/4v4vYrW1c"
)
for url in "${urls[@]}"; do
  html=$(curl -Ls "$url")
  img_url=$(echo "$html" | grep -o 'https://i.pinimg.com/[^"]*\.jpg' | head -1)
  echo "$url -> $img_url"
done
