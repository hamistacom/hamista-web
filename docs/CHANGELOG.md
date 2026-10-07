# Changelog

## Unreleased

**Hamista Core**
- Booking module for any business that works by appointment. A business type (general, clinic, beauty salon, law firm, consulting, or your own wording) sets every label and URL. Includes a weekly schedule with morning and evening shifts, free time slots, double-booking protection, rate limits, email to the reception, confirm/done/cancel in the dashboard with a pending count, "My appointments" with online cancellation, and the `[hamista_booking]` and `[hamista_appointments]` shortcodes.
- New widgets: Booking: list, Booking: form, Before & after.
- Booking works for anything booked by time: people (doctor, teacher, consultant) or places (dining area, court, studio). New business types: education, restaurant, sports venue, space rental, car service. Per-item capacity, a guest-count field, your own booking questions (text, number, list, tick box), items listed without online booking, and "booking" instead of "appointment" wording for places.
- Account area (Hamista → Account area): menu editor (rename, reorder, hide, icons, your own tabs showing a page or an Elementor block, links), dashboard sections and your own content above, below or instead of it, and a tabs layout.
- Profile pages: section switches, shared content under every profile; profiles built with Elementor keep their own design.
- Settings: conditional fields inside repeaters; social network names and widget defaults in Persian.
- Settings: optional left-to-right text fields and group descriptions.
- Settings: switches for the page title area (pages, archives, shop), with alignment and size.
- New widget: Showcase hero. Full-screen slides that crossfade with a slow zoom, numbered index with progress, an info card, a film button (MP4, Aparat or YouTube in a window over the page), figures and links along the bottom. Pauses when off screen, on keyboard focus and in a hidden tab; arrow keys move between slides.
- New demo: Rahnavard (ره‌نورد), a slow-travel agency. Cinematic hero, destinations in a horizontal scroll, tour cards that stack while scrolling, a night sky that zooms out, travellers' quotes, journal and an image call to action. Five pages, light and dark.
- Font library (Typography → Font library): IRANYekan, IRANSansX, Peyda, Pinar (variable), Doran, Ravagh, Lahzeh, Modam, Hamrah and Gramophone, each previewed in its own face. Switch any family off (it leaves the font menus and Elementor) and any weight within it. Pages download only the families and weights they use, including fonts picked inside Elementor widgets.
- Typography: body text weight and heading weight menus that offer only the weights the chosen font has.
- New widget: Search box. A row of fields (text with suggestions, list, date in the Persian calendar, count) with options above them and a swap button, sent as parameters to a results page or to the site search. Solid, frosted-glass and outline looks.
- Features: "feature the first card" (dark fill, two rows tall in a grid). Hero: "columns of light" background detail and properly centred full-bleed layouts.
- New demo: Parvazyar (پروازیار), a flight-ticket site after the AirLume reference: a sea of clouds at dawn with columns of light, a glass search box over the photo, a featured-card grid, route offers, steps, a night-flight banner, quotes and FAQ.
- Hero: "monument" layout, one giant word with an object standing in front of it that drifts on scroll and can turn slowly (off for visitors who prefer less motion).
- New demo: Khane-ye Hekmat (خانه‌ی حکمت), reading circles on Persian thought after the Stoicism reference: the word «حکمت» set in Doran Light behind a line-drawn astrolabe whose plate is a true projection for Isfahan's latitude, a numbered list of circles, typographic medallions in a horizontal scroll, verses in two half-lines, an essay index and a Friday letter. Dark by default, parchment in light mode.
- Quotes keep their line breaks.
- Hero: "stagger the title lines" (thin, very large type; the first line at one edge, the last at the other). Buttons: a round style with a metallic ring that turns on hover.
- New demo: Zarrinbal (زرین‌بال), private jet charter after the Aeroluxe reference: rendered gold silk on black, a split thin title, a round metallic button, a gold-lit featured service card, a fleet list, quiet figures and an image call to action. Dark by default, ivory in light mode.
- The scroll-lit statement follows the kit's weight (`--hm-fw-scrub`).
- Features: per-card tone (soft accent, soft second colour, soft neutral, dark) and a large figure above the title, for bento panels.
- New demo: Roshd (رشد), management consulting after the Coquice reference: soft teal and coral bento panels with large figures, a dark figures band, four steps, quotes, a monthly/quarterly pricing table and FAQ.
- Section classes `hm-pull-up` and `hm-room-below` to lay one section over the edge of the one above.
- Index numbers on cards and steps follow Persian digits.
- Jalali dates read day, month, year even when the site still has WordPress's English date format, with a Persian comma.
- Horizontal scroll: overlay cards reveal their text and draw a hairline on hover; images no longer drift past their edge.
- Demo Sayal (سیال) rebuilt as a restrained motion studio: long-exposure light trails instead of 3D orbs and glass, a staggered thin title, selected work in a horizontal scroll, a services list, a zooming reel, a written brief form; no illustrated avatars.

**Theme**
- Profile, team archive and service templates for the booking module.
- Redesigned WooCommerce account area: full-width layout, icon menu with Persian labels even without WooCommerce's language pack, dashboard with summary cards and latest orders, monogram instead of Gravatar.
- New style kit: Voyage. Stone white, charcoal and Persian turquoise, small corners and hairlines.
- New style kit: Azure. Cloud white, deep navy and royal blue.
- New style kit: Ink. Manuscript blue, parchment and gilt, square corners and hairlines.
- New style kit: Aurum. Black, ivory and brushed gold, thin headings and pill buttons.
- New style kit: Coral. Warm white, deep teal and coral, soft tinted panels.
- The light logo now shows over a transparent header on a photo and in dark footers, in every kit.
- Reading time in Persian digits.
- IRANYekan is the default body and heading font; the chosen body weight is the one preloaded.
- Flux kit redrawn: graphite, ivory and a single ember accent, square corners and hairlines instead of glass and glow.
- WooCommerce shows its most visible front-end strings (add to cart, cart, checkout, notices, sorting, pagination) in Persian even before its own language pack is downloaded. Installed translations always take precedence.

## 1.0.0

First public release.

**Theme**
- Persian-first RTL theme with design tokens (`--hm-*`), logical properties and zero-specificity element resets.
- Six style kits: Spark, Industrial, Pulse, Honey, Nomad, Flux — light and dark mode for each.
- Configurable content width (default 1320 px), self-hosted fonts (Yekan Bakh and Digits drop-in, bundled Vazirmatn fallback), Persian digits and Jalali dates.
- Header and footer, blog and single templates, WooCommerce styling, mobile quick-action bar, smooth page transitions.
- Persian (fa_IR) translation.

**Hamista Core**
- Settings panel (REST, no reloads) with export/import and per-section reset.
- Dependency-free motion engine and 28 Elementor widgets, including Scroll Zoom (in/out), Horizontal Scroll, Depth Scroll, Floating Elements, Scroll Path, Stacking Cards, Text Scrub and a multi-step lead form.
- Mobile OTP login and registration with Kavenegar, Melipayamak, SMS.ir, IPPanel, Ghasedak or a custom API; user panel; WooCommerce integration.
- Demo importer (stepwise, resumable, removable) with six complete demos.
- Forms inbox, performance switches, minified assets.

**Child theme**
- Starter child theme with font drop-in folders.
