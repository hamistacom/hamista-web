"""
Quiet, photographic scenes for the Dadgar law-firm demo.

    python3 tools/demo-images/scenes-law.py <out-dir> [name ...]

A law library of leather-bound volumes, polished marble, a typed page on a
desk with shallow focus, office light through blinds and a colonnade. Built
from flat shapes, textures and light; nothing three-dimensional is modelled.
"""
import importlib.util
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('archi', os.path.join(HERE, 'scenes-archi.py'))
archi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archi)

SS = 2
LEATHER = [(92, 32, 30), (120, 44, 36), (28, 38, 62), (22, 30, 50), (36, 58, 46), (142, 104, 66), (30, 26, 24), (110, 78, 50), (64, 28, 34)]


def fnoise(h, w, scale, octaves, rng):
    """Fractal value noise kept in floating point (no banding when amplified)."""
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for _ in range(octaves):
        gh, gw = max(2, int(h / scale) + 3), max(2, int(w / scale) + 3)
        grid = rng.random((gh, gw)).astype(np.float32)
        acc += amp * np.asarray(Image.fromarray(grid, mode='F').resize((w, h), Image.BICUBIC), np.float32)
        total += amp
        amp *= 0.5
        scale = max(2, scale / 2)
    return acc / total


def grain(arr, rng, amt=1.8):
    return np.clip(arr + rng.normal(0, amt, arr.shape[:2])[..., None], 0, 255)


def save_rgb(arr, out):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)


def library(seed, out=(1600, 1000), shelves=3, light_x=0.25):
    """Runs of matching law reports in leather, gilt bands, lit from one side."""
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS, out[1] * SS
    img = np.zeros((h, w, 3), np.float32)
    shelf_h = h / shelves
    board = int(shelf_h * 0.07)
    xx = np.arange(w, dtype=np.float32)
    sets = [(58, 22, 22), (74, 30, 26), (22, 30, 48), (18, 24, 38), (28, 44, 36), (98, 72, 46), (26, 22, 20), (84, 60, 40)]
    for s in range(shelves):
        top = int(s * shelf_h)
        base = int((s + 1) * shelf_h) - board
        img[top:base, :] = np.array([20, 14, 10], np.float32)
        x = int(rng.uniform(-30, 0) * SS)
        while x < w:
            # A run of matching volumes: one colour, one height, one band pattern.
            run = int(rng.integers(5, 16))
            col0 = np.array(sets[rng.integers(len(sets))], np.float32)
            bw0 = rng.uniform(30, 46) * SS
            bh0 = (base - top) * rng.uniform(0.78, 0.94)
            bands = [(0.07, 0.1), (0.88, 0.91)] if rng.random() < 0.7 else [(0.12, 0.13), (0.84, 0.85)]
            panel = rng.random() < 0.6
            for _ in range(run):
                if x >= w:
                    break
                bw = int(bw0 * rng.uniform(0.96, 1.04))
                bh = int(bh0 * rng.uniform(0.99, 1.01))
                col = col0 * rng.uniform(0.9, 1.08)
                y0 = base - bh
                xs = np.arange(bw, dtype=np.float32)
                curve = 0.45 + 0.75 * np.sin(np.pi * (xs + 0.5) / bw) ** 1.2
                sheen = np.exp(-((xs / bw - 0.38) / 0.12) ** 2) * 0.35
                block = np.repeat((col[None, :] * curve[:, None] + 40 * sheen[:, None])[None, :, :], bh, axis=0)
                tex = (rng.random((bh // 5 + 2, bw // 5 + 2)) * 255).astype(np.uint8)
                tex = np.asarray(Image.fromarray(tex).resize((bw, bh), Image.BICUBIC), np.float32) / 255.0
                block *= (0.9 + 0.14 * tex)[..., None]
                gold = np.array([170, 136, 76], np.float32)
                for a, b in bands:
                    block[int(bh * a):int(bh * b) + 1] = gold[None, None, :] * (curve[None, :, None] * 0.9 + sheen[None, :, None])
                if panel:
                    p0, p1 = int(bh * 0.2), int(bh * 0.3)
                    inset = max(3, bw // 7)
                    block[p0:p1, inset:bw - inset] *= 0.55
                    yl = int(bh * 0.245)
                    block[yl:yl + SS * 2, inset + 3:bw - inset - 3] = gold * 0.85
                x1 = min(w, x + bw)
                if x1 > max(0, x):
                    bx0 = max(0, -x)
                    img[y0:base, max(0, x):x1] = block[:, bx0:bx0 + (x1 - max(0, x))]
                x += bw + int(rng.uniform(0.5, 2) * SS)
            x += int(rng.uniform(0, 4) * SS)
        img[base:base + board] = np.array([60, 40, 26], np.float32)
        img[base:base + max(2, board // 5)] = np.array([112, 80, 52], np.float32)
        sh = np.linspace(0.35, 1.0, max(2, int(shelf_h * 0.16)), dtype=np.float32)
        img[top:top + len(sh)] *= sh[:, None, None]
    lx = light_x * w
    fall = 0.32 + 0.95 * np.exp(-((xx - lx) / (w * 0.42)) ** 2)
    img *= fall[None, :, None]
    yy = np.linspace(-1, 1, h, dtype=np.float32)[:, None]
    img *= (1 - 0.3 * yy ** 2)[..., None]
    # Warm the highlights a touch, keep the shadows deep.
    img = img * np.array([1.06, 1.0, 0.92])[None, None, :]
    img = grain(img, rng, 1.8)
    im = save_rgb(img, out)
    blurred = im.filter(ImageFilter.GaussianBlur(3.5))
    mask = np.abs(np.linspace(-1, 1, out[1]) + 0.1)[:, None] * np.ones((1, out[0]))
    mask = Image.fromarray((np.clip((mask - 0.4) / 0.45, 0, 1) * 255).astype(np.uint8))
    return Image.composite(blurred, im, mask)


def marble(seed, out=(1600, 1000), base=(232, 228, 220), vein=(120, 116, 112), gold=False, dark=False):
    """Polished marble: a few long veins bent by large-scale turbulence."""
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS // 2, out[1] * SS // 2
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    warp = fnoise(h, w, w * 0.7, 6, rng)
    warp2 = fnoise(h, w, w * 0.35, 5, rng)
    t = (xx * 0.5 + yy * 0.86) / w * 3.2 + warp * 1.25 + warp2 * 0.4
    ridge = 1 - np.abs(np.sin(t * math.pi))
    main = ridge ** 40 * 0.75 + ridge ** 10 * 0.25
    t2 = (xx * 0.62 + yy * 0.78) / w * 5.5 + warp2 * 1.2 + warp * 0.5
    minor = (1 - np.abs(np.sin(t2 * math.pi))) ** 60 * 0.4
    haze = ridge ** 4 * 0.1
    cloud = fnoise(h, w, w * 0.25, 5, rng)
    ground = np.array(base, np.float32)[None, None, :] * (0.95 + 0.07 * cloud)[..., None]
    vcol = np.array(vein, np.float32)
    mix_v = np.clip(main * 0.9 + minor + haze, 0, 1)[..., None]
    img = ground * (1 - mix_v) + vcol[None, None, :] * mix_v
    if gold:
        gl = np.clip(ridge ** 60 * 0.9 + ridge ** 14 * 0.15, 0, 1)[..., None]
        img = img * (1 - gl * 0.75) + np.array([186, 152, 90], np.float32)[None, None, :] * gl * 0.75
    refl = np.exp(-(((xx / w) - 0.68) / 0.3) ** 2 - (((yy / h) - 0.25) / 0.7) ** 2)
    img = img + (34 if not dark else 14) * refl[..., None]
    img = grain(img, rng, 1.2)
    return save_rgb(img, out)


def document(seed, out=(1600, 1000), lines=22):
    """A typed page on a dark desk, in perspective, with shallow focus."""
    rng = np.random.default_rng(seed)
    pw, ph = 1240, 1754
    page = Image.open(page_png()).convert('RGB')
    tex = (archi.value_noise(ph, pw, 90, 3, rng) * 12 - 6)
    arr = np.asarray(page, np.float32) + tex[..., None]
    page = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    W, H = out[0] * SS, out[1] * SS
    desk = archi.texture(H, W, (58, 42, 32), rng, rough=1.4) * 255
    stripes = archi.value_noise(H, W // 8, 6, 2, rng)
    stripes = np.asarray(Image.fromarray((stripes * 255).astype(np.uint8)).resize((W, H)), np.float32) / 255.0
    desk = desk * (0.85 + 0.25 * stripes)[..., None]
    canvas = Image.fromarray(np.clip(desk, 0, 255).astype(np.uint8))
    # Place the page in perspective (QUAD maps output corners back to the page).
    quad = [(0.32 * W, 0.06 * H), (0.04 * W, 1.62 * H), (1.04 * W, 1.68 * H), (0.86 * W, 0.0 * H)]
    coeffs = _perspective(quad, [(0, 0), (0, ph), (pw, ph), (pw, 0)])
    warped = page.transform((W, H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    m = Image.new('L', (pw, ph), 255).transform((W, H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    shadow = m.filter(ImageFilter.GaussianBlur(30 * SS))
    canvas = Image.composite(Image.new('RGB', (W, H), (10, 8, 6)), canvas, shadow.point(lambda v: int(v * 0.6)))
    canvas = Image.composite(warped, canvas, m)
    # Window light from the top left, falling off across the desk.
    arr = np.asarray(canvas, np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    light = 0.55 + 0.6 * np.exp(-((xx / W - 0.3) ** 2 + (yy / H - 0.3) ** 2) / 0.35)
    arr = arr * light[..., None] * np.array([1.04, 1.0, 0.94])[None, None, :]
    im = save_rgb(grain(arr, rng, 1.6), out)
    focus = np.abs(np.linspace(-1, 1, out[1]) - 0.1)[:, None] * np.ones((1, out[0]))
    mask = Image.fromarray((np.clip((focus - 0.18) / 0.6, 0, 1) * 255).astype(np.uint8))
    return Image.composite(im.filter(ImageFilter.GaussianBlur(5)), im, mask)


def page_png():
    """The typed letter, rendered once in the browser with the library fonts."""
    out = os.path.join('/tmp', 'hamista-law-page.png')
    if not os.path.exists(out):
        import subprocess
        env = dict(os.environ, NODE_PATH='/opt/node-tools/node_modules')
        subprocess.run(['node', os.path.join(HERE, 'render-html.js'), os.path.join(HERE, 'law-page.html'), out, '1240', '1754'], check=True, env=env)
    return out


def _perspective(src, dst):
    """Coefficients for Image.PERSPECTIVE mapping output (src) to input (dst)."""
    a = []
    for (x, y), (u, v) in zip(src, dst):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    b = np.array([c for p in dst for c in p], np.float64)
    return np.linalg.solve(np.array(a, np.float64), b).tolist()


def blinds(seed, out=(1600, 1000), material='stone', count=16, tilt=-0.22):
    """Office light through venetian blinds across a wall."""
    rng = np.random.default_rng(seed)
    w, h = archi.canvas(out)
    alb = archi.texture(h, w, (206, 206, 204) if material == 'stone' else archi.MATERIALS[material], rng)
    polys = []
    top, bottom = 0.05, 0.92
    step = (bottom - top) / count
    for i in range(count):
        y = top + i * step
        polys.append([(0.18, y), (0.86, y + tilt * 0.3), (0.86, y + tilt * 0.3 + step * 0.55), (0.18, y + step * 0.55)])
    sun = archi.mask(w, h, polys, 2.5, 9)
    img = archi.light(alb, sun, ambient=0.42)
    # Cool the shade toward navy for the firm's palette.
    img = img * np.array([0.94, 0.97, 1.05])[None, None, :]
    return archi.finish(img, seed, bloom_src=sun, out=out)


PLAN = {
    'hero': lambda: library(3, (2000, 1200)),
    'library-wide': lambda: library(5, (2000, 1000), 2, 0.7),
    'library-tall': lambda: library(7, (1200, 1500), 4, 0.4),
    'marble': lambda: marble(9, (1600, 1000)),
    'marble-dark': lambda: marble(11, (2000, 1100), base=(24, 34, 30), vein=(170, 150, 110), gold=True, dark=True),
    'document': lambda: document(13, (1600, 1000)),
    'blinds': lambda: blinds(15, (1600, 1000)),
    'columns': lambda: archi.columns(17, (1600, 1000), 'stone', 6, 0.9),
    'arches': lambda: archi.arch_light(19, (1600, 1000), 'stone', 4, -0.3),
    'slit': lambda: archi.slit(21, (2000, 1100)),
    'room': lambda: archi.room(23, (1600, 1000), 'stone'),
    'stairs': lambda: archi.stairs(25, (1200, 1500), 'stone', 9),
}
for i in range(1, 7):
    PLAN['insight-' + i.__str__()] = [
        lambda: library(31, (1200, 800), 2, 0.3),
        lambda: document(32, (1200, 800)),
        lambda: marble(33, (1200, 800), base=(226, 222, 214)),
        lambda: blinds(34, (1200, 800)),
        lambda: archi.columns(35, (1200, 800), 'stone', 5, 0.7),
        lambda: library(36, (1200, 800), 2, 0.65),
    ][i - 1]


if __name__ == '__main__':
    out_dir = sys.argv[1]
    only = set(sys.argv[2:])
    os.makedirs(out_dir, exist_ok=True)
    total = 0
    for name, make in PLAN.items():
        if only and name not in only:
            continue
        im = make()
        path = os.path.join(out_dir, name + '.webp')
        im.save(path, 'WEBP', quality=80, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, kb, 'KB')
    print('total', total, 'KB')
