/* ================= Nomad — KOOCH (کوچ) =================
 * Modern organic products by nomadic families of the Zagros. Modern editorial with
 * kilim/gabbeh geometry (stepped motifs on a cell grid), kraft paper and wool texture.
 */
(() => {
	const P = { wool: '#f3ede2', wool2: '#e8dfcf', terra: '#b5532f', madder: '#8e2b22', indigo: '#2e3a5c', saffron: '#e3a72f', char: '#1e1b18', olive: '#6b6b3a', kraft: '#c49a6c', kraft2: '#a97f52' };
	const FA = `font-family="Vazirmatn,sans-serif"`;
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
		const pitch = r * 2 + 8;
		let i = 0;
		for (let cx = Math.floor(pitch / 2); cx < w + pitch; cx += pitch, i++) {
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
