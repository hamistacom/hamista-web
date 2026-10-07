"""
Studio and landscape photographs for the Kooch demo (nomadic food and crafts).

    python3 tools/demo-images/scenes-nomad.py <out-dir> [name ...]

Textiles are woven on a knot grid: a gabbeh has a deep pile with abrash
(row-to-row shifts in dye), a kilim is weft-faced with slits where colours
meet, and socks are knitted in stocking stitch. Food is shot from above or
from the side with one soft key light, using the ceramics module's glaze and
shadow model. Landscapes reuse the Zagros ridges of the travel demo with black
goat-hair tents and a flock.
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


cer = _load('ceramics', 'scenes-ceramics.py')
travel = _load('travel', 'scenes-travel.py')

SS = cer.SS
fnoise = cer.fnoise
LIGHT = cer.LIGHT
HALF = cer.HALF

# Natural dyes.
DYE = {
    'madder': (150, 46, 38),
    'madder-deep': (110, 30, 30),
    'walnut': (92, 62, 42),
    'indigo': (36, 48, 82),
    'saffron': (198, 146, 48),
    'ivory': (226, 214, 190),
    'camel': (176, 138, 96),
    'sage': (112, 122, 88),
    'black': (34, 30, 28),
    'rose': (176, 96, 84),
}


def col(name):
    return np.array(DYE[name], np.float32)


def smooth_mask(mask, blur):
    m = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8))
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255.0


def lay(canvas, colr, mask):
    canvas[:] = canvas * (1 - mask[..., None]) + colr * mask[..., None]
    return canvas


def drop_shadow(canvas, mask, offset, blur, strength):
    sh = cer.soft_shadow(canvas.shape[0], canvas.shape[1], mask, offset, blur, strength)
    canvas *= sh[..., None]
    return canvas


def wood(h, w, rng, color=(116, 82, 56)):
    """Oiled walnut boards: long, gently wandering grain along x, with seams."""
    yy = np.arange(h, dtype=np.float32)[:, None]
    warp = fnoise(h, w, 420 * SS, 2, rng)
    lines = np.sin(yy / (2.6 * SS) + warp * 2.2) * 0.5 + 0.5
    rings = np.sin(yy / (17 * SS) + warp * 1.2) * 0.5 + 0.5
    streak = np.asarray(Image.fromarray((fnoise(max(2, h // 2), max(2, w // 40), 3, 2, rng) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    fine = fnoise(h, w, 1.5 * SS, 1, rng)
    t = 0.8 + 0.06 * lines + 0.12 * rings ** 2 + 0.14 * (streak - 0.5) + 0.04 * (fine - 0.5)
    seam = np.zeros((h, 1), np.float32)
    for k in range(1, 4):
        y0 = int(h * k / 3.4)
        seam[max(0, y0 - SS):y0 + SS] = 1
    t = t * (1 - 0.4 * seam)
    return np.array(color, np.float32)[None, None, :] * t[..., None]


# --------------------------------------------------------------------------
# Woven grids
# --------------------------------------------------------------------------

def gabbeh_pattern(rows, cols_, rng, field='madder'):
    """Colour index grid for a small gabbeh: border stripes, an open field with abrash and a stepped medallion."""
    pal = [col(field), col('ivory'), col('indigo'), col('saffron'), col('walnut'), col('madder-deep'), col('camel')]
    grid = np.zeros((rows, cols_), np.int32)
    r = np.arange(rows)[:, None]
    c = np.arange(cols_)[None, :]
    edge = np.minimum(np.minimum(r, rows - 1 - r), np.minimum(c, cols_ - 1 - c))
    grid = np.where(edge < 3, 4, grid)
    grid = np.where((edge >= 3) & (edge < 5), 1, grid)
    grid = np.where((edge >= 5) & (edge < 9), 2, grid)
    grid = np.where((edge >= 9) & (edge < 10), 3, grid)
    # Stepped medallion in the field.
    cy, cx = rows / 2, cols_ / 2
    d = np.abs(r - cy) / (rows * 0.2) + np.abs(c - cx) / (cols_ * 0.2)
    step = np.floor(d * 6) / 6
    inner = (edge >= 10)
    grid = np.where(inner & (step <= 0.34), 3, grid)
    grid = np.where(inner & (step > 0.34) & (step <= 0.5), 1, grid)
    grid = np.where(inner & (step > 0.5) & (step <= 0.67), 2, grid)
    # A few small motifs scattered in the field, as a weaver would add from memory.
    for _ in range(14):
        y0, x0 = rng.integers(14, rows - 18), rng.integers(14, cols_ - 18)
        if abs(y0 - cy) < rows * 0.26 and abs(x0 - cx) < cols_ * 0.26:
            continue
        k = rng.choice([1, 3, 6])
        size = rng.integers(2, 4)
        dd = np.abs(r - y0) + np.abs(c - x0)
        grid = np.where(inner & (dd <= size), k, grid)
    return grid, pal


def kilim_pattern(rows, cols_, rng, scheme=('madder', 'ivory', 'indigo', 'saffron', 'walnut')):
    """Weft-faced kilim: bands of stepped lozenges (eye-of-the-hook motif)."""
    pal = [col(n) for n in scheme]
    r = np.arange(rows)[:, None]
    c = np.arange(cols_)[None, :]
    band_h = 44
    band = (r // band_h) % 3
    yy = (r % band_h) - band_h / 2
    period = 52
    xx = ((c + (r // band_h) * 26) % period) - period / 2
    d = np.abs(yy) / (band_h * 0.5) + np.abs(xx) / (period * 0.5)
    stepd = np.floor(d * 5) / 5
    grid = np.zeros((rows, cols_), np.int32)
    grid = np.where(stepd < 0.4, 3, grid)
    grid = np.where((stepd >= 0.4) & (stepd < 0.6), 1, grid)
    grid = np.where((stepd >= 0.6) & (stepd < 0.8), np.where(band == 1, 2, 4), grid)
    # Hooks on the lozenge edges.
    hook = ((np.abs(yy) < 2) & (np.abs(np.abs(xx) - period * 0.3) < 3))
    grid = np.where(hook, 1, grid)
    seps = (r % band_h) < 3
    grid = np.where(seps, np.where(((r // band_h) % 2) == 0, 4, 1), grid)
    return grid, pal


def weave(canvas, x0, y0, w, h, grid, pal, rng, kind='pile', abrash=0.08, fringe=True, sheen=0.12):
    """Render a woven grid into a rectangle of the canvas (supersampled coordinates)."""
    rows, cols_ = grid.shape
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # Hand-woven rugs are never quite square: the sides wander a little.
    wob_x = (fnoise(H, 1, 120 * SS, 2, rng)[:, 0] - 0.5)[:, None] * (0.012 if kind == 'pile' else 0.004)
    wob_y = (fnoise(1, W, 140 * SS, 2, rng)[0] - 0.5)[None, :] * (0.01 if kind == 'pile' else 0.003)
    u = (xx - x0) / w + wob_x
    v = (yy - y0) / h + wob_y
    inside = (u >= 0) & (u < 1) & (v >= 0) & (v < 1)
    palette = np.stack(pal)
    knots = palette[grid]
    # Abrash: dye lots shift colour in bands of rows; each knot differs a touch.
    lots = fnoise(rows, 1, 7, 2, rng)[:, 0]
    knots = knots * (1 - abrash + 2 * abrash * lots)[:, None, None]
    knots = knots * (1 + rng.normal(0, 0.035 if kind == 'pile' else 0.02, (rows, cols_, 1)))
    small = Image.fromarray(np.clip(knots, 0, 255).astype(np.uint8))
    sharp = np.asarray(small.resize((W, H), Image.NEAREST), np.float32)
    soft = np.asarray(small.resize((W, H), Image.BICUBIC), np.float32)
    # Map the knot image into the (wobbly) rectangle.
    ri = np.clip((v * rows).astype(np.int32), 0, rows - 1)
    ci = np.clip((u * cols_).astype(np.int32), 0, cols_ - 1)
    alb_sharp = knots[ri, ci]
    fu = (u * cols_) % 1
    fv = (v * rows) % 1
    if kind == 'pile':
        # Pile fibres blur the knot grid: mix the sharp grid with a softened copy.
        ys = np.clip(v * rows - 0.5, 0, rows - 1)
        xs = np.clip(u * cols_ - 0.5, 0, cols_ - 1)
        y0i, x0i = np.floor(ys).astype(np.int32), np.floor(xs).astype(np.int32)
        y1i, x1i = np.clip(y0i + 1, 0, rows - 1), np.clip(x0i + 1, 0, cols_ - 1)
        fy, fx = (ys - y0i)[..., None], (xs - x0i)[..., None]
        blur = (knots[y0i, x0i] * (1 - fx) + knots[y0i, x1i] * fx) * (1 - fy) + (knots[y1i, x0i] * (1 - fx) + knots[y1i, x1i] * fx) * fy
        alb = alb_sharp * 0.45 + blur * 0.55
        tuft = 0.88 + 0.12 * np.sin(fu * math.pi) * np.sin(fv * math.pi)
        fib = fnoise(H, W, 1.1 * SS, 1, rng)
        fib2 = fnoise(H, W, 3.2 * SS, 2, rng)
        alb = alb * (tuft * (0.86 + 0.16 * fib + 0.1 * (fib2 - 0.5)))[..., None]
        sh = fnoise(H, W, 220 * SS, 3, rng)
        alb = alb * (1 - sheen + 2 * sheen * sh)[..., None]
        # Selvedge: the long sides are wrapped in dark wool.
        side = np.minimum(u, 1 - u) * w
        selv = np.clip(1 - side / (5 * SS), 0, 1)
        alb = alb * (1 - selv[..., None]) + col('walnut') * 0.7 * selv[..., None]
    else:
        alb = alb_sharp
        ribs = 0.86 + 0.14 * np.sin(fv * math.pi) ** 0.6
        warp = 0.96 + 0.04 * np.cos(fu * 2 * math.pi)
        alb = alb * (ribs * warp)[..., None]
        left = grid[ri, np.clip(ci - 1, 0, cols_ - 1)]
        slit = (left != grid[ri, ci]) & (fu < 0.16)
        alb = alb * np.where(slit, 0.5, 1.0)[..., None]
        fib = fnoise(H, W, 1.4 * SS, 1, rng)
        alb = alb * (0.94 + 0.12 * fib)[..., None]
    # Soft folds in the cloth and the key light.
    waves = fnoise(H, W, 300 * SS, 2, rng)
    light = (0.92 + 0.14 * (1 - u * 0.6 - v * 0.4)) * (0.94 + 0.12 * waves)
    alb = alb * light[..., None]
    m = inside.astype(np.float32)
    drop_shadow(canvas, m, (6 * SS, 8 * SS), 14 * SS, 0.32)
    lay(canvas, alb, smooth_mask(m, 0.7 * SS))
    if fringe:
        for top in (True, False):
            fy = y0 if top else y0 + h
            length = min(h * 0.06, 60 * SS)
            strands = int(w / (3.2 * SS))
            img = Image.new('L', (W, H), 0)
            d = ImageDraw.Draw(img)
            for k in range(strands):
                x = x0 + (k + 0.5) * w / strands + rng.normal(0, 0.6 * SS)
                L = length * (0.75 + 0.35 * rng.random())
                bend = rng.normal(0, 3 * SS)
                y1 = fy - L if top else fy + L
                d.line([(x, fy), (x + bend, y1)], fill=255, width=max(1, int(1.3 * SS)))
            fm = np.asarray(img.filter(ImageFilter.GaussianBlur(0.5 * SS)), np.float32) / 255
            drop_shadow(canvas, fm, (2 * SS, 3 * SS), 3 * SS, 0.25)
            lay(canvas, col('ivory') * 0.96, fm)
    return canvas


# --------------------------------------------------------------------------
# Yarn, socks and cushions
# --------------------------------------------------------------------------

def skein(canvas, cx, cy, length, thick, angle, color, rng):
    """A hank of hand-spun yarn twisted on itself: two plies wrapping round each other, a loop at one end."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ca, sa = math.cos(angle), math.sin(angle)
    a = (xx - cx) * ca + (yy - cy) * sa
    b = -(xx - cx) * sa + (yy - cy) * ca
    half = length / 2
    taper = 1 - 0.3 * np.clip((np.abs(a) / half - 0.82) / 0.18, 0, 1) ** 2
    across = b / (thick * taper)
    phase = a / (thick * 1.25) * math.pi
    c = np.array(color, np.float32)
    fib = fnoise(H, W, 0.8 * SS, 1, rng)
    hair = fnoise(H, W, 2.5 * SS, 2, rng)
    out = np.zeros((H, W, 3), np.float32)
    mask = np.zeros((H, W), np.float32)
    # The loop where the hank folds back on itself, tucked under the end of the twist.
    lx, ly = cx + ca * (half + thick * 0.2), cy + sa * (half + thick * 0.2)
    la = (xx - lx) * ca + (yy - ly) * sa
    lb = -(xx - lx) * sa + (yy - ly) * ca
    lr = np.sqrt((la / (thick * 1.0)) ** 2 + (lb / (thick * 0.82)) ** 2)
    loop = (lr <= 1) & (lr >= 0.5)
    ln = np.sqrt(np.clip(1 - ((lr - 0.75) / 0.25) ** 2, 0, 1))
    lfib = 0.84 + 0.16 * np.sin((np.arctan2(lb, la) * thick * 0.9 + lr * 30) / 1.0) ** 2
    out = np.where(loop[..., None], c[None, None, :] * ((0.35 + 0.6 * ln) * lfib * (0.9 + 0.18 * fib))[..., None], out)
    mask = np.maximum(mask, loop.astype(np.float32))
    # Back ply first, then the front ply; they swap every half turn.
    for front in (False, True):
        for sign in (1, -1):
            centre = 0.42 * sign * np.sin(phase)
            facing = np.cos(phase) * sign > 0
            sel = facing if front else ~facing
            d = (across - centre) / 0.6
            inside = (np.abs(d) <= 1) & (np.abs(a) <= half) & sel
            nz = np.sqrt(np.clip(1 - d * d, 0, 1))
            # Fibres run diagonally round each ply.
            fibre = 0.86 + 0.14 * np.sin((a * 0.9 + d * thick * 1.4 * sign) / (0.8 * SS) + hair * 9) ** 2
            light = np.clip(-d * 0.35 + nz * 0.8 + 0.15, 0, 1) ** 0.8
            k = (0.42 + 0.62 * light) * fibre * (0.88 + 0.22 * fib) * (1.0 if front else 0.82)
            rgb = c[None, None, :] * k[..., None] + (np.clip(nz - 0.75, 0, 1) * 30)[..., None]
            out = np.where(inside[..., None], rgb, out)
            mask = np.maximum(mask, inside.astype(np.float32))
    # A few stray fibres catching the light at the edge.
    # Soften the ply boundaries a touch: wool is fuzzy.
    out = np.asarray(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9 * SS)), np.float32) * 0.5 + out * 0.5
    halo = smooth_mask(mask, 2.2 * SS) - smooth_mask(mask, 0.6 * SS)
    drop_shadow(canvas, mask, (thick * 0.16, thick * 0.24), thick * 0.3, 0.42)
    lay(canvas, out, smooth_mask(mask, 0.8 * SS))
    lay(canvas, c * 1.05, np.clip(halo, 0, 1) * 0.35 * (fib > 0.55))
    return canvas


def knit(canvas, poly, pattern_fn, rng, stitch=11, origin=(0, 0)):
    """Stocking stitch inside a polygon. pattern_fn(row, col) → RGB array of colours per stitch, rows counted from origin."""
    H, W = canvas.shape[:2]
    img = Image.new('L', (W, H), 0)
    ImageDraw.Draw(img).polygon(poly, fill=255)
    m = np.asarray(img.filter(ImageFilter.GaussianBlur(1.6 * SS)), np.float32) / 255
    hard = np.asarray(img, np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    s = stitch * SS
    ry, rx = yy - origin[1], xx - origin[0]
    sr = np.floor(ry / (s * 0.82)).astype(np.int32)
    sc = np.floor(rx / s).astype(np.int32)
    fu = (rx / s) % 1
    fv = (ry / (s * 0.82)) % 1
    # Each stitch is a V of two slanted loops.
    left = np.abs((fu - 0.25) - (fv - 0.5) * -0.32) < 0.2
    right = np.abs((fu - 0.75) - (fv - 0.5) * 0.32) < 0.2
    leg_u = np.where(fu < 0.5, (fu - 0.25 + (fv - 0.5) * 0.32) / 0.2, (fu - 0.75 - (fv - 0.5) * 0.32) / 0.2)
    bump = np.sqrt(np.clip(1 - leg_u ** 2, 0, 1)) * np.sin(fv * math.pi) ** 0.5
    gapm = ~(left | right)
    alb = pattern_fn(sr, sc)
    fib = fnoise(H, W, 0.8 * SS, 1, rng)
    puff = fnoise(H, W, 90 * SS, 2, rng)
    shade = 0.5 + 0.55 * bump
    shade = np.where(gapm, 0.42, shade) * (0.92 + 0.16 * fib) * (0.9 + 0.2 * puff)
    rgb = alb * shade[..., None]
    drop_shadow(canvas, hard, (5 * SS, 7 * SS), 9 * SS, 0.38)
    lay(canvas, rgb, m)
    return canvas


def chaikin(pts, rounds=3):
    for _ in range(rounds):
        out = []
        n = len(pts)
        for i in range(n):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
            out += [(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1), (0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1)]
        pts = out
    return pts


def sock_poly(x, y, s, flip=False, angle=0.0):
    """Outline of a flat-lying sock: ribbed cuff at the top, heel, then the foot."""
    pts = [(0.0, 0.0), (0.4, 0.0), (0.41, 0.55), (0.46, 0.66), (0.58, 0.72), (0.86, 0.72), (0.97, 0.76), (1.0, 0.84),
           (0.97, 0.92), (0.86, 0.96), (0.4, 0.97), (0.18, 0.96), (0.06, 0.9), (0.0, 0.78), (-0.01, 0.4)]
    ca, sa = math.cos(angle), math.sin(angle)
    out = []
    for px_, py_ in pts:
        if flip:
            px_ = 0.4 - px_
        X, Y = px_ * s, py_ * s * 1.32
        out.append((x + X * ca - Y * sa, y + X * sa + Y * ca))
    # Keep the cuff edge straight: smooth the open chain from one cuff corner round to the other.
    chain = out[1:] + out[:1]
    for _ in range(3):
        nxt = [chain[0]]
        for i in range(len(chain) - 1):
            (x0, y0), (x1, y1) = chain[i], chain[i + 1]
            nxt += [(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1), (0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1)]
        nxt.append(chain[-1])
        chain = nxt
    return chain


def sock_pattern(main, accent, third, fourth='walnut'):
    a, b, c3, d4 = col(main), col(accent), col(third), col(fourth)

    def f(r0, c_):
        rgb = np.broadcast_to(a, r0.shape + (3,)).copy()
        r = np.where(r0 < 9, r0, 9 + (r0 - 9) % 52)
        # Ribbed cuff.
        cuff = r < 9
        rgb = np.where(cuff[..., None], np.where(((c_ % 2) == 0)[..., None], b, b * 0.82), rgb)
        # Diamond band.
        bd = (r >= 13) & (r < 22)
        dia = (np.abs((c_ % 10) - 4.5) + np.abs(r - 17.5)) < 4.2
        rgb = np.where((bd & dia)[..., None], c3, np.where(bd[..., None], b, rgb))
        # Zigzag band.
        zz = (r >= 26) & (r < 31)
        zig = np.abs(((c_ + r) % 6) - 3) < 1
        rgb = np.where((zz & zig)[..., None], d4, np.where(zz[..., None], a, rgb))
        # Thin stripes and a dotted row further down.
        rgb = np.where(((r == 34) | (r == 35))[..., None], b, rgb)
        dots = (r == 40) & ((c_ % 4) == 1)
        rgb = np.where(dots[..., None], c3, rgb)
        rgb = np.where(((r >= 46) & (r < 50))[..., None], c3, rgb)
        dots2 = (r >= 54) & (r < 57) & (((c_ + (r % 2)) % 6) < 2)
        rgb = np.where(dots2[..., None], b, rgb)
        return rgb
    return f


def cushion(canvas, x0, y0, size, grid, pal, rng):
    """A square kilim cushion, plump in the middle, pinched at the corners."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u = (xx - x0) / size * 2 - 1
    v = (yy - y0) / size * 2 - 1
    # Pinched outline: the edges bow inwards between the corners.
    pinch = 0.06 * (1 - u ** 2)
    pinch_v = 0.06 * (1 - v ** 2)
    inside = (np.abs(u) <= 1 - pinch_v) & (np.abs(v) <= 1 - pinch)
    hgt = np.clip((1 - u ** 4) * (1 - v ** 4), 0, 1) ** 0.8
    gy, gx = np.gradient(hgt * size * 0.18)
    n = np.sqrt(gx * gx + gy * gy + 1)
    nx, ny, nz = -gx / n, -gy / n, 1 / n
    diff = np.clip(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0, 1)
    rows, cols_ = grid.shape
    ri = np.clip(((v + 1) / 2 * rows).astype(np.int32), 0, rows - 1)
    ci = np.clip(((u + 1) / 2 * cols_).astype(np.int32), 0, cols_ - 1)
    alb = np.stack(pal)[grid[ri, ci]]
    fv = ((v + 1) / 2 * rows) % 1
    alb = alb * (0.86 + 0.14 * np.sin(fv * math.pi) ** 0.6)[..., None]
    alb = alb * (0.93 + 0.12 * fnoise(H, W, 1.4 * SS, 1, rng))[..., None]
    rgb = alb * (0.45 + 0.7 * diff)[..., None]
    m = inside.astype(np.float32)
    drop_shadow(canvas, m, (size * 0.03, size * 0.045), size * 0.05, 0.42)
    lay(canvas, rgb, smooth_mask(m, 1.0 * SS))
    return canvas


# --------------------------------------------------------------------------
# Food
# --------------------------------------------------------------------------

def bowl_top(canvas, cx, cy, R, rng, material='wood', glaze='oat'):
    """An empty bowl seen from above; returns the radius of its inner well."""
    if material == 'wood':
        H, W = canvas.shape[:2]
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / R
        inside = r <= 1
        # Turned wood: concentric grain and a rounded rim.
        ang = np.arctan2(yy - cy, xx - cx)
        grain = np.sin(r * 90 + fnoise(H, W, 60 * SS, 2, rng) * 2.5 + np.cos(ang * 2) * 0.8) * 0.5 + 0.5
        base = np.array([132, 92, 60], np.float32)
        alb = base[None, None, :] * (0.88 + 0.12 * grain ** 3)[..., None] * (0.95 + 0.1 * fnoise(H, W, 2 * SS, 1, rng))[..., None]
        rim = np.clip((r - 0.86) / 0.14, 0, 1)
        hgt = np.where(r < 0.86, (r / 0.86) ** 2 * 0.7, 0.7 + 0.08 * np.sin(rim * math.pi))
        nx, ny, nz = cer.normals_from_height(hgt, R * 1.1 / SS)
        col_ = cer.shade(alb, nx, ny, nz, 0.75, ambient=0.5, key=0.6, hot=0.25)
        col_ *= (0.7 + 0.3 * np.clip(r / 0.86, 0, 1))[..., None]
        m = inside.astype(np.float32)
        drop_shadow(canvas, m, (R * 0.07, R * 0.09), R * 0.12, 0.4)
        lay(canvas, col_, smooth_mask(m, 0.7 * SS))
    else:
        cer.piece_top(canvas, cx, cy, R, 'bowl', glaze, rng)
    return R * 0.82


def mound(canvas, cx, cy, R, rng, kind):
    """Fill a bowl with kashk balls, qara-qurut discs or dried herbs."""
    H, W = canvas.shape[:2]
    if kind == 'herb':
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        n = int(R * R / (2.2 * SS * SS) * 1.4)
        greens = [(118, 124, 92), (98, 108, 78), (140, 140, 104), (86, 92, 66), (150, 132, 96)]
        for _ in range(n):
            rr = R * math.sqrt(rng.random())
            a = rng.random() * 2 * math.pi
            x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
            L = (2.2 + 2.6 * rng.random()) * SS
            th = rng.random() * math.pi
            g = greens[rng.integers(0, len(greens))]
            lift = 1 - (rr / R) ** 2
            k = 0.7 + 0.45 * lift + rng.normal(0, 0.08)
            c = tuple(int(np.clip(v * k, 0, 255)) for v in g) + (255,)
            d.ellipse([x - L, y - L * 0.42, x + L, y + L * 0.42], fill=c)
            if rng.random() < 0.06:
                d.line([(x, y), (x + math.cos(th) * L * 3, y + math.sin(th) * L * 3)], fill=(120, 96, 64, 255), width=max(1, SS))
        arr = np.asarray(img, np.float32)
        a_ = arr[..., 3:4] / 255
        canvas[:] = canvas * (1 - a_) + arr[..., :3] * a_
        return canvas
    # Balls or discs, painted back to front.
    items = []
    count = 30 if kind == 'kashk' else 24
    for _ in range(count * 3):
        rr = R * 0.78 * math.sqrt(rng.random())
        a = rng.random() * 2 * math.pi
        size = R * (0.2 if kind == 'kashk' else 0.21) * (0.82 + 0.36 * rng.random())
        x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
        if all((x - x2) ** 2 + (y - y2) ** 2 > (size + s2) ** 2 * 0.62 for x2, y2, s2 in items):
            items.append((x, y, size))
        if len(items) >= count:
            break
    items.sort(key=lambda t: t[1])
    for x, y, s in items:
        put_ball(canvas, x, y, s, rng, kind)
    return canvas


def put_ball(canvas, x, y, s, rng, kind):
    H, W = canvas.shape[:2]
    x0, x1 = int(max(0, x - s * 1.6)), int(min(W, x + s * 1.6))
    y0, y1 = int(max(0, y - s * 1.6)), int(min(H, y + s * 1.6))
    sub = canvas[y0:y1, x0:x1]
    hh, ww = sub.shape[:2]
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    lumpy = fnoise(hh, ww, max(2, s * 0.35), 3, rng)
    dx, dy = (xx - x) / s, (yy - y) / s
    if kind == 'qurut':
        dy = dy * 1.15
    r = np.sqrt(dx * dx + dy * dy) / (0.9 + 0.2 * lumpy)
    inside = r <= 1
    nz = np.sqrt(np.clip(1 - r * r, 0, 1))
    nx, ny = dx, dy
    bump = fnoise(hh, ww, max(2, s * (0.16 if kind == 'kashk' else 0.1)), 3, rng)
    gy, gx = np.gradient(bump * s * (0.1 if kind == 'kashk' else 0.16))
    nx, ny = nx - gx * 0.5, ny - gy * 0.5
    n = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-6
    nx, ny, nz = nx / n, ny / n, nz / n
    diff = np.clip(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0, 1)
    if kind == 'kashk':
        base = np.array([236, 228, 206], np.float32) * (0.95 + 0.07 * bump)[..., None]
        # Chalky: no gloss, a little subsurface warmth on the shadow side.
        spec = np.zeros_like(diff)
        diff = diff * 0.85 + 0.15
    else:
        base = np.array([74, 44, 30], np.float32) * (0.85 + 0.25 * bump)[..., None]
        spec = np.clip(nx * HALF[0] + ny * HALF[1] + nz * HALF[2], 0, 1) ** 60 * 0.55
    rgb = base * (0.38 + 0.7 * diff)[..., None] + (spec * 255)[..., None]
    m = inside.astype(np.float32)
    shadow = cer.soft_shadow(hh, ww, m, (s * 0.12, s * 0.18), s * 0.18, 0.5)
    sub *= shadow[..., None]
    soft = smooth_mask(m, 0.6 * SS)
    sub[:] = sub * (1 - soft[..., None]) + rgb * soft[..., None]
    return canvas


def jar_side(canvas, cx, base_y, height, R, rng, fill='ghee', level=0.7, lid='cloth'):
    """A glass jar with a rounded shoulder and a short neck, seen from the side."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = (base_y - yy) / height
    tc = np.clip(t, 0, 1)
    shoulder = 0.8
    sh_t = np.clip((tc - shoulder) / 0.12, 0, 1)
    prof = np.where(tc < shoulder, 1.0, 1 - 0.24 * (1 - np.cos(sh_t * math.pi / 2)))
    prof = np.where(tc > 0.92, 0.76, prof)
    foot = np.clip(tc / 0.035, 0, 1)
    prof = prof * (0.93 + 0.07 * np.sin(foot * math.pi / 2))
    rad = R * prof
    u = (xx - cx) / np.maximum(rad, 1)
    inside = (t >= 0) & (t <= 1) & (np.abs(u) <= 1)
    nz = np.sqrt(np.clip(1 - u * u, 0, 1))
    behind = canvas.copy()
    if fill == 'ghee':
        # Set ghee: creamy, opaque, with a fine crystalline grain; light glows through the thin edges.
        base = np.array([236, 200, 112], np.float32)
        gr = fnoise(H, W, 1.3 * SS, 2, rng)
        cloud = fnoise(H, W, 22 * SS, 3, rng)
        alb = base[None, None, :] * (0.9 + 0.07 * gr + 0.08 * cloud)[..., None]
        edge_glow = np.clip(np.abs(u) - 0.7, 0, 1) / 0.3
        alb = alb * (1 - 0.1 * edge_glow[..., None]) + np.array([30, 18, -10]) * edge_glow[..., None]
    else:
        g = fnoise(H, W, 2.0 * SS, 2, rng)
        g2 = fnoise(H, W, 7 * SS, 2, rng)
        alb = np.array([112, 118, 86], np.float32)[None, None, :] * (0.62 + 0.45 * g + 0.2 * g2)[..., None]
    lit = 0.62 + 0.42 * np.clip(-u * 0.55 + 0.55, 0, 1) * (0.4 + 0.6 * nz)
    content = alb * lit[..., None]
    fill_m = inside & (t <= level) & (t >= 0.02)
    # Empty glass: the backdrop seen through, slightly darker and greener.
    glass = behind * np.array([0.92, 0.94, 0.92]) - 4
    rgb = np.where(fill_m[..., None], content, glass)
    # Thick glass at the base.
    base_band = (t < 0.035) & inside
    rgb = np.where(base_band[..., None], behind * 0.8 + np.array([12, 14, 12]), rgb)
    # Edges darken (refraction), two vertical reflections of a softbox and a window.
    fres = np.clip((np.abs(u) - 0.84) / 0.16, 0, 1)
    rgb = rgb * (1 - 0.4 * fres[..., None])
    rgb = rgb + (np.exp(-((u + 0.62) / 0.06) ** 2) * 150 * (t > 0.05) * (t < 0.9))[..., None]
    rgb = rgb + (np.exp(-((u + 0.38) / 0.025) ** 2) * 60 * (t > 0.1) * (t < 0.78))[..., None]
    rgb = rgb + (np.exp(-((u - 0.72) / 0.03) ** 2) * 50 * (t > 0.08) * (t < 0.76))[..., None]
    # The meniscus line where the ghee meets the glass.
    surf = np.exp(-((t - level) * height / (1.6 * SS)) ** 2) * inside
    rgb = rgb * (1 - 0.25 * surf[..., None])
    # Shoulder highlight.
    rgb = rgb + (np.exp(-((t - shoulder - 0.06) / 0.025) ** 2) * np.clip(-u, 0, 1) * 90 * inside)[..., None]
    m = inside.astype(np.float32)
    shadow_mask = (((xx - cx - R * 0.3) / (R * 1.3)) ** 2 + ((yy - base_y) / (height * 0.045)) ** 2 <= 1).astype(np.float32)
    drop_shadow(canvas, shadow_mask, (0, 0), height * 0.05, 0.42)
    lay(canvas, rgb, smooth_mask(m, 0.6 * SS))
    top = base_y - height
    neck = R * 0.76
    if lid == 'cloth':
        # A square of madder cloth tied over the mouth with twine; the corners hang down.
        drape = height * 0.2
        img = Image.new('L', (W, H), 0)
        d = ImageDraw.Draw(img)
        d.ellipse([cx - neck * 1.12, top - drape * 0.32, cx + neck * 1.12, top + drape * 0.22], fill=255)
        skirt = [(cx - neck * 1.1, top - drape * 0.05), (cx + neck * 1.1, top - drape * 0.05), (cx + neck * 1.34, top + drape * 1.05),
                 (cx + neck * 0.7, top + drape * 0.78), (cx + neck * 0.05, top + drape * 1.12), (cx - neck * 0.65, top + drape * 0.8), (cx - neck * 1.36, top + drape * 1.0)]
        d.polygon(skirt, fill=255)
        cm = np.asarray(img.filter(ImageFilter.GaussianBlur(0.9 * SS)), np.float32) / 255
        cloth = col('madder')[None, None, :] * np.ones((H, W, 1), np.float32)
        band = (np.abs((yy - top) - drape * 0.62) < drape * 0.07)
        cloth = np.where(band[..., None], col('ivory') * 0.92, cloth)
        stripe = (np.abs((yy - top) - drape * 0.82) < drape * 0.025)
        cloth = np.where(stripe[..., None], col('indigo'), cloth)
        weavet = 0.93 + 0.07 * np.sin(yy / (1.2 * SS)) * np.sin(xx / (1.2 * SS))
        folds = 0.78 + 0.22 * np.sin((xx - cx) / (neck * 0.16) + fnoise(H, W, 26 * SS, 2, rng) * 5) ** 2
        top_lit = np.where(yy < top + drape * 0.12, 1.12, 1.0)
        side = 0.62 + 0.5 * np.clip(-(xx - cx) / (neck * 1.4) * 0.5 + 0.55, 0, 1)
        drop_shadow(canvas, cm, (R * 0.05, R * 0.07), R * 0.06, 0.38)
        lay(canvas, cloth * (weavet * folds * top_lit * side)[..., None], cm)
        tw_y = top + drape * 0.36
        curve = tw_y + ((xx - cx) / neck) ** 2 * drape * 0.08
        twine = (np.abs(yy - curve) < 1.6 * SS) & (np.abs(xx - cx) < neck * 1.08)
        tw = smooth_mask(twine.astype(np.float32), 0.45 * SS)
        tcol = np.array([206, 180, 132], np.float32) * (0.75 + 0.35 * (np.sin((xx + yy) / (1.1 * SS)) * 0.5 + 0.5))[..., None]
        lay(canvas, tcol, tw)
    else:
        lidm = (np.abs(xx - cx) <= neck * 1.05) & (yy >= top - height * 0.075) & (yy <= top + height * 0.01)
        lu = (xx - cx) / (neck * 1.05)
        metal = 168 + 80 * np.exp(-((lu + 0.45) / 0.16) ** 2) - 60 * np.abs(lu) ** 3
        rib = 0.9 + 0.1 * (np.sin((yy - top) / (1.4 * SS)) > 0)
        lrgb = np.stack([metal * 0.97, metal * 0.93, metal * 0.84], -1) * rib[..., None]
        lay(canvas, lrgb, smooth_mask(lidm.astype(np.float32), 0.6 * SS))
    return canvas


def jar_top(canvas, cx, cy, R, rng):
    """An open jar of ghee seen from above: grainy golden surface inside a glass rim."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / R
    inside = r <= 1
    m = inside.astype(np.float32)
    drop_shadow(canvas, m, (R * 0.12, R * 0.16), R * 0.22, 0.38)
    gr = fnoise(H, W, 1.5 * SS, 2, rng)
    swirl = fnoise(H, W, 24 * SS, 3, rng)
    surf = np.array([226, 172, 66], np.float32)[None, None, :] * (0.82 + 0.1 * gr + 0.16 * swirl)[..., None]
    # A spoon has scooped a little hollow.
    hollow = np.exp(-(((xx - cx - R * 0.2) / (R * 0.32)) ** 2 + ((yy - cy + R * 0.1) / (R * 0.22)) ** 2))
    surf *= (1 - 0.18 * hollow)[..., None]
    surf += (np.exp(-(((xx - cx - R * 0.08) / (R * 0.2)) ** 2 + ((yy - cy + R * 0.2) / (R * 0.1)) ** 2)) * 46)[..., None]
    inner = r <= 0.86
    rim = np.clip(1 - np.abs(r - 0.93) / 0.07, 0, 1)
    glass = canvas * 0.85 + 20
    rgb = np.where(inner[..., None], surf * (0.75 + 0.25 * (1 - r / 0.86) ** 0.3)[..., None], glass)
    rgb = rgb + (rim ** 2 * 70)[..., None] * (0.6 + 0.4 * np.cos(np.arctan2(yy - cy, xx - cx) + 2.4))[..., None]
    lay(canvas, rgb, smooth_mask(m, 0.7 * SS))
    return canvas


def herb_bundle(canvas, x, y, length, angle, rng, color=(108, 116, 82)):
    """A tied bunch of dried stems with small leaves, lying on the table."""
    H, W = canvas.shape[:2]
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    ca, sa = math.cos(angle), math.sin(angle)
    stems = 70
    for k in range(stems):
        spread = (k / stems - 0.5)
        L = length * (0.85 + 0.25 * rng.random())
        bend = rng.normal(0, 0.05)
        pts = []
        for s in np.linspace(0, 1, 14):
            off = spread * length * 0.22 * s ** 1.4 + bend * length * s * s
            px_ = x + ca * L * s - sa * off
            py_ = y + sa * L * s + ca * off
            pts.append((px_, py_))
        d.line(pts, fill=(132, 108, 74, 255), width=max(1, int(1.1 * SS)))
        for s in np.linspace(0.28, 1, 34):
            i = int(s * 13)
            px_, py_ = pts[i]
            for _ in range(3):
                a = rng.random() * math.pi
                Lf = (2.6 + 2.4 * rng.random()) * SS
                c = tuple(int(np.clip(v * (0.75 + 0.5 * rng.random()), 0, 255)) for v in color) + (255,)
                ox, oy = rng.normal(0, 3 * SS), rng.normal(0, 3 * SS)
                d.ellipse([px_ + ox - Lf, py_ + oy - Lf * 0.45, px_ + ox + Lf, py_ + oy + Lf * 0.45], fill=c)
    arr = np.asarray(img, np.float32)
    a_ = arr[..., 3] / 255
    drop_shadow(canvas, a_, (4 * SS, 6 * SS), 6 * SS, 0.4)
    canvas[:] = canvas * (1 - a_[..., None]) + arr[..., :3] * a_[..., None]
    # Twine round the stems.
    tx, ty = x + ca * length * 0.18, y + sa * length * 0.18
    tw = Image.new('L', (W, H), 0)
    ImageDraw.Draw(tw).line([(tx - sa * length * 0.06, ty + ca * length * 0.06), (tx + sa * length * 0.06, ty - ca * length * 0.06)], fill=255, width=int(4 * SS))
    twm = np.asarray(tw.filter(ImageFilter.GaussianBlur(0.6 * SS)), np.float32) / 255
    lay(canvas, np.array([200, 172, 126], np.float32), twm)
    return canvas


def copper_pot(canvas, cx, cy, R, rng):
    """A tinned copper pot of melting butter seen from above: liquid gold inside, copper rim."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / R
    ang = np.arctan2(yy - cy, xx - cx)
    m = (r <= 1).astype(np.float32)
    drop_shadow(canvas, m, (R * 0.08, R * 0.11), R * 0.16, 0.45)
    copper = np.array([176, 98, 58], np.float32)
    brushed = 0.85 + 0.15 * np.sin(r * 220 + fnoise(H, W, 30 * SS, 2, rng) * 3)
    glint = 0.6 + 0.6 * np.clip(np.cos(ang + 2.3), 0, 1) ** 6
    rim = copper[None, None, :] * (brushed * glint)[..., None]
    liquid = np.array([214, 156, 52], np.float32)[None, None, :] * (0.85 + 0.15 * fnoise(H, W, 40 * SS, 3, rng))[..., None]
    foam = np.clip(fnoise(H, W, 5 * SS, 2, rng) - 0.55, 0, 1) * 3 * np.clip((r - 0.55) / 0.3, 0, 1)
    liquid = liquid * (1 - foam[..., None] * 0.2) + np.array([246, 222, 160]) * foam[..., None] * 0.3
    spec = np.exp(-(((xx - cx + R * 0.25) / (R * 0.18)) ** 2 + ((yy - cy + R * 0.28) / (R * 0.08)) ** 2)) * 120
    liquid = liquid + spec[..., None]
    rgb = np.where((r <= 0.84)[..., None], liquid * (0.8 + 0.2 * (1 - r)) [..., None], rim)
    lay(canvas, rgb, smooth_mask(m, 0.7 * SS))
    return canvas


# --------------------------------------------------------------------------
# Landscapes
# --------------------------------------------------------------------------

def tents(img, items, rng, lit=False):
    """Black goat-hair tents: long, low, ridged, with a dark opening."""
    H, W = img.shape[:2]
    for x, y, s in items:
        layer = Image.new('L', (W, H), 0)
        d = ImageDraw.Draw(layer)
        L, T = s, s * 0.22
        poly = [(x - L / 2, y), (x - L * 0.42, y - T * 0.9), (x - L * 0.18, y - T), (x, y - T * 1.06), (x + L * 0.18, y - T), (x + L * 0.42, y - T * 0.9), (x + L / 2, y)]
        d.polygon(poly, fill=255)
        m = np.asarray(layer.filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255
        yy = np.arange(H, dtype=np.float32)[:, None]
        shade = np.clip((yy - (y - T)) / T, 0, 1)
        ridges = 0.9 + 0.1 * np.sin(np.arange(W, dtype=np.float32)[None, :] / max(2, s * 0.05))
        base = np.array([30, 26, 24], np.float32)
        tone = base[None, None, :] * (1.2 - 0.4 * shade[..., None]) * ridges[..., None]
        img[:] = img * (1 - m[..., None]) + tone * m[..., None]
        # Opening, warm when lit from inside.
        op = Image.new('L', (W, H), 0)
        ImageDraw.Draw(op).rectangle([x - L * 0.08, y - T * 0.55, x + L * 0.08, y], fill=255)
        om = np.asarray(op.filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255
        inner = np.array([255, 170, 80], np.float32) if lit else np.array([12, 10, 10], np.float32)
        img[:] = img * (1 - om[..., None]) + inner * om[..., None]
        if lit:
            glow = travel.radial(x, y - T * 0.3, s * 0.6, W, H)
            img[:] = img + glow[..., None] * np.array([120, 70, 30]) * 0.6
    return img


def flock(img, cx, cy, spread, count, rng, color=(222, 210, 188)):
    H, W = img.shape[:2]
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = cx + rng.normal(0, spread)
        y = cy + rng.normal(0, spread * 0.18)
        s = 4.2 + rng.random() * 2.4
        k = 0.8 + 0.3 * rng.random()
        c = tuple(int(v * k) for v in color) + (255,)
        d.ellipse([x - s + 1, y + s * 0.4, x + s + 1, y + s * 0.9], fill=(40, 30, 20, 90))
        d.ellipse([x - s, y - s * 0.6, x + s, y + s * 0.6], fill=c)
    arr = np.asarray(layer, np.float32)
    a = arr[..., 3:4] / 255
    img[:] = img * (1 - a) + arr[..., :3] * a
    return img


def zagros_camp(seed=3, night=False):
    W, H = travel.W, travel.H
    if night:
        img = travel.gradient([(0, (8, 12, 26)), (0.55, (22, 30, 54)), (0.72, (56, 52, 70)), (1, (14, 12, 16))])
        img = travel.stars(img, 2600, seed + 1, limit=0.62)
    else:
        img = travel.gradient([(0, (132, 146, 164)), (0.38, (226, 200, 166)), (0.52, (244, 214, 168)), (1, (96, 80, 58))])
        img = travel.clouds(img, 0, 0.4, (186, 170, 160), (252, 236, 210), seed + 2, scale=820, contrast=0.9)
        img = img + travel.radial(W * 0.68, H * 0.5, 900)[..., None] * np.array([60, 40, 10])
    yy = np.arange(H)[:, None]
    layers = [(0.46, (178, 156, 136)), (0.56, (150, 124, 96)), (0.68, (112, 96, 64)), (0.8, (86, 84, 54))]
    if night:
        layers = [(0.5, (30, 32, 46)), (0.6, (24, 26, 36)), (0.72, (18, 20, 26)), (0.84, (12, 12, 16))]
    ridge_last = None
    for k, (base, c) in enumerate(layers):
        n1 = travel.noise(W, 1, 420 - k * 60, seed * 10 + k)[0]
        n2 = travel.noise(W, 1, 70, seed * 10 + 5 + k)[0]
        ridge = H * base + (n1 - 0.5) * (220 - k * 40) + (n2 - 0.5) * 26
        m = np.clip((yy - ridge[None, :]) / 2 + 0.5, 0, 1)
        tex = travel.fbm(W, H, 140, seed * 10 + 20 + k, octaves=4)
        layer = np.array(c, np.float32) * (0.86 + tex[..., None] * 0.28)
        if k == 3 and not night:
            # Grass on the near slope: green-gold, lit low from the right.
            grass = travel.fbm(W, H, 18, seed + 77, octaves=3)
            layer = layer * (0.86 + grass[..., None] * 0.26)
            layer = layer + travel.radial(W * 0.8, ridge.min(), 1400)[..., None] * np.array([40, 30, 6])
        img = img * (1 - m[..., None]) + layer * m[..., None]
        haze_c = np.array([240, 214, 176]) if not night else np.array([40, 44, 62])
        haze = np.clip((yy - ridge[None, :]) / 220, 0, 1) * (1 - np.clip((yy - ridge[None, :]) / 560, 0, 1))
        img = img * (1 - haze[..., None] * 0.25) + haze_c * haze[..., None] * 0.25
        ridge_last = ridge
    rng = np.random.default_rng(seed)
    gy = int(H * 0.84)
    img = tents(img, [(W * 0.34, gy, 440), (W * 0.53, gy + 26, 320), (W * 0.67, gy + 10, 220)], rng, lit=night)
    if not night:
        flock(img, W * 0.78, gy + 70, 150, 140, rng)
        flock(img, W * 0.18, gy + 110, 90, 60, rng)
        # Smoke from the cooking fire drifts up and to the right.
        smoke = np.zeros((H, W), np.float32)
        yy2, xx2 = np.mgrid[0:H, 0:W].astype(np.float32)
        path_x = W * 0.45 + (gy - yy2) * 0.6
        smoke = np.exp(-((xx2 - path_x) / (20 + (gy - yy2).clip(0) * 0.25)) ** 2) * np.clip((gy - yy2) / 60, 0, 1) * np.clip(1 - (gy - yy2) / 520, 0, 1)
        smoke *= travel.fbm(W, H, 60, seed + 9, octaves=3)
        img = img * (1 - smoke[..., None] * 0.35) + np.array([236, 226, 214]) * smoke[..., None] * 0.35
    return travel.finish(img, grain=3.5, vignette=0.42, seed=seed)


# --------------------------------------------------------------------------
# Compositions
# --------------------------------------------------------------------------

def canvas_for(out, bg, rng, color=None):
    w, h = out[0] * SS, out[1] * SS
    if bg == 'linen':
        return cer.linen(h, w, rng, color or (222, 212, 194))
    if bg == 'wood':
        return wood(h, w, rng, (112, 80, 54))
    if bg == 'paper':
        return cer.paper(h, w, rng, color or (230, 222, 206))
    return cer.plaster(h, w, rng, color or (224, 214, 198))


def finish(canvas, out, seed, vignette=0.18):
    return cer.finish(canvas, out, seed, vignette=vignette)


def socks_scene(seed, out=(1200, 1200), bg='linen', closeup=False):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (214, 204, 186))
    h, w = c.shape[:2]
    if closeup:
        knit(c, [(0, 0), (w, 0), (w, h), (0, h)], sock_pattern('ivory', 'madder', 'indigo'), rng, stitch=26)
    else:
        s = w * 0.44
        knit(c, sock_poly(w * 0.1, h * 0.06, s), sock_pattern('ivory', 'madder', 'indigo'), rng, stitch=8, origin=(w * 0.1, h * 0.06))
        knit(c, sock_poly(w * 0.9 - s * 0.4, h * 0.24, s, flip=True), sock_pattern('ivory', 'indigo', 'madder'), rng, stitch=8, origin=(w * 0.9 - s * 0.4, h * 0.24))
    return finish(c, out, seed)


def gabbeh_scene(seed, out=(1200, 1500), field='madder', closeup=False):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'plaster', rng, (210, 200, 186))
    h, w = c.shape[:2]
    rows, cols_ = 150, 100
    grid, pal = gabbeh_pattern(rows, cols_, rng, field)
    if closeup:
        sub = grid[:52, :40]
        weave(c, -w * 0.05, h * 0.16, w * 1.1, h * 0.96, sub, pal, rng, kind='pile', abrash=0.07, fringe=False)
        # Fringe at the top edge.
        weave(c, -w * 0.05, h * 0.16, w * 1.1, 1, sub[:1], pal, rng, kind='pile', fringe=True)
    else:
        weave(c, w * 0.14, h * 0.1, w * 0.72, h * 0.8, grid, pal, rng, kind='pile', abrash=0.13, sheen=0.16)
    return finish(c, out, seed)


def kilim_scene(seed, out=(1200, 1200), closeup=True, scheme=None):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'plaster', rng)
    h, w = c.shape[:2]
    grid, pal = kilim_pattern(260, 260, rng, scheme or ('madder', 'ivory', 'indigo', 'saffron', 'walnut'))
    if closeup:
        weave(c, -w * 0.02, -h * 0.02, w * 1.04, h * 1.04, grid[:120, :120], pal, rng, kind='flat', abrash=0.06, fringe=False)
    else:
        weave(c, w * 0.12, h * 0.1, w * 0.76, h * 0.8, grid[:180, :170], pal, rng, kind='flat', abrash=0.06)
    return finish(c, out, seed)


def cushion_scene(seed, out=(1200, 1200), scheme=None, pair=False):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'linen', rng, (204, 194, 176))
    h, w = c.shape[:2]
    grid, pal = kilim_pattern(120, 120, rng, scheme or ('madder', 'ivory', 'indigo', 'saffron', 'walnut'))
    if pair:
        grid2, pal2 = kilim_pattern(120, 120, rng, ('indigo', 'ivory', 'madder', 'camel', 'black'))
        cushion(c, w * 0.04, h * 0.18, w * 0.5, grid2, pal2, rng)
        cushion(c, w * 0.44, h * 0.3, w * 0.52, grid, pal, rng)
    else:
        cushion(c, w * 0.15, h * 0.15, w * 0.7, grid, pal, rng)
    return finish(c, out, seed)


def skeins_scene(seed, out=(1600, 1000), bg='wood', colors=('madder', 'walnut', 'indigo', 'saffron', 'ivory', 'madder-deep')):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng)
    h, w = c.shape[:2]
    n = len(colors)
    for i, name in enumerate(colors):
        x = w * (0.14 + 0.72 * i / max(1, n - 1))
        skein(c, x + rng.normal(0, w * 0.01), h * 0.5 + rng.normal(0, h * 0.04), h * 0.78, w * 0.05, math.pi / 2 + rng.normal(0, 0.08), DYE[name], rng)
    return finish(c, out, seed)


def ghee_scene(seed, out=(1200, 1200), bg='linen', lid='cloth'):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (220, 208, 188))
    h, w = c.shape[:2]
    jar_side(c, w * 0.5, h * 0.84, h * 0.58, w * 0.2, rng, lid=lid)
    return finish(c, out, seed, vignette=0.14)


def herb_jar_scene(seed, out=(1200, 1200)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'paper', rng, (226, 220, 206))
    h, w = c.shape[:2]
    jar_side(c, w * 0.5, h * 0.84, h * 0.56, w * 0.18, rng, fill='herb', level=0.86, lid='tin')
    return finish(c, out, seed, vignette=0.12)


def bowl_scene(seed, kind, out=(1200, 1200), bg='linen', material='wood', glaze='oat', scale=0.36):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (220, 210, 192) if bg == 'linen' else None)
    h, w = c.shape[:2]
    R = min(w, h) * scale
    inner = bowl_top(c, w * 0.5, h * 0.5, R, rng, material, glaze)
    mound(c, w * 0.5, h * 0.5, inner, rng, kind)
    return finish(c, out, seed)


def loose_scene(seed, kind, out=(1200, 1200), bg='paper', count=9):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng, (226, 216, 198))
    h, w = c.shape[:2]
    s = w * (0.09 if kind == 'kashk' else 0.1)
    pts = []
    for _ in range(200):
        x, y = w * (0.22 + 0.56 * rng.random()), h * (0.25 + 0.5 * rng.random())
        if all((x - a) ** 2 + (y - b) ** 2 > (2.3 * s) ** 2 for a, b in pts):
            pts.append((x, y))
        if len(pts) >= count:
            break
    for x, y in sorted(pts, key=lambda p: p[1]):
        put_ball(c, x, y, s * (0.85 + 0.3 * rng.random()), rng, kind)
    return finish(c, out, seed)


def bundles_scene(seed, out=(1600, 1000), bg='wood'):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, bg, rng)
    h, w = c.shape[:2]
    herb_bundle(c, w * 0.12, h * 0.24, w * 0.5, 0.2, rng)
    herb_bundle(c, w * 0.2, h * 0.58, w * 0.46, -0.08, rng, color=(126, 118, 100))
    herb_bundle(c, w * 0.5, h * 0.36, w * 0.4, 0.42, rng, color=(96, 110, 80))
    return finish(c, out, seed)


def still_life(seed, out=(2000, 1200)):
    """The hero: a gabbeh corner, ghee, kashk, qara-qurut, thyme and yarn on linen, from above."""
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'linen', rng, (214, 202, 182))
    h, w = c.shape[:2]
    grid, pal = gabbeh_pattern(150, 100, rng, 'madder')
    weave(c, w * 0.52, -h * 0.1, w * 0.56, h * 0.82, grid[60:, :70], pal, rng, kind='pile', abrash=0.08, fringe=False)
    m = min(w, h)
    jar_top(c, w * 0.16, h * 0.34, m * 0.15, rng)
    inner = bowl_top(c, w * 0.39, h * 0.62, m * 0.17, rng, 'wood')
    mound(c, w * 0.39, h * 0.62, inner, rng, 'kashk')
    inner = bowl_top(c, w * 0.66, h * 0.62, m * 0.14, rng, 'ceramic', 'oat')
    mound(c, w * 0.66, h * 0.62, inner, rng, 'herb')
    inner = bowl_top(c, w * 0.86, h * 0.8, m * 0.11, rng, 'ceramic', 'white')
    mound(c, w * 0.86, h * 0.8, inner, rng, 'qurut')
    skein(c, w * 0.16, h * 0.82, m * 0.42, m * 0.06, 0.25, DYE['madder'], rng)
    herb_bundle(c, w * 0.28, h * 0.08, m * 0.4, 0.5, rng)
    return finish(c, out, seed, vignette=0.2)


def box_scene(seed, out=(1200, 1200)):
    """The season box: a little of everything on kraft paper."""
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'paper', rng, (200, 168, 128))
    h, w = c.shape[:2]
    m = min(w, h)
    jar_top(c, w * 0.3, h * 0.3, m * 0.17, rng)
    inner = bowl_top(c, w * 0.7, h * 0.3, m * 0.17, rng, 'wood')
    mound(c, w * 0.7, h * 0.3, inner, rng, 'kashk')
    inner = bowl_top(c, w * 0.3, h * 0.72, m * 0.16, rng, 'ceramic', 'oat')
    mound(c, w * 0.3, h * 0.72, inner, rng, 'herb')
    inner = bowl_top(c, w * 0.7, h * 0.72, m * 0.16, rng, 'ceramic', 'white')
    mound(c, w * 0.7, h * 0.72, inner, rng, 'qurut')
    return finish(c, out, seed)


def ghee_making(seed, out=(1600, 1000)):
    rng = np.random.default_rng(seed)
    c = canvas_for(out, 'wood', rng, (92, 66, 46))
    h, w = c.shape[:2]
    copper_pot(c, w * 0.42, h * 0.5, h * 0.4, rng)
    jar_top(c, w * 0.8, h * 0.32, h * 0.14, rng)
    herb_bundle(c, w * 0.7, h * 0.62, w * 0.22, 0.3, rng)
    return finish(c, out, seed, vignette=0.26)


def landscape(seed, size, focus=0.5, night=False):
    arr = zagros_camp(seed, night)
    return travel.crop(arr, size, focus)


PLAN = {
    'hero': lambda: still_life(1),
    'camp': lambda: landscape(3, (2000, 1100), 0.5),
    'weaving': lambda: skeins_scene(5, (1600, 1000)),
    'pattern': lambda: kilim_scene(7, (2000, 600)),
    # Products, main and alternate.
    'p-ghee': lambda: ghee_scene(11),
    'p-ghee-b': lambda: (lambda rng: finish((lambda c: (jar_top(c, c.shape[1] * 0.5, c.shape[0] * 0.5, c.shape[0] * 0.3, rng), c)[1])(canvas_for((1200, 1200), 'linen', rng, (214, 202, 182))), (1200, 1200), 12))(np.random.default_rng(12)),
    'p-kashk': lambda: bowl_scene(13, 'kashk'),
    'p-kashk-b': lambda: loose_scene(14, 'kashk'),
    'p-qurut': lambda: bowl_scene(15, 'qurut', material='ceramic', glaze='white'),
    'p-qurut-b': lambda: loose_scene(16, 'qurut', bg='linen', count=8),
    'p-thyme': lambda: bowl_scene(17, 'herb', material='wood'),
    'p-thyme-b': lambda: bowl_scene(18, 'herb', material='ceramic', glaze='oat', bg='wood', scale=0.3),
    'p-pennyroyal': lambda: herb_jar_scene(19),
    'p-pennyroyal-b': lambda: bowl_scene(20, 'herb', material='ceramic', glaze='white', bg='paper'),
    'p-gabbeh': lambda: gabbeh_scene(21, (1200, 1200)),
    'p-gabbeh-b': lambda: gabbeh_scene(22, (1200, 1200), closeup=True),
    'p-gabbeh-indigo': lambda: gabbeh_scene(23, (1200, 1200), field='indigo'),
    'p-gabbeh-indigo-b': lambda: gabbeh_scene(24, (1200, 1200), field='indigo', closeup=True),
    'p-cushion': lambda: cushion_scene(25),
    'p-cushion-b': lambda: kilim_scene(26, (1200, 1200)),
    'p-socks': lambda: socks_scene(27),
    'p-socks-b': lambda: socks_scene(28, closeup=True),
    'p-yarn': lambda: skeins_scene(29, (1200, 1200), bg='linen', colors=('madder', 'walnut', 'indigo', 'saffron')),
    'p-yarn-b': lambda: skeins_scene(30, (1200, 1200), bg='wood', colors=('madder-deep', 'madder', 'rose')),
    'p-box': lambda: box_scene(31),
    'p-box-b': lambda: still_life(32, (1200, 1200)),
    # Categories.
    'cat-food': lambda: bowl_scene(41, 'kashk', out=(800, 800)),
    'cat-herbs': lambda: bowl_scene(42, 'herb', out=(800, 800)),
    'cat-woven': lambda: kilim_scene(43, (800, 800)),
    'cat-box': lambda: box_scene(44, (800, 800)),
    # Journal.
    'journal-1': lambda: landscape(51, (1200, 800), 0.45),
    'journal-2': lambda: kilim_scene(52, (1200, 800), scheme=('indigo', 'ivory', 'madder', 'camel', 'black')),
    'journal-3': lambda: ghee_scene(53, (1200, 800), bg='wood'),
    'journal-4': lambda: bowl_scene(54, 'herb', out=(1200, 800), material='ceramic', glaze='white', bg='wood', scale=0.34),
    'journal-5': lambda: skeins_scene(55, (1200, 800)),
    'journal-6': lambda: landscape(56, (1200, 800), 0.5, night=True),
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
