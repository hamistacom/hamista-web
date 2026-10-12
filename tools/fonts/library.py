"""
Copies the licensed font library into Hamista Core as woff2, one folder per family.

    python3 tools/fonts/library.py <folder-with-the-original-files> [slug ...]

Only the Farsi-numeral (FaNum) builds are used, so every digit on the site is
Persian. The folder is searched recursively. Each file is trimmed to the
characters a Persian site draws (Persian/Arabic, basic Latin, punctuation),
keeps all its OpenType features, and is saved as woff2 named
<slug>-<weight>.woff2, which is what includes/fonts/class-library.php expects.
Outlines, names and licence fields are left untouched.
"""
import os
import sys

from fontTools import subset

# Persian and Arabic, basic Latin and Latin-1, general punctuation and symbols.
UNICODES = (
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0308,'
    'U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF'
)

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
    'Estedad-FD[KSHD,wght].woff2': ('estedad', 'variable'),
    'Rooznameh.ttf': ('rooznameh', '400'),
}

for _w, _n in (('100', 'Thin'), ('200', 'ExtraLight'), ('300', 'Light'), ('400', 'Regular'), ('500', 'Medium'),
               ('600', 'SemiBold'), ('700', 'Bold'), ('800', 'ExtraBold'), ('900', 'Black')):
    FILES['PeydaWebFaNum-' + _n + '.woff2'] = ('peyda', _w)
    FILES['KalamehWeb(FaNum)-' + _n + '.woff2'] = ('kalameh', _w)
for _w, _n in (('100', 'Thin'), ('300', 'Light'), ('400', 'Regular'), ('600', 'SemiBold'), ('700', 'Bold'),
               ('800', 'ExtraBold'), ('900', 'Black'), ('950', 'ExtraBlack')):
    FILES['YekanBakhFaNum-' + _n + '.woff2'] = ('yekanbakh', _w)
for _w, _n in (('100', 'Thin'), ('200', 'UltraLight'), ('300', 'Light'), ('400', 'Regular'), ('500', 'Medium'),
               ('600', 'DemiBold'), ('700', 'Bold'), ('800', 'ExtraBold'), ('900', 'Black'), ('950', 'ExtraBlack')):
    FILES['DanaFaNum-' + _n + '.woff2'] = ('dana', _w)
for _w, _n in (('100', 'Thin'), ('200', 'ExtraLight'), ('300', 'Light'), ('400', 'Regular'), ('500', 'Medium'),
               ('700', 'Bold'), ('800', 'ExtraBold'), ('900', 'Black')):
    FILES['Anjoman-FaNum-' + _n + '.woff2'] = ('anjoman', _w)
for _w, _n in (('200', 'UltraLight'), ('300', 'Light'), ('400', 'Regular'), ('500', 'Medium'), ('600', 'SemiBold'),
               ('700', 'Bold'), ('800', 'ExtraBold'), ('900', 'Black')):
    FILES['Dibaj FaNum ' + _n + '.woff2'] = ('dibaj', _w)


def find(root):
    """Map file name -> path for every font under root (macOS metadata skipped)."""
    found = {}
    for folder, _dirs, names in os.walk(root):
        if '__MACOSX' in folder:
            continue
        for name in names:
            found.setdefault(name, os.path.join(folder, name))
    return found


def build(path, dest):
    """Subset to the Persian-site character set, keep every layout feature, write woff2."""
    options = subset.Options()
    options.layout_features = ['*']
    options.flavor = 'woff2'
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.notdef_outline = True
    options.glyph_names = False
    font = subset.load_font(path, options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    subset.save_font(font, dest, options)


if __name__ == '__main__':
    only = set(sys.argv[2:])
    found = find(sys.argv[1])
    for name, (slug, weight) in FILES.items():
        if only and slug not in only:
            continue
        path = found.get(name)
        if not path:
            print('missing', name)
            continue
        folder = os.path.join(OUT, slug)
        os.makedirs(folder, exist_ok=True)
        dest = os.path.join(folder, slug + '-' + weight + '.woff2')
        build(path, dest)
        print(slug, weight, os.path.getsize(path) // 1024, '->', os.path.getsize(dest) // 1024, 'KB')
