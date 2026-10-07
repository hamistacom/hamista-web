#!/usr/bin/env bash
# Reset the local test site to a fresh WordPress with Elementor, WooCommerce,
# Hamista and Hamista Core active, in Persian. Usage: fresh-site.sh
set -e
cd /opt/wpdev/wordpress
export WP_CLI_ALLOW_ROOT=1
wp db reset --yes >/dev/null 2>&1
wp core install --url=http://localhost:8080 --title='هامیستا' --admin_user=admin --admin_password=hamista-i18n-2026 --admin_email=admin@example.com --skip-email >/dev/null 2>&1
wp user update 1 --display_name='تحریریه' --first_name='تحریریه' >/dev/null 2>&1 || true
wp db query "INSERT INTO wp_options (option_name, option_value, autoload) VALUES ('WPLANG','fa_IR','yes') ON DUPLICATE KEY UPDATE option_value='fa_IR'" >/dev/null 2>&1
wp theme activate hamista >/dev/null 2>&1
wp plugin activate elementor >/dev/null 2>&1 || true
wp plugin activate woocommerce >/dev/null 2>&1 || true
wp plugin activate hamista-core >/dev/null 2>&1 || true
wp wc tool run install_pages --user=1 >/dev/null 2>&1 || true
wp option update woocommerce_coming_soon no >/dev/null 2>&1 || true
wp option update woocommerce_onboarding_profile '{"skipped":true}' --format=json >/dev/null 2>&1 || true
wp rewrite structure '/%postname%/' >/dev/null 2>&1
rm -rf wp-content/uploads/20* wp-content/uploads/elementor/css 2>/dev/null || true
echo "fresh: $(wp option get siteurl 2>/dev/null) locale=$(wp eval 'echo get_locale();' 2>/dev/null) plugins=$(wp plugin list --status=active --field=name 2>/dev/null | tr '\n' ' ')"
