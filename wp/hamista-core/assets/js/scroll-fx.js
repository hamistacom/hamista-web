/*!
 * Hamista scroll effects
 * Light line, scroll colour, zoom in/out on any element and card motions.
 * Loaded only on pages that use one of them; runs on the engine's single
 * frame loop and writes nothing while the page is still.
 */
(function (win, doc) {
	'use strict';

	var H = win.Hamista;
	if (!H || H.fx) { return; }
	H.fx = true;

	var u = H.util;
	var clamp = u.clamp, mix = u.mix, ease = u.ease, $$ = u.$$;
	var root = doc.documentElement;
	var NS = 'http://www.w3.org/2000/svg';
	var narrowQuery = win.matchMedia('(max-width: 767px)');

	function json(str) { try { return JSON.parse(str) || {}; } catch (e) { return {}; } }
	function docTop(el) { return el.getBoundingClientRect().top + win.scrollY; }
	function vh() { return win.innerHeight; }
	function smooth(t) { return t * t * (3 - 2 * t); }

	/* ------------------------------------------------------------------ */
	/* Colours                                                             */
	/* ------------------------------------------------------------------ */
	var probe = null;

	/** Any CSS colour (hex, var(), color-mix…) → [r, g, b, a] as the browser resolves it. */
	function resolveColor(value, scope) {
		if (!probe) {
			probe = doc.createElement('i');
			probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
		}
		(scope || doc.body).appendChild(probe);
		probe.style.color = '';
		probe.style.color = value;
		var c = win.getComputedStyle(probe).color || '';
		probe.parentNode.removeChild(probe);
		var n = (c.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
		if (/^color\(srgb/.test(c)) { return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] === undefined ? 1 : n[3]]; }
		return [n[0], n[1], n[2], n[3] === undefined ? 1 : n[3]];
	}
	function mixColor(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t), mix(a[3], b[3], t)]; }
	function rgb(c, alpha) {
		var a = alpha === undefined ? c[3] : alpha;
		return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (+a.toFixed(3)) + ')';
	}
	function sameColor(a, b) { return a && b && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1.5; }

	// Colours follow the light/dark switch.
	var schemeListeners = [];
	function onScheme(fn) { schemeListeners.push(fn); }
	if ('MutationObserver' in win) {
		new MutationObserver(function () { schemeListeners.forEach(function (fn) { fn(); }); })
			.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
	}

	/* ------------------------------------------------------------------ */
	/* Light line: a thread of light drawn down the page with the scroll   */
	/* ------------------------------------------------------------------ */
	var lightCount = 0;

	function setupLight(el) {
		if (el.__hmLight) { return; }
		el.__hmLight = true;
		var o = json(el.getAttribute('data-hm-light'));
		var mode = o.mode || 'weave';
		// Curve: a quiet thread that crosses the page between sections, each run in its section's colour.
		var curve = mode === 'curve';
		var secColors = [];
		var width = clamp(parseFloat(o.w) || 2, 1, 6);
		var TAIL = 180;
		var palette = [o.a || 'var(--hm-accent)', o.b || 'color-mix(in srgb, var(--hm-accent) 45%, var(--hm-fg))'];
		if (o.c) { palette.push(o.c); }

		if (win.getComputedStyle(el).position === 'static') { el.style.position = 'relative'; }
		var layer = doc.createElement('div');
		layer.className = 'hm-light' + (o.track === false ? '' : ' has-track') + (curve ? ' hm-light--curve' : '');
		layer.setAttribute('aria-hidden', 'true');
		layer.style.setProperty('--hm-light-w', width + 'px');
		var head = doc.createElement('div');
		head.className = 'hm-light__head';
		layer.appendChild(head);
		el.appendChild(layer);

		var segs = [];
		var samples = [];
		var total = 0;
		var top = 0;
		var colors = [];
		var lastL = -1;
		var hidden = false;

		function sections() {
			var host = el.querySelector(':scope > .e-con-inner') || el;
			return Array.prototype.filter.call(host.children, function (k) {
				return k !== layer && k.offsetHeight > 0 && !/^(SCRIPT|STYLE|LINK)$/.test(k.tagName);
			});
		}

		function colorAt(f) {
			if (colors.length < 2) { return colors[0] || [255, 255, 255, 1]; }
			var x = clamp(f, 0, 1) * (colors.length - 1);
			var i = Math.min(colors.length - 2, Math.floor(x));
			return mixColor(colors[i], colors[i + 1], x - i);
		}

		function resolvePalette() {
			colors = palette.map(function (c) { return resolveColor(c, el); });
			if (curve) {
				// Each section lends the thread its own accent, so tinted sections show through.
				secColors = sections().map(function (sec) {
					var inner = sec.querySelector('[class*="hm-scheme-"], .e-con') || sec;
					return resolveColor('var(--hm-accent)', inner);
				});
				if (o.a) { secColors[0] = colors[0]; }
			}
		}

		function paintStops() {
			if (curve) {
				segs.forEach(function (s, i) {
					var stops = s.grad.children;
					var c0 = rgb(secColors[Math.max(0, i - 1)] || [128, 128, 128, 1], 1);
					var c1 = rgb(secColors[i] || [128, 128, 128, 1], 1);
					stops[0].setAttribute('stop-color', i ? c0 : c1);
					stops[1].setAttribute('stop-color', c1);
					stops[2].setAttribute('stop-color', c1);
					if (s.node) { s.node.setAttribute('fill', c1); }
				});
				return;
			}
			var span = Math.max(1, segs.length ? segs[segs.length - 1].y1 - segs[0].y0 : 1);
			var y0 = segs.length ? segs[0].y0 : 0;
			segs.forEach(function (s) {
				var stops = s.grad.children;
				for (var k = 0; k < stops.length; k++) {
					var f = (s.y0 + (s.y1 - s.y0) * (k / (stops.length - 1)) - y0) / span;
					stops[k].setAttribute('stop-color', rgb(colorAt(f), 1));
				}
			});
		}

		function svgEl(name, attrs) {
			var n = doc.createElementNS(NS, name);
			Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
			return n;
		}

		function build() {
			segs.forEach(function (s) { s.svg.parentNode.removeChild(s.svg); });
			segs = [];
			samples = [];
			total = 0;
			lastL = -1;
			hidden = narrowQuery.matches && o.mobile === false;
			layer.style.display = hidden ? 'none' : '';
			if (hidden) { return; }

			var W = el.clientWidth;
			var list = sections();
			if (!list.length) { return; }
			top = docTop(el);
			var cw = parseFloat(win.getComputedStyle(root).getPropertyValue('--hm-container')) || 1150;
			var margin = (W - Math.min(W, cw)) / 2;
			var narrow = margin < 56;
			var inset = narrow ? 9 : clamp(margin / 2, 28, 140);
			var startX = H.rtl ? W - inset : inset;
			var endX = W - startX;
			var amp = narrow || curve ? 0 : Math.min(inset * 0.3, 16);
			var k = curve ? Math.min(150, vh() * 0.17) : Math.min(110, vh() * 0.12);
			var weave = (mode === 'weave' || curve) && !narrow;

			// One run per section; a weave crosses to the other margin at each boundary.
			var runs = list.map(function (sec, i) {
				var y = docTop(sec) - top;
				var x = mode === 'end' ? endX : startX;
				if (weave) { x = i % 2 ? endX : startX; }
				return { y0: y, y1: y + sec.offsetHeight, x: x };
			});
			runs.forEach(function (r, i) {
				var cross = weave && i > 0;
				var a = cross ? r.y0 - k : r.y0;
				var b = weave && i < runs.length - 1 ? r.y1 - k : r.y1;
				var d = '';
				if (cross) {
					var px = runs[i - 1].x;
					d = 'M' + px.toFixed(1) + ' 0 C' + px.toFixed(1) + ' ' + k.toFixed(1) + ' ' + r.x.toFixed(1) + ' ' + k.toFixed(1) + ' ' + r.x.toFixed(1) + ' ' + (2 * k).toFixed(1);
				} else {
					d = 'M' + r.x.toFixed(1) + ' 0';
				}
				var crossD = cross ? d : '';
				// A gentle wave down the margin, one bend every ~520px.
				var from = cross ? 2 * k : 0;
				var run = (b - a) - from;
				if (run > 1) {
					var n = Math.max(1, Math.round(run / 520));
					var step = run / n;
					for (var j = 0; j < n; j++) {
						var s = (i + j) % 2 ? 1 : -1;
						var yA = from + step * j;
						var bend = (r.x + amp * s).toFixed(1);
						d += ' C' + bend + ' ' + (yA + step / 3).toFixed(1) + ' ' + bend + ' ' + (yA + step * 2 / 3).toFixed(1) + ' ' + r.x.toFixed(1) + ' ' + (yA + step).toFixed(1);
					}
				}
				var h = Math.max(1, b - a);
				var id = 'hm-light-' + (++lightCount);
				var svg = svgEl('svg', { class: 'hm-light__seg', width: W, height: h.toFixed(0), viewBox: '0 0 ' + W + ' ' + h.toFixed(1), fill: 'none' });
				svg.style.top = a.toFixed(1) + 'px';
				var grad = svgEl('linearGradient', { id: id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: h.toFixed(1) });
				var mid = curve && cross ? Math.min(0.9, (2 * k) / h).toFixed(3) : '.5';
				grad.appendChild(svgEl('stop', { offset: '0' }));
				grad.appendChild(svgEl('stop', { offset: mid }));
				grad.appendChild(svgEl('stop', { offset: '1' }));
				var defs = svgEl('defs');
				defs.appendChild(grad);
				svg.appendChild(defs);
				var track = svgEl('path', { d: d, class: 'hm-light__track' });
				var glow = svgEl('path', { d: d, class: 'hm-light__glow', stroke: 'url(#' + id + ')' });
				var line = svgEl('path', { d: d, class: 'hm-light__line', stroke: 'url(#' + id + ')' });
				var tail = svgEl('path', { d: d, class: 'hm-light__tail', stroke: 'url(#' + id + ')' });
				svg.appendChild(track);
				if (!curve) { svg.appendChild(glow); }
				svg.appendChild(line);
				if (!curve) { svg.appendChild(tail); }
				var node = null;
				if (curve) {
					// A small node where the thread settles into each section.
					node = svgEl('circle', { cx: r.x.toFixed(1), cy: (cross ? 2 * k : 0).toFixed(1), r: 3.5, class: 'hm-light__node' });
					svg.appendChild(node);
				}
				layer.insertBefore(svg, head);
				var len = line.getTotalLength();
				var crossLen = 0;
				if (curve && crossD) {
					var probe = svgEl('path', { d: crossD });
					svg.appendChild(probe);
					crossLen = probe.getTotalLength();
					svg.removeChild(probe);
				}
				line.style.strokeDasharray = glow.style.strokeDasharray = len + ' ' + (len + 2);
				tail.style.strokeDasharray = TAIL + ' ' + (len + TAIL * 2);
				var seg = { svg: svg, grad: grad, glow: glow, line: line, tail: tail, node: node, nodeAt: crossLen, y0: a, y1: b, l0: total, len: len, drawn: -1, tailAt: null };
				segs.push(seg);
				for (var l = 0; l <= len; l += 12) {
					var pt = line.getPointAtLength(l);
					samples.push({ l: total + l, x: pt.x, y: a + pt.y });
				}
				var end = line.getPointAtLength(len);
				samples.push({ l: total + len, x: end.x, y: a + end.y });
				total += len;
			});
			resolvePalette();
			paintStops();
			paint(true);
		}

		// Path length at a given height: samples rise monotonically, so a binary search finds it.
		function at(y) {
			var lo = 0, hi = samples.length - 1;
			if (!samples.length) { return null; }
			if (y <= samples[0].y) { return samples[0]; }
			if (y >= samples[hi].y) { return samples[hi]; }
			while (hi - lo > 1) {
				var mid = (lo + hi) >> 1;
				if (samples[mid].y <= y) { lo = mid; } else { hi = mid; }
			}
			var a = samples[lo], b = samples[hi];
			var t = (y - a.y) / Math.max(0.001, b.y - a.y);
			return { l: mix(a.l, b.l, t), x: mix(a.x, b.x, t), y: y };
		}

		function paint(force) {
			if (hidden || !segs.length) { return; }
			var L = total;
			var p = null;
			if (H.animate) {
				p = at(win.scrollY + vh() * 0.62 - top);
				L = p ? p.l : 0;
			}
			if (!force && Math.abs(L - lastL) < 0.5) { return; }
			lastL = L;
			for (var i = 0; i < segs.length; i++) {
				var s = segs[i];
				var local = clamp(L - s.l0, 0, s.len);
				if (force || Math.abs(local - s.drawn) > 0.3) {
					s.drawn = local;
					var off = (s.len - local).toFixed(1);
					s.line.style.strokeDashoffset = off;
					s.glow.style.strokeDashoffset = off;
					if (s.node) { s.node.classList.toggle('is-on', local >= s.nodeAt); }
				}
				if (curve) { continue; }
				var raw = L - s.l0;
				var tailOn = H.animate && raw > -TAIL && raw < s.len + TAIL;
				if (tailOn || s.tailAt !== null) {
					s.tail.style.strokeDashoffset = tailOn ? (TAIL - raw).toFixed(1) : String(TAIL * 4);
					s.tailAt = tailOn ? raw : null;
				}
			}
			if (!curve && p && L > 0 && L < total) {
				var span = Math.max(1, segs[segs.length - 1].y1 - segs[0].y0);
				head.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0)';
				head.style.color = rgb(colorAt((p.y - segs[0].y0) / span), 1);
				head.classList.add('is-on');
			} else {
				head.classList.remove('is-on');
			}
		}

		build();
		H.on('resize', build);
		onScheme(function () { resolvePalette(); paintStops(); paint(true); });
		H.scrub(el, {
			range: function (m) { return [m.top - m.vh, m.top + m.h]; },
			update: function () { paint(false); }
		});
	}

	/* ------------------------------------------------------------------ */
	/* Scroll colour: the page takes each section's colour as it arrives   */
	/* ------------------------------------------------------------------ */
	var PRESETS = {
		page: ['var(--hm-bg)', 'var(--hm-fg)'],
		surface: ['var(--hm-surface-2)', 'var(--hm-fg)'],
		inverse: ['var(--hm-inv-bg)', 'var(--hm-inv-fg)'],
		accent: ['var(--hm-accent)', 'var(--hm-accent-fg)'],
		soft: ['color-mix(in srgb, var(--hm-accent) 9%, var(--hm-bg))', 'var(--hm-fg)']
	};
	var tone = null;

	function toneSystem() {
		if (tone) { return tone; }
		var backdrop = doc.createElement('div');
		backdrop.className = 'hm-tone-bg';
		backdrop.setAttribute('aria-hidden', 'true');
		doc.body.insertBefore(backdrop, doc.body.firstChild);
		tone = { items: [], base: null, current: null, active: null, backdrop: backdrop };

		// Light presets keep the kit's own text, line and surface colours; dark and
		// custom tones derive them from their background and text colours.
		function tokens(bg, fg, kit) {
			if (kit) {
				return {
					bg: resolveColor(bg), fg: resolveColor(fg), muted: resolveColor('var(--hm-fg-muted)'),
					line: resolveColor('var(--hm-border)'), lineStrong: resolveColor('var(--hm-border-strong)'),
					surface: resolveColor('var(--hm-surface)'), surface2: resolveColor('var(--hm-surface-2)')
				};
			}
			var b = resolveColor(bg), f = resolveColor(fg);
			return {
				bg: b, fg: f, muted: mixColor(f, b, 0.36),
				line: [f[0], f[1], f[2], 0.12], lineStrong: [f[0], f[1], f[2], 0.22],
				surface: mixColor(b, f, 0.05), surface2: mixColor(b, f, 0.09)
			};
		}

		function resolveAll() {
			tone.base = tokens(PRESETS.page[0], PRESETS.page[1], true);
			tone.items.forEach(function (it) {
				var o = it.o;
				var preset = o.p !== 'custom' && PRESETS[o.p];
				var t = preset ? tokens(preset[0], preset[1], o.p === 'page' || o.p === 'surface' || o.p === 'soft')
					: tokens(o.bg || PRESETS.page[0], o.fg || PRESETS.page[1], false);
				// On an accent background, accent details take the text colour so they stay visible.
				t.ac = o.ac ? resolveColor(o.ac) : (o.p === 'accent' ? t.fg : null);
				t.el = it.el;
				it.t = t;
			});
			tone.active = null;
		}

		function measure() {
			tone.items.forEach(function (it) {
				it.top = docTop(it.el);
				it.bottom = it.top + it.el.offsetHeight;
			});
			tone.items.sort(function (a, b) { return a.top - b.top; });
		}

		function toneAt(y) {
			for (var i = tone.items.length - 1; i >= 0; i--) {
				var it = tone.items[i];
				if (it.t && y >= it.top && y < it.bottom) { return it.t; }
			}
			return tone.base;
		}

		function apply(t) {
			if (tone.active === t) { return; }
			tone.active = t;
			var st = root.style;
			st.setProperty('--hm-tone-bg', rgb(t.bg, 1));
			st.setProperty('--hm-tone-fg', rgb(t.fg, 1));
			st.setProperty('--hm-tone-muted', rgb(t.muted));
			st.setProperty('--hm-tone-line', rgb(t.line));
			st.setProperty('--hm-tone-line-strong', rgb(t.lineStrong));
			st.setProperty('--hm-tone-surface', rgb(t.surface));
			st.setProperty('--hm-tone-surface-2', rgb(t.surface2));
			if (t.ac) {
				st.setProperty('--hm-tone-accent', rgb(t.ac, 1));
				root.classList.add('hm-tone-ac');
			} else {
				root.classList.remove('hm-tone-ac');
			}
			root.classList.add('hm-toned');
		}

		// The background blends across a band around each boundary; text and
		// surfaces switch once the new colour holds the middle of the screen.
		function paint() {
			if (!tone.items.length || !tone.base) { return; }
			var h = vh();
			var y = win.scrollY + h * 0.5;
			var band = h * 0.3;
			var acc = [0, 0, 0, 0], wsum = 0;
			for (var k = -5; k <= 5; k++) {
				var wgt = 6 - Math.abs(k);
				var c = toneAt(y + band * k / 10).bg;
				acc[0] += c[0] * wgt; acc[1] += c[1] * wgt; acc[2] += c[2] * wgt; acc[3] += c[3] * wgt;
				wsum += wgt;
			}
			var blended = [acc[0] / wsum, acc[1] / wsum, acc[2] / wsum, 1];
			if (!sameColor(blended, tone.current)) {
				tone.current = blended;
				tone.backdrop.style.backgroundColor = rgb(blended, 1);
			}
			apply(toneAt(y));
		}

		tone.refresh = function () { resolveAll(); measure(); tone.current = null; paint(); };
		tone.paint = paint;
		H.on('resize', function () { measure(); paint(); });
		onScheme(function () {
			// Let the new scheme's variables land before reading them.
			win.requestAnimationFrame(tone.refresh);
		});
		H.scrub(doc.body, {
			range: function () { return [0, Math.max(1, root.scrollHeight - vh())]; },
			update: paint
		});
		return tone;
	}

	function setupTone(el) {
		if (el.__hmTone) { return; }
		el.__hmTone = true;
		var sys = toneSystem();
		sys.items.push({ el: el, o: json(el.getAttribute('data-hm-tone')) });
		if (!sys.pending) {
			sys.pending = true;
			win.requestAnimationFrame(function () { sys.pending = false; sys.refresh(); });
		}
	}

	/* ------------------------------------------------------------------ */
	/* Zoom in / out on any element                                         */
	/* ------------------------------------------------------------------ */
	function setupZoom(el) {
		if (el.__hmZoom || !H.animate) { return; }
		el.__hmZoom = true;
		var o = json(el.getAttribute('data-hm-zoom'));
		var m = o.m || 'in';
		var a = clamp(parseFloat(o.a) || 0.2, 0.02, 0.8);
		var r = parseFloat(o.r);
		if (isNaN(r)) { r = 24; }
		var target = el.querySelector(':scope > .elementor-widget-container') || el;
		var media = o.inner ? target.querySelector('img, video') : null;
		var phone = narrowQuery.matches;
		if (phone) { a *= 0.6; }
		target.style.willChange = m === 'expand' || m === 'shrink' ? 'clip-path' : 'transform';
		if (media) { media.style.willChange = 'transform'; }

		function insetFor(t) {
			// t = 0 → card, 1 → edge to edge.
			var x = (1 - t) * Math.min(a * 50, phone ? 6 : 22);
			var y = (1 - t) * Math.min(a * 22, 10);
			return 'inset(' + y.toFixed(2) + '% ' + x.toFixed(2) + '% round ' + ((1 - t) * r).toFixed(1) + 'px)';
		}

		var opts = { update: null };
		if (m === 'in' || m === 'out' || m === 'expand') {
			opts.mode = 'center';
		} else {
			// shrink / through: from the moment it is centred until it leaves the top.
			opts.range = function (q) { return [q.top + q.h / 2 - q.vh / 2, q.top + q.h]; };
		}
		opts.update = function (p) {
			var t = ease.out(p);
			if (m === 'in') {
				target.style.scale = mix(1 - a, 1, t).toFixed(4);
				if (media) { media.style.scale = mix(1 + a, 1, t).toFixed(4); }
			} else if (m === 'out') {
				target.style.scale = mix(1 + a, 1, t).toFixed(4);
			} else if (m === 'expand') {
				target.style.clipPath = insetFor(t);
				if (media) { media.style.scale = mix(1 + a * 0.8, 1, t).toFixed(4); }
			} else if (m === 'shrink') {
				var s = ease.inOut(p);
				target.style.clipPath = insetFor(1 - s);
				if (media) { media.style.scale = mix(1, 1 + a * 0.6, s).toFixed(4); }
			} else if (m === 'through') {
				var f = p * p;
				target.style.scale = mix(1, 1 + a * 4, f).toFixed(4);
				target.style.opacity = clamp(1 - (p - 0.35) / 0.65, 0, 1).toFixed(3);
			}
		};
		H.scrub(el, opts);
	}

	/* ------------------------------------------------------------------ */
	/* Card motions: the items inside a container move as a group          */
	/* ------------------------------------------------------------------ */
	function kids(node) {
		return Array.prototype.filter.call(node.children, function (k) { return !/^(SCRIPT|STYLE|TEMPLATE|LINK)$/.test(k.tagName) && !k.classList.contains('hm-light'); });
	}
	function signature(node) {
		var sig = node.tagName + '.' + (node.classList[0] || '');
		if (node.classList.contains('e-con')) { sig += ':con'; } else if (node.hasAttribute('data-widget_type')) { sig += ':' + node.getAttribute('data-widget_type'); }
		return sig;
	}

	/**
	 * The cards inside a container: the largest set of alike, card-sized siblings
	 * found anywhere inside it (a grid of features, posts, plans, or the
	 * container's own columns), the shallowest set winning a tie.
	 */
	function findItems(el) {
		var host = el.querySelector(':scope > .e-con-inner') || el;
		var best = [], bestDepth = 99;
		var queue = [[host, 0]], guard = 0;
		while (queue.length && guard++ < 800) {
			var pair = queue.shift(), node = pair[0], depth = pair[1];
			var ch = kids(node);
			if (ch.length >= 2) {
				var groups = {};
				ch.forEach(function (c) { var sg = signature(c); (groups[sg] = groups[sg] || []).push(c); });
				Object.keys(groups).forEach(function (k) {
					var g = groups[k].filter(function (c) { return c.offsetWidth >= 100 && c.offsetHeight >= 48; });
					if (g.length >= 2 && (g.length > best.length || (g.length === best.length && depth < bestDepth))) { best = g; bestDepth = depth; }
				});
			}
			if (depth < 7) { ch.forEach(function (c) { queue.push([c, depth + 1]); }); }
		}
		return best;
	}

	/** Reading-order column of each item (right to left in RTL), for staggering a row. */
	function columns(items) {
		var rows = {};
		items.forEach(function (it) {
			var key = Math.round(it.offsetTop / 8);
			(rows[key] = rows[key] || []).push(it);
		});
		var col = new Map();
		Object.keys(rows).forEach(function (key) {
			rows[key].sort(function (a, b) { return H.rtl ? b.offsetLeft - a.offsetLeft : a.offsetLeft - b.offsetLeft; })
				.forEach(function (it, i) { col.set(it, i); });
		});
		return col;
	}

	function setupCards(el) {
		if (el.__hmCards || !H.animate) { return; }
		el.__hmCards = true;
		var mode = el.getAttribute('data-hm-cards') || 'cascade';
		var items = findItems(el);
		if (items.length < 2) { return; }
		if (narrowQuery.matches && (mode === 'spread' || mode === 'gather')) { mode = 'cascade'; }
		var list = items[0].parentElement;
		var col = columns(items);
		H.on('resize', function () { col = columns(items); });

		if (mode === 'cascade' || mode === 'flip') {
			if (mode === 'flip') { list.style.perspective = '1400px'; }
			items.forEach(function (it) {
				it.style.willChange = 'transform, opacity';
				if (mode === 'flip') { it.style.transformOrigin = '50% 0'; }
				H.scrub(it, {
					range: function (q) {
						var c = (col.get(it) || 0) * q.vh * 0.06;
						return [q.top - q.vh + c, q.top - q.vh * 0.5 + c];
					},
					update: function (p) {
						var t = ease.out(p);
						it.style.opacity = clamp(p * 1.6, 0, 1).toFixed(3);
						if (mode === 'flip') {
							it.style.rotate = 'x ' + mix(-62, 0, t).toFixed(2) + 'deg';
							it.style.translate = '0 ' + mix(30, 0, t).toFixed(1) + 'px';
						} else {
							it.style.translate = '0 ' + mix(80, 0, t).toFixed(1) + 'px';
							it.style.scale = mix(0.94, 1, t).toFixed(4);
						}
					}
				});
			});
			return;
		}

		if (mode === 'tilt') {
			list.style.perspective = '1600px';
			items.forEach(function (it) {
				H.scrub(it, {
					update: function (p) {
						var d = (p - 0.5) * 2;
						var k = Math.sign(d) * Math.pow(Math.abs(d), 1.6);
						it.style.rotate = 'x ' + (k * -18).toFixed(2) + 'deg';
						it.style.scale = (1 - Math.abs(k) * 0.06).toFixed(4);
					}
				});
			});
			return;
		}

		// spread: the items start as one stacked pile and deal out to their places.
		// gather: they start pushed away from the centre and close in.
		var geo = [];
		function measure() {
			var cx = 0, cy = 0;
			geo = items.map(function (it) {
				var g = { x: it.offsetLeft + it.offsetWidth / 2, y: it.offsetTop + it.offsetHeight / 2 };
				cx += g.x; cy += g.y;
				return g;
			});
			cx /= items.length; cy /= items.length;
			geo.forEach(function (g, i) {
				g.dx = cx - g.x;
				g.dy = cy - g.y;
				g.rot = (i % 2 ? 1 : -1) * (3 + (i * 5) % 7);
			});
		}
		measure();
		H.on('resize', measure);
		items.forEach(function (it) { it.style.willChange = 'transform, opacity'; });
		H.scrub(el, {
			mode: 'center',
			update: function (p) {
				var t = ease.out(clamp(p * 1.08, 0, 1));
				for (var i = 0; i < items.length; i++) {
					var g = geo[i];
					var it = items[i];
					if (!g) { continue; }
					if (mode === 'gather') {
						it.style.translate = (-g.dx * 0.55 * (1 - t)).toFixed(1) + 'px ' + (-g.dy * 0.55 * (1 - t)).toFixed(1) + 'px';
						it.style.rotate = (g.rot * (1 - t)).toFixed(2) + 'deg';
						it.style.opacity = clamp(t * 1.4, 0, 1).toFixed(3);
					} else {
						it.style.translate = (g.dx * (1 - t)).toFixed(1) + 'px ' + (g.dy * (1 - t)).toFixed(1) + 'px';
						it.style.rotate = (g.rot * (1 - t)).toFixed(2) + 'deg';
						it.style.scale = mix(0.9, 1, t).toFixed(4);
					}
				}
			}
		});
	}

	/* ------------------------------------------------------------------ */
	/* Init (also re-run for elements Elementor re-renders in the editor)   */
	/* ------------------------------------------------------------------ */
	function init(scope) {
		scope = scope || doc;
		var all = function (sel) {
			var list = $$(sel, scope);
			if (scope !== doc && scope.matches && scope.matches(sel)) { list.unshift(scope); }
			return list;
		};
		all('[data-hm-tone]').forEach(setupTone);
		all('[data-hm-zoom]').forEach(setupZoom);
		all('[data-hm-cards]').forEach(setupCards);
		// Last, so the line measures sections after other effects have set their heights.
		all('[data-hm-light]').forEach(setupLight);
	}

	H.on('init', init);
	if (H.ready) { init(doc); H.refresh(); }
}(window, document));
