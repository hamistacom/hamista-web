"""
Copies supplied demo pictures into a demo's images/ folder as web-sized WebP.

    python3 tools/demos/prep-images.py <demo-id> <source-root>

Each demo lists key -> (relative source path, max width, mode). Modes:
  photo  - WebP quality 80, resized to the max width
  alpha  - WebP keeping transparency (objects, logos)
  ink    - a white logo turned near-black for light backgrounds
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'wp', 'hamista-core', 'demos')

AKHGAR = {
    # Hero
    'hero': ('03/hr1.webp', 900, 'photo'),
    'hero-film': ('03/hr2.webp', 500, 'photo'),
    # About
    'about': ('04/ab2.jpg', 900, 'photo'),
    'star': ('03/shape6.png', 240, 'alpha'),
    # Why us
    'why-bg': ('03/wh-bg.webp', 1920, 'photo'),
    'cloud': ('03/wc1.webp', 700, 'photo'),
    'shield': ('03/wc3.png', 420, 'alpha'),
    'runner': ('03/wc2.webp', 600, 'photo'),
    'faces': ('03/wc5.png', 700, 'alpha'),
    # Services
    'ser-1': ('04/ser1.jpg', 400, 'photo'),
    'ser-2': ('04/ser2.jpg', 400, 'photo'),
    'ser-3': ('04/ser3.jpg', 400, 'photo'),
    'ser-4': ('04/ser4.jpg', 400, 'photo'),
    'ser-5': ('04/ser5.jpg', 400, 'photo'),
    # Projects
    'pro-1': ('03/pro1.webp', 1000, 'photo'),
    'pro-2': ('03/pro2.webp', 1000, 'photo'),
    'pro-3': ('03/pro3.webp', 1000, 'photo'),
    'pro-4': ('03/pro4.webp', 1200, 'photo'),
    'pro-5': ('03/pro5.webp', 1200, 'photo'),
    'pro-6': ('03/pro6.webp', 1200, 'photo'),
    'pro-7': ('03/pro7.webp', 1200, 'photo'),
    # Pricing
    'bolt': ('03/shape7.png', 320, 'alpha'),
    # Team
    'tm-1': ('03/tm1.jpg', 640, 'photo'),
    'tm-2': ('03/tm2.jpg', 640, 'photo'),
    'tm-3': ('03/tm3.jpg', 640, 'photo'),
    'tm-4': ('03/tm4.jpg', 640, 'photo'),
    'tm-5': ('03/tm5.jpg', 640, 'photo'),
    # Process icons
    # Testimonials
    'crowd': ('03/tst-bg.webp', 1920, 'photo'),
    'tst-1': ('03/tst1.jpg', 120, 'photo'),
    'tst-2': ('03/tst2.jpg', 120, 'photo'),
    'tst-3': ('03/tst3.jpg', 120, 'photo'),
    'tst-4': ('03/tst4.jpg', 120, 'photo'),
    'tst-5': ('03/tst5.jpg', 120, 'photo'),
    'av-1': ('03/cl1.jpg', 120, 'photo'),
    'av-2': ('03/cl2.jpg', 120, 'photo'),
    'av-3': ('03/cl3.jpg', 120, 'photo'),
    'av-4': ('03/cl4.jpg', 120, 'photo'),
    'av-5': ('03/cl5.jpg', 120, 'photo'),
    # Contact and blog
    'blog-1': ('03/blg1.webp', 900, 'photo'),
    'blog-2': ('03/blg2.webp', 900, 'photo'),
    'blog-3': ('03/blg3.webp', 900, 'photo'),
    'blog-4': ('03/blg4.webp', 1200, 'photo'),
    'blog-5': ('03/blg5.webp', 1200, 'photo'),
    'blog-6': ('04/in1.webp', 1200, 'photo'),
    # Inner pages
    'office-1': ('04/o3-img-2.webp', 1600, 'photo'),
    'office-2': ('04/o3-img-4.webp', 1600, 'photo'),
    'work-1': ('04/in2.webp', 1200, 'photo'),
    'work-2': ('04/in3.webp', 1200, 'photo'),
    'work-3': ('04/in4.webp', 1200, 'photo'),
    'work-4': ('04/hw1.webp', 900, 'photo'),
    'work-5': ('04/hw2.webp', 900, 'photo'),
    'work-6': ('04/hw3.webp', 900, 'photo'),
}
# Client logos: white originals, plus an ink version for light tiles.
for i, name in enumerate(['sp23', 'sp24', 'sp25', 'sp26', 'sp27', 'sp28', 'sp29']):
    AKHGAR['logo-w-%d' % (i + 1)] = ('svg/%s.png' % name, 360, 'alpha')
    AKHGAR['logo-k-%d' % (i + 1)] = ('svg/%s.png' % name, 360, 'ink')

SEPEHR = {
    # Hero: two round portraits, the card picture and a backdrop
    'orb-a': ('03/hr2.webp', 260, 'photo'),
    'orb-b': ('03/hr4.webp', 200, 'photo'),
    'hero-bg': ('04/ftr-bg.webp', 1920, 'photo'),
    # Services
    'ser-1': ('04/ser7.webp', 560, 'photo'),
    'ser-2': ('04/ser8.webp', 560, 'photo'),
    'ser-3': ('04/ser9.webp', 560, 'photo'),
    # Who we are
    'laptop': ('03/pro7.webp', 700, 'photo'),
    # Projects
    'pro-1': ('04/pro10.webp', 1280, 'photo'),
    'pro-2': ('04/pro11.webp', 850, 'photo'),
    'pro-3': ('04/pro13.webp', 850, 'photo'),
    'pro-4': ('04/pro8.webp', 850, 'photo'),
    'pro-5': ('04/pro9.webp', 440, 'photo'),
    'pro-6': ('04/pro12.webp', 440, 'photo'),
    # Smart solutions
    'chain': ('04/shape11.png', 280, 'alpha'),
    'support': ('04/wc6.png', 220, 'alpha'),
    # Team and reviewers
    'tm-1': ('04/tm6.webp', 330, 'photo'),
    'tm-2': ('04/tm7.webp', 330, 'photo'),
    'tm-3': ('04/tm8.webp', 330, 'photo'),
    'tm-4': ('04/tm9.webp', 330, 'photo'),
    'av-1': ('04/tst_1.webp', 120, 'photo'),
    'av-2': ('04/tst_2.webp', 120, 'photo'),
    'av-3': ('04/tst_3.webp', 120, 'photo'),
    'av-4': ('04/tst_4.webp', 120, 'photo'),
    'av-5': ('04/cl11.jpg', 120, 'photo'),
    # Contact, blog, footer
    'touch': ('04/ft-bg2.webp', 1920, 'photo'),
    'blog-1': ('04/in1.webp', 1200, 'photo'),
    'blog-2': ('04/in2.webp', 1200, 'photo'),
    'blog-3': ('04/in3.webp', 1200, 'photo'),
    'blog-4': ('04/in4.webp', 1200, 'photo'),
    'blog-5': ('03/blg4.webp', 1200, 'photo'),
    'blog-6': ('03/blg5.webp', 1200, 'photo'),
    'office-1': ('04/o3-img-2.webp', 1600, 'photo'),
    'office-2': ('04/o3-img-4.webp', 1600, 'photo'),
    'work-1': ('04/hw1.webp', 900, 'photo'),
    'work-2': ('04/hw2.webp', 900, 'photo'),
    'work-3': ('04/hw3.webp', 900, 'photo'),
}
for i, name in enumerate(['sp23', 'sp24', 'sp25', 'sp26', 'sp27', 'sp28', 'sp29']):
    SEPEHR['logo-w-%d' % (i + 1)] = ('svg/%s.png' % name, 360, 'alpha')
for i in range(1, 8):
    SEPEHR['app-%d' % i] = ('04/wci%d.png' % i, 64, 'alpha')

ARGHAVAN = {
    # Hero: large portrait, a floating sphere
    'hero': ('04/hr2-1.webp', 1020, 'alpha'),
    'ball': ('04/ball.png', 160, 'alpha'),
    # About
    'about': ('04/Image-16.png', 320, 'alpha'),
    'about-2': ('04/Image-18.png', 320, 'alpha'),
    # Process stages and services
    'stage-1': ('04/hw1.webp', 450, 'photo'),
    'stage-2': ('04/hw2.webp', 450, 'photo'),
    'stage-3': ('04/hw3.webp', 450, 'photo'),
    'ser-1': ('04/ser7.webp', 560, 'photo'),
    'ser-2': ('04/ser8.webp', 560, 'photo'),
    'ser-3': ('04/ser9.webp', 560, 'photo'),
    'ser-4': ('03/ser6.webp', 560, 'photo'),
    # Projects
    'pro-1': ('04/pro8.webp', 850, 'photo'),
    'pro-2': ('04/pro9.webp', 440, 'photo'),
    'pro-3': ('04/pro10.webp', 1280, 'photo'),
    'pro-4': ('04/pro11.webp', 850, 'photo'),
    'pro-5': ('04/pro12.webp', 440, 'photo'),
    'pro-6': ('04/pro13.webp', 850, 'photo'),
    # Testimonials
    'tst-1': ('04/tst6.webp', 450, 'photo'),
    'tst-2': ('04/tst7.webp', 390, 'photo'),
    'tst-3': ('04/tm6.webp', 330, 'photo'),
    'tst-4': ('04/tm9.webp', 330, 'photo'),
    'tst-5': ('04/tm7.webp', 330, 'photo'),
    'av-1': ('04/tst_1.webp', 120, 'photo'),
    'av-2': ('04/tst_2.webp', 120, 'photo'),
    'av-3': ('04/tst_3.webp', 120, 'photo'),
    'av-4': ('04/tst_4.webp', 120, 'photo'),
    # Team strip
    'tm-1': ('04/tm10.webp', 350, 'photo'),
    'tm-2': ('04/tm11.webp', 350, 'photo'),
    'tm-3': ('04/tm12.webp', 350, 'photo'),
    'tm-4': ('04/tm13.webp', 350, 'photo'),
    'tm-5': ('04/tm14.webp', 350, 'photo'),
    # Contact, blog, footer
    'dark-bg': ('04/tst-tm-bg.webp', 1920, 'photo'),
    'blog-1': ('04/in1.webp', 1200, 'photo'),
    'blog-2': ('04/in2.webp', 1200, 'photo'),
    'blog-3': ('04/in3.webp', 1200, 'photo'),
    'blog-4': ('04/in4.webp', 1200, 'photo'),
    'blog-5': ('03/blg1.webp', 900, 'photo'),
    'blog-6': ('03/blg2.webp', 900, 'photo'),
    'office-1': ('04/o3-img-2.webp', 1600, 'photo'),
    'office-2': ('04/o3-img-4.webp', 1600, 'photo'),
}
for i, name in enumerate(['sp23', 'sp24', 'sp25', 'sp26', 'sp27', 'sp28', 'sp29']):
    if i < 6:
        ARGHAVAN['logo-w-%d' % (i + 1)] = ('svg/%s.png' % name, 360, 'alpha')
    ARGHAVAN['logo-k-%d' % (i + 1)] = ('svg/%s.png' % name, 360, 'ink')

# Newspaper: the Gazette package pictures (attachment/2026/03).
PRESS = {}
for key, name in [
    ('wave', '1-1.jpg'), ('cafe', '1.jpg'), ('coast', '2-1.jpg'), ('camera', '2.jpg'), ('valley', '3-1.jpg'), ('ridge', '3.jpg'),
    ('hiker', '4-1.jpg'), ('dusk', '4.jpg'), ('harvest', '5.jpg'), ('clouds', '6-1.jpg'), ('daisies', '6.jpg'), ('fog', '7.jpg'),
    ('room', '8.jpg'), ('forest', 'Faces_1.jpg'), ('station', 'Faces_2.jpg'), ('leaf', 'Faces_3.jpg'),
    ('bridge', 'Faces_5.jpg'), ('lake', 'Untitled.jpg'),
]:
    PRESS[key] = ('gazette/' + name, 900, 'photo')

# Resume: Noryx pictures reused for a designer's portfolio.
CV = {
    'portrait': ('04/tm13.webp', 700, 'photo'),
    'portrait-2': ('04/tm6.webp', 640, 'photo'),
    'work-1': ('04/pro10.webp', 1280, 'photo'),
    'work-2': ('04/pro11.webp', 850, 'photo'),
    'work-3': ('04/pro13.webp', 850, 'photo'),
    'work-4': ('04/pro8.webp', 850, 'photo'),
    'work-5': ('04/pro9.webp', 440, 'photo'),
    'work-6': ('04/pro12.webp', 440, 'photo'),
    'work-7': ('03/pro7.webp', 700, 'photo'),
    'studio': ('04/o3-img-4.webp', 1600, 'photo'),
    'blog-1': ('04/in1.webp', 1200, 'photo'),
    'blog-2': ('04/in3.webp', 1200, 'photo'),
    'blog-3': ('04/hw2.webp', 900, 'photo'),
    'av-1': ('04/tst_1.webp', 120, 'photo'),
    'av-2': ('04/tst_2.webp', 120, 'photo'),
    'av-3': ('04/tst_3.webp', 120, 'photo'),
    'av-4': ('04/tst_4.webp', 120, 'photo'),
}

# One-page services: flights, currency and AI subscriptions, social growth.
FLY = {
    'hero': ('old/parvazyar/hero.webp', 2000, 'photo'), 'sky': ('old/parvazyar/sky.webp', 1920, 'photo'),
    'night': ('old/parvazyar/night.webp', 1600, 'photo'), 'card-1': ('old/parvazyar/card-1.webp', 1000, 'photo'),
    'card-2': ('old/parvazyar/card-2.webp', 1000, 'photo'),
}
for i in range(1, 8):
    FLY['dest-%d' % i] = ('old/rahnavard/dest-%d.webp' % i, 700, 'photo')
PAY = {
    'hero': ('old/zarrinbal/silk-hero.webp', 2000, 'photo'), 'wide': ('old/zarrinbal/silk-wide.webp', 1920, 'photo'),
    'tall': ('old/zarrinbal/silk-tall.webp', 900, 'photo'),
    'card-1': ('old/zarrinbal/silk-card-1.webp', 900, 'photo'), 'card-2': ('old/zarrinbal/silk-card-2.webp', 900, 'photo'),
    'card-3': ('old/zarrinbal/silk-card-3.webp', 900, 'photo'),
}
SOCIAL = {
    'crew': ('04/ser1.jpg', 520, 'photo'), 'apps': ('old/apps.webp', 560, 'alpha'),
    'team': ('04/Image-16.png', 320, 'photo'), 'desk': ('04/ab4.webp', 470, 'photo'),
}
for i, n in enumerate(['tm10', 'tm11', 'tm12', 'tm13', 'tm14']):
    SOCIAL['creator-%d' % (i + 1)] = ('04/%s.webp' % n, 350, 'photo')
for i in range(1, 5):
    for d in (PAY, SOCIAL, FLY):
        d['av-%d' % i] = ('04/tst_%d.webp' % i, 120, 'photo')

HOOSHMAND = {
    'light-1': ('old/flux/product-4.webp', 900, 'photo'), 'light-2': ('old/flux/product-3.webp', 900, 'photo'),
    'light-3': ('old/flux/product-5.webp', 900, 'photo'), 'light-4': ('old/flux/product-2.webp', 900, 'photo'),
    'light-5': ('old/flux/product-6.webp', 900, 'photo'), 'wave': ('old/flux/hero.webp', 1920, 'photo'),
    'reel': ('old/flux/reel.webp', 1920, 'photo'), 'silk': ('03/hero-2.webp', 1920, 'photo'), 'silk-2': ('04/why-c-bg.webp', 1920, 'photo'),
    'face-1': ('03/gt7.webp', 420, 'photo'), 'face-2': ('03/hr1.webp', 420, 'photo'), 'face-3': ('03/gt2.webp', 700, 'photo'),
    'office-1': ('04/hw1.webp', 1400, 'photo'), 'office-2': ('04/in2.webp', 1000, 'photo'), 'office-3': ('04/ser5.jpg', 1000, 'photo'),
    'office-4': ('04/ser9.webp', 1000, 'photo'),
    'blog-1': ('03/blg1.webp', 900, 'photo'), 'blog-2': ('03/blg2.webp', 900, 'photo'), 'blog-3': ('03/blg3.webp', 900, 'photo'),
    'blog-4': ('03/blg4.webp', 900, 'photo'),
}
for i in range(1, 5):
    HOOSHMAND['tm-%d' % i] = ('03/tm%d.jpg' % i, 420, 'photo')
    HOOSHMAND['av-%d' % i] = ('04/tst_%d.webp' % i, 120, 'photo')

DEMOS = {'hooshmand': HOOSHMAND, 'fly': FLY, 'pay': PAY, 'social': SOCIAL, 'cv': CV, 'press': PRESS, 'hami': AKHGAR, 'sepehr': SEPEHR, 'arghavan': ARGHAVAN}


def convert(src, dest, width, mode):
    im = Image.open(src)
    has_alpha = mode in ('alpha', 'ink')
    im = im.convert('RGBA' if has_alpha else 'RGB')
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    if mode == 'ink':
        alpha = im.getchannel('A')
        im = Image.new('RGBA', im.size, (24, 24, 26, 255))
        im.putalpha(alpha)
    im.save(dest, 'WEBP', quality=80 if not has_alpha else 88, method=6)


def arc(out):
    """Lays the seven app icons on a shallow arc, for the 'trusted by' card."""
    import math
    sheet = Image.new('RGBA', (560, 220), (0, 0, 0, 0))
    for i in range(7):
        icon = Image.open(os.path.join(out, 'app-%d.webp' % (i + 1))).convert('RGBA').resize((64, 64), Image.LANCZOS)
        a = math.radians(200 + i * 140 / 6)
        x = 280 + math.cos(a) * 240 - 32
        y = 230 + math.sin(a) * 190 - 32
        sheet.alpha_composite(icon, (round(x), round(y)))
    sheet.save(os.path.join(out, 'apps.webp'), 'WEBP', quality=88, method=6)
    for i in range(7):
        os.remove(os.path.join(out, 'app-%d.webp' % (i + 1)))


if __name__ == '__main__':
    demo, root = sys.argv[1], sys.argv[2]
    out = os.path.join(ROOT, demo, 'images')
    os.makedirs(out, exist_ok=True)
    total = 0
    for key, (rel, width, mode) in DEMOS[demo].items():
        src = os.path.join(root, rel)
        if not os.path.exists(src):
            print('missing', key, rel)
            continue
        dest = os.path.join(out, key + '.webp')
        convert(src, dest, width, mode)
        total += os.path.getsize(dest)
    if demo == 'sepehr':
        arc(out)
    print(demo, len(DEMOS[demo]), 'images', total // 1024, 'KB')
