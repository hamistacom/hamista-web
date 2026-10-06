Digits — drop your number font files here
================================================

Copy your Digits .woff2 files (or .woff/.ttf) into this folder. Hamista reads
the weight from each file name automatically, for example:

  Digits-Thin.woff2       → 100
  Digits-Light.woff2      → 300
  Digits-Regular.woff2    → 400
  Digits-Medium.woff2     → 500
  Digits-SemiBold.woff2   → 600
  Digits-Bold.woff2       → 700
  Digits-ExtraBold.woff2  → 800
  Digits-Black.woff2      → 900
  Digits-ExtraBlack.woff2 → 950

If both "FaNum" (Persian digits) and regular files exist for a weight, the
"Persian digits" setting in Hamista → Typography decides which one loads.

Tip: put the files in the child theme (hamista-child/assets/fonts/digits/)
so theme updates never remove them, or upload them in Hamista → Typography.

Digits is used for counters, prices and other numbers. Until a file is present, the body font is used.
