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

**Theme**
- Profile, team archive and service templates for the booking module.
- Redesigned WooCommerce account area: full-width layout, icon menu with Persian labels even without WooCommerce's language pack, dashboard with summary cards and latest orders, monogram instead of Gravatar.

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
