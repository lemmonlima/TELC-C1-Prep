#!/usr/bin/env python3
"""
Migrate all HTML files to use the centralized topbar and navigation system.
This removes duplicate topbar HTML and scripts, replacing them with script includes.
"""
import os
import re
import glob
from pathlib import Path

def calculate_relative_path(file_path, docs_root):
    """Calculate relative path from file to docs root"""
    file_dir = os.path.dirname(file_path)
    rel_path = os.path.relpath(docs_root, file_dir)
    if rel_path == '.':
        return './'
    return rel_path + '/'

def migrate_file(filepath, docs_root):
    """Migrate a single HTML file to use component system"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Calculate relative path to scripts
    rel_path = calculate_relative_path(filepath, docs_root)
    topbar_script = f'{rel_path}topbar.js'
    nav_script = f'{rel_path}navigation.js'
    
    # Step 1: Remove old navigation script (the long inline script in head)
    # Pattern: <script>(function(){var p=location.pathname...})();</script>
    nav_script_pattern = r'<script>\(function\(\)\{var p=location\.pathname.*?\}\)\(\);</script>\s*'
    content = re.sub(nav_script_pattern, '', content, flags=re.DOTALL)
    
    # Step 2: Remove old topbar controls script
    # Pattern: <script>document.addEventListener("DOMContentLoaded",function(){var t=document.querySelector...})();</script>
    topbar_controls_pattern = r'<script>document\.addEventListener\("DOMContentLoaded",function\(\)\{var t=document\.querySelector\("\.topbar"\).*?\}\)\(\);</script>\s*'
    content = re.sub(topbar_controls_pattern, '', content, flags=re.DOTALL)
    
    # Step 3: Remove existing topbar HTML
    # Pattern: <header class="topbar">...</header>
    topbar_html_pattern = r'<header class="topbar">.*?</header>\s*'
    content = re.sub(topbar_html_pattern, '', content, flags=re.DOTALL)
    
    # Step 4: Add new script includes in head (before </head>)
    if '<script src="' + topbar_script not in content:
        script_includes = f'''  <!-- TELC Navigation System -->
  <script src="{topbar_script}"></script>
  <script src="{nav_script}"></script>
'''
        content = content.replace('</head>', script_includes + '</head>')
    
    # Step 5: Add comment where topbar was
    if '<body' in content and '<!-- La barra de navegación se genera automáticamente -->' not in content:
        # Find body tag and add comment after it
        body_pattern = r'(<body[^>]*>)\s*'
        replacement = r'\1\n  <!-- La barra de navegación se genera automáticamente -->\n  '
        content = re.sub(body_pattern, replacement, content)
    
    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    docs_root = '/home/andres/Projects/TELC/docs'
    
    # Find all HTML files
    html_files = glob.glob(os.path.join(docs_root, '**/*.html'), recursive=True)
    
    # Exclude template example
    html_files = [f for f in html_files if 'template-example.html' not in f]
    
    migrated = 0
    for filepath in html_files:
        if migrate_file(filepath, docs_root):
            migrated += 1
            print(f"Migrated: {os.path.relpath(filepath, docs_root)}")
    
    print(f"\nTotal files migrated: {migrated}/{len(html_files)}")

if __name__ == '__main__':
    main()
