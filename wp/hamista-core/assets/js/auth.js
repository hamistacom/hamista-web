/*!
 * Hamista Core — mobile OTP login.
 * Dependency-free. Drives every [data-hm-auth] form on the page, the header
 * login modal, the account panel, the wp-login.php switch, captcha widgets,
 * Google sign-in, quick buy and the back-in-stock form.
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
	var scripts = {};
	function loadScript(src) {
		if (!scripts[src]) {
			scripts[src] = new Promise(function (resolve, reject) {
				var s = doc.createElement('script');
				s.src = src;
				s.async = true;
				s.onload = resolve;
				s.onerror = function () { delete scripts[src]; reject(); };
				doc.head.appendChild(s);
			});
		}
		return scripts[src];
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

	/* ---------- Captcha ---------- */
	var cap = cfg.captcha || {};

	function capBox(scope) { return cap.provider && scope ? $('[data-hm-captcha]', scope) : null; }
	function capType(box) { return box.getAttribute('data-hm-captcha'); }
	function capField(box) { return $('input[name="hm_captcha"]', box); }

	// Render on-screen widgets (Turnstile), warm up reCAPTCHA, renew stale questions.
	function capPrepare(scope) {
		if (!cap.provider) { return; }
		$$('[data-hm-captcha]', scope).forEach(function (box) {
			if (box.__hmCap || box.parentNode.closest('[hidden]')) { return; }
			box.__hmCap = true;
			var type = capType(box);
			if (type === 'builtin') {
				var exp = parseInt(box.getAttribute('data-expires'), 10) || 0;
				if (exp && Date.now() / 1000 > exp - 60) { capReset(box); }
			} else if (type === 'turnstile') {
				loadScript(cap.src).then(function () {
					box.__hmId = win.turnstile.render(box, { sitekey: cap.siteKey, 'response-field-name': 'hm_captcha', size: 'flexible' });
				}, function () { box.__hmCap = false; });
			} else {
				loadScript(cap.src).then(null, function () { box.__hmCap = false; });
			}
		});
	}

	// What the visitor still has to do, as a message ('' when nothing).
	function capMissing(box) {
		if (!box) { return ''; }
		var type = capType(box);
		if (type === 'builtin' && !latin($('.hm-captcha__input', box).value).trim()) { return t('captchaAnswer', 'Please answer the security question.'); }
		if (type === 'turnstile' && !(capField(box) || {}).value) { return t('captchaPending', 'Please complete the security check.'); }
		return '';
	}
	function capFocus(box) {
		var input = box && $('.hm-captcha__input', box);
		if (input) { input.focus(); }
	}

	// Request fields: { captcha, captcha_answer }.
	function capValue(box, action) {
		if (!box) { return Promise.resolve({}); }
		var type = capType(box);
		var field = capField(box);
		if (type === 'builtin') { return Promise.resolve({ captcha: field ? field.value : '', captcha_answer: latin($('.hm-captcha__input', box).value).trim() }); }
		if (type === 'turnstile') { return Promise.resolve({ captcha: field ? field.value : '' }); }
		return loadScript(cap.src).then(function () {
			return new Promise(function (resolve) {
				win.grecaptcha.ready(function () {
					win.grecaptcha.execute(cap.siteKey, { action: action || 'submit' }).then(function (token) { resolve({ captcha: token }); }, function () { resolve({ captcha: '' }); });
				});
			});
		}, function () { return { captcha: '' }; });
	}

	// Tokens are single-use: get a fresh one after every request that carried one.
	function capReset(box) {
		if (!box) { return; }
		var type = capType(box);
		if (type === 'turnstile' && win.turnstile && box.__hmId !== undefined) {
			try { win.turnstile.reset(box.__hmId); } catch (e) { /* Widget gone. */ }
		}
		if (type !== 'builtin') { return; }
		$('.hm-captcha__input', box).value = '';
		fetch(restRoot + 'auth/nonce', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
			.then(function (r) { return r.json(); })
			.then(function (d) {
				if (d && d.nonce) { nonce = d.nonce; }
				if (d && d.captcha) {
					$('[data-hm-captcha-q]', box).textContent = d.captcha.question;
					$('[data-hm-captcha-token]', box).value = d.captcha.token;
					box.setAttribute('data-expires', d.captcha.expires);
				}
			}, function () { /* Keep the old question. */ });
	}

	// Classic forms (wp-login.php, WooCommerce) with reCAPTCHA: fetch a token, then submit.
	function capClassic(scope) {
		if (cap.provider !== 'recaptcha') { return; }
		$$('[data-hm-captcha="recaptcha"]', scope).forEach(function (box) {
			var form = box.closest('form');
			if (!form || form.__hmCap || box.closest('[data-hm-auth], [data-hm-quick]')) { return; }
			form.__hmCap = true;
			form.addEventListener('submit', function (e) {
				if (form.__hmPass) { form.__hmPass = false; return; }
				e.preventDefault();
				var submitter = e.submitter || null;
				capValue(box, 'login').then(function (d) {
					capField(box).value = d.captcha || '';
					form.__hmPass = true;
					if (form.requestSubmit) { form.requestSubmit(submitter); } else { HTMLFormElement.prototype.submit.call(form); }
				});
			});
		});
	}

	/* ---------- Google ---------- */
	var gcfg = cfg.google || null;
	var gsiReady = null;
	var googleOwner = null;

	function gsi() {
		if (!gsiReady) {
			gsiReady = loadScript(gcfg.src).then(function () {
				win.google.accounts.id.initialize({
					client_id: gcfg.clientId,
					ux_mode: 'popup',
					context: 'signin',
					itp_support: true,
					callback: function (res) {
						var root = googleOwner || $('[data-hm-auth] [data-hm-google].is-ready');
						var inst = root && root.closest('[data-hm-auth]').__hmAuth;
						if (inst && res && res.credential) { inst.google(res.credential); }
					}
				});
			}, function () { gsiReady = null; throw new Error('gsi'); });
		}
		return gsiReady;
	}

	// Google's button is laid invisibly over ours, so it gets the click and the focus.
	function googlePrepare(scope) {
		if (!gcfg) { return; }
		$$('[data-hm-google]', scope).forEach(function (box) {
			if (box.__hmG || box.closest('[hidden]') || !box.offsetWidth) { return; }
			box.__hmG = true;
			box.addEventListener('mouseenter', function () { googleOwner = box; });
			box.addEventListener('focusin', function () { googleOwner = box; });
			gsi().then(function () {
				win.google.accounts.id.renderButton($('[data-hm-gsi]', box), {
					type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular',
					logo_alignment: 'center', width: Math.max(200, Math.min(400, box.offsetWidth)), locale: gcfg.locale
				});
				box.classList.add('is-ready');
				var own = $('[data-hm-google-btn]', box);
				own.tabIndex = -1;
				own.setAttribute('aria-hidden', 'true');
			}, function () { box.__hmG = false; });
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
		this.gWrap = $('[data-hm-google-wrap]', root);
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
			var el = e.target.closest('[data-hm-edit], [data-hm-resend], [data-hm-tab], [data-hm-reveal], [data-hm-switch], [data-hm-google-btn]');
			if (!el || !self.root.contains(el)) { return; }
			if (el.hasAttribute('data-hm-edit')) { self.edit(); }
			else if (el.hasAttribute('data-hm-resend')) { self.send(true); }
			else if (el.hasAttribute('data-hm-tab')) { self.tab(el.getAttribute('data-hm-tab'), true); }
			else if (el.hasAttribute('data-hm-reveal')) { self.reveal(el); }
			else if (el.hasAttribute('data-hm-switch')) { self.switchTo(el.getAttribute('data-hm-switch')); }
			else if (el.hasAttribute('data-hm-google-btn')) { self.googlePrompt(el); }
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
		var host = where === 'password' ? this.pwForm : (where === 'google' ? this.gWrap : this.steps[where]);
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
				capPrepare(panel);
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

	// "Forgot your password? Log in with a code": carry a typed mobile number over.
	Auth.prototype.switchTo = function (name) {
		var mobile = name === 'otp' && this.pwForm ? normalizeMobile(this.pwForm.elements.login.value) : '';
		if (mobile && this.steps.mobile) { this.steps.mobile.elements.mobile.value = mobile; }
		this.tab(name, true);
	};

	// Our own button only gets clicks before Google's script is in (or on its edges).
	Auth.prototype.googlePrompt = function (btn) {
		var self = this;
		googleOwner = btn.parentNode;
		if (!gcfg) { return; }
		gsi().then(function () { win.google.accounts.id.prompt(); }, function () {
			self.msg('google', t('googleUnavailable', 'Google sign-in isn’t available right now.'));
		});
	};

	Auth.prototype.google = function (credential) {
		var self = this;
		if (this.busy) { return; }
		this.busy = true;
		this.msg('google', '');
		this.root.setAttribute('aria-busy', 'true');
		api('auth/google', { credential: credential, redirect: this.redirect }).then(function (res) {
			self.busy = false;
			self.root.removeAttribute('aria-busy');
			if (res.ok) { self.success(res); return; }
			self.msg('google', res.message || t('error', 'Something went wrong.'));
		});
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
		// A solved captcha also covers "resend" for the same number (server side).
		var box = isResend ? null : capBox(form);
		var missing = capMissing(box);
		if (missing) {
			this.msg('mobile', missing);
			capFocus(box);
			return;
		}
		if (this.busy) { return; }
		this.busy = true;
		var btn = isResend ? $('[data-hm-resend]', this.steps.code) : $('.hm-auth__submit', form);
		loading(btn, true);

		capValue(box, 'otp').then(function (extra) {
			return api('auth/send', extend({ mobile: mobile, website: self.hp(form) }, extra));
		}).then(function (res) {
			self.busy = false;
			loading(btn, false);
			capReset(box);
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
		var box = capBox(form);
		var missing = capMissing(box);
		if (missing) {
			this.msg('password', missing);
			capFocus(box);
			return;
		}
		if (this.busy) { return; }
		this.busy = true;
		var btn = $('.hm-auth__submit', form);
		loading(btn, true);
		capValue(box, 'login').then(function (extra) {
			return api('auth/password', extend({ login: latin(login), password: pass, redirect: self.redirect, website: self.hp(form) }, extra));
		}).then(function (res) {
			self.busy = false;
			loading(btn, false);
			capReset(box);
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
	var openEl = null;
	function modal() { return openEl || doc.getElementById('hm-auth-modal'); }

	function openModal(trigger, el) {
		var m = el || doc.getElementById('hm-auth-modal');
		if (!m) { return false; }
		if (openEl && openEl !== m) { closeModal(); }
		openEl = m;
		win.clearTimeout(m.__hmClose);
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
		capPrepare(m);
		googlePrepare(m);
		return true;
	}

	function closeModal() {
		var m = modal();
		if (!m || !m.classList.contains('is-open')) { return; }
		openEl = null;
		m.classList.remove('is-open');
		m.setAttribute('aria-hidden', 'true');
		doc.documentElement.style.overflow = '';
		m.__hmClose = win.setTimeout(function () { m.hidden = true; }, reduce ? 0 : 320);
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

		var quick = target.closest('[data-hm-quick-open]');
		if (quick) {
			e.preventDefault();
			quickOpen(quick);
			return;
		}
		var notify = target.closest('[data-hm-notify-submit]');
		if (notify) {
			e.preventDefault();
			notifySubmit(notify.closest('[data-hm-notify]'));
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

	/* ---------- Quick buy ---------- */
	var quickCtx = null;

	function quickOpen(btn) {
		var m = doc.getElementById('hm-quick-modal');
		if (!m) { return; }
		var box = $('[data-hm-quick]', m);
		var form = $('[data-hm-quick-form]', box);
		var cart = btn.closest('form');
		var qty = cart && cart.elements.quantity ? Math.max(1, parseInt(latin(cart.elements.quantity.value), 10) || 1) : 1;
		var title = $('.product_title');
		quickCtx = { product: btn.getAttribute('data-product'), cart: cart, quantity: qty };

		$('[data-hm-quick-product]', box).textContent = (title ? title.textContent.trim() : '') + ' × ' + num(qty);
		$('[data-hm-quick-done]', box).hidden = true;
		form.hidden = false;
		$('[data-hm-msg]', form).textContent = '';
		if (!form.__hmQuick) {
			form.__hmQuick = true;
			form.addEventListener('submit', function (e) { e.preventDefault(); quickSubmit(form); });
			form.elements.mobile.addEventListener('input', function () { form.elements.mobile.removeAttribute('aria-invalid'); });
		}
		openModal(btn, m);
		if (cart && cart.elements.variation_id && !(parseInt(cart.elements.variation_id.value, 10) > 0)) {
			$('[data-hm-msg]', form).textContent = t('chooseOptions', 'Please choose the product options first.');
		}
	}

	function quickSubmit(form) {
		var box = form.closest('[data-hm-quick]');
		var msg = $('[data-hm-msg]', form);
		var ctx = quickCtx || {};
		var cart = ctx.cart;
		var name = form.elements.name.value.replace(/\s+/g, ' ').trim();
		var mobile = normalizeMobile(form.elements.mobile.value);
		var data = { product_id: ctx.product, quantity: ctx.quantity, name: name, mobile: mobile, website: ($('.hm-auth__hp input', form) || {}).value || '' };
		msg.textContent = '';
		if (name.length < 2) { msg.textContent = t('nameRequired', 'Please enter your name.'); form.elements.name.focus(); return; }
		if (!mobile) {
			msg.textContent = t('invalidMobile', 'Please enter a valid mobile number.');
			form.elements.mobile.setAttribute('aria-invalid', 'true');
			form.elements.mobile.focus();
			return;
		}
		if (cart && cart.elements.variation_id) {
			data.variation_id = parseInt(cart.elements.variation_id.value, 10) || 0;
			if (!data.variation_id) { msg.textContent = t('chooseOptions', 'Please choose the product options first.'); return; }
			data.attributes = {};
			$$('[name^="attribute_"]', cart).forEach(function (el) { data.attributes[el.name] = el.value; });
		}
		var cbox = capBox(form);
		var missing = capMissing(cbox);
		if (missing) { msg.textContent = missing; capFocus(cbox); return; }
		if (form.__hmBusy) { return; }
		form.__hmBusy = true;
		var btn = $('.hm-auth__submit', form);
		loading(btn, true);

		capValue(cbox, 'quickbuy').then(function (extra) {
			return api('shop/quick-buy', extend(data, extra));
		}).then(function (res) {
			form.__hmBusy = false;
			loading(btn, false);
			capReset(cbox);
			if (!res.ok) { msg.textContent = res.message || t('error', 'Something went wrong.'); return; }
			var done = $('[data-hm-quick-done]', box);
			$('[data-hm-quick-message]', box).textContent = res.message || '';
			form.hidden = true;
			done.hidden = false;
			replay(done, 'is-entering');
			done.focus();
			if (res.redirect) { win.setTimeout(function () { win.location.assign(res.redirect); }, reduce ? 300 : 1400); }
		});
	}

	/* ---------- Back in stock ---------- */
	function notifySubmit(box) {
		if (!box || box.__hmBusy) { return; }
		var tel = $('[data-hm-notify-mobile]', box);
		var mail = $('[data-hm-notify-email]', box);
		var msg = $('[data-hm-msg]', box);
		var mobile = tel ? normalizeMobile(tel.value) : '';
		var email = mail ? mail.value.trim() : '';
		var error = '';
		var field = null;
		function say(text, ok) {
			msg.setAttribute('role', ok ? 'status' : 'alert');
			msg.classList.toggle('is-error', !ok);
			msg.textContent = text || '';
		}
		[tel, mail].forEach(function (el) { if (el) { el.removeAttribute('aria-invalid'); } });

		if (tel && !mobile && (tel.value.trim() || !mail)) { error = t('invalidMobile', 'Please enter a valid mobile number.'); field = tel; }
		else if (mail && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error = t('invalidEmail', 'Please enter a valid email address.'); field = mail; }
		else if (mail && !tel && !email) { error = t('invalidEmail', 'Please enter a valid email address.'); field = mail; }
		else if (!mobile && !email) { error = t('notifyContact', 'Enter your mobile number or email.'); field = tel || mail; }
		if (error) {
			say(error, false);
			if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
			return;
		}

		box.__hmBusy = true;
		var btn = $('[data-hm-notify-submit]', box);
		loading(btn, true);
		api('shop/notify', { product_id: box.getAttribute('data-hm-notify'), mobile: mobile, email: email }).then(function (res) {
			box.__hmBusy = false;
			loading(btn, false);
			say(res.message || t('error', 'Something went wrong.'), !!res.ok);
			if (res.ok) {
				box.classList.add('is-done');
				$('.hm-notify__row', box).hidden = true;
				msg.tabIndex = -1;
				msg.focus();
			}
		});
	}

	doc.addEventListener('keydown', function (e) {
		if (e.key !== 'Enter' || !e.target.closest) { return; }
		var box = e.target.closest('[data-hm-notify]');
		if (box && e.target.tagName === 'INPUT') {
			// Inside a variable product the fields sit in the add-to-cart form.
			e.preventDefault();
			notifySubmit(box);
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
		capPrepare(scope);
		capClassic(scope);
		googlePrepare(scope);
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
