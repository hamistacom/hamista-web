"""
Studio photographs for the Shahdineh demo (natural honey).

    python3 tools/demo-images/scenes-honey.py <out-dir> [name ...]

Honey is transparent: seen through a hexagonal jar it is darkest where the
light travels furthest and glows where it is thin, and it throws a warm patch
of light on the table. Comb is a hex grid of wax walls with capped cells
(matte, slightly domed) and open cells (glossy honey). Backgrounds and the
light model come from the ceramics and nomad modules.
"""
import importlib.util
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))


def _load(name, file):
    spec = importlib.util.spec_from_file_location(name, os.path.join(HERE, file))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


nomad = _load('nomad', 'scenes-nomad.py')
cer = nomad.cer
travel = nomad.travel
SS = cer.SS
fnoise = cer.fnoise
lay, drop_shadow, smooth_mask = nomad.lay, nomad.drop_shadow, nomad.smooth_mask

# Honey by flower: (deep colour where thick, glow colour where thin).
HONEY = {
    'gavan': ((196, 140, 40), (252, 226, 150)),
    'orange': ((206, 150, 44), (255, 222, 132)),
    'wildflower': ((176, 106, 22), (246, 192, 90)),
    'thyme': ((150, 76, 14), (236, 160, 60)),
    'sidr': ((82, 34, 8), (196, 104, 34)),
}


def hex_jar(canvas, cx, base_y, height, half, rng, honey='wildflower', level=0.8, lid='gold', label=True, shape='hex'):
    """A hexagonal (or round) glass jar of honey seen from the front."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = (base_y - yy) / height
    neck_t = 0.9
    shoulder = np.clip((t - 0.84) / 0.06, 0, 1)
    width = half * (1 - 0.12 * shoulder)
    width = np.where(t > neck_t, half * 0.8, width)
    u = (xx - cx) / np.maximum(width, 1)
    inside = (t >= 0) & (t <= 1) & (np.abs(u) <= 1)
    behind = canvas.copy()
    deep, glow = (np.array(c, np.float32) for c in HONEY[honey])
    if shape == 'hex':
        face = np.where(np.abs(u) <= 0.5, 0, np.sign(u))
        # Light passes furthest through the middle face.
        thick = np.where(face == 0, 1.0, 0.55 + 0.45 * (1 - (np.abs(u) - 0.5) / 0.5))
        lit = np.where(face == 0, 1.0, np.where(face < 0, 1.12, 0.7))
    else:
        nz = np.sqrt(np.clip(1 - u * u, 0, 1))
        thick = 0.35 + 0.65 * nz
        lit = 1.0 + 0.12 * -u
    # Back-light glow: brightest low and towards the shadow side, where light exits.
    exitg = np.exp(-(((u - 0.15) / 0.55) ** 2 + ((t - 0.35) / 0.32) ** 2))
    a = np.clip(thick * 0.85 - exitg * 0.55, 0, 1)
    honey_rgb = glow[None, None, :] * (1 - a[..., None]) + deep[None, None, :] * a[..., None]
    honey_rgb = honey_rgb * lit[..., None]
    # Tiny suspended bubbles and crystals.
    specks = (fnoise(H, W, 1.2 * SS, 1, rng) > 0.86).astype(np.float32) * 0.08
    honey_rgb = honey_rgb * (1 + specks[..., None])
    fill_m = inside & (t <= level) & (t >= 0.03)
    glass = behind * np.array([0.93, 0.93, 0.9]) - 3
    rgb = np.where(fill_m[..., None], honey_rgb, glass)
    base_band = inside & (t < 0.03)
    rgb = np.where(base_band[..., None], deep * 0.6 + behind * 0.3, rgb)
    # Meniscus and the honey surface line.
    surf = np.exp(-((t - level) * height / (1.4 * SS)) ** 2) * inside
    rgb = rgb * (1 - 0.35 * surf[..., None]) + (np.exp(-((t - level - 0.006) * height / (1.2 * SS)) ** 2) * inside * 60)[..., None]
    # Glass: edges, face seams and reflections of a tall softbox.
    if shape == 'hex':
        seam = np.exp(-((np.abs(u) - 0.5) / 0.012) ** 2) * inside
        rgb = rgb * (1 - 0.25 * seam[..., None]) + (seam * 50)[..., None] * (u < 0)[..., None]
        refl = np.exp(-((u + 0.32) / 0.05) ** 2) * 0.55 + np.exp(-((u + 0.78) / 0.04) ** 2) * 0.4 + np.exp(-((u - 0.7) / 0.02) ** 2) * 0.18
    else:
        refl = np.exp(-((u + 0.6) / 0.06) ** 2) * 0.6 + np.exp(-((u - 0.68) / 0.03) ** 2) * 0.2
    edge = np.clip((np.abs(u) - 0.9) / 0.1, 0, 1)
    rgb = rgb * (1 - 0.35 * edge[..., None])
    rgb = rgb + (refl * 255 * ((t > 0.05) & (t < 0.86)))[..., None]
    # Kraft label around the middle.
    if label:
        lab = inside & (t > 0.32) & (t < 0.56)
        kraft = np.array([196, 160, 112], np.float32) * (0.92 + 0.12 * fnoise(H, W, 2 * SS, 2, rng))[..., None]
        kraft = kraft * np.where(np.abs(u) <= 0.5, 1.0, np.where(u < 0, 1.08, 0.72))[..., None] if shape == 'hex' else kraft * (0.75 + 0.3 * np.sqrt(np.clip(1 - u * u, 0, 1)))[..., None]
        line = (np.abs(t - 0.36) < 0.004) | (np.abs(t - 0.52) < 0.004)
        kraft = np.where(line[..., None], kraft * 0.62, kraft)
        # A small hexagon stamp in the middle of the label.
        hx = (xx - cx) / (half * 0.16)
        hy = (yy - (base_y - height * 0.44)) / (half * 0.16)
        hexd = np.maximum(np.abs(hx) * 0.866 + np.abs(hy) * 0.5, np.abs(hy))
        stamp = (hexd < 1) & (hexd > 0.72)
        kraft = np.where(stamp[..., None], np.array([92, 58, 26], np.float32), kraft)
        rgb = np.where(lab[..., None], kraft, rgb)
    m = inside.astype(np.float32)
    # Shadow, and the warm light the honey throws on the table.
    sh = (((xx - cx - half * 0.35) / (half * 1.4)) ** 2 + ((yy - base_y) / (height * 0.05)) ** 2 <= 1).astype(np.float32)
    drop_shadow(canvas, sh, (0, 0), height * 0.05, 0.42)
    caustic = np.exp(-(((xx - cx - half * 1.25) / (half * 0.7)) ** 2 + ((yy - base_y - height * 0.02) / (height * 0.035)) ** 2))
    canvas += caustic[..., None] * glow[None, None, :] * 0.3
    lay(canvas, rgb, smooth_mask(m, 0.6 * SS))
    # Lid.
    top = base_y - height
    lw = half * 0.86
    if lid == 'gold':
        lm = (np.abs(xx - cx) <= lw) & (yy >= top - height * 0.08) & (yy <= top + height * 0.005)
        lu = (xx - cx) / lw
        metal = 0.55 + 0.55 * np.exp(-((lu + 0.42) / 0.18) ** 2) + 0.2 * np.exp(-((lu - 0.5) / 0.1) ** 2) - 0.25 * np.abs(lu) ** 4
        ribs = 0.9 + 0.1 * (np.sin((xx - cx) / (2.2 * SS)) > 0)
        gold = np.array([196, 150, 64], np.float32)
        lay(canvas, gold[None, None, :] * (metal * ribs)[..., None], smooth_mask(lm.astype(np.float32), 0.6 * SS))
    else:
        # Kraft paper tied over the lid with twine.
        cm = (np.abs(xx - cx) <= lw * 1.1) & (yy >= top - height * 0.07) & (yy <= top + height * 0.07 + np.abs(np.sin((xx - cx) / (half * 0.2))) * height * 0.02)
        kraft = np.array([190, 152, 104], np.float32) * (0.8 + 0.3 * np.clip(-(xx - cx) / lw * 0.5 + 0.6, 0, 1))[..., None] * (0.93 + 0.1 * fnoise(H, W, 2 * SS, 2, rng))[..., None]
        lay(canvas, kraft, smooth_mask(cm.astype(np.float32), 0.7 * SS))
        tw = (np.abs(yy - (top + height * 0.035)) < 1.5 * SS) & (np.abs(xx - cx) < lw * 1.08)
        lay(canvas, np.array([226, 214, 186], np.float32), smooth_mask(tw.astype(np.float32), 0.4 * SS))
    return canvas


def comb(canvas, x0, y0, w, h, rng, cell=26, capped=0.6, honey='wildflower', frame=False):
    """A slab of comb seen from above: wax walls, capped and open cells."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    s = cell * SS
    # Pointy-top hex grid in axial coordinates.
    qf = (math.sqrt(3) / 3 * (xx - x0) - 1 / 3 * (yy - y0)) / s
    rf = (2 / 3 * (yy - y0)) / s
    xf, zf = qf, rf
    yf = -xf - zf
    rx, ry, rz = np.round(xf), np.round(yf), np.round(zf)
    dx, dy, dz = np.abs(rx - xf), np.abs(ry - yf), np.abs(rz - zf)
    fixx = (dx > dy) & (dx > dz)
    fixy = ~fixx & (dy > dz)
    rx = np.where(fixx, -ry - rz, rx)
    ry = np.where(fixy, -rx - rz, ry)
    rz = np.where(~fixx & ~fixy, -rx - ry, rz)
    q, r = rx, rz
    cxp = x0 + s * math.sqrt(3) * (q + r / 2)
    cyp = y0 + s * 1.5 * r
    ddx, ddy = (xx - cxp) / s, (yy - cyp) / s
    # Hex distance from the centre (1 at the wall).
    hd = np.maximum(np.abs(ddx) * 2 / math.sqrt(3), np.abs(ddx) / math.sqrt(3) + np.abs(ddy)) / 1.0
    wall = np.clip((hd - 0.86) / 0.06, 0, 1)
    rr = np.sqrt(ddx ** 2 + ddy ** 2)
    # Which cells are capped: big soft regions, as bees cap from the top down.
    cell_noise = fnoise(H, W, 520 * SS, 2, rng)
    grad = (yy - y0) / max(h, 1)
    hashv = (np.sin(q * 12.9898 + r * 78.233) * 43758.5453) % 1
    is_cap = (cell_noise * 0.7 + (1 - grad) * 0.5 + 0.1 * (hashv - 0.5)) > (1.15 - capped)
    deep, glow = (np.array(c, np.float32) for c in HONEY[honey])
    # Capped: pale wax dome with a wrinkled surface.
    dome = np.sqrt(np.clip(1 - (rr / 0.86) ** 2, 0, 1))
    wr = fnoise(H, W, 1.6 * SS, 3, rng)
    tint = 0.9 + 0.14 * ((np.sin(q * 3.1 + r * 1.7) * 0.5 + 0.5) * 0.6 + hashv * 0.4)
    cap_alb = np.array([232, 200, 128], np.float32)[None, None, :] * (tint * (0.88 + 0.1 * wr))[..., None]
    # Domed caps: lit from the top left, a soft sheen near the crown.
    nx_, ny_ = ddx / 0.86 * 0.7, ddy / 0.86 * 0.7
    cap_lit = 0.62 + 0.5 * np.clip(-nx_ * 0.55 - ny_ * 0.7 + dome * 0.55, 0, 1.2)
    cap = cap_alb * cap_lit[..., None] + (np.exp(-(((ddx + 0.18) / 0.22) ** 2 + ((ddy + 0.22) / 0.16) ** 2)) * 26 * dome)[..., None]
    # Open: honey sits low in the cell; darker near the walls, with a crescent reflection.
    depthc = np.clip(rr / 0.86, 0, 1)
    open_alb = deep[None, None, :] * (1.05 - 0.45 * depthc ** 2)[..., None] + glow[None, None, :] * (np.exp(-((rr - 0.25) / 0.25) ** 2) * 0.35)[..., None]
    cres = np.exp(-((np.sqrt((ddx + 0.08) ** 2 + (ddy + 0.06) ** 2) - 0.5) / 0.07) ** 2) * np.clip(-(ddx + ddy) * 1.6, 0, 1)
    spec = cres * 210 + np.exp(-(((ddx + 0.3) / 0.07) ** 2 + ((ddy + 0.34) / 0.05) ** 2)) * 240
    openc = open_alb + spec[..., None]
    cellc = np.where(is_cap[..., None], cap, openc)
    wax = np.array([226, 196, 124], np.float32) * (0.95 + 0.1 * fnoise(H, W, 3 * SS, 2, rng))[..., None]
    # Walls catch the light on their upper-left faces.
    wall_lit = 1.0 + 0.25 * np.clip(-(ddx + ddy), -1, 1)
    rgb = cellc * (1 - wall[..., None]) + wax * wall_lit[..., None] * wall[..., None]
    inside = (xx >= x0) & (xx < x0 + w) & (yy >= y0) & (yy < y0 + h)
    m = inside.astype(np.float32)
    drop_shadow(canvas, m, (6 * SS, 8 * SS), 12 * SS, 0.38)
    lay(canvas, rgb, smooth_mask(m, 0.8 * SS))
    if frame:
        bar = 0.06 * min(w, h)
        for (bx0, by0, bx1, by1) in [(x0 - bar, y0 - bar, x0 + w + bar, y0), (x0 - bar, y0 + h, x0 + w + bar, y0 + h + bar), (x0 - bar, y0, x0, y0 + h), (x0 + w, y0, x0 + w + bar, y0 + h)]:
            bm = ((xx >= bx0) & (xx < bx1) & (yy >= by0) & (yy < by1)).astype(np.float32)
            grain = 0.85 + 0.15 * np.sin((xx if bx1 - bx0 > by1 - by0 else yy) / (3 * SS) + fnoise(H, W, 40 * SS, 2, rng) * 3)
            lay(canvas, np.array([196, 160, 112], np.float32) * grain[..., None], smooth_mask(bm, 0.6 * SS))
    return canvas


def dipper(canvas, x, y, length, angle, rng, honey='wildflower', drip=True):
    """A turned wooden honey dipper lying on the table, its grooved head coated in honey."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ca, sa = math.cos(angle), math.sin(angle)
    a = (xx - x) * ca + (yy - y) * sa
    b = -(xx - x) * sa + (yy - y) * ca
    t = a / length
    head = 0.26
    th = np.clip(t / head, 0, 1)
    ridges = 0.8 + 0.2 * np.abs(np.sin(t * length / (5.0 * SS) * math.pi / 2))
    rad = np.where(t < head, length * 0.085 * np.sin(0.15 + th * 2.6) ** 0.5 * ridges,
                   length * (0.026 + 0.01 * np.exp(-((t - 0.96) / 0.035) ** 2)))
    rad = np.where((t >= head - 0.02) & (t < head + 0.04), np.maximum(rad, length * 0.03), rad)
    across = b / np.maximum(rad, 1)
    inside = (t >= 0) & (t <= 1) & (np.abs(across) <= 1)
    nz = np.sqrt(np.clip(1 - across ** 2, 0, 1))
    light = np.clip(-across * 0.5 + nz * 0.8 + 0.15, 0, 1)
    wood_c = np.array([214, 178, 128], np.float32) * (0.92 + 0.1 * np.sin(a / (2.5 * SS) + fnoise(H, W, 30 * SS, 2, rng) * 2))[..., None]
    rgb = wood_c * (0.45 + 0.65 * light)[..., None]
    deep, glow = (np.array(c, np.float32) for c in HONEY[honey])
    coat = inside & (t < head * 0.95)
    hrgb = (deep * 0.6 + glow * 0.4)[None, None, :] * (0.55 + 0.6 * light)[..., None] + (np.exp(-((across + 0.45) / 0.15) ** 2) * 160)[..., None]
    rgb = np.where(coat[..., None], hrgb, rgb)
    m = inside.astype(np.float32)
    drop_shadow(canvas, m, (length * 0.02, length * 0.03), length * 0.025, 0.42)
    lay(canvas, rgb, smooth_mask(m, 0.6 * SS))
    if drip:
        # A small pool of honey under the head.
        px_, py_ = x + ca * length * head * 0.4, y + sa * length * head * 0.4 + length * 0.06
        pool = np.exp(-(((xx - px_) / (length * 0.09)) ** 2 + ((yy - py_) / (length * 0.035)) ** 2))
        pm = (pool > 0.35).astype(np.float32)
        prgb = (deep * 0.5 + glow * 0.5)[None, None, :] * (0.8 + 0.3 * pool)[..., None] + (np.exp(-(((xx - px_ + length * 0.03) / (length * 0.02)) ** 2 + ((yy - py_ + length * 0.01) / (length * 0.008)) ** 2)) * 200)[..., None]
        lay(canvas, prgb, smooth_mask(pm, 1.0 * SS))
    return canvas


def honey_top(canvas, cx, cy, R, rng, honey='wildflower'):
    """An open hexagonal jar seen from above: a glossy honey surface reflecting a window."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = (xx - cx) / R, (yy - cy) / R
    hexd = np.maximum(np.abs(dx) * 0.866 + np.abs(dy) * 0.5, np.abs(dy))
    m = (hexd <= 1).astype(np.float32)
    drop_shadow(canvas, m, (R * 0.12, R * 0.16), R * 0.2, 0.36)
    deep, glow = (np.array(c, np.float32) for c in HONEY[honey])
    inner = hexd <= 0.86
    rr = np.sqrt(dx * dx + dy * dy)
    mixc = deep * 0.62 + glow * 0.38
    surf = mixc[None, None, :] * (1.0 - 0.12 * np.clip(rr - 0.5, 0, 1))[..., None] + glow[None, None, :] * (np.clip((rr - 0.62) / 0.24, 0, 1) * 0.25)[..., None]
    # The window, reflected in a surface that is never quite flat.
    warp = fnoise(H, W, 60 * SS, 2, rng) - 0.5
    win = np.exp(-(((dx + 0.2 + warp * 0.06) / 0.2) ** 4 + ((dy + 0.3 + warp * 0.05) / 0.09) ** 4))
    surf = surf * (1 - 0.55 * win[..., None]) + np.array([252, 238, 206]) * 0.55 * win[..., None]
    # Folds where honey ran back off the dipper.
    fold = np.exp(-(((dx - 0.12) / 0.16) ** 2 + ((dy - 0.18) / 0.1) ** 2))
    surf = surf + (fold * 50)[..., None] * np.array([1.0, 0.72, 0.36])
    glass = canvas * 0.86 + 18
    rim = np.clip(1 - np.abs(hexd - 0.93) / 0.07, 0, 1)
    rgb = np.where(inner[..., None], surf, glass) + (rim ** 2 * 60)[..., None]
    lay(canvas, rgb, smooth_mask(m, 0.6 * SS))
    return canvas


def pollen_mound(canvas, cx, cy, R, rng):
    """Bee pollen pellets heaped in a bowl: small round grains in many colours."""
    H, W = canvas.shape[:2]
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cols = [(232, 176, 40), (214, 120, 30), (196, 150, 56), (238, 206, 92), (176, 96, 36), (150, 128, 60), (226, 150, 70)]
    n = int(R * R / (26 * SS * SS))
    pts = []
    for _ in range(n):
        rr = R * math.sqrt(rng.random())
        a = rng.random() * 2 * math.pi
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a), rr / R))
    pts.sort(key=lambda p: p[1])
    for x, y, rn in pts:
        s = (6.5 + 3.5 * rng.random()) * SS
        c = cols[rng.integers(0, len(cols))]
        k = 0.75 + 0.35 * (1 - rn ** 2)
        base = tuple(int(np.clip(v * k * 0.7, 0, 255)) for v in c) + (255,)
        mid = tuple(int(np.clip(v * k, 0, 255)) for v in c) + (255,)
        d.ellipse([x - s + s * 0.25, y - s + s * 0.3, x + s + s * 0.25, y + s + s * 0.3], fill=(40, 26, 10, 110))
        d.ellipse([x - s, y - s * 0.92, x + s, y + s * 0.92], fill=base)
        d.ellipse([x - s * 0.88, y - s * 0.84, x + s * 0.62, y + s * 0.56], fill=mid)
        light = tuple(int(np.clip(v * k * 1.18, 0, 255)) for v in c) + (255,)
        d.ellipse([x - s * 0.66, y - s * 0.68, x + s * 0.12, y + s * 0.06], fill=light)
    arr = np.asarray(img, np.float32)
    a_ = arr[..., 3:4] / 255
    canvas[:] = canvas * (1 - a_) + arr[..., :3] * a_
    return canvas


def hives(img, items, rng):
    """Painted wooden hive boxes standing in a meadow."""
    H, W = img.shape[:2]
    cols = [(232, 226, 214), (96, 132, 158), (220, 182, 88), (232, 226, 214), (170, 96, 70), (120, 150, 110)]
    for i, (x, y, s) in enumerate(items):
        c = np.array(cols[i % len(cols)], np.float32)
        layer = Image.new('L', (W, H), 0)
        d = ImageDraw.Draw(layer)
        d.rectangle([x - s * 0.5, y - s * 0.62, x + s * 0.5, y], fill=255)
        m = np.asarray(layer, np.float32) / 255
        roof = Image.new('L', (W, H), 0)
        ImageDraw.Draw(roof).rectangle([x - s * 0.56, y - s * 0.72, x + s * 0.56, y - s * 0.6], fill=255)
        rm = np.asarray(roof, np.float32) / 255
        side = np.where(np.arange(W)[None, :] > x + s * 0.18, 0.78, 1.0)
        img[:] = img * (1 - m[..., None]) + (c * 0.9)[None, None, :] * side[..., None] * m[..., None]
        img[:] = img * (1 - rm[..., None]) + np.array([150, 146, 140], np.float32) * rm[..., None]
        # Entrance slit.
        en = Image.new('L', (W, H), 0)
        ImageDraw.Draw(en).rectangle([x - s * 0.2, y - s * 0.08, x + s * 0.12, y - s * 0.04], fill=255)
        em = np.asarray(en, np.float32) / 255
        img[:] = img * (1 - em[..., None] * 0.85)
        # Legs/stand shadow.
        sh = Image.new('L', (W, H), 0)
        ImageDraw.Draw(sh).ellipse([x - s * 0.62, y - s * 0.04, x + s * 0.8, y + s * 0.1], fill=255)
        shm = np.asarray(sh.filter(ImageFilter.GaussianBlur(s * 0.05)), np.float32) / 255
        img[:] = img * (1 - shm[..., None] * 0.35)
    return img


def meadow(img, top, rng, density=1.0):
    """Wild flowers in the foreground grass, bigger and softer the nearer they are."""
    H, W = img.shape[:2]
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cols = [(236, 230, 214), (226, 196, 70), (190, 120, 160), (160, 150, 210), (236, 150, 80)]
    n = int(2600 * density)
    for _ in range(n):
        y = top + (H - top) * rng.random() ** 0.8
        depth = (y - top) / (H - top)
        x = rng.random() * W
        s = 1.2 + depth * 6
        c = cols[rng.integers(0, len(cols))]
        d.ellipse([x - s, y - s * 0.7, x + s, y + s * 0.7], fill=c + (int(150 + 100 * depth),))
    arr = np.asarray(layer.filter(ImageFilter.GaussianBlur(0.7)), np.float32)
    a = arr[..., 3:4] / 255
    img[:] = img * (1 - a) + arr[..., :3] * a
    return img


def apiary(seed=3, flowers=True):
    W, H = travel.W, travel.H
    img = travel.gradient([(0, (136, 156, 176)), (0.36, (224, 206, 176)), (0.5, (246, 220, 170)), (1, (102, 96, 60))])
    img = travel.clouds(img, 0, 0.36, (190, 180, 170), (252, 240, 214), seed + 2, scale=820, contrast=0.9)
    img = img + travel.radial(W * 0.3, H * 0.46, 900)[..., None] * np.array([60, 44, 14])
    yy = np.arange(H)[:, None]
    for k, (base, c) in enumerate([(0.44, (170, 160, 150)), (0.54, (138, 132, 106)), (0.66, (106, 112, 70)), (0.78, (96, 112, 58))]):
        n1 = travel.noise(W, 1, 420 - k * 60, seed * 10 + k)[0]
        n2 = travel.noise(W, 1, 70, seed * 10 + 5 + k)[0]
        ridge = H * base + (n1 - 0.5) * (200 - k * 40) + (n2 - 0.5) * 22
        m = np.clip((yy - ridge[None, :]) / 2 + 0.5, 0, 1)
        tex = travel.fbm(W, H, 120, seed * 10 + 20 + k, octaves=4)
        layer = np.array(c, np.float32) * (0.86 + tex[..., None] * 0.28)
        img = img * (1 - m[..., None]) + layer * m[..., None]
        haze = np.clip((yy - ridge[None, :]) / 220, 0, 1) * (1 - np.clip((yy - ridge[None, :]) / 560, 0, 1))
        img = img * (1 - haze[..., None] * 0.22) + np.array([240, 220, 180]) * haze[..., None] * 0.22
    rng = np.random.default_rng(seed)
    gy = int(H * 0.82)
    img = hives(img, [(W * (0.2 + 0.1 * i), gy + (i % 2) * 14 + i * 3, 110 + i * 6) for i in range(7)], rng)
    if flowers:
        img = meadow(img, int(H * 0.8), rng)
    return travel.finish(img, grain=3.5, vignette=0.4, seed=seed)


# --------------------------------------------------------------------------
# Compositions
# --------------------------------------------------------------------------

canvas_for = nomad.canvas_for


def finish(canvas, out, seed, vignette=0.16):
    return cer.finish(canvas, out, seed, vignette=vignette)


def jars_scene(seed, honeys, out=(2000, 1200), bg='wood', dip=True, lids=None, shapes=None):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (226, 214, 194))
    h, w = c.shape[:2]
    n = len(honeys)
    base = h * 0.82
    for i, hn in enumerate(honeys):
        x = w * (0.5 + (i - (n - 1) / 2) * min(0.22, 0.7 / max(n, 1)))
        hh = h * (0.5 if n > 1 else 0.6) * (1 - 0.08 * (i % 2))
        hex_jar(c, x, base + (i % 2) * h * 0.03, hh, hh * 0.36, rng, hn, lid=(lids[i] if lids else 'gold'), shape=(shapes[i] if shapes else 'hex'))
    if dip:
        dipper(c, w * 0.14, h * 0.93, w * 0.42, -0.05, rng, honeys[min(1, n - 1)])
    return finish(c, out, seed)


def jar_single(seed, honey, out=(1200, 1200), bg='linen', lid='gold', shape='hex', bgc=(224, 212, 192)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, bgc)
    h, w = c.shape[:2]
    hex_jar(c, w * 0.48, h * 0.84, h * 0.6, h * 0.22, rng, honey, lid=lid, shape=shape)
    return finish(c, out, seed, vignette=0.12)


def top_scene(seed, honey, out=(1200, 1200), bg='linen'):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (222, 210, 190))
    h, w = c.shape[:2]
    honey_top(c, w * 0.46, h * 0.48, min(w, h) * 0.3, rng, honey)
    dipper(c, w * 0.62, h * 0.82, w * 0.42, -0.5, rng, honey, drip=False)
    return finish(c, out, seed)


def comb_scene(seed, out=(1600, 1000), capped=0.6, honey='wildflower', frame=False, cell=24):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'wood', rng)
    h, w = c.shape[:2]
    if frame:
        comb(c, w * 0.14, h * 0.14, w * 0.72, h * 0.72, rng, cell=cell, capped=capped, honey=honey, frame=True)
    else:
        comb(c, -w * 0.02, -h * 0.02, w * 1.04, h * 1.04, rng, cell=cell, capped=capped, honey=honey)
    return finish(c, out, seed)


def comb_plate(seed, out=(1200, 1200)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'linen', rng, (218, 206, 186))
    h, w = c.shape[:2]
    cer.piece_top(c, w * 0.5, h * 0.5, min(w, h) * 0.4, 'plate', 'white', rng)
    comb(c, w * 0.32, h * 0.36, w * 0.36, h * 0.28, rng, cell=16, capped=0.7)
    dipper(c, w * 0.66, h * 0.86, w * 0.36, -0.35, rng, drip=False)
    return finish(c, out, seed)


def pollen_scene(seed, out=(1200, 1200), bg='linen'):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (220, 208, 188))
    h, w = c.shape[:2]
    R = min(w, h) * 0.34
    inner = nomad.bowl_top(c, w * 0.5, h * 0.5, R, rng, 'ceramic', 'white')
    pollen_mound(c, w * 0.5, h * 0.5, inner, rng)
    return finish(c, out, seed)


def gift_scene(seed, out=(1200, 1200)):
    """Three small jars in a kraft box lid, from the front."""
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'paper', rng, (222, 212, 194))
    h, w = c.shape[:2]
    for i, hn in enumerate(['gavan', 'thyme', 'sidr']):
        x = w * (0.28 + 0.22 * i)
        hex_jar(c, x, h * 0.78, h * 0.38, h * 0.12, rng, hn, lid='kraft')
    # The low kraft tray in front.
    yy, xx = np.mgrid[0:c.shape[0], 0:c.shape[1]].astype(np.float32)
    tray = ((yy > h * 0.7) & (yy < h * 0.84) & (xx > w * 0.12) & (xx < w * 0.88)).astype(np.float32)
    kraft = np.array([182, 140, 92], np.float32) * (0.9 + 0.12 * fnoise(c.shape[0], c.shape[1], 2 * SS, 2, rng))[..., None] * (1 - 0.25 * ((yy - h * 0.7) / (h * 0.14)))[..., None]
    lay(c, kraft, smooth_mask(tray, 0.8 * SS))
    lip = ((np.abs(yy - h * 0.7) < 1.4 * SS) & (xx > w * 0.12) & (xx < w * 0.88)).astype(np.float32)
    lay(c, np.array([214, 178, 128], np.float32), lip)
    return finish(c, out, seed)


def dipper_scene(seed, out=(1200, 1200)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'linen', rng, (222, 212, 194))
    h, w = c.shape[:2]
    dipper(c, w * 0.16, h * 0.42, w * 0.72, 0.18, rng, drip=False)
    dipper(c, w * 0.2, h * 0.64, w * 0.66, 0.12, rng, 'thyme')
    return finish(c, out, seed)


def breakfast(seed, out=(1600, 1000)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'linen', rng, (218, 206, 184))
    h, w = c.shape[:2]
    m = min(w, h)
    cer.piece_top(c, w * 0.34, h * 0.5, m * 0.32, 'plate', 'white', rng)
    comb(c, w * 0.26, h * 0.4, m * 0.2, m * 0.16, rng, cell=12, capped=0.7)
    honey_top(c, w * 0.7, h * 0.36, m * 0.14, rng, 'orange')
    cer.piece_top(c, w * 0.72, h * 0.74, m * 0.12, 'cup', 'night', rng, handle=True)
    dipper(c, w * 0.52, h * 0.88, w * 0.26, -0.2, rng, drip=False)
    return finish(c, out, seed)


def landscape(seed, size, focus=0.5):
    return travel.crop(apiary(seed), size, focus)


PLAN = {
    'hero': lambda: jars_scene(1, ['gavan', 'thyme', 'sidr']),
    'comb': lambda: comb_scene(2, (1600, 1000), capped=0.55),
    'apiary': lambda: landscape(3, (2000, 1100)),
    # Products.
    'p-gavan': lambda: jar_single(11, 'gavan'),
    'p-gavan-b': lambda: top_scene(12, 'gavan'),
    'p-thyme': lambda: jar_single(13, 'thyme', bgc=(226, 214, 196)),
    'p-thyme-b': lambda: top_scene(14, 'thyme'),
    'p-sidr': lambda: jar_single(15, 'sidr', bg='wood'),
    'p-sidr-b': lambda: top_scene(16, 'sidr', bg='wood'),
    'p-wild': lambda: jar_single(17, 'wildflower', lid='kraft', shape='round'),
    'p-wild-b': lambda: top_scene(18, 'wildflower'),
    'p-orange': lambda: jar_single(19, 'orange', bg='paper', bgc=(230, 222, 206)),
    'p-orange-b': lambda: top_scene(20, 'orange', bg='paper'),
    'p-comb': lambda: comb_scene(21, (1200, 1200), capped=0.75, frame=True, cell=18),
    'p-comb-b': lambda: comb_plate(22),
    'p-pollen': lambda: pollen_scene(23),
    'p-pollen-b': lambda: pollen_scene(24, bg='wood'),
    'p-gift': lambda: gift_scene(25),
    'p-gift-b': lambda: jars_scene(26, ['gavan', 'thyme', 'sidr'], out=(1200, 1200), bg='linen', dip=False, lids=['kraft'] * 3),
    'p-dipper': lambda: dipper_scene(27),
    'p-dipper-b': lambda: top_scene(28, 'wildflower', bg='wood'),
    # Categories.
    'cat-honey': lambda: jars_scene(41, ['gavan', 'thyme'], out=(800, 800), bg='linen', dip=False),
    'cat-comb': lambda: comb_scene(42, (800, 800), capped=0.65, cell=16),
    'cat-bee': lambda: pollen_scene(43, (800, 800)),
    'cat-gift': lambda: gift_scene(44, (800, 800)),
    # Process and journal.
    'process-1': lambda: landscape(51, (1200, 900), 0.4),
    'process-2': lambda: comb_scene(52, (1200, 900), capped=0.45),
    'process-3': lambda: jars_scene(53, ['gavan', 'wildflower', 'thyme', 'sidr'], out=(1200, 900), bg='linen', dip=False),
    'journal-1': lambda: jars_scene(61, ['orange', 'thyme'], out=(1200, 800), bg='wood', dip=True),
    'journal-2': lambda: jars_scene(62, ['gavan', 'orange', 'thyme', 'sidr'], out=(1200, 800), bg='paper', dip=False),
    'journal-3': lambda: top_scene(63, 'thyme', out=(1200, 800)),
    'journal-4': lambda: comb_scene(64, (1200, 800), capped=0.8, cell=20),
    'journal-5': lambda: landscape(65, (1200, 800), 0.7),
    'journal-6': lambda: breakfast(66, (1200, 800)),
}


if __name__ == '__main__':
    out_dir = sys.argv[1]
    only = set(sys.argv[2:])
    os.makedirs(out_dir, exist_ok=True)
    total = 0
    for name, make in PLAN.items():
        if only and name not in only:
            continue
        im = make()
        if isinstance(im, np.ndarray):
            im = Image.fromarray(im)
        path = os.path.join(out_dir, name + '.webp')
        im.save(path, 'WEBP', quality=82, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, kb, 'KB', flush=True)
    print('total', total, 'KB')
