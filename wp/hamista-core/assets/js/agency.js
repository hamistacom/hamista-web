/**
 * Hamista — Agency widgets.
 *
 * Film window, lazy loops, the turning ring, giant text that follows the
 * scroll, the hero picture zoom, and the scroll and pointer effects of the
 * agency sections. Everything runs through the engine's scrub and ticker so
 * the page keeps one scroll listener; with reduced motion the effects rest.
 */
(function (win, doc) {
	'use strict';

	var H = win.Hamista = win.Hamista || {};
	var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
	var rtl = doc.documentElement.dir === 'rtl';
	var fine = win.matchMedia ? win.matchMedia('(hover: hover) and (pointer: fine)').matches : false;

	function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
	function scrub(el, opts) { return H.scrub ? H.scrub(el, opts) : null; }

	/* ------------------------------------------------------------------ */
	/* Film window: MP4 in a <video>, Aparat and YouTube as embeds          */
	/* ------------------------------------------------------------------ */
	var dialog = null;
	function embed(url) {
		var m = url.match(/aparat\.com\/v\/([A-Za-z0-9]+)/);
		if (m) { return 'https://www.aparat.com/video/video/embed/videohash/' + m[1] + '/vt/frame'; }
		m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
		if (m) { return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0'; }
		return '';
	}
	function film(url, title) {
		if (!dialog) {
			dialog = doc.createElement('dialog');
			dialog.className = 'hm-film';
			dialog.innerHTML = '<button type="button" class="hm-film__close" aria-label="' + (rtl ? 'بستن' : 'Close') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="hm-film__player"></div>';
			doc.body.appendChild(dialog);
			dialog.querySelector('.hm-film__close').addEventListener('click', function () { dialog.close(); });
			dialog.addEventListener('click', function (e) { if (e.target === dialog) { dialog.close(); } });
			dialog.addEventListener('close', function () { dialog.querySelector('.hm-film__player').innerHTML = ''; });
		}
		if (typeof dialog.showModal !== 'function') { win.open(url, '_blank', 'noopener'); return; }
		var src = embed(url);
		var media = doc.createElement(src ? 'iframe' : 'video');
		if (src) {
			media.src = src;
			media.allow = 'autoplay; fullscreen; picture-in-picture';
			media.allowFullscreen = true;
			media.title = title || '';
		} else {
			media.src = url;
			media.controls = true;
			media.autoplay = true;
			media.playsInline = true;
		}
		dialog.querySelector('.hm-film__player').appendChild(media);
		dialog.showModal();
	}
	doc.addEventListener('click', function (e) {
		var btn = e.target.closest ? e.target.closest('[data-hm-film]') : null;
		if (!btn) { return; }
		e.preventDefault();
		film(btn.getAttribute('data-hm-film'), btn.textContent.trim());
	});

	/* Short silent loops start only on screen, and stop when they leave. */
	var loopObserver = 'IntersectionObserver' in win ? new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			var v = e.target;
			if (e.isIntersecting) {
				if (!v.src) { v.src = v.getAttribute('data-hm-loop'); }
				var p = v.play();
				if (p && p.catch) { p.catch(function () {}); }
			} else if (!v.paused) {
				v.pause();
			}
		});
	}, { rootMargin: '120px' }) : null;
	function loops(root) {
		if (reduce || !loopObserver) { return; }
		$$('video[data-hm-loop]', root).forEach(function (v) {
			if (v.__hmLoop) { return; }
			v.__hmLoop = true;
			loopObserver.observe(v);
		});
	}

	/* ------------------------------------------------------------------ */
	/* Ring: turns a little further as the page scrolls                    */
	/* ------------------------------------------------------------------ */
	function ring(el) {
		loops(el);
		if (reduce || !el.hasAttribute('data-hm-ring-scroll')) { return; }
		var track = el.querySelector('.hm-ring__track');
		scrub(el, { update: function (p) { track.style.setProperty('--hm-ring-scroll', (p * 220).toFixed(1) + 'deg'); } });
	}

	/* ------------------------------------------------------------------ */
	/* Giant text                                                          */
	/* ------------------------------------------------------------------ */
	function giant(el) {
		if (reduce) { return; }
		var mode = el.getAttribute('data-hm-giant');
		var dir = rtl ? 1 : -1;
		if (mode === 'slide') {
			var word = el.querySelector('.hm-giant__word');
			scrub(el, { update: function (p) { word.style.setProperty('--hm-gx', (dir * (p - 0.2) * 22).toFixed(2) + '%'); } });
		} else if (mode === 'rise') {
			var w = el.querySelector('.hm-giant__word');
			scrub(el, { mode: 'enter', update: function (p) { w.style.setProperty('--hm-gy', ((1 - p) * 45).toFixed(1) + '%'); } });
		} else if (mode === 'part') {
			scrub(el, { update: function (p) { el.style.setProperty('--hm-gp', (dir * -1 * (p - 0.5) * 30).toFixed(2) + 'vw'); } });
		}
	}

	/* ------------------------------------------------------------------ */
	/* Agency hero                                                         */
	/* ------------------------------------------------------------------ */
	function hero(el) {
		loops(el);
		if (reduce) { return; }
		var pic = el.querySelector('[data-hm-ah-zoom]');
		if (pic) {
			scrub(el, { mode: 'pin', range: function (m) { return [m.top, m.top + m.h]; }, update: function (p) { pic.style.setProperty('--hm-ah-z', (1 - p * 0.12).toFixed(4)); } });
		}
		// The highlighted words come in one by one, out of a soft blur.
		var title = el.querySelector('.hm-ah__title');
		if (title) {
			$$('.hm-hl .hm-wi', title).forEach(function (w, i) { w.style.transitionDelay = (0.35 + i * 0.12) + 's'; });
		}
		// The portrait drifts a touch towards the pointer.
		var fig = el.querySelector('.hm-ah__figure, .hm-ah__orbs');
		if (fig && fine) {
			el.addEventListener('pointermove', function (e) {
				var r = el.getBoundingClientRect();
				var x = (e.clientX - r.left) / r.width - 0.5;
				var y = (e.clientY - r.top) / r.height - 0.5;
				fig.style.translate = (x * 18).toFixed(1) + 'px ' + (y * 10).toFixed(1) + 'px';
			});
			el.addEventListener('pointerleave', function () { fig.style.translate = ''; });
		}
	}

	/* ------------------------------------------------------------------ */
	/* About: the object turns with scrolling; one card open at a time     */
	/* ------------------------------------------------------------------ */
	function about(el) {
		var shape = el.querySelector('[data-hm-ab-turn]');
		if (shape && !reduce) {
			scrub(el, { update: function (p) { shape.style.setProperty('--hm-ab-turn', (p * 140 - 30).toFixed(1) + 'deg'); } });
		}
		var cards = $$('.hm-ab__card', el);
		cards.forEach(function (card) {
			card.addEventListener('toggle', function () {
				if (card.open) { cards.forEach(function (c) { if (c !== card) { c.open = false; } }); }
			});
			if (fine) { card.addEventListener('pointerenter', function () { card.open = true; }); }
		});
	}

	/* ------------------------------------------------------------------ */
	/* Service list                                                        */
	/* ------------------------------------------------------------------ */
	function services(el) {
		var panels = $$('.hm-sl__panel', el);
		function open(p) { panels.forEach(function (x) { x.classList.toggle('is-open', x === p); }); }
		panels.forEach(function (p) {
			p.addEventListener(fine ? 'pointerenter' : 'click', function () { open(p); });
			p.addEventListener('focus', function () { open(p); });
		});
		var rows = $$('.hm-sl__row', el);
		if (!rows.length || reduce) { return; }
		// Rows slide in from the side and brighten as each one reaches its place.
		var dir = rtl ? 1 : -1;
		rows.forEach(function (row, i) {
			scrub(row, {
				mode: 'enter',
				update: function (p) {
					row.style.setProperty('--hm-sl-o', (0.25 + p * 0.75).toFixed(3));
					row.style.setProperty('--hm-sl-x', (dir * (1 - p) * (40 + i * 18)).toFixed(1) + 'px');
				}
			});
		});
	}

	/* Project stack: a card shrinks a touch as the next one covers it. */
	function projects(el) {
		if (reduce) { return; }
		var cards = $$('.hm-ps__card', el);
		cards.forEach(function (card, i) {
			if (i === cards.length - 1) { return; }
			var next = cards[i + 1];
			scrub(next, { mode: 'enter', update: function (p) { card.style.setProperty('--hm-ps-s', (1 - p * 0.06).toFixed(4)); } });
		});
	}

	/* Process: while the section holds still, the cards slide in and pile up. */
	function process(el) {
		if (!el.classList.contains('hm-pr--tabs') || reduce || win.innerWidth < 900) { return; }
		var cards = $$('.hm-pr__card', el);
		var n = cards.length;
		var dir = rtl ? -1 : 1;
		scrub(el, {
			mode: 'pin',
			update: function (p) {
				cards.forEach(function (c, i) {
					// Card i travels from far out to its resting place during its share of the scroll.
					var share = Math.min(1, Math.max(0, p * n - i + 0.6));
					var rest = i * 56;
					var x = (1 - share) * win.innerWidth * 0.7 + rest;
					c.style.setProperty('--hm-pr-x', (dir * x).toFixed(1) + 'px');
				});
			}
		});
	}

	/* Testimonials drift at different speeds as the wall passes. */
	function wall(el) {
		if (reduce) { return; }
		var items = $$('.hm-tw__item', el);
		var cols = el.classList.contains('hm-tw--columns');
		scrub(el, {
			update: function (p) {
				items.forEach(function (it, i) {
					var speed = cols ? (i % 2 ? -1 : 1) * 0.6 : parseFloat(it.getAttribute('data-hm-tw-speed')) || 0.5;
					it.style.setProperty('--hm-tw-y', ((0.5 - p) * speed * 160).toFixed(1) + 'px');
				});
			}
		});
	}

	if (H.register) {
		H.register('service-list', services);
		H.register('project-show', projects);
		H.register('process', process);
		H.register('testimonial-wall', wall);
		H.register('about-intro', about);
		H.register('ring', ring);
		H.register('giant', giant);
		H.register('agency-hero', hero);
	}
	H.agency = { film: film, loops: loops, scrub: scrub, reduce: reduce, rtl: rtl, fine: fine, $$: $$ };
	if (doc.readyState !== 'loading') { loops(doc); } else { doc.addEventListener('DOMContentLoaded', function () { loops(doc); }); }
}(window, document));
