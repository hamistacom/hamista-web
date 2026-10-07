# Hamista — documentation

Hamista is a Persian-first (RTL) multipurpose theme for Elementor. The **theme** is the presentation layer; the companion plugin **Hamista Core** supplies the widgets, the settings panel, the motion engine, mobile OTP login and the demo importer. Switching themes later never costs you content or widgets.

A full Persian guide is in `guide-fa.md`. This page is the short English version, plus the developer notes.

## What is in the package

| File | Purpose |
|---|---|
| `hamista.zip` | The theme. It carries Hamista Core inside and installs it with one click. |
| `hamista-core.zip` | The companion plugin on its own (for manual installs). |
| `hamista-child.zip` | Child theme for your CSS, PHP and font files. |
| `documentation/` | This guide, the Persian guide and the changelog. |

## Requirements

- WordPress 6.4+, PHP 7.4+ (8.1+ recommended)
- Elementor (free is enough; tested with 4.0)
- WooCommerce for the shop demos (tested with 11)
- 256 MB PHP memory. The demo importer runs in small steps, so ordinary shared hosting is fine.

## Install

1. **Appearance → Themes → Add New → Upload Theme**: upload `hamista.zip`, then activate it.
2. Click **Install Hamista Core** in the notice that appears (the plugin zip ships inside the theme).
3. Open **Hamista** in the admin menu. If Elementor is missing, the *Demo import* screen installs it for you.
4. Optional but recommended: install and activate `hamista-child.zip`.

## Demos

**Hamista → Demo import**. Pick a demo, choose what to import (content, menus, settings & style kit, set as front page) and press *Import*. Everything a demo creates is tagged, so **Uninstall demo content** removes only that and leaves your own content alone.

| Demo | Id / style kit | Character |
|---|---|---|
| سازه (Sazeh) | `sazeh` / `stone` | architecture and interior studio; complete site, 14 pages, 8 portfolio projects |
| دادگر (Dadgar) | `dadgar` / `counsel` | law firm with online consultation booking; complete site, 16 pages, 6 lawyers |
| گلینه (Gelineh) | `gelineh` / `clay` | handmade ceramics shop; complete store, 10 products (needs WooCommerce) |
| ره‌نورد (Rahnavard) | `rahnavard` / `voyage` | travel agency, cinematic slider |
| پروازیار (Parvazyar) | `parvazyar` / `azure` | flight tickets, search over clouds |
| خانه‌ی حکمت (Hekmat) | `hekmat` / `ink` | reading circles, astrolabe and calligraphy |
| زرین‌بال (Zarrinbal) | `zarrinbal` / `aurum` | private aviation, black and gold |
| رشد (Roshd) | `roshd` / `coral` | management consulting, bento panels |
| جرقه (Spark) | `spark` | editorial, calm, large type |
| تپش (Pulse) | `agency` / `pulse` | colourful digital-marketing agency |
| صنایع هامون (Hamoon Industries) | `industrial` | skeuomorphic control-panel look |
| شهدینه (Shahdineh) | `honey` | natural honey shop (needs WooCommerce) |
| کوچ (Kooch) | `nomad` | modern organic nomadic products (needs WooCommerce) |
| سیال (Sayal) | `flux` | motion studio; graphite, ivory and ember |

Each demo is built with Elementor and Hamista widgets, with light and dark modes. The complete-site demos also ship a page per service or practice area, portfolio projects or bookable profiles, FAQ, careers and contact. Imagery is original and bundled; nothing is fetched from the internet.

## Fonts

Ten Persian families are bundled: IRANYekan, IRANSansX, Peyda, Pinar, Doran, Ravagh, Lahzeh, Modam, Hamrah and Gramophone. In **Hamista → Typography → Font library** switch any family or weight on or off; a family that is off leaves every font menu, Elementor's included, and is never downloaded. Pages load only the families and weights they use.

Your own fonts: upload them under **Hamista → Typography → Your own fonts**. For Yekan Bakh and Digits you can also drop `.woff2` files into `wp-content/themes/hamista-child/assets/fonts/yekan-bakh/` or `…/digits/`; the weight is read from each file name. Nothing is loaded from Google.

## Settings

One panel, saved over REST without a page reload: style kit and content width (default 1320 px), colours and dark mode, typography, header (including the mobile quick-action bar), footer, blog, shop, motion, login & SMS, performance, custom code, and tools (export/import, regenerate Elementor CSS, clear font cache).

## Widgets (28)

**Motion**: Scroll Zoom (in and out), Horizontal Scroll, Depth Scroll, Floating Elements, Scroll Text Reveal, Scroll Path Story, Stacking Cards, Image Reveal, Marquee.
**Content**: Hero, Heading, Buttons, Features, Counters, Steps / Timeline, Tabs Showcase, FAQ / Accordion, Pricing Plans, Testimonials, Team, Device Mockup, Call to Action, Posts, Products.
**Forms & users**: Contact Form, Multi-step Form, Contact Info & Map, Mobile Login (OTP).

The motion engine (`window.Hamista`) is dependency-free: one `requestAnimationFrame` loop, `IntersectionObserver` reveals, no GSAP or jQuery. It honours `prefers-reduced-motion`, can be toned down on phones (**Hamista → Motion**), and each widget loads its script and styles only on pages that use it.

### Scroll effects on any element

Set in Elementor → Advanced → Hamista Motion, on any widget or container:

- **Scroll zoom**: zoom in, zoom out, open out to full width, close into a card as it leaves, or fly through; with an amount and an optional counter-move of the image inside.
- **Card motion** (containers): the items inside, or the cards of the single widget inside, rise one after another, flip up, deal out from a pile, close in from around, or lean with the scroll.
- **Page colour while in view** (containers): the whole page fades to the section's colour (dark, accent, accent tint or your own) as it reaches the middle of the screen; text, lines and cards follow.
- **Light line** (containers, or the whole page under Page settings → Hamista scroll effects): a thread of light drawn down the margins with the scroll, weaving across between sections and shifting colour down the page.

The code for these effects loads only on pages that use them.

## Mobile login (OTP) and the user panel

**Hamista → Login & SMS**: switch on mobile login, pick a provider (Kavenegar, Melipayamak, SMS.ir, IPPanel, Ghasedak, or a custom HTTP API), enter the credentials and send a test code. Until a provider is chosen the module runs in *test mode*: nothing is sent and the latest code is visible to administrators only.

Codes are stored hashed, single-use and short-lived; requests are rate-limited per number and per IP, with a honeypot field. Behind a CDN or proxy, supply the real address through the `hamista_core/otp_client_ip` filter. WooCommerce's *My Account* and checkout use the same form. On sites without WooCommerce, create a page containing `[hamista_account]` and select it as the login page.

Shortcodes: `[hamista_login]`, `[hamista_account]`.

## Child theme

Add CSS to `hamista-child/style.css` and PHP to `functions.php`. Override design tokens:

```css
:root {
  --hm-accent: #e8590c;
  --hm-container: 1280px;
}
```

To change a template, copy it into the child theme with the same path.

## For developers

Conventions: PHP 7.4+, WordPress Coding Standards; CSS classes `hm-`, CSS variables `--hm-`, PHP functions `hamista_`, hooks `hamista_core/…` and `hamista/…`, REST namespace `hamista/v1`. Details and the REST reference are in `hamista-core/DEVELOPMENT.md`.

Useful hooks: `hamista_core/elementor_widgets`, `hamista_core/settings_schema`, `hamista_core/settings_defaults`, `hamista_core/sms_gateways`, `hamista_core/otp_pre_send`, `hamista_core/find_user_by_mobile`, `hamista_core/new_user_data`, `hamista_core/login_redirect`, `hamista_core/user_registered`, `hamista_core/mobile_verified`, `hamista_core/form_submitted`, `hamista/dynamic_css`, `hamista/font_families`, `hamista/header/render`, `hamista/footer/render`.

**Add a style kit**: create `assets/css/kits/<slug>.css` that defines the `--hm-*` tokens under `.hm-kit-<slug>` (copy `spark.css`), then register the slug in `inc/assets.php` and the kit picker in `settings/schema.php`.

**Add a widget**: extend `Hamista\Core\Elementor\Widget_Base` in `includes/elementor/widgets/class-<name>.php` and add the short class name to `widget_list()` (or the `hamista_core/elementor_widgets` filter).

**Build the demos**: demo definitions live in `tools/demos/` and compile to `content.json` + `manifest.json` (`node tools/demos/build.js`).

**Release build**:

```bash
npm i esbuild
node tools/build/minify.js     # writes .min.css / .min.js (served unless SCRIPT_DEBUG)
bash tools/build/package.sh    # writes dist/*.zip
```

## Troubleshooting

- *Widgets missing in Elementor*: make sure Hamista Core and Elementor are active; run **Tools → Regenerate Elementor CSS**.
- *Demo import stopped*: reload and press Import again — it resumes. Raise `max_execution_time` on very slow hosts. To start over, run **Uninstall demo content** first.
- *Fonts not applied*: check the file names, pick the font under **Typography**, then **Tools → Clear font cache**.
- *No SMS*: use **Send test code** to see the provider's error; check API key, sender line and pattern name, and that the server can make outbound HTTPS requests.

## Licence

GPL v2 or later. Vazirmatn is bundled under the SIL OFL (`assets/fonts/vazirmatn/OFL.txt`). Yekan Bakh and Digits follow their own licences and are not included.
