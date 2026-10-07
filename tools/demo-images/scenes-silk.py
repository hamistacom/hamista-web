"""
Gold silk on black for the Zarrinbal private-aviation demo.

    python3 tools/demo-images/scenes-silk.py <out-dir>

A ribbon is a band between two flowing curves; inside it a height field of
travelling folds is lit with a soft key light and a sharp specular sheen, the
way satin catches light. Edges fade into the black.
"""
import os
import sys

import numpy as np
from PIL import Image


def silk(w, h, seed, angle=-0.38, width=0.42, folds=3.2, twist=0.9, tint=(1.0, 0.86, 0.6)):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u = xx / w - 0.5
    v = yy / h - 0.5
    # Rotate into ribbon space: s runs along the ribbon, t across it.
    ca, sa = np.cos(angle), np.sin(angle)
    s = u * ca - v * sa
    t = u * sa + v * ca
    ph = rng.random(4) * 6.28
    centre = 0.08 * np.sin(s * 5.0 + ph[0]) + 0.05 * np.sin(s * 9.0 + ph[1])
    half = width / 2 * (0.75 + 0.35 * np.sin(s * 3.2 + ph[2]))
    d = (t - centre) / half  # -1..1 across the band
    inside = np.clip(1 - np.abs(d), 0, 1)
    edge = np.clip(inside * 6, 0, 1) ** 1.5
    # Folds: ridges running mostly along the ribbon, twisting slowly.
    hgt = (np.sin(d * folds * np.pi + s * 7 * twist + ph[3]) * 0.6
           + np.sin(d * folds * 1.9 * np.pi - s * 4.0) * 0.25
           + np.sin(s * 14 + d * 2.0) * 0.08)
    gy, gx = np.gradient(hgt * 40)
    nx, ny, nz = -gx, -gy, np.ones_like(hgt) * 1.0
    n = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx / n, ny / n, nz / n
    light = np.array([-0.45, -0.55, 0.7])
    light /= np.linalg.norm(light)
    diff = np.clip(nx * light[0] + ny * light[1] + nz * light[2], 0, 1)
    half_v = light + np.array([0, 0, 1.0])
    half_v /= np.linalg.norm(half_v)
    spec = np.clip(nx * half_v[0] + ny * half_v[1] + nz * half_v[2], 0, 1) ** 60
    sheen = np.clip(nx * 0.2 + ny * -0.9 + nz * 0.4, 0, 1) ** 8
    base = np.array(tint, np.float32)
    col = (diff[..., None] ** 1.4) * base * 190 + spec[..., None] * np.array([255, 246, 220]) * 0.95 + sheen[..., None] * base * 70
    col = col * edge[..., None]
    # Ambient glow around the ribbon.
    glow = np.exp(-np.clip(np.abs(d) - 1, 0, None) * 3.5)[..., None] * base * 18
    img = col + glow * (1 - edge[..., None])
    # Vignette and fine grain.
    r = np.sqrt(u * u * 1.4 + v * v * 2.0)
    img = img * np.clip(1.25 - r * 1.1, 0.25, 1)[..., None]
    img = img + rng.normal(0, 1.6, (h, w))[..., None]
    return np.clip(img, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(out, exist_ok=True)
    plan = {
        'silk-hero': dict(w=2000, h=1200, seed=4, angle=-0.32, width=0.44),
        'silk-wide': dict(w=2000, h=900, seed=9, angle=0.12, width=0.36, folds=2.6),
        'silk-tall': dict(w=1000, h=1250, seed=13, angle=-1.1, width=0.5, folds=2.8),
        'silk-card-1': dict(w=1200, h=900, seed=21, angle=-0.6, width=0.5),
        'silk-card-2': dict(w=1200, h=900, seed=33, angle=0.5, width=0.45, folds=3.8),
        'silk-card-3': dict(w=1200, h=900, seed=47, angle=-0.15, width=0.4, tint=(0.95, 0.9, 0.82)),
    }
    for name, args in plan.items():
        arr = silk(**args)
        path = os.path.join(out, name + '.webp')
        Image.fromarray(arr).save(path, 'WEBP', quality=80, method=6)
        print(name, os.path.getsize(path) // 1024, 'KB')
