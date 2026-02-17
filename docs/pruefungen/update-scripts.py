#!/usr/bin/env python3
"""Replace inline scripts in modell-2 through modell-5 section files with init method calls."""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# Template replacements: map section filenames to their new init call scripts
REPLACEMENTS = {
    '1-leseverstehen-teil-1.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initLV1)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initLV1({ 1:\'\', 2:\'\', 3:\'\', 4:\'\', 5:\'\', 6:\'\' }); // TODO: answers\n  </script>'
    },
    '1-leseverstehen-teil-2.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initLV2)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initLV2({ 7:\'\', 8:\'\', 9:\'\', 10:\'\', 11:\'\', 12:\'\' }); // TODO: answers\n  </script>'
    },
    '1-leseverstehen-teil-3.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initLV3)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initLV3({\n      13:\'\', 14:\'\', 15:\'\', 16:\'\', 17:\'\', 18:\'\',\n      19:\'\', 20:\'\', 21:\'\', 22:\'\', 23:\'\', 24:\'\'\n    }); // TODO: answers\n  </script>'
    },
    '2-sprachbausteine.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initSB)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initSB({\n      25:\'\',26:\'\',27:\'\',28:\'\',29:\'\',30:\'\',31:\'\',32:\'\',33:\'\',34:\'\',\n      35:\'\',36:\'\',37:\'\',38:\'\',39:\'\',40:\'\',41:\'\',42:\'\',43:\'\',44:\'\',\n      45:\'\',46:\'\',47:\'\'\n    }); // TODO: answers\n  </script>'
    },
    '3-hoerverstehen-teil-1.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initHV1)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initHV1({ 47:\'\', 48:\'\', 49:\'\', 50:\'\', 51:\'\', 52:\'\', 53:\'\', 54:\'\' }); // TODO: answers\n  </script>'
    },
    '3-hoerverstehen-teil-2.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initHV2)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initHV2({ 55:\'\', 56:\'\', 57:\'\', 58:\'\', 59:\'\', 60:\'\', 61:\'\', 62:\'\', 63:\'\', 64:\'\' }); // TODO: answers\n  </script>'
    },
    '3-hoerverstehen-teil-3.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+correctAnswers|Pruefung\.initHV3)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initHV3({\n      65:[], 66:[], \'67a\':[], \'67b\':[], \'68a\':[], \'68b\':[],\n      69:[], \'70a\':[], \'70b\':[], \'71a\':[], \'71b\':[],\n      72:[], 73:[], 74:[]\n    }, {\n      65:\'65\', 66:\'66\', \'67a\':\'67 (Teil 1)\', \'67b\':\'67 (Teil 2)\',\n      \'68a\':\'68 (Teil 1)\', \'68b\':\'68 (Teil 2)\', 69:\'69\',\n      \'70a\':\'70 (Alte)\', \'70b\':\'70 (Neue)\', \'71a\':\'71 (Teil 1)\', \'71b\':\'71 (Teil 2)\',\n      72:\'72\', 73:\'73\', 74:\'74\'\n    }); // TODO: answers\n  </script>'
    },
    '4-schriftlicher-ausdruck.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:let\s+selectedThema|Pruefung\.initSA)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initSA({\n      /* TODO: thema1key */\n      thema1: { title: \'/* TODO */\', zitate: [\'/* TODO */\', \'/* TODO */\'] },\n      /* TODO: thema2key */\n      thema2: { title: \'/* TODO */\', zitate: [\'/* TODO */\', \'/* TODO */\'] }\n    });\n  </script>'
    },
    '5-muendlich-praesentation.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+themaTexte|Pruefung\.initPraesentation)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initPraesentation({\n      \'a1\': \'/* TODO */\', \'a2\': \'/* TODO */\',\n      \'b1\': \'/* TODO */\', \'b2\': \'/* TODO */\',\n      \'c1\': \'/* TODO */\', \'c2\': \'/* TODO */\'\n    });\n  </script>'
    },
    '5-muendlich-zusammenfassung.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:let\s+meinThema|Pruefung\.initZusammenfassung)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initZusammenfassung();\n  </script>'
    },
    '5-muendlich-diskussion.html': {
        'pattern': r'  <script>\s*(?://[^\n]*\n\s*)*(?:const\s+zitate|Pruefung\.initDiskussion)[\s\S]*?</script>',
        'replacement': '  <script>\n    Pruefung.initDiskussion({\n      1: { text:\'/* TODO */\', autor:\'/* TODO */\', aspekte:[\'/* TODO */\',\'/* TODO */\',\'/* TODO */\',\'/* TODO */\'] },\n      2: { text:\'/* TODO */\', autor:\'/* TODO */\', aspekte:[\'/* TODO */\',\'/* TODO */\',\'/* TODO */\',\'/* TODO */\'] },\n      3: { text:\'/* TODO */\', autor:\'/* TODO */\', aspekte:[\'/* TODO */\',\'/* TODO */\',\'/* TODO */\',\'/* TODO */\'] },\n      4: { text:\'/* TODO */\', autor:\'/* TODO */\', aspekte:[\'/* TODO */\',\'/* TODO */\',\'/* TODO */\',\'/* TODO */\'] }\n    });\n  </script>'
    },
}

for modell in sorted(glob.glob(os.path.join(BASE, 'modell-[2-5]'))):
    name = os.path.basename(modell)
    print(f'\n=== {name} ===')
    
    for fname, cfg in REPLACEMENTS.items():
        fpath = os.path.join(modell, fname)
        if not os.path.exists(fpath):
            continue
        
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = re.sub(cfg['pattern'], cfg['replacement'], content, count=1)
        
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'  Updated: {fname}')
        else:
            print(f'  Skipped: {fname} (no match)')

print('\nDone!')
