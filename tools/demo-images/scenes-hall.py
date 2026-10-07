"""
A steel factory hall for the Hamoon demo, ray-cast so that perspective,
reflections and shafts of sunlight agree with each other.

    python3 tools/demo-images/scenes-hall.py <out-dir> [name ...]

The hall is a box: concrete floor, ribbed metal walls with tall windows on one
side, a row of steel columns each side and roof trusses. The sun comes in
through the windows; a few samples along each view ray decide how much lit
haze it passes through.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

SS = 2


def vnoise(h, w, scale, rng, octaves=3):
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for _ in range(octaves):
        gh, gw = max(2, int(h / scale) + 3), max(2, int(w / scale) + 3)
        g = rng.random((gh, gw)).astype(np.float32)
        acc += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC), np.float32)
        tot += amp
        amp *= 0.5
        scale = max(2, scale / 2)
    return acc / tot


def hash2(a, b):
    return (np.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1


def hall(seed=1, out=(2000, 1100), mood='day', cam_x=0.0, yaw=0.0, fov=1.1, width=36.0, height=13.0, bay=8.0):
    rng = np.random.default_rng(seed)
    W, H = out[0] * SS, out[1] * SS
    eye_y = 1.7
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    aspect = W / H
    px = (xs / W - 0.5) * 2 * math.tan(fov / 2) * aspect
    py = -(ys / H - 0.52) * 2 * math.tan(fov / 2)
    cy, sy = math.cos(yaw), math.sin(yaw)
    dx = px * cy + sy
    dz = -px * sy + cy
    dy = py
    half = width / 2
    INF = 1e9
    # Hit floor, ceiling and walls.
    t_floor = np.where(dy < -1e-4, -eye_y / np.minimum(dy, -1e-4), INF)
    t_ceil = np.where(dy > 1e-4, (height - eye_y) / np.maximum(dy, 1e-4), INF)
    t_left = np.where(dx < -1e-4, (-half - cam_x) / np.minimum(dx, -1e-4), INF)
    t_right = np.where(dx > 1e-4, (half - cam_x) / np.maximum(dx, 1e-4), INF)
    t_back = np.where(dz > 1e-4, 140 / np.maximum(dz, 1e-4), INF)
    t = np.minimum.reduce([t_floor, t_ceil, t_left, t_right, t_back])
    kind = np.select([t == t_floor, t == t_ceil, t == t_left, t == t_right], [0, 1, 2, 3], 4)
    # Columns: thin vertical strips on planes z = k * bay, one line each side.
    col_x = half - 3.0
    col_hit = np.full((H, W), INF, np.float32)
    col_side = np.zeros((H, W), np.float32)
    for k in range(1, 18):
        zk = k * bay
        tk = np.where(dz > 1e-4, zk / np.maximum(dz, 1e-4), INF)
        X = cam_x + dx * tk
        Y = eye_y + dy * tk
        for sgn in (-1, 1):
            m = (np.abs(X - sgn * col_x) < 0.28) & (Y > 0) & (Y < height - 0.6) & (tk < col_hit)
            col_hit = np.where(m, tk, col_hit)
            col_side = np.where(m, (X - sgn * col_x) / 0.28 * sgn, col_side)
        # Trusses: a beam across the hall and a few diagonals.
        beam = (np.abs(Y - (height - 1.6)) < 0.22) & (np.abs(X) < half) & (tk < col_hit)
        diag = ((np.abs(((X + half) % 4.0) - (height - Y - 1.6) * 1.6) < 0.09) | (np.abs(((X + half) % 4.0) - 4 + (height - Y - 1.6) * 1.6) < 0.09)) & (Y > height - 2.8) & (Y < height - 1.4) & (np.abs(X) < half) & (tk < col_hit)
        top = (np.abs(Y - (height - 0.25)) < 0.12) & (np.abs(X) < half) & (tk < col_hit)
        tr = beam | diag | top
        col_hit = np.where(tr, tk, col_hit)
        col_side = np.where(tr, 2.0, col_side)
    is_col = col_hit < t
    t = np.where(is_col, col_hit, t)
    X = cam_x + dx * t
    Y = eye_y + dy * t
    Z = dz * t
    # Sun: from the left wall's windows, low and warm (day) or none (night).
    if mood == 'day':
        sun = np.array([0.62, -0.42, 0.42])
        sky_c = np.array([226, 232, 236], np.float32)
        sun_c = np.array([255, 226, 180], np.float32)
        amb = np.array([118, 124, 130], np.float32)
        haze_c = np.array([200, 204, 206], np.float32)
    else:
        sun = None
        sky_c = np.array([40, 56, 84], np.float32)
        sun_c = np.array([0, 0, 0], np.float32)
        amb = np.array([70, 76, 86], np.float32)
        haze_c = np.array([96, 104, 116], np.float32)
    sun = None if sun is None else sun / np.linalg.norm(sun)

    def window_at(z, y):
        """Is a point on the left wall inside a window opening? Mullions break it up."""
        zz = z % bay
        inside = (zz > 1.2) & (zz < bay - 1.2) & (y > 2.4) & (y < height - 2.6)
        mull = (np.abs(((zz - 1.2) % 1.4) - 0.7) > 0.64) | (np.abs(((y - 2.4) % 2.0) - 1.0) > 0.95)
        return inside & ~mull

    def sunlit(Xp, Yp, Zp):
        if sun is None:
            return np.zeros_like(Xp)
        # Trace back towards the sun to the left wall (x = -half).
        s = (-half - Xp) / -sun[0] if sun[0] != 0 else np.full_like(Xp, INF)
        wy = Yp - sun[1] * s
        wz = Zp - sun[2] * s
        return window_at(wz, wy).astype(np.float32)

    rgb = np.zeros((H, W, 3), np.float32)
    n_tex = vnoise(H, W, 3 * SS, rng, 2)
    # Floor: polished concrete, perspective-correct mottling and joints.
    fl = kind == 0
    mott = np.sin(X * 0.9 + np.sin(Z * 0.35) * 2) * 0.5 + 0.5
    joints = ((np.abs((X % 6.0) - 3.0) > 2.97) | (np.abs((Z % 6.0) - 3.0) > 2.97)).astype(np.float32)
    conc = np.array([150, 150, 148], np.float32) * (0.9 + 0.06 * mott + 0.06 * (n_tex - 0.5))[..., None]
    conc *= (1 - 0.25 * joints)[..., None]
    lit = sunlit(X, Y, Z)
    lit = np.asarray(Image.fromarray((lit * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6 * SS)), np.float32) / 255
    floor_rgb = conc * (amb / 150 * 0.95 + lit[..., None] * (sun_c / 255) * 0.5)
    # Safety walkway lines in yellow.
    walk = (np.abs(np.abs(X) - 5.5) < 0.08)
    floor_rgb = np.where(walk[..., None], np.array([196, 160, 40], np.float32) * (0.75 + 0.5 * lit[..., None]), floor_rgb)
    # Glossy floor: reflections of the windows, streaked along the view.
    refl = np.zeros((H, W), np.float32)
    if True:
        # Mirror the ray about the floor and look up the left-wall window it would see.
        tl = np.where(dx < -1e-4, (-half - X) / np.minimum(dx, -1e-4), INF)
        ry = -dy * tl
        rz = Z + dz * tl
        refl = window_at(rz, ry).astype(np.float32) * (tl < 120)
        refl = np.asarray(Image.fromarray((refl * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5 * SS)).resize((W, H // 3)).resize((W, H)), np.float32) / 255
    floor_rgb = floor_rgb + refl[..., None] * sky_c * 0.2
    rgb = np.where(fl[..., None], floor_rgb, rgb)
    # Walls: ribbed metal cladding; windows on the left.
    for side, kk in ((-1, 2), (1, 3)):
        m = kind == kk
        rib = 0.86 + 0.14 * (np.sin(Z * 2 * math.pi / 0.6) > 0.3)
        wall = np.array([168, 172, 176], np.float32) * rib[..., None] * (0.92 + 0.08 * n_tex[..., None])
        shade = 0.55 if side < 0 else 0.85
        wrgb = wall * shade * (amb / 120)
        if side < 0:
            win = window_at(Z, Y)
            glow = sky_c * (1.05 if mood == 'day' else 0.9)
            wrgb = np.where(win[..., None], glow, wrgb)
        else:
            wl = sunlit(X, Y, Z)
            wrgb = wrgb + wl[..., None] * sun_c * 0.5
        rgb = np.where(m[..., None], wrgb, rgb)
    # Ceiling: dark deck with a skylight strip.
    m = kind == 1
    deck = np.array([88, 92, 96], np.float32) * (0.85 + 0.15 * (np.sin(X * 2 * math.pi / 0.9) > 0))[..., None]
    sky = (np.abs(X) < 2.4) & ((Z % bay) > 0.8) & ((Z % bay) < bay - 0.8)
    crgb = np.where(sky[..., None], sky_c * 1.05, deck * (amb / 110))
    rgb = np.where(m[..., None], crgb, rgb)
    # Far wall.
    m = kind == 4
    rgb = np.where(m[..., None], np.array([150, 156, 160], np.float32) * (amb / 120), rgb)
    # Columns and trusses: painted steel, lit on the window side.
    steel = np.array([70, 76, 82], np.float32)
    face = np.where(col_side >= 2, 0.9, 0.75 + 0.35 * np.clip(-col_side, 0, 1))
    col_lit = sunlit(X, Y, Z)
    crgb = steel[None, None, :] * face[..., None] * (amb / 120) + col_lit[..., None] * sun_c * 0.25
    rgb = np.where(is_col[..., None], crgb, rgb)
    # Night: lamps under the trusses.
    if mood != 'day':
        for k in range(1, 18):
            zk = k * bay - 0.3
            tk = np.where(dz > 1e-4, zk / np.maximum(dz, 1e-4), INF)
            Xk = cam_x + dx * tk
            Yk = eye_y + dy * tk
            for lx in (-9, -3, 3, 9):
                d2 = ((Xk - lx) ** 2 + (Yk - (height - 2.2)) ** 2) / (0.35 ** 2)
                glow = np.exp(-d2) * (tk < t + 0.5)
                rgb += glow[..., None] * np.array([255, 236, 200]) * 1.2
        pools = np.zeros((H, W), np.float32)
        for lx in (-9, -3, 3, 9):
            pools += np.exp(-(((X - lx) / 3.5) ** 2)) * fl
        rgb += pools[..., None] * np.array([120, 110, 90]) * 0.5
    # Haze: depth fog plus lit shafts sampled along the ray.
    dist = t
    fog = 1 - np.exp(-dist / (90 if mood == 'day' else 70))
    rgb = rgb * (1 - fog[..., None] * 0.55) + haze_c * fog[..., None] * 0.55
    if sun is not None:
        shafts = np.zeros((H, W), np.float32)
        steps = 28
        tmax = np.minimum(t, 70)
        for i in range(steps):
            ti = tmax * (i + 0.5) / steps
            shafts += sunlit(cam_x + dx * ti, eye_y + dy * ti, dz * ti)
        shafts /= steps
        shafts = np.asarray(Image.fromarray((np.clip(shafts, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2 * SS)), np.float32) / 255
        rgb += shafts[..., None] * sun_c * 0.7
    # Grade: gentle contrast, cool shadows, warm highlights; vignette and grain.
    lum = rgb.mean(axis=2, keepdims=True) / 255
    rgb = rgb * (0.94 + 0.12 * lum) + (1 - lum) * np.array([-4, 0, 6])
    vg = np.sqrt(((xs - W / 2) / (W / 2)) ** 2 + ((ys - H / 2) / (H / 2)) ** 2)
    rgb *= (1 - 0.22 * np.clip(vg - 0.55, 0, 1) ** 1.4)[..., None]
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)
    arr = np.asarray(im, np.float32) + rng.normal(0, 1.6, (out[1], out[0]))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def cladding(seed=1, out=(1600, 1000)):
    """Close-up of ribbed metal cladding raking in low sun, with a shadow edge."""
    rng = np.random.default_rng(seed)
    W, H = out[0] * SS, out[1] * SS
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    period = 46 * SS
    ph = (xs % period) / period
    prof = np.where(ph < 0.3, 1.0, np.where(ph < 0.4, 1 - (ph - 0.3) / 0.1, np.where(ph < 0.7, 0.0, (ph - 0.7) / 0.3)))
    slope = np.gradient(prof, axis=1)
    light = 0.62 + np.clip(-slope * 28, -0.4, 0.5)
    base = np.array([176, 180, 184], np.float32) * (0.95 + 0.06 * vnoise(H, W, 40 * SS, rng)[..., None])
    sh = (ys > H * 0.25 + (xs - W * 0.4) * 0.6).astype(np.float32)
    sh = np.asarray(Image.fromarray((sh * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10 * SS)), np.float32) / 255
    rgb = base * light[..., None] * (1 - 0.45 * sh[..., None]) + np.array([30, 22, 10]) * (1 - sh[..., None])
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).resize(out, Image.LANCZOS)
    arr = np.asarray(im, np.float32) + rng.normal(0, 1.4, (out[1], out[0]))[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


PLAN = {
    'hall': lambda: hall(1, (2000, 1100)),
    'plant': lambda: hall(2, (1600, 1000), cam_x=-6.0, yaw=0.32),
    'workbench': lambda: hall(3, (1600, 1000), mood='night', cam_x=4.0, yaw=-0.2),
    'cladding': lambda: cladding(4, (1600, 1000)),
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
        im.save(path, 'WEBP', quality=82, method=6)
        print(name, os.path.getsize(path) // 1024, 'KB', flush=True)
