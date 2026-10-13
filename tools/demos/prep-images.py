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
    'laurel': ('svg/shape3.png', 120, 'alpha'),
    # About
    'about': ('04/ab2.jpg', 900, 'photo'),
    'star': ('03/shape6.png', 240, 'alpha'),
    # Why us
    'why-bg': ('03/wh-bg.webp', 1920, 'photo'),
    'cloud': ('03/wc1.webp', 700, 'photo'),
    'hand': ('03/wc1.png', 460, 'alpha'),
    'robot': ('03/wc2.png', 520, 'alpha'),
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
    'plan-1': ('03/pr-bg3.png', 600, 'photo'),
    'plan-2': ('03/pr-bg4.png', 600, 'photo'),
    'bolt': ('03/shape7.png', 320, 'alpha'),
    'plan-wave': ('03/pr-bg2.png', 800, 'alpha'),
    # Team
    'tm-1': ('03/tm1.jpg', 640, 'photo'),
    'tm-2': ('03/tm2.jpg', 640, 'photo'),
    'tm-3': ('03/tm3.jpg', 640, 'photo'),
    'tm-4': ('03/tm4.jpg', 640, 'photo'),
    'tm-5': ('03/tm5.jpg', 640, 'photo'),
    # Process icons
    'step-1': ('svg/ic6.png', 120, 'alpha'),
    'step-2': ('svg/ic7.png', 120, 'alpha'),
    'step-3': ('svg/ic8.png', 120, 'alpha'),
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
    'av-6': ('03/cl6.jpg', 120, 'photo'),
    # Contact and blog
    'touch': ('04/get-in-bg.webp', 1600, 'photo'),
    'faq-face': ('03/ab3.jpg', 160, 'photo'),
    'blog-1': ('03/blg1.webp', 900, 'photo'),
    'blog-2': ('03/blg2.webp', 900, 'photo'),
    'blog-3': ('03/blg3.webp', 900, 'photo'),
    'blog-4': ('03/blg4.webp', 1200, 'photo'),
    'blog-5': ('03/blg5.webp', 1200, 'photo'),
    'blog-6': ('04/in1.webp', 1200, 'photo'),
    'footer-bg': ('04/ft-bg3.webp', 1920, 'photo'),
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

DEMOS = {'akhgar': AKHGAR}


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
    print(demo, len(DEMOS[demo]), 'images', total // 1024, 'KB')
