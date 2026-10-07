"""
Long-exposure light trails for the Sayal motion-studio demo.

    python3 tools/demo-images/scenes-trails.py <out-dir>

Bundles of thin curves are drawn additively and blurred at two radii (a core
and a halo), the way a moving light streaks across a long exposure. Flat,
photographic and free of 3D objects.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PALETTES = {
    'ember': [(255, 176, 92), (255, 120, 60), (255, 222, 170), (220, 70, 40)],
    'ivory': [(255, 240, 220), (255, 214, 170), (240, 240, 245), (255, 190, 130)],
    'dusk': [(255, 150, 110), (190, 120, 255), (255, 210, 190), (120, 140, 255)],
    'mono': [(235, 232, 226), (200, 196, 190), (255, 250, 240), (170, 168, 165)],
}


def trails(w, h, seed, palette='ember', bundles=3, lines=60, amp=0.18, tilt=-0.15, bg=(10, 9, 9)):
    rng = np.random.default_rng(seed)
    scale = 2  # draw large, then reduce for smooth lines
    W, H = w * scale, h * scale
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cols = PALETTES[palette]
    xs = np.linspace(-0.1, 1.1, 360)
    for b in range(bundles):
        y0 = rng.uniform(0.3, 0.7)
        f1, f2 = rng.uniform(1.2, 2.6), rng.uniform(3.0, 5.0)
        p1, p2 = rng.uniform(0, 6.28, 2)
        a = amp * rng.uniform(0.6, 1.3)
        spread = rng.uniform(0.04, 0.12)
        for k in range(lines):
            t = k / max(lines - 1, 1) - 0.5
            off = t * spread + rng.normal(0, spread * 0.08)
            ys = (y0 + off + (xs - 0.5) * tilt
                  + a * np.sin(xs * f1 * np.pi + p1 + t * 0.6)
                  + a * 0.25 * np.sin(xs * f2 * np.pi + p2 - t))
            c = cols[(b + k) % len(cols)]
            fade = 0.25 + 0.75 * (1 - abs(t) * 1.8) ** 2 if abs(t) < 0.55 else 0.15
            col = tuple(int(v * fade * rng.uniform(0.55, 1.0)) for v in c)
            pts = list(zip((xs * W).tolist(), (ys * H).tolist()))
            draw.line(pts, fill=col, width=max(1, int(scale * rng.uniform(0.6, 1.6))))
    core = np.asarray(layer.filter(ImageFilter.GaussianBlur(1.2 * scale)), np.float32)
    halo = np.asarray(layer.filter(ImageFilter.GaussianBlur(18 * scale)), np.float32)
    img = np.array(bg, np.float32) + core * 1.1 + halo * 2.2
    img = np.clip(img, 0, 255)
    out = Image.fromarray(img.astype(np.uint8)).resize((w, h), Image.LANCZOS)
    arr = np.asarray(out, np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    arr = arr * (1 - 0.45 * np.clip(d - 0.45, 0, 1)[..., None] ** 1.5)
    arr = arr + rng.normal(0, 2.2, (h, w))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


PLAN = {
    # name: (w, h, seed, palette, extra)
    'hero': (2000, 1125, 3, 'ember', dict(bundles=4, lines=70)),
    'chat': (1600, 900, 8, 'ivory', dict(bundles=2, lines=50, tilt=0.1)),
    'reel': (2000, 1000, 12, 'ember', dict(bundles=3, lines=80, amp=0.12)),
    'work-1': (900, 1125, 21, 'ember', dict(tilt=-0.4)),
    'work-2': (900, 1125, 22, 'ivory', dict(tilt=0.3)),
    'work-3': (900, 1125, 23, 'dusk', dict(tilt=-0.2, bundles=2)),
    'work-4': (900, 1125, 24, 'mono', dict(tilt=0.5)),
    'work-5': (900, 1125, 25, 'ember', dict(amp=0.25, bundles=2)),
    'work-6': (900, 1125, 26, 'ivory', dict(amp=0.08, lines=90)),
}
for i in range(1, 7):
    PLAN[f'journal-{i}'] = (1200, 800, 40 + i, ['ember', 'ivory', 'mono', 'dusk', 'ember', 'ivory'][i - 1], dict(bundles=2))
    PLAN[f'product-{i}'] = (1000, 1000, 60 + i, ['ember', 'ivory', 'mono', 'dusk', 'ember', 'mono'][i - 1], dict(bundles=2, tilt=-0.3))
    PLAN[f'product-{i}-b'] = (1000, 1000, 80 + i, ['ivory', 'ember', 'dusk', 'mono', 'ivory', 'ember'][i - 1], dict(bundles=3, tilt=0.25))

if __name__ == '__main__':
    out = sys.argv[1]
    only = set(sys.argv[2:])
    os.makedirs(out, exist_ok=True)
    total = 0
    for name, (w, h, seed, pal, extra) in PLAN.items():
        if only and name not in only:
            continue
        im = trails(w, h, seed, pal, **extra)
        path = os.path.join(out, name + '.webp')
        im.save(path, 'WEBP', quality=78, method=6)
        total += os.path.getsize(path) // 1024
    print('total', total, 'KB')
