"""
Typographic medallions and girih covers for the Khane-ye Hekmat demo.

    python3 tools/demo-images/hekmat-art.py <svg-out-dir>

Writes SVG files; tools/demo-images/svg-render.js turns them into images so the
letters are set in the bundled Doran face.
"""
import math
import os
import sys

GOLD = '#d8b46c'
INK = '#0b1220'
PAPER = '#ece3cf'


def medallion(letter, tone, seed):
    w, h = 900, 1125
    cx, cy = w / 2, h / 2 - 20
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{GOLD}">']
    o.append(f'<defs><radialGradient id="g" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="{tone}"/><stop offset="1" stop-color="{INK}"/></radialGradient></defs>')
    o.append(f'<rect width="{w}" height="{h}" fill="url(#g)" stroke="none"/>')
    rings = [(330, 2.4, 1), (318, 1, .7), (262, 1.2, .8), (250, .8, .5)]
    for r, sw, op in rings:
        o.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke-width="{sw}" stroke-opacity="{op}"/>')
    # Ring of dots and fine ticks between the two outer rings.
    for k in range(48):
        a = math.radians(k * 7.5 + seed)
        x, y = cx + 290 * math.cos(a), cy + 290 * math.sin(a)
        if k % 2 == 0:
            o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.2" fill="{GOLD}" stroke="none"/>')
        else:
            x1, y1 = cx + 276 * math.cos(a), cy + 276 * math.sin(a)
            x2, y2 = cx + 304 * math.cos(a), cy + 304 * math.sin(a)
            o.append(f'<path d="M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}" stroke-width="1" stroke-opacity=".7"/>')
    # Eight-pointed star behind the letter.
    pts = []
    for k in range(16):
        a = math.radians(k * 22.5 - 90)
        r = 230 if k % 2 == 0 else 230 * 0.765
        pts.append(f'{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}')
    o.append(f'<polygon points="{" ".join(pts)}" stroke-width="1" stroke-opacity=".35"/>')
    o.append(f'<text x="{cx}" y="{cy + 8}" fill="{PAPER}" stroke="none" font-family="Doran" font-weight="800" font-size="300" text-anchor="middle" dominant-baseline="central">{letter}</text>')
    o.append('</svg>')
    return '\n'.join(o)


def girih(scale, tone, offset):
    """Khatam lattice: eight-pointed stars on a grid, linked by crosses."""
    w, h = 1200, 800
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{GOLD}">']
    o.append(f'<defs><radialGradient id="v" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="{tone}"/><stop offset="1" stop-color="{INK}"/></radialGradient>'
             f'<radialGradient id="m" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
             f'<mask id="k"><rect width="{w}" height="{h}" fill="url(#m)"/></mask></defs>')
    o.append(f'<rect width="{w}" height="{h}" fill="url(#v)" stroke="none"/>')
    o.append('<g mask="url(#k)">')
    R = scale
    d = R * 2 * math.cos(math.radians(22.5))
    rows = int(h / d) + 3
    cols = int(w / d) + 3
    for i in range(-1, rows):
        for j in range(-1, cols):
            cx = j * d + offset
            cy = i * d + offset * .6
            pts = []
            for k in range(16):
                a = math.radians(k * 22.5)
                r = R if k % 2 == 0 else R * 0.765
                pts.append(f'{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}')
            o.append(f'<polygon points="{" ".join(pts)}" stroke-width="1.8" stroke-opacity=".95"/>')
            o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{R * .32:.1f}" stroke-width="1.1" stroke-opacity=".6"/>')
            # Cross linking this star with its right and lower neighbours.
            mx, my = cx + d / 2, cy + d / 2
            arm = d / 2 - R * 0.765 * math.cos(math.radians(22.5))
            o.append(f'<path d="M{mx - arm:.1f} {my:.1f}H{mx + arm:.1f}M{mx:.1f} {my - arm:.1f}V{my + arm:.1f}" stroke-width="1.4" stroke-opacity=".75"/>')
    o.append('</g></svg>')
    return '\n'.join(o)


if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    people = [('ا', '#1a2742'), ('ف', '#22233f'), ('خ', '#1b2a3a'), ('م', '#26223a'), ('س', '#1d2b40'), ('ح', '#23273f')]
    for i, (letter, tone) in enumerate(people, 1):
        with open(os.path.join(out, f'thinker-{i}.svg'), 'w', encoding='utf-8') as f:
            f.write(medallion(letter, tone, i * 3))
    covers = [(70, '#1a2742', 0), (52, '#24213b', 30), (90, '#182838', 15), (60, '#241f30', 45)]
    for i, (scale, tone, off) in enumerate(covers, 1):
        with open(os.path.join(out, f'essay-{i}.svg'), 'w', encoding='utf-8') as f:
            f.write(girih(scale, tone, off))
    print('ok')
