/*!
 * Hamista interface sounds
 * Tiny clicks and ticks synthesized with the Web Audio API: no audio files, no
 * network requests. Nothing plays until the visitor turns sound on (speaker
 * button) and the browser has seen a click or key press.
 */
(function (win, doc) {
	'use strict';

	var cfg = (win.hamistaMotion || {}).sound;
	var AC = win.AudioContext || win.webkitAudioContext;
	if (!cfg || !cfg.enabled || !AC) { return; }

	var KEY = 'hm-sound';
	var stored = null;
	try { stored = win.localStorage.getItem(KEY); } catch (e) {}
	var on = stored === null ? !!cfg.def : stored === '1';
	var volume = Math.max(0.05, Math.min(1, (cfg.volume || 40) / 100));
	var ctx = null;
	var out = null;
	var noiseBuffer = null;
	var lastHover = 0;

	function audio() {
		if (!ctx) {
			ctx = new AC();
			out = ctx.createGain();
			out.gain.value = volume * 0.5;
			out.connect(ctx.destination);
		}
		if (ctx.state === 'suspended') { ctx.resume(); }
		return ctx;
	}

	// One shaped voice: oscillator → gain envelope (fast attack, exponential decay).
	function tone(type, freq, dur, gain, opts) {
		opts = opts || {};
		var t = ctx.currentTime + (opts.delay || 0);
		var osc = ctx.createOscillator();
		var env = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (opts.to) { osc.frequency.exponentialRampToValueAtTime(opts.to, t + dur); }
		env.gain.setValueAtTime(0.0001, t);
		env.gain.exponentialRampToValueAtTime(gain, t + 0.004);
		env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		osc.connect(env);
		env.connect(out);
		osc.start(t);
		osc.stop(t + dur + 0.02);
	}

	// Filtered noise burst, for mechanical clicks and air.
	function noise(dur, gain, filter, freq, delay) {
		if (!noiseBuffer) {
			var length = Math.floor(ctx.sampleRate * 0.25);
			noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
			var data = noiseBuffer.getChannelData(0);
			for (var i = 0; i < length; i++) { data[i] = Math.random() * 2 - 1; }
		}
		var t = ctx.currentTime + (delay || 0);
		var src = ctx.createBufferSource();
		var f = ctx.createBiquadFilter();
		var env = ctx.createGain();
		src.buffer = noiseBuffer;
		f.type = filter;
		f.frequency.value = freq;
		env.gain.setValueAtTime(gain, t);
		env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		src.connect(f);
		f.connect(env);
		env.connect(out);
		src.start(t);
		src.stop(t + dur + 0.02);
	}

	var themes = {
		soft: {
			hover: function () { tone('sine', 1320, 0.05, 0.035); },
			click: function () { tone('sine', 640, 0.11, 0.16, { to: 420 }); noise(0.03, 0.03, 'lowpass', 1800); },
			toggle: function () { tone('sine', 520, 0.09, 0.12); tone('sine', 780, 0.12, 0.1, { delay: 0.07 }); },
			open: function () { noise(0.22, 0.05, 'bandpass', 900); tone('sine', 440, 0.18, 0.05, { to: 660 }); }
		},
		glass: {
			hover: function () { tone('sine', 2640, 0.09, 0.025); tone('sine', 3960, 0.06, 0.012); },
			click: function () { tone('triangle', 1760, 0.28, 0.08); tone('sine', 2637, 0.22, 0.05); tone('sine', 5274, 0.1, 0.015); },
			toggle: function () { tone('sine', 1318, 0.18, 0.07); tone('sine', 1976, 0.24, 0.06, { delay: 0.06 }); },
			open: function () { tone('sine', 1046, 0.3, 0.05, { to: 2093 }); tone('sine', 3136, 0.2, 0.015, { delay: 0.05 }); }
		},
		mechanical: {
			hover: function () { noise(0.012, 0.05, 'bandpass', 3200); },
			click: function () { noise(0.025, 0.22, 'highpass', 1600); tone('square', 170, 0.025, 0.035); noise(0.02, 0.12, 'highpass', 2400, 0.045); },
			toggle: function () { noise(0.02, 0.2, 'highpass', 1800); noise(0.02, 0.16, 'highpass', 2600, 0.07); },
			open: function () { noise(0.16, 0.06, 'lowpass', 700); }
		},
		digital: {
			hover: function () { tone('square', 1800, 0.022, 0.018); },
			click: function () { tone('square', 880, 0.05, 0.05, { to: 1320 }); },
			toggle: function () { tone('square', 660, 0.04, 0.04); tone('square', 990, 0.05, 0.04, { delay: 0.05 }); },
			open: function () { tone('sawtooth', 220, 0.16, 0.03, { to: 880 }); }
		}
	};
	var theme = themes[cfg.theme] || themes.soft;

	function play(name) {
		if (!on || !theme[name]) { return; }
		try { audio(); theme[name](); } catch (e) {}
	}

	var TARGETS = 'a[href], button, [role="button"], .hm-card, .hm-chip, [data-hm-sound]';
	function target(node) {
		var el = node && node.closest ? node.closest(TARGETS) : null;
		return el && el.getAttribute('data-hm-sound') !== 'off' ? el : null;
	}

	if (cfg.hover) {
		doc.addEventListener('pointerover', function (e) {
			if (e.pointerType !== 'mouse') { return; }
			var el = target(e.target);
			if (!el || el === target(e.relatedTarget)) { return; }
			var now = win.performance.now();
			if (now - lastHover < 60) { return; }
			lastHover = now;
			play('hover');
		}, { passive: true });
	}

	doc.addEventListener('click', function (e) {
		if (e.target.closest && e.target.closest('[data-hm-sound-toggle]')) { return; }
		var el = target(e.target);
		if (!el) { return; }
		if (el.matches('[data-hm-theme-toggle], [aria-expanded]')) { play(el.getAttribute('aria-expanded') === 'false' ? 'open' : 'toggle'); return; }
		play(el.getAttribute('data-hm-sound') || 'click');
	});

	function sync() {
		Array.prototype.forEach.call(doc.querySelectorAll('[data-hm-sound-toggle]'), function (b) {
			b.setAttribute('aria-pressed', String(on));
		});
		doc.documentElement.classList.toggle('hm-sound-on', on);
	}

	doc.addEventListener('click', function (e) {
		var btn = e.target.closest && e.target.closest('[data-hm-sound-toggle]');
		if (!btn) { return; }
		on = !on;
		try { win.localStorage.setItem(KEY, on ? '1' : '0'); } catch (err) {}
		sync();
		play('toggle');
	});

	sync();

	var H = win.Hamista = win.Hamista || {};
	H.sound = {
		play: play,
		isOn: function () { return on; },
		set: function (value) { on = !!value; sync(); }
	};
}(window, document));
