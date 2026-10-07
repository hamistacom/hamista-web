/*!
 * Hamista booking: the booking flow and "My appointments".
 * No dependencies; talks to /wp-json/hamista/v1/booking/*.
 */
(function () {
	'use strict';

	var cfg = window.hamistaBooking || {};
	var t = cfg.i18n || {};
	var doc = document;
	var fa = /^fa/i.test(doc.documentElement.lang || '');
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function $(sel, el) { return (el || doc).querySelector(sel); }
	function $$(sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); }

	function num(value) {
		var s = String(value);
		return fa ? s.replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }) : s;
	}

	function latin(value) {
		return String(value || '')
			.replace(/[۰-۹]/g, function (d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
			.replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); });
	}

	function mobileOk(value) {
		return /^(\+?98|0098|0)?9\d{9}$/.test(latin(value).replace(/[\s\-()]/g, ''));
	}

	function el(tag, attrs, text) {
		var node = doc.createElement(tag);
		Object.keys(attrs || {}).forEach(function (key) {
			if (null !== attrs[key] && undefined !== attrs[key] && false !== attrs[key]) {
				node.setAttribute(key, true === attrs[key] ? '' : attrs[key]);
			}
		});
		if (undefined !== text) { node.textContent = text; }
		return node;
	}

	function api(path, options) {
		options = options || {};
		var headers = { Accept: 'application/json' };
		if (options.body) { headers['Content-Type'] = 'application/json'; }
		if (cfg.restNonce) { headers['X-WP-Nonce'] = cfg.restNonce; }
		return fetch(cfg.rest + path, {
			method: options.method || 'GET',
			credentials: 'same-origin',
			headers: headers,
			body: options.body ? JSON.stringify(options.body) : undefined
		}).then(function (res) {
			return res.json().catch(function () { return {}; }).then(function (data) {
				if (!res.ok) {
					var err = new Error(data && data.message ? data.message : t.error);
					err.code = data && data.code;
					throw err;
				}
				return data;
			});
		}, function () {
			var err = new Error(t.offline);
			err.code = 'offline';
			throw err;
		});
	}

	/* ------------------------------------------------------------------ */
	/* Booking                                                            */
	/* ------------------------------------------------------------------ */

	function Booking(root) {
		this.root = root;
		this.fixed = root.hasAttribute('data-fixed');
		this.expert = parseInt(root.getAttribute('data-expert'), 10) || 0;
		this.name = root.getAttribute('data-name') || '';
		this.fee = root.getAttribute('data-fee') || '';
		this.days = [];
		this.day = null;
		this.time = null;
		this.step = '';
		this.live = $('[data-hm-book-live]', root);
		this.daysEl = $('[data-hm-days]', root);
		this.slotsEl = $('[data-hm-slots]', root);
		this.form = $('[data-hm-book-form]', root);
		this.msg = $('[data-hm-book-msg]', root);

		root.addEventListener('click', this.onClick.bind(this));
		root.addEventListener('change', this.onChange.bind(this));
		root.addEventListener('keydown', this.onKey.bind(this));
		if (this.form) { this.form.addEventListener('submit', this.onSubmit.bind(this)); }

		this.pickButton = $('[data-step="expert"] [data-go="time"]', root);
		if (this.pickButton) { this.pickButton.disabled = !this.expert; }

		if (this.expert) {
			this.go('time', true);
		} else {
			this.go('expert', true);
		}
	}

	Booking.prototype.say = function (text) {
		if (this.live) { this.live.textContent = text || ''; }
	};

	Booking.prototype.go = function (step, quiet) {
		var root = this.root;
		if ('time' === step && !this.expert) {
			this.say(t.pickExpert);
			var first = $('input[type="radio"]', root);
			if (first) { first.focus(); }
			return;
		}
		if ('details' === step && !this.time) {
			this.say(t.pickTime);
			return;
		}
		var previous = this.step;
		this.step = step;
		$$('[data-step]', root).forEach(function (section) {
			section.hidden = section.getAttribute('data-step') !== step;
		});
		var order = ['expert', 'time', 'details', 'done'];
		var at = order.indexOf(step);
		$$('.hm-book__progress li', root).forEach(function (li) {
			var i = order.indexOf(li.getAttribute('data-for'));
			li.classList.toggle('is-current', i === at);
			li.classList.toggle('is-done', i < at);
		});
		root.setAttribute('data-at', step);

		if ('time' === step && (previous !== 'details' || !this.days.length)) {
			this.updateExpertLabel();
			this.loadDays();
		}
		if ('details' === step) {
			this.fillSummary();
		}

		var section = $('[data-step="' + step + '"]', root);
		if (section && !reduce && previous) {
			section.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' });
		}
		if (!quiet && section) {
			var focusTarget = 'done' === step ? section : $('.hm-book__label', section);
			if (focusTarget) {
				focusTarget.setAttribute('tabindex', '-1');
				focusTarget.focus({ preventScroll: true });
			}
			var top = root.getBoundingClientRect().top;
			if (top < 0 || top > window.innerHeight * 0.6) {
				root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
			}
		}
	};

	Booking.prototype.updateExpertLabel = function () {
		var target = $('[data-hm-book-expert]', this.root);
		if (target) { target.textContent = this.name; }
	};

	Booking.prototype.onChange = function (e) {
		var input = e.target;
		if ('radio' === input.type && /-expert$/.test(input.name)) {
			var id = parseInt(input.value, 10) || 0;
			if (id !== this.expert) {
				this.expert = id;
				this.name = input.getAttribute('data-name') || '';
				this.fee = input.getAttribute('data-fee') || '';
				this.days = [];
				this.day = null;
				this.time = null;
			}
			if (this.pickButton) { this.pickButton.disabled = false; }
		}
	};

	Booking.prototype.onClick = function (e) {
		var go = e.target.closest('[data-go]');
		if (go && this.root.contains(go)) {
			e.preventDefault();
			this.go(go.getAttribute('data-go'));
			return;
		}
		var day = e.target.closest('[data-day]');
		if (day && !day.disabled) {
			this.pickDay(day.getAttribute('data-day'), true);
			return;
		}
		var slot = e.target.closest('[data-time]');
		if (slot) {
			this.pickTime(slot.getAttribute('data-time'));
			return;
		}
		if (e.target.closest('[data-hm-book-again]')) {
			this.time = null;
			this.days = [];
			if (this.form) { this.form.reset(); }
			this.go(this.fixed ? 'time' : 'expert');
			return;
		}
		var login = e.target.closest('[data-hm-login]');
		if (login && window.HamistaAuth && 'function' === typeof window.HamistaAuth.open && $('.hm-auth-modal')) {
			e.preventDefault();
			window.HamistaAuth.open(login);
		}
	};

	// Arrow keys move between days and between times, like a radio group.
	Booking.prototype.onKey = function (e) {
		var item = e.target.closest('[data-day], [data-time]');
		if (!item || -1 === ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].indexOf(e.key)) { return; }
		var group = $$(item.hasAttribute('data-day') ? '[data-day]:not([disabled])' : '[data-time]', item.parentNode.closest('[data-hm-days], [data-hm-slots]'));
		var i = group.indexOf(item);
		var rtl = 'rtl' === getComputedStyle(item).direction;
		var next = i;
		if ('Home' === e.key) { next = 0; } else if ('End' === e.key) { next = group.length - 1; } else {
			var forward = 'ArrowDown' === e.key || (rtl ? 'ArrowLeft' === e.key : 'ArrowRight' === e.key);
			next = (i + (forward ? 1 : -1) + group.length) % group.length;
		}
		e.preventDefault();
		group[next].focus();
		group[next].click();
	};

	Booking.prototype.loadDays = function () {
		var self = this;
		var expert = this.expert;
		this.daysEl.setAttribute('aria-busy', 'true');
		this.daysEl.innerHTML = '';
		for (var i = 0; i < 7; i++) { this.daysEl.appendChild(el('span', { class: 'hm-book__day is-skeleton', 'aria-hidden': 'true' })); }
		this.slotsEl.innerHTML = '';
		this.slotsEl.appendChild(el('p', { class: 'hm-book__hint' }, t.loading));
		this.setContinue(false);
		api('days?expert=' + expert).then(function (data) {
			if (expert !== self.expert) { return; }
			self.days = data.days || [];
			self.renderDays();
		}).catch(function (err) {
			self.daysEl.innerHTML = '';
			self.slotsEl.innerHTML = '';
			self.slotsEl.appendChild(el('p', { class: 'hm-book__hint is-error' }, err.message || t.error));
		}).then(function () {
			self.daysEl.removeAttribute('aria-busy');
		});
	};

	Booking.prototype.renderDays = function () {
		var self = this;
		var firstOpen = null;
		this.daysEl.innerHTML = '';
		this.days.forEach(function (day) {
			var count = day.slots.length;
			var btn = el('button', {
				type: 'button',
				class: 'hm-book__day',
				role: 'radio',
				'aria-checked': 'false',
				'data-day': day.date,
				disabled: !count,
				tabindex: '-1'
			});
			btn.appendChild(el('span', { class: 'hm-book__wd' }, day.weekday));
			btn.appendChild(el('strong', {}, day.day));
			btn.appendChild(el('small', {}, count ? (t.free || '%s').replace('%s', num(count)) : (day.open ? t.full : t.closed)));
			self.daysEl.appendChild(btn);
			if (count && !firstOpen) { firstOpen = day.date; }
		});
		if (!firstOpen) {
			this.slotsEl.innerHTML = '';
			this.slotsEl.appendChild(el('p', { class: 'hm-book__hint' }, t.noDays));
			return;
		}
		var keep = this.day && this.days.some(function (d) { return d.date === self.day && d.slots.length; });
		this.pickDay(keep ? this.day : firstOpen, false);
	};

	Booking.prototype.pickDay = function (date, user) {
		var self = this;
		var day = null;
		this.days.forEach(function (d) { if (d.date === date) { day = d; } });
		if (!day) { return; }
		if (this.day !== date) { this.time = null; }
		this.day = date;
		$$('[data-day]', this.daysEl).forEach(function (btn) {
			var on = btn.getAttribute('data-day') === date;
			btn.setAttribute('aria-checked', String(on));
			btn.setAttribute('tabindex', on ? '0' : '-1');
			if (on && user) {
				btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
			}
		});
		this.slotsEl.innerHTML = '';
		if (!day.slots.length) {
			this.slotsEl.appendChild(el('p', { class: 'hm-book__hint' }, t.noTimes));
			this.setContinue(false);
			return;
		}
		var groups = [
			{ label: t.morning, items: day.slots.filter(function (s) { return s.time < '12:00'; }) },
			{ label: t.afternoon, items: day.slots.filter(function (s) { return s.time >= '12:00'; }) }
		];
		var grid = el('div', { class: 'hm-book__times', role: 'radiogroup', 'aria-label': day.weekday + ' ' + day.day });
		var first = true;
		groups.forEach(function (group) {
			if (!group.items.length) { return; }
			grid.appendChild(el('p', { class: 'hm-book__part' }, group.label));
			var row = el('div', { class: 'hm-book__row-times' });
			group.items.forEach(function (slot) {
				var on = slot.time === self.time;
				row.appendChild(el('button', {
					type: 'button',
					class: 'hm-book__time',
					role: 'radio',
					'aria-checked': String(on),
					'data-time': slot.time,
					tabindex: on || (first && !self.time) ? '0' : '-1'
				}, slot.label));
				first = false;
			});
			grid.appendChild(row);
		});
		this.slotsEl.appendChild(grid);
		this.setContinue(!!this.time);
		if (user) { this.say(day.weekday + ' ' + day.day); }
	};

	Booking.prototype.pickTime = function (time) {
		this.time = time;
		$$('[data-time]', this.slotsEl).forEach(function (btn) {
			var on = btn.getAttribute('data-time') === time;
			btn.setAttribute('aria-checked', String(on));
			btn.setAttribute('tabindex', on ? '0' : '-1');
		});
		this.setContinue(true);
	};

	Booking.prototype.setContinue = function (on) {
		var btn = $('[data-step="time"] [data-go="details"]', this.root);
		if (btn) { btn.disabled = !on; }
	};

	Booking.prototype.current = function () {
		var self = this;
		var day = null;
		var label = '';
		this.days.forEach(function (d) {
			if (d.date === self.day) {
				day = d;
				d.slots.forEach(function (s) { if (s.time === self.time) { label = s.label; } });
			}
		});
		return { day: day, time: label };
	};

	Booking.prototype.fillSummary = function () {
		var now = this.current();
		var set = function (root, key, value) {
			var node = $('[data-sum="' + key + '"]', root);
			if (node) { node.textContent = value; }
		};
		set(this.root, 'expert', this.name);
		set(this.root, 'day', now.day ? now.day.weekday + ' ' + now.day.day : '');
		set(this.root, 'time', now.time);
		set(this.root, 'fee', this.fee);
		var fee = $('[data-sum-fee]', this.root);
		if (fee) { fee.hidden = !this.fee; }
	};

	Booking.prototype.error = function (text, field) {
		if (this.msg) {
			this.msg.textContent = text || '';
			this.msg.classList.toggle('is-visible', !!text);
		}
		$$('.hm-field', this.form).forEach(function (f) { f.classList.remove('is-invalid'); });
		if (field) {
			field.closest('.hm-field').classList.add('is-invalid');
			field.setAttribute('aria-invalid', 'true');
			field.focus();
		}
	};

	Booking.prototype.onSubmit = function (e) {
		e.preventDefault();
		var self = this;
		var form = this.form;
		var name = form.elements.name;
		var mobile = form.elements.mobile;
		$$('[aria-invalid]', form).forEach(function (f) { f.removeAttribute('aria-invalid'); });
		if (name.value.trim().length < 2) { this.error(t.name, name); return; }
		if (!mobileOk(mobile.value)) { this.error(t.mobile, mobile); return; }
		this.error('');

		var button = $('button[type="submit"]', form);
		var label = $('span', button);
		var original = label ? label.textContent : '';
		button.disabled = true;
		button.setAttribute('aria-busy', 'true');
		if (label) { label.textContent = t.sending; }

		var body = {
			expert: this.expert,
			date: this.day,
			time: this.time,
			name: name.value.trim(),
			mobile: latin(mobile.value),
			note: form.elements.note ? form.elements.note.value : '',
			website: form.elements.website ? form.elements.website.value : ''
		};
		api('nonce').then(function (data) {
			body.nonce = data.nonce;
			return api('book', { method: 'POST', body: body });
		}).then(function (data) {
			var done = $('[data-hm-book-done]', self.root);
			if (done) { done.textContent = data.message || ''; }
			self.days = [];
			self.go('done');
			self.say(data.message || '');
			self.root.dispatchEvent(new CustomEvent('hamista:booked', { bubbles: true, detail: data }));
		}).catch(function (err) {
			if ('hamista_slot_taken' === err.code) {
				self.time = null;
				self.days = [];
				self.go('time');
				var p = el('p', { class: 'hm-book__hint is-error', role: 'alert' }, err.message);
				self.slotsEl.insertBefore(p, self.slotsEl.firstChild);
				return;
			}
			if ('hamista_login_required' === err.code && window.HamistaAuth && $('.hm-auth-modal')) {
				window.HamistaAuth.open(button);
			}
			self.error(err.message || t.error);
		}).then(function () {
			button.disabled = false;
			button.removeAttribute('aria-busy');
			if (label) { label.textContent = original; }
		});
	};

	/* ------------------------------------------------------------------ */
	/* My appointments                                                    */
	/* ------------------------------------------------------------------ */

	function appointments(root) {
		var msg = $('[data-hm-appts-msg]', root);
		root.addEventListener('click', function (e) {
			var btn = e.target.closest('[data-hm-cancel]');
			if (!btn || btn.disabled) { return; }
			if (!window.confirm(t.cancelAsk)) { return; }
			var item = btn.closest('[data-hm-appt]');
			var original = btn.textContent;
			btn.disabled = true;
			btn.textContent = t.cancelling;
			api('cancel', { method: 'POST', body: { id: parseInt(btn.getAttribute('data-hm-cancel'), 10) } }).then(function (data) {
				var status = $('[data-hm-appt-status]', item);
				if (status) {
					status.textContent = t.cancelled;
					status.className = 'hm-appt__status hm-appt__status--cancelled';
				}
				item.classList.remove('is-upcoming');
				item.classList.add('is-cancelled');
				btn.remove();
				if (msg) { msg.textContent = data.message || ''; }
			}).catch(function (err) {
				btn.disabled = false;
				btn.textContent = original;
				if (msg) { msg.textContent = err.message || t.error; }
			});
		});
	}

	function boot() {
		$$('[data-hm-book]').forEach(function (root) {
			if (!root.hamistaBooking) { root.hamistaBooking = new Booking(root); }
		});
		$$('[data-hm-appts]').forEach(function (root) {
			if (!root.hamistaAppts) {
				root.hamistaAppts = true;
				appointments(root);
			}
		});
	}

	if ('loading' === doc.readyState) { doc.addEventListener('DOMContentLoaded', boot); } else { boot(); }

	// Elementor editor and preview: widgets are re-rendered in place.
	if (window.jQuery) {
		window.jQuery(window).on('elementor/frontend/init', function () {
			if (window.elementorFrontend && window.elementorFrontend.hooks) {
				window.elementorFrontend.hooks.addAction('frontend/element_ready/hm-booking.default', boot);
			}
		});
	}
}());
