Yekan Bakh — drop your licensed font files here
================================================

Copy your Yekan Bakh .woff2 files (or .woff/.ttf) into this folder. Hamista reads
the weight from each file name automatically, for example:

  YekanBakhFaNum-Thin.woff2       → 100
  YekanBakhFaNum-Light.woff2      → 300
  YekanBakhFaNum-Regular.woff2    → 400
  YekanBakhFaNum-Medium.woff2     → 500
  YekanBakhFaNum-SemiBold.woff2   → 600
  YekanBakhFaNum-Bold.woff2       → 700
  YekanBakhFaNum-ExtraBold.woff2  → 800
  YekanBakhFaNum-Black.woff2      → 900
  YekanBakhFaNum-ExtraBlack.woff2 → 950

If both "FaNum" (Persian digits) and regular files exist for a weight, the
"Persian digits" setting in Hamista → Typography decides which one loads.

Tip: put the files in the child theme (hamista-child/assets/fonts/yekan-bakh/)
so theme updates never remove them, or upload them in Hamista → Typography.

Until a file is present, the bundled Vazirmatn font is used.
