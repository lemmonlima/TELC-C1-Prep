#!/usr/bin/env python3
"""Bulk-update HTML files to use shared/ paths instead of local duplicates."""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

for modell in sorted(glob.glob(os.path.join(BASE, 'modell-*'))):
    name = os.path.basename(modell)
    print(f'\n=== {name} ===')
    
    for html_file in sorted(glob.glob(os.path.join(modell, '*.html'))):
        fname = os.path.basename(html_file)
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        
        # 1. Update CSS paths
        content = content.replace('href="pruefung.css"', 'href="../shared/pruefung.css"')
        content = content.replace('href="exam.css"', 'href="../shared/exam.css"')
        
        # 2. Update JS paths for section files (not exam.html)
        if fname != 'exam.html':
            content = content.replace('src="pruefung.js"', 'src="../shared/pruefung.js"')
        
        # 3. Update exam.html specifically
        if fname == 'exam.html':
            # Replace old script tags with new ones
            content = content.replace(
                '<script src="exam.js"></script>',
                '<script src="exam-data.js"></script>\n  <script src="../shared/exam-engine.js"></script>'
            )
        
        if content != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'  Updated: {fname}')
        else:
            print(f'  Skipped: {fname} (no changes)')

print('\nDone!')
