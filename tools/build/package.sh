#!/usr/bin/env bash
# Builds the release files into dist/:
#   hamista.zip         theme (carries hamista-core.zip in inc/plugins/ for the one-click install)
#   hamista-core.zip    companion plugin
#   hamista-child.zip   child theme
#   hamista-package.zip all of the above plus documentation/
#
# Needs: node + esbuild (NODE_PATH), python3 + markdown, zip.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIST="$ROOT/dist"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

echo "› minifying assets"
node "$ROOT/tools/build/minify.js" >/dev/null

echo "› staging"
rm -rf "$DIST"
mkdir -p "$DIST" "$STAGE/pkg"
for pkg in hamista hamista-core hamista-child; do
	cp -R "$ROOT/wp/$pkg" "$STAGE/$pkg"
done

# Developer-only files stay in the repository.
rm -f "$STAGE/hamista-core/DEVELOPMENT.md"
find "$STAGE" -name '.DS_Store' -o -name '*.map' -o -name 'Thumbs.db' | xargs -r rm -f

echo "› plugin"
(cd "$STAGE" && zip -qr -X "$DIST/hamista-core.zip" hamista-core)

echo "› theme (bundling the plugin)"
mkdir -p "$STAGE/hamista/inc/plugins"
cp "$DIST/hamista-core.zip" "$STAGE/hamista/inc/plugins/hamista-core.zip"
(cd "$STAGE" && zip -qr -X "$DIST/hamista.zip" hamista)

echo "› child theme"
(cd "$STAGE" && zip -qr -X "$DIST/hamista-child.zip" hamista-child)

echo "› documentation"
mkdir -p "$STAGE/pkg/documentation"
cp "$ROOT/docs/guide-fa.md" "$ROOT/docs/guide-en.md" "$ROOT/docs/CHANGELOG.md" "$STAGE/pkg/documentation/"
python3 "$ROOT/tools/build/docs.py" "$STAGE/pkg/documentation" >/dev/null
cp "$ROOT/wp/hamista-core/DEVELOPMENT.md" "$STAGE/pkg/documentation/developer-reference.md"
cp "$DIST"/hamista.zip "$DIST"/hamista-core.zip "$DIST"/hamista-child.zip "$STAGE/pkg/"
(cd "$STAGE/pkg" && zip -qr -X "$DIST/hamista-package.zip" .)

echo
(cd "$DIST" && ls -l --block-size=K *.zip | awk '{printf "  %-22s %s\n", $9, $5}')
