"""
Copies the licensed font library into Hamista Core as woff2, one folder per family.

    python3 tools/fonts/library.py <folder-with-the-original-files>

Files are converted to woff2 where needed (format only: outlines, names and
licence fields are left untouched) and renamed <slug>-<weight>.woff2, which is
what includes/fonts/class-library.php expects.
"""
import os
import shutil
import sys

from fontTools.ttLib import TTFont

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'wp', 'hamista-core', 'assets', 'fonts', 'library')

# original file → (slug, weight)
FILES = {
    'RavaghFaNum-Regular.ttf': ('ravagh', '400'),
    'RavaghFaNum-Bold.ttf': ('ravagh', '700'),
    'GramophoneFaNum-Grunge.woff2': ('gramophone', '400'),
    'IRANSansXFaNum-Regular-Wz74WsyA.woff2': ('iransansx', '400'),
    'IRANSansXFaNum-Bold-BI5CXsOm.woff2': ('iransansx', '700'),
    'IRANSansXFaNum-ExtraBlack-DsD9sBfc.woff2': ('iransansx', '900'),
    'Lahzeh-FaNum-Regular.woff2': ('lahzeh', '400'),
    'Lahzeh-FaNum-Medium.woff2': ('lahzeh', '500'),
    'Lahzeh-FaNum-SemiBold.woff2': ('lahzeh', '600'),
    'Lahzeh-FaNum-Bold.woff2': ('lahzeh', '700'),
    'Lahzeh-FaNum-Black.woff2': ('lahzeh', '900'),
    'ModamFaNumWeb-Medium.woff2': ('modam', '500'),
    'ModamFaNumWeb-Bold.woff2': ('modam', '700'),
    'ModamFaNumWeb-ExtraBold.woff2': ('modam', '800'),
    'ModamFaNumWeb-Black.woff2': ('modam', '900'),
    'PeydaFaNum-Light-min.woff2': ('peyda', '300'),
    'PeydaFaNum-Bold-min.woff2': ('peyda', '700'),
    'PeydaFaNum-Black-min.woff2': ('peyda', '900'),
    'Hamrah-FD.woff2': ('hamrah', '400'),
    'DoranFaNum-Thin.woff2': ('doran', '100'),
    'DoranFaNum-Light.woff2': ('doran', '300'),
    'DoranFaNum-Regular.woff2': ('doran', '400'),
    'DoranFaNum-Medium.woff2': ('doran', '500'),
    'DoranFaNum-Bold.woff2': ('doran', '700'),
    'DoranFaNum-ExtraBold.woff2': ('doran', '800'),
    'iranyekanwebthinfanum.woff': ('iranyekan', '100'),
    'iranyekanweblightfanum.woff': ('iranyekan', '300'),
    'iranyekanwebregularfanum.woff': ('iranyekan', '400'),
    'iranyekanwebmediumfanum.woff': ('iranyekan', '500'),
    'iranyekanwebboldfanum.woff': ('iranyekan', '700'),
    'iranyekanwebextraboldfanum.woff': ('iranyekan', '800'),
    'iranyekanwebblackfanum.woff': ('iranyekan', '900'),
    'iranyekanwebextrablackfanum.woff': ('iranyekan', '950'),
    'Pinar-FD-VF[wght-KSHD-DSTY].woff2': ('pinar', 'variable'),
}

if __name__ == '__main__':
    src = sys.argv[1]
    for name, (slug, weight) in FILES.items():
        path = os.path.join(src, name)
        if not os.path.exists(path):
            print('missing', name)
            continue
        folder = os.path.join(OUT, slug)
        os.makedirs(folder, exist_ok=True)
        dest = os.path.join(folder, slug + '-' + weight + '.woff2')
        if name.endswith('.woff2'):
            shutil.copyfile(path, dest)
        else:
            font = TTFont(path)
            font.flavor = 'woff2'
            font.save(dest)
        print(slug, weight, os.path.getsize(dest) // 1024, 'KB')
