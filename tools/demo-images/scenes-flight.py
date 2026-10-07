"""
Placeholders for the Parvazyar flight demo: skies seen from a plane window.

    python3 tools/demo-images/scenes-flight.py <out-dir>

A sea of clouds is drawn in perspective (noise sampled on a ground plane), so it
recedes to the horizon the way clouds do from cruising height. No aircraft or
buildings are drawn; real photography replaces these later.
"""
import os
import sys

import numpy as np
from PIL import Image

W, H = 2000, 1125


def grid_noise(u, v, seed, cells=64):
    """Bilinear value noise at arbitrary coordinates, wrapping every `cells`."""
    rng = np.random.default_rng(seed)
    g = rng.random((cells, cells)).astype(np.float32)
    x0 = np.floor(u).astype(int)
    y0 = np.floor(v).astype(int)
    fx = u - x0
    fy = v - y0
    fx = fx * fx * (3 - 2 * fx)
    fy = fy * fy * (3 - 2 * fy)
    x0 %= cells
    y0 %= cells
    x1 = (x0 + 1) % cells
    y1 = (y0 + 1) % cells
    a = g[y0, x0] * (1 - fx) + g[y0, x1] * fx
    b = g[y1, x0] * (1 - fx) + g[y1, x1] * fx
    return a * (1 - fy) + b * fy


def fbm(u, v, seed, octaves=6):
    total = np.zeros_like(u, dtype=np.float32)
    amp, norm, f = 1.0, 0.0, 1.0
    for o in range(octaves):
        total += grid_noise(u * f, v * f, seed + o * 7) * amp
        norm += amp
        amp *= 0.5
        f *= 2.03
    return total / norm


def sky(top, mid, low, horizon):
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    out = np.zeros((H, W, 3), np.float32)
    t1 = np.clip(y / horizon, 0, 1)
    for i in range(3):
        c = top[i] + (mid[i] - top[i]) * np.clip(t1 * 1.4, 0, 1)
        c = c + (low[i] - c) * np.clip((t1 - .55) / .45, 0, 1) ** 1.6
        out[..., i] = np.broadcast_to(c, (H, W))
    return out


def glow(cx, cy, r, color, img, power=2.0):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - cx) / r) ** 2 + ((yy - cy) / (r * .55)) ** 2)
    k = np.clip(1 - d, 0, 1) ** power
    return img + k[..., None] * np.array(color, np.float32)


def cloud_sea(img, horizon, lit, shade, seed, haze, sun_x, coverage=.5):
    """Clouds on a plane below the eye, lit from a low sun."""
    hy = int(H * horizon)
    rows = np.arange(hy, H, dtype=np.float32)
    depth = (rows - hy + 6) / (H - hy)  # 0 at horizon → 1 at the bottom
    z = 1.0 / depth
    xs = (np.arange(W, dtype=np.float32) - W / 2) / W
    u = xs[None, :] * z[:, None] * 6 + 20
    v = z[:, None] * 2.2 + np.zeros((1, W), np.float32)
    n = fbm(u, v, seed)
    detail = fbm(u * 3.1, v * 3.1, seed + 50, octaves=4)
    dens = np.clip((n - (1 - coverage) * .9) * 3.2 + (detail - .5) * .5, 0, 1)
    # Light: tops facing the sun are bright; the far field fades into haze.
    light = np.clip(.55 + (detail - .5) * 1.2 + (n - .5) * .8, 0, 1)
    col = np.array(shade, np.float32) + (np.array(lit, np.float32) - np.array(shade, np.float32)) * light[..., None]
    sunward = np.exp(-((np.arange(W) - sun_x) / (W * .35)) ** 2)[None, :] * (1 - depth[:, None]) ** 2
    col = col + sunward[..., None] * np.array([70, 40, 18], np.float32)
    fog = np.clip(1 - depth * 2.4, 0, 1)[:, None, None] ** 1.5
    col = col * (1 - fog) + np.array(haze, np.float32) * fog
    base = img[hy:].copy()
    a = (0.35 + 0.65 * dens)[..., None]
    img[hy:] = base * (1 - a) + col * a
    return img


def finish(img, grain=3.0, vignette=.4, seed=1):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    img = img * (1 - vignette * np.clip(d - .4, 0, 1)[..., None] ** 1.7)
    img = img + np.random.default_rng(seed).normal(0, grain, (H, W))[..., None]
    return np.clip(img, 0, 255).astype(np.uint8)


def dawn():
    img = sky((10, 20, 52), (46, 76, 140), (236, 170, 128), .5)
    img = glow(W * .68, H * .5, 900, (120, 70, 30), img)
    img = cloud_sea(img, .5, (246, 214, 196), (70, 88, 130), 3, (214, 176, 170), W * .68, coverage=.62)
    return finish(img, seed=11)


def daylight():
    img = sky((34, 92, 196), (92, 150, 228), (206, 226, 246), .58)
    img = glow(W * .3, H * .1, 700, (30, 30, 20), img)
    img = cloud_sea(img, .58, (252, 252, 255), (150, 172, 208), 9, (220, 232, 248), W * .3, coverage=.7)
    return finish(img, seed=12)


def night():
    img = sky((3, 6, 18), (12, 22, 52), (40, 52, 92), .55)
    rng = np.random.default_rng(5)
    for _ in range(2200):
        x, y = rng.integers(0, W), rng.integers(0, int(H * .5))
        img[y, x] = np.maximum(img[y, x], rng.random() ** 3 * 255)
    img = glow(W * .25, H * .2, 420, (60, 66, 90), img, 3)
    img = cloud_sea(img, .55, (120, 132, 170), (18, 26, 52), 21, (46, 58, 98), W * .25, coverage=.6)
    return finish(img, grain=2.5, seed=13)


def crop(arr, size, focus=.5):
    tw, th = size
    h, w = arr.shape[:2]
    if w / h > tw / th:
        cw = int(h * tw / th)
        x = int(np.clip(focus * w - cw / 2, 0, w - cw))
        arr = arr[:, x:x + cw]
    else:
        ch = int(w * th / tw)
        arr = arr[(h - ch) // 2:(h - ch) // 2 + ch]
    return Image.fromarray(arr).resize(size, Image.LANCZOS)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(out, exist_ok=True)
    scenes = {'dawn': dawn(), 'day': daylight(), 'night': night()}
    plan = {
        'hero': ('dawn', (2000, 1125), .5),
        'sky': ('day', (2000, 1000), .5),
        'night': ('night', (1600, 1000), .35),
        'card-1': ('day', (1200, 900), .3),
        'card-2': ('night', (1200, 900), .6),
    }
    for name, (scene, size, focus) in plan.items():
        path = os.path.join(out, name + '.webp')
        crop(scenes[scene], size, focus).save(path, 'WEBP', quality=76, method=6)
        print(name, os.path.getsize(path) // 1024, 'KB')
