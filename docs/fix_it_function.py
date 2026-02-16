#!/usr/bin/env python3
import os
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find and replace - exact pattern from files
    old = 'if(t==="woerter")return/\\/woerter\\/index\\.html$/.test(x)||/\\/woerter\\/?$/.test(x);if(t==="tips")'
    new = 'if(t==="woerter")return/\\/woerter\\/index\\.html$/.test(x)||/\\/woerter\\/?$/.test(x);if(t==="pruefungen")return/\\/pruefungen\\/index\\.html$/.test(x)||/\\/pruefungen\\/?$/.test(x);if(t==="tips")'
    
    if old in content and 'if(t==="pruefungen")' not in content:
        content = content.replace(old, new)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Find all HTML files
html_files = glob.glob('/home/andres/Projects/TELC/docs/**/*.html', recursive=True)
count = 0

for filepath in html_files:
    if fix_file(filepath):
        count += 1

print(f"Fixed {count} files")
