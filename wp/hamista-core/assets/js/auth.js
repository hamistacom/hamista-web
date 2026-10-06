/*!
 * Hamista Core — mobile OTP login.
 * Dependency-free. Drives every [data-hm-auth] form on the page, the header
 * login modal, the account panel and the wp-login.php switch.
 * Public API: window.HamistaAuth = { init(scope), open(trigger), close(), normalize(value) }.
 */
(function () {
	'use strict';

	var doc = document;
	var win = window;
	var cfg = win.hamistaAuth || {};
	var i18n = cfg.i18n || {};
	var lang = (doc.documentElement.getAttribute('lang') || '').toLowerCase();
	var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
	var nf = null;
	if (lang.indexOf('fa') === 0 && win.Intl && Intl.NumberFormat) {
		try { nf = new Intl.NumberFormat('fa-IR', { useGrouping: false }); } catch (e) { nf = null; }
	}

	/* ---------- Utilities ---------- */
	function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
	function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
	function t(key, fallback) { return i18n[key] || fallback || ''; }
	function fmt(str) {
		var args = arguments;
		var n = 1;
		return String(str).replace(/%(\d+\$)?[sd]/g, function (m, pos) {
			var idx = pos ? parseInt(pos, 10) : n++;
			return args[idx] !== undefined ? args[idx] : m;
		});
	}
	function extend(a, b) { for (var k in b) { if (Object.prototype.hasOwnProperty.call(b, k)) { a[k] = b[k]; } } return a; }
	function num(value, pad) {
		var s = String(value);
		while (pad && s.length < pad) { s = '0' + s; }
		return nf ? s.replace(/\d/g, function (d) { return nf.format(+d); }) : s;
	}
	function latin(value) {
		return String(value == null ? '' : value)
			.replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); })
			.replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); });
	}
	function normalizeMobile(value) {
		var m = latin(value).replace(/[\s\u00A0\u2000-\u200F\u2010-\u2015\u2028-\u202F\u2212\uFEFF\-.()\/_]/g, '');
		if (m.indexOf('+98') === 0) { m = '0' + m.slice(3).replace(/^0+/, ''); }
		else if (m.indexOf('0098') === 0) { m = '0' + m.slice(4).replace(/^0+/, ''); }
		else if (m.indexOf('98') === 0 && m.length === 12) { m = '0' + m.slice(2); }
		if (m.length === 10 && m.charAt(0) === '9') { m = '0' + m; }
		return /^09\d{9}$/.test(m) ? m : '';
	}
	function prettyMobile(m) {
		return /^09\d{9}$/.test(m) ? num(m.slice(0, 4)) + ' ' + num(m.slice(4, 7)) + ' ' + num(m.slice(7)) : num(m);
	}
	function loading(btn, on) {
		if (!btn) { return; }
		btn.disabled = !!on;
		btn.classList.toggle('is-loading', !!on);
		btn.setAttribute('aria-busy', on ? 'true' : 'false');
	}
	function replay(el, cls) {
		if (!el || reduce) { return; }
		el.classList.remove(cls);
		void el.offsetWidth; // Restart the animation.
		el.classList.add(cls);
	}
	function focusFirst(scope) {
		var el = scope && ($('input:not([type="hidden"]):not([tabindex="-1"]):not([disabled]):not([readonly])', scope) || $('button:not([disabled])', scope));
		if (el) { win.setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }, reduce ? 0 : 60); }
	}

	/* ---------- REST ---------- */
	var restRoot = cfg.rest || (function () {
		var link = $('link[rel="https://api.w.org/"]');
		return (link ? link.href.replace(/\/?$/, '/') : '/wp-json/') + 'hamista/v1/';
	})();
	var nonce = cfg.nonce || '';
	var pendingNonce = null;

	function refreshNonce() {
		if (!pendingNonce) {
			pendingNonce = fetch(restRoot + 'auth/nonce', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
				.then(function (r) { return r.json(); })
				.then(function (d) { if (d && d.nonce) { nonce = d.nonce; } pendingNonce = null; return nonce; },
					function () { pendingNonce = null; return nonce; });
		}
		return pendingNonce;
	}

	function api(path, data, opts) {
		opts = opts || {};
		var headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
		var body = extend({}, data || {});
		if (opts.restNonce) { headers['X-WP-Nonce'] = opts.restNonce; } else { body.nonce = nonce; }
		return fetch(restRoot + path, { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: headers, body: JSON.stringify(body) })
			.then(function (r) {
				return r.json().catch(function () { return {}; }).then(function (json) {
					json = json && typeof json === 'object' ? json : {};
					json.status = r.status;
					if (json.ok === undefined) { json.ok = r.ok && !json.code; }
					return json;
				});
			})
			.then(function (json) {
				// Cached pages carry stale nonces: fetch a fresh one and retry once.
				if (json.code === 'hamista_bad_nonce' && !opts.retried && !opts.restNonce) {
					return refreshNonce().then(function () { return api(path, data, extend(opts, { retried: true })); });
				}
				return json;
			}, function () {
				return { ok: false, network: true, message: t('network', 'Connection problem. Check your internet and try again.') };
			});
	}

	/* ---------- Login form ---------- */
	function Auth(root) {
		var self = this;
		this.root = root;
		this.length = parseInt(root.getAttribute('data-length'), 10) || cfg.length || 5;
		this.redirect = root.getAttribute('data-redirect') || '';
		this.mobile = '';
		this.timer = null;
		this.otpAbort = null;
		this.submitTimer = null;
		this.busy = false;
		this.steps = {};
		$$('[data-hm-step]', root).forEach(function (el) { self.steps[el.getAttribute('data-hm-step')] = el; });
		this.codeBox = $('[data-hm-code]', root);
		this.pwForm = $('[data-hm-form="password"]', root);
		this.bind();
	}

	Auth.prototype.bind = function () {
		var self = this;
		var s = this.steps;

		if (s.mobile) {
			s.mobile.addEventListener('submit', function (e) { e.preventDefault(); self.send(false); });
			var tel = s.mobile.elements.mobile;
			if (tel) {
				tel.addEventListener('input', function () {
					tel.removeAttribute('aria-invalid');
					self.msg('mobile', '');
					// Light up the field icon once a complete number is typed.
					if (normalizeMobile(tel.value) && latin(tel.value).replace(/\D/g, '').length >= 11) { tel.classList.add('is-valid'); } else { tel.classList.remove('is-valid'); }
				});
			}
		}
		if (s.code) {
			s.code.addEventListener('submit', function (e) { e.preventDefault(); self.verify(); });
			this.bindDigits();
		}
		if (s.name) {
			s.name.addEventListener('submit', function (e) {
				e.preventDefault();
				var name = s.name.elements.name.value.replace(/\s+/g, ' ').trim();
				if (name.length < 2) { self.msg('name', t('nameRequired', 'Please enter your name.')); s.name.elements.name.focus(); return; }
				self.verify(name);
			});
		}
		if (this.pwForm) {
			this.pwForm.addEventListener('submit', function (e) { e.preventDefault(); self.password(); });
		}

		this.root.addEventListener('click', function (e) {
			var el = e.target.closest('[data-hm-edit], [data-hm-resend], [data-hm-tab], [data-hm-reveal]');
			if (!el || !self.root.contains(el)) { return; }
			if (el.hasAttribute('data-hm-edit')) { self.edit(); }
			else if (el.hasAttribute('data-hm-resend')) { self.send(true); }
			else if (el.hasAttribute('data-hm-tab')) { self.tab(el.getAttribute('data-hm-tab'), true); }
			else if (el.hasAttribute('data-hm-reveal')) { self.reveal(el); }
		});

		var tablist = $('[role="tablist"]', this.root);
		if (tablist) {
			tablist.addEventListener('keydown', function (e) {
				var tabs = $$('[data-hm-tab]', tablist);
				var i = tabs.indexOf(doc.activeElement);
				if (i < 0) { return; }
				var rtl = win.getComputedStyle(tablist).direction === 'rtl';
				var next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
				var target = null;
				if (next) { target = tabs[(i + next + tabs.length) % tabs.length]; }
				else if (e.key === 'Home') { target = tabs[0]; }
				else if (e.key === 'End') { target = tabs[tabs.length - 1]; }
				if (target) { e.preventDefault(); target.focus(); self.tab(target.getAttribute('data-hm-tab'), false); }
			});
		}
	};

	Auth.prototype.msg = function (where, text, type) {
		var host = where === 'password' ? this.pwForm : this.steps[where];
		var el = host && $('[data-hm-msg]', host);
		if (!el) { return; }
		el.textContent = text || '';
		el.classList.toggle('is-info', type === 'info');
		el.setAttribute('role', type === 'info' ? 'status' : 'alert');
	};

	Auth.prototype.clearMessages = function () {
		$$('[data-hm-msg]', this.root).forEach(function (el) { el.textContent = ''; el.classList.remove('is-info'); });
	};

	Auth.prototype.go = function (name) {
		var self = this;
		Object.keys(this.steps).forEach(function (key) {
			var el = self.steps[key];
			var on = key === name;
			el.hidden = !on;
			el.classList.toggle('is-active', on);
			if (on) { replay(el, 'is-entering'); }
		});
		this.current = name;
		this.root.setAttribute('data-step', name);
		this.root.classList.toggle('is-done', name === 'done');
		this.clearMessages();
		if (name !== 'code') { this.stopOtp(); }
	};

	Auth.prototype.tab = function (name, focus) {
		var self = this;
		$$('[data-hm-tab]', this.root).forEach(function (tab) {
			var on = tab.getAttribute('data-hm-tab') === name;
			tab.classList.toggle('is-active', on);
			tab.setAttribute('aria-selected', on ? 'true' : 'false');
			tab.tabIndex = on ? 0 : -1;
		});
		$$('[data-hm-panel]', this.root).forEach(function (panel) {
			var on = panel.getAttribute('data-hm-panel') === name;
			panel.hidden = !on;
			if (on) {
				replay(panel, 'is-entering');
				if (focus) {
					var active = name === 'otp' ? self.steps[self.current || 'mobile'] : panel;
					focusFirst(active);
				}
			}
		});
	};

	Auth.prototype.reveal = function (btn) {
		var input = btn.parentNode.querySelector('input');
		if (!input) { return; }
		var show = input.type === 'password';
		input.type = show ? 'text' : 'password';
		btn.setAttribute('aria-pressed', show ? 'true' : 'false');
		btn.setAttribute('aria-label', show ? t('hidePassword', 'Hide password') : t('showPassword', 'Show password'));
	};

	/* Code boxes */
	Auth.prototype.boxes = function () { return $$('.hm-auth__digit', this.codeBox); };

	Auth.prototype.buildBoxes = function (n) {
		if (!this.codeBox || n === this.boxes().length) { this.length = n; return; }
		this.length = n;
		this.codeBox.innerHTML = '';
		for (var i = 0; i < n; i++) {
			var input = doc.createElement('input');
			input.className = 'hm-auth__digit';
			input.type = 'text';
			input.setAttribute('inputmode', 'numeric');
			input.setAttribute('pattern', '[0-9]*');
			input.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'off');
			input.setAttribute('aria-label', fmt(t('digit', 'Digit %1$s of %2$s'), num(i + 1), num(n)));
			this.codeBox.appendChild(input);
		}
	};

	Auth.prototype.bindDigits = function () {
		var self = this;
		var box = this.codeBox;
		if (!box) { return; }

		box.addEventListener('input', function (e) {
			var input = e.target;
			if (!input.classList.contains('hm-auth__digit')) { return; }
			var boxes = self.boxes();
			var index = boxes.indexOf(input);
			var digits = latin(input.value).replace(/\D/g, '');
			if (digits.length > 1) {
				if (e.inputType === 'insertText' && e.data) {
					digits = latin(e.data).replace(/\D/g, '').slice(-1);
				} else {
					// Paste or SMS autofill landed in one box: spread it out.
					self.fill(digits, digits.length >= boxes.length ? 0 : index);
					return;
				}
			}
			input.value = digits;
			input.classList.toggle('is-filled', !!digits);
			self.codeBox.classList.remove('is-error');
			if (digits && boxes[index + 1]) { boxes[index + 1].focus(); boxes[index + 1].select(); }
			self.maybeSubmit();
		});

		box.addEventListener('keydown', function (e) {
			var input = e.target;
			if (!input.classList.contains('hm-auth__digit')) { return; }
			var boxes = self.boxes();
			var index = boxes.indexOf(input);
			if (e.key === 'Backspace' && !input.value && boxes[index - 1]) {
				e.preventDefault();
				boxes[index - 1].value = '';
				boxes[index - 1].classList.remove('is-filled');
				boxes[index - 1].focus();
			} else if (e.key === 'ArrowLeft' && boxes[index - 1]) {
				e.preventDefault(); boxes[index - 1].focus(); boxes[index - 1].select();
			} else if (e.key === 'ArrowRight' && boxes[index + 1]) {
				e.preventDefault(); boxes[index + 1].focus(); boxes[index + 1].select();
			}
		});

		box.addEventListener('paste', function (e) {
			var text = (e.clipboardData || win.clipboardData) ? (e.clipboardData || win.clipboardData).getData('text') : '';
			var digits = latin(text).replace(/\D/g, '');
			if (!digits) { return; }
			e.preventDefault();
			var boxes = self.boxes();
			var index = boxes.indexOf(e.target);
			self.fill(digits, digits.length >= boxes.length || index < 0 ? 0 : index);
		});

		box.addEventListener('focusin', function (e) {
			if (e.target.classList.contains('hm-auth__digit')) { e.target.select(); }
		});
	};

	Auth.prototype.fill = function (digits, start) {
		var boxes = this.boxes();
		digits = latin(digits).replace(/\D/g, '');
		var i = 0;
		for (; i < digits.length && start + i < boxes.length; i++) {
			boxes[start + i].value = digits.charAt(i);
			boxes[start + i].classList.add('is-filled');
		}
		var next = boxes[Math.min(start + i, boxes.length - 1)];
		if (next) { next.focus(); }
		this.codeBox.classList.remove('is-error');
		this.maybeSubmit();
	};

	Auth.prototype.code = function () {
		return this.boxes().map(function (b) { return latin(b.value).replace(/\D/g, ''); }).join('');
	};

	Auth.prototype.clearCode = function (disable) {
		this.boxes().forEach(function (b) { b.value = ''; b.classList.remove('is-filled'); b.disabled = !!disable; });
		if (!disable && this.boxes()[0]) { this.boxes()[0].focus(); }
	};

	Auth.prototype.maybeSubmit = function () {
		var self = this;
		win.clearTimeout(this.submitTimer);
		if (this.code().length === this.length && !this.busy) {
			// A beat so the last digit is seen before the request starts.
			this.submitTimer = win.setTimeout(function () { self.verify(); }, 160);
		}
	};

	/* Countdown */
	Auth.prototype.countdown = function (seconds) {
		var self = this;
		var timer = $('[data-hm-timer]', this.steps.code);
		var resend = $('[data-hm-resend]', this.steps.code);
		var end = Date.now() + Math.max(0, seconds) * 1000;
		var parts = t('resendIn', 'Resend code in %s').split('%s');
		win.clearInterval(this.timer);
		function tick() {
			var left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
			if (!left) {
				win.clearInterval(self.timer);
				timer.hidden = true;
				resend.hidden = false;
				return;
			}
			timer.hidden = false;
			resend.hidden = true;
			timer.textContent = '';
			timer.appendChild(doc.createTextNode(parts[0] || ''));
			var b = doc.createElement('b');
			b.textContent = num(Math.floor(left / 60)) + ':' + num(left % 60, 2);
			timer.appendChild(b);
			timer.appendChild(doc.createTextNode(parts[1] || ''));
		}
		tick();
		this.timer = win.setInterval(tick, 500);
	};

	/* Web OTP API (Chrome on Android): fills the code from the SMS. */
	Auth.prototype.listenOtp = function () {
		var self = this;
		this.stopOtp();
		if (!('OTPCredential' in win) || !navigator.credentials || !win.AbortController) { return; }
		this.otpAbort = new AbortController();
		navigator.credentials.get({ otp: { transport: ['sms'] }, signal: this.otpAbort.signal })
			.then(function (otp) { if (otp && otp.code && self.current === 'code') { self.fill(otp.code, 0); } })
			.catch(function () { /* Aborted or unsupported. */ });
	};
	Auth.prototype.stopOtp = function () {
		if (this.otpAbort) { try { this.otpAbort.abort(); } catch (e) { /* ignore */ } this.otpAbort = null; }
	};

	/* Actions */
	Auth.prototype.hp = function (form) {
		var hp = form && $('.hm-auth__hp input', form);
		return hp ? hp.value : '';
	};

	Auth.prototype.send = function (isResend) {
		var self = this;
		var form = this.steps.mobile;
		var tel = form.elements.mobile;
		var mobile = isResend ? this.mobile : (normalizeMobile(tel.value) || (cfg.strict === false ? latin(tel.value).trim() : ''));
		if (!mobile) {
			tel.setAttribute('aria-invalid', 'true');
			this.msg('mobile', t('invalidMobile', 'Please enter a valid mobile number.'));
			replay(tel, 'is-shake');
			tel.focus();
			return;
		}
		if (this.busy) { return; }
		this.busy = true;
		var btn = isResend ? $('[data-hm-resend]', this.steps.code) : $('.hm-auth__submit', form);
		loading(btn, true);

		api('auth/send', { mobile: mobile, website: this.hp(form) }).then(function (res) {
			self.busy = false;
			loading(btn, false);
			var cooldown = res.code === 'hamista_otp_cooldown';
			if (!res.ok && !cooldown) {
				self.msg(isResend ? 'code' : 'mobile', res.message || t('error', 'Something went wrong.'));
				return;
			}
			self.mobile = res.mobile || mobile;
			if (res.length) { self.buildBoxes(parseInt(res.length, 10)); }
			$('[data-hm-number]', self.steps.code).textContent = prettyMobile(self.mobile);
			if (!isResend || self.current !== 'code') { self.go('code'); }
			self.clearCode(false);
			self.countdown(res.resend_in || cfg.resend || 60);
			if (cooldown) { self.msg('code', res.message, 'info'); }
			else if (isResend) { self.msg('code', t('codeResent', 'A new code is on its way.'), 'info'); }
			self.listenOtp();
		});
	};

	Auth.prototype.edit = function () {
		win.clearInterval(this.timer);
		this.go('mobile');
		var tel = this.steps.mobile.elements.mobile;
		tel.focus();
		tel.select();
	};

	Auth.prototype.verify = function (name) {
		var self = this;
		var code = this.code();
		var step = name !== undefined ? 'name' : 'code';
		win.clearTimeout(this.submitTimer);
		if (code.length !== this.length) {
			this.go('code');
			this.msg('code', fmt(t('enterCode', 'Enter all %s digits of the code.'), num(this.length)));
			var empty = this.boxes().filter(function (b) { return !b.value; })[0];
			if (empty) { empty.focus(); }
			return;
		}
		if (this.busy) { return; }
		this.busy = true;
		var btn = $('.hm-auth__submit', this.steps[step]);
		loading(btn, true);
		this.root.setAttribute('aria-busy', 'true');

		api('auth/verify', { mobile: this.mobile, code: code, name: name || '', redirect: this.redirect, website: this.hp(this.steps.mobile) }).then(function (res) {
			self.busy = false;
			loading(btn, false);
			self.root.removeAttribute('aria-busy');
			if (res.ok) { self.success(res); return; }
			if (res.need_name) {
				// The step's own lead text explains what's needed.
				self.go('name');
				focusFirst(self.steps.name);
				return;
			}
			var codeError = /^hamista_otp_/.test(res.code || '');
			if (step === 'name' && codeError) { self.go('code'); }
			if (res.code === 'hamista_otp_wrong') {
				self.codeBox.classList.add('is-error');
				replay(self.codeBox, 'is-shake');
				self.clearCode(false);
				self.msg('code', res.message);
			} else if (res.code === 'hamista_otp_locked' || res.code === 'hamista_otp_expired') {
				self.codeBox.classList.add('is-error');
				replay(self.codeBox, 'is-shake');
				self.clearCode(true);
				self.msg('code', res.message);
				if (res.resend_in !== undefined) { self.countdown(res.resend_in); }
			} else {
				self.msg(step === 'name' && !codeError ? 'name' : 'code', res.message || t('error', 'Something went wrong.'));
			}
		});
	};

	Auth.prototype.password = function () {
		var self = this;
		var form = this.pwForm;
		var login = form.elements.login.value.trim();
		var pass = form.elements.password.value;
		if (!login || !pass) {
			this.msg('password', t('loginRequired', 'Please enter your login and password.'));
			(login ? form.elements.password : form.elements.login).focus();
			return;
		}
		if (this.busy) { return; }
		this.busy = true;
		var btn = $('.hm-auth__submit', form);
		loading(btn, true);
		api('auth/password', { login: latin(login), password: pass, redirect: this.redirect, website: this.hp(form) }).then(function (res) {
			self.busy = false;
			loading(btn, false);
			if (res.ok) { self.success(res); return; }
			self.msg('password', res.message || t('error', 'Something went wrong.'));
			replay($('.hm-auth__field--password', form), 'is-shake');
			form.elements.password.select();
		});
	};

	Auth.prototype.success = function (res) {
		this.stopOtp();
		win.clearInterval(this.timer);
		this.go('done');
		var event;
		try {
			event = new CustomEvent('hamista:login', { bubbles: true, cancelable: true, detail: res });
		} catch (e) {
			event = doc.createEvent('CustomEvent');
			event.initCustomEvent('hamista:login', true, true, res);
		}
		// Listeners may call preventDefault() to handle the redirect themselves.
		if (!this.root.dispatchEvent(event)) { return; }
		var to = res.redirect || win.location.href;
		win.setTimeout(function () {
			if (to.split('#')[0] === win.location.href.split('#')[0]) { win.location.reload(); }
			else { win.location.assign(to); }
		}, reduce ? 150 : 650);
	};

	/* ---------- Account panel (logged in) ---------- */
	function bindProfile(form) {
		if (form.__hmProfile) { return; }
		form.__hmProfile = true;
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var btn = $('.hm-auth__submit', form);
			var msg = $('[data-hm-msg]', form);
			loading(btn, true);
			api('auth/profile', {
				first_name: form.elements.first_name.value,
				last_name: form.elements.last_name.value,
				email: form.elements.email.value
			}, { restNonce: cfg.restNonce || 'missing' }).then(function (res) {
				loading(btn, false);
				msg.textContent = res.message || (res.ok ? t('saved', 'Saved.') : t('error', 'Something went wrong.'));
				msg.classList.toggle('is-info', !!res.ok);
				msg.setAttribute('role', res.ok ? 'status' : 'alert');
			});
		});
	}

	/* ---------- Modal ---------- */
	var lastFocus = null;
	var closeTimer = null;
	function modal() { return doc.getElementById('hm-auth-modal'); }

	function openModal(trigger) {
		var m = modal();
		if (!m) { return false; }
		win.clearTimeout(closeTimer);
		lastFocus = trigger || doc.activeElement;
		m.hidden = false;
		void m.offsetWidth;
		m.classList.add('is-open');
		m.setAttribute('aria-hidden', 'false');
		doc.documentElement.style.overflow = 'hidden';
		if (trigger && trigger.setAttribute) { trigger.setAttribute('aria-expanded', 'true'); }
		var form = $('[data-hm-auth]', m);
		var inst = form && form.__hmAuth;
		focusFirst(inst ? (inst.steps[inst.current || 'mobile'] || form) : m);
		return true;
	}

	function closeModal() {
		var m = modal();
		if (!m || !m.classList.contains('is-open')) { return; }
		m.classList.remove('is-open');
		m.setAttribute('aria-hidden', 'true');
		doc.documentElement.style.overflow = '';
		closeTimer = win.setTimeout(function () { m.hidden = true; }, reduce ? 0 : 320);
		if (lastFocus && lastFocus.focus) {
			if (lastFocus.setAttribute) { lastFocus.setAttribute('aria-expanded', 'false'); }
			try { lastFocus.focus({ preventScroll: true }); } catch (e) { lastFocus.focus(); }
		}
	}

	doc.addEventListener('click', function (e) {
		if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
		var target = e.target.closest ? e.target : e.target.parentNode;

		var opener = target.closest('[data-hm-account], [data-hm-auth-open], .wc-block-checkout__login-prompt');
		if (opener && modal() && !opener.closest('#hm-auth-modal')) {
			e.preventDefault();
			openModal(opener);
			return;
		}
		if (target.closest('[data-hm-auth-close]')) {
			e.preventDefault();
			closeModal();
			return;
		}

		var toggle = target.closest('[data-hm-auth-toggle]');
		if (toggle) {
			var region = doc.getElementById(toggle.getAttribute('data-hm-auth-toggle'));
			if (region) {
				e.preventDefault();
				region.hidden = !region.hidden;
				toggle.setAttribute('aria-expanded', region.hidden ? 'false' : 'true');
				if (!region.hidden) { replay(region, 'is-entering'); focusFirst($('[data-hm-step="mobile"]', region) || region); }
			}
			return;
		}

		var wp = target.closest('[data-hm-wplogin-toggle]');
		if (wp) {
			e.preventDefault();
			var classic = doc.body.classList.toggle('hm-auth-classic');
			if (classic) { var user = doc.getElementById('user_login'); if (user) { user.focus(); } }
			else { focusFirst($('.hm-auth-wplogin [data-hm-step="mobile"]')); }
		}
	});

	doc.addEventListener('keydown', function (e) {
		var m = modal();
		if (!m || !m.classList.contains('is-open')) { return; }
		if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
		if (e.key === 'Tab') {
			var items = $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), [tabindex]:not([tabindex="-1"])', m)
				.filter(function (n) { return n.offsetParent !== null && n.tabIndex !== -1; });
			if (!items.length) { return; }
			var first = items[0];
			var last = items[items.length - 1];
			if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
		}
	});

	/* ---------- Boot ---------- */
	function init(scope) {
		scope = scope || doc;
		$$('[data-hm-auth]', scope).forEach(function (root) {
			if (!root.__hmAuth) { root.__hmAuth = new Auth(root); }
		});
		if (scope.matches && scope.matches('[data-hm-auth]') && !scope.__hmAuth) { scope.__hmAuth = new Auth(scope); }
		$$('[data-hm-profile]', scope).forEach(bindProfile);
		if (doc.body && $('.hm-auth-wplogin')) { doc.body.classList.add('hm-auth-js'); }
	}

	win.HamistaAuth = { init: init, open: openModal, close: closeModal, normalize: normalizeMobile };

	if (doc.readyState === 'loading') {
		doc.addEventListener('DOMContentLoaded', function () { init(doc); });
	} else {
		init(doc);
	}

	// Elementor re-renders widgets in the editor preview.
	function elementorHook() {
		if (win.elementorFrontend && win.elementorFrontend.hooks) {
			win.elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) { init($scope && $scope[0] ? $scope[0] : doc); });
		}
	}
	if (win.elementorFrontend && win.elementorFrontend.hooks) { elementorHook(); }
	else if (win.jQuery) { win.jQuery(win).on('elementor/frontend/init', elementorHook); }
})();
