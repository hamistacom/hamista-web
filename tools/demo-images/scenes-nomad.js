/* ================= Nomad — KOOCH (کوچ) =================
 * Modern organic products by nomadic families of the Zagros. Modern editorial with
 * kilim/gabbeh geometry (stepped motifs on a cell grid), kraft paper and wool texture.
 */
(() => {
	const P = { wool: '#f3ede2', wool2: '#e8dfcf', terra: '#b5532f', madder: '#8e2b22', indigo: '#2e3a5c', saffron: '#e3a72f', char: '#1e1b18', olive: '#6b6b3a', kraft: '#c49a6c', kraft2: '#a97f52' };
	const FA = `font-family="Vazirmatn,sans-serif" direction="rtl"`;
	const st = s => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
	const lg = (id, s, x2 = 0, y2 = 1, x1 = 0, y1 = 0) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(s)}</linearGradient>`;
	const rg = (id, s, cx = .5, cy = .5, r = .5, fx = cx, fy = cy) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${st(s)}</radialGradient>`;
	const f1 = n => (+n).toFixed(1);
	let N = 0; const id = p => `k${p}${++N}`;

	const kdefs = () => `<defs>
		<filter id="kb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
		<filter id="kb4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
		<filter id="kb8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
		<filter id="kb16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
		<filter id="kb30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
		<filter id="kWool" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55 .9" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .1 0 0 0 0 .07 0 0 0 0 .04 0 0 0 1.5 -.62"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="kPile" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .08 0 0 0 0 .05 0 0 0 0 .03 0 0 0 2 -.9"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="kPaper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7 .25" numOctaves="3" seed="12"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 1.2 -.5"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="kPlaster" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="21"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .5 -.18"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="kSpeck" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .18 0 0 0 3 -2.1"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<pattern id="kWeft" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="3" fill="#000" opacity=".07"/><rect y="3" width="8" height="1" fill="#fff" opacity=".06"/></pattern>
		<pattern id="kKnit" width="10" height="12" patternUnits="userSpaceOnUse"><path d="M1,1 L5,10 L9,1" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1.6"/><path d="M1.6,0 L5,7.5" stroke="#fff" stroke-opacity=".18" stroke-width="1"/></pattern>
	</defs>`;

	/* ---------- cell grid → merged rects ---------- */
	class Grid {
		constructor(w, h, bg) { this.w = w; this.h = h; this.c = Array.from({ length: h }, () => new Array(w).fill(bg)); }
		set(x, y, c) { if (x >= 0 && y >= 0 && x < this.w && y < this.h && c != null) this.c[y][x] = c; }
		rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
		bitmap(rows, x, y, map, flip = false) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (map[ch] !== undefined) this.set(flip ? x + r.length - 1 - i : x + i, y + j, map[ch]); })); }
		/* stepped diamond of radius r with concentric colour rings */
		diamond(cx, cy, r, cols, hooks) {
			for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const d = Math.abs(i) + Math.abs(j); if (d <= r) this.set(cx + i, cy + j, cols[Math.min(cols.length - 1, Math.floor((r - d) / Math.max(1, Math.ceil(r / cols.length))))]); }
			if (hooks) { const c = cols[0]; [[-1, 1], [1, -1]].forEach(([sx]) => { for (let k = 0; k < 3; k++) { this.set(cx + sx * (r + 1 + k), cy, c); } this.set(cx + sx * (r + 3), cy - 1, c); this.set(cx + sx * (r + 3), cy - 2, c); this.set(cx + sx * (r + 3), cy + 1, c); this.set(cx + sx * (r + 3), cy + 2, c); }); this.set(cx, cy - r - 1, c); this.set(cx, cy + r + 1, c); }
		}
		zig(y, h, c, bg, step = 1, x0 = 0, x1 = this.w) { for (let x = x0; x < x1; x++) { const t = ((x - x0) % (2 * h)); const k = t < h ? t : 2 * h - t - 1; for (let j = 0; j < h; j++) this.set(x, y + j, j <= k ? c : (bg ?? this.c[y + j]?.[x])); } }
		svg(cell, ox = 0, oy = 0) {
			let s = '';
			for (let y = 0; y < this.h; y++) { let x = 0; const row = this.c[y]; while (x < this.w) { const c = row[x]; let e = x + 1; while (e < this.w && row[e] === c) e++; if (c) s += `<rect x="${f1(ox + x * cell)}" y="${f1(oy + y * cell)}" width="${f1((e - x) * cell + .4)}" height="${f1(cell + .4)}" fill="${c}"/>`; x = e; } }
			return s;
		}
	}

	/* kilim band rendered into a grid (w cells × h cells) */
	const kilimBand = (w, h, scheme = 0, seed = 3) => {
		const S = [
			{ bg: P.madder, a: P.indigo, b: P.saffron, c: P.wool, d: P.terra, e: P.char },
			{ bg: P.indigo, a: P.madder, b: P.wool, c: P.saffron, d: P.terra, e: P.char },
			{ bg: P.wool, a: P.terra, b: P.indigo, c: P.saffron, d: P.madder, e: P.olive },
		][scheme % 3];
		const g = new Grid(w, h, S.bg);
		const bH = Math.max(2, Math.round(h * .07));
		g.rect(0, 0, w, bH, S.e); g.rect(0, h - bH, w, bH, S.e);
		for (let x = 1; x < w; x += 4) { g.set(x, Math.floor(bH / 2), S.c); g.set(x, h - bH + Math.floor(bH / 2), S.c); }
		const zh = Math.max(2, Math.round(h * .08));
		g.rect(0, bH, w, zh, S.c); g.zig(bH, zh, S.d, S.c); g.rect(0, h - bH - zh, w, zh, S.c);
		for (let x = 0; x < w; x++) { const t = x % (2 * zh), k = t < zh ? t : 2 * zh - t - 1; for (let j = 0; j < zh; j++) if (zh - 1 - j <= k) g.set(x, h - bH - 1 - j, S.d); }
		const cy = Math.floor(h / 2), r = Math.floor((h - 2 * (bH + zh)) / 2) - 2;
		const pitch = Math.max(6, r * 2 + 8);
		let i = 0;
		if (r >= 1) for (let cx = Math.floor(pitch / 2); cx < w + pitch; cx += pitch, i++) {
			const cols = i % 2 ? [S.a, S.c, S.b, S.d] : [S.b, S.a, S.c, S.a];
			g.diamond(cx, cy, r, cols, true);
			const mx = cx + Math.floor(pitch / 2);
			[[0, -3], [0, 3], [-1, 0], [1, 0], [0, 0], [0, -2], [0, 2], [-2, 0], [2, 0]].forEach(([dx, dy]) => g.set(mx + dx, cy + dy, S.c));
			g.set(mx, cy - r + 1, S.b); g.set(mx, cy + r - 1, S.b);
		}
		return g;
	};

	/* ---------- backdrop: plaster wall + floor + arch ---------- */
	const stage = (W, H, hz, arch, o = {}) => {
		const aw = o.aw || W * .5, ax = (W - aw) / 2 + (o.ax || 0), at = o.at ?? H * .14;
		let s = `<defs>${lg('kWall', [[0, '#efe8dc'], [1, '#f5efe5']], .3, 1)}${lg('kFloor', [[0, '#e6dccb'], [1, '#efe7da']])}${lg('kArchG', [[0, '#fff', .12], [.5, '#fff', 0], [1, '#000', .12]], 1, 1)}</defs>`;
		s += `<rect width="${W}" height="${hz}" fill="url(#kWall)"/><rect width="${W}" height="${hz}" filter="url(#kPlaster)" opacity=".35"/>`;
		if (arch) {
			const ap = `M${ax},${hz} L${ax},${at + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${at + aw / 2} L${ax + aw},${hz}Z`;
			s += `<path d="${ap}" fill="${arch}"/><path d="${ap}" fill="url(#kArchG)"/><path d="${ap}" filter="url(#kPlaster)" opacity=".35"/>`;
			const i2 = 18;
			s += `<path d="M${ax + i2},${hz} L${ax + i2},${at + aw / 2} A${aw / 2 - i2},${aw / 2 - i2} 0 0 1 ${ax + aw - i2},${at + aw / 2} L${ax + aw - i2},${hz}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>`;
		}
		s += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#kFloor)"/><rect y="${hz}" width="${W}" height="${H - hz}" filter="url(#kPlaster)" opacity=".4"/><rect y="${hz}" width="${W}" height="3" fill="#000" opacity=".06"/>`;
		s += `<path d="M${W * .05},0 L${W * .45},0 L${W * .25},${H} L${-W * .2},${H}Z" fill="#fff" opacity=".12" filter="url(#kb30)"/>`;
		return s;
	};
	const shadowE = (cx, cy, rx, ry, k = 1) => `<ellipse cx="${cx + rx * .25}" cy="${cy}" rx="${rx * 1.15}" ry="${ry * 1.6}" fill="#3a2a1a" opacity="${.16 * k}" filter="url(#kb16)"/><ellipse cx="${cx + rx * .08}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a1e12" opacity="${.32 * k}" filter="url(#kb4)"/>`;

	/* ---------- brand label pieces ---------- */
	const markDiamond = (x, y, s, c) => `<path d="M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y}Z" fill="none" stroke="${c}" stroke-width="${s * .22}"/><path d="M${x},${y - s * .4} L${x + s * .4},${y} L${x},${y + s * .4} L${x - s * .4},${y}Z" fill="${c}"/>`;
	const wordmark = (x, y, sz, c) => `<text x="${x}" y="${y}" font-family="Vazirmatn,DejaVu Sans,sans-serif" font-size="${sz}" font-weight="800" letter-spacing="${sz * .42}" fill="${c}" text-anchor="middle">KOOCH</text>`;
	/* kraft tag with string */
	const tag = (x, y, rot, name, sub) => {
		const p = id('tg');
		return `<g transform="translate(${x} ${y}) rotate(${rot})"><defs>${lg(p, [[0, '#cfa877'], [1, '#b98d5c']], 1, 1)}</defs><path d="M-70,-10 L-50,-34 L70,-34 L70,64 L-70,64Z" fill="#2a1e12" opacity=".25" transform="translate(6 8)" filter="url(#kb4)"/><path d="M-70,-10 L-50,-34 L70,-34 L70,64 L-70,64Z" fill="url(#${p})"/><path d="M-70,-10 L-50,-34 L70,-34 L70,64 L-70,64Z" filter="url(#kPaper)" opacity=".7"/><circle cx="-52" cy="-14" r="5" fill="#8a6a44"/><circle cx="-52" cy="-14" r="3" fill="#efe6d4"/>${wordmark(4, -10, 11, P.char)}<text x="4" y="24" ${FA} font-size="22" font-weight="800" fill="${P.char}" text-anchor="middle">${name}</text>${sub ? `<text x="4" y="48" ${FA} font-size="12" font-weight="600" fill="${P.madder}" text-anchor="middle">${sub}</text>` : ''}</g>`;
	};

	/* ---------- simple straight jar (local origin = bottom centre) ---------- */
	const sjar = (o) => {
		const p = id('sj'), R = o.R, Hh = o.H, e = o.e ?? .14;
		const body = `M${-R},${-Hh} L${-R},${-R * .12} Q${-R},0 ${-R * .88},${R * e * .9} A${R * .9},${R * e} 0 0 0 ${R * .88},${R * e * .9} Q${R},0 ${R},${-R * .12} L${R},${-Hh} A${R},${R * e} 0 0 0 ${-R},${-Hh}Z`;
		let s = `<defs><clipPath id="${p}c"><path d="${body}"/></clipPath>${lg(`${p}g`, [[0, '#4a3410', .45], [.08, '#4a3410', .12], [.2, '#fff', .0], [.8, '#000', 0], [.93, '#4a3410', .15], [1, '#4a3410', .5]], 1, 0)}${lg(`${p}h`, [[0, '#fff', 0], [.15, '#fff', .9], [.85, '#fff', .8], [1, '#fff', 0]])}</defs>`;
		s += shadowE(0, R * e * .5, R * 1.02, R * e * 1.2);
		s += `<path d="${body}" fill="#fffaf2" opacity=".25"/>`;
		s += `<g clip-path="url(#${p}c)">${o.inner ? o.inner(R, Hh, e) : ''}<path d="${body}" fill="url(#${p}g)"/>`;
		s += `<rect x="${-R + R * .08}" y="${-Hh + 14}" width="${R * .07}" height="${Hh - 30}" fill="url(#${p}h)" opacity=".8" filter="url(#kb2)"/><rect x="${-R + R * .24}" y="${-Hh + 24}" width="${R * .13}" height="${Hh - 50}" fill="url(#${p}h)" opacity=".18"/><rect x="${R * .84}" y="${-Hh + 20}" width="${R * .04}" height="${Hh - 40}" fill="url(#${p}h)" opacity=".6" filter="url(#kb2)"/></g>`;
		s += `<path d="${body}" fill="none" stroke="#6a5030" stroke-opacity=".3" stroke-width="2"/>`;
		return s;
	};

	window.KOOCH = { P, FA, lg, rg, f1, id, kdefs, Grid, kilimBand, stage, shadowE, markDiamond, wordmark, tag, sjar };
})();

/* ---------- KOOCH product shots ---------- */
(() => {
	const K = window.KOOCH, { P, FA, lg, rg, f1, id, kdefs, Grid, kilimBand, stage, shadowE, markDiamond, wordmark, tag, sjar } = K;
	const svg = (W, H, inner, post = '') => `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${kdefs()}${inner}</svg>${post}`;
	const post = () => `${grainFx(.26, .8)}${vignette(.16, '60,40,20')}`;

	/* fabric pattern tile from a kilim band */
	const fabric = (pid, scheme, cell = 6, w = 40, h = 18) => { const g = kilimBand(w, h, scheme); return `<pattern id="${pid}" width="${w * cell}" height="${h * cell}" patternUnits="userSpaceOnUse">${g.svg(cell)}<rect width="${w * cell}" height="${h * cell}" fill="url(#kWeft)"/></pattern>`; };
	K.fabric = fabric;

	/* ghee contents */
	const gheeInner = (top) => (R, Hh, e) => { const p = id('gh'); return `<defs>${lg(p, [[0, '#b98a2a'], [.2, '#e8c25a'], [.45, '#f6dd8c'], [.7, '#e9c45e'], [1, '#a87a22']], 1, 0)}</defs><rect x="${-R}" y="${-Hh + top}" width="${R * 2}" height="${Hh}" fill="url(#${p})"/><rect x="${-R}" y="${-Hh + top}" width="${R * 2}" height="${Hh}" filter="url(#kSpeck)" opacity=".7"/><ellipse cx="0" cy="${-Hh + top}" rx="${R}" ry="${R * e}" fill="#f8e6a6"/><ellipse cx="0" cy="${-Hh + top}" rx="${R}" ry="${R * e}" filter="url(#kSpeck)" opacity=".6"/>`; };
	/* wrap label (ellipse-curved band) */
	const wrapLabel = (R, e, y0, y1, x0, fill, inner) => {
		const ell = (y, x) => y + R * e * Math.sqrt(Math.max(0, 1 - (x / R) ** 2));
		const band = `M${-x0},${f1(ell(y0, x0))} A${R},${R * e} 0 0 0 ${x0},${f1(ell(y0, x0))} L${x0},${f1(ell(y1, x0))} A${R},${R * e} 0 0 1 ${-x0},${f1(ell(y1, x0))}Z`;
		const p = id('wl');
		return `<defs>${lg(p, [[0, '#2a1e12', .35], [.15, '#2a1e12', .05], [.35, '#fff', .12], [.55, '#fff', 0], [.85, '#2a1e12', .12], [1, '#2a1e12', .4]], 1, 0)}</defs><path d="${band}" fill="${fill}"/><path d="${band}" filter="url(#kPaper)" opacity=".6"/>${inner(ell)}<path d="${band}" fill="url(#${p})"/>`;
	};

	const ghee = (open) => {
		const R = 200, Hh = open ? 300 : 350, e = open ? .3 : .14;
		let s = sjar({ R, H: Hh, e, inner: gheeInner(open ? 40 : 6) });
		const ly0 = open ? -Hh * .62 : -Hh * .64;
		s += wrapLabel(R, e, ly0, ly0 + 196, R * .8, '#c9a274', ell => `${wordmark(0, f1(ell(ly0 + 30, 0)), 14, P.char)}${markDiamond(0, ell(ly0 + 50, 0), 7, P.madder)}<text x="0" y="${f1(ell(ly0 + 106, 0))}" ${FA} font-size="40" font-weight="800" fill="${P.char}" text-anchor="middle">روغن حیوانی</text><text x="0" y="${f1(ell(ly0 + 136, 0))}" ${FA} font-size="16" font-weight="600" fill="${P.madder}" text-anchor="middle">دست‌ساز · عشایر زاگرس</text><text x="0" y="${f1(ell(ly0 + 172, 0))}" ${FA} font-size="15" font-weight="700" fill="${P.char}" fill-opacity=".75" text-anchor="middle">۹۰۰ گرم</text>`);
		if (!open) {
			const p = id('cl'), T = -Hh;
			s += `<defs>${fabric(p, 0, 5)}${lg(p + 'f', [[0, '#000', .3], [.1, '#000', 0], [.2, '#fff', .15], [.3, '#000', .12], [.45, '#fff', .1], [.6, '#000', .14], [.75, '#fff', .08], [.88, '#000', .18], [1, '#000', .35]], 1, 0)}</defs>`;
			const hem = [];
			for (let i = 0; i <= 10; i++) { const x = -R - 22 + i * (2 * R + 44) / 10; hem.push(`${f1(x)},${f1(T + 78 + (i % 2 ? 16 : 0) + Math.sin(i) * 4 + R * e * Math.sqrt(Math.max(0, 1 - (x / (R + 22)) ** 2)))}`); }
			const skirt = `M${-R - 12},${T - 6} C${-R - 26},${T + 20} ${-R - 30},${T + 50} ${-R - 22},${T + 78} L${hem.join(' L')} C${R + 30},${T + 50} ${R + 26},${T + 20} ${R + 12},${T - 6}Z`;
			s += `<path d="${skirt}" fill="#2a1e12" opacity=".2" transform="translate(6 10)" filter="url(#kb4)"/><path d="${skirt}" fill="url(#${p})"/><path d="${skirt}" fill="url(#${p}f)"/>`;
			s += `<path d="M${-R - 12},${T - 6} Q0,${T - R * .55} ${R + 12},${T - 6} Q0,${T + R * e * 1.4} ${-R - 12},${T - 6}Z" fill="url(#${p})"/><path d="M${-R - 12},${T - 6} Q0,${T - R * .55} ${R + 12},${T - 6}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3"/><ellipse cx="${-R * .3}" cy="${T - R * .22}" rx="${R * .5}" ry="${R * .1}" fill="#fff" opacity=".18" filter="url(#kb4)"/>`;
			s += `<path d="M${-R - 18},${T + 30} Q0,${T + 30 + R * e * 2.2} ${R + 18},${T + 30}" fill="none" stroke="#a37b4a" stroke-width="9"/><path d="M${-R - 18},${T + 28} Q0,${T + 28 + R * e * 2.2} ${R + 18},${T + 28}" fill="none" stroke="#d9b98a" stroke-width="3" stroke-dasharray="4 5"/>`;
			s += `<path d="M${-R * .55},${T + 52} q-10,40 -26,70 M${-R * .55},${T + 52} q8,44 2,76" stroke="#a37b4a" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${-R * .55}" cy="${T + 52}" r="10" fill="#a37b4a"/>`;
		}
		return s;
	};

	const kashkBall = (x, y, r, seed) => { const rr = rng(seed), rx = r * (.92 + rr() * .16), ry = r * (.86 + rr() * .12), a = f1(rr() * 60 - 30); let s = `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#kKa)"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" filter="url(#kSpeck)" opacity=".8"/>`; for (let i = 0; i < 2; i++) s += `<path d="M${f1(x - rx * .3 + rr() * rx * .4)},${f1(y - ry * .5 + rr() * ry * .4)} l${f1(rr() * 10 - 5)},${f1(8 + rr() * 8)} l${f1(rr() * 8)},${f1(6 + rr() * 6)}" stroke="#a8977a" stroke-width="1.4" fill="none" opacity=".7"/>`; return s + `</g>`; };
	const kashkDefs = () => `<defs>${rg('kKa', [[0, '#fffbf2'], [.45, '#efe6d2'], [.85, '#cdbf9f'], [1, '#b3a27f']], .5, .5, .55, .36, .3)}</defs>`;
	const bowl = (cx, cy, R, heap) => {
		const p = id('bw'), ry = R * .28, H = R * .62;
		let s = `<defs>${lg(p, [[0, '#cfc6b4'], [.2, '#f6f1e6'], [.45, '#fffdf8'], [.8, '#ddd3c0'], [1, '#bfb49e']], 1, 0)}${lg(p + 'i', [[0, '#d9cfbb'], [1, '#f3ede0']])}</defs>`;
		s += shadowE(cx, cy + 4, R * .75, ry * .5);
		s += `<ellipse cx="${cx}" cy="${cy - H}" rx="${R}" ry="${ry}" fill="url(#${p}i)"/>`;
		s += heap ? heap.back : '';
		s += `<path d="M${cx - R},${cy - H} C${cx - R},${cy - H * .25} ${cx - R * .55},${cy} ${cx - R * .4},${cy} L${cx + R * .4},${cy} C${cx + R * .55},${cy} ${cx + R},${cy - H * .25} ${cx + R},${cy - H} A${R},${ry} 0 0 1 ${cx - R},${cy - H}Z" fill="url(#${p})"/>`;
		s += `<path d="M${cx - R},${cy - H} A${R},${ry} 0 0 0 ${cx + R},${cy - H} L${cx + R - 2},${cy - H + 26} A${R - 2},${ry} 0 0 1 ${cx - R + 2},${cy - H + 26}Z" fill="${P.indigo}"/><path d="M${cx - R * .93},${cy - H + 44} A${R * .93},${ry} 0 0 0 ${cx + R * .93},${cy - H + 44}" fill="none" stroke="${P.terra}" stroke-width="3"/>`;
		for (let i = 0; i < 7; i++) { const t = -.75 + i * .25, x = cx + t * R * .86, y = cy - H + 70 + ry * Math.sqrt(1 - t * t) * .8; s += markDiamond(x, y, 9, P.indigo); }
		s += `<path d="M${cx - R * .4},${cy} L${cx + R * .4},${cy} L${cx + R * .38},${cy + 10} L${cx - R * .38},${cy + 10}Z" fill="#bfb49e"/>`;
		s += `<path d="M${cx - R * .86},${cy - H * .8} C${cx - R * .84},${cy - H * .4} ${cx - R * .6},${cy - H * .12} ${cx - R * .45},${cy - 8}" stroke="#fff" stroke-width="8" fill="none" opacity=".6" stroke-linecap="round" filter="url(#kb2)"/>`;
		s += heap ? heap.front : '';
		return s;
	};
	/* cloth lying in perspective */
	const clothFlat = (x, y, w, h, scheme, skew = -.35, sy = .38, cell = 10) => { const g = kilimBand(Math.round(w / cell), Math.round(h / cell), scheme); return `<g transform="matrix(1,0,${skew},${sy},${x - skew * h},${y - sy * h})"><rect x="12" y="20" width="${w}" height="${h}" fill="#2a1e12" opacity=".25" filter="url(#kb8)"/>${g.svg(cell)}<rect width="${w}" height="${h}" fill="url(#kWeft)"/><rect width="${w}" height="${h}" filter="url(#kWool)" opacity=".5"/></g>`; };
	K.clothFlat = clothFlat;

	const disc = (x, y, r, th, e, seed, broken) => {
		const rr = rng(seed), p = id('dq');
		let s = `<defs>${rg(p, [[0, '#5a3a26'], [.6, '#3b2316'], [1, '#24150c']], .45, .4, .6)}</defs>`;
		if (!broken) {
			s += `<path d="M${x - r},${y} L${x - r},${y + th} A${r},${r * e} 0 0 0 ${x + r},${y + th} L${x + r},${y}Z" fill="#1e120a"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * e}" fill="url(#${p})"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * e}" filter="url(#kSpeck)" opacity=".5"/><path d="M${x - r * .7},${y - r * e * .3} A${r * .8},${r * e * .8} 0 0 1 ${x + r * .1},${y - r * e * .85}" stroke="#c9a888" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>`;
			for (let i = 0; i < 3; i++) s += `<circle cx="${f1(x + (rr() - .5) * r)}" cy="${f1(y + (rr() - .5) * r * e)}" r="${f1(2 + rr() * 3)}" fill="#7a5a44" opacity=".5"/>`;
		} else {
			const jag = []; for (let i = 0; i <= 8; i++) jag.push(`${f1(x - r * .1 + (i % 2 ? 8 : -6))},${f1(y - r * e + i * 2 * r * e / 8)}`);
			s += `<path d="M${x - r * .1},${y - r * e} A${r},${r * e} 0 0 0 ${x - r * .1},${y + r * e} L${jag.reverse().join(' L')}Z" fill="url(#${p})"/><path d="M${x - r},${y} L${x - r},${y + th} A${r},${r * e} 0 0 0 ${x - r * .1},${y + r * e + th} L${x - r * .1},${y + r * e}Z" fill="#1e120a"/><path d="M${jag.join(' L')} l14,${th} L${x - r * .1 + 14},${y - r * e + th}Z" fill="#6a4a34"/><path d="M${jag.join(' L')}" stroke="#8a6a50" stroke-width="2" fill="none"/>`;
		}
		return s;
	};
	const kraftSheet = (cx, cy, w, h, seed, sy = .45) => {
		const r = rng(seed), nx = 8, ny = 5, pts = [];
		for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const u = i / nx - .5, v = j / ny - .5; pts.push([cx + u * w + (r() - .5) * w * .06 + v * w * .08, cy + v * h * sy + (r() - .5) * h * .05 * sy]); }
		let s = `<path d="M${pts[0][0]},${pts[0][1]} L${pts[nx][0]},${pts[nx][1]} L${pts[(ny + 1) * (nx + 1) - 1][0]},${pts[(ny + 1) * (nx + 1) - 1][1]} L${pts[ny * (nx + 1)][0]},${pts[ny * (nx + 1)][1]}Z" fill="#2a1e12" opacity=".22" transform="translate(10 14)" filter="url(#kb8)"/>`;
		for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
			const a = pts[j * (nx + 1) + i], b = pts[j * (nx + 1) + i + 1], c = pts[(j + 1) * (nx + 1) + i + 1], d = pts[(j + 1) * (nx + 1) + i];
			const l1 = .82 + r() * .3, l2 = .82 + r() * .3;
			const col = l => `rgb(${Math.round(196 * l)},${Math.round(154 * l)},${Math.round(108 * l)})`;
			s += `<path d="M${f1(a[0])},${f1(a[1])} L${f1(b[0])},${f1(b[1])} L${f1(c[0])},${f1(c[1])}Z" fill="${col(l1)}" stroke="${col(l1)}" stroke-width=".6"/><path d="M${f1(a[0])},${f1(a[1])} L${f1(c[0])},${f1(c[1])} L${f1(d[0])},${f1(d[1])}Z" fill="${col(l2)}" stroke="${col(l2)}" stroke-width=".6"/>`;
		}
		return `<g>${s}<g opacity=".5">${''}</g></g>`;
	};
	K.kraftSheet = kraftSheet;

	const pouch = () => {
		const p = id('pc'), w = 360, h = 500;
		let s = `<defs>${lg(p, [[0, '#a97f52'], [.15, '#d1aa7a'], [.4, '#dcb688'], [.7, '#c49a6c'], [1, '#97704a']], 1, 0)}</defs>`;
		const body = `M${-w / 2},${-h} L${w / 2},${-h} L${w / 2 + 4},${-70} Q${w / 2 + 8},${-6} ${w / 2 - 34},0 L${-w / 2 + 34},0 Q${-w / 2 - 8},${-6} ${-w / 2 - 4},${-70}Z`;
		s += shadowE(0, 2, w * .55, 22);
		s += `<path d="${body}" fill="url(#${p})"/><path d="${body}" filter="url(#kPaper)" opacity=".8"/>`;
		let zz = ''; for (let i = 0; i <= 36; i++) zz += `L${f1(-w / 2 + i * w / 36)},${-h + (i % 2 ? -6 : 0)} `;
		s += `<path d="M${-w / 2},${-h + 44} ${zz.replace(/^L/, 'L')} L${w / 2},${-h + 44}Z" fill="#c49a6c" opacity=".6"/><path d="M${-w / 2},${-h + 44} L${w / 2},${-h + 44}" stroke="#8a6440" stroke-width="2" opacity=".5"/><path d="M${-w / 2},${-h + 62} L${w / 2},${-h + 62} M${-w / 2},${-h + 67} L${w / 2},${-h + 67}" stroke="#8a6440" stroke-width="1.6" opacity=".45"/>`;
		s += `<path d="M${-w / 2 + 40},${-h + 74} C${-w / 2 + 30},${-h * .5} ${-w / 2 + 50},${-h * .3} ${-w / 2 + 34},${-30}" stroke="#fff" stroke-width="6" opacity=".18" fill="none"/><path d="M${-w / 2 + 34},${-38} Q0,${-60} ${w / 2 - 34},${-38}" stroke="#7a5a3a" stroke-width="2" opacity=".4" fill="none"/>`;
		const g = kilimBand(36, 9, 1);
		s += `<g transform="translate(${-w / 2} ${-h + 100})">${g.svg(10)}<rect width="${w}" height="90" fill="url(#kWeft)"/></g>`;
		s += `<rect x="${-w / 2 + 36}" y="${-h + 208}" width="${w - 72}" height="230" rx="6" fill="${P.wool}"/><rect x="${-w / 2 + 36}" y="${-h + 208}" width="${w - 72}" height="230" rx="6" filter="url(#kPaper)" opacity=".3"/>`;
		s += `${wordmark(0, -h + 246, 15, P.char)}${markDiamond(0, -h + 270, 7, P.olive)}<text x="0" y="${-h + 330}" ${FA} font-size="40" font-weight="800" fill="${P.char}" text-anchor="middle">آویشن کوهی</text><text x="0" y="${-h + 364}" ${FA} font-size="16" font-weight="600" fill="${P.olive}" text-anchor="middle">خودرو · دامنه‌های دنا</text><path d="M-40,${-h + 388} L40,${-h + 388}" stroke="${P.char}" stroke-opacity=".3"/><text x="0" y="${-h + 418}" ${FA} font-size="16" font-weight="700" fill="${P.char}" fill-opacity=".7" text-anchor="middle">۵۰ گرم</text>`;
		s += `<path d="${body}" fill="url(#${p}s)"/><defs>${lg(p + 's', [[0, '#2a1e12', .25], [.12, '#2a1e12', 0], [.88, '#2a1e12', 0], [1, '#2a1e12', .3]], 1, 0)}</defs>`;
		return s;
	};

	/* gabbeh rug grid */
	const gabbeh = (cw, ch, seed = 5) => {
		const r = rng(seed), g = new Grid(cw, ch, P.madder);
		const ab = ['#8e2b22', '#97321f', '#a33a24', '#8a2a20', '#9c3522', '#b5532f', '#a9452a'];
		let ci = 0;
		for (let y = 0; y < ch; y++) { if (r() < .12) ci = Math.floor(r() * ab.length); for (let x = 0; x < cw; x++) g.set(x, y, r() < .04 ? ab[(ci + 1) % ab.length] : ab[ci]); }
		g.rect(0, 0, cw, 3, P.indigo); g.rect(0, ch - 3, cw, 3, P.indigo); g.rect(0, 0, 3, ch, P.indigo); g.rect(cw - 3, 0, 3, ch, P.indigo);
		for (let x = 3; x < cw - 3; x++) { g.set(x, 3, P.saffron); g.set(x, ch - 4, P.saffron); }
		for (let y = 3; y < ch - 3; y++) { g.set(3, y, P.saffron); g.set(cw - 4, y, P.saffron); }
		for (let x = 5; x < cw - 5; x += 4) { g.set(x, 5, P.wool); g.set(x + 1, 5, P.wool); g.set(x, 6, P.wool); g.set(x, ch - 6, P.wool); g.set(x + 1, ch - 6, P.wool); g.set(x, ch - 7, P.wool); }
		const lx = Math.floor(cw / 2) - 16, ly = Math.floor(ch / 2) - 12;
		const L = (x, y, w, h, c) => g.rect(lx + x, ly + y, w, h, c);
		L(11, 7, 18, 9, P.saffron); L(10, 8, 1, 7, P.saffron);
		L(3, 2, 9, 12, '#5a1a14'); L(4, 1, 7, 1, '#5a1a14'); L(4, 14, 7, 1, '#5a1a14'); L(2, 4, 1, 8, '#5a1a14');
		L(1, 5, 7, 7, P.saffron); L(0, 7, 1, 4, P.saffron); L(8, 1, 2, 2, P.saffron);
		g.set(lx + 4, ly + 7, P.indigo); g.set(lx + 0, ly + 9, P.indigo); L(1, 11, 3, 1, P.indigo); g.set(lx + 2, ly + 12, P.wool); g.set(lx + 3, ly + 12, P.wool);
		[[12, 16], [15, 16], [24, 16], [27, 16]].forEach(([x, y]) => { L(x, y, 2, 6, P.saffron); L(x - 1, y + 6, 3, 1, P.saffron); });
		L(29, 9, 3, 1, P.saffron); L(31, 4, 1, 6, P.saffron); L(29, 3, 3, 1, P.saffron); L(28, 1, 2, 3, '#5a1a14');
		g.diamond(lx + 20, ly + 11, 3, [P.indigo, P.wool, P.terra, P.wool]);
		const dots = [[8, 10], [cw - 10, 12], [9, ch - 12], [cw - 11, ch - 14], [Math.floor(cw / 2), 12], [Math.floor(cw / 2) - 3, ch - 12], [14, Math.floor(ch / 2) + 18], [cw - 15, Math.floor(ch / 2) - 18]];
		dots.forEach(([x, y], i) => g.diamond(x, y, 2, i % 2 ? [P.wool, P.saffron, P.wool] : [P.indigo, P.wool, P.indigo]));
		for (let i = 0; i < 4; i++) { const gx = 10 + i * Math.floor((cw - 20) / 3), gy = ch - 20 + (i % 2) * 3; g.rect(gx, gy, 4, 2, P.wool); g.set(gx, gy + 2, P.wool); g.set(gx + 3, gy + 2, P.wool); g.set(gx - 1, gy - 1, P.wool); g.set(gx + 4, gy - 1, P.wool); }
		return g;
	};
	K.gabbeh = gabbeh;
	const rugTop = (x, y, w, h, cell, rot, seed) => {
		const g = gabbeh(Math.round(w / cell), Math.round(h / cell), seed);
		let fr = '';
		const rr = rng(seed + 3);
		for (let i = 4; i < w - 2; i += 7) { [[-1, 0], [1, h]].forEach(([sgn, yy]) => { const L = 34 + rr() * 10; fr += `<path d="M${i},${yy} q${f1((rr() - .5) * 6)},${f1(sgn * L * .5)} ${f1((rr() - .5) * 8)},${f1(sgn * L)}" stroke="${rr() > .5 ? '#efe6d4' : '#e2d6bf'}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`; }); }
		for (let i = 2; i < w; i += 21) fr += `<rect x="${i}" y="-8" width="16" height="8" rx="3" fill="#e2d6bf"/><rect x="${i}" y="${h}" width="16" height="8" rx="3" fill="#e2d6bf"/>`;
		return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="14" y="20" width="${w}" height="${h}" fill="#2a1e12" opacity=".3" filter="url(#kb16)"/><rect x="0" y="6" width="${w}" height="${h}" fill="#4a1810"/>${fr}${g.svg(cell)}<rect width="${w}" height="${h}" filter="url(#kPile)" opacity=".7"/><rect width="${w}" height="${h}" filter="url(#kWool)" opacity=".5"/><rect width="${w}" height="${h}" fill="url(#kRugL)"/></g>`;
	};
	K.rugTop = rugTop;

	/* knitted sock (hanging, cuff at top). local origin = cuff top-left */
	const sock = (seed, flip) => {
		const p = id('sk'), cell = 10, cw = 32, ch = 46;
		const path = `M0,0 L160,0 L162,300 C164,330 190,340 240,344 C300,350 320,380 318,404 C316,432 296,454 250,456 L70,458 C20,460 -2,430 -2,390Z`;
		const g = new Grid(cw, ch, P.wool);
		for (let x = 0; x < cw; x++) for (let y = 0; y < 5; y++) g.set(x, y, x % 2 ? '#e6dccb' : P.wool);
		g.rect(0, 6, cw, 1, P.indigo); g.zig(7, 4, P.indigo, P.wool); g.rect(0, 11, cw, 1, P.indigo);
		for (let cx = 2; cx < cw; cx += 6) g.diamond(cx, 16, 3, [P.madder, P.wool, P.saffron, P.madder]);
		g.rect(0, 21, cw, 1, P.madder); g.zig(22, 3, P.saffron, P.wool); g.rect(0, 25, cw, 1, P.madder);
		for (let x = 1; x < cw; x += 4) for (let y = 28; y < 40; y += 4) g.set(x + (y / 4 % 2) * 2, y, P.indigo);
		for (let y = 36; y < ch; y++) for (let x = 0; x < 10; x++) g.set(x, y, P.madder);
		for (let y = 31; y < ch; y++) for (let x = 25; x < cw; x++) g.set(x, y, P.madder);
		let s = `<defs><clipPath id="${p}"><path d="${path}"/></clipPath>${lg(p + 'v', [[0, '#2a1e12', .3], [.18, '#2a1e12', 0], [.75, '#2a1e12', 0], [1, '#2a1e12', .3]], 1, 0)}</defs>`;
		s += `<g transform="${flip ? 'translate(320 0) scale(-1 1)' : ''}"><path d="${path}" fill="#2a1e12" opacity=".25" transform="translate(10 14)" filter="url(#kb8)"/><g clip-path="url(#${p})">${g.svg(cell)}<rect width="330" height="470" fill="url(#kKnit)"/><rect width="330" height="470" filter="url(#kWool)" opacity=".55"/><rect width="330" height="470" fill="url(#${p}v)"/></g><path d="${path}" fill="none" stroke="#2a1e12" stroke-opacity=".15" stroke-width="2"/></g>`;
		return s;
	};
	K.sock = sock;
	const woolBall = (x, y, r, c, seed) => { const rr = rng(seed), p = id('wb'); let s = `<defs>${rg(p, [[0, '#fff', .35], [.5, '#fff', 0], [1, '#000', .35]], .5, .5, .55, .35, .3)}<clipPath id="${p}c"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs>${shadowE(x, y + r * .95, r * .9, r * .18)}<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><g clip-path="url(#${p}c)">`; for (let i = 0; i < 22; i++) { const a = rr() * Math.PI, o = (rr() - .5) * r * 1.6; s += `<ellipse cx="${f1(x + Math.cos(a + 1.57) * o)}" cy="${f1(y + Math.sin(a + 1.57) * o)}" rx="${f1(r * 1.1)}" ry="${f1(r * (.15 + rr() * .35))}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2.4" transform="rotate(${f1(a * 57.3)} ${x} ${y})"/><ellipse cx="${f1(x + Math.cos(a + 1.57) * o)}" cy="${f1(y + Math.sin(a + 1.57) * o - 1.5)}" rx="${f1(r * 1.1)}" ry="${f1(r * (.15 + rr() * .35))}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.4" transform="rotate(${f1(a * 57.3)} ${x} ${y})"/>`; } return s + `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" filter="url(#kWool)" opacity=".6"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p})"/>`; };
	K.woolBall = woolBall;

	const ARCH = [P.indigo, P.terra, P.saffron, P.olive, null, P.madder];
	scenes['nomad-product'] = (_, v) => {
		const W = 1000, H = 1000, k = (v - 1) % 6;
		let s = '', hz = 700;
		const extraDefs = `<defs>${lg('kRugL', [[0, '#fff', .12], [.5, '#fff', 0], [1, '#000', .14]], 1, 1)}</defs>${kashkDefs()}`;
		if (!ALT) {
			if (k === 4) { // gabbeh top-down
				s += `<rect width="${W}" height="${H}" fill="#ece4d6"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".5"/><path d="M0,0 L520,0 L240,${H} L0,${H}Z" fill="#fff" opacity=".18" filter="url(#kb30)"/>`;
				s += rugTop(230, 130, 540, 740, 10, -3, 5);
				return svg(W, H, extraDefs + s, post());
			}
			s += stage(W, H, hz, ARCH[k], { aw: 520, at: 120 });
			if (k === 0) s += `<g transform="translate(500 880)">${ghee(false)}</g>`;
			if (k === 1) {
				const heap = { back: '', front: '' };
				const balls = [[-150, -268, 46], [-60, -282, 48], [40, -284, 47], [130, -270, 45], [-110, -312, 46], [-10, -326, 48], [90, -314, 46], [-60, -352, 44], [40, -356, 45], [-180, -238, 40], [170, -240, 41], [-100, -240, 44], [0, -246, 46], [100, -242, 44]];
				balls.sort((a, b) => a[1] - b[1]).forEach(([x, y, r], i) => { heap.back += kashkBall(500 + x, 860 + y, r, i + 3); });
				s += clothFlat(170, 905, 700, 260, 0, -.3, .36);
				s += bowl(500, 860, 260, heap);
				s += kashkBall(330, 900, 40, 31) + kashkBall(640, 915, 38, 32) + kashkBall(720, 890, 36, 33);
				s += tag(800, 740, 10, 'کشک محلی', 'دست‌ساز عشایری');
			}
			if (k === 2) {
				s += kraftSheet(500, 860, 760, 360, 4);
				const st = [[500, 800], [505, 772], [497, 744], [503, 716], [499, 688]];
				st.forEach(([x, y], i) => { s += disc(x, y, 96, 26, .36, i + 1); });
				s += disc(320, 880, 86, 24, .36, 11) + disc(680, 900, 90, 24, .36, 12, true) + disc(740, 860, 80, 24, .36, 13);
				s += tag(250, 760, -8, 'قره‌قروت', 'کشک سیاه عشایری');
			}
			if (k === 3) {
				s += `<g transform="translate(500 900)">${pouch()}</g>`;
				s += `<g transform="translate(140 930)">${window.SHAHD.thyme(0, 0, 260, -20, 3, 1.15)}</g><g transform="translate(880 940)">${window.SHAHD.thyme(0, 0, 220, -160, 5, 1.1)}</g>`;
			}
			if (k === 5) {
				s += `<rect x="150" y="196" width="700" height="22" rx="11" fill="#8a5a2b"/><rect x="150" y="196" width="700" height="7" rx="3.5" fill="#c49a6c"/><rect x="138" y="190" width="22" height="34" rx="6" fill="#6a4220"/><rect x="840" y="190" width="22" height="34" rx="6" fill="#6a4220"/>`;
				s += `<path d="M300,206 L300,250 M630,206 L630,236" stroke="#a37b4a" stroke-width="4"/>`;
				s += `<g transform="translate(212 248) rotate(2)">${sock(1, false)}</g><g transform="translate(470 232) rotate(-3)">${sock(2, false)}</g>`;
				s += tag(330, 310, -6, 'جوراب پشمی', 'دستباف · پشم طبیعی');
			}
		} else {
			hz = 470;
			if (k === 4) { // gabbeh corner close-up + fold
				s += `<rect width="${W}" height="${H}" fill="#e9e1d3"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".5"/>`;
				s += rugTop(110, 120, 1100, 1100, 22, 0, 9);
				s += `<path d="M110,640 L110,1000 L470,1000Z" fill="#e9e1d3"/><path d="M110,640 L470,1000 L470,1000 L110,1000Z" fill="none"/>`;
				const g = new Grid(17, 17, '#d9c7a8'); for (let y = 0; y < 17; y++) for (let x = 0; x < 17; x++) if ((x + y) % 2) g.set(x, y, '#cdb895');
				s += `<g><path d="M110,640 L470,1000 L110,1000Z" fill="#2a1e12" opacity=".3" filter="url(#kb8)" transform="translate(16 -10)"/><clipPath id="kFoldC"><path d="M110,640 L470,1000 L110,1000Z"/></clipPath><g clip-path="url(#kFoldC)">${g.svg(22, 100, 620)}<rect x="100" y="620" width="400" height="400" filter="url(#kWool)" opacity=".5"/></g><path d="M110,640 L470,1000" stroke="#fff" stroke-width="3" opacity=".5"/></g>`;
				return svg(W, H, extraDefs + s, post());
			}
			if (k === 3) { // thyme flat lay on kraft
				s += `<rect width="${W}" height="${H}" fill="#c49a6c"/><rect width="${W}" height="${H}" filter="url(#kPaper)" opacity=".9"/><path d="M0,0 L600,0 L300,${H} L0,${H}Z" fill="#fff" opacity=".12" filter="url(#kb30)"/>`;
				for (let i = 0; i < 7; i++) s += `<g transform="translate(${120 + i * 40} ${880 - i * 20})">${window.SHAHD.thyme(0, 0, 420 + (i % 3) * 40, -38 - i * 3, i + 2, 1.2)}</g>`;
				const p = id('tb');
				s += `<defs>${rg(p, [[0, '#f6f1e6'], [.85, '#e2d8c4'], [1, '#c9bca2']])}</defs><circle cx="700" cy="380" r="210" fill="#2a1e12" opacity=".25" filter="url(#kb16)" transform="translate(16 20)"/><circle cx="700" cy="380" r="210" fill="url(#${p})"/><circle cx="700" cy="380" r="210" fill="none" stroke="${P.indigo}" stroke-width="10"/><circle cx="700" cy="380" r="170" fill="#7d7d48"/>`;
				const rr = rng(8); for (let i = 0; i < 900; i++) { const a = rr() * Math.PI * 2, d = Math.sqrt(rr()) * 168; s += `<ellipse cx="${f1(700 + Math.cos(a) * d)}" cy="${f1(380 + Math.sin(a) * d)}" rx="${f1(2 + rr() * 3)}" ry="${f1(1.4 + rr() * 1.4)}" fill="${['#6f7a45', '#8a9356', '#5c6436', '#a3a46a', '#7a6a3a'][Math.floor(rr() * 5)]}" transform="rotate(${f1(rr() * 180)} ${f1(700 + Math.cos(a) * d)} ${f1(380 + Math.sin(a) * d)})"/>`; }
				s += tag(820, 760, 12, 'آویشن کوهی', 'خشک‌شده در سایه');
				return svg(W, H, extraDefs + s, post());
			}
			if (k === 2) { // qara-qurut on slate
				s += `<rect width="${W}" height="${H}" fill="#2b2926"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".8"/><rect width="${W}" height="${H}" filter="url(#kSpeck)" opacity=".25"/><path d="M0,0 L700,0 L300,${H} L0,${H}Z" fill="#fff" opacity=".06" filter="url(#kb30)"/>`;
				s += disc(380, 420, 200, 46, .55, 21) + disc(640, 640, 190, 46, .55, 22, true) + disc(300, 760, 150, 40, .55, 23) + disc(760, 300, 140, 40, .55, 24);
				const rr = rng(5); for (let i = 0; i < 40; i++) s += `<circle cx="${f1(560 + rr() * 200)}" cy="${f1(760 + rr() * 140)}" r="${f1(2 + rr() * 5)}" fill="#4a2e1e"/>`;
				return svg(W, H, extraDefs + s, `${grainFx(.3, .8, 'overlay')}${vignette(.35, '0,0,0')}`);
			}
			s += stage(W, H, hz, ARCH[k], { aw: 520, at: 60 });
			if (k === 0) {
				s += clothFlat(80, 960, 520, 240, 0, -.2, .45);
				s += `<g transform="translate(560 860)">${ghee(true)}</g>`;
				s += `<g transform="translate(600 610) rotate(-38)"><ellipse cx="0" cy="0" rx="58" ry="36" fill="#b98a52"/><ellipse cx="-4" cy="-6" rx="46" ry="24" fill="#f2d880"/><ellipse cx="-4" cy="-6" rx="46" ry="24" filter="url(#kSpeck)" opacity=".6"/><rect x="50" y="-12" width="330" height="24" rx="12" fill="#b98a52"/><rect x="50" y="-12" width="330" height="8" rx="4" fill="#dcb07a"/></g>`;
				s += `<path d="M680,930 C740,900 860,900 940,930 C960,960 900,990 800,990 C720,990 660,960 680,930Z" fill="#f0dcb4"/><path d="M700,940 C760,920 860,920 920,940" stroke="#d9b98a" stroke-width="3" fill="none"/>${[[740, 950], [820, 960], [880, 945], [780, 975]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#b98a52" opacity=".6"/>`).join('')}`;
			}
			if (k === 1) {
				s += clothFlat(40, 1000, 1000, 520, 1, -.25, .6, 14);
				const bl = [[260, 640, 110], [500, 600, 120], [740, 650, 108], [380, 800, 118], [640, 820, 120], [860, 840, 100], [150, 860, 100]];
				bl.forEach(([x, y, r], i) => { s += shadowE(x, y + r * .85, r * .9, r * .2) + kashkBall(x, y, r, i + 41); });
				s += `<g><path d="M520,930 A110,100 0 0 1 740,930Z" fill="url(#kKa)"/><path d="M520,930 L740,930 Q630,960 520,930Z" fill="#f6f0e2"/><path d="M520,930 L740,930" stroke="#d9cfb8" stroke-width="3"/>${Array.from({ length: 30 }, (_, i) => { const r2 = rng(i + 7); return `<circle cx="${f1(540 + r2() * 180)}" cy="${f1(934 + r2() * 14)}" r="${f1(1.5 + r2() * 2.5)}" fill="#cfc2a4"/>`; }).join('')}</g>`;
				s += tag(860, 520, 8, 'کشک محلی', 'دست‌ساز عشایری');
			}
			if (k === 5) {
				s = `<rect width="${W}" height="${H}" fill="#ece4d6"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".3"/><path d="M160,1000 L160,330 A340,340 0 0 1 840,330 L840,1000Z" fill="${P.madder}"/><path d="M160,1000 L160,330 A340,340 0 0 1 840,330 L840,1000Z" filter="url(#kPlaster)" opacity=".3"/><path d="M0,0 L560,0 L260,${H} L0,${H}Z" fill="#fff" opacity=".14" filter="url(#kb30)"/>`;
				s += `<g transform="translate(250 150) rotate(-14)">${sock(3, false)}</g><g transform="translate(430 250) rotate(8)">${sock(4, false)}</g>`;
				s += woolBall(780, 760, 120, P.indigo, 5) + woolBall(600, 880, 80, P.saffron, 6) + woolBall(880, 560, 70, P.wool2, 7);
				s += `<path d="M560,560 L960,940" stroke="#2a1e12" stroke-opacity=".25" stroke-width="10" stroke-linecap="round" filter="url(#kb4)" transform="translate(8 10)"/><path d="M560,560 L960,940" stroke="#c49a6c" stroke-width="9" stroke-linecap="round"/><path d="M620,520 L980,880" stroke="#b98a52" stroke-width="9" stroke-linecap="round"/><circle cx="960" cy="940" r="10" fill="#6a4220"/><circle cx="980" cy="880" r="10" fill="#6a4220"/>`;
				s += tag(200, 860, -8, 'جوراب پشمی', 'دستباف · پشم طبیعی');
			}
		}
		return svg(W, H, extraDefs + s, post());
	};
})();

/* ---------- KOOCH hero, pattern, weaving, journal ---------- */
(() => {
	const K = window.KOOCH, { P, FA, lg, rg, f1, id, kdefs, Grid, kilimBand, stage, shadowE, markDiamond, wordmark, tag, woolBall, clothFlat } = K;
	const SH = window.SHAHD;
	const svg = (W, H, inner, post = '') => `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${kdefs()}${inner}</svg>${post}`;
	const strata = (pts, H, n, c, op, gap = 14) => { let s = ''; for (let i = 1; i <= n; i++) s += `<path d="M${pts.map(q => `${f1(q[0])},${f1(q[1] + i * gap)}`).join(' L')}" stroke="${c}" stroke-width="1.6" fill="none" opacity="${op * (1 - i / (n + 1))}"/>`; return s; };

	/* black goat-hair tent (front view), base centre (x,y), width w */
	const tent = (x, y, w, h, glow = .9, o = {}) => {
		const p = id('tn'), n = o.poles || Math.max(3, Math.round(w / 70));
		const x0 = x - w / 2, x1 = x + w / 2, ty = y - h;
		let roof = `M${x0 - w * .05},${y} L${x0},${ty + h * .42}`;
		for (let i = 0; i < n; i++) { const a = x0 + i * w / n, b = x0 + (i + 1) * w / n, m = (a + b) / 2; roof += ` L${f1(a + w / n * .12)},${f1(ty + (i === 0 ? h * .08 : 0))} Q${f1(m)},${f1(ty + h * .2)} ${f1(b - w / n * .12)},${f1(ty + (i === n - 1 ? h * .08 : 0))}`; }
		roof += ` L${x1},${ty + h * .42} L${x1 + w * .05},${y}Z`;
		let s = `<defs>${lg(p, [[0, '#302a26'], [1, '#16130f']])}<pattern id="${p}s" width="60" height="${f1(h / 6)}" patternUnits="userSpaceOnUse"><rect y="${f1(h / 6 - 2)}" width="60" height="2" fill="#fff" opacity=".07"/></pattern></defs>`;
		s += `<path d="M${x0 - w * .1},${y + 2} L${x1 + w * .5},${y + h * .22} L${x1 + w * .05},${y + 2}Z" fill="#000" opacity=".25" filter="url(#kb4)"/>`;
		s += `<path d="${roof}" fill="url(#${p})"/><path d="${roof}" fill="url(#${p}s)"/>`;
		for (let i = 1; i < n; i++) { const px = x0 + i * w / n; s += `<path d="M${f1(px)},${f1(ty + h * .02)} L${f1(px)},${f1(ty + h * .1)}" stroke="#5a4a3a" stroke-width="3"/>`; }
		// reed screen (chigh) skirt with woven pattern
		const sh = h * .34, cw = Math.max(3, h / 26), g = kilimBand(Math.round(w * .9 / cw), Math.max(6, Math.round(sh / cw)), 2, 7);
		s += `<g transform="translate(${f1(x0 + w * .05)} ${f1(y - sh)})" opacity=".92">${g.svg(cw)}${Array.from({ length: Math.round(w * .9 / 6) }, (_, i) => `<rect x="${i * 6}" y="0" width="1.2" height="${f1(sh)}" fill="#3a2a1a" opacity=".18"/>`).join('')}</g>`;
		const dw = w * .2, dx = x - dw / 2 + (o.door || 0);
		s += `<path d="M${f1(dx)},${y} L${f1(dx)},${f1(y - h * .66)} Q${f1(dx + dw / 2)},${f1(y - h * .74)} ${f1(dx + dw)},${f1(y - h * .66)} L${f1(dx + dw)},${y}Z" fill="${P.saffron}" opacity="${glow}"/><path d="M${f1(dx)},${y} L${f1(dx)},${f1(y - h * .66)} Q${f1(dx + dw / 2)},${f1(y - h * .74)} ${f1(dx + dw)},${f1(y - h * .66)} L${f1(dx + dw)},${y}Z" fill="url(#${p}g)"/><defs>${lg(p + 'g', [[0, '#fff2c4', .55], [1, '#8e2b22', .45]])}</defs>`;
		s += `<path d="M${f1(dx + dw * .2)},${y} L${f1(dx + dw * .3)},${f1(y - h * .3)} L${f1(dx + dw * .7)},${f1(y - h * .3)} L${f1(dx + dw * .8)},${y}Z" fill="#2a1a12" opacity=".35"/>`;
		[[x0, -1], [x1, 1]].forEach(([ex, sg]) => { s += `<path d="M${ex},${f1(ty + h * .42)} L${f1(ex + sg * w * .14)},${y}" stroke="#4a3e34" stroke-width="2"/><path d="M${f1(x0 + w * .3)},${f1(ty + h * .1)} L${f1(x0 + w * .3 + sg * w * .02)},${f1(ty - h * .02)}" stroke="none"/>`; });
		return s;
	};
	K.tent = tent;
	const sheep = (x, y, s, c, head) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})"><ellipse cx="2" cy="1" rx="17" ry="4" fill="#000" opacity=".18"/><path d="M-9,-6 L-10,0 M-4,-6 L-4,0 M6,-6 L6,0 M11,-6 L12,0" stroke="#2a2420" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="15" ry="9" fill="${c}"/><ellipse cx="-3" cy="-16" rx="10" ry="4" fill="#fff" opacity=".22"/><ellipse cx="-16" cy="-15" rx="5.5" ry="4.2" fill="${head}" transform="rotate(-20 -16 -15)"/></g>`;
	K.sheep = sheep;
	const flock = (pts, n, seed, s0, s1) => { const r = rng(seed); let s = ''; const arr = []; for (let i = 0; i < n; i++) { const t = r(); const k = Math.floor(t * (pts.length - 1)); const u = t * (pts.length - 1) - k; const a = pts[k], b = pts[k + 1]; const x = a[0] + (b[0] - a[0]) * u + (r() - .5) * 110 * (a[2] || 1), y = a[1] + (b[1] - a[1]) * u + (r() - .5) * 46 * (a[2] || 1); arr.push([x, y, (a[2] || 1)]); } arr.sort((p, q) => p[1] - q[1]).forEach(([x, y, sc]) => { const goat = r() < .4; s += sheep(x, y, (s0 + (s1 - s0) * ((y - pts[0][1]) / (pts[pts.length - 1][1] - pts[0][1] || 1))) * (.9 + r() * .2), goat ? (r() < .5 ? '#2a2420' : '#5a3e2a') : (r() < .5 ? '#efe6d4' : '#e2d6bf'), goat ? '#2a2420' : '#3a302a'); }); return s; };
	K.flock = flock;

	scenes['nomad-hero'] = () => {
		const W = 2000, H = 1125;
		const L = [SH.ridge(31, W, 560, 240, 8, .5), SH.ridge(33, W, 640, 190, 8, .5), SH.ridge(37, W, 720, 150, 8, .48), SH.ridge(41, W, 790, 100, 7, .45)];
		const cols = ['#d9a07a', '#b5674a', '#8e3a2c', '#4a2a2e'];
		let s = `<defs>${lg('nhS', [[0, '#2e3a5c'], [.35, '#6a5470'], [.62, '#d98a5a'], [.82, '#f2c07e'], [1, '#f8dcaa']])}${rg('nhSun', [[0, '#fff3cf'], [.12, '#ffd98a', .9], [.4, '#e3a72f', .35], [1, '#e3a72f', 0]])}${lg('nhG', [[0, '#7a7440'], [.5, '#5c5a30'], [1, '#2e2c1c']])}${lg('nhP', [[0, '#d6b688'], [1, '#b8946a']])}</defs>`;
		s += `<rect width="${W}" height="${H}" fill="url(#nhS)"/>`;
		const rr = rng(3); for (let i = 0; i < 60; i++) s += `<circle cx="${f1(rr() * W)}" cy="${f1(rr() * 260)}" r="${f1(.8 + rr() * 1.6)}" fill="#fff" opacity="${f1(.2 + rr() * .5)}"/>`;
		s += `<circle cx="1320" cy="470" r="600" fill="url(#nhSun)"/><circle cx="1320" cy="470" r="100" fill="#ffe7b0"/><circle cx="1320" cy="470" r="100" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
		[[300, 240, 340], [900, 300, 260], [1600, 210, 300]].forEach(([x, y, w]) => { s += `<rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="#f6c890" opacity=".55"/><rect x="${x + 60}" y="${y + 18}" width="${w * .6}" height="7" rx="3.5" fill="#f6c890" opacity=".4"/>`; });
		L.forEach((pts, i) => { s += `<path d="${SH.ridgePath(pts, H)}" fill="${cols[i]}"/>${strata(pts, H, 5 + i, i < 2 ? '#fff' : '#000', i < 2 ? .14 : .16, 16 + i * 4)}<path d="M${pts.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')}" stroke="#ffd9a0" stroke-width="${3 - i * .5}" fill="none" opacity="${.7 - i * .15}"/>`; if (i < 2) s += `<rect y="${pts.reduce((m, q) => Math.min(m, q[1]), 1e9)}" width="${W}" height="400" fill="url(#nhHaze${i})"/><defs>${lg('nhHaze' + i, [[0, '#f8dcaa', 0], [1, '#f8dcaa', .45]])}</defs>`; });
		const ground = `M0,860 C400,830 800,840 1200,820 C1500,806 1800,830 2000,840 L2000,${H} L0,${H}Z`;
		s += `<path d="${ground}" fill="url(#nhG)"/><path d="M0,860 C400,830 800,840 1200,820 C1500,806 1800,830 2000,840" stroke="#e3c27a" stroke-width="3" fill="none" opacity=".7"/>`;
		s += `<path d="M420,${H} C520,1060 680,1000 860,960 C1020,926 1140,906 1260,884 C1340,870 1400,862 1460,858 L1480,866 C1410,874 1350,884 1280,900 C1150,928 1030,958 900,1000 C760,1046 640,1100 620,${H}Z" fill="url(#nhP)" opacity=".85"/>`;
		s += tent(1660, 880, 420, 150, .9) + tent(1320, 862, 280, 100, .8, { poles: 3 }) + tent(1910, 890, 260, 96, .7, { poles: 3 });
		s += `<path d="M1700,720 C1690,670 1730,640 1715,580 C1705,540 1740,510 1730,470" stroke="#fff" stroke-width="16" fill="none" opacity=".12" filter="url(#kb8)" stroke-linecap="round"/>`;
		s += flock([[1440, 866, .7], [1280, 892, .85], [1100, 930, 1], [920, 980, 1.2], [760, 1040, 1.4]], 80, 7, 1.1, 2.6);
		s += `<g transform="translate(640 1100) scale(1.5)"><path d="M-14,0 L-10,-70 Q0,-84 10,-70 L14,0Z" fill="#2a2420"/><circle cx="0" cy="-84" r="11" fill="#2a2420"/><path d="M-12,-90 Q0,-104 12,-90Z" fill="${P.madder}"/><path d="M20,-100 L34,6" stroke="#4a3a2a" stroke-width="4" stroke-linecap="round"/></g>`;
		for (let i = 0; i < 140; i++) { const r2 = rng(i + 300), x = r2() * W, h2 = 30 + r2() * 90; s += `<path d="M${f1(x)},${H + 4} q${f1((r2() - .5) * 30)},${f1(-h2 * .6)} ${f1((r2() - .5) * 50)},${f1(-h2)}" stroke="${r2() > .5 ? '#3a3820' : '#5c5a30'}" stroke-width="${f1(2 + r2() * 4)}" fill="none" stroke-linecap="round"/>`; }
		return svg(W, H, s, `${grainFx(.3, .75)}${vignette(.25, '30,20,20')}`);
	};

	scenes['nomad-pattern'] = () => {
		const W = 2400, H = 600, cell = 10;
		const g = kilimBand(W / cell, H / cell, 0, 3);
		const r = rng(5);
		let ab = ''; for (let y = 0; y < H; y += cell * 2) if (r() < .3) ab += `<rect y="${y}" width="${W}" height="${cell * (1 + Math.floor(r() * 3))}" fill="${r() < .5 ? '#000' : '#fff'}" opacity=".05"/>`;
		return svg(W, H, `${g.svg(cell)}${ab}<rect width="${W}" height="${H}" fill="url(#kWeft)"/><rect width="${W}" height="${H}" filter="url(#kWool)" opacity=".55"/>`, grainFx(.25, .8));
	};

	scenes['nomad-weaving'] = () => {
		const W = 1600, H = 1200;
		let s = stage(W, H, 1000, null);
		const x0 = 360, x1 = 1240, top = 120, bot = 980, fell = 560;
		s += `<defs>${lg('nwW', [[0, '#7a4b20'], [.25, '#c9935a'], [.5, '#e0b47c'], [1, '#8a5a2b']], 1, 0)}${lg('nwH', [[0, '#e0b47c'], [.5, '#c9935a'], [1, '#7a4b20']])}</defs>`;
		s += `<rect x="${x0 - 60}" y="40" width="40" height="${bot + 90}" fill="#2a1e12" opacity=".25" filter="url(#kb16)" transform="translate(30 0)"/><rect x="${x1 + 20}" y="40" width="40" height="${bot + 90}" fill="#2a1e12" opacity=".25" filter="url(#kb16)" transform="translate(30 0)"/>`;
		for (let x = x0 + 4; x < x1; x += 9) s += `<path d="M${x},${top + 40} L${x},${fell}" stroke="#efe6d4" stroke-width="3"/><path d="M${x + 1},${top + 40} L${x + 1},${fell}" stroke="#b9ab92" stroke-width="1" opacity=".6"/>`;
		const cw = Math.round((x1 - x0) / 8), ch = Math.round((bot - fell) / 8);
		const g = kilimBand(cw, ch, 1, 4);
		s += `<g transform="translate(${x0} ${fell})">${g.svg(8)}<rect width="${x1 - x0}" height="${bot - fell}" fill="url(#kWeft)"/><rect width="${x1 - x0}" height="${bot - fell}" filter="url(#kWool)" opacity=".6"/></g>`;
		s += `<rect x="${x0}" y="${fell}" width="${x1 - x0}" height="18" fill="#000" opacity=".12" filter="url(#kb4)"/>`;
		s += `<path d="M${x0 + 300},${fell - 2} C${x0 + 420},${fell - 30} ${x0 + 520},${fell - 10} ${x0 + 600},${fell - 4}" stroke="${P.madder}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
		[[x0 + 600, P.madder], [x0 + 680, P.saffron], [x0 + 760, P.indigo], [x0 + 200, P.wool]].forEach(([x, c], i) => { s += `<path d="M${x},${fell} C${x + 6},${fell + 40} ${x - 6},${fell + 70} ${x},${fell + 110 + i * 10}" stroke="${c}" stroke-width="5" fill="none"/><ellipse cx="${x}" cy="${fell + 124 + i * 10}" rx="14" ry="24" fill="${c}"/><ellipse cx="${x - 4}" cy="${fell + 116 + i * 10}" rx="5" ry="10" fill="#fff" opacity=".25"/>`; });
		s += `<rect x="${x0 - 30}" y="${fell - 150}" width="${x1 - x0 + 60}" height="16" rx="8" fill="url(#nwH)"/>`;
		for (let x = x0 + 8; x < x1; x += 18) s += `<path d="M${x},${fell - 142} q4,24 0,44" stroke="#d9cdb6" stroke-width="2" fill="none"/>`;
		s += `<rect x="${x0 - 30}" y="${fell - 70}" width="${x1 - x0 + 60}" height="22" rx="4" fill="url(#nwH)"/>`;
		s += `<rect x="${x0 - 70}" y="40" width="44" height="${bot + 80}" rx="6" fill="url(#nwW)"/><rect x="${x1 + 26}" y="40" width="44" height="${bot + 80}" rx="6" fill="url(#nwW)"/>`;
		s += `<rect x="${x0 - 90}" y="${top}" width="${x1 - x0 + 180}" height="44" rx="10" fill="url(#nwH)"/><rect x="${x0 - 90}" y="${bot}" width="${x1 - x0 + 180}" height="50" rx="10" fill="url(#nwH)"/>`;
		s += `<rect x="${x0 - 90}" y="${top}" width="${x1 - x0 + 180}" height="44" rx="10" filter="url(#kPaper)" opacity=".4"/><rect x="${x0 - 70}" y="40" width="44" height="${bot + 80}" filter="url(#kPaper)" opacity=".35"/>`;
		// beater comb resting on fell
		s += `<g transform="translate(${x0 + 840} ${fell + 40}) rotate(-28)"><rect x="-10" y="-60" width="70" height="230" rx="16" fill="#2a1e12" opacity=".3" filter="url(#kb4)" transform="translate(10 10)"/><rect x="-10" y="-30" width="140" height="40" rx="8" fill="#8a5a2b"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-6 + i * 15}" y="-80" width="9" height="56" rx="4" fill="#b98a52"/>`).join('')}<rect x="40" y="10" width="40" height="150" rx="18" fill="#6a4220"/></g>`;
		// basket + wool balls
		s += `<g><ellipse cx="300" cy="1120" rx="240" ry="40" fill="#2a1e12" opacity=".25" filter="url(#kb16)"/><path d="M80,960 L520,960 L470,1120 Q300,1150 130,1120Z" fill="#b98a52"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${90 + i * 4},${980 + i * 18} L${510 - i * 4},${980 + i * 18}" stroke="#8a5a2b" stroke-width="3" opacity=".6"/>`).join('')}${Array.from({ length: 12 }, (_, i) => `<path d="M${110 + i * 34},962 L${140 + i * 28},1124" stroke="#d9b07a" stroke-width="3" opacity=".5"/>`).join('')}`;
		s += woolBall(190, 930, 70, P.madder, 1) + woolBall(320, 905, 80, P.indigo, 2) + woolBall(450, 935, 66, P.saffron, 3) + woolBall(260, 870, 60, '#6a4a32', 4) + `<path d="M80,960 L520,960" stroke="#8a5a2b" stroke-width="10"/></g>`;
		s += woolBall(1320, 1100, 70, P.wool2, 5) + woolBall(1460, 1080, 56, P.terra, 6) + woolBall(640, 1110, 50, P.olive, 7);
		s += `<path d="M1460,1080 C1400,1130 1300,1150 1180,1140" stroke="${P.terra}" stroke-width="4" fill="none"/>`;
		return svg(W, H, s, `${grainFx(.26, .8)}${vignette(.2, '60,40,20')}`);
	};

	/* ---- motif bitmaps for the chart ---- */
	const M = {
		tree: ['....A....', '...ABA...', '..A.B.A..', '.A..B..A.', 'AA.BBB.AA', '..ABBBA..', '.A..B..A.', 'AA..B..AA', '...BBB...', '..A.B.A..', '.AA.B.AA.', '....B....', '...BBB...', '..BBBBB..'],
		star: ['....A....', '...AAA...', 'A..ABA..A', 'AA.ABA.AA', 'AAAABAAAA', '.AABBBAA.', 'AABBCBBAA', '.AABBBAA.', 'AAAABAAAA', 'AA.ABA.AA', 'A..ABA..A', '...AAA...', '....A....'],
		mountain: ['.....................', 'A.....A.....A.....A..', 'AA...AAA...AAA...AAA.', 'AAA.AABAA.AABAA.AABAA', 'AAAAABBBAAABBBAAABBBA', 'BBBBBBBBBBBBBBBBBBBBB'],
		water: ['A...A...A...A...A', '.A.A.A.A.A.A.A.A.', '..A...A...A...A..', '.................', 'B...B...B...B...B', '.B.B.B.B.B.B.B.B.', '..B...B...B...B..'],
		eye: ['....AAAAA....', '..AA.....AA..', '.A...BBB...A.', 'A...BBCBB...A', '.A...BBB...A.', '..AA.....AA..', '....AAAAA....'],
		comb: ['AAAAAAAAAAA', 'AAAAAAAAAAA', 'A.A.A.A.A.A', 'A.A.A.A.A.A', 'A.A.A.A.A.A', 'A.A.A.A.A.A', 'A.A.A.A.A.A'],
		bird: ['..........AA.', '.........AABA', 'A.......AAAA.', 'AA....AAAAA..', '.AAAAAAAAA...', '..AAAAAAA....', '....A..A.....', '....A..A.....'],
	};
	const motifSvg = (key, cx, cy, cell, cols) => {
		if (key === 'toranj') { const g = new Grid(17, 17, null); g.diamond(8, 8, 8, [cols.A, cols.C, cols.B, cols.A, cols.C], false); return g.svg(cell, cx - 8.5 * cell, cy - 8.5 * cell); }
		const rows = M[key], w = rows[0].length, h = rows.length;
		const g = new Grid(w, h, null); g.bitmap(rows, 0, 0, cols);
		return g.svg(cell, cx - w * cell / 2, cy - h * cell / 2);
	};
	K.motifSvg = motifSvg;

	scenes['nomad-journal'] = (_, v) => {
		const W = 1600, H = 1000;
		switch ((v - 1) % 6) {
			case 0: { // migration route map
				let s = `<rect width="${W}" height="${H}" fill="#f1e9da"/><rect width="${W}" height="${H}" filter="url(#kPaper)" opacity=".3"/>`;
				s += `<path d="M0,1000 L0,620 C200,600 380,700 520,760 C640,812 700,900 760,1000Z" fill="${P.saffron}" opacity=".22"/><path d="M1600,0 L1600,420 C1400,440 1240,360 1140,260 C1060,180 1040,80 1050,0Z" fill="${P.olive}" opacity=".2"/>`;
				const r = rng(4);
				const mt = (x, y, sz, c) => `<path d="M${x - sz},${y} L${x - sz * .5},${y - sz * .5} L${x - sz * .3},${y - sz * .4} L${x},${y - sz} L${x + sz * .4},${y - sz * .55} L${x + sz * .6},${y - sz * .65} L${x + sz},${y}Z" fill="${c}"/><path d="M${x},${y - sz} L${x + sz * .4},${y - sz * .55} L${x + sz * .6},${y - sz * .65} L${x + sz},${y} L${x + sz * .1},${y}Z" fill="#000" opacity=".18"/>`;
				for (let i = 0; i < 30; i++) { const t = (i % 15) / 15, side = i < 15 ? -1 : 1, x = 330 + t * 1000 + side * 150 + (r() - .5) * 60, y = 760 - t * 560 + side * 150 + (r() - .5) * 50; s += mt(+f1(x), +f1(y), 28 + r() * 34, [P.terra, P.madder, '#a85a3e'][i % 3]); }
				s += `<path d="M200,980 C300,900 340,800 420,760 C500,720 560,640 640,600 M900,90 C960,200 1000,300 1100,360 C1200,420 1260,500 1380,560" stroke="${P.indigo}" stroke-width="4" fill="none" opacity=".5"/>`;
				const route = 'M220,860 C380,820 460,700 560,640 C680,568 760,540 860,470 C960,400 1040,330 1180,280 C1260,252 1330,220 1390,170';
				s += `<path d="${route}" stroke="${P.char}" stroke-width="5" fill="none" stroke-dasharray="14 12" stroke-linecap="round"/>`;
				s += `<path d="M1390,170 l-34,6 l18,26Z" fill="${P.char}"/>`;
				[[220, 860], [560, 640], [860, 470], [1180, 280], [1390, 170]].forEach(([x, y], i) => { s += `<g transform="translate(${x} ${y})"><circle r="26" fill="#f1e9da" stroke="${P.char}" stroke-width="3"/><path d="M-16,8 L-12,-6 L-4,-2 L0,-10 L4,-2 L12,-6 L16,8Z" fill="${P.char}"/></g>`; });
				s += `<text x="230" y="940" ${FA} font-size="44" font-weight="800" fill="${P.char}" text-anchor="middle">قشلاق</text><text x="230" y="978" ${FA} font-size="20" font-weight="600" fill="${P.madder}" text-anchor="middle">چراگاه زمستانی</text>`;
				s += `<text x="1390" y="104" ${FA} font-size="44" font-weight="800" fill="${P.char}" text-anchor="middle">ییلاق</text><text x="1390" y="136" ${FA} font-size="20" font-weight="600" fill="${P.olive}" text-anchor="middle">چراگاه تابستانی</text>`;
				s += `<g transform="translate(880 400) rotate(-34)"><text x="0" y="0" ${FA} font-size="26" font-weight="700" fill="${P.char}" text-anchor="middle">کوچ بهاره · اردیبهشت</text></g>`;
				s += `<g transform="translate(560 590) rotate(-32)"><text x="0" y="0" ${FA} font-size="22" font-weight="600" fill="${P.madder}" text-anchor="middle">۲۵ روز · ۳۰۰ کیلومتر</text></g>`;
				s += `<g transform="translate(1460 820)"><circle r="64" fill="none" stroke="${P.char}" stroke-width="2"/><path d="M0,-80 L12,0 L0,80 L-12,0Z" fill="${P.char}"/><path d="M0,-80 L12,0 L-12,0Z" fill="${P.terra}"/><text y="-92" ${FA} font-size="24" font-weight="800" fill="${P.char}" text-anchor="middle">ش</text></g>`;
				s += `<g transform="translate(150 140)">${markDiamond(0, 0, 18, P.madder)}${wordmark(0, 50, 16, P.char)}</g><text x="200" y="152" ${FA} font-size="44" font-weight="800" fill="${P.char}" text-anchor="end">مسیر کوچ</text>`;
				const kb = kilimBand(160, 4, 0); s += `<g transform="translate(0 ${H - 16})">${kb.svg(10)}</g>`;
				return svg(W, H, s, grainFx(.26, .8));
			}
			case 1: { // motif chart
				let s = `<rect width="${W}" height="${H}" fill="#f3ede2"/><rect width="${W}" height="${H}" filter="url(#kPaper)" opacity=".25"/>`;
				const items = [['tree', 'درخت زندگی', 'پیوند زمین و آسمان', P.olive], ['star', 'ستاره‌ی هشت‌پر', 'نور و راهنمایی', P.indigo], ['mountain', 'کوه', 'استواری', P.terra], ['water', 'آب روان', 'زندگی و جریان', P.indigo], ['eye', 'چشم', 'نگهبان از بدی', P.madder], ['comb', 'شانه', 'پاکی و نظم', P.char], ['toranj', 'ترنج', 'مرکز و یگانگی', P.madder], ['bird', 'پرنده', 'پیام‌آور شادی', P.saffron]];
				s += `<text x="${W - 80}" y="110" ${FA} font-size="52" font-weight="800" fill="${P.char}" text-anchor="start">زبان نقش‌ها</text><text x="80" y="104" font-family="Vazirmatn,sans-serif" font-size="16" font-weight="700" letter-spacing="5" fill="${P.madder}">KOOCH · MOTIF INDEX</text>`;
				items.forEach(([k, name, mean, c], i) => {
					const col = 3 - (i % 4), row = Math.floor(i / 4), x = 80 + col * 365, y = 160 + row * 410, w = 345, h = 390;
					s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fbf8f1"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#e2d6bf" stroke-width="2"/>`;
					const cols = { A: c, B: c === P.saffron ? P.madder : P.saffron, C: P.madder };
					if (c === P.char) cols.B = P.terra;
					s += motifSvg(k, x + w / 2, y + 150, k === 'mountain' || k === 'water' ? 13 : 14, cols);
					s += `<text x="${x + w / 2}" y="${y + 305}" ${FA} font-size="32" font-weight="800" fill="${P.char}" text-anchor="middle">${name}</text><text x="${x + w / 2}" y="${y + 345}" ${FA} font-size="19" font-weight="500" fill="#6a5a48" text-anchor="middle">${mean}</text>`;
				});
				return svg(W, H, s, grainFx(.22, .8));
			}
			case 2: { // making ghee: goatskin churn on tripod
				let s = `<rect width="${W}" height="${H}" fill="#efe6d6"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".3"/><circle cx="1180" cy="330" r="230" fill="${P.terra}" opacity=".9"/><circle cx="1180" cy="330" r="230" filter="url(#kPlaster)" opacity=".3"/>`;
				s += `<path d="M0,760 C400,740 1200,740 1600,760 L1600,1000 L0,1000Z" fill="#d9c7a6"/><path d="M0,760 C400,740 1200,740 1600,760" stroke="#c4ae86" stroke-width="3" fill="none"/>`;
				s += clothFlat(260, 960, 900, 220, 0, -.2, .45, 12);
				const ax = 760, ay = 150;
				s += `<path d="M${ax},${ay} L${ax - 330},880" stroke="#6a4220" stroke-width="22" stroke-linecap="round"/><path d="M${ax},${ay} L${ax + 320},860" stroke="#7a4b20" stroke-width="22" stroke-linecap="round"/><path d="M${ax},${ay} L${ax + 40},800" stroke="#5a3818" stroke-width="18" stroke-linecap="round" opacity=".8"/><path d="M${ax - 12},${ay + 10} L${ax - 326},880" stroke="#a87a4a" stroke-width="5" stroke-linecap="round" opacity=".6"/>`;
				s += `<path d="M${ax - 16},${ay + 4} l32,-6 l-4,26 l-28,6Z" fill="#c9a36a"/>`;
				s += `<path d="M${ax},${ay + 20} L${ax - 250},458 M${ax},${ay + 20} L${ax + 240},452" stroke="#c9a36a" stroke-width="5"/>`;
				const bag = `M${ax - 300},500 C${ax - 330},470 ${ax - 300},440 ${ax - 260},452 C${ax - 160},430 ${ax + 120},428 ${ax + 230},450 C${ax + 270},430 ${ax + 320},450 ${ax + 300},486 C${ax + 330},540 ${ax + 300},610 ${ax + 220},632 C${ax + 100},660 ${ax - 140},662 ${ax - 250},630 C${ax - 330},606 ${ax - 340},540 ${ax - 300},500Z`;
				s += `<defs>${rg('ngB', [[0, '#b98a5a'], [.6, '#8a5a32'], [1, '#5a3418']], .4, .35, .7)}</defs><path d="${bag}" fill="#2a1e12" opacity=".2" transform="translate(30 220) scale(1 .35)" filter="url(#kb16)"/><path d="${bag}" fill="url(#ngB)"/><path d="${bag}" filter="url(#kWool)" opacity=".5"/><path d="M${ax - 220},486 C${ax - 60},466 ${ax + 80},466 ${ax + 220},486" stroke="#d9b07a" stroke-width="6" fill="none" opacity=".45" stroke-linecap="round"/>`;
				s += `<path d="M${ax - 220},640 C${ax - 240},680 ${ax - 250},700 ${ax - 240},724" stroke="#7a4b28" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${ax + 170},644 C${ax + 190},680 ${ax + 196},700 ${ax + 186},724" stroke="#7a4b28" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${ax - 300},500 C${ax - 350},500 ${ax - 380},520 ${ax - 390},550" stroke="#7a4b28" stroke-width="26" fill="none" stroke-linecap="round"/><circle cx="${ax - 390}" cy="556" r="12" fill="#c9a36a"/><path d="M${ax - 280},548 C${ax - 120},580 ${ax + 120},580 ${ax + 280},546" stroke="#4a2a12" stroke-width="2.5" stroke-dasharray="8 7" fill="none" opacity=".7"/>`;
				// copper pot
				s += `<defs>${lg('ngC', [[0, '#7a3a1a'], [.2, '#d98a4a'], [.4, '#f2b27a'], [.7, '#b5622f'], [1, '#6a2e14']], 1, 0)}</defs><ellipse cx="1260" cy="900" rx="170" ry="26" fill="#2a1e12" opacity=".3" filter="url(#kb8)"/><path d="M1110,760 C1100,860 1150,900 1250,904 C1350,900 1400,860 1390,760Z" fill="url(#ngC)"/><ellipse cx="1250" cy="760" rx="140" ry="30" fill="#5a2a12"/><ellipse cx="1250" cy="764" rx="124" ry="24" fill="#f2d27a"/><ellipse cx="1250" cy="760" rx="140" ry="30" fill="none" stroke="#f2b27a" stroke-width="6"/>`;
				s += `<text x="${W - 90}" y="150" ${FA} font-size="20" font-weight="700" fill="${P.wool}" text-anchor="start" opacity="0">.</text>`;
				return svg(W, H, s, `${grainFx(.28, .8)}${vignette(.18, '60,40,20')}`);
			}
			case 3: { // wild herbs flat lay
				let s = `<rect width="${W}" height="${H}" fill="#c49a6c"/><rect width="${W}" height="${H}" filter="url(#kPaper)" opacity=".9"/><path d="M0,0 L800,0 L400,${H} L0,${H}Z" fill="#fff" opacity=".1" filter="url(#kb30)"/>`;
				const pennyroyal = (x, y, len, ang, seed) => { const r = rng(seed); const pts = SH.stemPts(x, y, len, ang, (r() - .5) * 20, 12); let g = SH.stemPath(pts, 3, '#6a7a3a'); pts.forEach((q, i) => { if (i % 2 || i < 1) return; [-1, 1].forEach(sd => { g += SH.leaf(q[0], q[1], 30, 13, q[2] + sd * 70, i % 4 ? '#7d8f4a' : '#8fa05a', '#c4d08e'); }); if (i > 4 && i % 4 === 0) for (let k = 0; k < 14; k++) { const a = r() * Math.PI * 2; g += `<circle cx="${f1(q[0] + Math.cos(a) * 12)}" cy="${f1(q[1] + Math.sin(a) * 12)}" r="3.4" fill="#c4a0d0"/>`; } }); return g; };
				const rosebud = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="0" cy="0" rx="16" ry="24" fill="#c0546a"/><ellipse cx="-4" cy="-6" rx="6" ry="12" fill="#e08aa0" opacity=".7"/><path d="M-14,10 L0,30 L14,10 L6,16 L0,6 L-6,16Z" fill="#6a7a3a"/></g>`;
				const lbl = (x, y, a, t) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-70" y="-24" width="140" height="48" rx="3" fill="#f3ede2"/><rect x="-70" y="-24" width="140" height="48" rx="3" filter="url(#kPaper)" opacity=".3"/><circle cx="-56" cy="0" r="4" fill="#8a6a44"/><text x="8" y="9" ${FA} font-size="24" font-weight="800" fill="${P.char}" text-anchor="middle">${t}</text></g>`;
				s += `<g transform="translate(120 960)">${SH.thyme(0, 0, 640, -64, 2, 1.9)}</g><g transform="translate(260 990)">${SH.thyme(0, 0, 560, -74, 7, 1.8)}</g><g transform="translate(60 820)">${SH.thyme(0, 0, 420, -48, 4, 1.6)}</g>`;
				s += pennyroyal(560, 960, 640, -84, 3) + pennyroyal(660, 980, 580, -96, 5) + pennyroyal(760, 960, 520, -104, 8);
				s += `<g transform="translate(900 920)">${SH.wild(0, 0, 0, 0, 1, 1).slice(0, 0)}</g>`;
				for (let i = 0; i < 9; i++) { const x = 950 + (i % 3) * 120 + (i > 5 ? 40 : 0), y = 280 + Math.floor(i / 3) * 130; s += `<path d="M${x},${y + 20} C${x - 10},${y + 160} ${x - 30 + i * 4},${y + 260} ${x - 40 + i * 6},${y + 420}" stroke="#7d8a4c" stroke-width="4" fill="none"/>` + SH.leaf(x - 10, y + 160, 50, 10, 140, '#8a9a5b') + SH.daisy(x, y, 46); }
				const rr = rng(9); for (let i = 0; i < 34; i++) s += rosebud(+f1(1250 + rr() * 300), +f1(600 + rr() * 320), +f1(rr() * 360));
				s += lbl(240, 220, -6, 'آویشن') + lbl(640, 180, 4, 'پونه') + lbl(1090, 190, -4, 'بابونه') + lbl(1390, 470, 6, 'گل‌محمدی');
				s += `<path d="M300,860 C340,880 380,870 420,890" stroke="#efe6d4" stroke-width="4" fill="none"/>`;
				return svg(W, H, s, grainFx(.26, .8));
			}
			case 4: { // natural dyes
				let s = `<rect width="${W}" height="${H}" fill="#efe7da"/><rect width="${W}" height="${H}" filter="url(#kPlaster)" opacity=".3"/><path d="M0,0 L700,0 L300,${H} L0,${H}Z" fill="#fff" opacity=".14" filter="url(#kb30)"/>`;
				const dyes = [['#9e2a24', '#c43a2e', 'روناس'], ['#5a3a24', '#7a5236', 'پوست گردو'], ['#22305a', '#3a4c86', 'نیل'], ['#d9a020', '#f0c040', 'پوست انار']];
				dyes.forEach(([c0, c1, name], i) => {
					const x = 260 + i * 360, y = 360, p = id('dy');
					s += `<defs>${rg(p, [[0, c1], [.7, c0], [1, c0]], .4, .35, .7)}${rg(p + 'b', [[0, '#fbf8f2'], [.85, '#e6dccb'], [1, '#c9bca2']])}</defs>`;
					s += `<circle cx="${x + 14}" cy="${y + 18}" r="150" fill="#2a1e12" opacity=".22" filter="url(#kb16)"/><circle cx="${x}" cy="${y}" r="150" fill="url(#${p}b)"/><circle cx="${x}" cy="${y}" r="122" fill="url(#${p})"/><circle cx="${x}" cy="${y}" r="122" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="3"/><path d="M${x - 80},${y - 60} A100,100 0 0 1 ${x + 10},${y - 100}" stroke="#fff" stroke-width="6" opacity=".45" fill="none" stroke-linecap="round"/>`;
					s += `<text x="${x}" y="${y + 210}" ${FA} font-size="30" font-weight="800" fill="${P.char}" text-anchor="middle">${name}</text>`;
					// skein
					const sy = 780;
					s += `<g transform="translate(${x} ${sy}) rotate(${i % 2 ? 4 : -4})"><rect x="-120" y="-34" width="240" height="68" rx="34" fill="#2a1e12" opacity=".2" filter="url(#kb8)" transform="translate(8 10)"/><rect x="-120" y="-34" width="240" height="68" rx="34" fill="${c1}"/>${Array.from({ length: 14 }, (_, k) => `<path d="M${-110 + k * 16},-30 C${-100 + k * 16},0 ${-120 + k * 16},10 ${-104 + k * 16},30" stroke="#000" stroke-opacity=".18" stroke-width="3" fill="none"/>`).join('')}<rect x="-120" y="-34" width="240" height="68" rx="34" filter="url(#kWool)" opacity=".6"/><rect x="-16" y="-38" width="16" height="76" rx="6" fill="${c0}"/></g>`;
				});
				const rr = rng(3);
				for (let i = 0; i < 6; i++) s += `<path d="M${f1(150 + rr() * 110)},${f1(620 + rr() * 50)} c20,-20 40,10 60,-6 s30,10 50,-4" stroke="#8e3a24" stroke-width="${f1(6 + rr() * 4)}" fill="none" stroke-linecap="round"/>`;
				[[580, 640], [650, 670], [600, 690]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="30" fill="#6a4a2a"/><path d="M${x - 24},${y - 6} q24,-16 48,0" stroke="#3a2614" stroke-width="3" fill="none"/>`; });
				s += `<ellipse cx="980" cy="660" rx="70" ry="26" fill="#2e3a6c"/><ellipse cx="970" cy="652" rx="40" ry="10" fill="#4a5c9c"/>`;
				[[1320, 650, 20], [1390, 680, -30], [1350, 700, 60]].forEach(([x, y, a]) => { s += `<path d="M${x - 30},${y} q30,-34 60,0 q-30,14 -60,0Z" fill="#c4502a" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 24},${y - 2} q24,-24 48,0" fill="#e8b04a" transform="rotate(${a} ${x} ${y})"/>`; });
				return svg(W, H, s, grainFx(.24, .8));
			}
			default: { // spring & tents at dusk
				const L = [SH.ridge(51, W, 470, 220, 8, .5), SH.ridge(53, W, 580, 160, 8, .48), SH.ridge(57, W, 680, 90, 7, .45)];
				let s = `<defs>${lg('ndS', [[0, '#141a30'], [.5, '#2e3a5c'], [.8, '#6a5470'], [1, '#c4806a']])}${lg('ndW', [[0, '#6a6a8a'], [1, '#2e3a5c']])}</defs><rect width="${W}" height="${H}" fill="url(#ndS)"/>`;
				const rr = rng(8); for (let i = 0; i < 160; i++) s += `<circle cx="${f1(rr() * W)}" cy="${f1(rr() * 460)}" r="${f1(.6 + rr() * 1.8)}" fill="#fff" opacity="${f1(.3 + rr() * .7)}"/>`;
				s += `<path d="M1260,130 A56,56 0 1 0 1300,230 A44,44 0 1 1 1260,130Z" fill="#fbecc8"/><circle cx="1270" cy="180" r="140" fill="#fbecc8" opacity=".08" filter="url(#kb16)"/>`;
				['#3a3a5a', '#2a2a44', '#1e1b2e'].forEach((c, i) => { s += `<path d="${SH.ridgePath(L[i], H)}" fill="${c}"/>${strata(L[i], H, 4, '#fff', .06, 18)}`; });
				s += `<path d="M0,800 C400,780 1000,770 1600,790 L1600,${H} L0,${H}Z" fill="#1a1a14"/>`;
				s += `<path d="M200,${H} C360,960 600,930 800,910 C1000,890 1200,880 1600,870 L1600,900 C1260,904 1060,916 880,940 C680,966 520,990 440,${H}Z" fill="url(#ndW)"/>`;
				for (let i = 0; i < 12; i++) s += `<path d="M${400 + i * 90},${975 - i * 8} l70,-5" stroke="#c9c9e4" stroke-width="2.4" opacity="${.55 - i * .03}"/>`;
				s += tent(1020, 850, 440, 150, 1) + tent(1420, 830, 300, 108, .9, { poles: 3 }) + tent(640, 860, 280, 100, .85, { poles: 3 });
				s += `<ellipse cx="1020" cy="860" rx="240" ry="26" fill="${P.saffron}" opacity=".25" filter="url(#kb16)"/>`;
				s += `<g transform="translate(1240 920) scale(1.5)"><path d="M-20,0 L0,-18 L20,0Z" fill="#3a2a1a"/><path d="M-10,-4 C-14,-30 4,-34 0,-56 C10,-34 16,-26 10,-4Z" fill="${P.saffron}"/><path d="M-4,-6 C-6,-22 4,-26 2,-38 C8,-24 10,-18 6,-6Z" fill="#fff2c4"/><circle cx="0" cy="-20" r="60" fill="${P.saffron}" opacity=".2" filter="url(#kb16)"/></g>`;
				s += `<path d="M1210,800 C1200,740 1240,700 1226,640 C1216,600 1250,560 1240,500" stroke="#fff" stroke-width="12" fill="none" opacity=".08" filter="url(#kb8)" stroke-linecap="round"/>`;
				for (let i = 0; i < 14; i++) { const x = 300 + rr() * 220, y = 900 + rr() * 50; s += K.sheep(x, y, 1.4, '#3a3a44', '#1a1a20'); }
				for (let i = 0; i < 120; i++) { const r2 = rng(i + 500), x = r2() * W, h2 = 30 + r2() * 90; s += `<path d="M${f1(x)},${H + 4} q${f1((r2() - .5) * 30)},${f1(-h2 * .6)} ${f1((r2() - .5) * 50)},${f1(-h2)}" stroke="${r2() > .5 ? '#14140e' : '#2a2a1e'}" stroke-width="${f1(2 + r2() * 4)}" fill="none" stroke-linecap="round"/>`; }
				return svg(W, H, s, `${grainFx(.3, .8, 'overlay')}${vignette(.35, '0,0,10')}`);
			}
		}
	};
})();
