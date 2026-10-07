/*!
 * Hamista motion engine
 * Smooth scroll, scroll-linked effects, reveals and widget modules in one
 * dependency-free file. Positions are measured once per resize; scroll frames
 * only do arithmetic and write transforms/opacity (compositor-friendly).
 */
(function (win, doc) {
	'use strict';

	var H = win.Hamista = win.Hamista || {};
	if (H.ready) { return; }

	var cfg = win.hamistaMotion || {};
	var root = doc.documentElement;
	var reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var finePointer = win.matchMedia('(pointer: fine)').matches;
	var phone = win.matchMedia('(max-width: 767px)').matches;
	var isEditor = !!cfg.editor;
	var animate = !reduce && !(phone && cfg.mobile === false);
	var rtl = (root.getAttribute('dir') || doc.body.getAttribute('dir') || win.getComputedStyle(doc.body).direction) === 'rtl';
	var lang = (root.lang || 'fa').toLowerCase();
	var numberFormat = new Intl.NumberFormat(lang.indexOf('fa') === 0 ? 'fa-IR' : lang);

	/* ------------------------------------------------------------------ */
	/* Utilities                                                          */
	/* ------------------------------------------------------------------ */
	function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
	function mix(a, b, t) { return a + (b - a) * t; }
	function $$(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }
	function json(str, fallback) { try { return JSON.parse(str); } catch (e) { return fallback; } }
	var ease = {
		out: function (t) { return 1 - Math.pow(1 - t, 3); },
		inOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
		expo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
	};
	H.util = { clamp: clamp, mix: mix, ease: ease, $$: $$ };
	H.rtl = rtl;
	H.animate = animate;

	/* ------------------------------------------------------------------ */
	/* Viewport cache                                                     */
	/* ------------------------------------------------------------------ */
	var vw = win.innerWidth;
	var vh = win.innerHeight;
	var scrollY = win.scrollY;
	function docTop(el) { return el.getBoundingClientRect().top + win.scrollY; }

	/* ------------------------------------------------------------------ */
	/* Frame loop: one rAF for everything, idle when nothing moves         */
	/* ------------------------------------------------------------------ */
	var tickers = [];
	var scrubs = [];
	var running = false;
	var lastFrameY = -1;
	var velocity = 0;

	function requestFrame() {
		if (!running) {
			running = true;
			win.requestAnimationFrame(frame);
		}
	}

	function frame(now) {
		running = false;
		var smoothMoving = smooth.step(now);
		scrollY = win.scrollY;
		var dy = scrollY - (lastFrameY < 0 ? scrollY : lastFrameY);
		velocity = mix(velocity, dy, 0.25);
		if (Math.abs(velocity) < 0.01) { velocity = 0; }
		H.scroll.velocity = velocity;

		if (scrollY !== lastFrameY) {
			for (var i = 0; i < scrubs.length; i++) {
				var s = scrubs[i];
				if (s.active) { runScrub(s); }
			}
		}
		lastFrameY = scrollY;

		var keep = smoothMoving || velocity !== 0;
		for (var j = 0; j < tickers.length; j++) {
			if (tickers[j].active && tickers[j].fn(now, velocity) !== false) { keep = true; }
		}
		if (keep) { requestFrame(); }
	}

	win.addEventListener('scroll', requestFrame, { passive: true });

	H.ticker = function (fn) {
		var t = { fn: fn, active: true };
		tickers.push(t);
		requestFrame();
		return t;
	};

	/* ------------------------------------------------------------------ */
	/* Scrub: scroll progress 0→1 for an element                          */
	/* modes: through (enters bottom → leaves top), pin (sticky track),   */
	/*        enter (bottom → 35% from top), center (bottom → centred)    */
	/* ------------------------------------------------------------------ */
	var scrubObserver = 'IntersectionObserver' in win ? new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			var s = e.target.__hmScrubs;
			if (!s) { return; }
			s.forEach(function (item) {
				item.active = e.isIntersecting;
				if (item.active) { runScrub(item, true); }
			});
		});
	}, { rootMargin: '30% 0px 30% 0px' }) : null;

	function measureScrub(s) {
		s.top = docTop(s.el);
		s.h = s.el.offsetHeight;
		if (s.range) {
			var r = s.range({ top: s.top, h: s.h, vh: vh, vw: vw });
			s.start = r[0];
			s.end = r[1];
			return;
		}
		switch (s.mode) {
			case 'pin': s.start = s.top; s.end = s.top + s.h - vh; break;
			case 'enter': s.start = s.top - vh; s.end = s.top - vh * 0.35; break;
			case 'center': s.start = s.top - vh; s.end = s.top + s.h / 2 - vh / 2; break;
			default: s.start = s.top - vh; s.end = s.top + s.h;
		}
	}

	function runScrub(s, force) {
		var p = clamp((scrollY - s.start) / Math.max(1, s.end - s.start), 0, 1);
		if (force || p !== s.p) {
			s.p = p;
			s.update(p, s);
		}
	}

	H.scrub = function (el, opts) {
		var s = {
			el: el,
			mode: opts.mode || 'through',
			range: opts.range || null,
			update: opts.update,
			active: !scrubObserver,
			p: -1
		};
		measureScrub(s);
		scrubs.push(s);
		(el.__hmScrubs = el.__hmScrubs || []).push(s);
		if (scrubObserver) { scrubObserver.observe(el); }
		runScrub(s, true);
		return s;
	};

	H.refresh = function () {
		vw = win.innerWidth;
		vh = win.innerHeight;
		scrollY = win.scrollY;
		H.emit('resize');
		scrubs.forEach(function (s) { measureScrub(s); runScrub(s, true); });
		smooth.sync();
	};

	var resizeTimer;
	function scheduleRefresh() {
		win.clearTimeout(resizeTimer);
		resizeTimer = win.setTimeout(H.refresh, 120);
	}
	win.addEventListener('resize', function () {
		// Ignore height-only changes from mobile browser chrome showing/hiding.
		if (win.innerWidth === vw && Math.abs(win.innerHeight - vh) < 120 && phone) { return; }
		scheduleRefresh();
	});
	win.addEventListener('load', scheduleRefresh);
	if ('ResizeObserver' in win) {
		var lastBodyH = 0;
		new ResizeObserver(function () {
			var h = doc.body.scrollHeight;
			if (Math.abs(h - lastBodyH) > 2) { lastBodyH = h; scheduleRefresh(); }
		}).observe(doc.body);
	}

	/* ------------------------------------------------------------------ */
	/* Events                                                             */
	/* ------------------------------------------------------------------ */
	var listeners = {};
	H.on = function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); };
	H.emit = function (name, data) { (listeners[name] || []).forEach(function (fn) { fn(data); }); };

	/* ------------------------------------------------------------------ */
	/* Smooth scroll (wheel inertia; touch and keyboard stay native)       */
	/* ------------------------------------------------------------------ */
	var smooth = (function () {
		var enabled = cfg.smooth && finePointer && animate && !isEditor;
		var ease = clamp((cfg.lerp || 10) / 100, 0.04, 0.3);
		var target = win.scrollY;
		var current = target;
		var lastSet = target;
		var moving = false;
		var lastTime = 0;

		function maxScroll() { return root.scrollHeight - win.innerHeight; }

		function step(now) {
			if (!moving) { return false; }
			// Someone else scrolled (scrollbar drag, anchor, find-in-page): hand over.
			if (Math.abs(win.scrollY - lastSet) > 3) {
				target = current = win.scrollY;
				moving = false;
				return false;
			}
			var dt = Math.min(64, now - (lastTime || now));
			lastTime = now;
			current = mix(current, target, 1 - Math.pow(1 - ease, dt / 16.67 || 1));
			if (Math.abs(target - current) < 0.5) { current = target; moving = false; lastTime = 0; }
			win.scrollTo(0, current);
			lastSet = win.scrollY;
			return moving;
		}

		function start() {
			if (!moving) { lastSet = win.scrollY; moving = true; }
			requestFrame();
		}

		function canScrollNested(node, dy) {
			while (node && node !== doc.body && node.nodeType === 1) {
				if (node.hasAttribute('data-hm-native-scroll')) { return true; }
				var style = win.getComputedStyle(node);
				if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
					if ((dy < 0 && node.scrollTop > 0) || (dy > 0 && node.scrollTop + node.clientHeight < node.scrollHeight)) { return true; }
				}
				node = node.parentNode;
			}
			return false;
		}

		if (enabled) {
			root.classList.add('hm-smooth');
			win.addEventListener('wheel', function (e) {
				if (e.ctrlKey || e.defaultPrevented || doc.documentElement.style.overflow === 'hidden') { return; }
				var dy = e.deltaY;
				if (e.deltaMode === 1) { dy *= 16; } else if (e.deltaMode === 2) { dy *= win.innerHeight; }
				if (Math.abs(e.deltaX) > Math.abs(dy) || canScrollNested(e.target, dy)) { return; }
				e.preventDefault();
				if (!moving) { target = current = win.scrollY; }
				target = clamp(target + dy, 0, maxScroll());
				start();
			}, { passive: false });
		}

		return {
			enabled: enabled,
			step: step,
			sync: function () { if (!moving) { target = current = win.scrollY; } },
			to: function (y) {
				y = clamp(y, 0, maxScroll());
				if (!enabled) { win.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); return; }
				if (!moving) { target = current = win.scrollY; }
				target = y;
				start();
			}
		};
	}());

	H.scroll = {
		velocity: 0,
		to: function (target) {
			var y = typeof target === 'number' ? target : docTop(target) - (parseInt(win.getComputedStyle(root).getPropertyValue('--hm-header-h'), 10) || 0);
			smooth.to(y);
		}
	};

	// In-page anchors use the same easing.
	doc.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('a[href*="#"]');
		if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === '_blank') { return; }
		var url = new URL(a.href, win.location.href);
		if (url.pathname !== win.location.pathname || !url.hash || url.hash.length < 2) { return; }
		var el;
		try { el = doc.querySelector(decodeURIComponent(url.hash)); } catch (err) { return; }
		if (!el || a.hasAttribute('data-hm-open') || a.closest('.elementor-tabs, .woocommerce-tabs')) { return; }
		e.preventDefault();
		H.scroll.to(el);
		if (win.history && win.history.pushState) { win.history.pushState(null, '', url.hash); }
	});

	/* ------------------------------------------------------------------ */
	/* Text splitting (RTL safe: Persian is split by words, never letters) */
	/* ------------------------------------------------------------------ */
	var arabicScript = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

	H.split = function (el, mode) {
		if (el.__hmSplit) { return el.__hmSplit; }
		var units = [];
		var chars = mode === 'chars' && !arabicScript.test(el.textContent);

		function wrapText(node) {
			var parts = node.textContent.split(/(\s+)/);
			var frag = doc.createDocumentFragment();
			parts.forEach(function (part) {
				if (!part) { return; }
				if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
				var outer = doc.createElement('span');
				outer.className = 'hm-w';
				if (chars) {
					part.split('').forEach(function (ch) {
						var inner = doc.createElement('span');
						inner.className = 'hm-wi';
						inner.textContent = ch;
						inner.style.setProperty('--hm-wi', units.length);
						units.push(inner);
						outer.appendChild(inner);
					});
				} else {
					var inner = doc.createElement('span');
					inner.className = 'hm-wi';
					inner.textContent = part;
					inner.style.setProperty('--hm-wi', units.length);
					units.push(inner);
					outer.appendChild(inner);
				}
				frag.appendChild(outer);
			});
			node.parentNode.replaceChild(frag, node);
		}

		(function walk(node) {
			Array.prototype.slice.call(node.childNodes).forEach(function (child) {
				if (child.nodeType === 3 && child.textContent.trim()) { wrapText(child); }
				else if (child.nodeType === 1 && !/^(BR|SVG|IMG|SCRIPT|STYLE)$/i.test(child.tagName)) { walk(child); }
			});
		}(el));

		el.__hmSplit = units;
		el.style.setProperty('--hm-wn', units.length);
		return units;
	};

	/* ------------------------------------------------------------------ */
	/* Reveal on scroll                                                   */
	/* ------------------------------------------------------------------ */
	// Observed node → elements it reveals. A clip reveal starts fully clipped, and
	// Chromium never reports a fully clipped element as intersecting, so those
	// elements are watched through their parent instead.
	var revealTargets = new Map();
	var revealObserver = 'IntersectionObserver' in win ? new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			if (!e.isIntersecting) { return; }
			revealObserver.unobserve(e.target);
			(revealTargets.get(e.target) || [e.target]).forEach(function (el) {
				el.classList.add('hm-in');
				H.emit('reveal', el);
			});
			revealTargets.delete(e.target);
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;

	function observeReveal(el) {
		var node = /^clip/.test(el.getAttribute('data-hm-reveal')) && el.parentElement ? el.parentElement : el;
		var list = revealTargets.get(node);
		if (!list) {
			list = [];
			revealTargets.set(node, list);
			revealObserver.observe(node);
		}
		list.push(el);
	}

	function setupReveal(el) {
		if (el.__hmReveal) { return; }
		el.__hmReveal = true;
		var type = el.getAttribute('data-hm-reveal');
		if (type === 'words' || type === 'chars' || type === 'lines') { H.split(el, type === 'chars' ? 'chars' : 'words'); }
		var d = el.getAttribute('data-hm-delay');
		if (d) { el.style.setProperty('--hm-rdl', d + 's'); }
		var t = el.getAttribute('data-hm-duration');
		if (t) { el.style.setProperty('--hm-rd', t + 's'); }
		if (!animate || !revealObserver || !cfg.reveal) { el.classList.add('hm-in'); return; }
		observeReveal(el);
	}

	// Stagger children: [data-hm-stagger] gives each [data-hm-reveal] child an index.
	function setupStagger(group) {
		if (group.__hmStagger) { return; }
		group.__hmStagger = true;
		var step = parseFloat(group.getAttribute('data-hm-stagger')) || 0.08;
		$$('[data-hm-reveal]', group).forEach(function (child, i) {
			if (!child.hasAttribute('data-hm-delay')) { child.setAttribute('data-hm-delay', (i * step).toFixed(2)); }
		});
	}

	/* ------------------------------------------------------------------ */
	/* Parallax + Elementor "Hamista Motion" settings                      */
	/* ------------------------------------------------------------------ */
	function setupParallax(el, speed) {
		if (!animate || el.__hmPx) { return; }
		el.__hmPx = true;
		el.style.willChange = 'transform';
		H.scrub(el, {
			update: function (p) {
				var y = (0.5 - p) * speed * vh * 0.5;
				el.style.setProperty('--hm-py', y.toFixed(1) + 'px');
				if (!el.hasAttribute('data-hm-parallax-var')) { el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)'; }
			}
		});
	}

	function setupMotion(el) {
		if (el.__hmMotion) { return; }
		el.__hmMotion = true;
		var m = json(el.getAttribute('data-hm-motion'), {});
		if (m.in && m.in !== 'none') {
			el.setAttribute('data-hm-reveal', m.in);
			if (m.d) { el.setAttribute('data-hm-delay', m.d); }
			if (m.t) { el.setAttribute('data-hm-duration', m.t); }
			setupReveal(el);
		}
		if (m.px && animate) {
			// Move the inner widget container so Elementor's own transforms on the wrapper survive.
			var target = el.querySelector(':scope > .elementor-widget-container') || el;
			setupParallax(target, parseFloat(m.px));
		}
		if (m.sc && animate) {
			var from = m.sc;
			var target2 = el.querySelector(':scope > .elementor-widget-container') || el;
			H.scrub(el, {
				mode: 'enter',
				update: function (p) {
					var t = ease.out(p);
					var tr = '';
					if (from.y) { tr += 'translate3d(0,' + mix(from.y, 0, t).toFixed(1) + 'px,0) '; }
					if (from.x) { tr += 'translate3d(' + (rtl ? -1 : 1) * mix(from.x, 0, t).toFixed(1) + 'px,0,0) '; }
					if (from.s !== undefined && from.s !== 1) { tr += 'scale(' + mix(from.s, 1, t).toFixed(4) + ') '; }
					if (from.r) { tr += 'rotate(' + mix(from.r, 0, t).toFixed(2) + 'deg) '; }
					target2.style.transform = tr;
					if (from.o !== undefined && from.o < 1) { target2.style.opacity = mix(from.o, 1, t).toFixed(3); }
					if (from.b) { target2.style.filter = 'blur(' + mix(from.b, 0, t).toFixed(1) + 'px)'; }
				}
			});
		}
		if (m.tilt) { setupTilt(el); }
		if (m.mag) { setupMagnetic(el.querySelector('a, button') || el); }
	}

	/* ------------------------------------------------------------------ */
	/* Pointer effects: magnetic, tilt, cursor                             */
	/* ------------------------------------------------------------------ */
	function setupMagnetic(el) {
		if (!finePointer || !animate || el.__hmMag) { return; }
		el.__hmMag = true;
		var strength = parseFloat(el.getAttribute('data-hm-magnetic')) || 0.3;
		el.addEventListener('pointermove', function (e) {
			var r = el.getBoundingClientRect();
			var x = (e.clientX - r.left - r.width / 2) * strength;
			var y = (e.clientY - r.top - r.height / 2) * strength * 1.2;
			el.style.transition = 'transform .2s ease-out';
			el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
		});
		el.addEventListener('pointerleave', function () {
			el.style.transition = 'transform .7s cubic-bezier(.175,.885,.32,1.275)';
			el.style.transform = '';
		});
	}
	H.magnetic = setupMagnetic;

	function setupTilt(el) {
		if (!finePointer || !animate || el.__hmTilt) { return; }
		el.__hmTilt = true;
		var max = parseFloat(el.getAttribute('data-hm-tilt')) || 6;
		el.style.transformStyle = 'preserve-3d';
		el.addEventListener('pointermove', function (e) {
			var r = el.getBoundingClientRect();
			var px = (e.clientX - r.left) / r.width - 0.5;
			var py = (e.clientY - r.top) / r.height - 0.5;
			el.style.transition = 'transform .15s ease-out';
			el.style.transform = 'perspective(900px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' + (px * max).toFixed(2) + 'deg)';
			el.style.setProperty('--hm-mx', (px + 0.5) * 100 + '%');
			el.style.setProperty('--hm-my', (py + 0.5) * 100 + '%');
		});
		el.addEventListener('pointerleave', function () {
			el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)';
			el.style.transform = '';
		});
	}

	// Spotlight: cards expose the pointer position as --hm-mx/--hm-my.
	if (finePointer) {
		doc.addEventListener('pointermove', function (e) {
			var card = e.target.closest && e.target.closest('[data-hm-spot]');
			if (!card) { return; }
			var r = card.getBoundingClientRect();
			card.style.setProperty('--hm-mx', (e.clientX - r.left) + 'px');
			card.style.setProperty('--hm-my', (e.clientY - r.top) + 'px');
		}, { passive: true });
	}

	function setupCursor() {
		if (!cfg.cursor || !finePointer || !animate || isEditor || doc.querySelector('.hm-cursor')) { return; }
		var dot = doc.createElement('div');
		dot.className = 'hm-cursor';
		dot.innerHTML = '<span class="hm-cursor__label"></span>';
		doc.body.appendChild(dot);
		root.classList.add('hm-has-cursor');
		var label = dot.firstChild;
		var x = vw / 2, y = vh / 2, tx = x, ty = y, visible = false;
		var t = H.ticker(function () {
			x = mix(x, tx, 0.22);
			y = mix(y, ty, 0.22);
			dot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
			var moving = Math.abs(tx - x) + Math.abs(ty - y) > 0.3;
			t.active = moving;
			return moving;
		});
		doc.addEventListener('pointermove', function (e) {
			tx = e.clientX; ty = e.clientY;
			if (!visible) { visible = true; dot.classList.add('is-visible'); x = tx; y = ty; }
			var hit = e.target.closest && e.target.closest('a, button, [data-hm-cursor], input, textarea, select, label');
			var text = hit && hit.getAttribute('data-hm-cursor');
			dot.classList.toggle('is-hover', !!hit);
			dot.classList.toggle('has-label', !!text);
			label.textContent = text || '';
			t.active = true;
			requestFrame();
		}, { passive: true });
		doc.addEventListener('pointerleave', function () { visible = false; dot.classList.remove('is-visible'); });
		doc.addEventListener('pointerdown', function () { dot.classList.add('is-down'); });
		doc.addEventListener('pointerup', function () { dot.classList.remove('is-down'); });
	}

	/* ------------------------------------------------------------------ */
	/* Counters                                                           */
	/* ------------------------------------------------------------------ */
	function formatNumber(n, decimals, plain) {
		var fixed = Number(n).toFixed(decimals);
		if (plain) { return lang.indexOf('fa') === 0 ? fixed.replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }) : fixed; }
		return numberFormat.format(Number(fixed));
	}
	H.formatNumber = formatNumber;

	function setupCounter(el) {
		if (el.__hmCount) { return; }
		el.__hmCount = true;
		var end = parseFloat(el.getAttribute('data-hm-count')) || 0;
		var decimals = (String(el.getAttribute('data-hm-count')).split('.')[1] || '').length;
		var plain = el.hasAttribute('data-hm-plain');
		var dur = (parseFloat(el.getAttribute('data-hm-duration')) || 2) * 1000;
		if (!animate) { el.textContent = formatNumber(end, decimals, plain); return; }
		el.textContent = formatNumber(0, decimals, plain);
		var io = new IntersectionObserver(function (entries) {
			if (!entries[0].isIntersecting) { return; }
			io.disconnect();
			var t0 = 0;
			var tk = H.ticker(function (now) {
				t0 = t0 || now;
				var k = clamp((now - t0) / dur, 0, 1);
				el.textContent = formatNumber(end * ease.expo(k), decimals, plain);
				if (k >= 1) { tk.active = false; return false; }
				return true;
			});
		}, { threshold: 0.4 });
		io.observe(el);
	}

	/* ------------------------------------------------------------------ */
	/* Widget registry + init                                             */
	/* ------------------------------------------------------------------ */
	var modules = {};
	function initWidget(el) {
		var name = el.getAttribute('data-hm-widget');
		el.__hmInit = el.__hmInit || {};
		if (modules[name] && !el.__hmInit[name]) {
			el.__hmInit[name] = true;
			try { modules[name](el); } catch (err) { if (win.console) { console.error('[Hamista]', name, err); } }
		}
	}

	// Modules shipped in separate files (loaded only where used) may register after boot.
	H.register = function (name, fn) {
		modules[name] = fn;
		if (H.ready) { $$('[data-hm-widget="' + name + '"]').forEach(initWidget); }
	};

	H.init = function (scope) {
		scope = scope || doc;
		var all = function (sel) {
			var list = $$(sel, scope);
			if (scope !== doc && scope.matches && scope.matches(sel)) { list.unshift(scope); }
			return list;
		};
		all('[data-hm-stagger]').forEach(setupStagger);
		all('[data-hm-motion]').forEach(setupMotion);
		all('[data-hm-reveal]').forEach(setupReveal);
		all('[data-hm-parallax]').forEach(function (el) { setupParallax(el, parseFloat(el.getAttribute('data-hm-parallax')) || 0.2); });
		all('[data-hm-count]').forEach(setupCounter);
		all('[data-hm-tilt]').forEach(setupTilt);
		all('[data-hm-magnetic]').forEach(setupMagnetic);
		if (cfg.magnetic) { all('.hm-btn--magnetic').forEach(setupMagnetic); }
		all('[data-hm-widget]').forEach(initWidget);
	};

	/* ================================================================== */
	/* Widget modules                                                     */
	/* ================================================================== */

	/* Horizontal scroll: a pinned section whose track moves sideways. */
	H.register('hscroll', function (el) {
		var sticky = el.querySelector('.hm-hscroll__sticky');
		var track = el.querySelector('.hm-hscroll__track');
		var bar = el.querySelector('.hm-hscroll__bar');
		var items = $$('.hm-hscroll__item', track);
		var distance = 0;
		var offsets = [];
		var native = false;

		function layout() {
			native = !animate || win.innerWidth < 900 || !finePointer && win.innerWidth < 1100;
			el.classList.toggle('is-native', native);
			if (native) { el.style.height = ''; track.style.transform = ''; return; }
			distance = Math.max(0, track.scrollWidth - sticky.clientWidth);
			el.style.height = (distance + win.innerHeight * (parseFloat(el.getAttribute('data-length')) || 1)) + 'px';
			offsets = items.map(function (item) { return { el: item, center: item.offsetLeft + item.offsetWidth / 2, media: item.querySelector('.hm-hscroll__media img, .hm-hscroll__media video') }; });
		}

		layout();
		H.on('resize', layout);
		H.scrub(el, {
			mode: 'pin',
			update: function (p) {
				if (native) { return; }
				var x = p * distance * (rtl ? 1 : -1);
				track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
				if (bar) { bar.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }
				var w = sticky.clientWidth;
				for (var i = 0; i < offsets.length; i++) {
					var o = offsets[i];
					if (!o.media) { continue; }
					var c = (o.center + x - w / 2) / w;
					o.media.style.transform = 'translate3d(' + (c * -8).toFixed(2) + '%,0,0) scale(1.18)';
				}
			}
		});
	});

	/* Scroll zoom: media grows from a card to the full viewport. */
	H.register('zoom', function (el) {
		var media = el.querySelector('.hm-zoom__media');
		var inner = el.querySelector('.hm-zoom__media > img, .hm-zoom__media > video');
		var intro = el.querySelector('.hm-zoom__intro');
		var overlay = el.querySelector('.hm-zoom__overlay');
		var shade = el.querySelector('.hm-zoom__shade');
		var startScale = parseFloat(el.getAttribute('data-start')) || 0.42;
		var radius = parseFloat(el.getAttribute('data-radius')) || 28;
		// "out" plays the same choreography backwards: the scene starts full-screen,
		// its message shows first, then it shrinks into a card under the heading.
		var out = el.getAttribute('data-direction') === 'out';
		if (!animate) { el.classList.add('is-static'); return; }
		H.scrub(el, {
			mode: 'pin',
			update: function (p) {
				if (out) { p = 1 - p; }
				var z = ease.inOut(clamp(p / 0.72, 0, 1));
				var s = mix(startScale, 1, z);
				media.style.transform = 'scale(' + s.toFixed(4) + ')';
				media.style.borderRadius = (mix(radius, 0, z) / s).toFixed(1) + 'px';
				if (inner) { inner.style.transform = 'scale(' + mix(1.25, 1, z).toFixed(4) + ')'; }
				if (intro) {
					var a = clamp(p / 0.3, 0, 1);
					intro.style.opacity = (1 - a).toFixed(3);
					intro.style.transform = 'translate3d(0,' + (-a * 60).toFixed(1) + 'px,0)';
				}
				var o = clamp((p - 0.66) / 0.22, 0, 1);
				if (shade) { shade.style.opacity = (o * 0.85).toFixed(3); }
				if (overlay) {
					overlay.style.opacity = o.toFixed(3);
					overlay.style.transform = 'translate3d(0,' + ((1 - o) * 40).toFixed(1) + 'px,0)';
				}
			}
		});
	});

	/* Scroll path: a spark travels a hand-drawn path while steps change. */
	H.register('path', function (el) {
		var stage = el.querySelector('.hm-path__stage');
		var svg = el.querySelector('.hm-path__svg');
		var paths = $$('path', svg);
		var track = paths[0], line = paths[1], tail = paths[2];
		var spark = el.querySelector('.hm-path__spark');
		var nodes = $$('.hm-path__node', el);
		var steps = $$('.hm-path__step', el);
		var count = el.querySelector('.hm-path__count b');
		var intro = el.querySelector('.hm-path__intro');
		var n = steps.length;
		var marks = steps.map(function (_, i) { return n > 1 ? 0.04 + i * (0.94 / (n - 1)) : 0.5; });
		var TAIL = 150;
		var len = 0;

		// Dust particles, positioned once.
		var dust = el.querySelector('.hm-path__dust');
		if (dust && !dust.childElementCount) {
			for (var d = 0; d < 42; d++) {
				var dot = doc.createElement('i');
				dot.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 110).toFixed(1) + '%;--s:' + (Math.random() * 2 + 1).toFixed(1) + 'px;--t:' + (Math.random() * 4 + 3).toFixed(1) + 's;--dl:' + (-Math.random() * 6).toFixed(1) + 's';
				dust.appendChild(dot);
			}
		}

		function build() {
			var W = stage.clientWidth, Hh = stage.clientHeight, mobile = W < 760;
			var P = mobile
				? [[.62, -.04], [.98, .12], [.06, .14], [.18, .30], [.92, .44], [.52, .58]]
				: [[.36, -.04], [.46, .14], [.08, .20], [.15, .42], [.52, .60], [.36, .74], [.18, .92], [.44, .86]];
			if (!rtl) { P = P.map(function (pt) { return [1 - pt[0], pt[1]]; }); }
			var x = function (v) { return (v * W).toFixed(1); };
			var y = function (v) { return (v * Hh).toFixed(1); };
			var dd = 'M ' + x(P[0][0]) + ' ' + y(P[0][1]) + ' C ' + x(P[1][0]) + ' ' + y(P[1][1]) + ', ' + x(P[2][0]) + ' ' + y(P[2][1]) + ', ' + x(P[3][0]) + ' ' + y(P[3][1]);
			for (var i = 4; i < P.length; i += 2) { dd += ' S ' + x(P[i][0]) + ' ' + y(P[i][1]) + ', ' + x(P[i + 1][0]) + ' ' + y(P[i + 1][1]); }
			svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Hh);
			paths.forEach(function (p) { p.setAttribute('d', dd); });
			len = line.getTotalLength();
			line.style.strokeDasharray = len + ' ' + len;
			tail.style.strokeDasharray = TAIL + ' ' + (len * 2);
			nodes.forEach(function (node, i) {
				var pt = line.getPointAtLength(len * (marks[i] || 0));
				node.style.transform = 'translate(' + pt.x + 'px,' + pt.y + 'px)';
			});
		}

		function render(p) {
			var sp = clamp((p - 0.04) / 0.9, 0, 1);
			stage.style.setProperty('--p', p.toFixed(4));
			stage.style.setProperty('--mid', Math.sin(Math.PI * p).toFixed(4));
			stage.style.setProperty('--sp', sp.toFixed(4));
			var introOp = clamp(1 - p / 0.07, 0, 1);
			stage.style.setProperty('--intro', introOp.toFixed(3));
			var dist = len * sp;
			line.style.strokeDashoffset = (len - dist).toFixed(1);
			tail.style.strokeDashoffset = (-(dist - TAIL)).toFixed(1);
			var pt = line.getPointAtLength(dist);
			spark.style.transform = 'translate(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px)';
			spark.style.opacity = sp > 0 ? 1 : 0;
			var active = -1;
			nodes.forEach(function (node, i) {
				var on = sp >= marks[i];
				node.classList.toggle('is-on', on);
				if (on) { active = i; }
			});
			steps.forEach(function (s, i) {
				s.classList.toggle('is-active', i === active);
				s.classList.toggle('is-past', i < active);
			});
			if (count) { count.textContent = String(Math.max(0, active + 1)).padStart(2, '0'); }
		}

		build();
		H.on('resize', function () { build(); });
		if (!animate) { el.classList.add('is-static'); render(1); return; }
		H.scrub(el, { mode: 'pin', update: render });
	});

	/* Depth: scenes fly toward the viewer one after another (zoom tunnel). */
	H.register('depth', function (el) {
		var layers = $$('.hm-depth__layer', el);
		var count = el.querySelector('.hm-depth__now');
		var bar = el.querySelector('.hm-depth__bar span');
		var glow = el.querySelector('.hm-depth__glow');
		var n = layers.length;
		var current = -1;
		if (!n) { return; }
		if (!animate) { el.classList.add('is-static'); return; }
		layers.forEach(function (layer, i) {
			layer.style.zIndex = String(n - i);
			layer.__media = layer.querySelector('.hm-depth__media');
			layer.__text = layer.querySelector('.hm-depth__text');
		});
		H.scrub(el, {
			mode: 'pin',
			update: function (p) {
				// Each scene owns one slice of the track: it arrives from the distance,
				// holds, then passes through the camera while the next one arrives.
				var pos = p * (n - 0.35);
				for (var i = 0; i < n; i++) {
					var t = pos - i + 0.65;
					var layer = layers[i];
					var arrive = clamp(t / 0.65, 0, 1);
					var leave = i === n - 1 ? 0 : clamp((t - 0.95) / 0.7, 0, 1);
					var visible = t > -0.05 && leave < 1;
					layer.style.visibility = visible ? 'visible' : 'hidden';
					if (!visible) { continue; }
					var a = ease.out(arrive);
					var l = ease.inOut(leave);
					var scale = mix(0.32, 1, a) * mix(1, 3.4, l);
					var opacity = Math.min(a * 1.4, 1) * (1 - l);
					var blur = (1 - a) * 10 + l * 8;
					if (layer.__media) {
						layer.__media.style.transform = 'translate3d(0,0,0) scale(' + scale.toFixed(4) + ')';
						layer.__media.style.opacity = opacity.toFixed(3);
						layer.__media.style.filter = blur > 0.3 ? 'blur(' + blur.toFixed(1) + 'px)' : 'none';
					}
					if (layer.__text) {
						// Text sits closer to the camera: it moves faster and fades sooner.
						var ts = mix(0.6, 1, a) * mix(1, 1.9, l);
						layer.__text.style.transform = 'translate3d(0,' + ((1 - a) * 60 - l * 40).toFixed(1) + 'px,0) scale(' + ts.toFixed(4) + ')';
						layer.__text.style.opacity = (clamp((a - 0.35) / 0.65, 0, 1) * (1 - clamp(l * 1.6, 0, 1))).toFixed(3);
					}
				}
				var idx = Math.min(n - 1, Math.max(0, Math.floor(pos + 0.35)));
				if (idx !== current) {
					current = idx;
					if (count) { count.textContent = (idx < 9 ? formatNumber(0, 0, true) : '') + formatNumber(idx + 1, 0, true); }
					layers.forEach(function (layer, k) { layer.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); });
				}
				if (bar) { bar.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }
				if (glow) { glow.style.transform = 'translate3d(-50%,-50%,0) scale(' + mix(0.8, 1.6, p).toFixed(3) + ') rotate(' + (p * 120).toFixed(1) + 'deg)'; }
			}
		});
	});

	/* Flow: elements float at different depths, drift with scroll and lean toward the pointer. */
	H.register('flow', function (el) {
		var items = $$('.hm-flow__item', el);
		var mode = el.getAttribute('data-mode') || 'drift';
		var strength = parseFloat(el.getAttribute('data-strength')) || 1;
		var mx = 0, my = 0, tx = 0, ty = 0, prog = 0.5;
		if (!items.length) { return; }
		var data = items.map(function (item) {
			return {
				el: item,
				depth: parseFloat(item.getAttribute('data-depth')) || 0.5,
				x: parseFloat(item.getAttribute('data-x')) || 50,
				y: parseFloat(item.getAttribute('data-y')) || 50,
				rot: parseFloat(item.getAttribute('data-rot')) || 0
			};
		});
		if (!animate) { el.classList.add('is-static'); return; }

		function paint() {
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				var dx = 0, dy, sc = 1, op = 1, r = d.rot;
				if (mode === 'converge' || mode === 'disperse') {
					// converge: scattered and close to the camera → settle into place.
					var f = mode === 'converge' ? 1 - ease.out(clamp(prog / 0.55, 0, 1)) : ease.inOut(clamp((prog - 0.45) / 0.55, 0, 1));
					dx = (d.x - 50) * f * 9 * strength;
					dy = (d.y - 50) * f * 7 * strength;
					sc = 1 + f * (0.8 + d.depth);
					op = 1 - f * 0.9;
					r = d.rot * (1 + f * 3);
				} else {
					dy = (0.5 - prog) * d.depth * 520 * strength;
					sc = 1 + (prog - 0.5) * d.depth * 0.16;
				}
				dx += tx * d.depth * 28;
				dy += ty * d.depth * 22;
				d.el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + (dy || 0).toFixed(1) + 'px,0) rotate(' + r.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
				if (op !== 1) { d.el.style.opacity = Math.max(0, op).toFixed(3); } else if (d.el.style.opacity) { d.el.style.opacity = ''; }
			}
		}

		H.scrub(el, { mode: 'through', update: function (p) { prog = p; paint(); } });

		if (finePointer) {
			var ticker = H.ticker(function () {
				tx = mix(tx, mx, 0.07);
				ty = mix(ty, my, 0.07);
				paint();
				return Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001;
			});
			ticker.active = false;
			el.addEventListener('pointermove', function (e) {
				var b = el.getBoundingClientRect();
				mx = ((e.clientX - b.left) / b.width - 0.5) * 2;
				my = ((e.clientY - b.top) / b.height - 0.5) * 2;
				ticker.active = true;
				requestFrame();
			});
			el.addEventListener('pointerleave', function () { mx = 0; my = 0; ticker.active = true; requestFrame(); });
		}
	});

	/* Stacking cards: each card scales back as the next one arrives. */
	H.register('stack', function (el) {
		var items = $$('.hm-stack__item', el);
		if (!animate) { return; }
		items.forEach(function (item, i) {
			var next = items[i + 1];
			if (!next) { return; }
			var card = item.querySelector('.hm-stack__card');
			H.scrub(next, {
				range: function (m) {
					var stickyTop = parseFloat(win.getComputedStyle(next).top) || 0;
					return [m.top - m.vh, m.top - stickyTop];
				},
				update: function (p) {
					var t = ease.out(p);
					card.style.transform = 'scale(' + mix(1, 0.9 + i * 0.012, t).toFixed(4) + ')';
					card.style.setProperty('--hm-dim', (t * 0.45).toFixed(3));
				}
			});
		});
	});

	/* Scroll-scrubbed text: words light up as the paragraph passes. */
	H.register('scrubtext', function (el) {
		var text = el.querySelector('.hm-scrubtext__text');
		H.split(text, 'words');
		if (!animate) { text.style.setProperty('--hm-p', 1); return; }
		H.scrub(el, {
			range: function (m) { return [m.top - m.vh * 0.85, m.top + m.h - m.vh * 0.45]; },
			update: function (p) { text.style.setProperty('--hm-p', p.toFixed(4)); }
		});
	});

	/* Marquee: compositor animation; speeds up and follows scroll direction. */
	H.register('marquee', function (el) {
		var track = el.querySelector('.hm-marquee__track');
		var group = el.querySelector('.hm-marquee__group');
		if (!track || !group || !track.animate) { return; }
		var speed = parseFloat(el.getAttribute('data-speed')) || 60;
		var reverse = el.getAttribute('data-direction') === 'reverse';
		var follow = el.hasAttribute('data-follow-scroll');
		var anim = null;
		var rate = 1;
		var dir = 1;

		function build() {
			// Clone the group until the track is at least two viewports wide.
			$$('.hm-marquee__group[aria-hidden]', track).forEach(function (c) { c.remove(); });
			var w = group.offsetWidth || 1;
			var copies = Math.max(1, Math.ceil((el.offsetWidth * 2) / w));
			for (var i = 0; i < copies; i++) {
				var clone = group.cloneNode(true);
				clone.setAttribute('aria-hidden', 'true');
				track.appendChild(clone);
			}
			var shift = w * (rtl ? 1 : -1) * (reverse ? -1 : 1);
			if (anim) { anim.cancel(); }
			anim = track.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(' + shift + 'px,0,0)' }], { duration: (w / speed) * 1000, iterations: Infinity });
			if (!animate) { anim.pause(); }
		}
		build();
		H.on('resize', build);
		if (!animate) { return; }

		var ticker = H.ticker(function (now, v) {
			if (follow && Math.abs(v) > 0.5) { dir = v > 0 ? 1 : -1; }
			var target = dir * (1 + Math.min(Math.abs(v) * 0.06, 4));
			rate = mix(rate, target, 0.08);
			anim.playbackRate = rate;
			return Math.abs(rate - target) > 0.01;
		});
		new IntersectionObserver(function (entries) {
			var on = entries[0].isIntersecting;
			ticker.active = on;
			if (on) { anim.play(); requestFrame(); } else { anim.pause(); }
		}).observe(el);
		el.addEventListener('pointerenter', function () { if (el.hasAttribute('data-pause-hover')) { anim.pause(); } });
		el.addEventListener('pointerleave', function () { if (el.hasAttribute('data-pause-hover')) { anim.play(); } });
	});

	/* Tabs with optional autoplay and progress bars. */
	H.register('tabs', function (el) {
		var tabs = $$('[role="tab"]', el);
		var panels = $$('[role="tabpanel"]', el);
		var delay = (parseFloat(el.getAttribute('data-autoplay')) || 0) * 1000;
		var current = Math.max(0, tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }));
		var timer = 0, visible = false, paused = false;
		el.style.setProperty('--hm-tab-dur', delay + 'ms');

		function select(i, focus) {
			current = (i + tabs.length) % tabs.length;
			tabs.forEach(function (t, k) {
				var on = k === current;
				t.setAttribute('aria-selected', on ? 'true' : 'false');
				t.tabIndex = on ? 0 : -1;
				t.classList.toggle('is-active', on);
			});
			panels.forEach(function (p, k) { p.classList.toggle('is-active', k === current); p.hidden = false; p.setAttribute('aria-hidden', k === current ? 'false' : 'true'); });
			if (focus) { tabs[current].focus(); }
			var bar = tabs[current].querySelector('.hm-tabs__bar');
			if (bar) { bar.classList.remove('is-run'); void bar.offsetWidth; bar.classList.add('is-run'); }
			schedule();
		}
		function schedule() {
			win.clearTimeout(timer);
			if (delay && visible && !paused && animate && !isEditor) { timer = win.setTimeout(function () { select(current + 1); }, delay); }
		}
		tabs.forEach(function (t, i) {
			t.addEventListener('click', function () { select(i); });
			t.addEventListener('keydown', function (e) {
				var next = rtl ? 'ArrowLeft' : 'ArrowRight', prev = rtl ? 'ArrowRight' : 'ArrowLeft';
				if (e.key === next || e.key === 'ArrowDown') { e.preventDefault(); select(current + 1, true); }
				if (e.key === prev || e.key === 'ArrowUp') { e.preventDefault(); select(current - 1, true); }
				if (e.key === 'Home') { e.preventDefault(); select(0, true); }
				if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
			});
		});
		el.addEventListener('pointerenter', function () { paused = true; el.classList.add('is-paused'); schedule(); });
		el.addEventListener('pointerleave', function () { paused = false; el.classList.remove('is-paused'); schedule(); });
		el.addEventListener('focusin', function () { paused = true; schedule(); });
		new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(el);
		select(current);
	});

	/* Accordion (FAQ). */
	H.register('accordion', function (el) {
		var single = el.getAttribute('data-single') !== 'false';
		$$('.hm-acc__btn', el).forEach(function (btn) {
			btn.addEventListener('click', function () {
				var item = btn.closest('.hm-acc__item');
				var open = !item.classList.contains('is-open');
				if (single) {
					$$('.hm-acc__item.is-open', el).forEach(function (o) {
						if (o !== item) { o.classList.remove('is-open'); o.querySelector('.hm-acc__btn').setAttribute('aria-expanded', 'false'); }
					});
				}
				item.classList.toggle('is-open', open);
				btn.setAttribute('aria-expanded', open ? 'true' : 'false');
			});
		});
	});

	/* Pricing: monthly / yearly switch. */
	H.register('pricing', function (el) {
		var sw = el.querySelector('.hm-pricing__switch');
		if (!sw) { return; }
		sw.addEventListener('click', function () {
			var yearly = sw.getAttribute('aria-checked') !== 'true';
			sw.setAttribute('aria-checked', yearly ? 'true' : 'false');
			el.classList.toggle('is-yearly', yearly);
		});
	});

	/* Contact / newsletter forms posted to the REST API. */
	H.register('form', function (el) {
		var form = el.tagName === 'FORM' ? el : el.querySelector('form');
		if (!form) { return; }
		var status = form.querySelector('.hm-form__status');
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (form.classList.contains('is-busy')) { return; }
			$$('.is-invalid', form).forEach(function (f) { f.classList.remove('is-invalid'); });
			var btn = form.querySelector('button[type="submit"]');
			form.classList.add('is-busy');
			if (btn) { btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
			status.textContent = '';
			status.className = 'hm-form__status';
			var data = new FormData(form);
			fetch((cfg.rest || '/wp-json/hamista/v1/') + 'forms/submit', { method: 'POST', body: data, credentials: 'same-origin' })
				.then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
				.then(function (res) {
					form.classList.remove('is-busy');
					if (btn) {
						btn.classList.remove('is-loading');
						btn.removeAttribute('aria-busy');
						btn.classList.add(res.ok ? 'is-success' : 'is-error');
						win.setTimeout(function () { btn.classList.remove('is-success', 'is-error'); }, res.ok ? 2400 : 1600);
					}
					status.textContent = res.body.message || '';
					status.classList.add(res.ok ? 'is-ok' : 'is-error');
					if (res.ok) { form.reset(); form.classList.add('is-sent'); }
					if (res.body.data && res.body.data.fields) {
						res.body.data.fields.forEach(function (name) {
							var f = form.querySelector('[name="' + name + '"]');
							if (f) { f.classList.add('is-invalid'); }
						});
					}
				})
				.catch(function () {
					form.classList.remove('is-busy');
					if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
					status.textContent = (cfg.i18n && cfg.i18n.network) || 'Network error';
					status.classList.add('is-error');
				});
		});
	});

	/* Hero mosaic: columns drift at different speeds. */
	H.register('mosaic', function (el) {
		if (!animate) { return; }
		var cols = $$('.hm-mosaic__col', el);
		H.scrub(el, {
			update: function (p) {
				cols.forEach(function (c, i) {
					var speed = [-0.9, 0.5, -0.4, 0.8][i % 4];
					c.style.transform = 'translate3d(0,' + ((p - 0.3) * speed * 260).toFixed(1) + 'px,0)';
				});
			}
		});
	});

	/* Image reveal: clip opens on entry, image drifts inside. */
	H.register('imgreveal', function (el) {
		var img = el.querySelector('img, video');
		var amount = parseFloat(el.getAttribute('data-parallax')) || 0;
		if (!animate || !img || !amount) { return; }
		H.scrub(el, {
			update: function (p) {
				img.style.transform = 'translate3d(0,' + ((0.5 - p) * amount * 30).toFixed(2) + '%,0) scale(' + (1 + amount * 0.3).toFixed(3) + ')';
			}
		});
	});

	/* Click-to-load map (no third-party request until asked). */
	H.register('mapload', function (el) {
		var btn = el.querySelector('[data-src]');
		if (!btn) { return; }
		btn.addEventListener('click', function () {
			var frame = doc.createElement('iframe');
			frame.src = btn.getAttribute('data-src');
			frame.loading = 'lazy';
			frame.title = btn.textContent.trim();
			frame.allowFullscreen = true;
			frame.referrerPolicy = 'no-referrer-when-downgrade';
			el.appendChild(frame);
			el.classList.add('is-loaded');
			btn.remove();
		});
	});

	/* ------------------------------------------------------------------ */
	/* Boot                                                               */
	/* ------------------------------------------------------------------ */
	function boot() {
		H.init(doc);
		setupCursor();
		H.ready = true;
		root.classList.add('hm-motion-ready');
		requestFrame();
	}
	if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); } else { boot(); }

	// Elementor editor: initialise elements as they are (re)rendered.
	if (win.jQuery) {
		win.jQuery(win).on('elementor/frontend/init', function () {
			if (!win.elementorFrontend || !win.elementorFrontend.isEditMode()) { return; }
			win.elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
				H.init($scope[0]);
				scheduleRefresh();
			});
		});
	}
}(window, document));
