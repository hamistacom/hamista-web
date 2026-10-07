"""
Atmospheric placeholders for the Rahnavard travel demo: skies, dunes, mist.

    python3 tools/demo-images/scenes-travel.py <out-dir>

Noise-built skies, haze and film grain, with no drawn buildings or trees. They
stand in for real photography until it is swapped in from the media library.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 2400, 1350
RNG = np.random.default_rng(7)


def noise(w, h, scale, seed):
    """Smooth value noise in [0, 1]."""
    rng = np.random.default_rng(seed)
    gw, gh = max(2, int(w / scale) + 2), max(2, int(h / scale) + 2)
    grid = rng.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def fbm(w, h, scale, seed, octaves=5):
    total, amp, norm = np.zeros((h, w), np.float32), 1.0, 0.0
    for o in range(octaves):
        total += noise(w, h, scale / (2 ** o), seed + o * 13) * amp
        norm += amp
        amp *= 0.5
    return total / norm


def lerp(a, b, t):
    return a + (b - a) * t


def gradient(stops, h=H, w=W):
    """Vertical gradient from [(pos, (r, g, b)), …]."""
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    out = np.zeros((h, w, 3), np.float32)
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (y >= p0) & (y <= p1)
        t = np.clip((y - p0) / max(p1 - p0, 1e-6), 0, 1)
        for i in range(3):
            out[..., i] = np.where(m, lerp(c0[i], c1[i], t), out[..., i])
    return out


def radial(cx, cy, r, w=W, h=H):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    return np.clip(1 - d, 0, 1) ** 2


def mask_from(draw_fn, blur=0.0):
    m = Image.new('L', (W, H), 0)
    draw_fn(ImageDraw.Draw(m))
    if blur:
        m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m, dtype=np.float32) / 255.0


def paint(img, mask, color, alpha=1.0):
    a = (mask * alpha)[..., None]
    return img * (1 - a) + np.array(color, np.float32) * a


def finish(img, grain=4.0, vignette=0.55, seed=1):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    img = img * (1 - vignette * np.clip(d - 0.35, 0, 1)[..., None] ** 1.6)
    rng = np.random.default_rng(seed)
    img = img + rng.normal(0, grain, img.shape[:2])[..., None]
    return np.clip(img, 0, 255).astype(np.uint8)


def clouds(img, top, bottom, dark, light, seed, scale=520, contrast=1.6):
    n = fbm(W, H, scale, seed)
    n = np.clip((n - 0.42) * contrast + 0.5, 0, 1)
    y = np.linspace(0, 1, H)[:, None]
    band = np.clip((bottom - y) / (bottom - top), 0, 1)
    shade = lerp(np.array(dark, np.float32), np.array(light, np.float32), n[..., None])
    a = (n * 0.75 * band)[..., None]
    return img * (1 - a) + shade * a


def stars(img, count, seed, limit=0.55):
    rng = np.random.default_rng(seed)
    for _ in range(count):
        x, y = rng.integers(0, W), rng.integers(0, int(H * limit))
        b = rng.random() ** 3 * 255
        img[y, x] = np.maximum(img[y, x], b)
    return img


# --------------------------------------------------------------------------
# 1. Isfahan: mosque at dusk with a reflecting pool
# --------------------------------------------------------------------------
def isfahan():
    """Dusk clouds over still water: a calm, wide placeholder."""
    img = gradient([(0, (22, 28, 39)), (0.4, (58, 66, 82)), (0.6, (186, 128, 98)), (0.66, (226, 166, 122)), (1, (40, 34, 36))])
    img = clouds(img, 0.0, 0.6, (24, 29, 38), (132, 134, 146), 3, scale=600, contrast=1.7)
    img = img + radial(W * 0.5, H * 0.64, 640)[..., None] * np.array([90, 56, 22])
    horizon = int(H * 0.66)
    top = img[:horizon][::-1]
    ripple = (noise(W, H - horizon, 14, 9) - 0.5) * 8
    rows = np.clip((np.arange(H - horizon)[:, None] + ripple).astype(int), 0, top.shape[0] - 1)
    cols = np.arange(W)[None, :].repeat(H - horizon, 0)
    img[horizon:] = top[rows, cols] * 0.5
    img[horizon - 2:horizon + 3] *= 0.4
    return finish(img, seed=11)


# --------------------------------------------------------------------------
# 2. Lut desert: dunes under a starry dusk
# --------------------------------------------------------------------------
def lut():
    img = gradient([(0, (12, 16, 34)), (0.45, (42, 44, 78)), (0.62, (150, 96, 104)), (0.7, (214, 140, 96)), (1, (60, 34, 26))])
    img = stars(img, 2600, 5)
    img = img + radial(W * 0.72, H * 0.66, 700)[..., None] * np.array([60, 30, 10])
    for k, (base, amp, color, seed) in enumerate([
        (0.64, 40, (90, 54, 44), 21), (0.7, 60, (118, 66, 46), 22), (0.78, 80, (150, 84, 54), 23), (0.88, 90, (70, 38, 30), 24),
    ]):
        xs = np.arange(W)
        n = noise(W, 1, 260 - k * 40, seed)[0]
        ridge = H * base + np.sin(xs / (220 + k * 60) + k) * amp + (n - 0.5) * amp * 1.6
        yy = np.arange(H)[:, None]
        m = np.clip((yy - ridge[None, :]) / 3 + 0.5, 0, 1)
        shade = np.clip((yy - ridge[None, :]) / 260, 0, 1)
        col = np.array(color, np.float32)
        layer = col * (1 - 0.45 * shade[..., None])
        # Lit crest on the sunward side.
        crest = np.exp(-((yy - ridge[None, :]) / 6) ** 2) * 0.6
        layer = layer + crest[..., None] * np.array([90, 60, 30])
        img = img * (1 - m[..., None]) + layer * m[..., None]
    return finish(img, seed=12)


# --------------------------------------------------------------------------
# 3. Hyrcanian forest in mist
# --------------------------------------------------------------------------
def forest():
    """Mist rolling over dark hills."""
    img = gradient([(0, (150, 164, 160)), (0.5, (196, 204, 196)), (1, (110, 122, 116))])
    img = clouds(img, 0, 0.55, (168, 178, 174), (228, 232, 226), 31, scale=700, contrast=1.2)
    for k, (base, color) in enumerate([(0.5, (120, 134, 128)), (0.6, (88, 104, 96)), (0.72, (56, 70, 62)), (0.86, (30, 40, 36))]):
        xs = np.arange(W)
        n = noise(W, 1, 300 - k * 50, 40 + k)[0]
        ridge = H * base + np.sin(xs / (380 + k * 90) + k * 1.7) * 30 + (n - 0.5) * 120
        yy = np.arange(H)[:, None]
        m = np.clip((yy - ridge[None, :]) / 40, 0, 1)
        layer = np.array(color, np.float32) * (0.92 + fbm(W, H, 140, 60 + k, octaves=4)[..., None] * 0.16)
        img = img * (1 - m[..., None]) + layer * m[..., None]
        haze = np.clip((yy - ridge[None, :]) / 220, 0, 1) * (1 - np.clip((yy - ridge[None, :]) / 520, 0, 1))
        img = img * (1 - haze[..., None] * 0.25) + np.array([214, 220, 214]) * haze[..., None] * 0.25
    return finish(img, grain=6, vignette=0.45, seed=13)


# --------------------------------------------------------------------------
# 4. Persepolis: columns at sunset
# --------------------------------------------------------------------------
def persepolis():
    """Sunset clouds over a dark plain."""
    img = gradient([(0, (36, 40, 58)), (0.4, (110, 86, 96)), (0.62, (226, 150, 92)), (0.7, (240, 186, 120)), (1, (54, 40, 34))])
    img = clouds(img, 0, 0.62, (64, 56, 70), (236, 174, 132), 51, scale=600, contrast=1.4)
    img = img + radial(W * 0.32, H * 0.66, 620)[..., None] * np.array([80, 46, 14])
    horizon = int(H * 0.72)
    yy = np.arange(H)[:, None]
    n = noise(W, 1, 180, 61)[0]
    ridge = horizon + (n - 0.5) * 40
    m = np.clip((yy - ridge[None, :]) / 6, 0, 1)
    img = img * (1 - m[..., None]) + np.array([24, 18, 18], np.float32) * m[..., None]
    return finish(img, seed=14)


# --------------------------------------------------------------------------
# 5. Caspian shore at dawn
# --------------------------------------------------------------------------
def caspian():
    """Cool dawn over flat water."""
    img = gradient([(0, (58, 70, 92)), (0.35, (122, 134, 156)), (0.55, (214, 186, 182)), (0.6, (236, 204, 186)), (1, (52, 62, 76))])
    img = clouds(img, 0.0, 0.55, (96, 106, 128), (226, 214, 214), 71, scale=760, contrast=1.3)
    img = img + radial(W * 0.4, H * 0.6, 520)[..., None] * np.array([40, 26, 16])
    horizon = int(H * 0.6)
    top = img[:horizon][::-1]
    ripple = (noise(W, H - horizon, 10, 72) - 0.5) * 10
    rows = np.clip((np.arange(H - horizon)[:, None] + ripple).astype(int), 0, top.shape[0] - 1)
    cols = np.arange(W)[None, :].repeat(H - horizon, 0)
    img[horizon:] = top[rows, cols] * 0.72
    return finish(img, grain=4, vignette=0.4, seed=15)


# --------------------------------------------------------------------------
# 6. Alborz: snow ridges in cold haze
# --------------------------------------------------------------------------
def alborz():
    img = gradient([(0, (64, 82, 108)), (0.5, (164, 178, 194)), (1, (90, 104, 118))])
    img = clouds(img, 0, 0.45, (116, 132, 152), (222, 228, 236), 81, scale=800, contrast=1.1)
    yy = np.arange(H)[:, None]
    tex = fbm(W, H, 90, 99, octaves=4)
    for k, (base, amp, color, snow) in enumerate([
        (0.5, 300, (128, 140, 156), True),
        (0.62, 200, (92, 104, 118), False),
        (0.76, 130, (56, 64, 76), False),
        (0.9, 70, (28, 34, 42), False),
    ]):
        n1 = noise(W, 1, 520 - k * 80, 90 + k)[0]
        n2 = noise(W, 1, 90, 95 + k)[0]
        n3 = noise(W, 1, 24, 97 + k)[0]
        ridge = H * base - (0.5 - np.abs(n1 - 0.5)) * amp * 2 + (n2 - 0.5) * amp * 0.3 + (n3 - 0.5) * 16
        m = np.clip((yy - ridge[None, :]) / 2 + 0.5, 0, 1)
        layer = np.array(color, np.float32) * (0.9 + tex[..., None] * 0.2)
        if snow:
            cap = np.clip(1 - (yy - ridge[None, :]) / (24 + tex * 60), 0, 1) ** 0.8
            layer = lerp(layer, np.array([234, 238, 244], np.float32), cap[..., None] * 0.85)
        img = img * (1 - m[..., None]) + layer * m[..., None]
        haze = np.clip((yy - ridge[None, :]) / 240, 0, 1) * (1 - np.clip((yy - ridge[None, :]) / 600, 0, 1))
        img = img * (1 - haze[..., None] * 0.3) + np.array([196, 206, 218]) * haze[..., None] * 0.3
    return finish(img, grain=4, vignette=0.45, seed=16)


# --------------------------------------------------------------------------
# 7. Salt lake: pale sky, white crust
# --------------------------------------------------------------------------
def salt():
    img = gradient([(0, (150, 170, 196)), (0.45, (220, 214, 222)), (0.58, (240, 218, 212)), (0.6, (236, 232, 228)), (1, (196, 194, 192))])
    img = clouds(img, 0, 0.5, (190, 196, 212), (246, 242, 240), 101, scale=900, contrast=1.0)
    horizon = int(H * 0.6)
    crust = fbm(W, H - horizon, 60, 102, octaves=4)
    crack = np.abs(noise(W, H - horizon, 30, 103) - 0.5) < 0.012
    ground = img[horizon:] * (0.9 + crust[..., None] * 0.14)
    ground[crack] *= 0.93
    img[horizon:] = ground
    return finish(img, grain=3, vignette=0.35, seed=17)


# --------------------------------------------------------------------------
# 8. Desert night: a band of stars
# --------------------------------------------------------------------------
def night():
    img = gradient([(0, (6, 9, 20)), (0.6, (18, 24, 44)), (0.78, (40, 40, 62)), (1, (10, 10, 14))])
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    band = np.exp(-(((yy - (H * 0.95 - xx * 0.42)) / 190) ** 2))
    glow = fbm(W, H, 260, 111) * band
    img = img + glow[..., None] * np.array([70, 74, 96])
    rng = np.random.default_rng(112)
    n = 9000
    xs, ys = rng.integers(0, W, n), rng.integers(0, int(H * 0.8), n)
    keep = rng.random(n) < (0.25 + band[ys, xs] * 0.75)
    for x, y in zip(xs[keep], ys[keep]):
        b = rng.random() ** 4 * 255
        img[y, x] = np.maximum(img[y, x], b)
    ridge = H * 0.8 + (noise(W, 1, 300, 113)[0] - 0.5) * 60
    m = np.clip((yy - ridge[None, :]) / 3, 0, 1)
    img = img * (1 - m[..., None]) + np.array([8, 8, 12], np.float32) * m[..., None]
    return finish(img, grain=3, vignette=0.5, seed=18)


# --------------------------------------------------------------------------
# 9. Persian Gulf: turquoise water, bright haze
# --------------------------------------------------------------------------
def gulf():
    img = gradient([(0, (110, 160, 192)), (0.45, (192, 216, 226)), (0.52, (226, 232, 230)), (0.53, (88, 168, 176)), (1, (14, 78, 94))])
    img = clouds(img, 0, 0.45, (164, 192, 210), (244, 246, 248), 121, scale=900, contrast=0.9)
    horizon = int(H * 0.53)
    hh = H - horizon
    swell = np.asarray(Image.fromarray((fbm(W // 8, hh, 30, 122, octaves=4) * 255).astype(np.uint8)).resize((W, hh), Image.BICUBIC), np.float32) / 255
    depth = np.linspace(0, 1, hh, dtype=np.float32)[:, None]
    img[horizon:] = img[horizon:] * (0.92 + swell[..., None] * (0.06 + depth[..., None] * 0.14))
    glint = np.clip(swell - 0.6, 0, 1) * 2.5 * (1 - depth) * radial(W * 0.62, horizon, 1100)[horizon:]
    img[horizon:] = img[horizon:] + glint[..., None] * 90
    return finish(img, grain=3, vignette=0.35, seed=19)


# --------------------------------------------------------------------------
# 10. Zagros valley at golden hour
# --------------------------------------------------------------------------
def zagros():
    img = gradient([(0, (120, 132, 150)), (0.4, (226, 194, 150)), (0.55, (240, 206, 150)), (1, (90, 70, 50))])
    img = clouds(img, 0, 0.4, (180, 160, 146), (250, 230, 200), 131, scale=800, contrast=1.0)
    yy = np.arange(H)[:, None]
    for k, (base, color) in enumerate([(0.48, (196, 160, 122)), (0.58, (160, 120, 86)), (0.7, (118, 84, 58)), (0.84, (68, 48, 34))]):
        n1 = noise(W, 1, 380 - k * 50, 140 + k)[0]
        n2 = noise(W, 1, 60, 145 + k)[0]
        ridge = H * base + (n1 - 0.5) * 180 + (n2 - 0.5) * 24
        m = np.clip((yy - ridge[None, :]) / 2 + 0.5, 0, 1)
        layer = np.array(color, np.float32) * (0.9 + fbm(W, H, 120, 150 + k, octaves=4)[..., None] * 0.2)
        img = img * (1 - m[..., None]) + layer * m[..., None]
        haze = np.clip((yy - ridge[None, :]) / 200, 0, 1) * (1 - np.clip((yy - ridge[None, :]) / 520, 0, 1))
        img = img * (1 - haze[..., None] * 0.22) + np.array([238, 210, 170]) * haze[..., None] * 0.22
    return finish(img, grain=4, vignette=0.45, seed=20)


SCENES = {
    'isfahan': isfahan, 'lut': lut, 'forest': forest, 'persepolis': persepolis,
    'caspian': caspian, 'alborz': alborz, 'salt': salt, 'night': night, 'gulf': gulf, 'zagros': zagros,
}


def crop(arr, size, focus=0.5):
    """Crop to the target ratio around a horizontal focus point, then resize."""
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


def save(arr, path, size=None):
    im = Image.fromarray(arr)
    if size:
        im = im.resize(size, Image.LANCZOS)
    im.save(path, 'WEBP', quality=80, method=6)
    return os.path.getsize(path) // 1024


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(out, exist_ok=True)
    # name: (scene, size, focus)
    plan = {
        'slide-1': ('isfahan', (2000, 1125), .5), 'slide-2': ('lut', (2000, 1125), .5),
        'slide-3': ('forest', (2000, 1125), .5), 'slide-4': ('persepolis', (2000, 1125), .5),
        'dest-1': ('isfahan', (900, 1125), .5), 'dest-2': ('lut', (900, 1125), .7),
        'dest-3': ('forest', (900, 1125), .4), 'dest-4': ('gulf', (900, 1125), .6),
        'dest-5': ('alborz', (900, 1125), .45), 'dest-6': ('salt', (900, 1125), .5),
        'dest-7': ('caspian', (900, 1125), .4),
        'tour-1': ('zagros', (1200, 900), .5), 'tour-2': ('night', (1200, 900), .55),
        'tour-3': ('gulf', (1200, 900), .3), 'tour-4': ('alborz', (1200, 900), .7),
        'wide-1': ('night', (2000, 1000), .5), 'wide-2': ('persepolis', (2000, 1000), .35),
        'journal-1': ('caspian', (1200, 800), .6), 'journal-2': ('zagros', (1200, 800), .3),
        'journal-3': ('persepolis', (1200, 800), .3), 'journal-4': ('lut', (1200, 800), .3),
    }
    only = set(sys.argv[2:])
    cache = {}
    total = 0
    for name, (scene, size, focus) in plan.items():
        if only and name not in only:
            continue
        if scene not in cache:
            cache[scene] = SCENES[scene]()
        path = os.path.join(out, name + '.webp')
        crop(cache[scene], size, focus).save(path, 'WEBP', quality=74, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, scene, size, kb, 'KB')
    print('total', total, 'KB')
