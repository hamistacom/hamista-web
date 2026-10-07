#!/usr/bin/env bash
# Fresh WordPress installed from the release zips in dist/ (what a customer does),
# instead of the symlinks used while developing. Restore the symlinks with dev-links.sh.
# Usage: zip-site.sh
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export WP_CLI_ALLOW_ROOT=1
cd /opt/wpdev/wordpress
for item in themes/hamista themes/hamista-child plugins/hamista-core; do
	rm -rf "wp-content/$item"
done
wp db reset --yes >/dev/null 2>&1
wp core install --url=http://localhost:8080 --title='هامیستا' --admin_user=admin --admin_password=hamista-i18n-2026 --admin_email=admin@example.com --skip-email >/dev/null 2>&1
wp db query "INSERT INTO wp_options (option_name, option_value, autoload) VALUES ('WPLANG','fa_IR','yes') ON DUPLICATE KEY UPDATE option_value='fa_IR'" >/dev/null 2>&1
wp theme install "$ROOT/dist/hamista.zip" >/dev/null 2>&1
wp theme install "$ROOT/dist/hamista-child.zip" --activate >/dev/null 2>&1
# The bundled copy inside the theme is what the one-click installer uses.
wp plugin install wp-content/themes/hamista/inc/plugins/hamista-core.zip --activate >/dev/null 2>&1
wp plugin activate elementor >/dev/null 2>&1 || true
wp plugin activate woocommerce >/dev/null 2>&1 || true
wp wc tool run install_pages --user=1 >/dev/null 2>&1 || true
wp option update woocommerce_coming_soon no >/dev/null 2>&1 || true
wp option update woocommerce_onboarding_profile '{"skipped":true}' --format=json >/dev/null 2>&1 || true
wp rewrite structure '/%postname%/' >/dev/null 2>&1
rm -rf wp-content/uploads/20* wp-content/uploads/elementor/css 2>/dev/null || true
echo "zip site: theme=$(wp theme list --status=active --field=name 2>/dev/null) plugins=$(wp plugin list --status=active --field=name 2>/dev/null | tr '\n' ' ')"
