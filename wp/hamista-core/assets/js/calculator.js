/*!
 * Hamista Core — price calculator.
 * amount × rate + fee, shown in tomans with Persian digits on Persian sites.
 */
(function () {
	'use strict';
	var fa = (document.documentElement.lang || '').indexOf('fa') === 0;
	var nf = new Intl.NumberFormat(fa ? 'fa-IR' : undefined, { maximumFractionDigits: 0 });
	var toman = fa ? ' تومان' : ' tomans';

	function money(n) { return nf.format(Math.round(n)) + toman; }

	function setup(form) {
		if (form.__hmCalc) { return; }
		form.__hmCalc = true;
		var items;
		try { items = JSON.parse(form.getAttribute('data-hm-calc')) || []; } catch (e) { return; }
		var amount = form.querySelector('input[name="amount"]');
		var unit = form.querySelector('.hm-calc__unit');
		var total = form.querySelector('input[name="total"]');
		var parts = {};
		form.querySelectorAll('[data-part]').forEach(function (el) { parts[el.getAttribute('data-part')] = el; });

		function current() {
			var picked = form.querySelector('input[name="service"]:checked');
			var i = 0;
			if (picked) { form.querySelectorAll('input[name="service"]').forEach(function (r, k) { if (r === picked) { i = k; } }); }
			return items[i] || items[0];
		}
		function update() {
			var it = current();
			var qty = Math.max(0, parseFloat(String(amount.value).replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); })) || 0);
			var base = qty * it.rate;
			var fee = base * it.fee / 100;
			parts.rate.textContent = money(it.rate) + ' / ' + it.unit;
			parts.fee.textContent = it.fee ? (fa ? nf.format(it.fee) + '٪' : it.fee + '%') + ' · ' + money(fee) : '—';
			parts.total.textContent = money(base + fee);
			total.value = Math.round(base + fee);
			unit.textContent = it.unit;
		}
		form.addEventListener('input', update);
		form.addEventListener('change', function (e) {
			if (e.target.name === 'service') {
				var it = current();
				amount.min = it.min;
				amount.value = it.start;
				update();
			}
		});
		form.addEventListener('submit', function (e) {
			if (!form.getAttribute('action')) { e.preventDefault(); }
		});
		update();
	}

	function init() { document.querySelectorAll('[data-hm-calc]').forEach(setup); }
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
	window.addEventListener('elementor/frontend/init', function () {
		if (window.elementorFrontend && window.elementorFrontend.hooks) {
			window.elementorFrontend.hooks.addAction('frontend/element_ready/hm-calculator.default', function ($el) { var f = $el[0].querySelector('[data-hm-calc]'); if (f) { setup(f); } });
		}
	});
}());
