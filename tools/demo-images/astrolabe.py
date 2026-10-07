"""
Line drawing of a Persian astrolabe, used as the hero object of the Khane-ye
Hekmat demo. The plate is a true stereographic projection for the latitude of
Isfahan (32.6°): tropics, equator, almucantars every 6° and azimuths every 10°.

    python3 tools/demo-images/astrolabe.py <out.svg> [colour]
"""
import math
import sys

LAT = math.radians(32.6)
EPS = math.radians(23.44)
CX, CY = 600, 760
RIM = 540
R_CAP = 470
R_EQ = R_CAP / math.tan(math.pi / 4 + EPS / 2)
R_CAN = R_EQ * math.tan(math.pi / 4 - EPS / 2)
FA = '۰۱۲۳۴۵۶۷۸۹'


def fa(n):
    return ''.join(FA[int(d)] for d in str(n))


def circle(cx, cy, r, w=1.0, op=1.0, extra=''):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" stroke-width="{w}" stroke-opacity="{op}" {extra}/>'


def polar(r, deg, cx=CX, cy=CY):
    a = math.radians(deg - 90)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def build(colour):
    out = []
    add = out.append
    add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1320" fill="none" stroke="{colour}" stroke-linecap="round" stroke-linejoin="round">')
    add('<defs>')
    add(f'<clipPath id="plate"><circle cx="{CX}" cy="{CY}" r="{R_CAP}"/></clipPath>')
    # Horizon (altitude 0) bounds the azimuth lines.
    hy = CY - R_EQ * math.cos(LAT) / math.sin(LAT)
    hr = R_EQ / math.sin(LAT)
    add(f'<clipPath id="sky"><circle cx="{CX}" cy="{hy:.1f}" r="{hr:.1f}"/></clipPath>')
    add('</defs>')

    # Throne and shackle.
    top = CY - RIM
    add(f'<path d="M{CX-150} {top+40} C{CX-140} {top-30} {CX-80} {top-70} {CX-46} {top-96} C{CX-26} {top-112} {CX-14} {top-128} {CX} {top-132} C{CX+14} {top-128} {CX+26} {top-112} {CX+46} {top-96} C{CX+80} {top-70} {CX+140} {top-30} {CX+150} {top+40}" stroke-width="3" fill="{colour}" fill-opacity=".06"/>')
    add(f'<path d="M{CX-104} {top+12} C{CX-90} {top-30} {CX-50} {top-58} {CX} {top-82} C{CX+50} {top-58} {CX+90} {top-30} {CX+104} {top+12}" stroke-width="1.2" stroke-opacity=".7"/>')
    for dx in (-52, 0, 52):
        add(circle(CX + dx, top - 22 - (18 if dx == 0 else 0), 13, 1.2, .8))
    add(circle(CX, top - 150, 16, 3))
    add(circle(CX, top - 196, 34, 3))
    add(circle(CX, top - 196, 26, 1, .6))

    # Rim and degree scale.
    add(circle(CX, CY, RIM, 3.2))
    add(circle(CX, CY, RIM - 8, 1.2, .8))
    add(circle(CX, CY, RIM - 30, 1, .7))
    add(circle(CX, CY, RIM - 58, 1.4, .9))
    ticks = []
    for d in range(360):
        r1 = RIM - 8
        r2 = r1 - (22 if d % 15 == 0 else 14 if d % 5 == 0 else 7)
        x1, y1 = polar(r1, d)
        x2, y2 = polar(r2, d)
        ticks.append(f'M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}')
    add(f'<path d="{" ".join(ticks)}" stroke-width=".9" stroke-opacity=".85"/>')
    for d in range(0, 360, 30):
        x, y = polar(RIM - 44, d)
        add(f'<text x="{x:.1f}" y="{y:.1f}" fill="{colour}" stroke="none" font-family="Doran, Vazirmatn, serif" font-size="22" font-weight="500" text-anchor="middle" dominant-baseline="central" transform="rotate({d} {x:.1f} {y:.1f})">{fa(d)}</text>')

    # Plate: tropics, equator, almucantars, azimuths.
    add(circle(CX, CY, R_CAP, 1.6, .9))
    add(circle(CX, CY, R_EQ, 1.1, .75))
    add(circle(CX, CY, R_CAN, 1.1, .75))
    add(f'<path d="M{CX-R_CAP} {CY}H{CX+R_CAP}M{CX} {CY-R_CAP}V{CY+R_CAP}" stroke-width=".9" stroke-opacity=".6"/>')
    add('<g clip-path="url(#plate)">')
    for a in range(0, 90, 6):
        ar = math.radians(a)
        y = CY - R_EQ * math.cos(LAT) / (math.sin(LAT) + math.sin(ar))
        r = R_EQ * math.cos(ar) / (math.sin(LAT) + math.sin(ar))
        add(circle(CX, y, r, 1.3 if a == 0 else .8, .9 if a == 0 else .55))
    zen = CY - R_EQ * math.tan((math.pi / 2 - LAT) / 2)
    nad = CY + R_EQ * math.tan((math.pi / 2 + LAT) / 2)
    mid = (zen + nad) / 2
    half = (nad - zen) / 2
    add('<g clip-path="url(#sky)">')
    for az in range(10, 180, 10):
        c = half / math.tan(math.radians(az))
        r = math.hypot(c, half)
        add(circle(CX + c, mid, r, .7, .45))
    add('</g>')
    add(circle(CX, zen, 4, 1.2, .9, f'fill="{colour}"'))
    add('</g>')

    # Rete: ecliptic ring with zodiac divisions, outer ring and star pointers.
    rot = 28
    add(f'<g transform="rotate({rot} {CX} {CY})">')
    add(circle(CX, CY, R_CAP - 6, 2.4))
    ecy = CY - (R_CAP - R_CAN) / 2
    er = (R_CAP + R_CAN) / 2
    add(f'<circle cx="{CX}" cy="{ecy:.1f}" r="{er:.1f}" stroke-width="2.4" fill="none"/>')
    add(f'<circle cx="{CX}" cy="{ecy:.1f}" r="{er - 24:.1f}" stroke-width="1.4"/>')
    div = []
    for k in range(72):
        ang = k * 5
        x1, y1 = polar(er, ang, CX, ecy)
        x2, y2 = polar(er - (24 if k % 6 == 0 else 9), ang, CX, ecy)
        div.append(f'M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}')
    add(f'<path d="{" ".join(div)}" stroke-width="1.1" stroke-opacity=".9"/>')
    # Bars from the outer ring to the ecliptic.
    for ang in (0, 90, 180, 270):
        x1, y1 = polar(R_CAP - 6, ang)
        x2, y2 = polar(R_CAN - 30, ang)
        add(f'<path d="M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}" stroke-width="1.4" stroke-opacity=".85"/>')
    # Star pointers: flame-shaped leaves with a dot at the tip.
    stars = [(400, 20), (360, 62), (300, 104), (420, 140), (250, 176), (380, 212), (330, 248), (430, 286), (280, 322), (210, 40), (180, 230), (260, 296)]
    for r, ang in stars:
        # A slim curved flame: a wide base, a long tip that hooks slightly.
        tx, ty = polar(r, ang)
        bx, by = polar(r - 64, ang - 2)
        cx1, cy1 = polar(r - 34, ang + 3.2)
        cx2, cy2 = polar(r - 40, ang - 5.5)
        add(f'<path d="M{bx:.1f} {by:.1f}Q{cx1:.1f} {cy1:.1f} {tx:.1f} {ty:.1f}Q{cx2:.1f} {cy2:.1f} {bx:.1f} {by:.1f}Z" stroke-width="1.3" fill="{colour}" fill-opacity=".18"/>')
        add(circle(tx, ty, 3.2, 1, 1, f'fill="{colour}"'))
    add('</g>')

    # Alidade (rule) and the central pin.
    ang = -38
    tip1 = polar(RIM - 12, ang)
    tip2 = polar(RIM - 12, ang + 180)
    s1 = polar(26, ang + 90)
    s2 = polar(26, ang - 90)
    add(f'<path d="M{tip1[0]:.1f} {tip1[1]:.1f}L{s1[0]:.1f} {s1[1]:.1f}L{tip2[0]:.1f} {tip2[1]:.1f}L{s2[0]:.1f} {s2[1]:.1f}Z" stroke-width="2.2" fill="{colour}" fill-opacity=".08"/>')
    for r in (160, 300):
        for sign in (0, 180):
            x, y = polar(r, ang + sign)
            add(circle(x, y, 7, 1.4))
    add(circle(CX, CY, 22, 2.4, 1, f'fill="{colour}" fill-opacity=".15"'))
    add(circle(CX, CY, 7, 1.6, 1, f'fill="{colour}"'))
    add('</svg>')
    return '\n'.join(out)


if __name__ == '__main__':
    path = sys.argv[1]
    colour = sys.argv[2] if len(sys.argv) > 2 else '#d8b46c'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(build(colour))
    print(path)
