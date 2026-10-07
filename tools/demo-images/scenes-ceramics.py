"""
Studio photographs of handmade ceramics for the Gelineh shop demo.

    python3 tools/demo-images/scenes-ceramics.py <out-dir> [name ...]

Pieces are described by a profile (height over radius for top-down shots,
radius over height for side views). Surface normals come from that profile,
and each piece is lit by one soft key light with a glossy glaze highlight.
Glaze is mottled, speckled with iron and breaks to bare clay at the rim and
foot, as stoneware does. Backgrounds are linen, plaster or seamless paper.
"""
import importlib.util
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('archi', os.path.join(HERE, 'scenes-archi.py'))
archi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archi)

SS = 2
LIGHT = np.array([-0.45, -0.55, 0.70])
LIGHT = LIGHT / np.linalg.norm(LIGHT)
HALF = LIGHT + np.array([0, 0, 1.0])
HALF = HALF / np.linalg.norm(HALF)

GLAZES = {
    'white': ((236, 232, 222), 0.35),
    'oat': ((214, 200, 176), 0.5),
    'turquoise': ((46, 150, 160), 0.2),
    'celadon': ((168, 190, 166), 0.3),
    'sage': ((128, 148, 124), 0.35),
    'honey': ((176, 116, 46), 0.25),
    'night': ((32, 42, 66), 0.15),
    'terracotta': ((172, 92, 62), 0.6),
    'sand': ((206, 182, 146), 0.5),
    'ink': ((40, 40, 42), 0.2),
}
CLAY = np.array([168, 132, 104], np.float32)


def fnoise(h, w, scale, octaves, rng):
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


# --------------------------------------------------------------------------
# Backgrounds
# --------------------------------------------------------------------------

def linen(h, w, rng, color=(226, 218, 204)):
    base = np.array(color, np.float32)
    weave_x = np.sin(np.arange(w, dtype=np.float32) * 2.1)[None, :]
    weave_y = np.sin(np.arange(h, dtype=np.float32) * 1.9)[:, None]
    slub = fnoise(h, w, 3 * SS, 2, rng)
    folds = fnoise(h, w, 340 * SS, 3, rng)
    t = 1 + 0.018 * weave_x + 0.018 * weave_y + 0.05 * (slub - 0.5) + 0.12 * (folds - 0.5)
    return base[None, None, :] * t[..., None]


def plaster(h, w, rng, color=(228, 222, 212)):
    return archi.texture(h, w, color, rng) * 255


def paper(h, w, rng, color=(232, 226, 216)):
    v = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    sweep = 0.9 + 0.12 * (1 - (v - 0.62) ** 2 * 2.2)
    return np.array(color, np.float32)[None, None, :] * sweep[..., None] * np.ones((1, w, 1), np.float32)


def soft_shadow(h, w, mask, offset, blur, strength):
    m = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8))
    m = m.transform(m.size, Image.AFFINE, (1, 0, -offset[0], 0, 1, -offset[1]))
    m = m.filter(ImageFilter.GaussianBlur(blur))
    return 1 - strength * np.asarray(m, np.float32) / 255.0


# --------------------------------------------------------------------------
# Glaze and lighting
# --------------------------------------------------------------------------

def glaze_albedo(h, w, glaze, rng, speckle=1.0):
    color, matte = GLAZES[glaze]
    base = np.array(color, np.float32)
    mottle = fnoise(h, w, 60 * SS, 4, rng)
    alb = base[None, None, :] * (0.94 + 0.11 * mottle)[..., None]
    # Iron speckles: small dark dots.
    dots = (rng.random((h // 3, w // 3)) > 1 - 0.006 * speckle).astype(np.float32)
    dots = np.asarray(Image.fromarray((dots * 255).astype(np.uint8)).resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(0.8 * SS)), np.float32) / 255.0
    alb = alb * (1 - 0.55 * dots[..., None]) + np.array([70, 50, 36])[None, None, :] * 0.55 * dots[..., None]
    return alb, matte


def shade(alb, nx, ny, nz, matte, ambient=0.42, key=0.7, hot=1.0):
    diff = np.clip(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0, 1)
    spec_soft = np.clip(nx * HALF[0] + ny * HALF[1] + nz * HALF[2], 0, 1) ** 18 * (1 - matte) * 0.3
    spec_hot = np.clip(nx * HALF[0] + ny * HALF[1] + nz * HALF[2], 0, 1) ** 140 * (1 - matte) * 1.1 * hot
    col = alb * (ambient + key * diff)[..., None] + (spec_soft + spec_hot)[..., None] * 255
    return col


def normals_from_height(hgt, scale):
    gy, gx = np.gradient(hgt * scale)
    nz = np.ones_like(hgt)
    n = np.sqrt(gx * gx + gy * gy + nz)
    return -gx / n, -gy / n, nz / n


# --------------------------------------------------------------------------
# Top-down pieces
# --------------------------------------------------------------------------

def piece_top(canvas, cx, cy, R, kind, glaze, rng, oval=1.0, handle=False):
    """Draw a plate, bowl or cup seen from above onto canvas (float RGB)."""
    h, w = canvas.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx = (xx - cx) / R
    dy = (yy - cy) / (R * oval)
    r = np.sqrt(dx * dx + dy * dy)
    inside = r <= 1.0
    if kind == 'plate':
        well, rim0 = 0.6, 0.9
        hgt = np.where(r < well, 0.0, np.where(r < rim0, ((r - well) / (rim0 - well)) ** 1.6 * 0.12, 0.12 + 0.02 * np.sin(np.clip((r - rim0) / (1 - rim0), 0, 1) * math.pi)))
        depth_ao = 1 - 0.05 * np.clip(1 - r / well, 0, 1)
        hscale = R * 1.6
    elif kind == 'bowl':
        foot = 0.38
        t = np.clip((r - foot) / (0.95 - foot), 0, 1)
        hgt = np.where(r < foot, 0.0, t ** 1.4 * 0.75)
        hgt = np.where(r > 0.95, 0.75 + 0.03 * np.sin(np.clip((r - 0.95) / 0.05, 0, 1) * math.pi), hgt)
        depth_ao = 0.78 + 0.22 * np.clip(r / 0.95, 0, 1) ** 0.8
        hscale = R * 1.2
    else:  # cup: deep and steep
        foot = 0.62
        t = np.clip((r - foot) / (0.9 - foot), 0, 1)
        hgt = np.where(r < foot, 0.0, t ** 1.2 * 1.4)
        hgt = np.where(r > 0.9, 1.4 + 0.04 * np.sin(np.clip((r - 0.9) / 0.1, 0, 1) * math.pi), hgt)
        depth_ao = 0.62 + 0.38 * np.clip(r / 0.9, 0, 1) ** 1.2
        hscale = R * 1.0
    nx, ny, nz = normals_from_height(hgt, hscale / SS)
    alb, matte = glaze_albedo(h, w, glaze, rng)
    # Glaze breaks to clay at the very edge of the rim.
    edge = np.clip((r - 0.965) / 0.035, 0, 1)
    alb = alb * (1 - edge[..., None] * 0.75) + CLAY[None, None, :] * edge[..., None] * 0.75
    # Pooling: thicker, darker glaze in the bottom.
    pool = np.clip(1 - r / 0.5, 0, 1) ** 2 * 0.12
    alb = alb * (1 - pool[..., None])
    col = shade(alb, nx, ny, nz, matte) * depth_ao[..., None]
    soft_in = np.clip((1.0 - r) * R / (1.2 * SS), 0, 1)
    # Contact shadow first, then the piece.
    shadow = soft_shadow(h, w, inside.astype(np.float32), (R * 0.07, R * 0.09), R * 0.12, 0.38)
    canvas *= shadow[..., None]
    contact = soft_shadow(h, w, inside.astype(np.float32), (R * 0.015, R * 0.02), R * 0.02, 0.35)
    canvas *= contact[..., None]
    canvas[:] = canvas * (1 - soft_in[..., None]) + col * soft_in[..., None]
    if handle:
        hx, hy = cx + R * 1.18, cy
        hr = np.sqrt(((xx - hx) / (R * 0.32)) ** 2 + ((yy - hy) / (R * 0.2)) ** 2)
        ring = (hr <= 1.0) & (hr >= 0.45) & (xx > cx + R * 0.92)
        hm = ring.astype(np.float32)
        hsh = soft_shadow(h, w, hm, (R * 0.06, R * 0.08), R * 0.06, 0.35)
        canvas *= hsh[..., None]
        # Round cross-section: the normal turns across the ring's width.
        a = np.clip((hr - 0.725) / 0.275, -1, 1)
        ex, ey = (xx - hx) / (R * 0.32), (yy - hy) / (R * 0.2)
        el = np.sqrt(ex * ex + ey * ey) + 1e-6
        hnx, hny = ex / el * a, ey / el * a
        hnz = np.sqrt(np.clip(1 - a * a, 0, 1))
        halb, hmatte = glaze_albedo(h, w, glaze, rng, 0.5)
        hcol = shade(halb, hnx, hny, hnz, hmatte, hot=0.6)
        hm_s = np.asarray(Image.fromarray((hm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7 * SS)), np.float32) / 255.0
        canvas[:] = canvas * (1 - hm_s[..., None]) + hcol * hm_s[..., None]
    return canvas


# --------------------------------------------------------------------------
# Side views
# --------------------------------------------------------------------------

def piece_side(canvas, cx, base_y, height, profile, glaze, rng, clay_band=0.08):
    """A vessel standing on a surface. profile(t) → half-width at height t (0 foot, 1 lip), in px."""
    h, w = canvas.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = (base_y - yy) / height
    tc = np.clip(t, 0, 1)
    rad = profile(tc)
    inside = (t >= 0) & (t <= 1) & (np.abs(xx - cx) <= rad)
    u = np.clip((xx - cx) / np.maximum(rad, 1), -1, 1)
    # Slope of the profile tilts the normal up or down.
    dt = 0.002
    slope = (profile(np.clip(tc + dt, 0, 1)) - profile(np.clip(tc - dt, 0, 1))) / (2 * dt * height)
    nz0 = np.sqrt(np.clip(1 - u * u, 0, 1))
    nx = u
    # Throwing rings: faint horizontal ridges left by the potter's fingers.
    rings = 0.022 * np.sin(t * height / (5.5 * SS)) + 0.014 * np.sin(t * height / (13 * SS) + 0.7)
    ny = -slope * nz0 + rings * nz0
    n = np.sqrt(nx * nx + ny * ny + nz0 * nz0) + 1e-6
    nx, ny, nz = nx / n, ny / n, nz0 / n
    alb, matte = glaze_albedo(h, w, glaze, rng)
    # Glaze stops above the foot, with a slightly wavy, thicker edge.
    wob = fnoise(1, w, 40 * SS, 3, rng)[0]
    drips = (fnoise(1, w, 6 * SS, 1, rng)[0] > 0.86).astype(np.float32)
    drips = np.convolve(drips, np.hanning(int(10 * SS)), mode='same')
    line_x = clay_band + 0.025 * (wob - 0.5) - 0.03 * np.clip(drips, 0, 1)
    line = line_x[None, :] * np.ones((h, 1), np.float32)
    bare = np.clip((line - t) / 0.006, 0, 1)
    lip = np.clip((t - 0.985) / 0.015, 0, 1) * 0.6
    drip = np.clip(1 - np.abs(t - line - 0.008) / 0.01, 0, 1) * 0.25
    alb = alb * (1 - drip[..., None])
    clay = CLAY[None, None, :] * (0.92 + 0.12 * fnoise(h, w, 8 * SS, 2, rng))[..., None]
    alb = alb * (1 - np.maximum(bare, lip)[..., None]) + clay * np.maximum(bare, lip)[..., None]
    m = matte * (1 - bare) + 0.95 * bare
    col = shade(alb, nx, ny, nz, m, ambient=0.42, key=0.66, hot=0.45)
    # A tall softbox reflected in the glaze: a soft vertical band on the lit side.
    box = np.exp(-((u + 0.42) / 0.09) ** 2) * (1 - m) * 0.55 * np.clip(t * 6, 0, 1) * np.clip((1 - t) * 6, 0, 1)
    col += (box * 255)[..., None]
    # Rim-light on the shadow side from the bright backdrop.
    col += (np.clip(u, 0, 1) ** 6 * 26)[..., None]
    mask = inside.astype(np.float32)
    shadow_mask = np.zeros_like(mask)
    ell = (((xx - cx - height * 0.08) / (profile(np.array(0.0)) * 1.25 + 1)) ** 2 + ((yy - base_y) / (height * 0.05)) ** 2) <= 1
    shadow_mask[ell] = 1
    sh = soft_shadow(h, w, shadow_mask, (0, 0), height * 0.06, 0.45)
    canvas *= sh[..., None]
    soft = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8 * SS)), np.float32) / 255.0
    canvas[:] = canvas * (1 - soft[..., None]) + col * soft[..., None]
    return canvas


def side_handle(canvas, cx, base_y, height, rad, glaze, rng):
    """A loop handle on the right of a mug seen from the side."""
    h, w = canvas.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    hx, hy = cx + rad * 1.02, base_y - height * 0.52
    ex, ey = (xx - hx) / (rad * 0.42), (yy - hy) / (height * 0.3)
    hr = np.sqrt(ex * ex + ey * ey)
    ring = ((hr <= 1.0) & (hr >= 0.5) & (xx > cx + rad * 0.9)).astype(np.float32)
    a = np.clip((hr - 0.75) / 0.25, -1, 1)
    el = hr + 1e-6
    nx, ny = ex / el * a, ey / el * a
    nz = np.sqrt(np.clip(1 - a * a, 0, 1))
    alb, matte = glaze_albedo(h, w, glaze, rng, 0.5)
    col = shade(alb, nx, ny, nz, matte, hot=0.5)
    soft = np.asarray(Image.fromarray((ring * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8 * SS)), np.float32) / 255.0
    canvas[:] = canvas * (1 - soft[..., None]) + col * soft[..., None]
    return canvas


def bowl_profile(R):
    return lambda t: R * (0.42 + 0.58 * np.sin(np.clip(t, 0, 1) * math.pi / 2) ** 0.7)


def vase_profile(R, neck=0.35, belly=0.38):
    def f(t):
        t = np.clip(t, 0, 1)
        body = np.exp(-((t - belly) / 0.32) ** 2)
        neckw = np.exp(-((t - 0.86) / 0.08) ** 2)
        return R * (0.42 + 0.58 * body - 0.18 * neckw + neck * 0.0 + 0.12 * np.clip((t - 0.9) / 0.1, 0, 1))
    return f


def jug_profile(R):
    def f(t):
        t = np.clip(t, 0, 1)
        body = 0.55 + 0.45 * np.clip(np.sin(np.clip(t / 0.75, 0, 1) * math.pi), 0, 1) ** 0.8
        neck = 0.55 - 0.15 * (t - 0.75) / 0.25
        return R * np.where(t < 0.75, body, neck)
    return f


def mug_profile(R):
    return lambda t: R * (0.92 + 0.08 * np.clip(t, 0, 1))


# --------------------------------------------------------------------------
# Compositions
# --------------------------------------------------------------------------

def finish(canvas, out, seed, vignette=0.16, warm=True):
    rng = np.random.default_rng(seed + 7)
    h, w = canvas.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    canvas = canvas * (1 - vignette * np.clip(r - 0.6, 0, 1) ** 1.5)[..., None]
    if warm:
        canvas = canvas * np.array([1.02, 1.0, 0.97])[None, None, :]
    im = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)
    arr = np.asarray(im, np.float32) + rng.normal(0, 1.4, (out[1], out[0]))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def top_single(seed, kind, glaze, out=(1200, 1200), bg='linen', bgc=None, scale=0.36, handle=False, oval=1.0):
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS, out[1] * SS
    canvas = (linen if bg == 'linen' else plaster)(h, w, rng, bgc) if bgc else (linen if bg == 'linen' else plaster)(h, w, rng)
    R = min(w, h) * scale
    piece_top(canvas, w * (0.47 if handle else 0.5), h * 0.5, R, kind, glaze, rng, oval=oval, handle=handle)
    return finish(canvas, out, seed)


def flat_lay(seed, items, out=(2000, 1200), bg='linen', bgc=None):
    """items: (x, y, scale, kind, glaze, handle) in fractions of the frame."""
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS, out[1] * SS
    canvas = (linen if bg == 'linen' else plaster)(h, w, rng, bgc) if bgc else (linen if bg == 'linen' else plaster)(h, w, rng)
    for x, y, s, kind, glaze, handle in items:
        piece_top(canvas, w * x, h * y, min(w, h) * s, kind, glaze, rng, handle=handle)
    return finish(canvas, out, seed)


def side_single(seed, profile_fn, glaze, out=(1200, 1200), bgc=(232, 226, 216), height=0.62, R=0.2, clay_band=0.08, handle=False):
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS, out[1] * SS
    canvas = paper(h, w, rng, bgc)
    H = h * height
    cx = w * (0.46 if handle else 0.5)
    prof = profile_fn(w * R)
    if handle:
        side_handle(canvas, cx, h * 0.84, H, float(prof(np.array(0.5))), glaze, rng)
    piece_side(canvas, cx, h * 0.84, H, prof, glaze, rng, clay_band)
    return finish(canvas, out, seed, vignette=0.1)


def shelf(seed, out=(2000, 1100)):
    """Vases in a row on a plaster ledge, lit from the left."""
    rng = np.random.default_rng(seed)
    w, h = out[0] * SS, out[1] * SS
    canvas = plaster(h, w, rng, (226, 218, 206))
    ledge = int(h * 0.8)
    canvas[ledge:] *= 0.86
    canvas[ledge:ledge + 3 * SS] *= 1.12
    specs = [
        (0.2, vase_profile(w * 0.05), 'sage', 0.5),
        (0.36, jug_profile(w * 0.07), 'white', 0.38),
        (0.52, vase_profile(w * 0.04, belly=0.3), 'terracotta', 0.6),
        (0.66, bowl_profile(w * 0.07), 'oat', 0.16),
        (0.82, jug_profile(w * 0.055), 'night', 0.44),
    ]
    for x, prof, glaze, hh in specs:
        piece_side(canvas, w * x, ledge + 2, h * hh, prof, glaze, rng, 0.07)
    # Window light across the wall.
    sun = archi.mask(w, h, [[(0.0, 0.0), (0.42, 0.0), (0.72, 0.8), (0.3, 0.8)]], 8, 30)
    canvas *= (0.86 + 0.28 * sun)[..., None]
    return finish(canvas, out, seed)


PLAN = {
    'hero': lambda: flat_lay(3, [(0.3, 0.5, 0.34, 'plate', 'white', False), (0.3, 0.5, 0.17, 'bowl', 'oat', False), (0.62, 0.32, 0.17, 'cup', 'night', True), (0.66, 0.74, 0.22, 'bowl', 'turquoise', False), (0.9, 0.5, 0.14, 'cup', 'sand', False)]),
    'shelf': lambda: shelf(5),
    'flatlay-2': lambda: flat_lay(7, [(0.26, 0.45, 0.3, 'plate', 'celadon', False), (0.6, 0.55, 0.3, 'plate', 'white', False), (0.6, 0.55, 0.15, 'bowl', 'sage', False), (0.88, 0.25, 0.12, 'cup', 'oat', True)], bgc=(206, 196, 180)),
    'studio': lambda: flat_lay(9, [(0.2, 0.3, 0.16, 'bowl', 'honey', False), (0.45, 0.62, 0.16, 'bowl', 'oat', False), (0.72, 0.3, 0.16, 'bowl', 'terracotta', False), (0.88, 0.72, 0.12, 'cup', 'white', False)], out=(2000, 1000), bg='plaster', bgc=(214, 204, 190)),
    # Products: main and alternate view.
    'p-plate-white': lambda: top_single(21, 'plate', 'white'),
    'p-plate-white-b': lambda: flat_lay(22, [(0.5, 0.5, 0.36, 'plate', 'white', False), (0.5, 0.5, 0.18, 'bowl', 'white', False)], out=(1200, 1200)),
    'p-plate-turq': lambda: top_single(23, 'plate', 'turquoise', bgc=(222, 214, 200)),
    'p-plate-turq-b': lambda: side_single(24, bowl_profile, 'turquoise', height=0.12, R=0.34, clay_band=0.18),
    'p-bowl-oat': lambda: top_single(25, 'bowl', 'oat'),
    'p-bowl-oat-b': lambda: side_single(26, bowl_profile, 'oat', height=0.34, R=0.25),
    'p-bowl-honey': lambda: top_single(27, 'bowl', 'honey', scale=0.4, bgc=(222, 216, 204)),
    'p-bowl-honey-b': lambda: side_single(28, bowl_profile, 'honey', height=0.36, R=0.3, bgc=(226, 218, 206)),
    'p-cup-night': lambda: top_single(29, 'cup', 'night', scale=0.28, handle=True),
    'p-cup-night-b': lambda: side_single(30, mug_profile, 'night', height=0.42, R=0.17, handle=True),
    'p-mug-clay': lambda: side_single(31, mug_profile, 'terracotta', height=0.46, R=0.18, clay_band=0.5, handle=True),
    'p-mug-clay-b': lambda: top_single(32, 'cup', 'terracotta', scale=0.28, handle=True, bgc=(216, 206, 190)),
    'p-vase-sage': lambda: side_single(33, vase_profile, 'sage', height=0.74, R=0.13, bgc=(230, 226, 216)),
    'p-vase-sage-b': lambda: side_single(34, vase_profile, 'sage', height=0.74, R=0.13, bgc=(214, 208, 196)),
    'p-jug-white': lambda: side_single(35, jug_profile, 'white', height=0.66, R=0.16, bgc=(222, 214, 202)),
    'p-jug-white-b': lambda: side_single(36, jug_profile, 'white', height=0.66, R=0.16, bgc=(206, 198, 186)),
    'p-platter': lambda: top_single(37, 'plate', 'night', scale=0.42, oval=0.62, bgc=(226, 220, 208)),
    'p-platter-b': lambda: flat_lay(38, [(0.5, 0.5, 0.4, 'plate', 'night', False)], out=(1200, 1200), bgc=(210, 200, 186)),
    'p-set': lambda: flat_lay(39, [(0.3, 0.32, 0.22, 'plate', 'sand', False), (0.7, 0.32, 0.22, 'plate', 'sand', False), (0.3, 0.32, 0.11, 'bowl', 'sand', False), (0.7, 0.32, 0.11, 'bowl', 'sand', False), (0.3, 0.76, 0.1, 'cup', 'sand', True), (0.66, 0.76, 0.1, 'cup', 'sand', True)], out=(1200, 1200)),
    'p-set-b': lambda: flat_lay(40, [(0.5, 0.5, 0.36, 'plate', 'sand', False), (0.5, 0.5, 0.18, 'bowl', 'sand', False)], out=(1200, 1200), bgc=(206, 196, 180)),
    # Categories and journal
    'cat-plates': lambda: top_single(51, 'plate', 'celadon', out=(800, 800)),
    'cat-bowls': lambda: top_single(52, 'bowl', 'sage', out=(800, 800)),
    'cat-cups': lambda: top_single(53, 'cup', 'oat', out=(800, 800), scale=0.3, handle=True),
    'cat-vases': lambda: side_single(54, vase_profile, 'terracotta', out=(800, 800), height=0.72, R=0.13),
    'journal-1': lambda: flat_lay(61, [(0.35, 0.5, 0.3, 'plate', 'turquoise', False), (0.75, 0.45, 0.16, 'bowl', 'white', False)], out=(1200, 800)),
    'journal-2': lambda: shelf(62, (1200, 800)),
    'journal-3': lambda: flat_lay(63, [(0.3, 0.45, 0.18, 'cup', 'night', True), (0.68, 0.55, 0.18, 'cup', 'oat', True)], out=(1200, 800), bg='plaster', bgc=(214, 206, 192)),
    'journal-4': lambda: side_single(64, bowl_profile, 'celadon', out=(1200, 800), height=0.4, R=0.22),
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
        path = os.path.join(out_dir, name + '.webp')
        im.save(path, 'WEBP', quality=82, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, kb, 'KB')
    print('total', total, 'KB')
