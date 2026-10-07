#!/usr/bin/env python3
"""Fill a .pot with hand-written Persian translations and write the .po.

usage: build.py <pot> <out.po> <domain> <project> <module> [<module> ...]
Each module defines T = {msgid | "ctx\x04msgid": msgstr | [msgstr0, msgstr1]}.
In msgstr, "~" stands for ZWNJ (U+200C).
"""
import importlib.util
import os
import re
import sys
from datetime import datetime, timezone

ZWNJ = "\u200c"


def load(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.T


def unq(s):
    # PO string literal body -> python str
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            n = s[i + 1]
            out.append({"n": "\n", "t": "\t", '"': '"', "\\": "\\", "r": "\r"}.get(n, "\\" + n))
            i += 2
        else:
            out.append(c)
            i += 1
    return "".join(out)


def q(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\t", "\\t").replace("\n", "\\n")


def parse(path):
    """Return header block lines and entries with raw comment lines."""
    entries, cur = [], None
    blocks = open(path, encoding="utf-8").read().split("\n\n")
    for block in blocks:
        lines = [l for l in block.split("\n") if l.strip()]
        if not lines:
            continue
        e = {"comments": [], "fields": {}, "order": []}
        last = None
        for l in lines:
            if l.startswith("#"):
                e["comments"].append(l)
                continue
            m = re.match(r'^(msgctxt|msgid_plural|msgid|msgstr\[\d\]|msgstr)\s+"(.*)"$', l)
            if m:
                last = m.group(1)
                e["fields"][last] = unq(m.group(2))
                e["order"].append(last)
            elif l.startswith('"') and last:
                e["fields"][last] += unq(l[1:-1])
        if "msgid" in e["fields"]:
            entries.append(e)
    return entries


def fmt_field(name, value):
    if "\n" in value and value.strip("\n"):
        parts = value.split("\n")
        chunks = [p + "\n" for p in parts[:-1]] + ([parts[-1]] if parts[-1] else [])
        return name + ' ""\n' + "\n".join('"' + q(c) + '"' for c in chunks)
    return name + ' "' + q(value) + '"'


def main():
    pot, out, domain, project = sys.argv[1:5]
    T = {}
    for mod in sys.argv[5:]:
        for k, v in load(mod).items():
            if k in T and T[k] != v:
                print("CONFLICT", repr(k), "|", T[k], "|", v)
            T[k] = v
    entries = parse(pot)
    header, body = entries[0], entries[1:]
    hdr = header["fields"]["msgstr"]
    pot_date = re.search(r"POT-Creation-Date: ([^\n]*)", hdr).group(1)
    bugs = re.search(r"Report-Msgid-Bugs-To: ([^\n]*)", hdr).group(1)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M+0000")
    head_lines = [
        "Project-Id-Version: " + project,
        "Report-Msgid-Bugs-To: " + bugs,
        "POT-Creation-Date: " + pot_date,
        "PO-Revision-Date: " + now,
        "Last-Translator: Hamista",
        "Language-Team: Persian",
        "Language: fa_IR",
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: 8bit",
        "Plural-Forms: nplurals=2; plural=(n != 1);",
        "X-Domain: " + domain,
    ]
    res = ["# Persian (fa_IR) translation of " + project.rsplit(" ", 1)[0] + ".",
           "# This file is distributed under the GNU General Public License v2 or later.",
           'msgid ""', 'msgstr ""'] + ['"' + q(l) + '\\n"' for l in head_lines]
    missing, used = [], set()
    for e in body:
        f = e["fields"]
        key = (f["msgctxt"] + "\x04" if "msgctxt" in f else "") + f["msgid"]
        tr = T.get(key)
        if tr is None:
            missing.append(key)
            tr = "" if "msgid_plural" not in f else ["", ""]
        used.add(key)
        if isinstance(tr, str):
            tr = tr.replace("~", ZWNJ)
        else:
            tr = [t.replace("~", ZWNJ) for t in tr]
        res.append("")
        res.extend(e["comments"])
        if "msgctxt" in f:
            res.append(fmt_field("msgctxt", f["msgctxt"]))
        res.append(fmt_field("msgid", f["msgid"]))
        if "msgid_plural" in f:
            res.append(fmt_field("msgid_plural", f["msgid_plural"]))
            if isinstance(tr, str):
                tr = [tr, tr]
            res.append(fmt_field("msgstr[0]", tr[0]))
            res.append(fmt_field("msgstr[1]", tr[1]))
        else:
            if not isinstance(tr, str):
                print("PLURAL GIVEN FOR SINGULAR", repr(key))
                tr = tr[0]
            res.append(fmt_field("msgstr", tr))
    open(out, "w", encoding="utf-8").write("\n".join(res) + "\n")
    for k in missing:
        print("MISSING", repr(k))
    for k in T:
        if k not in used:
            print("UNUSED", repr(k))
    print("entries:", len(body), "missing:", len(missing))


if __name__ == "__main__":
    main()
