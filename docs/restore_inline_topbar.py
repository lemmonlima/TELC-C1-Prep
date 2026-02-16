#!/usr/bin/env python3
"""
Restore inline topbar HTML to all files.
This ensures the site works even if JavaScript fails to load.
"""
import os
import re
import glob

def get_topbar_html(depth, current_section='Deutschprogramm'):
    """Generate topbar HTML with correct relative paths"""
    prefix = '../' * depth if depth > 0 else './'
    
    return f'''  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">TELC</span>
      <span class="brand-name">{current_section}</span>
    </div>
    <nav class="nav">
      <a href="{prefix}index.html#start">Start</a>
      <a href="{prefix}grammatik/index.html">Grammatik</a>
      <a href="{prefix}texte/index.html">Texte</a>
      <a href="{prefix}notizen/index.html">Notizen</a>
      <a href="{prefix}woerter/index.html">Wörter</a>
      <a href="{prefix}pruefungen/index.html">Prüfungen</a>
    </nav>
    <a class="cta" href="{prefix}tips/einfuehrung/index.html">Einstufung</a>
  </header>'''

def get_section_name(filepath):
    """Determine section name from filepath"""
    if '/grammatik/' in filepath:
        return 'Grammatik'
    elif '/texte/' in filepath:
        return 'Texte'
    elif '/notizen/' in filepath:
        return 'Notizen'
    elif '/woerter/' in filepath:
        return 'Wörter'
    elif '/pruefungen/' in filepath:
        return 'Prüfungen'
    return 'Deutschprogramm'

def calculate_depth(filepath, docs_root):
    """Calculate directory depth from docs root"""
    rel_path = os.path.relpath(filepath, docs_root)
    parts = rel_path.split(os.sep)
    return len(parts) - 1  # Subtract 1 for the filename itself

def restore_topbar(filepath, docs_root):
    """Restore inline topbar HTML to a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has inline topbar
    if '<header class="topbar">' in content:
        return False
    
    # Calculate depth and section
    depth = calculate_depth(filepath, docs_root)
    section = get_section_name(filepath)
    
    # Generate topbar HTML
    topbar_html = get_topbar_html(depth, section)
    
    # Find the comment and replace with topbar
    comment_pattern = r'  <!-- La barra de navegación se genera automáticamente -->\s*'
    if '<!-- La barra de navegación se genera automáticamente -->' in content:
        content = re.sub(comment_pattern, topbar_html + '\n  ', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    docs_root = '/home/andres/Projects/TELC/docs'
    
    # Find all HTML files
    html_files = glob.glob(os.path.join(docs_root, '**/*.html'), recursive=True)
    
    # Exclude template
    html_files = [f for f in html_files if 'template-example.html' not in f]
    
    restored = 0
    for filepath in html_files:
        if restore_topbar(filepath, docs_root):
            restored += 1
            print(f"Restored: {os.path.relpath(filepath, docs_root)}")
    
    print(f"\nTotal files restored: {restored}/{len(html_files)}")

if __name__ == '__main__':
    main()
