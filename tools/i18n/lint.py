#!/usr/bin/env python3
"""Lint a Persian .po: placeholders, markup, typography, ZWNJ."""
import re
import sys
from collections import Counter

sys.path.insert(0, __import__("os").path.dirname(__file__))
from build import parse  # noqa: E402

PH = re.compile(r"%(?:\d+\$)?[sd]|%%|%token%|\{[a-z]+\}|\[[a-z_]+\]|</?[a-z]+>")
FA = re.compile(r"[؀-ۿ]")
WORD = re.compile(r"[؀-ۿ‌]+")
# Words that legitimately end in «ها» without being a plural suffix.
HA_OK = {"تنها", "بها", "رها", "صدها", "هزارها"}

issues = 0


def warn(kind, msgid, msgstr, extra=""):
    global issues
    issues += 1
    print(f"[{kind}] {msgid!r}\n    -> {msgstr!r} {extra}")


for path in sys.argv[1:]:
    print("==", path)
    for e in parse(path)[1:]:
        f = e["fields"]
        mid = f["msgid"]
        strs = [v for k, v in f.items() if k.startswith("msgstr")]
        flags = " ".join(c for c in e["comments"] if c.startswith("#,"))
        for s in strs:
            if not s:
                warn("EMPTY", mid, s)
                continue
            if Counter(PH.findall(mid)) != Counter(PH.findall(s)) and not ("msgid_plural" in f):
                warn("PLACEHOLDER", mid, s, str(PH.findall(mid)) + " vs " + str(PH.findall(s)))
            if "msgid_plural" in f and Counter(PH.findall(f["msgid_plural"])) != Counter(PH.findall(s)):
                warn("PLACEHOLDER", mid, s)
            if mid.count("*") != s.count("*"):
                warn("ASTERISK", mid, s)
            if mid.count("\n") != s.count("\n"):
                warn("NEWLINE", mid, s)
            if mid[:1] == " " or mid[-1:] == " ":
                if (mid[:1] == " ") != (s[:1] == " ") or (mid[-1:] == " ") != (s[-1:] == " "):
                    warn("EDGE-SPACE", mid, s)
            if re.search("[يك]", s):
                warn("ARABIC-YK", mid, s)
            if re.search("[“”‘’]", s) or ('"' in s and FA.search(s)):
                warn("QUOTES", mid, s)
            if "..." in s:
                warn("ELLIPSIS", mid, s)
            if "  " in s:
                warn("DOUBLE-SPACE", mid, s)
            if FA.search(s):
                # Latin punctuation next to Persian text.
                for m in re.finditer(r"[؀-ۿ‌»)]\s*([,;?])", s):
                    warn("LATIN-PUNCT", mid, s, m.group(0))
                if re.search(r"(^|[\s«(])ن?می [؀-ۿ]", s):
                    warn("ZWNJ-MI", mid, s)
                for w in WORD.findall(s):
                    base = w.split("‌")[-1]
                    for suf in ("هایی", "های", "ها"):
                        if base.endswith(suf) and len(base) > len(suf) + 1 and base not in HA_OK and base[-len(suf) - 1] not in "اآدذرزژوءۀ":
                            warn("ZWNJ-HA", mid, s, w)
                            break
                    if re.search(r"‌$|^‌|‌‌", w):
                        warn("ZWNJ-EDGE", mid, s, w)
                    if re.search(r"[اآدذرزژو]‌", w):
                        warn("ZWNJ-AFTER-NONJOINER", mid, s, w)
                if re.search(r"[A-Za-z]{3,}", s):
                    latin = [x for x in re.findall(r"[A-Za-z][A-Za-z0-9.\-_]+", s)]
                    print("   (latin)", latin, "<-", s[:70])
print("issues:", issues)
