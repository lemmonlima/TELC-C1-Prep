#!/bin/bash

# Script to add mobile CSS to all HTML files in texte/produktion-ds
# This fixes mobile layout issues by adding styles-mobile-texte.css

TEXTE_DIR="$HOME/Projects/TELC/docs/texte"
MOBILE_CSS_FILE="styles-mobile-texte.css"

# Counters
updated_count=0
skipped_count=0
error_count=0

echo "Adding mobile CSS to produktion-ds HTML files..."
echo "================================================"

# Find all HTML files in produktion-ds
find "$TEXTE_DIR/produktion-ds" -type f -name "*.html" | while read -r file; do
  # Get just the filename for display
  filename=$(basename "$file")
  
  # Check if file already has the mobile CSS link
  if grep -q "styles-mobile-texte.css" "$file"; then
    echo "⏭️  Skipping (already has mobile CSS): $filename"
    ((skipped_count++))
    continue
  fi

  # Extract the existing styles.css path from the file
  existing_styles=$(grep -o '<link rel="stylesheet" href="[^"]*styles\.css"' "$file" | sed 's/.*href="\([^"]*\)".*/\1/')
  
  if [ -z "$existing_styles" ]; then
    echo "⚠️  Warning: No styles.css found in: $filename"
    ((error_count++))
    continue
  fi

  # Calculate the relative path to styles-mobile-texte.css
  # Based on the same depth as styles.css
  # e.g., if styles.css is at "../../../../../styles.css"
  # then mobile CSS should be at "../../../../styles-mobile-texte.css"
  
  # Count the number of "../" in the existing path
  depth=$(echo "$existing_styles" | grep -o '\.\.\/' | wc -l)
  
  # Build the path to mobile CSS (one less "../" since it's in texte/ not docs/)
  mobile_css_path=""
  for ((i=1; i<depth; i++)); do
    mobile_css_path="../$mobile_css_path"
  done
  mobile_css_path="${mobile_css_path}${MOBILE_CSS_FILE}"

  # Create backup
  cp "$file" "$file.bak"

  # Add the mobile CSS link after the main styles.css line
  # Using awk for more reliable insertion
  awk -v mobile_path="$mobile_css_path" '
    /<link rel="stylesheet" href=".*styles\.css"/ {
      print
      print "  <link rel=\"stylesheet\" href=\"" mobile_path "\" />"
      next
    }
    {print}
  ' "$file.bak" > "$file.tmp"

  if [ $? -eq 0 ] && [ -s "$file.tmp" ]; then
    mv "$file.tmp" "$file"
    echo "✅ Updated: $filename (depth: $depth, path: $mobile_css_path)"
    ((updated_count++))
  else
    echo "❌ Failed to update: $filename"
    # Restore backup on failure
    mv "$file.bak" "$file"
    rm -f "$file.tmp"
    ((error_count++))
  fi
done

echo ""
echo "================================================"
echo "Summary:"
echo "  ✅ Updated: $updated_count files"
echo "  ⏭️  Skipped: $skipped_count files"
echo "  ❌ Errors: $error_count files"
echo ""
echo "Backup files created with .bak extension"
echo ""
echo "Next steps:"
echo "  1. Test on mobile device"
echo "  2. If everything works, run:"
echo "     find ~/Projects/TELC/docs/texte/produktion-ds -name '*.bak' -delete"
echo ""
