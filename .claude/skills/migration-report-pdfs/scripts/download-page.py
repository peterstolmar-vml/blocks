"""Write the WKND-style download page for one report PDF.

Usage: python3 -I download-page.py <REPORT.md> <content/PREFIX-NAME.html> <PREFIX-NAME.pdf>
The page title and summary come from the Markdown front matter; the contents list from its
level-1 headings.
"""
import html
import re
import sys

md, dest, pdf = sys.argv[1:4]
text = open(md, encoding='utf-8').read()
title = re.search(r'^title:\s*"(.*)"', text, re.M).group(1).replace(' — ', ' - ')
sub = re.search(r'^subtitle:\s*"(.*)"', text, re.M)
summary = sub.group(1) if sub else ''
body = text.split('---', 2)[-1]
body = re.sub(r'```[\s\S]*?```', '', body)  # ignore code blocks
heads = [h.strip() for h in re.findall(r'^# (.+)$', body, re.M)]
kind = 'guide' if 'GUIDE' in pdf else 'report'
items = '\n'.join(f'      <li>{html.escape(h)}</li>' for h in heads)

with open(dest, 'w', encoding='utf-8') as f:
    f.write(f'''<body>
  <main>
    <h1>{html.escape(title)}</h1>
    <p>{html.escape(summary)}.</p>
    <h2>Contents</h2>
    <ul>
{items}
    </ul>
    <h2>Download</h2>
    <p><strong>Download the full PDF {kind}:</strong> <a href="./{pdf}">{pdf}</a></p>
  </main>
</body>
''')
