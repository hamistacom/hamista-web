"""
Interiors for the Sepidar clinic demo: reception, corridor, consulting room
and a waiting nook, in warm daylight.

    python3 tools/demo-images/scenes-clinic.py <out-dir> [name ...]

A small ray caster: a room shell (floor, ceiling, four walls with windows,
doors and a slatted oak wall) and axis-aligned boxes for furniture. Sunlight
comes in through the window wall, filtered by a tree outside, and is traced
back for each point so the window bars and the leaves fall across the floor
and walls. Sheer curtains, ambient occlusion in the corners, a satin floor
that reflects the windows, linear ceiling lights and a soft filmic grade.
Plain materials, no figures and no props pretending to be equipment.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = float(os.environ.get('HM_SS', 1.5))
INF = 1e9

# Material ids
FLOOR, CEIL, PLASTER, WINDOW, OAK, WHITE, SLAT, METAL, FABRIC, LAMP, DOOR, ART, BRASS, SAGE = range(14)


# --------------------------------------------------------------------------
# Noise in world space
# --------------------------------------------------------------------------

def _hash(ix, iy, seed):
    h = (ix.astype(np.int64) * 374761393 + iy.astype(np.int64) * 668265263 + seed * 1442695041) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFF).astype(np.float32) / 65535.0


def vnoise(x, y, seed=0):
    ix, iy = np.floor(x), np.floor(y)
    fx, fy = x - ix, y - iy
    fx, fy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b = _hash(ix, iy, seed), _hash(ix + 1, iy, seed)
    c, d = _hash(ix, iy + 1, seed), _hash(ix + 1, iy + 1, seed)
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy


def fbm(x, y, seed=0, octaves=4):
    v, a, tot = 0.0, 1.0, 0.0
    for o in range(octaves):
        v = v + vnoise(x * (2 ** o), y * (2 ** o), seed + o * 17) * a
        tot += a
        a *= 0.5
    return v / tot


def cellhash(x, y, seed=0):
    return _hash(np.floor(x), np.floor(y), seed)


# --------------------------------------------------------------------------
# Scene description
# --------------------------------------------------------------------------

class Room:
    def __init__(self, hw, hc, zf, zb):
        self.hw, self.hc, self.zf, self.zb = hw, hc, zf, zb
        self.boxes = []
        self.cyls = []
        self.windows = []        # left wall openings: (z0, z1, y0, y1)
        self.back_windows = []   # back wall openings: (x0, x1, y0, y1)
        self.mull = (1.6, 0.05, 2.35)  # mullion spacing, mullion half width, transom height
        self.slats = None        # back wall slat region (x0, x1)
        self.doors = []          # right wall doors: (z0, z1, height)
        self.lamps = []          # ceiling strips: (x0, x1, z0, z1)
        self.art = []            # (box index, image array)
        self.floor = 'terrazzo'
        self.tree = None
        self.tree_d = 2.2
        self.sun = np.array([-0.66, 0.5, 0.2])
        self.curtain = True

    def cyl(self, cx, cz, r, y0, y1, mat):
        self.cyls.append((cx, cz, r, y0, y1, mat))

    def mats(self):
        return np.array([b[2] for b in self.boxes] + [c[5] for c in self.cyls] or [PLASTER], np.int8)

    def box(self, x0, x1, y0, y1, z0, z1, mat):
        self.boxes.append((np.array([x0, y0, z0], np.float32), np.array([x1, y1, z1], np.float32), mat))
        return len(self.boxes) - 1

    # Is a point on the left wall inside a pane (not on a bar)?
    def pane(self, y, z):
        inside = np.zeros_like(y, bool)
        bars = np.zeros_like(y, bool)
        sp, half, tr = self.mull
        for z0, z1, y0, y1 in self.windows:
            m = (z > z0) & (z < z1) & (y > y0) & (y < y1)
            inside |= m
            n = max(1, round((z1 - z0) / sp))
            step = (z1 - z0) / n
            bar = (np.abs(((z - z0 + step / 2) % step) - step / 2) < half) | (np.abs(y - tr) < half * 0.8)
            bars |= m & bar
        return inside & ~bars, inside & bars

    def leaf(self, y, z):
        """Tree outside the window wall: leaf cover 0..1 on a plane parallel to it."""
        if self.tree is None:
            return np.zeros_like(y)
        img, (z0, z1, y0, y1) = self.tree
        h, w = img.shape
        u = (z - z0) / (z1 - z0) * (w - 1)
        v = (1 - (y - y0) / (y1 - y0)) * (h - 1)
        ok = (u >= 0) & (u < w - 1) & (v >= 0) & (v < h - 1)
        ui, vi = np.clip(u, 0, w - 2).astype(np.int32), np.clip(v, 0, h - 2).astype(np.int32)
        fu, fv = np.clip(u - ui, 0, 1), np.clip(v - vi, 0, 1)
        val = (img[vi, ui] * (1 - fu) + img[vi, ui + 1] * fu) * (1 - fv) + (img[vi + 1, ui] * (1 - fu) + img[vi + 1, ui + 1] * fu) * fv
        return np.where(ok, val, 0)


def make_tree(seed, w=900, h=700, density=1.0):
    """Leaf clusters and a few branches, as seen against the light."""
    rng = np.random.default_rng(seed)
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    for _ in range(int(6 * density)):
        bx, by = rng.uniform(0, w), rng.uniform(h * 0.05, h * 0.8)
        d.line([(bx, h), (bx + rng.uniform(-80, 80), by)], fill=200, width=int(rng.uniform(3, 7)))
        for _ in range(int(140 * density)):
            r = abs(rng.normal(0, 1)) * 90
            a = rng.uniform(0, 2 * math.pi)
            cx, cy = bx + math.cos(a) * r * 1.4, by + math.sin(a) * r
            lw, lh = rng.uniform(7, 15), rng.uniform(3, 6)
            ang = rng.uniform(0, math.pi)
            pts = []
            for k in range(10):
                t = k / 10 * 2 * math.pi
                x, y = math.cos(t) * lw, math.sin(t) * lh
                pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
            d.polygon(pts, fill=int(rng.uniform(200, 255)))
    im = im.filter(ImageFilter.GaussianBlur(1.6))
    return np.asarray(im, np.float32) / 255


# --------------------------------------------------------------------------
# Intersection
# --------------------------------------------------------------------------

def hit_boxes(room, o, d, tmax=None, any_hit=False):
    """Nearest box or upright cylinder: t, index, normal; or only whether anything is hit before tmax."""
    shape = d[0].shape
    best = np.full(shape, INF, np.float32) if tmax is None else tmax.copy()
    idx = np.full(shape, -1, np.int16)
    nx, ny, nz = (np.zeros(shape, np.float32) for _ in range(3))
    blocked = np.zeros(shape, bool)
    inv = [1.0 / np.where(np.abs(c) < 1e-6, 1e-6, c) for c in d]
    for k, (bmin, bmax, _) in enumerate(room.boxes):
        t1 = [(bmin[a] - o[a]) * inv[a] for a in range(3)]
        t2 = [(bmax[a] - o[a]) * inv[a] for a in range(3)]
        tn = [np.minimum(t1[a], t2[a]) for a in range(3)]
        tf = [np.maximum(t1[a], t2[a]) for a in range(3)]
        tmin = np.maximum(np.maximum(tn[0], tn[1]), tn[2])
        tfar = np.minimum(np.minimum(tf[0], tf[1]), tf[2])
        hit = (tfar >= tmin) & (tmin > 1e-3) & (tmin < best)
        if any_hit:
            blocked |= hit
            continue
        best = np.where(hit, tmin, best)
        idx = np.where(hit, k, idx)
        ax0, ax1 = tmin == tn[0], (tmin == tn[1]) & (tmin != tn[0])
        ax2 = ~ax0 & ~ax1
        nx = np.where(hit, np.where(ax0, -np.sign(d[0]), 0), nx)
        ny = np.where(hit, np.where(ax1, -np.sign(d[1]), 0), ny)
        nz = np.where(hit, np.where(ax2, -np.sign(d[2]), 0), nz)
    nb = len(room.boxes)
    for k, (cx, cz, r, y0, y1, _) in enumerate(room.cyls):
        ox, oz = o[0] - cx, o[2] - cz
        a = d[0] * d[0] + d[2] * d[2]
        b = 2 * (ox * d[0] + oz * d[2])
        c = ox * ox + oz * oz - r * r
        disc = b * b - 4 * a * c
        sq = np.sqrt(np.maximum(disc, 0))
        ts = (-b - sq) / np.maximum(2 * a, 1e-9)
        ys = o[1] + d[1] * ts
        side = (disc >= 0) & (ts > 1e-3) & (ys >= y0) & (ys <= y1)
        tc_top = np.where(d[1] < -1e-6, (y1 - o[1]) * inv[1], INF)
        tc_bot = np.where(d[1] > 1e-6, (y0 - o[1]) * inv[1], INF)
        def in_disc(tc):
            xx, zz = ox + d[0] * tc, oz + d[2] * tc
            return (xx * xx + zz * zz <= r * r) & (tc > 1e-3)
        top, bot = in_disc(tc_top), in_disc(tc_bot)
        t_c = np.where(side, ts, INF)
        t_c = np.where(top & (tc_top < t_c), tc_top, t_c)
        t_c = np.where(bot & (tc_bot < t_c), tc_bot, t_c)
        hit = (t_c < best) & (t_c < INF)
        if any_hit:
            blocked |= hit
            continue
        best = np.where(hit, t_c, best)
        idx = np.where(hit, nb + k, idx)
        is_side = side & (t_c == ts)
        hx, hz = ox + d[0] * t_c, oz + d[2] * t_c
        nx = np.where(hit, np.where(is_side, hx / r, 0), nx)
        nz = np.where(hit, np.where(is_side, hz / r, 0), nz)
        ny = np.where(hit, np.where(is_side, 0, np.where(t_c == tc_top, 1.0, -1.0)), ny)
    if any_hit:
        return blocked
    return best, idx, (nx, ny, nz)


def trace(room, o, d):
    """Nearest hit: t, material, normal (nx, ny, nz), point, box index."""
    hw, hc = room.hw, room.hc
    dx, dy, dz = d
    ox, oy, oz = o
    t_floor = np.where(dy < -1e-6, (0 - oy) / np.minimum(dy, -1e-6), INF)
    t_ceil = np.where(dy > 1e-6, (hc - oy) / np.maximum(dy, 1e-6), INF)
    t_left = np.where(dx < -1e-6, (-hw - ox) / np.minimum(dx, -1e-6), INF)
    t_right = np.where(dx > 1e-6, (hw - ox) / np.maximum(dx, 1e-6), INF)
    t_back = np.where(dz > 1e-6, (room.zb - oz) / np.maximum(dz, 1e-6), INF)
    t_front = np.where(dz < -1e-6, (room.zf - oz) / np.minimum(dz, -1e-6), INF)
    t = np.minimum.reduce([t_floor, t_ceil, t_left, t_right, t_back, t_front]).astype(np.float32)
    plane = np.select([t == t_floor, t == t_ceil, t == t_left, t == t_right, t == t_back], [0, 1, 2, 3, 4], 5)
    tb, bi, bn = hit_boxes(room, o, d, t)
    isbox = bi >= 0
    t = np.where(isbox, tb, t)
    X, Y, Z = ox + dx * t, oy + dy * t, oz + dz * t
    nx = np.select([plane == 2, plane == 3], [1.0, -1.0], 0.0).astype(np.float32)
    ny = np.select([plane == 0, plane == 1], [1.0, -1.0], 0.0).astype(np.float32)
    nz = np.select([plane == 4, plane == 5], [-1.0, 1.0], 0.0).astype(np.float32)
    nx, ny, nz = np.where(isbox, bn[0], nx), np.where(isbox, bn[1], ny), np.where(isbox, bn[2], nz)
    # Materials from regions.
    mat = np.full(t.shape, PLASTER, np.int8)
    mat = np.where(plane == 0, FLOOR, mat)
    mat = np.where(plane == 1, CEIL, mat)
    for x0, x1, z0, z1 in room.lamps:
        mat = np.where((plane == 1) & (X > x0) & (X < x1) & (Z > z0) & (Z < z1), LAMP, mat)
    glass, bars = room.pane(Y, Z)
    mat = np.where((plane == 2) & glass, WINDOW, mat)
    mat = np.where((plane == 2) & bars, WHITE, mat)
    for x0, x1, y0, y1 in room.back_windows:
        m = (plane == 4) & (X > x0) & (X < x1) & (Y > y0) & (Y < y1)
        mat = np.where(m, WINDOW, mat)
    if room.slats:
        x0, x1 = room.slats
        mat = np.where((plane == 4) & (X > x0) & (X < x1), SLAT, mat)
    for z0, z1, hgt in room.doors:
        mat = np.where((plane == 3) & (Z > z0) & (Z < z1) & (Y < hgt), DOOR, mat)
    mat = np.where(isbox, room.mats()[np.clip(bi, 0, None)], mat)
    return t, mat, (nx, ny, nz), (X, Y, Z), bi, plane


# --------------------------------------------------------------------------
# Lighting
# --------------------------------------------------------------------------

def sunlit(room, P, n, jitter=((0, 0, 0),)):
    X, Y, Z = P
    acc = np.zeros(X.shape, np.float32)
    for j in jitter:
        L = room.sun + np.array(j)
        L = L / np.linalg.norm(L)
        facing = (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) > 0
        tw = (-room.hw - X) / L[0]
        yw, zw = Y + L[1] * tw, Z + L[2] * tw
        glass, _ = room.pane(yw, zw)
        lit = glass & facing & (tw > 0)
        if room.tree is not None:
            tt = (-room.hw - room.tree_d - X) / L[0]
            lit = lit * (1 - 0.88 * room.leaf(Y + L[1] * tt, Z + L[2] * tt))
        else:
            lit = lit.astype(np.float32)
        o = (X + n[0] * 2e-3, Y + n[1] * 2e-3, Z + n[2] * 2e-3)
        dd = (np.full(X.shape, L[0], np.float32), np.full(X.shape, L[1], np.float32), np.full(X.shape, L[2], np.float32))
        blocked = hit_boxes(room, o, dd, np.where(tw > 0, tw, INF).astype(np.float32), any_hit=True)
        acc += lit * (~blocked)
    return acc / len(jitter)


def occlusion(room, P, n, plane, bi):
    """Darken corners and the floor around furniture."""
    X, Y, Z = P
    hw, hc = room.hw, room.hc
    ao = np.ones(X.shape, np.float32)
    dists = [Y, hc - Y, X + hw, hw - X, room.zb - Z]
    for k, dist in enumerate(dists):
        r = 0.35 if k else 0.22
        own = (plane == k) & (bi < 0)
        ao *= np.where(own, 1, 1 - 0.32 * np.exp(-np.maximum(dist, 0) / r))
    for bmin, bmax, _ in room.boxes:
        if bmin[1] > 0.05:
            continue
        ddx = np.maximum(np.maximum(bmin[0] - X, X - bmax[0]), 0)
        ddz = np.maximum(np.maximum(bmin[2] - Z, Z - bmax[2]), 0)
        dd = np.sqrt(ddx ** 2 + ddz ** 2) + np.maximum(Y - 0.0, 0) * 0.6
        h = min(1.0, (bmax[1] - bmin[1]) / 0.8)
        ao *= 1 - 0.45 * h * np.exp(-dd / 0.16) * (Y < bmax[1])
    for cx, cz, r, y0, y1, _ in room.cyls:
        if y0 > 0.05:
            continue
        dd = np.maximum(np.sqrt((X - cx) ** 2 + (Z - cz) ** 2) - r, 0) + np.maximum(Y, 0) * 0.6
        h = min(1.0, (y1 - y0) / 0.8)
        ao *= 1 - 0.45 * h * np.exp(-dd / 0.14) * (Y < y1)
    return ao


# --------------------------------------------------------------------------
# Materials
# --------------------------------------------------------------------------

def albedo(room, mat, P, n, seed):
    X, Y, Z = P
    a = np.zeros(X.shape + (3,), np.float32)

    def put(m, rgb):
        nonlocal a
        a = np.where((mat == m)[..., None], rgb, a)

    # Plaster: warm white with a slow trowelled mottle.
    u = np.where(np.abs(n[0]) > 0.5, Z, X)
    pl = 0.975 + 0.035 * fbm(u * 3, Y * 3, seed + 1, 3) + 0.012 * vnoise(u * 40, Y * 40, seed + 2)
    put(PLASTER, np.array([240, 236, 229], np.float32) * pl[..., None])
    put(CEIL, np.array([242, 240, 235], np.float32) * (0.99 + 0.01 * pl[..., None]))
    # Floor.
    if room.floor == 'oak':
        w = 0.19
        pid = np.floor(X / w)
        seg = np.floor((Z + _hash(pid, pid * 0 + 3, seed) * 3) / 2.6)
        tone = 0.9 + 0.14 * _hash(pid, seg, seed + 5)
        grain = 0.94 + 0.08 * fbm(X * 90, Z * 2.2, seed + 7, 3)
        gap = ((X / w) % 1 < 0.02) | (((Z + _hash(pid, pid * 0 + 3, seed) * 3) / 2.6) % 1 < 0.002)
        oak = np.array([200, 176, 144], np.float32) * (tone * grain)[..., None]
        oak = np.where(gap[..., None], oak * 0.55, oak)
        put(FLOOR, oak)
    else:
        base = np.array([226, 221, 212], np.float32) * (0.97 + 0.05 * fbm(X * 1.5, Z * 1.5, seed + 9, 3))[..., None]
        chips = vnoise(X * 90, Z * 90, seed + 11)
        kind = cellhash(X * 90, Z * 90, seed + 13)
        chip_c = np.where((kind < 0.45)[..., None], np.array([196, 192, 186], np.float32),
                          np.where((kind < 0.85)[..., None], np.array([212, 198, 176], np.float32), np.array([150, 146, 140], np.float32)))
        mix = np.clip((chips - 0.8) * 10, 0, 1)[..., None]
        joint = ((X % 1.2) < 0.006) | ((Z % 1.2) < 0.006)
        terr = base * (1 - mix) + chip_c * mix
        terr = np.where(joint[..., None], terr * 0.8, terr)
        put(FLOOR, terr)
    # Oak furniture and doors: grain along the long side.
    along = np.where(np.abs(n[1]) > 0.5, Z, Y)
    across = np.where(np.abs(n[0]) > 0.5, Z, X)
    og = 0.93 + 0.1 * fbm(across * 70, along * 3, seed + 15, 3)
    put(OAK, np.array([198, 160, 116], np.float32) * og[..., None])
    put(DOOR, np.array([190, 152, 110], np.float32) * (0.93 + 0.1 * fbm(Z * 70, Y * 2.5, seed + 17, 3))[..., None])
    put(WHITE, np.array([238, 238, 234], np.float32))
    put(METAL, np.array([64, 64, 66], np.float32))
    put(BRASS, np.array([176, 146, 92], np.float32))
    put(SAGE, np.array([150, 164, 148], np.float32) * (0.96 + 0.06 * vnoise(across * 90, along * 90, seed + 19))[..., None])
    put(FABRIC, np.array([170, 168, 158], np.float32) * (0.95 + 0.08 * vnoise(across * 120, along * 120, seed + 21))[..., None])
    # Slatted oak wall: lit slats, dark grooves.
    if room.slats:
        s = (X % 0.07) / 0.07
        groove = s > 0.68
        sl = np.array([194, 154, 110], np.float32) * (0.92 + 0.1 * fbm(X * 6 + np.floor(X / 0.07) * 3.1, Y * 2.5, seed + 23, 3))[..., None]
        sl = sl * (0.94 + 0.06 * np.cos((s - 0.34) * math.pi / 0.68))[..., None]
        put(SLAT, np.where(groove[..., None], np.array([70, 52, 38], np.float32), sl))
    # Framed art: a soft-ground print inside a pale frame.
    for k, img in room.art:
        bmin, bmax, _ = room.boxes[k]
        if abs(bmax[0] - bmin[0]) < abs(bmax[2] - bmin[2]):
            uu = (Z - bmin[2]) / (bmax[2] - bmin[2])
            uu = np.where(n[0] < 0, 1 - uu, uu)
        else:
            uu = (X - bmin[0]) / (bmax[0] - bmin[0])
        vv = 1 - (Y - bmin[1]) / (bmax[1] - bmin[1])
        h, w = img.shape[:2]
        sample = img[np.clip((vv * (h - 1)).astype(int), 0, h - 1), np.clip((uu * (w - 1)).astype(int), 0, w - 1)]
        put(ART, sample.astype(np.float32))
    return a


def art_print(seed, w=600, h=760, kind='field'):
    """Quiet artworks: a soft field with a horizon, or a botanical line drawing."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    frame = 28
    img = np.zeros((h, w, 3), np.float32) + np.array([236, 233, 226], np.float32)
    inner = (xx > frame) & (xx < w - frame) & (yy > frame) & (yy < h - frame)
    if kind == 'field':
        t = yy / h
        sky = np.array([214, 206, 190]) * (1 - t[..., None]) + np.array([196, 176, 150]) * t[..., None]
        hz = h * rng.uniform(0.55, 0.66)
        ground = np.array([156, 148, 128], np.float32) + 10 * np.sin(xx / 60)[..., None]
        art = np.where((yy > hz + 14 * np.sin(xx / 90 + 1))[..., None], ground, sky)
        sun = np.exp(-(((xx - w * 0.62) ** 2 + (yy - hz * 0.62) ** 2) / (2 * 48 ** 2)))
        art = art + sun[..., None] * np.array([30, 22, 10])
    else:
        art = np.zeros((h, w, 3), np.float32) + np.array([232, 228, 218], np.float32)
        im = Image.new('L', (w, h), 0)
        d = ImageDraw.Draw(im)
        cx = w / 2
        d.line([(cx, h * 0.9), (cx + 10, h * 0.2)], fill=255, width=3)
        for k in range(9):
            y = h * (0.82 - k * 0.07)
            for s in (-1, 1):
                ln = 70 + 30 * math.sin(k)
                d.ellipse([cx + s * 6 - (ln if s < 0 else 0), y - 16, cx + s * 6 + (ln if s > 0 else 0), y + 16], outline=255, width=2)
        m = np.asarray(im, np.float32)[..., None] / 255
        art = art * (1 - m * 0.65)
    img = np.where(inner[..., None], art, img)
    return np.clip(img, 0, 255)


# --------------------------------------------------------------------------
# Render
# --------------------------------------------------------------------------

def render(room, out, cam, yaw=0.0, fov=1.0, shift=0.52, seed=1, exposure=1.0, sun_k=1.0, warm=1.0, refl=0.12):
    W, H = int(out[0] * SS), int(out[1] * SS)
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    aspect = W / H
    px = (xs / W - 0.5) * 2 * math.tan(fov / 2) * aspect
    py = -(ys / H - shift) * 2 * math.tan(fov / 2)
    cyw, syw = math.cos(yaw), math.sin(yaw)
    dx, dy, dz = syw + px * cyw, py, cyw - px * syw
    norm = np.sqrt(dx * dx + dy * dy + dz * dz)
    d = (dx / norm, dy / norm, dz / norm)
    o = tuple(np.full((H, W), c, np.float32) for c in cam)
    t, mat, n, P, bi, plane = trace(room, o, d)
    rgb = shade(room, mat, P, n, plane, bi, seed, sun_k, warm)
    # Satin floor: one reflected bounce, softened.
    fl = (mat == FLOOR)
    if refl > 0 and fl.any():
        rd = (d[0], -d[1], d[2])
        ro = (P[0], np.full_like(P[1], 1e-3), P[2])
        _, m2, n2, P2, b2, pl2 = trace(room, ro, rd)
        r_rgb = shade(room, m2, P2, n2, pl2, b2, seed, sun_k, warm, simple=True)
        fres = refl * (0.35 + 0.65 * (1 - np.abs(d[1])) ** 4)
        r_img = Image.fromarray(np.clip(r_rgb, 0, 255).astype(np.uint8))
        r_img = r_img.filter(ImageFilter.GaussianBlur(2.2 * SS)).resize((W, max(1, H // 6))).resize((W, H), Image.BILINEAR)
        r_rgb = np.asarray(r_img, np.float32)
        rgb = np.where(fl[..., None], rgb * (1 - fres[..., None] * 0.5) + r_rgb * fres[..., None], rgb)
    # Bloom on windows and lamps.
    bright = np.clip(rgb - 235, 0, None)
    bl = np.asarray(Image.fromarray(np.clip(bright * 3, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(16 * SS)), np.float32)
    rgb = rgb + bl * 0.35
    rgb = rgb * exposure
    # Filmic shoulder, then a gentle warm grade.
    E = 1.35
    rgb = 255 * (1 - np.exp(-rgb / 255 * E)) / (1 - math.exp(-E))
    lum = rgb.mean(axis=2, keepdims=True) / 255
    rgb = rgb + (1 - lum) * np.array([-1.5, 0, 3]) + lum * np.array([2, 0.5, -2.5]) * warm
    vg = np.sqrt(((xs - W / 2) / (W / 2)) ** 2 + ((ys - H / 2) / (H / 2)) ** 2)
    rgb *= (1 - 0.16 * np.clip(vg - 0.6, 0, 1) ** 1.4)[..., None]
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)
    rng = np.random.default_rng(seed)
    arr = np.asarray(im, np.float32) + rng.normal(0, 1.3, (out[1], out[0]))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def shade(room, mat, P, n, plane, bi, seed, sun_k, warm, simple=False):
    X, Y, Z = P
    alb = albedo(room, mat, P, n, seed) / 255
    sky = np.array([226, 227, 226], np.float32)
    sunc = np.array([255, 232, 198], np.float32) * (1 + 0.04 * (warm - 1))
    # Ambient from the window wall, stronger near it and on surfaces facing it.
    near = np.clip(1 - (X + room.hw) / (2 * room.hw + 1e-3), 0, 1) ** 0.8
    facing = 0.6 + 0.4 * np.clip(-n[0], 0, 1) + 0.15 * np.clip(n[1], 0, 1) - 0.1 * np.clip(-n[1], 0, 1)
    amb = (0.66 + 0.42 * near) * facing
    if not simple:
        amb = amb * occlusion(room, P, n, plane, bi)
    jit = ((0, 0, 0),) if simple else ((0, 0, 0), (0.025, 0.02, 0.02), (-0.02, -0.02, 0.025))
    lit = sunlit(room, P, n, jit)
    if not simple:
        lit = np.asarray(Image.fromarray((np.clip(lit, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.3 * SS)), np.float32) / 255
    L = room.sun / np.linalg.norm(room.sun)
    ndl = np.clip(n[0] * L[0] + n[1] * L[1] + n[2] * L[2], 0, 1)
    sun = lit * ndl * 0.92 * sun_k
    # A little bounce from the sunlit floor lifts the ceiling and walls.
    bounce = 0.12 * sun_k * (1 - 0.6 * np.clip(n[1], 0, 1))
    warmfill = np.array([255, 242, 226], np.float32)
    rgb = alb * (sky * amb[..., None] + warmfill * bounce[..., None] + sunc * sun[..., None])
    # Emitters.
    curtain = np.array([250, 249, 244], np.float32)
    if room.curtain:
        fold = 0.93 + 0.07 * np.sin(Z * 2 * math.pi / 0.13 + 2 * fbm(Z * 2, Y * 0.5, seed + 31, 2))
        shadow = 1 - 0.22 * room.leaf(Y + 0 * Z, Z) if room.tree is not None else 1
        win = curtain * (fold * shadow)[..., None] * 1.06
    else:
        win = np.array([232, 238, 242], np.float32) * (1.1 - 0.1 * Y[..., None] / room.hc)
    rgb = np.where((mat == WINDOW)[..., None], win, rgb)
    rgb = np.where((mat == LAMP)[..., None], np.array([300, 296, 286], np.float32), rgb)
    return rgb


# --------------------------------------------------------------------------
# Rooms
# --------------------------------------------------------------------------

def pendant(r, x, z, drop=2.2, rad=0.17, h=0.2, hc=3.2):
    r.cyl(x, z, 0.006, drop + h, hc, METAL)
    r.cyl(x, z, rad, drop, drop + h, BRASS)
    r.cyl(x, z, rad - 0.015, drop - 0.005, drop + 0.002, LAMP)


def sofa(r, x0, x1, z0, z1, back='+x'):
    """A low sofa against a wall: base, seat, back cushion and two arms."""
    r.box(x0, x1, 0.06, 0.4, z0, z1, FABRIC)
    r.box(x0 + 0.03, x1 - 0.03, 0.0, 0.06, z0 + 0.03, z1 - 0.03, METAL)
    if back == '+x':
        r.box(x1 - 0.24, x1, 0.4, 0.82, z0, z1, FABRIC)
        r.box(x0, x1 - 0.24, 0.4, 0.47, z0 + 0.14, z1 - 0.14, FABRIC)
    r.box(x0, x1, 0.4, 0.6, z0, z0 + 0.14, FABRIC)
    r.box(x0, x1, 0.4, 0.6, z1 - 0.14, z1, FABRIC)


def reception(seed=1, out=(2000, 1100), cam=(-0.7, 1.38, 0.2), yaw=0.15, fov=1.02, shift=0.5):
    r = Room(hw=4.6, hc=3.2, zf=-6, zb=7.8)
    r.windows = [(-1.0, 7.3, 0.25, 2.92)]
    r.mull = (1.55, 0.04, 2.4)
    r.slats = (-2.0, 3.2)
    r.lamps = [(-3.2, -3.15, -1, 7.2)]
    r.tree = (make_tree(seed + 40, density=1.6), (-4, 12, 0.6, 7.5))
    r.sun = np.array([-0.62, 0.48, 0.34])
    # Reception counter: white body, oak top, a lower section for wheelchairs.
    r.box(-1.3, 2.0, 0.08, 1.05, 5.8, 6.45, WHITE)
    r.box(-1.25, 1.95, 0.0, 0.08, 5.88, 6.4, METAL)
    r.box(-1.38, 2.08, 1.05, 1.09, 5.74, 6.51, OAK)
    r.box(2.0, 2.85, 0.0, 0.74, 5.8, 6.45, WHITE)
    r.box(2.0, 2.91, 0.74, 0.77, 5.74, 6.51, OAK)
    r.cyl(-0.95, 6.15, 0.065, 1.09, 1.36, SAGE)
    for x in (-0.55, 0.35, 1.25):
        pendant(r, x, 6.1, 1.95, 0.16, 0.19, r.hc)
    # Lounge: a sofa on the right wall, a round table and a tall vase.
    sofa(r, 3.7, 4.6, 2.9, 5.2)
    r.cyl(2.95, 4.05, 0.42, 0.36, 0.4, OAK)
    r.cyl(2.95, 4.05, 0.06, 0.0, 0.36, METAL)
    r.cyl(4.25, 5.55, 0.19, 0.0, 0.74, WHITE)
    k = r.box(4.57, 4.6, 1.25, 2.15, 3.55, 4.55, ART)
    r.art.append((k, art_print(seed + 50, 600, 540, 'field')))
    im = render(r, out, cam, yaw, fov, shift, seed, exposure=1.06, refl=0.13)
    im = sign(im, out, cam, yaw, fov, shift, (0.6, 2.8, r.zb - 0.02), 0.3)
    return im, r, cam, yaw, fov


def project(out, cam, yaw, fov, shift, P):
    W, H = out
    f = np.array([math.sin(yaw), 0, math.cos(yaw)])
    rt = np.array([math.cos(yaw), 0, -math.sin(yaw)])
    v = np.array(P, float) - np.array(cam, float)
    zc, xc, yc = v @ f, v @ rt, v[1]
    k = 2 * math.tan(fov / 2)
    return ((xc / zc) / (k * W / H) + 0.5) * W, (shift - (yc / zc) / k) * H


def _coeffs(dst, src):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def sign(im, out, cam, yaw, fov, shift, centre, height):
    """Brass letters on the back wall: the clinic's mark, standing a little off the slats."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../wp/hamista-core/demos/clinic/images/logo-dark.webp')
    if not os.path.exists(path):
        return im
    logo = Image.open(path).convert('RGBA')
    a = np.asarray(logo, np.float32)[..., 3] / 255
    lw, lh = logo.size
    width = height * lw / lh
    cx, cy, cz = centre
    corners = [(cx - width / 2, cy + height / 2, cz), (cx + width / 2, cy + height / 2, cz), (cx + width / 2, cy - height / 2, cz), (cx - width / 2, cy - height / 2, cz)]
    dst = [project(out, cam, yaw, fov, shift, p) for p in corners]
    src = [(0, 0), (lw, 0), (lw, lh), (0, lh)]
    co = _coeffs(dst, src)
    alpha = Image.fromarray((a * 255).astype(np.uint8)).transform(out, Image.PERSPECTIVE, co, Image.BICUBIC)
    al = np.asarray(alpha, np.float32) / 255
    base = np.asarray(im, np.float32)
    # Soft shadow down and to the right, then the brass face with a gentle sheen.
    sh = np.asarray(alpha.filter(ImageFilter.GaussianBlur(3)).transform(out, Image.AFFINE, (1, 0, -3, 0, 1, -4)), np.float32) / 255
    base = base * (1 - 0.35 * sh[..., None])
    yy = np.mgrid[0:out[1], 0:out[0]][0].astype(np.float32)
    top = min(p[1] for p in dst)
    g = np.clip((yy - top) / max(1, (max(p[1] for p in dst) - top)), 0, 1)
    brass = np.array([196, 166, 110], np.float32) * (1.08 - 0.22 * g)[..., None]
    base = base * (1 - al[..., None]) + brass * al[..., None]
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))


def reception_detail(seed=6, out=(1600, 1000)):
    im, r, *_ = reception(seed, out, cam=(2.1, 1.3, 3.2), yaw=-0.42, fov=0.95)
    return im


def corridor(seed=2, out=(1600, 1000), cam=(0.25, 1.5, -1.0), yaw=0.0, fov=0.95):
    r = Room(hw=1.35, hc=2.9, zf=-3, zb=32.0)
    r.windows = [(1.0 + 4 * i, 3.6 + 4 * i, 0.2, 2.6) for i in range(7)]
    r.mull = (1.3, 0.035, 2.2)
    r.doors = [(2.2 + 4 * i, 3.25 + 4 * i, 2.25) for i in range(7)]
    r.back_windows = [(-0.9, 0.9, 0.3, 2.5)]
    r.lamps = [(-0.05, 0.05, -2, 31)]
    r.tree = (make_tree(seed + 40, 1400, 600, density=1.4), (-2, 34, 0.3, 6.0))
    r.sun = np.array([-0.7, 0.55, 0.26])
    for i in range(7):
        z0 = 2.2 + 4 * i
        r.box(1.3, 1.35, 0.0, 2.32, z0 - 0.06, z0, WHITE)
        r.box(1.3, 1.35, 0.0, 2.32, z0 + 1.05, z0 + 1.11, WHITE)
        r.box(1.3, 1.35, 2.25, 2.32, z0 - 0.06, z0 + 1.11, WHITE)
        r.box(1.26, 1.33, 1.0, 1.03, z0 + 0.85, z0 + 0.98, METAL)
        r.box(1.33, 1.35, 1.55, 1.7, z0 + 1.25, z0 + 1.4, BRASS)
    # Oak handrail along the right wall.
    r.box(1.27, 1.35, 0.88, 0.93, -3, 31, OAK)
    return render(r, out, cam, yaw, fov, 0.5, seed, exposure=1.02, refl=0.16), r, cam, yaw, fov


def consult(seed=3, out=(1600, 1000), cam=(-1.25, 1.35, -1.5), yaw=0.3, fov=1.02):
    r = Room(hw=2.5, hc=3.0, zf=-4, zb=4.2)
    r.windows = [(-0.6, 3.8, 0.75, 2.75)]
    r.mull = (1.1, 0.035, 2.25)
    r.floor = 'oak'
    r.tree = (make_tree(seed + 40, density=1.3), (-4, 8, 0.8, 6.5))
    r.sun = np.array([-0.6, 0.5, 0.18])
    # Desk: oak top on two white panels, a pendant above.
    r.box(-0.2, 1.5, 0.72, 0.755, 1.7, 2.5, OAK)
    r.box(-0.15, -0.1, 0.0, 0.72, 1.75, 2.45, WHITE)
    r.box(1.4, 1.45, 0.0, 0.72, 1.75, 2.45, WHITE)
    pendant(r, 0.65, 2.1, 1.75, 0.2, 0.18, r.hc)
    r.cyl(1.25, 2.25, 0.05, 0.755, 0.95, WHITE)
    # Two visitor chairs: fabric seat, oak back, slim legs.
    for cx in (0.05, 0.85):
        r.box(cx, cx + 0.46, 0.43, 0.49, 0.95, 1.38, FABRIC)
        r.box(cx + 0.02, cx + 0.44, 0.55, 0.84, 0.9, 0.94, OAK)
        for lx in (cx + 0.04, cx + 0.42):
            for lz in (0.97, 1.35):
                r.cyl(lx, lz, 0.014, 0.0, 0.43, OAK)
            r.cyl(lx, 0.92, 0.012, 0.43, 0.6, OAK)
    # Doctor's chair behind the desk.
    r.box(0.42, 0.9, 0.44, 0.5, 2.78, 3.2, FABRIC)
    r.box(0.44, 0.88, 0.56, 1.0, 3.2, 3.25, FABRIC)
    r.cyl(0.66, 2.99, 0.025, 0.0, 0.44, METAL)
    r.cyl(0.66, 2.99, 0.24, 0.0, 0.02, METAL)
    # Shelf with two vessels and a print on the back wall.
    r.box(-1.7, -0.1, 1.45, 1.48, 3.98, 4.2, OAK)
    r.cyl(-1.35, 4.08, 0.07, 1.48, 1.78, WHITE)
    r.cyl(-1.1, 4.08, 0.05, 1.48, 1.66, SAGE)
    k = r.box(0.55, 1.55, 1.3, 2.5, 4.17, 4.2, ART)
    r.art.append((k, art_print(seed + 50, 620, 740, 'leaf')))
    # Tall vase by the window.
    r.cyl(-2.05, 0.2, 0.2, 0.0, 0.85, WHITE)
    return render(r, out, cam, yaw, fov, 0.45, seed, exposure=1.0, refl=0.06), r, cam, yaw, fov


def nook(seed=4, out=(1200, 1500), cam=(1.1, 1.3, -1.6), yaw=-0.55, fov=1.0):
    r = Room(hw=2.0, hc=3.0, zf=-4, zb=4.5)
    r.windows = [(0.2, 3.4, 0.55, 2.7)]
    r.mull = (1.05, 0.03, 2.2)
    r.tree = (make_tree(seed + 40, density=1.2), (-4, 9, 0.4, 6.5))
    r.sun = np.array([-0.58, 0.46, 0.4])
    r.box(-2.0, -1.45, 0.0, 0.42, 0.3, 3.3, OAK)
    r.box(-2.0, -1.45, 0.42, 0.5, 0.35, 3.25, SAGE)
    r.cyl(-1.05, 3.75, 0.24, 0.42, 0.46, OAK)
    r.cyl(-1.05, 3.75, 0.04, 0.0, 0.42, OAK)
    r.cyl(-1.0, 3.7, 0.06, 0.46, 0.68, WHITE)
    k = r.box(-0.4, 0.8, 1.2, 2.45, 4.47, 4.5, ART)
    r.art.append((k, art_print(seed + 50, 600, 760, 'field')))
    return render(r, out, cam, yaw, fov, 0.5, seed, exposure=1.02, refl=0.1), r, cam, yaw, fov


def wall_light(seed=5, out=(1600, 1000), cam=(0.2, 1.25, 0.9), yaw=0.0, fov=0.78, floor='terrazzo'):
    """A plain plaster wall and floor with sun and leaves falling across them."""
    r = Room(hw=2.4, hc=3.0, zf=-4, zb=4.0)
    r.windows = [(-4.0, 3.9, 0.1, 2.9)]
    r.mull = (1.3, 0.03, 2.3)
    r.floor = floor
    r.tree = (make_tree(seed + 40, density=1.8), (-10, 6, 0.0, 7))
    r.sun = np.array([-0.62, 0.4, -0.52])
    r.box(-0.9, 1.4, 0.0, 0.42, 3.45, 4.0, OAK)
    r.box(-0.85, 1.35, 0.42, 0.48, 3.5, 4.0, SAGE)
    return render(r, out, cam, yaw, fov, 0.56, seed, exposure=1.04, refl=0.08), r, cam, yaw, fov


def wall_vase(seed=7, out=(1200, 1500)):
    r = Room(hw=2.4, hc=3.0, zf=-4, zb=4.0)
    r.windows = [(-4.0, 3.9, 0.1, 2.9)]
    r.mull = (1.3, 0.03, 2.3)
    r.tree = (make_tree(seed + 40, density=1.8), (-10, 6, 0.0, 7))
    r.sun = np.array([-0.6, 0.42, -0.5])
    r.cyl(0.55, 3.62, 0.2, 0.0, 0.62, WHITE)
    r.cyl(0.98, 3.72, 0.11, 0.0, 0.38, SAGE)
    return render(r, out, (0.35, 1.15, 0.2), 0.0, 0.8, 0.56, seed, exposure=1.04, refl=0.08)


def wall_stool(seed=8, out=(1600, 1000)):
    r = Room(hw=2.4, hc=3.0, zf=-4, zb=4.0)
    r.windows = [(-4.0, 3.9, 0.1, 2.9)]
    r.mull = (1.3, 0.03, 2.3)
    r.floor = 'oak'
    r.tree = (make_tree(seed + 40, density=1.6), (-10, 6, 0.0, 7))
    r.sun = np.array([-0.66, 0.44, -0.46])
    r.cyl(0.9, 3.55, 0.2, 0.43, 0.47, OAK)
    for a in range(3):
        ang = a * 2 * math.pi / 3 + 0.4
        r.cyl(0.9 + 0.14 * math.cos(ang), 3.55 + 0.14 * math.sin(ang), 0.018, 0.0, 0.43, OAK)
    r.cyl(0.9, 3.55, 0.06, 0.47, 0.72, WHITE)
    return render(r, out, (0.1, 1.2, 1.0), 0.0, 0.8, 0.58, seed, exposure=1.03, refl=0.05)


PLAN = {
    'reception': lambda: reception(1, (2000, 1100))[0],
    'reception-2': lambda: reception_detail(6, (1600, 1000)),
    'light-2': lambda: wall_vase(7, (1200, 1500)),
    'light-3': lambda: wall_stool(8, (1600, 1000)),
    'corridor': lambda: corridor(2, (1600, 1000))[0],
    'consult': lambda: consult(3, (1600, 1000))[0],
    'nook': lambda: nook(4, (1200, 1500))[0],
    'light': lambda: wall_light(5, (1600, 1000))[0],
}


if __name__ == '__main__':
    out_dir = sys.argv[1]
    only = set(sys.argv[2:])
    os.makedirs(out_dir, exist_ok=True)
    for name, make in PLAN.items():
        if only and name not in only:
            continue
        im = make()
        path = os.path.join(out_dir, name + '.webp')
        im.save(path, 'WEBP', quality=86, method=6)
        print(name, os.path.getsize(path) // 1024, 'KB', flush=True)
