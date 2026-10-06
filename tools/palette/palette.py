"""Build the "Pulse" (agency demo) palette in OKLCH and verify WCAG contrast.

Usage: python3 palette.py  → prints CSS tokens and a JSON report.
"""
import json, math, sys

def srgb_to_lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lin_to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055

def hex_to_rgb(h):
    h = h.lstrip('#')
    return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]

def rgb_to_hex(rgb):
    return '#' + ''.join('%02x' % round(max(0, min(1, c)) * 255) for c in rgb)

def rgb_to_oklch(rgb):
    r, g, b = (srgb_to_lin(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(A, B), math.degrees(math.atan2(B, A)) % 360

def oklch_to_rgb(L, C, H):
    A, B = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
    m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
    s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return [r, g, b]

def in_gamut(rgb):
    return all(-1e-4 <= c <= 1 + 1e-4 for c in rgb)

def oklch_hex(L, C, H):
    # Reduce chroma until the colour fits sRGB (keeps lightness and hue).
    while C > 0 and not in_gamut(oklch_to_rgb(L, C, H)):
        C -= 0.002
    return rgb_to_hex([lin_to_srgb(max(0, min(1, c))) for c in oklch_to_rgb(L, C, H)])

def luminance(hexc):
    r, g, b = (srgb_to_lin(c) for c in hex_to_rgb(hexc))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

def ramp(base, lightness, chroma_curve, hue_shift=0.0):
    L0, C0, H0 = rgb_to_oklch(hex_to_rgb(base))
    out = {}
    for i, step in enumerate(STEPS):
        L = lightness[i] if lightness[i] is not None else L0
        h = H0 + hue_shift * (i - 5) / 4
        out[step] = base.lower() if step == 500 and lightness[i] is None else oklch_hex(L, C0 * chroma_curve[i], h)
    return out

# Primary: electric violet. Lightness steps chosen so 600+ carries white text at AA.
primary = ramp('#6a3df5', [0.975, 0.94, 0.88, 0.80, 0.70, None, 0.47, 0.40, 0.33, 0.25],
               [0.12, 0.25, 0.45, 0.70, 0.90, 1, 1, 0.92, 0.80, 0.62], hue_shift=-4)
# Secondary: acid lime, the complement of violet (≈180° apart). Fills only, with ink text.
secondary = ramp('#c6f135', [0.985, 0.965, 0.94, 0.91, None, 0.82, 0.70, 0.58, 0.46, 0.34],
                 [0.25, 0.45, 0.70, 0.90, 1, 1, 0.95, 0.85, 0.72, 0.58])
secondary[400] = '#c6f135'
# Neutrals: grey with a whisper of the primary hue, so surfaces feel related to the brand.
neutral = {s: oklch_hex(L, c, 290) for s, L, c in zip(STEPS,
          [0.985, 0.962, 0.92, 0.86, 0.72, 0.56, 0.45, 0.36, 0.25, 0.17],
          [0.004, 0.006, 0.008, 0.010, 0.014, 0.016, 0.018, 0.020, 0.022, 0.024])}
neutral[950] = oklch_hex(0.135, 0.026, 290)

def sem(base_h, Ls, Cs):
    return {k: oklch_hex(L, C, base_h) for k, L, C in zip(('light', 'default', 'dark'), Ls, Cs)}

semantic = {
    'success': sem(150, (0.95, 0.60, 0.42), (0.05, 0.16, 0.11)),
    'warning': sem(75, (0.96, 0.76, 0.48), (0.06, 0.16, 0.11)),
    'error': sem(27, (0.95, 0.58, 0.44), (0.04, 0.21, 0.16)),
    'info': sem(245, (0.95, 0.58, 0.43), (0.04, 0.16, 0.13)),
}

# Dark-mode ramps: same hues, re-tuned so text and accents hold up on the dark ground.
dark = {
    'bg': neutral[950], 'surface': oklch_hex(0.18, 0.026, 290), 'surface-2': oklch_hex(0.22, 0.026, 290),
    'border': oklch_hex(0.30, 0.024, 290), 'fg': neutral[50], 'fg-muted': oklch_hex(0.74, 0.018, 290),
    'primary': oklch_hex(0.68, 0.19, 285), 'primary-strong': oklch_hex(0.76, 0.14, 285),
    'primary-soft': oklch_hex(0.26, 0.08, 285), 'secondary': secondary[400],
    'success': oklch_hex(0.74, 0.15, 150), 'warning': oklch_hex(0.82, 0.14, 75),
    'error': oklch_hex(0.70, 0.17, 27), 'info': oklch_hex(0.72, 0.13, 245),
}

pairs = [
    ('Body text on page', neutral[900], neutral[50], 'light'),
    ('Body text on white', neutral[900], '#ffffff', 'light'),
    ('Muted text on page', neutral[600], neutral[50], 'light'),
    ('Muted text on white', neutral[600], '#ffffff', 'light'),
    ('Placeholder on white', neutral[500], '#ffffff', 'light'),
    ('Button: white on primary-600', '#ffffff', primary[600], 'light'),
    ('Button hover: white on primary-700', '#ffffff', primary[700], 'light'),
    ('Primary-500 on white (large)', primary[500], '#ffffff', 'light'),
    ('Link: primary-700 on page', primary[700], neutral[50], 'light'),
    ('Chip: primary-800 on primary-100', primary[800], primary[100], 'light'),
    ('Highlight: ink on lime-400', neutral[950], secondary[400], 'light'),
    ('Lime-400 on ink (inverted band)', secondary[400], neutral[950], 'light'),
    ('White on ink (inverted band)', '#ffffff', neutral[950], 'light'),
    ('Success text on success-light', semantic['success']['dark'], semantic['success']['light'], 'light'),
    ('Warning text on warning-light', semantic['warning']['dark'], semantic['warning']['light'], 'light'),
    ('Error text on error-light', semantic['error']['dark'], semantic['error']['light'], 'light'),
    ('Info text on info-light', semantic['info']['dark'], semantic['info']['light'], 'light'),
    ('Error message on white', semantic['error']['default'], '#ffffff', 'light'),
    ('Body text on dark bg', dark['fg'], dark['bg'], 'dark'),
    ('Body text on dark surface', dark['fg'], dark['surface'], 'dark'),
    ('Muted text on dark bg', dark['fg-muted'], dark['bg'], 'dark'),
    ('Muted text on dark surface', dark['fg-muted'], dark['surface'], 'dark'),
    ('Button: ink on primary (dark)', neutral[950], dark['primary'], 'dark'),
    ('Link: primary-strong on dark bg', dark['primary-strong'], dark['bg'], 'dark'),
    ('Chip: primary-strong on primary-soft', dark['primary-strong'], dark['primary-soft'], 'dark'),
    ('Highlight: ink on lime (dark)', neutral[950], dark['secondary'], 'dark'),
    ('Error message on dark bg', dark['error'], dark['bg'], 'dark'),
    ('Success message on dark bg', dark['success'], dark['bg'], 'dark'),
]

report = []
for name, fg, bg, mode in pairs:
    r = contrast(fg, bg)
    report.append({'pair': name, 'fg': fg, 'bg': bg, 'mode': mode, 'ratio': round(r, 2),
                   'AA': r >= 4.5, 'AA_large': r >= 3, 'AAA': r >= 7})

data = {'primary': primary, 'secondary': secondary, 'neutral': neutral, 'semantic': semantic, 'dark': dark, 'contrast': report}
if '--json' in sys.argv:
    print(json.dumps(data, indent=1, ensure_ascii=False))
else:
    for group in ('primary', 'secondary', 'neutral'):
        print('  ' + ' '.join('--hm-color-%s-%s: %s;' % (group, k, v) for k, v in data[group].items()))
    for k, v in semantic.items():
        print('  ' + ' '.join('--hm-color-%s-%s: %s;' % (k, s, c) for s, c in v.items()))
    print('dark:', dark)
    for r in report:
        print('%-42s %s on %s  %5.2f  %s' % (r['pair'], r['fg'], r['bg'], r['ratio'], 'AAA' if r['AAA'] else 'AA' if r['AA'] else 'AA-large' if r['AA_large'] else 'FAIL'))
