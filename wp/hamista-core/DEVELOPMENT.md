# Hamista Core — developer guide

Hamista is split in two on purpose:

| Package | Role |
|---|---|
| `hamista` (theme) | Presentation only: design tokens, style kits, header/footer/blog/shop templates. Works alone. |
| `hamista-core` (plugin) | Features: Elementor widgets, motion engine, settings panel, OTP login, templates builder, demo import. |
| `hamista-child` | Where site owners put their own CSS/PHP. |

## Conventions

- **PHP 7.4+**, WordPress Coding Standards (tabs, Yoda conditions, escape late, sanitize early). No union types, `match`, named args or `?->`.
- **Namespaces** `Hamista\Core\<Module>\<Class>`; autoloaded from `includes/<module>/class-<class>.php` (underscores → dashes, lower case).
- **Prefixes**: CSS classes `hm-`, CSS variables `--hm-`, PHP functions `hamista_core_`, hooks `hamista_core/...`, options `hamista_*`, REST namespace `hamista/v1`, JS global `window.Hamista`.
- **Text domain** `hamista-core` (plugin) and `hamista` (theme). Source strings are English; Persian ships as `fa_IR`.
- **No global libraries** (no GSAP, Swiper, jQuery UI) — they collide with other plugins. jQuery is used only where WordPress itself requires it (media modal, color picker in admin).
- **Assets load only where used**: widgets declare dependencies through `get_script_depends()` / `get_style_depends()`.
- **Zero-specificity resets**: element rules use `:where()` so any plugin style can win without `!important`.

## Settings

All settings live in one option, `hamista_options`.

- Defaults: `includes/settings/defaults.php` (cheap; read on every request).
- Labels, choices and conditions: `includes/settings/schema.php` (admin/REST only).
- Read a value: `hamista_core_option( 'key' )` in the plugin, `hamista_option( 'key' )` in the theme.
- Field types: `toggle, select, cards, color, range, number, text, url, password, textarea, code, media, repeater, fonts, action`.
- Field keys: `label, desc, default, choices, min, max, step, unit, placeholder, fields, show_if, requires, group, width, mode, action, button, input, presets, add`.
- Add a setting: one line in `defaults.php`, one entry in `schema.php`. Sanitisation and UI follow automatically.

REST (all require `manage_options`, `X-WP-Nonce: wp_rest`):

| Route | Method | Body | Returns |
|---|---|---|---|
| `/hamista/v1/settings` | GET | — | values |
| `/hamista/v1/settings` | POST | `{ values: {...} }` | `{ values, message }` |
| `/hamista/v1/settings/reset` | POST | `{ section? }` | `{ values }` |
| `/hamista/v1/settings/import` | POST | `{ data: { hamista: "1.0.0", values: {...} } }` | `{ values, message }` |
| `/hamista/v1/tools/elementor-css` | POST | — | `{ message }` |
| `/hamista/v1/tools/flush-fonts` | POST | — | `{ message }` |
| `/hamista/v1/auth/test` | POST | `{ mobile }` | `{ ok, message }` |
| `/hamista/v1/demos/plugins` | POST | `{ slug }` (`elementor` \| `woocommerce`) | `{ ok, message }` |
| `/hamista/v1/demos/<id>/import` | POST | `{ step, batch, options }` | `{ done, next: {step,batch}\|null, progress, message }` |
| `/hamista/v1/demos/uninstall` | POST | — | `{ ok, message }` |

## Admin app

`includes/admin/class-admin.php` registers the **Hamista** menu and prints one root node. `assets/admin/admin.js` renders everything from `window.hamistaAdmin`:

```js
hamistaAdmin = {
  schema,          // Settings::schema() — sections → fields; sections with `view` are special screens
  values,          // Settings::admin_values() — includes `_media: { id: url }` for previews
  rest: { root, nonce },
  demos: [ { id, title, desc, thumb, preview, kit, required: ['elementor'], recommended: ['woocommerce'], pages: ['Home 1', ...] } ],
  plugins: { elementor: { installed, active, name }, woocommerce: {...} },
  system: [ { label, value, ok } ],
  links: { templates, messages, menus, widgets, customize, docs },
  lastTestCode, // only in test mode, admins only
  i18n: { ... }
}
```

## Motion engine (`assets/js/hamista.js`)

`window.Hamista` exposes:

- `Hamista.init(scope)` — initialise everything inside `scope` (document or an Elementor element). Safe to call repeatedly.
- `Hamista.register(name, fn)` — widget module; runs once per `[data-hm-widget="name"]` element.
- `Hamista.scrub(el, { mode: 'through'|'pin'|'enter', update(p) })` — scroll-linked callback with progress 0→1, measured once per resize (no layout reads while scrolling).
- `Hamista.scroll.to(y)`, `Hamista.scroll.velocity` — smooth scroll API.
- Attributes: `data-hm-reveal`, `data-hm-delay`, `data-hm-parallax`, `data-hm-magnetic`, `data-hm-count`, `data-hm-motion` (JSON from the Elementor "Hamista Motion" panel).

Every effect is skipped when the visitor prefers reduced motion.

## Templates override

Front-end templates in `templates/` can be overridden from a theme at `hamista-core/<name>.php`.
