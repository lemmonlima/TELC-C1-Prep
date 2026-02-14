#!/bin/bash
# Auto-commit script for TELC project
# This watches for file changes and commits them automatically

cd /home/andres/Projects/TELC

while true; do
  # Wait for any file changes (10 second intervals)
  sleep 10
  
  # Check if there are any changes
  if ! git diff-index --quiet HEAD 2>/dev/null; then
    # Add all changes
    git add -A
    
    # Create a commit with timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "Auto-commit: $TIMESTAMP" --quiet
    
    echo "✅ Auto-committed at $TIMESTAMP"
  fi
done
