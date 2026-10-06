/*!
 * Hamista — multi-step lead form.
 * One question per screen, per-step validation, answers kept in the browser
 * until sent, and explicit button states (loading, success, error).
 */
(function (win, doc) {
	'use strict';

	var H = win.Hamista;
	if (!H || !H.register) { return; }

	var t = win.hamistaLeadForm || {};
	var cfg = win.hamistaMotion || {};
	var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var STORE = 'hm-lead:';

	function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
	function toLatin(s) { return String(s).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; }).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }); }
	function mobileOk(v) { v = toLatin(v).replace(/[\s\-().]/g, '').replace(/^(\+98|0098|98)(?=9\d{9}$)/, '0'); if (/^9\d{9}$/.test(v)) { v = '0' + v; } return /^09\d{9}$/.test(v); }
	function store(fn) { try { return fn(win.localStorage); } catch (e) { return null; } }

	H.register('leadform', function (el) {
		var form = el.querySelector('form');
		var steps = $$('.hm-lead__step', form);
		var dots = $$('.hm-lead__nav li', el);
		var bar = el.querySelector('.hm-lead__bar span');
		var prev = el.querySelector('[data-prev]');
		var next = el.querySelector('[data-next]');
		var submit = el.querySelector('[data-submit]');
		var done = el.querySelector('.hm-lead__done');
		var resume = el.querySelector('.hm-lead__resume');
		var key = STORE + el.getAttribute('data-key');
		var remember = el.hasAttribute('data-remember') && !cfg.editor;
		var current = 0;

		function show(i, focus) {
			var from = current;
			current = Math.max(0, Math.min(steps.length - 1, i));
			steps.forEach(function (s, k) {
				var on = k === current;
				s.hidden = !on;
				s.classList.toggle('is-active', on);
				s.classList.toggle('is-back', on && current < from);
			});
			dots.forEach(function (d, k) {
				d.classList.toggle('is-current', k === current);
				d.classList.toggle('is-done', k < current);
			});
			if (bar) { bar.style.transform = 'scaleX(' + ((current + 1) / steps.length).toFixed(3) + ')'; }
			prev.hidden = current === 0;
			next.hidden = current === steps.length - 1;
			submit.hidden = current !== steps.length - 1;
			if (focus) {
				var q = steps[current].querySelector('.hm-lead__q');
				if (q) { q.focus({ preventScroll: true }); }
				var top = el.getBoundingClientRect().top;
				if (top < 0 || top > win.innerHeight * 0.4) {
					if (H.scroll && H.scroll.to) { H.scroll.to(win.pageYOffset + top - 120); } else { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
				}
			}
			save();
		}

		function message(step, text) {
			var box = step.querySelector('[data-hm-msg]');
			if (box) { box.textContent = text || ''; }
		}

		function shake(node) {
			if (reduce || !node || !node.animate) { return; }
			node.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], { duration: 320, easing: 'cubic-bezier(.36,.07,.19,.97)' });
		}

		// Returns the first invalid control of a step (and marks it), or null.
		function validate(step) {
			var bad = null;
			$$('.is-invalid', step).forEach(function (n) { n.classList.remove('is-invalid'); n.removeAttribute('aria-invalid'); });
			message(step, '');
			$$('[data-required]', step).forEach(function (group) {
				if (bad || group.querySelector('input:checked')) { return; }
				bad = group;
				group.classList.add('is-invalid');
				message(step, group.querySelector('input[type="checkbox"]') ? t.pick : t.pickOne);
			});
			if (bad) { return bad; }
			$$('input[name]:not([type="checkbox"]):not([type="radio"]), textarea[name]', step).forEach(function (f) {
				if (bad) { return; }
				var v = f.value.trim();
				var text = '';
				if (f.required && !v) { text = t.field; }
				else if (v && f.name === 'phone' && !mobileOk(v)) { text = t.mobile; }
				else if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { text = t.email; }
				if (text) { bad = f; f.classList.add('is-invalid'); f.setAttribute('aria-invalid', 'true'); message(step, text); }
			});
			var consent = step.querySelector('input[name="consent"]');
			if (!bad && consent && !consent.checked) { bad = consent; consent.classList.add('is-invalid'); message(step, t.consent); }
			return bad;
		}

		function go(dir) {
			if (dir > 0) {
				var bad = validate(steps[current]);
				if (bad) { shake(bad.closest('.hm-lead__choices, .hm-lead__pills, .hm-field') || bad); if (bad.focus) { (bad.querySelector ? (bad.querySelector('input') || bad) : bad).focus(); } return; }
			}
			show(current + dir, true);
		}

		/* ---- Draft: kept in this browser until the request is sent ---- */
		function collect() {
			var data = { step: current, v: {} };
			$$('input[name], textarea[name]', form).forEach(function (f) {
				if (f.type === 'hidden' || f.name === 'hm_hp') { return; }
				if (f.type === 'checkbox' || f.type === 'radio') {
					if (f.checked) { (data.v[f.name] = data.v[f.name] || []).push(f.value); }
				} else if (f.value) { data.v[f.name] = f.value; }
			});
			return data;
		}
		function save() {
			if (!remember) { return; }
			var data = collect();
			var empty = !Object.keys(data.v).length;
			store(function (s) { if (empty) { s.removeItem(key); } else { s.setItem(key, JSON.stringify(data)); } });
		}
		function restore(data) {
			$$('input[name], textarea[name]', form).forEach(function (f) {
				var v = data.v[f.name];
				if (v === undefined) { return; }
				if (f.type === 'checkbox' || f.type === 'radio') { f.checked = v.indexOf(f.value) !== -1; } else { f.value = v; }
			});
			show(data.step || 0, true);
		}

		if (remember) {
			var draft = store(function (s) { return JSON.parse(s.getItem(key) || 'null'); });
			if (draft && draft.v && Object.keys(draft.v).length) {
				resume.hidden = false;
				resume.querySelector('[data-resume]').addEventListener('click', function () { resume.hidden = true; restore(draft); });
				resume.querySelector('[data-restart]').addEventListener('click', function () { resume.hidden = true; store(function (s) { s.removeItem(key); }); show(0, true); });
			}
		}

		/* ---- Events ---- */
		next.addEventListener('click', function () { go(1); });
		prev.addEventListener('click', function () { go(-1); });
		form.addEventListener('change', function (e) {
			var step = e.target.closest('.hm-lead__step');
			if (step && step.querySelector('.is-invalid')) { validate(step); }
			save();
			// Single-choice first step: move on as soon as an option is picked.
			if (e.target.type === 'radio' && e.target.name === 'need[]') { win.setTimeout(function () { go(1); }, reduce ? 0 : 220); }
		});
		form.addEventListener('input', function (e) {
			if (e.target.classList.contains('is-invalid')) { validate(e.target.closest('.hm-lead__step')); }
			save();
		});
		form.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON' && current < steps.length - 1) { e.preventDefault(); go(1); }
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (submit.classList.contains('is-loading')) { return; }
			var bad = validate(steps[current]);
			if (bad) { shake(bad.closest('.hm-field') || bad); bad.focus(); return; }
			submit.classList.remove('is-error');
			submit.classList.add('is-loading');
			submit.setAttribute('aria-busy', 'true');
			fetch((cfg.rest || '/wp-json/hamista/v1/') + 'forms/submit', { method: 'POST', body: new FormData(form), credentials: 'same-origin' })
				.then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
				.then(function (res) {
					submit.classList.remove('is-loading');
					submit.removeAttribute('aria-busy');
					if (!res.ok) { fail(res.body); return; }
					submit.classList.add('is-success');
					if (win.navigator.vibrate && win.matchMedia('(pointer: coarse)').matches) { win.navigator.vibrate(12); }
					store(function (s) { s.removeItem(key); });
					win.setTimeout(finish, reduce ? 0 : 650);
				})
				.catch(function () { submit.classList.remove('is-loading'); submit.removeAttribute('aria-busy'); fail({ message: (cfg.i18n && cfg.i18n.network) || 'Network error' }); });
		});

		function fail(body) {
			submit.classList.add('is-error');
			shake(submit);
			win.setTimeout(function () { submit.classList.remove('is-error'); }, 1600);
			var fields = body && body.data && body.data.fields;
			if (fields && fields.length) {
				// Jump back to the first step that holds a rejected answer.
				for (var i = 0; i < steps.length; i++) {
					var hit = fields.map(function (n) { return steps[i].querySelector('[name="' + n + '"]'); }).filter(Boolean)[0];
					if (hit) { show(i, true); hit.classList.add('is-invalid'); message(steps[i], body.message); return; }
				}
			}
			message(steps[current], body && body.message);
		}

		function finish() {
			form.hidden = true;
			$$('.hm-lead__nav, .hm-lead__bar', el).forEach(function (n) { n.hidden = true; });
			el.classList.add('is-done');
			done.hidden = false;
			done.focus({ preventScroll: true });
		}

		show(0, false);
	});
}(window, document));
