#!/usr/bin/env bash
# Point the local test site back at the repository (symlinks), for development.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd /opt/wpdev/wordpress/wp-content
rm -rf themes/hamista themes/hamista-child plugins/hamista-core
ln -s "$ROOT/wp/hamista" themes/hamista
ln -s "$ROOT/wp/hamista-child" themes/hamista-child
ln -s "$ROOT/wp/hamista-core" plugins/hamista-core
echo "linked to $ROOT/wp"
