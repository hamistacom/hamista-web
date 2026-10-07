"""
Light and shadow on plaster: quiet architectural scenes for the Sazeh demo.

    python3 tools/demo-images/scenes-archi.py <out-dir> [name ...]

Every scene is lit the same way: a textured surface (plaster, concrete,
terracotta) takes cool ambient light everywhere and warm sunlight through
shapes (windows, arches, gaps between fins). Light shapes are drawn as
polygons, softened at two radii for the penumbra, and given a faint bloom.
No 3D objects: flat planes, the way an architectural photographer frames a
wall at noon.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 2  # supersampling

MATERIALS = {
    'plaster': (236, 228, 216),
    'sand': (226, 210, 188),
    'concrete': (196, 193, 187),
    'terracotta': (204, 150, 118),
    'stone': (222, 216, 205),
    'charcoal': (74, 70, 66),
}
SUN = np.array([1.0, 0.88, 0.72])
AMBIENT = np.array([0.80, 0.77, 0.75])


def value_noise(h, w, scale, octaves, rng):
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for _ in range(octaves):
        gh, gw = max(2, int(h / scale) + 2), max(2, int(w / scale) + 2)
        grid = (rng.random((gh, gw)) * 255).astype(np.uint8)
        layer = np.asarray(Image.fromarray(grid).resize((w, h), Image.BICUBIC), np.float32) / 255.0
        acc += amp * layer
        total += amp
        amp *= 0.5
        scale = max(2, scale / 2)
    return acc / total


def texture(h, w, base, rng, rough=1.0):
    """Albedo of a hand-finished surface: broad trowel variation and fine grain."""
    broad = value_noise(h, w, 300 * SS, 4, rng)
    mid = value_noise(h, w, 40 * SS, 2, rng)
    fine = value_noise(h, w, 6 * SS, 2, rng)
    tint = 0.9 + 0.14 * broad * rough + 0.05 * (mid - 0.5) * rough + 0.045 * (fine - 0.5) * rough
    return np.clip(np.array(base, np.float32)[None, None, :] / 255.0 * tint[..., None], 0, 1)


def mask(w, h, polys, blur_near, blur_far, skew_soft=None):
    """Polygons → soft light mask; softer further from the opening (by y or a given ramp)."""
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    for p in polys:
        d.polygon([(x * w, y * h) for x, y in p], fill=255)
    near = np.asarray(m.filter(ImageFilter.GaussianBlur(blur_near * SS)), np.float32) / 255.0
    far = np.asarray(m.filter(ImageFilter.GaussianBlur(blur_far * SS)), np.float32) / 255.0
    if skew_soft is None:
        ramp = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    else:
        ramp = skew_soft
    return near * (1 - ramp) + far * ramp


def light(albedo, sun, ambient=0.42, strength=0.8, ambient_grad=None):
    # Shade is lit by warm light bouncing off the sunlit surfaces, a touch
    # cooler toward the top where the sky reaches in.
    h = albedo.shape[0]
    sky = np.linspace(1.0, 0.0, h, dtype=np.float32)[:, None, None]
    tone = AMBIENT[None, None, :] * (1 - 0.06 * sky) + np.array([0.0, 0.01, 0.04])[None, None, :] * sky
    amb = tone * (ambient + 0.12)
    if ambient_grad is not None:
        amb = amb * ambient_grad[..., None]
    direct = SUN[None, None, :] * (sun[..., None] * strength)
    return albedo * (amb + direct)


def finish(img, seed, vignette=0.2, bloom_src=None, grain=1.6, out=(1600, 1000)):
    h, w = img.shape[:2]
    rng = np.random.default_rng(seed + 99)
    if bloom_src is not None:
        b = Image.fromarray(np.clip(bloom_src * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(40 * SS))
        img = img + (np.asarray(b, np.float32) / 255.0)[..., None] * SUN[None, None, :] * 0.10
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    img = img * (1 - vignette * np.clip(r - 0.55, 0, 1) ** 1.6)[..., None]
    # Gentle filmic shoulder so the sunlit plaster never clips flat.
    img = 1 - np.exp(-img * 1.6)
    img = img / (1 - math.exp(-1.6)) * 0.97
    # Warm grade: lift reds in the mids, keep the shadows from going blue-grey.
    lum = img.mean(axis=2, keepdims=True)
    img = img + (np.array([0.035, 0.012, -0.03])[None, None, :] * (1 - np.abs(lum - 0.5) * 1.6))
    out_img = Image.fromarray(np.clip(img * 255, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)
    arr = np.asarray(out_img, np.float32) + rng.normal(0, grain, (out[1], out[0]))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def canvas(out):
    return out[0] * SS, out[1] * SS


# --------------------------------------------------------------------------
# Scenes
# --------------------------------------------------------------------------

def window_wall(seed, out=(1600, 1000), material='plaster', panes=(3, 2), skew=0.28, x0=0.18, floor=0.80):
    """Sun through a gridded window onto a wall, spilling across the floor."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    wall = texture(h, w, MATERIALS[material], rng)
    flo = texture(h, w, tuple(int(c * 0.86) for c in MATERIALS[material]), rng, rough=0.6)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    alb = np.where(yy < floor, wall, flo)
    # Window light on the wall: a sheared grid of panes.
    cols, rows = panes
    ww, wh = 0.46, 0.5
    gap = 0.012
    polys = []
    top = 0.12
    for c in range(cols):
        for r in range(rows):
            ax = x0 + c * ww / cols + gap
            bx = x0 + (c + 1) * ww / cols - gap
            ay = top + r * wh / rows + gap * 1.4
            by = top + (r + 1) * wh / rows - gap * 1.4
            sh = lambda x, y: (x + (y - top) * skew, y)
            polys.append([sh(ax, ay), sh(bx, ay), sh(bx, by), sh(ax, by)])
    sun = mask(w, h, polys, 2.5, 9)
    # The same light thrown down on the floor as a long trapezoid.
    fpolys = []
    for c in range(cols):
        ax = x0 + 0.20 + c * 0.17 + 0.01
        bx = ax + 0.15
        fpolys.append([(ax, floor + 0.01), (bx, floor + 0.01), (bx + 0.16, 1.02), (ax + 0.12, 1.02)])
    fsun = mask(w, h, fpolys, 4, 14)
    s = np.clip(sun * (yy[..., 0] < floor) + fsun * (yy[..., 0] >= floor) * 0.85, 0, 1)
    # Ambient falls off toward the corners and the floor edge.
    grad = 0.88 + 0.18 * np.exp(-((np.linspace(-1, 1, w)[None, :] + 0.3) ** 2) * 1.2)
    grad = grad * np.ones((h, 1))
    edge = np.clip(1 - np.abs(yy[..., 0] - floor) / 0.012, 0, 1) * 0.25
    img = light(alb, s, ambient=0.48, ambient_grad=grad.astype(np.float32) * (1 - edge))
    return finish(img, seed, bloom_src=s, out=out)


def arch_light(seed, out=(1600, 1000), material='sand', count=4, skew=-0.32, floor=0.74):
    """Arched openings throw a row of arch-shaped patches across wall and floor."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    wall = texture(h, w, MATERIALS[material], rng)
    flo = texture(h, w, tuple(int(c * 0.84) for c in MATERIALS[material]), rng, rough=0.5)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    alb = np.where(yy < floor, wall, flo)
    polys = []
    span = 0.9 / count
    for i in range(count):
        cx = 0.12 + i * span + span / 2
        half = span * 0.32
        top, base = 0.18, floor - 0.02
        pts = []
        for k in range(25):
            a = math.pi * k / 24
            pts.append((cx + half * math.cos(a), top + half * 1.4 * (1 - math.sin(a)) - 0.0))
        pts = [(x, y) for x, y in reversed(pts)]
        pts += [(cx + half, base), (cx - half, base)]
        sh = [(x + (y - top) * skew, y) for x, y in pts]
        polys.append(sh)
    sun = mask(w, h, polys, 3, 11)
    fpolys = []
    for i in range(count):
        cx = 0.12 + i * span + span / 2 + (floor - 0.18) * skew
        half = span * 0.32
        fpolys.append([(cx - half, floor + 0.005), (cx + half, floor + 0.005), (cx + half - 0.12, 1.02), (cx - half - 0.18, 1.02)])
    fsun = mask(w, h, fpolys, 4, 16)
    s = np.clip(sun * (yy[..., 0] < floor) + fsun * (yy[..., 0] >= floor) * 0.8, 0, 1)
    img = light(alb, s, ambient=0.45)
    return finish(img, seed, bloom_src=s, out=out)


def stairs(seed, out=(1200, 1500), material='concrete', steps=9):
    """A flight of stairs along a wall; treads catch the light, risers fall into shade."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    wall = texture(h, w, MATERIALS[material], rng)
    alb = wall.copy()
    shade = np.ones((h, w), np.float32)
    sun = np.zeros((h, w), np.float32)
    img_mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(img_mask)
    tread = Image.new('L', (w, h), 0)
    dt = ImageDraw.Draw(tread)
    sx, sy = -0.04, 0.95
    step_w, step_h = 1.1 / steps, 0.7 / steps
    for i in range(steps):
        x = sx + i * step_w
        y = sy - (i + 1) * step_h
        # Block of the step down to the floor of the flight.
        d.polygon([(x * w, y * h), ((x + step_w) * w, y * h), ((x + step_w) * w, (sy + 0.1) * h), (x * w, (sy + 0.1) * h)], fill=255)
        dt.rectangle([x * w, y * h, (x + step_w) * w, (y + 0.012) * h], fill=255)
    body = np.asarray(img_mask.filter(ImageFilter.GaussianBlur(1.2 * SS)), np.float32) / 255.0
    lip = np.asarray(tread.filter(ImageFilter.GaussianBlur(1.5 * SS)), np.float32) / 255.0
    # A broad diagonal of sun crossing wall and steps.
    band = [(0.0, 0.05), (0.55, 0.05), (1.05, 0.95), (0.45, 0.95)]
    sun = mask(w, h, [band], 6, 22)
    stair_alb = texture(h, w, tuple(int(c * 0.95) for c in MATERIALS[material]), rng, rough=0.7)
    alb = alb * (1 - body[..., None]) + stair_alb * body[..., None]
    shade = 1 - body * 0.25
    s = sun * (1 - body * 0.35) + lip * 0.55
    img = light(alb, np.clip(s, 0, 1.2), ambient=0.5, ambient_grad=shade)
    return finish(img, seed, bloom_src=sun, out=out)


def curve(seed, out=(1600, 1000), material='stone', sky=((214, 223, 230), (236, 238, 236))):
    """A curved facade against a pale sky, ribbon windows following the curve."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u = xx / w
    v = yy / h
    top = 0.16 + 0.10 * (u - 0.2) ** 2
    building = (v > top).astype(np.float32)
    building = np.asarray(Image.fromarray((building * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8 * SS)), np.float32) / 255.0
    # Normal of a cylinder seen from the side: brightness follows the cosine.
    ang = (u - 0.62) * 2.4
    lit = np.clip(np.cos(ang - 0.5), 0, 1) ** 1.3
    alb = texture(h, w, MATERIALS[material], rng, rough=0.6)
    bands = np.zeros((h, w), np.float32)
    for k in range(3):
        y0 = 0.36 + k * 0.2
        y = y0 + 0.012 * (u - 0.5) ** 2
        bands += np.exp(-((v - y) / 0.02) ** 8)
    bands = np.clip(bands, 0, 1)
    refl = (0.5 + 0.5 * np.sin(u * 9.0 + v * 2.0))[..., None]
    glass = np.array([0.20, 0.22, 0.24]) + (0.18 * lit[..., None] + 0.12 * refl) * np.array([0.75, 0.82, 0.9])
    facade = light(alb, lit, ambient=0.55) * (1 - bands[..., None]) + glass * bands[..., None]
    s0, s1 = np.array(sky[0]) / 255.0, np.array(sky[1]) / 255.0
    skyimg = s0[None, None, :] * (1 - v[..., None]) + s1[None, None, :] * v[..., None]
    img = facade * building[..., None] + skyimg * (1 - building[..., None])
    return finish(img, seed, vignette=0.18, out=out)


def fins(seed, out=(1600, 1000), material='stone', count=14, depth=0.022):
    """Vertical fins: lit faces, shaded returns and their shadows on the wall behind."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    alb = texture(h, w, MATERIALS[material], rng, rough=0.7)
    u = np.linspace(0, 1, w, dtype=np.float32)[None, :] * np.ones((h, 1), np.float32)
    pitch = 1.0 / count
    pos = (u % pitch) / pitch
    face = (pos < 0.28).astype(np.float32)
    side = ((pos >= 0.28) & (pos < 0.28 + depth / pitch)).astype(np.float32)
    shadow = ((pos >= 0.28) & (pos < 0.28 + depth / pitch * 3.2)).astype(np.float32)
    soft = lambda a, r: np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r * SS)), np.float32) / 255.0
    face, side, shadow = soft(face, 0.6), soft(side, 0.6), soft(shadow, 2.5)
    v = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    sun = np.clip(1 - shadow * 0.92, 0, 1) * (0.85 + 0.15 * v)
    sun = sun * (1 - side * 0.8) + face * 0.15
    img = light(alb, sun, ambient=0.46)
    return finish(img, seed, vignette=0.22, out=out)


def niche(seed, out=(1200, 1500), material='plaster'):
    """An arched niche set into a wall, lit from above, with a slab shelf."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    alb = texture(h, w, MATERIALS[material], rng)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = xx / w, yy / h
    cx, half, top, base = 0.5, 0.22, 0.2, 0.78
    inside = ((np.abs(u - cx) < half) & (v > top + half * 0.75) & (v < base)) | (((u - cx) ** 2 + ((v - (top + half * 0.75)) / 0.75 * (w / h) * 0 + (v - (top + half * 0.75))) ** 2 * 0) < 0)
    # Arch: a semicircle on top of the rectangle.
    arch = ((u - cx) ** 2 + ((v - (top + half * 0.75)) * (h / w)) ** 2 < half ** 2) & (v <= top + half * 0.75)
    inside = (inside | arch).astype(np.float32)
    inside_s = np.asarray(Image.fromarray((inside * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2 * SS)), np.float32) / 255.0
    # Recess shading: darker toward the top and sides inside the niche.
    depth = np.clip((v - top) / (base - top), 0, 1)
    rim = np.clip(1 - np.abs(u - cx) / half, 0, 1)
    recess = 0.55 + 0.35 * depth * rim ** 0.6
    shelf = ((np.abs(u - cx) < half) & (np.abs(v - 0.62) < 0.008)).astype(np.float32)
    shelf_shadow = ((np.abs(u - cx) < half * 0.98) & (v > 0.62) & (v < 0.66)).astype(np.float32)
    sun = mask(w, h, [[(0.0, 0.0), (0.38, 0.0), (0.92, 1.0), (0.54, 1.0)]], 10, 30) * 0.55
    light_map = sun * (1 - inside_s) + inside_s * (recess - 0.45)
    shelf_shadow = np.asarray(Image.fromarray((shelf_shadow * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6 * SS)), np.float32) / 255.0
    light_map = light_map - shelf_shadow * 0.08 * inside_s + shelf * 0.25
    grad = 1 - inside_s * 0.25
    img = light(alb, np.clip(light_map, 0, 1), ambient=0.55, ambient_grad=grad)
    return finish(img, seed, out=out)


def room(seed, out=(1600, 1000), material='plaster', bench=True):
    """A bare room corner: two walls, a floor, a window patch and a low plinth."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = xx / w, yy / h
    corner_x = 0.34
    floor_y = 0.70 + (u - corner_x) * 0.0
    floor_line = np.where(u < corner_x, 0.70 + (corner_x - u) * 0.45, 0.70)
    wall_l = (u < corner_x) & (v < floor_line)
    wall_r = (u >= corner_x) & (v < floor_line)
    flo = v >= floor_line
    a_wall = texture(h, w, MATERIALS[material], rng)
    a_floor = texture(h, w, tuple(int(c * 0.82) for c in MATERIALS[material]), rng, rough=0.5)
    alb = a_wall * (~flo)[..., None] + a_floor * flo[..., None]
    panes = []
    for cx in range(2):
        for cy in range(2):
            ax, ay = 0.56 + cx * 0.115, 0.16 + cy * 0.2
            panes.append([(ax + 0.004, ay + 0.006 - cx * 0.012), (ax + 0.109, ay + 0.006 - cx * 0.012 - 0.012), (ax + 0.113, ay + 0.19 - cx * 0.012 - 0.012), (ax + 0.008, ay + 0.19 - cx * 0.012)])
    sun = mask(w, h, panes, 3, 10) * 0.82
    fsun = mask(w, h, [[(0.50, 0.72), (0.74, 0.72), (0.98, 1.02), (0.62, 1.02)]], 5, 18)
    amb = np.where(wall_l, 0.72, np.where(wall_r, 1.0, 0.86)).astype(np.float32)
    s = sun * wall_r + fsun * flo * 0.75
    if bench:
        b = (u > 0.40) & (u < 0.70) & (v > 0.62) & (v < 0.74)
        btop = (u > 0.40) & (u < 0.70) & (v > 0.615) & (v < 0.632)
        b_alb = texture(h, w, MATERIALS['concrete'], rng, rough=0.8)
        alb = np.where(b[..., None], b_alb, alb)
        amb = np.where(b, 0.78, amb)
        amb = np.where(btop, 1.05, amb)
        s = np.where(b, s * 0.4 + btop * 0.5, s)
        shadow = (u > 0.42) & (u < 0.80) & (v > 0.74) & (v < 0.80)
        amb = np.where(shadow, amb * 0.82, amb)
    amb = np.asarray(Image.fromarray((np.clip(amb, 0, 1.2) / 1.2 * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0 * SS)), np.float32) / 255.0 * 1.2
    img = light(alb, s, ambient=0.5, ambient_grad=amb)
    return finish(img, seed, bloom_src=s, out=out)


def columns(seed, out=(1600, 1000), material='stone', count=6, skew=0.9, floor=0.38):
    """Long shadows of a colonnade across a sunlit floor below a shaded wall."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    v = np.linspace(0, 1, h, dtype=np.float32)[:, None] * np.ones((1, w), np.float32)
    wall = texture(h, w, MATERIALS[material], rng)
    flo = texture(h, w, tuple(int(c * 0.9) for c in MATERIALS[material]), rng, rough=0.5)
    alb = np.where((v < floor)[..., None], wall, flo)
    polys = []
    gap = 1.0 / count
    for i in range(count + 2):
        x = -0.2 + i * gap
        polys.append([(x, floor), (x + gap * 0.55, floor), (x + gap * 0.55 + skew * 0.62, 1.05), (x + skew * 0.62, 1.05)])
    lit = mask(w, h, polys, 3, 14)
    s = lit * (v >= floor) * 0.95 + (v < floor) * 0.05
    img = light(alb, s, ambient=0.5)
    return finish(img, seed, bloom_src=lit * (v >= floor), out=out)


def slit(seed, out=(1600, 1000), material='charcoal', angle=0.18, width=0.035):
    """A dark wall cut by one narrow blade of warm light."""
    rng = np.random.default_rng(seed)
    w, h = canvas(out)
    alb = texture(h, w, MATERIALS[material], rng, rough=1.3)
    x0 = 0.58
    blade = [(x0, -0.05), (x0 + width, -0.05), (x0 + width + angle, 1.05), (x0 + angle, 1.05)]
    sun = mask(w, h, [blade], 2, 18)
    glow = mask(w, h, [blade], 60, 140) * 0.35
    img = light(alb, np.clip(sun * 1.6 + glow, 0, 2), ambient=0.18)
    return finish(img, seed, vignette=0.35, bloom_src=sun, out=out)


PLAN = {
    # Hero and home
    'hero': lambda: window_wall(3, (2000, 1200), 'plaster', (3, 2), 0.30, 0.16),
    'arches': lambda: arch_light(5, (2000, 1100), 'sand', 4, -0.30),
    'curve': lambda: curve(7, (1600, 1000)),
    'fins': lambda: fins(9, (1600, 1000)),
    'stairs': lambda: stairs(11, (1200, 1500)),
    'niche': lambda: niche(13, (1200, 1500)),
    'room': lambda: room(15, (1600, 1000)),
    'columns': lambda: columns(17, (1600, 1000)),
    'reel': lambda: arch_light(19, (2000, 1000), 'terracotta', 5, 0.26, 0.78),
    'slit': lambda: slit(20, (2000, 1100)),
    'slit-tall': lambda: slit(33, (1200, 1500), 'charcoal', 0.1, 0.05),
    # Projects: a cover and two details each
    'project-1': lambda: room(21, (1600, 1100), 'plaster'),
    'project-1-b': lambda: niche(22, (1200, 1500), 'sand'),
    'project-2': lambda: curve(23, (1600, 1100), 'concrete', ((200, 212, 222), (232, 234, 233))),
    'project-2-b': lambda: fins(24, (1200, 1500), 'concrete', 9),
    'project-3': lambda: arch_light(25, (1600, 1100), 'terracotta', 3, -0.36),
    'project-3-b': lambda: stairs(26, (1200, 1500), 'terracotta', 7),
    'project-4': lambda: window_wall(27, (1600, 1100), 'stone', (2, 3), -0.22, 0.42),
    'project-4-b': lambda: columns(28, (1200, 1500), 'sand', 4, 0.6, 0.30),
    'project-5': lambda: fins(29, (1600, 1100), 'sand', 18, 0.016),
    'project-5-b': lambda: room(30, (1200, 1500), 'stone', False),
    'project-6': lambda: columns(31, (1600, 1100), 'concrete', 7, 1.0, 0.42),
    'project-6-b': lambda: window_wall(32, (1200, 1500), 'concrete', (2, 4), 0.18, 0.2, 0.86),
    # Journal
    'journal-1': lambda: window_wall(41, (1200, 800), 'sand', (4, 2), 0.36, 0.10),
    'journal-2': lambda: niche(42, (1200, 800), 'stone'),
    'journal-3': lambda: stairs(43, (1200, 800), 'plaster', 8),
    'journal-4': lambda: curve(44, (1200, 800), 'sand', ((222, 214, 204), (240, 236, 230))),
    'journal-5': lambda: arch_light(45, (1200, 800), 'plaster', 3, 0.3),
    'journal-6': lambda: fins(46, (1200, 800), 'terracotta', 10),
}


if __name__ == '__main__':
    out = sys.argv[1]
    only = set(sys.argv[2:])
    os.makedirs(out, exist_ok=True)
    total = 0
    for name, make in PLAN.items():
        if only and name not in only:
            continue
        im = make()
        path = os.path.join(out, name + '.webp')
        im.save(path, 'WEBP', quality=80, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, kb, 'KB')
    print('total', total, 'KB')
