/*!
 * Hamista theme script — header states, dark mode, drawer, search, back to top.
 * Dependency-free, deferred, ~4KB minified. Motion lives in Hamista Core.
 */
(function () {
	'use strict';

	var doc = document;
	var root = doc.documentElement;
	var $ = function (s, c) { return (c || doc).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

	/* ---------- Colour scheme ---------- */
	function syncToggles() {
		var dark = root.getAttribute('data-hm-theme') === 'dark';
		$$('[data-hm-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(dark)); });
	}
	doc.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-hm-theme-toggle]');
		if (!btn || root.hasAttribute('data-hm-forced')) { return; }
		var next = root.getAttribute('data-hm-theme') === 'dark' ? 'light' : 'dark';
		var apply = function () {
			root.setAttribute('data-hm-theme', next);
			try { localStorage.setItem('hm-theme', next); } catch (err) { /* private mode */ }
			syncToggles();
			doc.dispatchEvent(new CustomEvent('hamista:theme', { detail: { theme: next } }));
		};
		// Smooth cross-fade where View Transitions are available.
		if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			doc.startViewTransition(apply);
		} else {
			apply();
		}
	});
	syncToggles();

	/* ---------- Overlays: drawer + search ---------- */
	var lastFocus = null;
	function openLayer(layer, trigger) {
		if (!layer) { return; }
		lastFocus = trigger || doc.activeElement;
		layer.classList.add('is-open');
		layer.setAttribute('aria-hidden', 'false');
		if (trigger) { trigger.setAttribute('aria-expanded', 'true'); }
		root.style.overflow = 'hidden';
		var focusable = $('input[type="search"], a, button', layer.querySelector('[role="dialog"]') || layer);
		window.setTimeout(function () { if (focusable) { focusable.focus({ preventScroll: true }); } }, 60);
	}
	function closeLayer(layer) {
		if (!layer || !layer.classList.contains('is-open')) { return; }
		layer.classList.remove('is-open');
		layer.setAttribute('aria-hidden', 'true');
		$$('[aria-controls="' + layer.id + '"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
		root.style.overflow = '';
		if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
	}
	doc.addEventListener('click', function (e) {
		var opener = e.target.closest('[data-hm-open]');
		if (opener) {
			e.preventDefault();
			openLayer(doc.getElementById('hm-' + opener.getAttribute('data-hm-open')), opener);
			return;
		}
		var closer = e.target.closest('[data-hm-close]');
		if (closer) { closeLayer(closer.closest('.hm-drawer, .hm-search-overlay')); }
		var drawerLink = e.target.closest('.hm-drawer a[href]');
		if (drawerLink && drawerLink.getAttribute('href').charAt(0) === '#') { closeLayer($('.hm-drawer')); }
	});
	doc.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') { $$('.hm-drawer.is-open, .hm-search-overlay.is-open').forEach(closeLayer); }
		// Keep keyboard focus inside an open dialog.
		if (e.key === 'Tab') {
			var open = $('.hm-drawer.is-open [role="dialog"], .hm-search-overlay.is-open [role="dialog"]');
			if (!open) { return; }
			var items = $$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])', open).filter(function (n) { return n.offsetParent !== null; });
			if (!items.length) { return; }
			var first = items[0], last = items[items.length - 1];
			if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
		}
	});

	// Stagger index + sub-menu toggles inside the drawer.
	$$('.hm-drawer-menu > li').forEach(function (li, i) { li.style.setProperty('--i', i); });
	$$('.hm-drawer-menu .menu-item-has-children').forEach(function (li) {
		var btn = doc.createElement('button');
		btn.type = 'button';
		btn.className = 'hm-sub-toggle';
		btn.setAttribute('aria-expanded', 'false');
		btn.setAttribute('aria-label', (window.hamistaTheme && hamistaTheme.i18n.submenu) || 'Submenu');
		btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
		btn.addEventListener('click', function () {
			var open = li.classList.toggle('is-open');
			btn.setAttribute('aria-expanded', String(open));
		});
		li.insertBefore(btn, li.querySelector('.sub-menu'));
	});

	/* ---------- Mobile action bar: step aside while the on-screen keyboard is up ---------- */
	var mobileBar = $('.hm-mobile-bar');
	if (mobileBar) {
		var typing = function (el) { return el && el.matches && el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, select'); };
		document.addEventListener('focusin', function (e) { if (typing(e.target)) { mobileBar.classList.add('is-hidden'); } });
		document.addEventListener('focusout', function (e) { if (typing(e.target)) { mobileBar.classList.remove('is-hidden'); } });
	}

	/* ---------- Scroll-driven header, progress, back to top ---------- */
	var header = $('.hm-header');
	var hideOnScroll = header && header.getAttribute('data-hide-on-scroll') === '1';
	var progress = $('[data-hm-progress]');
	var toTop = $('[data-hm-to-top]');
	var article = progress ? $('.hm-single .entry-content') : null;
	var lastY = window.scrollY;
	var ticking = false;

	function frame() {
		ticking = false;
		var y = window.scrollY;
		var max = root.scrollHeight - window.innerHeight;

		if (header) {
			header.classList.toggle('is-scrolled', y > 8);
			if (hideOnScroll && !$('.hm-drawer.is-open')) {
				var down = y > lastY + 4;
				var up = y < lastY - 4;
				if (down && y > 320) { header.classList.add('is-hidden'); }
				else if (up || y < 120) { header.classList.remove('is-hidden'); }
			}
		}
		if (progress && article) {
			var start = article.offsetTop - window.innerHeight * 0.3;
			var end = article.offsetTop + article.offsetHeight - window.innerHeight * 0.7;
			var p = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
			progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';
		}
		if (toTop) {
			toTop.classList.toggle('is-visible', y > window.innerHeight);
			toTop.style.setProperty('--hm-p', max > 0 ? (y / max).toFixed(3) : 0);
		}
		lastY = y;
	}
	function onScroll() {
		if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	frame();

	if (toTop) {
		toTop.addEventListener('click', function (e) {
			e.preventDefault();
			if (window.Hamista && Hamista.scroll) { Hamista.scroll.to(0); }
			else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
		});
	}

	/* ---------- Copy link ---------- */
	doc.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-hm-copy]');
		if (!btn || !navigator.clipboard) { return; }
		navigator.clipboard.writeText(btn.getAttribute('data-hm-copy')).then(function () {
			var label = btn.getAttribute('aria-label');
			btn.setAttribute('aria-label', btn.getAttribute('data-copied'));
			btn.classList.add('is-done');
			window.setTimeout(function () { btn.setAttribute('aria-label', label); btn.classList.remove('is-done'); }, 1800);
		});
	});

})();
