#!/usr/bin/env bash
# Fresh site → import one demo → thumbnail. Usage: demo-cycle.sh <demo-id>
set -e
ID="$1"
DIR="$(cd "$(dirname "$0")" && pwd)"
node "$DIR/../demos/build.js" "$ID"
"$DIR/fresh-site.sh"
cd /opt/wpdev/wordpress
WP_CLI_ALLOW_ROOT=1 wp eval-file "$DIR/import-demo.php" "$ID" 2>&1 | grep -E "^(ERROR|links|total)" || true
cd "$DIR" && NODE_PATH=/opt/node-tools/node_modules node thumb.js "$ID" 2>&1 | grep -v "agent-proxy\|gravatar\|For details\|connections through"
