#!/bin/sh
set -e
D="$(cd "$(dirname "$0")" && pwd)"
T="$D/../../wp/hamista/languages"
P="$D/../../wp/hamista-core/languages"
python3 $D/build.py $T/hamista.pot $T/fa_IR.po hamista "Hamista 1.0.0" $D/tr_theme.py
python3 $D/build.py $P/hamista-core.pot $P/hamista-core-fa_IR.po hamista-core "Hamista Core 1.0.0" $D/tr_core_admin.py $D/tr_core_auth.py $D/tr_core_elementor.py $D/tr_core_settings.py $D/tr_core_shop.py $D/tr_core_booking.py
python3 $D/lint.py $T/fa_IR.po $P/hamista-core-fa_IR.po | grep -v '^   (latin)' | tail -5
cd /opt/wpdev/wordpress
export WP_CLI_ALLOW_ROOT=1
wp i18n make-mo $T 2>&1 | tail -1
wp i18n make-php $T 2>&1 | tail -1
wp i18n make-mo $P 2>&1 | tail -1
wp i18n make-php $P 2>&1 | tail -1
ls -la $T $P
