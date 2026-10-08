/**
 * Hamista — Card Deck.
 *
 * A fanned stack of cards. Next/previous (buttons, swipe, arrow keys or the
 * timer) brings a card flying onto the top of the deck; the card that was on
 * top settles back into the fan. Only transform and opacity animate, and the
 * title of the arriving card types itself in. Visitors who prefer less motion
 * get a plain cross-fade and no typing.
 */
(function (win, doc) {
	'use strict';

	var H = win.Hamista = win.Hamista || {};
	var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
	var rtl = doc.documentElement.dir === 'rtl';
	var digits = /^fa/.test(doc.documentElement.lang || '') ? '۰۱۲۳۴۵۶۷۸۹' : null;

	function num(n) {
		var s = (n < 10 ? '0' : '') + n;
		return digits ? s.replace(/\d/g, function (d) { return digits[+d]; }) : s;
	}

	function setup(el) {
		var cfg = {};
		try { cfg = JSON.parse(el.getAttribute('data-hm-deck') || '{}'); } catch (e) { cfg = {}; }
		var cards = Array.prototype.slice.call(el.querySelectorAll('.hm-deck__card'));
		if (cards.length < 2) { return; }
		var order = cards.map(function (c, i) { return i; });
		var index = el.querySelector('[data-deck-index]');
		var bar = el.querySelector('.hm-deck__count i span');
		var timer = null, typing = null, busy = false, visible = true;

		function place(animateCard, from) {
			order.forEach(function (ci, pos) {
				var c = cards[ci];
				c.setAttribute('data-pos', String(Math.min(pos, 3)));
				var top = pos === 0;
				c.setAttribute('aria-hidden', top ? 'false' : 'true');
				if (c.tagName === 'A') { c.tabIndex = top ? 0 : -1; }
			});
			var top = cards[order[0]];
			if (index) { index.textContent = num(order[0] + 1); }
			if (bar) { bar.style.transform = 'scaleX(' + ((order[0] + 1) / cards.length).toFixed(3) + ')'; }
			if (animateCard && !reduce.matches && top.animate) {
				// The arriving card flies in from the side it was sent from and lands on the deck.
				var side = (from === 'next') === rtl ? 1 : -1;
				top.animate([
					{ transform: 'translate3d(' + (side * 70) + '%, -6%, 0) rotate(' + (side * 14) + 'deg) scale(.9)', opacity: 0 },
					{ transform: 'translate3d(' + (side * 8) + '%, -2%, 0) rotate(' + (side * 2) + 'deg) scale(1.02)', opacity: 1, offset: 0.7 },
					{ transform: 'none', opacity: 1 }
				], { duration: 720, easing: 'cubic-bezier(.22, 1, .36, 1)' });
			}
			type(top);
		}

		function type(card) {
			var t = card.querySelector('.hm-deck__title');
			if (!t) { return; }
			var full = t.getAttribute('data-text') || '';
			clearTimeout(typing);
			cards.forEach(function (c) {
				var other = c.querySelector('.hm-deck__title');
				if (other && other !== t) { other.textContent = other.getAttribute('data-text') || ''; other.classList.remove('is-typing'); }
			});
			if (!cfg.typing || reduce.matches || !full) { t.textContent = full; return; }
			var chars = Array.from ? Array.from(full) : full.split('');
			var i = 0;
			t.textContent = '';
			t.classList.add('is-typing');
			(function step() {
				i += 1;
				t.textContent = chars.slice(0, i).join('');
				if (i < chars.length) {
					typing = setTimeout(step, chars[i - 1] === ' ' ? 70 : 42);
				} else {
					typing = setTimeout(function () { t.classList.remove('is-typing'); }, 900);
				}
			}());
		}

		function go(dir) {
			if (busy) { return; }
			busy = true;
			setTimeout(function () { busy = false; }, 460);
			// Next: the following card comes over the top one, which settles to the back.
			order = rotate(dir === 'next' ? 1 : -1);
			place(true, dir);
			restart();
		}

		// Rebuild the order from a single step so the fan always reads top, next, next…
		var current = 0;
		function rotate(step) {
			current = (current + step + cards.length) % cards.length;
			var list = [];
			for (var k = 0; k < cards.length; k++) { list.push((current + k) % cards.length); }
			return list;
		}

		function restart() {
			clearInterval(timer);
			if (cfg.auto > 0 && visible && !reduce.matches) {
				timer = setInterval(function () { if (!doc.hidden) { go('next'); } }, cfg.auto * 1000);
			}
		}

		el.addEventListener('click', function (e) {
			var b = e.target.closest('[data-deck]');
			if (b) { go(b.getAttribute('data-deck')); }
		});
		el.addEventListener('keydown', function (e) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
			var forward = (e.key === 'ArrowLeft') === rtl;
			go(forward ? 'next' : 'prev');
			e.preventDefault();
		});
		el.addEventListener('pointerenter', function () { clearInterval(timer); });
		el.addEventListener('pointerleave', restart);
		el.addEventListener('focusin', function () { clearInterval(timer); });

		// Swipe on touch screens.
		var sx = null, sy = 0;
		var stage = el.querySelector('.hm-deck__stage');
		stage.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
		stage.addEventListener('pointerup', function (e) {
			if (sx === null) { return; }
			var dx = e.clientX - sx, dy = e.clientY - sy;
			sx = null;
			if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { go((dx < 0) === rtl ? 'prev' : 'next'); }
		});

		if ('IntersectionObserver' in win) {
			new IntersectionObserver(function (entries) {
				visible = entries[0].isIntersecting;
				if (visible) { restart(); } else { clearInterval(timer); }
			}).observe(el);
		}

		order = rotate(0);
		place(false);
		el.classList.add('is-ready');
		restart();
	}

	if (H.register) {
		H.register('card-stack', setup);
	} else {
		doc.addEventListener('DOMContentLoaded', function () {
			Array.prototype.forEach.call(doc.querySelectorAll('[data-hm-widget="card-stack"]'), setup);
		});
	}
}(window, document));
