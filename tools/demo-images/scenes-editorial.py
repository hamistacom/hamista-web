"""
Editorial photographs for the Spark academy and the Tapesh agency demos:
printed covers, cards, letterheads, posters and sketch pages laid on a desk.

    python3 tools/demo-images/scenes-editorial.py <spark|agency> <out-dir> [name ...]

Prints are typeset in editorial.html with the theme's licensed Persian fonts
(editorial-render.js), then laid on linen, oak, plaster or concrete: each
sheet gets paper grain, a slight curl of light, a contact shadow and a soft
drop shadow. Props (a graphite pencil, a pen, a ceramic cup) come from the
same light model as the ceramics demo.
"""
import importlib.util
import json
import math
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))


def _load(name, file):
    spec = importlib.util.spec_from_file_location(name, os.path.join(HERE, file))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


nomad = _load('nomad', 'scenes-nomad.py')
cer = nomad.cer
archi = cer.archi
SS = 1  # Prints are already sharp; render the desk at final size.
fnoise = cer.fnoise


# --------------------------------------------------------------------------
# Print rendering
# --------------------------------------------------------------------------

def render_prints(spec, workdir):
    path = os.path.join(workdir, 'spec.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(spec, f, ensure_ascii=False)
    env = dict(os.environ, NODE_PATH='/opt/node-tools/node_modules')
    subprocess.run(['node', os.path.join(HERE, 'editorial-render.js'), path, workdir], check=True, env=env, stdout=subprocess.DEVNULL)


# --------------------------------------------------------------------------
# Desk
# --------------------------------------------------------------------------

def desk(out, bg, rng, color=None):
    w, h = out
    if bg == 'oak':
        return nomad.wood(h, w, rng, color or (176, 140, 100))
    if bg == 'walnut':
        return nomad.wood(h, w, rng, color or (98, 70, 50))
    if bg == 'linen':
        return cer.linen(h, w, rng, color or (222, 214, 200))
    if bg == 'concrete':
        base = archi.texture(h, w, color or (176, 174, 170), rng, rough=1.4) * 255
        pits = (fnoise(h, w, 1.5, 1, rng) > 0.93).astype(np.float32)
        return base * (1 - 0.12 * pits[..., None])
    if bg == 'wall':
        return archi.texture(h, w, color or (226, 222, 214), rng) * 255
    return cer.paper(h, w, rng, color or (230, 226, 218))


def sheet(png, width, rng, gloss=0.0):
    """Load a printed sheet at the given width, with paper grain and a faint fold of light."""
    im = Image.open(png).convert('RGB')
    hgt = int(width * im.height / im.width)
    im = im.resize((int(width), hgt), Image.LANCZOS)
    a = np.asarray(im, np.float32)
    grain = fnoise(hgt, int(width), 1.2, 1, rng)
    fibre = fnoise(hgt, int(width), 6, 2, rng)
    a = a * (0.97 + 0.03 * grain[..., None]) * (0.985 + 0.03 * fibre[..., None])
    # Light falls off a little towards one corner, as a sheet is never quite flat.
    yy, xx = np.mgrid[0:hgt, 0:int(width)].astype(np.float32)
    fall = 1 - 0.06 * ((xx / width) * 0.6 + (yy / hgt) * 0.4)
    a = a * fall[..., None]
    if gloss:
        a = a + (np.exp(-(((xx / width - 0.3) / 0.18) ** 2)) * gloss * 255)[..., None]
    return np.clip(a, 0, 255)


def place(canvas, sheet_rgb, cx, cy, angle_deg, rng, lift=1.0, shadow=0.36):
    """Rotate a sheet and lay it on the canvas centred at (cx, cy) with contact and drop shadows."""
    H, W = canvas.shape[:2]
    sh, sw = sheet_rgb.shape[:2]
    rgba = np.dstack([sheet_rgb, np.full((sh, sw), 255, np.float32)]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA').rotate(angle_deg, resample=Image.BICUBIC, expand=True)
    arr = np.asarray(im, np.float32)
    ph, pw = arr.shape[:2]
    x0, y0 = int(cx - pw / 2), int(cy - ph / 2)
    # Shadow layer in canvas space.
    mask = np.zeros((H, W), np.float32)
    xs0, ys0 = max(0, x0), max(0, y0)
    xs1, ys1 = min(W, x0 + pw), min(H, y0 + ph)
    if xs1 <= xs0 or ys1 <= ys0:
        return canvas
    sub = arr[ys0 - y0:ys1 - y0, xs0 - x0:xs1 - x0]
    mask[ys0:ys1, xs0:xs1] = sub[..., 3] / 255
    m = Image.fromarray((mask * 255).astype(np.uint8))
    big = min(sw, sh)
    for off, blur, k in ((0.03 * lift, 0.05 * lift, shadow), (0.004, 0.006, 0.28)):
        s = m.transform(m.size, Image.AFFINE, (1, 0, -big * off * 0.6, 0, 1, -big * off))
        s = np.asarray(s.filter(ImageFilter.GaussianBlur(max(1, big * blur))), np.float32) / 255
        canvas *= (1 - k * s)[..., None]
    a = sub[..., 3:4] / 255
    canvas[ys0:ys1, xs0:xs1] = canvas[ys0:ys1, xs0:xs1] * (1 - a) + sub[..., :3] * a
    return canvas


def pencil(canvas, x, y, length, angle, rng, body=(36, 36, 38), tip=True):
    """A hexagonal graphite pencil lying on the desk: three visible faces, a sharpened cedar cone."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ca, sa = math.cos(angle), math.sin(angle)
    a = (xx - x) * ca + (yy - y) * sa
    b = -(xx - x) * sa + (yy - y) * ca
    r = length * 0.022
    t = a / length
    cone = 0.12
    rad = np.where(t < cone, r * np.clip(t / cone, 0, 1), r)
    inside = (t >= 0) & (t <= 1) & (np.abs(b) <= rad)
    u = b / np.maximum(rad, 1e-3)
    face = np.where(u < -0.33, 1.15, np.where(u > 0.33, 0.62, 0.9))
    bodyc = np.array(body, np.float32)[None, None, :] * face[..., None]
    gloss = np.exp(-((u + 0.55) / 0.06) ** 2) * 60
    bodyc = bodyc + gloss[..., None]
    cedar = np.array([214, 178, 136], np.float32)[None, None, :] * (0.8 + 0.3 * np.clip(-u * 0.5 + 0.6, 0, 1))[..., None]
    lead = np.array([58, 58, 62], np.float32)[None, None, :] * (0.85 + 0.4 * np.clip(-u, 0, 1))[..., None]
    rgb = np.where((t < cone)[..., None], np.where((t < cone * 0.32)[..., None], lead, cedar), bodyc)
    # Ferrule and eraser at the far end.
    rgb = np.where(((t > 0.93) & (t < 0.975))[..., None], np.array([186, 182, 172], np.float32)[None, None, :] * face[..., None] + gloss[..., None] * 1.5, rgb)
    rgb = np.where((t >= 0.975)[..., None], np.array([206, 120, 108], np.float32)[None, None, :] * face[..., None], rgb)
    msk = inside.astype(np.float32)
    nomad.drop_shadow(canvas, msk, (length * 0.012, length * 0.018), length * 0.012, 0.42)
    nomad.lay(canvas, rgb, nomad.smooth_mask(msk, 0.6))
    return canvas


def pen(canvas, x, y, length, angle, rng, body=(22, 22, 24), clip=(190, 186, 176)):
    """A slim fountain pen: matte barrel, metal clip and nib."""
    H, W = canvas.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ca, sa = math.cos(angle), math.sin(angle)
    a = (xx - x) * ca + (yy - y) * sa
    b = -(xx - x) * sa + (yy - y) * ca
    t = a / length
    r = length * 0.03
    rad = np.where(t < 0.1, r * (0.3 + 0.7 * np.clip(t / 0.1, 0, 1)), np.where(t > 0.95, r * (1 - (t - 0.95) / 0.05 * 0.6), r))
    inside = (t >= 0) & (t <= 1) & (np.abs(b) <= rad)
    u = b / np.maximum(rad, 1e-3)
    nz = np.sqrt(np.clip(1 - u * u, 0, 1))
    light = 0.5 + 0.6 * np.clip(-u * 0.4 + nz * 0.7, 0, 1)
    rgb = np.array(body, np.float32)[None, None, :] * light[..., None] + (np.exp(-((u + 0.45) / 0.08) ** 2) * 70)[..., None]
    nib = (t < 0.1)
    rgb = np.where(nib[..., None], np.array([196, 168, 108], np.float32)[None, None, :] * light[..., None], rgb)
    band = (t > 0.52) & (t < 0.55)
    rgb = np.where(band[..., None], np.array(clip, np.float32)[None, None, :] * light[..., None], rgb)
    clipm = (t > 0.6) & (t < 0.92) & (np.abs(b + r * 0.15) < r * 0.28)
    rgb = np.where(clipm[..., None], np.array(clip, np.float32)[None, None, :] * (0.8 + 0.4 * light)[..., None], rgb)
    msk = inside.astype(np.float32)
    nomad.drop_shadow(canvas, msk, (length * 0.014, length * 0.02), length * 0.014, 0.42)
    nomad.lay(canvas, rgb, nomad.smooth_mask(msk, 0.6))
    return canvas


def cup(canvas, x, y, R, rng, glaze='white'):
    saved = cer.SS
    cer.SS = 1
    cer.piece_top(canvas, x, y, R, 'cup', glaze, rng, handle=True)
    cer.SS = saved
    return canvas


def finish(canvas, out, seed, vignette=0.18, warm=1.0):
    rng = np.random.default_rng(seed + 3)
    h, w = canvas.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    canvas = canvas * (1 - vignette * np.clip(r - 0.55, 0, 1) ** 1.5)[..., None]
    # Window light from the top left.
    canvas = canvas * (0.94 + 0.1 * (1 - (xx / w) * 0.5 - (yy / h) * 0.5))[..., None]
    canvas = canvas * np.array([1.0 + 0.02 * warm, 1.0, 1.0 - 0.02 * warm])
    canvas = canvas + rng.normal(0, 1.4, (h, w))[..., None]
    return Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))


def scene(out, bg, seed, items, props=(), bgc=None, vignette=0.18):
    """items: (png, width_frac, cx_frac, cy_frac, angle, lift). props: ('pencil'|'pen'|'cup', args...)."""
    rng = np.random.default_rng(seed)
    w, h = out
    c = desk(out, bg, rng, bgc)
    for png, wf, x, y, ang, lift in items:
        sh = sheet(png, w * wf, rng)
        place(c, sh, w * x, h * y, ang, rng, lift=lift)
    for p in props:
        kind, args = p[0], p[1:]
        if kind == 'pencil':
            x, y, L, ang = args
            pencil(c, w * x, h * y, w * L, ang, rng)
        elif kind == 'pen':
            x, y, L, ang = args
            pen(c, w * x, h * y, w * L, ang, rng)
        elif kind == 'cup':
            x, y, R, glaze = args
            cup(c, w * x, h * y, min(w, h) * R, rng, glaze)
    return finish(c, out, seed, vignette)


def wall(out, seed, png, wf=0.42, bgc=(226, 222, 214), lit=True):
    """A poster pinned flat to a plaster wall in raking light."""
    rng = np.random.default_rng(seed)
    w, h = out
    c = desk(out, 'wall', rng, bgc)
    if lit:
        sun = archi.mask(w, h, [[(0.55, 0.0), (1.0, 0.0), (1.0, 1.0), (0.85, 1.0)]], 6, 40)
        c *= (0.86 + 0.2 * sun)[..., None]
    sh = sheet(png, w * wf, rng)
    place(c, sh, w * 0.5, h * 0.5, 0, rng, lift=0.5, shadow=0.3)
    return finish(c, out, seed, 0.2)


# --------------------------------------------------------------------------
# Spark: a school for product design and building
# --------------------------------------------------------------------------

SPARK_INK = '#1c1d20'
SPARK_ACCENT = '#2b4aa0'
COURSES = [
    ('course-1', '۰۱', 'طراحی محصول', 'از مسئله تا نمونه‌ی قابل تست', '۱۰ هفته', 'از صفر', 'grid', '#ebe5d9'),
    ('course-2', '۰۲', 'توسعه‌ی وب', 'سایتی که واقعاً بالا می‌آید', '۱۴ هفته', 'مقدماتی تا پیشرفته', 'brace', '#e2e5e2'),
    ('course-3', '۰۳', 'هوش مصنوعی\nکاربردی', 'هوش مصنوعی در خدمت محصول', '۸ هفته', 'متوسط', 'dots', '#e5e1e8'),
    ('course-4', '۰۴', 'کسب‌وکار\nدیجیتال', 'از ایده تا اولین مشتری', '۶ هفته', 'از صفر', 'bars', '#ebe2d4'),
    ('course-5', '۰۵', 'دیزاین سیستم', 'یک زبان مشترک برای تیم', '۶ هفته', 'پیشرفته', 'circle', '#e1e3e9'),
    ('course-6', '۰۶', 'تحلیل داده', 'تصمیم با عدد، نه با حدس', '۸ هفته', 'متوسط', 'lines', '#e8e6de'),
]
WORDS = [('journal-1', 'ایده', 'circle'), ('journal-2', 'ساختن', 'grid'), ('journal-3', 'کاربر', 'dots'), ('journal-4', 'رشد', 'bars'),
         ('journal-5', 'تمرکز', 'arch'), ('journal-6', 'طراحی', 'lines'), ('journal-7', 'کد', 'brace'), ('journal-8', 'سرعت', 'lines')]


def spark_spec():
    spec = []
    for name, num, title, sub, a, b, motif, bg in COURSES:
        spec.append({'name': 'p-' + name, 'w': 1000, 'h': 1400, 'p': {
            't': 'cover', 'bg': bg, 'ink': SPARK_INK, 'accent': SPARK_ACCENT, 'kicker': 'آکادمی جرقه', 'edition': 'فصل پاییز ۱۴۰۵',
            'num': num, 'title': title, 'sub': sub, 'footA': a, 'footB': b, 'motif': motif, 'motifColor': 'rgba(28,29,32,.35)', 'font': 'doran'}})
    for i, kind in enumerate(['phone', 'web', 'flow', 'chart', 'phone', 'web', 'flow', 'chart']):
        spec.append({'name': 'p-sketch-%d' % (i + 1), 'w': 1000, 'h': 1400, 'p': {
            't': 'sketch', 'kind': kind, 'bg': '#f2efe8', 'dot': 'rgba(40,40,60,.16)', 'pencil': '#3c3d42', 'seed': 11 + i * 7,
            'note': ['نسخه‌ی اول — سه صفحه', 'صفحه‌ی اصلی و سه کارت', 'مسیر ثبت‌نام', 'روند هفتگی کاربران فعال'][i % 4]}})
    for name, word, motif in WORDS:
        spec.append({'name': 'p-' + name, 'w': 1200, 'h': 1600, 'p': {
            't': 'poster', 'bg': '#ece7de', 'ink': SPARK_INK, 'accent': SPARK_ACCENT, 'kicker': 'مجله‌ی جرقه', 'word': word, 'font': 'doran', 'weight': 300,
            'caption': 'یادداشت‌هایی درباره‌ی ساختن محصول، از کلاس‌ها و تیم‌های آکادمی جرقه.', 'motif': motif, 'motifColor': 'rgba(43,74,160,.55)'}})
    return spec


def spark_plan(P):
    sk = lambda i: P('p-sketch-%d' % i)
    plan = {
        'hero': lambda: scene((2000, 1200), 'oak', 1, [(sk(1), 0.3, 0.3, 0.5, 4, 1), (P('p-course-1'), 0.24, 0.62, 0.46, -6, 1.2), (P('p-course-3'), 0.24, 0.78, 0.56, 5, 1.4)],
                              [('pencil', 0.1, 0.86, 0.36, -0.12), ('cup', 0.9, 0.18, 0.11, 'white')]),
        'studio': lambda: archi.window_wall(2, out=(1600, 1000), material='plaster', panes=(3, 2)),
        'community': lambda: archi.room(3, out=(1600, 1000), material='plaster'),
        'workspace': lambda: scene((1600, 1000), 'walnut', 4, [(sk(2), 0.3, 0.32, 0.5, -3, 1), (sk(3), 0.3, 0.66, 0.5, 4, 1.2)], [('pencil', 0.22, 0.9, 0.42, -0.06)]),
    }
    for k, (name, *_rest) in enumerate(COURSES):
        bgc = [(222, 214, 200), (210, 206, 198), (220, 210, 196)][k % 3]
        plan[name] = (lambda n=name, s=k, b=bgc: scene((1200, 1200), 'linen', 10 + s, [(P('p-' + n), 0.56, 0.5, 0.5, [-3, 2, -2, 3, -1, 2][s % 6], 1.2)], bgc=b))
        plan[name + '-b'] = (lambda n=name, s=k: scene((1200, 1200), 'oak', 20 + s, [(sk((s % 8) + 1), 0.46, 0.34, 0.52, 3, 1), (P('p-' + n), 0.4, 0.7, 0.48, -5, 1.3)], [('pencil', 0.12, 0.9, 0.5, -0.1)]))
    for i in range(1, 9):
        plan['ui-%d' % i] = (lambda i=i: scene((1200, 1200), ['linen', 'oak', 'paper', 'walnut'][i % 4], 30 + i, [(sk(i), 0.62, 0.5, 0.5, [2, -3, 1, -2][i % 4], 1.2)], [('pencil', 0.08, 0.92, 0.46, -0.08)] if i % 2 else []))
    for name, *_r in WORDS:
        plan[name] = (lambda n=name: wall((1200, 800), 40 + int(n[-1]), P('p-' + n), wf=0.36))
    return plan


# --------------------------------------------------------------------------
# Tapesh: a brand and growth studio
# --------------------------------------------------------------------------

CLIENTS = [
    # key, brand, mark, font, ink, accent, paper, person, role
    ('work-1', 'کافه‌ی ری', 'bean', 'pinar', '#3b2619', '#b9774a', '#efe6d8', 'سارا ری‌شهری', 'مدیر کافه'),
    ('work-2', 'سفرنو', 'wave', 'peyda', '#123f4a', '#4fa3a5', '#e8eeec', 'آرش کامرانی', 'مدیر بازاریابی'),
    ('work-3', 'لیان', 'leaf', 'doran', '#3b2a2a', '#c48f7e', '#f1e9e5', 'لیلا یزدانی', 'بنیان‌گذار'),
    ('work-4', 'کلینیک آرا', 'arch', 'doran', '#22302a', '#7d9483', '#ebeeea', 'دکتر نیلوفر آرام', 'مدیر کلینیک'),
    ('work-5', 'بیمه‌یار', 'shield', 'peyda', '#18264d', '#4569c4', '#e7e9f0', 'کیوان مقدم', 'مدیر محصول'),
    ('work-6', 'نان‌آور', 'bread', 'ravagh', '#3a2614', '#c58a3a', '#f0e7d6', 'حسین نان‌آور', 'مدیر شعبه‌ها'),
]
SERVICES = [
    ('product-1', 'ممیزی کامل\nسئو', 'گزارش ۴۰ صفحه‌ای با فهرست کارها', 'تحویل ۱۰ روزه', 'گزارش', 'lines'),
    ('product-2', 'مدیریت\nاینستاگرام', 'ماهانه ۱۲ پست و ۸ ریلز', 'ماهانه', 'خدمت', 'dots'),
    ('product-3', 'راه‌اندازی\nگوگل ادز', 'ساختار کمپین تا ردیابی تبدیل', 'دو هفته', 'خدمت', 'bars'),
    ('product-4', 'کیت هویت\nبصری', 'لوگو، رنگ، تایپ و راهنمای برند', 'شش هفته', 'پروژه', 'circle'),
    ('product-5', 'تقویم محتوای\n۹۰ روزه', 'تقویم، ایده‌ها و قالب‌ها', 'یک هفته', 'بسته', 'grid'),
    ('product-6', 'ایمیل\nمارکتینگ', 'سه جریان خودکار و قالب‌ها', 'سه هفته', 'خدمت', 'arch'),
]
TAPESH_INK = '#161616'
TAPESH_ACCENT = '#c9452c'
TAPESH_WORDS = [('journal-1', 'سئو', 'lines'), ('journal-2', 'محتوا', 'grid'), ('journal-3', 'تبلیغ', 'bars'),
                ('journal-4', 'برند', 'circle'), ('journal-5', 'داده', 'dots'), ('journal-6', 'شبکه', 'arch')]


def agency_spec():
    spec = []
    for key, brand, mark, font, ink, acc, paper, person, role in CLIENTS:
        base = {'ink': ink, 'accent': acc, 'mark': mark, 'font': font, 'brand': brand}
        spec.append({'name': key + '-card-a', 'w': 1050, 'h': 600, 'p': dict(base, t='card', back=True, bg=paper)})
        spec.append({'name': key + '-card-b', 'w': 1050, 'h': 600, 'p': dict(base, t='card', bg=paper, name=person, role=role, phone='۰۹۱۲ ۴۰۰ ۲۲ ۱۸')})
        spec.append({'name': key + '-letter', 'w': 1240, 'h': 1754, 'p': dict(base, t='letter', bg=paper, line='rgba(0,0,0,.14)',
                                                                         subject='موضوع: خلاصه‌ی گزارش سه‌ماهه',
                                                                         paras=['با سلام؛ گزارش سه ماه گذشته‌ی همکاری را تقدیم می‌کنیم. در این مدت سه هدف اصلی را دنبال کردیم و نتیجه‌ی هر کدام را جداگانه آورده‌ایم.',
                                                                                'بیشترین رشد از جایی آمد که انتظارش را داشتیم: گفت‌وگوی مستقیم با مشتری‌های همیشگی. پیشنهاد ما برای فصل بعد، تمرکز بیشتر بر همین مسیر است.',
                                                                                'جزئیات عددها و برنامه‌ی فصل بعد در پیوست آمده است. برای جلسه‌ی مرور، هفته‌ی آینده در خدمتیم.'],
                                                                         sign=brand, address='تهران، خیابان ولیعصر، کوچه‌ی بهار، پلاک ۱۲', web='')})
        spec.append({'name': key + '-chip-1', 'w': 600, 'h': 900, 'p': {'t': 'swatch', 'bg': '#f5f3ee', 'ink': '#222', 'chip': ink, 'name': 'رنگ اصلی', 'code': ink.upper()}})
        spec.append({'name': key + '-chip-2', 'w': 600, 'h': 900, 'p': {'t': 'swatch', 'bg': '#f5f3ee', 'ink': '#222', 'chip': acc, 'name': 'رنگ تأکید', 'code': acc.upper()}})
        spec.append({'name': key + '-poster', 'w': 1200, 'h': 1600, 'p': {'t': 'poster', 'bg': acc, 'ink': '#fff', 'accent': '#fff', 'kicker': 'هویت بصری · استودیو تپش', 'word': brand, 'font': font, 'weight': 500, 'caption': '', 'motif': None}})
    for key, title, sub, a, b, motif in SERVICES:
        spec.append({'name': key + '-cover', 'w': 1000, 'h': 1400, 'p': {
            't': 'cover', 'bg': '#ebe9e4', 'ink': TAPESH_INK, 'accent': TAPESH_ACCENT, 'kicker': 'استودیو تپش', 'edition': b,
            'num': '', 'title': title, 'sub': sub, 'footA': a, 'footB': 'تپش', 'motif': motif, 'motifColor': 'rgba(201,69,44,.6)', 'font': 'peyda'}})
    for key, word, motif in TAPESH_WORDS:
        spec.append({'name': key + '-poster', 'w': 1200, 'h': 1600, 'p': {
            't': 'poster', 'bg': '#e9e7e2', 'ink': TAPESH_INK, 'accent': TAPESH_ACCENT, 'kicker': 'یادداشت‌های تپش', 'word': word, 'font': 'peyda', 'weight': 700,
            'caption': 'آنچه هر هفته از کار روی برندها و کمپین‌ها یاد می‌گیریم.', 'motif': motif, 'motifColor': 'rgba(201,69,44,.7)'}})
    spec.append({'name': 'report', 'w': 1240, 'h': 1754, 'p': {
        't': 'report', 'bg': '#f4f2ee', 'ink': TAPESH_INK, 'accent': TAPESH_ACCENT, 'kicker': 'گزارش هفتگی · هفته‌ی ۳۲', 'title': 'هزینه‌ی هر سفارش\nبه کمترین رقم سال رسید',
        'figs': [['۴۱٪', 'کاهش هزینه‌ی هر رزرو'], ['۲٫۴٪', 'نرخ تبدیل فروشگاه'], ['۶۸ هزار', 'دنبال‌کننده‌ی واقعی']],
        'values': [32, 36, 35, 44, 41, 52, 58, 61, 66, 72], 'note': 'از هفته‌ی بیست‌وچهارم، بودجه از کمپین‌های عمومی به جست‌وجوی برند منتقل شد؛ نتیجه در نمودار پیداست.'}})
    return spec


def agency_plan(P):
    plan = {}
    for i, (key, *_r) in enumerate(CLIENTS):
        bg = ['concrete', 'linen', 'oak', 'concrete', 'paper', 'walnut'][i]
        plan[key] = (lambda k=key, s=i, b=bg: scene((1600, 1200), b, 60 + s, [
            (P(k + '-letter'), 0.34, 0.3, 0.5, -3, 1),
            (P(k + '-card-a'), 0.22, 0.66, 0.3, 6, 1.3), (P(k + '-card-b'), 0.22, 0.7, 0.52, -4, 1.4),
            (P(k + '-chip-1'), 0.1, 0.62, 0.8, 2, 1.1), (P(k + '-chip-2'), 0.1, 0.76, 0.8, -3, 1.2),
        ], [('pen', 0.08, 0.9, 0.3, -0.18)] if s % 2 == 0 else []))
        plan[key + '-b'] = (lambda k=key, s=i: wall((1200, 1200), 70 + s, P(k + '-poster'), wf=0.46))
    for i, (key, *_r) in enumerate(SERVICES):
        plan[key] = (lambda k=key, s=i: scene((1200, 1200), ['concrete', 'linen', 'paper'][s % 3], 80 + s, [(P(k + '-cover'), 0.56, 0.5, 0.5, [-2, 3, -3][s % 3], 1.2)]))
    for i, (key, *_r) in enumerate(TAPESH_WORDS):
        plan[key] = (lambda k=key, s=i: wall((1200, 800), 90 + s, P(k + '-poster'), wf=0.36, bgc=(214, 212, 206)))
    plan['hero'] = lambda: scene((2000, 1200), 'concrete', 101, [
        (P('work-4-letter'), 0.24, 0.24, 0.48, -4, 1), (P('work-2-card-a'), 0.15, 0.48, 0.28, 8, 1.3), (P('work-2-card-b'), 0.15, 0.5, 0.56, -5, 1.4),
        (P('product-4-cover'), 0.2, 0.74, 0.46, 4, 1.4), (P('work-6-chip-2'), 0.07, 0.88, 0.8, -6, 1.1), (P('work-1-chip-1'), 0.07, 0.95, 0.75, 4, 1.1),
    ], [('pen', 0.36, 0.88, 0.22, -0.2), ('cup', 0.9, 0.16, 0.1, 'night')], bgc=(168, 166, 162))
    plan['dashboard'] = lambda: scene((1600, 1000), 'oak', 102, [(P('report'), 0.36, 0.42, 0.5, -3, 1)], [('pen', 0.62, 0.86, 0.28, -0.3), ('cup', 0.82, 0.3, 0.12, 'oat')])
    plan['showreel'] = lambda: scene((1600, 1000), 'concrete', 103, [
        (P('work-1-poster'), 0.22, 0.2, 0.5, -3, 1.2), (P('work-5-poster'), 0.22, 0.46, 0.5, 2, 1.3), (P('work-6-poster'), 0.22, 0.72, 0.5, -2, 1.4)], bgc=(172, 170, 166))
    for i in range(1, 5):
        plan['social-%d' % i] = (lambda i=i: wall((1200, 1200), 110 + i, P(CLIENTS[i][0] + '-poster'), wf=0.44))
    return plan


if __name__ == '__main__':
    which, out_dir = sys.argv[1], sys.argv[2]
    only = set(sys.argv[3:])
    os.makedirs(out_dir, exist_ok=True)
    work = os.path.join(tempfile.gettempdir(), 'hm-editorial-' + which)
    os.makedirs(work, exist_ok=True)
    spec = spark_spec() if which == 'spark' else agency_spec()
    if not os.environ.get('HM_SKIP_PRINTS'):
        render_prints(spec, work)
    P = lambda n: os.path.join(work, n + '.png')
    plan = spark_plan(P) if which == 'spark' else agency_plan(P)
    total = 0
    for name, make in plan.items():
        if only and name not in only:
            continue
        im = make()
        if isinstance(im, np.ndarray):
            im = Image.fromarray(im)
        path = os.path.join(out_dir, name + '.webp')
        im.save(path, 'WEBP', quality=84, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(name, kb, 'KB', flush=True)
    print('total', total, 'KB')
