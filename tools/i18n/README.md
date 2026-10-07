# Persian translations

Hand-written Persian catalogs for the theme (`hamista`) and the plugin (`hamista-core`).

Workflow when strings change:

1. Regenerate the templates:
   `wp i18n make-pot wp/hamista-core wp/hamista-core/languages/hamista-core.pot --domain=hamista-core --exclude=./demos,languages`
   and the same for the theme (`--domain=hamista`).
2. `python3 diffpot.py <old.pot> <new.pot>` lists the new strings.
3. Add them to the matching `tr_*.py` dictionary (`~` stands for a zero-width non-joiner).
4. `sh make.sh` rebuilds the `.po`, lints typography and placeholders, and compiles `.mo` / `.l10n.php`.
