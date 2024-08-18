#!/bin/bash

# Directory to search for index.html files
DIR="."

# Loop through all index.html files in the directory and its subdirectories
find "$DIR" -name "*.html" | while read -r file; do
  # Extract the content of line 6
  line6=$(sed -n '6p' "$file")
  
  # Replace line 1445 with the content of line 6
  sed -i '' "1445s|.*|$line6|" "$file"
  
  echo "Updated line 1445 in $file"
done