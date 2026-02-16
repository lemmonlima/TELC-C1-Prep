#!/usr/bin/env python3
"""Test migration on a single file"""
import os
import re

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
    
    print("=== ORIGINAL FILE ===")
    print(content[:500])
    
    # Calculate relative path to scripts
    rel_path = calculate_relative_path(filepath, docs_root)
    topbar_script = f'{rel_path}topbar.js'
    nav_script = f'{rel_path}navigation.js'
    
    print(f"\n=== RELATIVE PATH ===")
    print(f"File: {filepath}")
    print(f"Docs root: {docs_root}")
    print(f"Relative: {rel_path}")
    print(f"Topbar script: {topbar_script}")
    print(f"Nav script: {nav_script}")
    
    # Step 1: Remove old navigation script
    nav_script_pattern = r'<script>\(function\(\)\{var p=location\.pathname.*?\}\)\(\);</script>\s*'
    content = re.sub(nav_script_pattern, '', content, flags=re.DOTALL)
    
    # Step 2: Remove old topbar controls script
    topbar_controls_pattern = r'<script>document\.addEventListener\("DOMContentLoaded",function\(\)\{var t=document\.querySelector\("\.topbar"\).*?\}\)\(\);</script>\s*'
    content = re.sub(topbar_controls_pattern, '', content, flags=re.DOTALL)
    
    # Step 3: Remove existing topbar HTML
    topbar_html_pattern = r'<header class="topbar">.*?</header>\s*'
    content = re.sub(topbar_html_pattern, '', content, flags=re.DOTALL)
    
    # Step 4: Add new script includes in head
    if '<script src="' + topbar_script not in content:
        script_includes = f'''  <!-- TELC Navigation System -->
  <script src="{topbar_script}"></script>
  <script src="{nav_script}"></script>
'''
        content = content.replace('</head>', script_includes + '</head>')
    
    # Step 5: Add comment where topbar was
    if '<body' in content and '<!-- La barra de navegación se genera automáticamente -->' not in content:
        body_pattern = r'(<body[^>]*>)\s*'
        replacement = r'\1\n  <!-- La barra de navegación se genera automáticamente -->\n  '
        content = re.sub(body_pattern, replacement, content)
    
    print("\n=== MIGRATED FILE (first 1000 chars) ===")
    print(content[:1000])
    
    return content

# Test with pruefungen/index.html
docs_root = '/home/andres/Projects/TELC/docs'
test_file = os.path.join(docs_root, 'pruefungen/index.html')

result = migrate_file(test_file, docs_root)
