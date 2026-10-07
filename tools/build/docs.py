#!/usr/bin/env python3
"""Renders docs/guide-fa.md and docs/guide-en.md to standalone HTML (RTL for Persian).

    pip install markdown
    python3 tools/build/docs.py <out-dir>
"""
import pathlib
import sys

import markdown

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGES = (
	('guide-fa', 'rtl', 'fa', 'راهنمای قالب هامیستا'),
	('guide-en', 'ltr', 'en', 'Hamista documentation'),
)

STYLE = """
:root { color-scheme: light dark; --bg:#fbfaf7; --fg:#1b1a17; --muted:#6a655c; --line:#e4e0d6; --code:#f1eee6; --accent:#c2410c; }
@media (prefers-color-scheme: dark) { :root { --bg:#12110f; --fg:#efece4; --muted:#a8a298; --line:#2b2924; --code:#1c1a17; --accent:#fb923c; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.9 Vazirmatn, Tahoma, "Segoe UI", system-ui, sans-serif; }
main { max-width: 860px; margin: 0 auto; padding: 48px 20px 96px; }
h1 { font-size: 2.1rem; line-height:1.3; margin: 0 0 .6em; }
h2 { font-size: 1.45rem; margin: 2.2em 0 .6em; padding-bottom:.3em; border-bottom:1px solid var(--line); }
h3 { font-size: 1.15rem; margin: 1.6em 0 .4em; }
a { color: var(--accent); }
table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .95rem; display:block; overflow-x:auto; }
th, td { border:1px solid var(--line); padding:.55em .8em; text-align: start; vertical-align: top; }
th { background: var(--code); }
code { background: var(--code); padding: .1em .4em; border-radius: 5px; font: .88em ui-monospace, Menlo, Consolas, monospace; direction:ltr; unicode-bidi: isolate; }
pre { background: var(--code); padding: 1em 1.2em; border-radius: 10px; overflow-x:auto; direction:ltr; text-align:left; line-height:1.6; }
pre code { background:none; padding:0; }
li { margin: .25em 0; }
"""

def main():
	out = pathlib.Path(sys.argv[1])
	out.mkdir(parents=True, exist_ok=True)
	for name, direction, lang, title in PAGES:
		source = (ROOT / 'docs' / (name + '.md')).read_text(encoding='utf-8')
		body = markdown.markdown(source, extensions=['tables', 'fenced_code', 'sane_lists'])
		html = (
			'<!doctype html>\n<html lang="%s" dir="%s">\n<head>\n<meta charset="utf-8">\n'
			'<meta name="viewport" content="width=device-width, initial-scale=1">\n'
			'<title>%s</title>\n<style>%s</style>\n</head>\n<body>\n<main>\n%s\n</main>\n</body>\n</html>\n'
		) % (lang, direction, title, STYLE, body)
		(out / (name + '.html')).write_text(html, encoding='utf-8')
		print('wrote', out / (name + '.html'))


if __name__ == '__main__':
	main()
