/* ================= Honey — SHAHDINEH (عسل طبیعی شهدینه) =================
 * Warm sunlight, glossy glass, translucent amber honey with internal glow and rim
 * highlights, wooden lids & dippers, linen. All objects are SVG groups drawn around a
 * local origin (bottom-centre on the table) so they can be reused across scenes.
 */
(() => {
	const C = { cream: '#fbf4e6', ink: '#2a1a0b', wax: '#f3d27a', sage: '#8a9a5b', amber: '#e8a317', amber2: '#b86e00' };
	const SERIF = `font-family="Liberation Serif,DejaVu Serif,serif"`;
	const FA = `font-family="Vazirmatn,sans-serif"`;
	const st = s => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
	const lg = (id, s, x2 = 0, y2 = 1, x1 = 0, y1 = 0, ex = '') => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${ex}>${st(s)}</linearGradient>`;
	const rg = (id, s, cx = .5, cy = .5, r = .5, fx = cx, fy = cy, ex = '') => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}" ${ex}>${st(s)}</radialGradient>`;
	const f1 = n => (+n).toFixed(1);
	let N = 0;
	const id = p => `h${p}${++N}`;

	const HONEY = {
		gavan: { c0: '#fffbe9', c1: '#f9e7a6', c2: '#e4bd5c', c3: '#c39431', glow: '#fffdf2', cast: '#f6d77c' },
		thyme: { c0: '#ffe08a', c1: '#f4ae2c', c2: '#c87905', c3: '#8a4b00', glow: '#fff1b8', cast: '#f2a51e' },
		konar: { c0: '#f39a3d', c1: '#b8521b', c2: '#6e2709', c3: '#3d1204', glow: '#ffc26b', cast: '#c85e14' },
		forty: { c0: '#ffd45a', c1: '#eda016', c2: '#b06700', c3: '#6e3b00', glow: '#fff3b8', cast: '#eea21a' },
	};
	const WOOD = [[0, '#6e4520'], [.1, '#a8713a'], [.26, '#e3b47a'], [.42, '#cf9a5e'], [.7, '#9a6430'], [.9, '#6c431d'], [1, '#865628']];
	const WOOD_TOP = [[0, '#f2cf9a'], [.6, '#d9a868'], [1, '#b5804a']];

	/* ---------- shared defs ---------- */
	const hdefs = () => `<defs>
		<radialGradient id="hFruit" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a1204" stop-opacity=".45"/></radialGradient>
		<filter id="hb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
		<filter id="hb4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
		<filter id="hb8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
		<filter id="hb16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
		<filter id="hb30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
		<filter id="hb60" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
		<filter id="hLinen" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .035" numOctaves="2" seed="3" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".035 .9" numOctaves="2" seed="8" result="b"/><feComposite in="a" in2="b" operator="arithmetic" k2=".5" k3=".5"/><feColorMatrix values="0 0 0 0 .25 0 0 0 0 .16 0 0 0 0 .06 0 0 0 1.6 -.72"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="hWoodN" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .45" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .22 0 0 0 0 .12 0 0 0 0 .04 0 0 0 1.4 -.5"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<filter id="hWax" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .32 0 0 0 0 .08 0 0 0 .9 -.35"/><feComposite in2="SourceAlpha" operator="in"/></filter>
	</defs>`;

	/* ---------- backdrop: wall with window light + linen table ---------- */
	const backdrop = (W, H, hz, o = {}) => {
		const bx = o.bx ?? .3, bw = o.bw ?? .5;
		const beam = `M${W * bx},${-20} L${W * (bx + bw)},${-20} L${W * (bx + bw - .18)},${hz} L${W * (bx - .18)},${hz}Z`;
		const mx = W * (bx + bw / 2);
		return `<rect width="${W}" height="${hz}" fill="url(#hWall)"/>
			<g opacity="${o.beamOp ?? .9}" style="mix-blend-mode:screen"><path d="${beam}" fill="#fff4dc" filter="url(#hb30)"/></g>
			<g opacity=".5" filter="url(#hb16)"><path d="M${mx - 14},-20 L${mx + 14},-20 L${mx + 14 - W * .18},${hz} L${mx - 14 - W * .18},${hz}Z" fill="#e2c99e"/><path d="M${W * (bx - .05)},${hz * .42} L${W * (bx + bw)},${hz * .38} L${W * (bx + bw)},${hz * .42} L${W * (bx - .05)},${hz * .46}Z" fill="#e2c99e"/></g>
			<g opacity="${o.leafOp ?? .2}" filter="url(#hb16)">${[[.72, .1, 70], [.84, .2, 55], [.66, .26, 48], [.9, .06, 60], [.78, .3, 40]].map(([x, y, r]) => `<ellipse cx="${W * x}" cy="${hz * y}" rx="${r}" ry="${r * .45}" fill="#6b4a1e" transform="rotate(-35 ${W * x} ${hz * y})"/>`).join('')}</g>
			<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#hTable)"/>
			<g opacity="${o.poolOp ?? .55}" style="mix-blend-mode:screen"><path d="M${W * (bx - .18)},${hz} L${W * (bx + bw - .18)},${hz} L${W * (bx + bw - .5)},${H} L${W * (bx - .55)},${H}Z" fill="#fff1d2" filter="url(#hb30)"/></g>
			<rect y="${hz}" width="${W}" height="${H - hz}" filter="url(#hLinen)" opacity="${o.linen ?? .5}"/>
			<rect y="${hz - 1}" width="${W}" height="${(H - hz) * .18}" fill="url(#hHz)"/>
			<rect y="${hz - 1}" width="${W}" height="1.5" fill="#fff8ea" opacity=".6"/>`;
	};
	const bdDefs = (o = {}) => `<defs>
		${lg('hWall', [[0, o.w0 || '#e6cfa6'], [.6, o.w1 || '#efdfc2'], [1, o.w2 || '#e8d3ad']], .4, 1)}
		${lg('hTable', [[0, o.t0 || '#e2c99f'], [.3, o.t1 || '#ecdab8'], [1, o.t2 || '#d9bd8e']])}
		${lg('hHz', [[0, '#5a3a14', .22], [.3, '#5a3a14', .06], [1, '#5a3a14', 0]])}
	</defs>`;

	/* ---------- jar ---------- */
	const jar = o => {
		const p = id('j'), R = o.R || 150, Hb = o.Hb || 290, e = o.e ?? .13, Rn = R * .8, sh = R * .34, nh = R * .16;
		const yS = -Hb, yN = yS - sh, yT = yN - nh, Ri = R - 6, base = 16;
		const h = o.honey ? HONEY[o.honey] : null;
		const lvl = o.level ?? .9, yh = -base - (Hb - base) * lvl;
		const ell = (y, r, x) => y + r * e * Math.sqrt(Math.max(0, 1 - (x / r) ** 2));
		const sil = `M${-R},0 L${-R},${yS} C${-R},${yS - sh * .62} ${-Rn},${yN + sh * .3} ${-Rn},${yN} L${-Rn},${yT} A${Rn},${Rn * e} 0 0 1 ${Rn},${yT} L${Rn},${yN} C${Rn},${yN + sh * .3} ${R},${yS - sh * .62} ${R},${yS} L${R},0 A${R},${R * e} 0 0 1 ${-R},0Z`;
		const fillP = `M${-Ri},${-base} L${-Ri},${f1(yh)} A${Ri},${Ri * e} 0 0 1 ${Ri},${f1(yh)} L${Ri},${-base} A${Ri},${Ri * e} 0 0 1 ${-Ri},${-base}Z`;
		let d = `<defs><clipPath id="${p}c"><path d="${sil}"/></clipPath><clipPath id="${p}f"><path d="${fillP}"/></clipPath>`;
		if (h) {
			d += lg(`${p}h`, [[0, h.c3], [.05, h.c3], [.13, h.c2], [.3, h.c1], [.44, h.c0], [.58, h.c1], [.78, h.c2], [.92, h.c3], [1, h.c3]], 1, 0);
			d += lg(`${p}hv`, [[0, '#fff', .18], [.25, '#fff', 0], [.75, '#000', 0], [1, '#000', .18]]);
			d += rg(`${p}g`, [[0, h.glow, .95], [.45, h.c0, .55], [1, h.c0, 0]]);
			d += lg(`${p}s`, [[0, h.c2], [.5, h.c1], [1, h.c0]], 0, 1);
		}
		d += lg(`${p}lb`, [[0, '#3c1e00', .38], [.12, '#3c1e00', .08], [.32, '#fff', .16], [.5, '#fff', 0], [.82, '#3c1e00', .1], [1, '#3c1e00', .42]], 1, 0);
		d += lg(`${p}w`, WOOD, 1, 0) + lg(`${p}wt`, WOOD_TOP, .3, 1);
		d += lg(`${p}hl`, [[0, '#fff', 0], [.12, '#fff', .9], [.85, '#fff', .75], [1, '#fff', 0]]);
		d += lg(`${p}ge`, [[0, '#4a2c08', .42], [.06, '#4a2c08', .12], [.2, '#4a2c08', 0], [.8, '#4a2c08', 0], [.94, '#4a2c08', .12], [1, '#4a2c08', .45]], 1, 0);
		d += lg(`${p}wr`, [[0, '#fff', .0], [.08, '#fff', .9], [.92, '#fff', .9], [1, '#fff', 0]]);
		d += `</defs>`;
		let s = d;
		// shadows on table
		const sc = h ? h.cast : (o.castColor || '#d9a441');
		s += `<ellipse cx="${R * .95}" cy="${-R * e * .2}" rx="${R * 1.7}" ry="${R * e * 3.2}" fill="#5a3410" opacity=".2" filter="url(#hb16)"/>`;
		if (o.caustic !== false) s += `<ellipse cx="${R * .85}" cy="${R * e * .25}" rx="${R * .95}" ry="${R * e * 1.7}" fill="${sc}" opacity=".55" filter="url(#hb8)"/><ellipse cx="${R * .75}" cy="${R * e * .3}" rx="${R * .4}" ry="${R * e * .8}" fill="#fff3c4" opacity=".55" filter="url(#hb8)"/>`;
		s += `<ellipse cx="0" cy="${R * e * .35}" rx="${R * 1.02}" ry="${R * e * 1.1}" fill="#3a2008" opacity=".42" filter="url(#hb4)"/>`;
		// glass body back
		s += `<path d="${sil}" fill="${o.glassTint || '#fffaf0'}" opacity=".22"/>`;
		s += `<g clip-path="url(#${p}c)">`;
		if (h) {
			s += `<path d="${fillP}" fill="url(#${p}h)"/>`;
			s += `<g clip-path="url(#${p}f)" style="mix-blend-mode:screen"><ellipse cx="${-R * .08}" cy="${-Hb * .36}" rx="${R * .78}" ry="${Hb * .42}" fill="url(#${p}g)"/><ellipse cx="${-R * .05}" cy="${-base - 10}" rx="${R * .8}" ry="${R * e * 1.2 + 10}" fill="${h.glow}" opacity=".55" filter="url(#hb8)"/></g>`;
			s += `<path d="${fillP}" fill="url(#${p}hv)"/>`;
			// surface
			s += `<ellipse cx="0" cy="${f1(yh)}" rx="${Ri}" ry="${Ri * e}" fill="url(#${p}s)"/><ellipse cx="${-Ri * .15}" cy="${f1(yh - Ri * e * .2)}" rx="${Ri * .6}" ry="${Ri * e * .45}" fill="#fff" opacity=".28" filter="url(#hb4)"/><path d="M${-Ri},${f1(yh)} A${Ri},${Ri * e} 0 0 1 ${Ri},${f1(yh)}" fill="none" stroke="#fff6d8" stroke-width="2.5" opacity=".7"/>`;
		}
		if (o.pollen) s += pollenFill(p, Ri, yh, e, base);
		if (o.contentSvg) s += o.contentSvg(Ri, yh, e, base);
		// glass base
		s += `<path d="M${-R},0 A${R},${R * e} 0 0 0 ${R},0 L${R},${-base} A${R},${R * e} 0 0 1 ${-R},${-base}Z" fill="#fffbea" opacity=".35"/><path d="M${-R + 4},${-base} A${R - 4},${(R - 4) * e} 0 0 0 ${R - 4},${-base}" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/>`;
		// label
		if (o.label) {
			const L = o.label, yt = -Hb * (L.top ?? .64), yb = -Hb * (L.bot ?? .25), x0 = R * (L.x0 ?? .8);
			const band = (y0, y1, x) => `M${-x},${f1(ell(y0, R, x))} A${R},${R * e} 0 0 0 ${x},${f1(ell(y0, R, x))} L${x},${f1(ell(y1, R, x))} A${R},${R * e} 0 0 1 ${-x},${f1(ell(y1, R, x))}Z`;
			const arc = (y, x) => `M${-x},${f1(ell(y, R, x))} A${R},${R * e} 0 0 0 ${x},${f1(ell(y, R, x))}`;
			s += `<path d="${band(yt, yb, x0)}" fill="${L.paper || C.cream}"/>`;
			s += `<path d="${band(yt, yb, x0)}" filter="url(#hLinen)" opacity=".25"/>`;
			s += `<path d="${band(yb - R * .1, yb, x0)}" fill="${L.band || C.amber}"/>`;
			s += `<path d="${arc(yt + 9, x0 - 10)}" fill="none" stroke="${L.rule || '#b8862c'}" stroke-width="1.4"/><path d="${arc(yt + 13, x0 - 10)}" fill="none" stroke="${L.rule || '#b8862c'}" stroke-width=".8"/>`;
			const my = (yt + yb) / 2 + R * e * .95, fs = R * (L.fs || .2);
			s += `<text x="0" y="${f1(ell(yt + 30, R, 0) + R * .03)}" ${SERIF} font-size="${R * .066}" letter-spacing="${R * .035}" fill="${L.ink || C.ink}" text-anchor="middle">SHAHDINEH</text>`;
			s += `<path d="M${-R * .1},${f1(ell(yt + 44, R, 0))} L${R * .1},${f1(ell(yt + 44, R, 0))}" stroke="${L.rule || '#b8862c'}" stroke-width="1.2"/>`;
			s += `<text x="0" y="${f1(my + fs * .36)}" ${FA} font-size="${fs}" font-weight="800" fill="${L.ink || C.ink}" text-anchor="middle" direction="rtl">${L.name}</text>`;
			if (L.sub) s += `<text x="0" y="${f1(my + fs * .36 + R * .12)}" ${FA} font-size="${R * .064}" font-weight="500" fill="${L.ink || C.ink}" fill-opacity=".7" text-anchor="middle" direction="rtl">${L.sub}</text>`;
			s += `<text x="0" y="${f1(ell(yb - 7, R, 0) - 2)}" ${FA} font-size="${R * .066}" font-weight="700" fill="#fff" text-anchor="middle" direction="rtl">${L.weight || '۵۰۰ گرم'}</text>`;
			s += `<path d="${band(yt, yb, x0)}" fill="url(#${p}lb)"/>`;
		}
		s += `</g>`;
		// glass optics
		s += `<g clip-path="url(#${p}c)">`;
		s += `<path d="${sil}" fill="url(#${p}ge)"/>`;
		[[-.74, .1], [-.6, .07]].forEach(([fx, fw]) => { s += `<rect x="${R * fx}" y="${yS + 22}" width="${R * fw}" height="${(Hb - 40) * .46}" rx="${R * .03}" fill="url(#${p}wr)" opacity=".5"/><rect x="${R * fx}" y="${yS + 22 + (Hb - 40) * .5}" width="${R * fw}" height="${(Hb - 40) * .46}" rx="${R * .03}" fill="url(#${p}wr)" opacity=".42"/>`; });
		s += `<rect x="${R * .7}" y="${yS + 40}" width="${R * .06}" height="${Hb - 90}" rx="${R * .03}" fill="url(#${p}wr)" opacity=".3" filter="url(#hb2)"/>`;
		s += `<rect x="${-R + 14}" y="${yS + 10}" width="${R * .1}" height="${Hb - 26}" fill="url(#${p}hl)" opacity=".85" filter="url(#hb2)"/>`;
		s += `<rect x="${-R + R * .3}" y="${yS + 30}" width="${R * .16}" height="${Hb - 70}" fill="url(#${p}hl)" opacity=".16" filter="url(#hb4)"/>`;
		s += `<rect x="${R - 13}" y="${yS + 16}" width="${R * .035}" height="${Hb - 40}" fill="url(#${p}hl)" opacity=".7" filter="url(#hb2)"/>`;
		s += `<path d="M${-R + 10},${yS - 4} C${-R + 12},${yS - sh * .55} ${-Rn + 10},${yN + sh * .2} ${-Rn + 12},${yN - 2}" stroke="#fff" stroke-width="${R * .05}" fill="none" stroke-linecap="round" opacity=".75" filter="url(#hb2)"/>`;
		s += `<path d="M${R - 12},${yS - 2} C${R - 14},${yS - sh * .55} ${Rn - 8},${yN + sh * .2} ${Rn - 9},${yN - 2}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55" filter="url(#hb2)"/>`;
		s += `</g>`;
		s += `<path d="${sil}" fill="none" stroke="${h ? h.c3 : '#8a6a3a'}" stroke-opacity=".35" stroke-width="2.5"/>`;
		// neck threads / rim
		if (o.open) {
			s += `<ellipse cx="0" cy="${yT}" rx="${Rn}" ry="${Rn * e}" fill="none" stroke="#fffaf0" stroke-width="7" opacity=".7"/><ellipse cx="0" cy="${yT}" rx="${Rn}" ry="${Rn * e}" fill="none" stroke="${h ? h.c3 : '#8a6a3a'}" stroke-width="1.5" opacity=".5"/>`;
			for (let i = 0; i < 2; i++) s += `<path d="M${-Rn},${yT + 10 + i * 10} A${Rn},${Rn * e} 0 0 0 ${Rn},${yT + 4 + i * 10}" fill="none" stroke="#fff" stroke-width="2.2" opacity=".55"/>`;
		} else if (o.lid !== false) {
			const Rl = Rn + R * .07, lh = R * (o.lidH || .4), yLb = yT + nh * .45, yLt = yLb - lh;
			const side = `M${-Rl},${yLt} L${-Rl},${yLb} A${Rl},${Rl * e} 0 0 0 ${Rl},${yLb} L${Rl},${yLt}Z`;
			s += `<path d="${side}" fill="url(#${p}w)"/><path d="${side}" filter="url(#hWoodN)" opacity=".5"/>`;
			s += `<path d="M${-Rl},${yLb} A${Rl},${Rl * e} 0 0 0 ${Rl},${yLb}" fill="none" stroke="#3b2208" stroke-width="3" opacity=".5"/>`;
			s += `<ellipse cx="0" cy="${yLt}" rx="${Rl}" ry="${Rl * e}" fill="url(#${p}wt)"/><ellipse cx="0" cy="${yLt}" rx="${Rl}" ry="${Rl * e}" filter="url(#hWoodN)" opacity=".35"/>`;
			s += `<path d="M${-Rl + 2},${yLt + 1} A${Rl - 2},${(Rl - 2) * e} 0 0 0 ${Rl - 2},${yLt + 1}" fill="none" stroke="#fff2d4" stroke-width="3" opacity=".75"/>`;
			const er = Rl * .32;
			s += `<polygon points="${[0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 + 30) * Math.PI / 180; return `${f1(er * Math.cos(a))},${f1(yLt + er * e * Math.sin(a))}`; }).join(' ')}" fill="none" stroke="#7a4a1c" stroke-width="2" opacity=".7"/>`;
			if (o.twine) s += `<path d="M${-Rn - 2},${yLb + 6} A${Rn},${Rn * e} 0 0 0 ${Rn + 2},${yLb + 6} L${Rn + 2},${yLb + 16} A${Rn},${Rn * e} 0 0 1 ${-Rn - 2},${yLb + 16}Z" fill="#c9a36a"/>`;
		}
		return s;
	};

	/* pollen granules (inside jar, clipped by caller) */
	const PCOL = ['#f2b705', '#e98a17', '#c9661c', '#a07b2b', '#d9c04a', '#7d4a62', '#b3a440', '#efd36a', '#8b5a1f', '#e3a42a'];
	const pollenFill = (p, Ri, yh, e, base) => {
		const r = rng(77);
		let s = `<rect x="${-Ri}" y="${yh - 10}" width="${Ri * 2}" height="${-yh}" fill="#b47a1c"/>`;
		const dots = [];
		for (let y = -base + 4; y > yh - Ri * e; y -= 7) for (let x = -Ri; x < Ri; x += 7.5) dots.push([x + r() * 6, y + r() * 5]);
		dots.forEach(([x, y]) => {
			if (y < yh && ((x / Ri) ** 2 + ((y - yh) / (Ri * e)) ** 2) > 1) return;
			const c = PCOL[Math.floor(r() * PCOL.length)], rr = 4 + r() * 2.6;
			s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${c}"/><circle cx="${f1(x - rr * .3)}" cy="${f1(y - rr * .35)}" r="${f1(rr * .35)}" fill="#fff" opacity=".45"/>`;
		});
		s += `<rect x="${-Ri}" y="${yh - 20}" width="${Ri * 2}" height="${-yh + 20}" fill="url(#${p}pv)" />`;
		return `<defs>${lg(`${p}pv`, [[0, '#000', .25], [.2, '#000', 0], [.8, '#000', 0], [1, '#000', .25]], 1, 0)}</defs>` + s;
	};

	/* ---------- honey dipper (axis along +x from head origin) ---------- */
	const dipper = (h, o = {}) => {
		const p = id('d'), L = o.len || 330, hr = o.hr || 34, hl = o.hl || 110;
		let s = `<defs>${lg(`${p}w`, [[0, '#7a4b20'], [.2, '#e2b47c'], [.38, '#f4d3a0'], [.6, '#c48a50'], [.85, '#7e4f22'], [1, '#9a6633']])}${lg(`${p}hc`, [[0, h ? h.c1 : '#e8a317', .0], [.25, h ? h.c0 : '#ffd66b', .75], [.6, h ? h.c1 : '#e8a317', .85], [1, h ? h.c3 : '#8a4b00', .95]])}</defs>`;
		s += `<path d="M0,-9 L${L - 14},-11 Q${L},-11 ${L},0 Q${L},11 ${L - 14},11 L0,9Z" fill="url(#${p}w)"/><path d="M8,-5 L${L - 20},-7" stroke="#fff6e0" stroke-width="2.4" opacity=".6" stroke-linecap="round"/>`;
		const n = 6, step = hl / n;
		for (let i = 0; i < n; i++) {
			const x = -hl + i * step;
			s += `<rect x="${f1(x)}" y="${-hr * .62}" width="${f1(step)}" height="${hr * 1.24}" fill="url(#${p}w)"/>`;
			s += `<rect x="${f1(x + step * .18)}" y="${-hr}" width="${f1(step * .64)}" height="${hr * 2}" rx="${step * .3}" fill="url(#${p}w)"/>`;
			s += `<ellipse cx="${f1(x + step * .18)}" cy="0" rx="3" ry="${hr * .96}" fill="#4a2c10" opacity=".35"/>`;
		}
		s += `<ellipse cx="${-hl}" cy="0" rx="${hr * .25}" ry="${hr * .9}" fill="#c48a50"/>`;
		if (h) {
			s += `<path d="M${-hl - 4},${-hr * .7} Q${-hl * .5},${-hr * 1.15} ${4},${-hr * .6} L4,${hr * .7} Q${-hl * .5},${hr * 1.35} ${-hl - 6},${hr * .8}Z" fill="url(#${p}hc)"/>`;
			s += `<path d="M${-hl + 6},${-hr * .62} Q${-hl * .5},${-hr * 1.02} -4,${-hr * .52}" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round" filter="url(#hb2)"/>`;
		}
		return s;
	};
	/* honey ribbon/drip from (x0,y0) down to (x1,y1) */
	const drip = (h, x0, y0, x1, y1, w = 9, o = {}) => {
		const p = id('r');
		const mx = (x0 + x1) / 2 + (o.bend || 8);
		let s = `<defs>${lg(`${p}`, [[0, h.c2], [.35, h.c0], [.6, h.c1], [1, h.c3]], 1, 0)}</defs>`;
		s += `<path d="M${x0 - w},${y0} C${x0 - w * .6},${y0 + 30} ${mx - w * .25},${(y0 + y1) / 2} ${x1 - w * .22},${y1} L${x1 + w * .22},${y1} C${mx + w * .25},${(y0 + y1) / 2} ${x0 + w * .6},${y0 + 30} ${x0 + w},${y0}Z" fill="url(#${p})"/>`;
		s += `<path d="M${x0 - w * .3},${y0 + 10} C${x0 - w * .2},${y0 + 40} ${mx - w * .1},${(y0 + y1) / 2} ${x1 - w * .08},${y1 - 10}" stroke="#fff" stroke-width="${Math.max(1.2, w * .18)}" fill="none" opacity=".65"/>`;
		if (o.pool) s += `<ellipse cx="${x1}" cy="${y1 + 2}" rx="${w * 2.4}" ry="${w * .8}" fill="${h.c1}"/><ellipse cx="${x1 - w * .5}" cy="${y1}" rx="${w * 1.2}" ry="${w * .3}" fill="#fff" opacity=".55"/>`;
		if (o.drop) s += `<path d="M${x1},${y1 - 4} C${x1 + w * 1.4},${y1 + w * 1.2} ${x1 + w * 1.1},${y1 + w * 2.6} ${x1},${y1 + w * 2.6} C${x1 - w * 1.1},${y1 + w * 2.6} ${x1 - w * 1.4},${y1 + w * 1.2} ${x1},${y1 - 4}Z" fill="url(#${p})"/><ellipse cx="${x1 - w * .4}" cy="${y1 + w * 1.3}" rx="${w * .25}" ry="${w * .5}" fill="#fff" opacity=".8"/>`;
		return s;
	};

	/* ---------- botanicals ---------- */
	const leaf = (x, y, len, w, ang, c, c2) => {
		const a = ang * Math.PI / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
		const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
		const mx = x + Math.cos(a) * len * .45, my = y + Math.sin(a) * len * .45;
		return `<path d="M${f1(x)},${f1(y)} Q${f1(mx + nx)},${f1(my + ny)} ${f1(ex)},${f1(ey)} Q${f1(mx - nx)},${f1(my - ny)} ${f1(x)},${f1(y)}Z" fill="${c}"/>${c2 ? `<path d="M${f1(x)},${f1(y)} Q${f1(mx + nx * .2)},${f1(my + ny * .2)} ${f1(ex)},${f1(ey)}" stroke="${c2}" stroke-width="1" fill="none" opacity=".6"/>` : ''}`;
	};
	const stemPts = (x, y, len, ang, curve, n) => {
		const pts = [];
		for (let i = 0; i <= n; i++) { const t = i / n, a = (ang + curve * t) * Math.PI / 180; const px = i ? pts[i - 1][0] + Math.cos(a) * len / n : x, py = i ? pts[i - 1][1] + Math.sin(a) * len / n : y; pts.push([px, py, ang + curve * t]); }
		return pts;
	};
	const stemPath = (pts, w, c) => `<path d="${pts.map((q, i) => `${i ? 'L' : 'M'}${f1(q[0])},${f1(q[1])}`).join('')}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

	const leaf2 = (x, y, len, w, ang, c, hi) => leaf(x, y, len, w, ang, c) + `<path d="M${f1(x)},${f1(y)} L${f1(x + Math.cos(ang * Math.PI / 180) * len * .8)},${f1(y + Math.sin(ang * Math.PI / 180) * len * .8)}" stroke="${hi}" stroke-width="${f1(Math.max(.8, w * .22))}" opacity=".7"/>`;
	const cluster = (x, y, rad, n, cols, r, sc, dir = 0) => {
		let s = `<ellipse cx="${f1(x + 3 * sc)}" cy="${f1(y + 4 * sc)}" rx="${f1(rad * 1.05)}" ry="${f1(rad * .8)}" fill="#3a2410" opacity=".25" filter="url(#hb4)"/>`;
		for (let i = 0; i < n; i++) {
			const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
			const fx = x + Math.cos(a) * d + Math.cos(dir) * d * .4, fy = y + Math.sin(a) * d * .8 + Math.sin(dir) * d * .4;
			const shade = (Math.cos(a) + Math.sin(a)) * .5;
			const c = cols[Math.floor(r() * cols.length)];
			s += `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1((2.8 + r() * 2.2) * sc)}" fill="${c}"/>`;
			if (shade < -.2) s += `<circle cx="${f1(fx - .8 * sc)}" cy="${f1(fy - .9 * sc)}" r="${f1(1.3 * sc)}" fill="#fff" opacity=".55"/>`;
			else if (shade > .4) s += `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1(3 * sc)}" fill="#2a0f20" opacity=".22"/>`;
		}
		return s;
	};
	/* thyme sprig: woody stem with side branches, tiny paired leaves, pink-purple flower heads */
	const thyme = (x, y, len, ang, seed = 1, sc = 1) => {
		const r = rng(seed * 31 + 7);
		const main = stemPts(x, y, len, ang, (r() - .5) * 26, 18);
		const stems = [main];
		[6, 10, 13].forEach((k, j) => { const q = main[k]; stems.push(stemPts(q[0], q[1], len * (.28 + r() * .12), q[2] + (j % 2 ? 34 : -34), (r() - .5) * 20, 8)); });
		let s = '';
		stems.forEach((st, j) => { s += stemPath(st, (j ? 2.2 : 3.4) * sc, '#6e5236') + stemPath(st, (j ? .8 : 1.2) * sc, '#a3825c'); });
		stems.forEach(st => st.forEach((q, i) => { if (i < 2 || i > st.length - 2) return; [-1, 1].forEach(sd => { s += leaf2(q[0], q[1], (11 + r() * 7) * sc, 3.6 * sc, q[2] + sd * (40 + r() * 22), r() > .5 ? '#6f8048' : '#86965a', '#b9c48c'); }); }));
		const FL = ['#c88ab8', '#b26da0', '#dcaacb', '#9d5d8b', '#e6bfd8'];
		stems.forEach((st, j) => { const [hx, hy, ha] = st[st.length - 1]; s += cluster(hx, hy, (j ? 11 : 15) * sc, j ? 26 : 40, FL, r, sc, ha * Math.PI / 180); });
		return s;
	};
	/* astragalus (gavan): pinnate grey-green leaves, spines, cream-yellow pea flowers */
	const gavan = (x, y, len, ang, seed = 1, sc = 1) => {
		const r = rng(seed * 17 + 3);
		const main = stemPts(x, y, len, ang, (r() - .5) * 24, 14);
		let s = stemPath(main, 3.4 * sc, '#7d7a50');
		main.forEach((q, i) => {
			if (i < 2 || i % 2) return;
			[-1, 1].forEach(sd => {
				const a = q[2] + sd * (48 + r() * 10), al = a * Math.PI / 180, l = (46 + r() * 18) * sc;
				const ex = q[0] + Math.cos(al) * l, ey = q[1] + Math.sin(al) * l;
				s += `<path d="M${f1(q[0])},${f1(q[1])} L${f1(ex)},${f1(ey)}" stroke="#8d9566" stroke-width="${1.6 * sc}"/><path d="M${f1(ex)},${f1(ey)} l${f1(Math.cos(al) * 9 * sc)},${f1(Math.sin(al) * 9 * sc)}" stroke="#c9c39a" stroke-width="${1.2 * sc}"/>`;
				for (let k = 1; k <= 6; k++) { const t = k / 7, lx = q[0] + (ex - q[0]) * t, ly = q[1] + (ey - q[1]) * t; s += leaf2(lx, ly, 10 * sc, 3.2 * sc, a + 62, '#a3ab78', '#d7dcb4') + leaf2(lx, ly, 10 * sc, 3.2 * sc, a - 62, '#929b68', '#c9cfa2'); }
			});
		});
		const [hx, hy, ha] = main[main.length - 1];
		for (let i = 0; i < 16; i++) { const a = ha + (r() - .5) * 150, d = (6 + r() * 26) * sc, al = a * Math.PI / 180; const fx = hx + Math.cos(al) * d, fy = hy + Math.sin(al) * d; s += `<path d="M${f1(fx)},${f1(fy)} q${f1(7 * sc)},${f1(-12 * sc)} ${f1(17 * sc)},${f1(-4 * sc)} q${f1(-5 * sc)},${f1(11 * sc)} ${f1(-17 * sc)},${f1(4 * sc)}Z" fill="${['#f7edc4', '#f1dc96', '#fbf4dc', '#e9d08a'][Math.floor(r() * 4)]}" stroke="#c9a85a" stroke-width=".6" transform="rotate(${f1(a + 90)} ${f1(fx)} ${f1(fy)})"/>`; }
		return s;
	};
	/* konar (ziziphus): zigzag thorny branch, glossy 3-vein leaves, nabk fruits */
	const konar = (x, y, len, ang, seed = 1, sc = 1) => {
		const r = rng(seed * 13 + 5);
		let s = '', px = x, py = y, a = ang;
		const pts = [[px, py, a]];
		for (let i = 0; i < 8; i++) { a += (i % 2 ? 22 : -22); const al = a * Math.PI / 180; px += Math.cos(al) * len / 8; py += Math.sin(al) * len / 8; pts.push([px, py, a]); }
		s += `<path d="${pts.map((q, i) => `${i ? 'L' : 'M'}${f1(q[0])},${f1(q[1])}`).join('')}" stroke="#5e3d22" stroke-width="${4 * sc}" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${pts.map((q, i) => `${i ? 'L' : 'M'}${f1(q[0])},${f1(q[1] - 1)}`).join('')}" stroke="#9a7452" stroke-width="${1.2 * sc}" fill="none"/>`;
		pts.slice(1).forEach((q, i) => {
			const sd = i % 2 ? 1 : -1, la = q[2] + sd * 62;
			const al = la * Math.PI / 180, L = (40 + r() * 10) * sc;
			s += leaf(q[0], q[1], L, 15 * sc, la, i % 3 ? '#5f7232' : '#6f8338');
			[-.25, 0, .25].forEach(o => { s += `<path d="M${f1(q[0])},${f1(q[1])} Q${f1(q[0] + Math.cos(al + o) * L * .6)},${f1(q[1] + Math.sin(al + o) * L * .6)} ${f1(q[0] + Math.cos(al) * L * .9)},${f1(q[1] + Math.sin(al) * L * .9)}" stroke="#c4d08e" stroke-width=".9" fill="none" opacity=".75"/>`; });
			s += `<path d="M${f1(q[0] + Math.cos(al - .25) * L * .3)},${f1(q[1] + Math.sin(al - .25) * L * .3)} Q${f1(q[0] + Math.cos(al - .12) * L * .55)},${f1(q[1] + Math.sin(al - .12) * L * .55)} ${f1(q[0] + Math.cos(al) * L * .75)},${f1(q[1] + Math.sin(al) * L * .75)}" stroke="#fff" stroke-width="${2 * sc}" fill="none" opacity=".35" stroke-linecap="round"/>`;
			s += `<path d="M${f1(q[0])},${f1(q[1])} l${f1(Math.cos((q[2] - sd * 50) * Math.PI / 180) * 10 * sc)},${f1(Math.sin((q[2] - sd * 50) * Math.PI / 180) * 10 * sc)}" stroke="#8a6a4a" stroke-width="${1.6 * sc}"/>`;
			if (i % 2 === 0) { const fa = (q[2] - sd * 75) * Math.PI / 180, fx = q[0] + Math.cos(fa) * 18 * sc, fy = q[1] + Math.sin(fa) * 18 * sc; const fr = (10 + r() * 3) * sc; s += `<circle cx="${f1(fx + 2)}" cy="${f1(fy + 3)}" r="${f1(fr)}" fill="#3a2008" opacity=".25" filter="url(#hb2)"/><circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1(fr)}" fill="${['#c26f22', '#d99a36', '#a9561b'][i % 3]}"/><circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1(fr)}" fill="url(#hFruit)"/><circle cx="${f1(fx - fr * .35)}" cy="${f1(fy - fr * .35)}" r="${f1(fr * .28)}" fill="#fff" opacity=".6"/>`; }
		});
		return s;
	};
	/* wildflowers */
	const daisy = (x, y, r, c = '#fffaf0', cc = '#f2b705') => { let s = `<circle cx="${x + 2}" cy="${y + 3}" r="${r}" fill="#3a2410" opacity=".18" filter="url(#hb2)"/>`; for (let i = 0; i < 14; i++) { const a = i * 360 / 14, px = x + Math.cos(a * Math.PI / 180) * r * .58, py = y + Math.sin(a * Math.PI / 180) * r * .58; s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(r * .46)}" ry="${f1(r * .15)}" fill="${c}" stroke="#d8cdb4" stroke-width=".5" transform="rotate(${f1(a)} ${f1(px)} ${f1(py)})"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${f1(r * .3)}" fill="${cc}"/><circle cx="${f1(x + r * .06)}" cy="${f1(y + r * .06)}" r="${f1(r * .3)}" fill="#8a4b00" opacity=".25"/><circle cx="${f1(x - r * .09)}" cy="${f1(y - r * .09)}" r="${f1(r * .12)}" fill="#fff" opacity=".4"/>`; };
	const poppy = (x, y, r, c = '#d9462b') => { let s = `<circle cx="${x + 2}" cy="${y + 3}" r="${r * 1.1}" fill="#3a2410" opacity=".2" filter="url(#hb2)"/>`; [0, 90, 180, 270].forEach((a, i) => { const px = x + Math.cos(a * Math.PI / 180) * r * .42, py = y + Math.sin(a * Math.PI / 180) * r * .42; s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r * .72)}" fill="${i % 2 ? c : '#e8583a'}"/>`; }); return s + `<circle cx="${x}" cy="${y}" r="${f1(r * 1.05)}" fill="none" stroke="#a82a18" stroke-width="1" opacity=".4"/><path d="M${x - r * .7},${y - r * .3} Q${x - r * .2},${y - r * .9} ${x + r * .4},${y - r * .7}" stroke="#ff9b80" stroke-width="2" fill="none" opacity=".6"/><circle cx="${x}" cy="${y}" r="${f1(r * .28)}" fill="#2a1a0b"/><circle cx="${x}" cy="${y}" r="${f1(r * .14)}" fill="#6b7a3a"/>`; };
	const cornflower = (x, y, r) => { let s = ''; for (let i = 0; i < 11; i++) { const a = i * 360 / 11 * Math.PI / 180; s += `<path d="M${x},${y} L${f1(x + Math.cos(a - .18) * r)},${f1(y + Math.sin(a - .18) * r)} L${f1(x + Math.cos(a - .08) * r * 1.2)},${f1(y + Math.sin(a - .08) * r * 1.2)} L${f1(x + Math.cos(a) * r * 1.05)},${f1(y + Math.sin(a) * r * 1.05)} L${f1(x + Math.cos(a + .08) * r * 1.2)},${f1(y + Math.sin(a + .08) * r * 1.2)} L${f1(x + Math.cos(a + .18) * r)},${f1(y + Math.sin(a + .18) * r)}Z" fill="${i % 2 ? '#3f63ad' : '#5b82c8'}"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${f1(r * .26)}" fill="#2a2f6a"/>`; };
	const wild = (x, y, len, ang, seed = 1, sc = 1) => {
		const r = rng(seed * 7 + 1);
		let s = '';
		const heads = [];
		for (let k = 0; k < 8; k++) {
			const pts = stemPts(x, y, len * (.65 + r() * .45), ang + (r() - .5) * 46, (r() - .5) * 30, 10);
			s += stemPath(pts, 2.6 * sc, '#6f7d42');
			pts.forEach((q, i) => { if (i > 1 && i < 8 && r() > .45) s += leaf2(q[0], q[1], 22 * sc, 5 * sc, q[2] + (r() > .5 ? 38 : -38), '#7f8f50', '#b3bf86'); });
			heads.push(pts[pts.length - 1]);
		}
		heads.forEach(([hx, hy], k) => { s += [() => daisy(hx, hy, 24 * sc), () => poppy(hx, hy, 20 * sc), () => cornflower(hx, hy, 17 * sc), () => daisy(hx, hy, 15 * sc, '#f7c948', '#b06700')][k % 4](); });
		return s;
	};
	const BOT = { gavan, thyme, konar, forty: wild };

	/* ---------- honeycomb (hex cells) ---------- */
	const hexPts = (cx, cy, r, sx = 1, sy = 1) => [0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 + 30) * Math.PI / 180; return `${f1(cx + r * Math.cos(a) * sx)},${f1(cy + r * Math.sin(a) * sy)}`; }).join(' ');
	/* flat comb face: region w×h, cell radius r; capped fraction; honey colour set */
	const combFace = (w, h, r, o = {}) => {
		const p = id('c'), hc = HONEY[o.honey || 'forty'], rr = rng(o.seed || 5);
		const dx = r * Math.sqrt(3), dy = r * 1.5;
		let s = `<defs>${rg(`${p}h`, [[0, hc.glow], [.25, hc.c0], [.62, hc.c1], [.88, hc.c2], [1, hc.c3]], .5, .5, .6, .6, .62)}${rg(`${p}k`, [[0, '#fff3c8'], [.55, '#f4d98c'], [1, '#d9a94a']], .5, .5, .62, .38, .32)}${rg(`${p}w`, [[0, '#000', 0], [.7, '#000', 0], [1, '#4a2400', .5]], .6, .64, .62)}${lg(`${p}L`, [[0, '#fff6d8', .3], [.45, '#fff6d8', 0], [.7, '#3a1a00', 0], [1, '#3a1a00', .32]], 1, 1)}</defs>`;
		s += `<rect x="0" y="0" width="${w}" height="${h}" fill="#a8701f"/>`;
		const V = (cx, cy, rr, i) => { const a = (i * 60 + 30) * Math.PI / 180; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; };
		for (let row = -1; row * dy < h + r; row++) for (let col = -1; col * dx < w + r; col++) {
			const cx = col * dx + (row % 2 ? dx / 2 : 0) + (rr() - .5) * r * .06, cy = row * dy + (rr() - .5) * r * .06;
			const capped = o.capFn ? o.capFn(cx, cy, rr) : rr() < (o.capped ?? .5);
			s += `<polygon points="${hexPts(cx, cy, r * .99)}" fill="${rr() > .5 ? '#e7b552' : '#efc464'}"/>`;
			const [ax, ay] = V(cx, cy, r * .99, 3), [bx, by] = V(cx, cy, r * .99, 4), [ex, ey] = V(cx, cy, r * .99, 5);
			s += `<path d="M${f1(ax)},${f1(ay)} L${f1(bx)},${f1(by)} L${f1(ex)},${f1(ey)}" stroke="#fff3c4" stroke-width="${f1(Math.max(1, r * .05))}" fill="none" opacity=".75"/>`;
			if (capped) s += `<polygon points="${hexPts(cx, cy, r * .86)}" fill="url(#${p}k)" opacity="${f1(.88 + rr() * .12)}"/><polygon points="${hexPts(cx, cy, r * .86)}" fill="url(#${p}w)"/>`;
			else {
				s += `<polygon points="${hexPts(cx, cy, r * .86)}" fill="url(#${p}h)"/><polygon points="${hexPts(cx, cy, r * .86)}" fill="url(#${p}w)"/>`;
				const [a1, b1] = V(cx, cy, r * .74, 2), [a2, b2] = V(cx, cy, r * .74, 3), [a3, b3] = V(cx, cy, r * .74, 4);
				s += `<path d="M${f1(a1)},${f1(b1)} L${f1(a2)},${f1(b2)} L${f1(a3)},${f1(b3)}" stroke="#fff" stroke-width="${f1(Math.max(1.3, r * .075))}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><circle cx="${f1(cx + r * .32)}" cy="${f1(cy + r * .3)}" r="${f1(r * .06)}" fill="#fff" opacity=".6"/>`;
			}
		}
		s += `<rect x="0" y="0" width="${w}" height="${h}" filter="url(#hWax)" opacity=".3"/><rect x="0" y="0" width="${w}" height="${h}" fill="url(#${p}L)"/>`;
		return s;
	};
	window.SHAHD = { C, HONEY, hdefs, backdrop, bdDefs, jar, dipper, drip, BOT, thyme, gavan, konar, wild, daisy, poppy, cornflower, leaf, stemPts, stemPath, combFace, hexPts, lg, rg, id, f1, SERIF, FA, PCOL };

	/* ---------- product data ---------- */
	const PROD = [
		{ k: 'gavan', name: 'عسل گَوَن', sub: 'دامنه‌های سبلان', band: '#d9b452' },
		{ k: 'thyme', name: 'عسل آویشن', sub: 'ارتفاعات زاگرس', band: '#c98a1c' },
		{ k: 'konar', name: 'عسل کُنار', sub: 'جنوب ایران', band: '#8a3a12' },
		{ k: 'forty', name: 'عسل چهل‌گیاه', sub: 'مراتع البرز', band: '#b8790a' },
		{ k: 'comb', name: 'عسل موم‌دار', sub: 'شان طبیعی', band: '#c98f2e' },
		{ k: 'pollen', name: 'گرده‌ی گل', sub: 'چندگیاهی', band: '#8a9a5b' },
	];
	window.SHAHD.PROD = PROD;

	/* ---------- comb in wooden box ---------- */
	const combBox = (o = {}) => {
		const w = o.w || 400, h = o.h || 400, d = o.d || 70, p = id('b');
		let s = `<defs>${lg(`${p}w`, [[0, '#e8c08a'], [1, '#c9955a']], 1, 1)}${lg(`${p}ws`, [[0, '#a8713a'], [1, '#7a4b20']])}${lg(`${p}lb`, [[0, '#3c1e00', .2], [.3, '#fff', .1], [1, '#3c1e00', .25]], 1, 0)}<clipPath id="${p}c"><rect x="${-w / 2 + 26}" y="${-h + 26}" width="${w - 52}" height="${h - 52}"/></clipPath></defs>`;
		s += `<ellipse cx="${w * .25}" cy="4" rx="${w * .8}" ry="26" fill="#5a3410" opacity=".28" filter="url(#hb16)"/><rect x="${-w / 2 + 10}" y="-8" width="${w + 8}" height="14" fill="#3a2008" opacity=".4" filter="url(#hb4)"/>`;
		// side (depth) on right
		s += `<path d="M${w / 2},${-h} L${w / 2 + d * .55},${-h - d * .35} L${w / 2 + d * .55},${-d * .35} L${w / 2},0Z" fill="url(#${p}ws)"/><path d="M${-w / 2},${-h} L${-w / 2 + d * .55},${-h - d * .35} L${w / 2 + d * .55},${-h - d * .35} L${w / 2},${-h}Z" fill="#f0d3a2"/>`;
		s += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="url(#${p}w)"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" filter="url(#hWoodN)" opacity=".55"/>`;
		s += `<rect x="${-w / 2 + 26}" y="${-h + 26}" width="${w - 52}" height="${h - 52}" fill="#7a4b20"/>`;
		s += `<g clip-path="url(#${p}c)"><g transform="translate(${-w / 2 + 26} ${-h + 26})">${combFace(w - 52, h - 52, o.r || 17, { honey: 'forty', capFn: (x, y, r) => { const t = y / (h - 52) + (r() - .5) * .25; return t < .55 ? r() < .93 : r() < .2; }, seed: 9 })}</g>
			<rect x="${-w / 2 + 20}" y="${-h + 20}" width="${w - 40}" height="26" fill="#2a1200" opacity=".45" filter="url(#hb8)"/><rect x="${-w / 2 + 20}" y="${-h + 20}" width="22" height="${h - 40}" fill="#2a1200" opacity=".35" filter="url(#hb8)"/><rect x="${w / 2 - 34}" y="${-h + 20}" width="14" height="${h - 40}" fill="#2a1200" opacity=".2" filter="url(#hb4)"/></g>
			<rect x="${-w / 2 + 25}" y="${-h + 25}" width="${w - 50}" height="${h - 50}" fill="none" stroke="#5a3410" stroke-width="2" opacity=".6"/>`;
		s += `<path d="M${-w / 2 + 26},${-26} L${w / 2 - 26},${-26}" stroke="#fff3d6" stroke-width="2" opacity=".6"/>`;
		// paper band label
		const bw = w * .3;
		s += `<rect x="${-bw / 2}" y="${-h - 2}" width="${bw}" height="${h + 4}" fill="${C.cream}"/><path d="M${bw / 2},${-h - 2} L${bw / 2 + d * .55},${-h - d * .35 - 2} L${bw / 2 + d * .55 - bw},${-h - d * .35 - 2} L${-bw / 2},${-h - 2}Z" fill="#f4ead6"/>`;
		s += `<rect x="${-bw / 2}" y="${-h * .3}" width="${bw}" height="26" fill="${C.amber2}"/>`;
		s += `<text x="0" y="${-h * .3 + 18}" ${FA} font-size="15" font-weight="700" fill="#fff" text-anchor="middle" direction="rtl">۴۰۰ گرم</text>`;
		const hy = -h * .78;
		s += `<polygon points="${hexPts(0, hy, 16)}" fill="none" stroke="${C.ink}" stroke-width="1.8"/><path d="M0,${hy - 7} C6,${hy} 6,${hy + 7} 0,${hy + 7} C-6,${hy + 7} -6,${hy} 0,${hy - 7}Z" fill="${C.amber}"/>`;
		s += `<text x="0" y="${hy + 38}" ${SERIF} font-size="12.5" letter-spacing="5" fill="${C.ink}" text-anchor="middle">SHAHDINEH</text>`;
		s += `<text x="0" y="${-h * .48}" ${FA} font-size="34" font-weight="800" fill="${C.ink}" text-anchor="middle" direction="rtl">موم‌دار</text><text x="0" y="${-h * .48 - 46}" ${FA} font-size="20" font-weight="600" fill="${C.ink}" fill-opacity=".75" text-anchor="middle" direction="rtl">عسل</text>`;
		s += `<rect x="${-bw / 2}" y="${-h - 2}" width="${bw}" height="${h + 4}" fill="url(#${p}lb)"/>`;
		return s;
	};
	window.SHAHD.combBox = combBox;

	/* ---------- comb slab (perspective top + cut face) ---------- */
	const combSlab = (o = {}) => {
		const w = o.w || 360, fh = o.dpt || 220, th = o.th || 70, p = id('s'), hc = HONEY.forty, sk = o.skew ?? .32, k = o.sy ?? .4;
		let s = `<defs>${lg(`${p}cut`, [[0, '#f8cf5a'], [.5, '#e8a317'], [1, '#a86400']])}${lg(`${p}sd`, [[0, '#d48f12'], [1, '#8a4f00']])}<clipPath id="${p}tc"><rect width="${w}" height="${fh}" rx="10"/></clipPath></defs>`;
		s += `<ellipse cx="${w * .55}" cy="${th + 8}" rx="${w * .78}" ry="40" fill="#5a3410" opacity=".32" filter="url(#hb16)"/>`;
		s += `<path d="M${-34},${th - 6} C${-64},${th + 22} ${w * .2},${th + 50} ${w * .5},${th + 42} C${w * .8},${th + 36} ${w + 46},${th + 32} ${w + 24},${th - 4}Z" fill="${hc.c1}"/><path d="M${-34},${th - 6} C${-64},${th + 22} ${w * .2},${th + 50} ${w * .5},${th + 42}" fill="none" stroke="${hc.c3}" stroke-width="2" opacity=".4"/><path d="M${w * .08},${th + 20} C${w * .3},${th + 32} ${w * .6},${th + 30} ${w * .82},${th + 22}" stroke="#fff" stroke-width="3" opacity=".65" fill="none"/>`;
		// right side face
		s += `<path d="M${w},0 L${w + sk * fh},${-k * fh} L${w + sk * fh},${-k * fh + th} L${w},${th}Z" fill="url(#${p}sd)"/>`;
		for (let i = 1; i < 6; i++) s += `<path d="M${w + sk * fh * i / 6},${-k * fh * i / 6} l0,${th}" stroke="#7a4300" stroke-width="2" opacity=".5"/>`;
		// cut face
		s += `<path d="M0,0 L${w},0 L${w},${th} Q${w * .5},${th + 8} 0,${th}Z" fill="url(#${p}cut)"/>`;
		for (let x = 8; x < w; x += 17) s += `<path d="M${x},2 L${x + 1.5},${th - 2}" stroke="#b97a18" stroke-width="3.2" opacity=".85"/><path d="M${x + 5},6 L${x + 6},${th - 8}" stroke="#fff3b8" stroke-width="2" opacity=".6"/>`;
		s += `<path d="M0,${th * .5} L${w},${th * .5}" stroke="#b97a18" stroke-width="3.5" opacity=".8"/><path d="M0,${th * .5 - 3} L${w},${th * .5 - 3}" stroke="#fff3b8" stroke-width="1.4" opacity=".6"/>`;
		for (let i = 0; i < 6; i++) { const x = 24 + i * (w - 48) / 5; s += drip(hc, x, th - 6, x + 2, th + 14 + (i % 3) * 9, 5.5, { drop: i % 2 === 0 }); }
		// top face (front edge on y=0)
		s += `<g transform="matrix(1,0,${-sk},${k},${sk * fh},${-k * fh})"><g clip-path="url(#${p}tc)">${combFace(w, fh, o.r || 16, { honey: 'forty', capped: .5, seed: 3 })}</g></g>`;
		s += `<path d="M0,0 L${w},0" stroke="#fff3c4" stroke-width="3" opacity=".8"/>`;
		return s;
	};
	window.SHAHD.combSlab = combSlab;

	/* ---------- wooden spoon with pollen ---------- */
	const spoon = (o = {}) => {
		const p = id('sp'), r = rng(19);
		let s = `<defs>${lg(`${p}w`, [[0, '#7a4b20'], [.3, '#e2b47c'], [.6, '#c48a50'], [1, '#7e4f22']])}${rg(`${p}b`, [[0, '#d9a868'], [.7, '#b07a3e'], [1, '#7a4b20']])}</defs>`;
		s += `<ellipse cx="30" cy="40" rx="260" ry="34" fill="#5a3410" opacity=".25" filter="url(#hb16)"/>`;
		s += `<path d="M60,-8 L330,-14 Q350,-14 350,0 Q350,14 330,14 L60,8Z" fill="url(#${p}w)"/>`;
		s += `<ellipse cx="-40" cy="0" rx="110" ry="62" fill="url(#${p}b)"/>`;
		for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); const x = -40 + Math.cos(a) * d * 98, y = -8 + Math.sin(a) * d * 46 - (1 - d) * 30; const c = PCOL[Math.floor(r() * PCOL.length)]; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(5 + r() * 2.5)}" fill="${c}"/><circle cx="${f1(x - 1.6)}" cy="${f1(y - 1.8)}" r="1.8" fill="#fff" opacity=".45"/>`; }
		for (let i = 0; i < 40; i++) { const x = -200 + r() * 520, y = 40 + r() * 70; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(4 + r() * 2.5)}" fill="${PCOL[Math.floor(r() * PCOL.length)]}"/><circle cx="${f1(x + 4)}" cy="${f1(y + 3)}" r="5" fill="#5a3410" opacity=".15" filter="url(#hb2)"/>`; }
		return s;
	};
	window.SHAHD.spoon = spoon;

	/* ================= product shots ================= */
	/* honey running down the outside of the glass from the rim */
	const outsideDrip = (h, x, y0, len, w) => {
		const p = id('od');
		const d = `M${x - w * 1.9},${y0 - 4} C${x - w * 1.6},${y0 + 10} ${x - w * .9},${y0 + 16} ${x - w * .8},${y0 + 34} C${x - w * .7},${y0 + len * .5} ${x - w * .55},${y0 + len - w * 2} ${x - w * .9},${y0 + len - w * .6} C${x - w * 1.1},${y0 + len + w * .9} ${x + w * 1.1},${y0 + len + w * .9} ${x + w * .9},${y0 + len - w * .6} C${x + w * .55},${y0 + len - w * 2} ${x + w * .6},${y0 + len * .5} ${x + w * .7},${y0 + 34} C${x + w * .8},${y0 + 14} ${x + w * 1.5},${y0 + 8} ${x + w * 1.8},${y0 - 4}Z`;
		return `<defs>${lg(p, [[0, h.c3, .95], [.35, h.c1, .9], [.55, h.c0, .85], [1, h.c3, .95]], 1, 0)}</defs><path d="${d}" fill="#3a1a00" opacity=".25" transform="translate(4 5)" filter="url(#hb2)"/><path d="${d}" fill="url(#${p})"/><path d="M${x - w * .35},${y0 + 20} C${x - w * .3},${y0 + len * .5} ${x - w * .25},${y0 + len - w * 2} ${x - w * .45},${y0 + len - w * .8}" stroke="#fff" stroke-width="${w * .28}" fill="none" stroke-linecap="round" opacity=".75"/><ellipse cx="${x - w * .35}" cy="${y0 + len - w * .1}" rx="${w * .2}" ry="${w * .32}" fill="#fff" opacity=".85"/>`;
	};
	window.SHAHD.outsideDrip = outsideDrip;
	scenes['honey-product'] = (_, v) => {
		const W = 1000, H = 1000, pr = PROD[(v - 1) % 6];
		let obj = '', hz = 610, bd = {};
		if (!ALT) {
			if (pr.k === 'comb') obj = `<g transform="translate(480 880)">${combBox({ w: 480, h: 480, d: 90, r: 19 })}</g>`;
			else obj = `<g transform="translate(500 880)">${jar({ R: 215, Hb: 390, e: .12, honey: HONEY[pr.k] ? pr.k : null, pollen: pr.k === 'pollen', level: pr.k === 'pollen' ? .88 : .9, castColor: '#e3b04a', label: { name: pr.name, sub: pr.sub, band: pr.band, fs: pr.name.length > 9 ? .165 : .19 } })}</g>`;
		} else {
			hz = 500; bd = { bx: .36, bw: .46 };
			const h = HONEY[pr.k];
			if (h) {
				const B = BOT[pr.k], R = 185, Hb = 310, e = .24, jx = 560, jy = 830;
				const Rn = R * .8, yT = jy - Hb - R * .34 - R * .16;
				obj += `<g transform="translate(250 650)"><ellipse cx="10" cy="14" rx="150" ry="30" fill="#5a3410" opacity=".25" filter="url(#hb8)"/>${lidFlat()}</g>`;
				obj += `<g transform="translate(${jx} ${jy})">${jar({ R, Hb, e, honey: pr.k, open: true, level: .9, label: { name: pr.name, band: pr.band, fs: pr.name.length > 9 ? .165 : .19, top: .62, bot: .22 } })}</g>`;
				obj += outsideDrip(h, jx + Rn * .74, yT + Rn * e * .55, 150, 11);
				obj += `<g transform="translate(250 948) rotate(-7)"><ellipse cx="-58" cy="30" rx="96" ry="17" fill="${h.c1}" opacity=".95"/><ellipse cx="-80" cy="26" rx="44" ry="6" fill="#fff" opacity=".45"/><ellipse cx="120" cy="34" rx="230" ry="16" fill="#5a3410" opacity=".22" filter="url(#hb8)"/>${dipper(h, { len: 400, hr: 32, hl: 110 })}</g>`;
				obj += `<g transform="translate(975 975)">${B(0, 0, 330, -150, v, 1.3)}</g>`;
			} else if (pr.k === 'comb') {
				obj = `<g transform="translate(500 900)">${board(760, 300, .35)}</g><g transform="translate(300 790)">${combSlab({ w: 420, dpt: 300, th: 84, r: 19 })}</g><g transform="translate(90 975)">${thyme(0, 0, 330, -16, 3, 1.3)}</g>`;
			} else {
				obj = `<g transform="translate(320 760)">${jar({ R: 170, Hb: 280, e: .24, pollen: true, open: true, level: .9, castColor: '#e3b04a', caustic: false, label: { name: pr.name, band: pr.band, fs: .19, top: .62, bot: .22 } })}</g><g transform="translate(640 880) scale(1.2)">${spoon()}</g><g transform="translate(975 975)">${wild(0, 0, 300, -152, 4, 1.15)}</g>`;
			}
		}
		return `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${hdefs()}${bdDefs()}${backdrop(W, H, hz, bd)}${obj}</svg>${grainFx(.22, .8)}${vignette(.22, '70,40,10')}`;
	};
	/* wooden board in perspective, centred at origin (front edge y=0) */
	const board = (w, d, k) => {
		const p = id('bd');
		return `<defs>${lg(`${p}t`, [[0, '#c9925a'], [.5, '#ddb07a'], [1, '#b97f45']], 1, .3)}${lg(`${p}f`, [[0, '#8a5a2b'], [1, '#6a4220']])}</defs><ellipse cx="40" cy="30" rx="${w * .55}" ry="40" fill="#4a2a0a" opacity=".3" filter="url(#hb16)"/><path d="M${-w / 2},0 L${-w / 2 + d * k},${-d * .45} L${w / 2 + d * k},${-d * .45} L${w / 2},0Z" fill="url(#${p}t)"/><path d="M${-w / 2},0 L${-w / 2 + d * k},${-d * .45} L${w / 2 + d * k},${-d * .45} L${w / 2},0Z" filter="url(#hWoodN)" opacity=".6"/><path d="M${-w / 2},0 L${w / 2},0 L${w / 2},26 L${-w / 2},26Z" fill="url(#${p}f)"/><path d="M${w / 2},0 L${w / 2 + d * k},${-d * .45} L${w / 2 + d * k},${-d * .45 + 26} L${w / 2},26Z" fill="#5a3818"/><path d="M${-w / 2 + 4},1 L${w / 2 - 2},1" stroke="#f3d3a0" stroke-width="2" opacity=".7"/>`;
	};
	window.SHAHD.board = board;
	const lidFlat = () => {
		const p = id('lf'), Rl = 150, e = .27, lh = 56;
		return `<defs>${lg(`${p}w`, WOOD, 1, 0)}${lg(`${p}wt`, WOOD_TOP, .3, 1)}</defs><path d="M${-Rl},${-lh} L${-Rl},0 A${Rl},${Rl * e} 0 0 0 ${Rl},0 L${Rl},${-lh}Z" fill="url(#${p}w)"/><ellipse cx="0" cy="${-lh}" rx="${Rl}" ry="${Rl * e}" fill="url(#${p}wt)"/><ellipse cx="0" cy="${-lh}" rx="${Rl}" ry="${Rl * e}" filter="url(#hWoodN)" opacity=".35"/><path d="M${-Rl + 2},${-lh + 1} A${Rl - 2},${(Rl - 2) * e} 0 0 0 ${Rl - 2},${-lh + 1}" fill="none" stroke="#fff2d4" stroke-width="3" opacity=".75"/><polygon points="${hexPts(0, -lh, 44, 1, e)}" fill="none" stroke="#7a4a1c" stroke-width="2.4" opacity=".7"/>`;
	};
})();

/* ---------- honey: hero, comb macro, apiary ---------- */
(() => {
	const S = window.SHAHD, { HONEY, hdefs, backdrop, bdDefs, jar, dipper, drip, thyme, gavan, wild, combFace, combSlab, board, lg, rg, f1, id } = S;

	/* folding honey ribbon landing on a surface */
	const ribbon = (h, x0, y0, x1, y1, w) => {
		let s = drip(h, x0, y0, x1, y1 - 6, w, { bend: 4 });
		const p = id('rb');
		s += `<defs>${rg(p, [[0, h.c0], [.6, h.c1], [1, h.c2]])}</defs>`;
		for (let i = 0; i < 3; i++) s += `<ellipse cx="${x1 + (i - 1) * w * .6}" cy="${y1 - i * w * .55}" rx="${w * (2.4 - i * .5)}" ry="${w * (.9 - i * .15)}" fill="url(#${p})" stroke="${h.c2}" stroke-width="1"/><path d="M${x1 + (i - 1) * w * .6 - w * 1.4},${y1 - i * w * .55 - w * .3} q${w},${-w * .5} ${w * 2},0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`;
		return s;
	};

	scenes['honey-hero'] = () => {
		const W = 2000, H = 1125, hz = 600;
		const th = HONEY.thyme;
		let o = '';
		o += `<g transform="translate(1530 850)">${jar({ R: 170, Hb: 270, e: .14, honey: 'konar', label: { name: 'عسل کُنار', sub: 'جنوب ایران', band: '#8a3a12', fs: .2, weight: '۲۵۰ گرم' } })}</g>`;
		o += `<g transform="translate(470 935)">${jar({ R: 205, Hb: 380, e: .14, honey: 'gavan', label: { name: 'عسل گَوَن', sub: 'دامنه‌های سبلان', band: '#d9b452', fs: .19 } })}</g>`;
		o += `<g transform="translate(1600 1085)">${board(820, 300, .3)}</g><g transform="translate(1300 985)">${combSlab({ w: 540, dpt: 320, th: 92, r: 20 })}</g>`;
		const jx = 1000, jy = 1010, R = 255, Hb = 440, e = .17;
		const yh = jy - 16 - (Hb - 16) * .88;
		o += `<g transform="translate(${jx} ${jy})">${jar({ R, Hb, e, honey: 'thyme', open: true, level: .88, label: { name: 'عسل آویشن', sub: 'ارتفاعات زاگرس', band: '#c98a1c', fs: .18 } })}</g>`;
		o += ribbon(th, jx - 70, 236, jx - 44, yh, 10);
		o += `<g transform="translate(${jx - 34} 216) rotate(-16)">${dipper(th, { len: 520, hr: 44, hl: 140 })}</g>`;
		o += `<g transform="translate(60 1125)">${thyme(0, 0, 520, -10, 2, 1.6)}</g><g transform="translate(700 1120)">${thyme(0, 0, 300, -10, 5, 1.3)}</g>`;
		o += `<g transform="translate(150 960)">${gavan(0, 0, 300, -70, 2, 1.2)}</g>`;
		return `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${hdefs()}${bdDefs()}${backdrop(W, H, hz, { bx: .26, bw: .44, poolOp: .5 })}${o}</svg>${grainFx(.22, .8)}${vignette(.3, '70,40,10')}`;
	};

	scenes['honey-comb'] = () => {
		const W = 2000, H = 1125, r = 64;
		const face = combFace(2400, 1500, r, { honey: 'thyme', seed: 21, capFn: (x, y, rr) => { const d = Math.hypot(x - 1900, y - 200); return d < 520 ? rr() < .85 : rr() < .06; } });
		const p = id('cm');
		return `<div class="abs" style="inset:0;background:#3a1a00"></div>
		<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${hdefs()}
			<defs>${rg(`${p}m`, [[0, '#fff'], [.5, '#fff'], [.85, '#000'], [1, '#000']], .46, .52, .62)}<mask id="${p}k"><rect width="${W}" height="${H}" fill="url(#${p}m)"/></mask>${rg(`${p}g`, [[0, '#fff2b0', .55], [.5, '#ffb52e', .18], [1, '#ffb52e', 0]], .4, .45, .6)}</defs>
			<g transform="translate(-200 -180) rotate(-6 1200 750)"><g filter="url(#hb8)">${face}</g></g>
			<g mask="url(#${p}k)"><g transform="translate(-200 -180) rotate(-6 1200 750)">${face}</g></g>
			<rect width="${W}" height="${H}" fill="url(#${p}g)" style="mix-blend-mode:screen"/>
		</svg>${vignette(.55, '40,15,0', '80% 75%')}${grainFx(.2, .8)}`;
	};

	/* ---------- apiary illustration ---------- */
	const ridge = (seed, W, y0, amp, n, rough = .5) => {
		const r = rng(seed);
		let pts = [[0, y0 + (r() - .5) * amp], [W, y0 + (r() - .5) * amp]];
		let a = amp;
		for (let k = 0; k < n; k++) {
			const np = [];
			for (let i = 0; i < pts.length - 1; i++) { np.push(pts[i]); np.push([(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2 + (r() - .5) * a]); }
			np.push(pts[pts.length - 1]); pts = np; a *= rough;
		}
		return pts;
	};
	S.ridge = ridge;
	const ridgePath = (pts, H) => `M0,${H} L${pts.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')} L${pts[pts.length - 1][0]},${H}Z`;
	S.ridgePath = ridgePath;
	const hive = (x, y, s, c, o = {}) => {
		const w = 120 * s, hb = 64 * s, n = o.n || 2, side = 22 * s;
		let g = `<g>`;
		g += `<path d="M${x - w * .5},${y + 4} L${x - w * 1.6},${y + 40 * s} L${x - w * .6},${y + 40 * s} L${x + w * .5},${y + 4}Z" fill="#3a2a10" opacity=".22"/>`;
		g += `<rect x="${x - w * .42}" y="${y - 26 * s}" width="${8 * s}" height="${26 * s}" fill="#5a3c1e"/><rect x="${x + w * .34}" y="${y - 26 * s}" width="${8 * s}" height="${26 * s}" fill="#5a3c1e"/><rect x="${x - w * .55}" y="${y - 32 * s}" width="${w * 1.1 + side}" height="${8 * s}" fill="#6a4a26"/>`;
		for (let i = 0; i < n; i++) {
			const by = y - 32 * s - (i + 1) * hb;
			g += `<rect x="${x - w / 2}" y="${by}" width="${w}" height="${hb}" fill="${c[i % c.length]}"/><path d="M${x + w / 2},${by} l${side},${-side * .5} l0,${hb} l${-side},${side * .5}Z" fill="#fff1d2" opacity=".85"/><path d="M${x + w / 2},${by} l${side},${-side * .5} l0,${hb} l${-side},${side * .5}Z" fill="${c[i % c.length]}" opacity=".45"/>`;
			g += `<rect x="${x - w / 2}" y="${by}" width="${w}" height="${hb}" fill="url(#apShade)"/><rect x="${x - 16 * s}" y="${by + hb * .35}" width="${32 * s}" height="${7 * s}" rx="${3 * s}" fill="#3a2410" opacity=".5"/><rect x="${x - w / 2}" y="${by + hb - 2 * s}" width="${w}" height="${2 * s}" fill="#3a2410" opacity=".25"/>`;
		}
		const ty = y - 32 * s - n * hb;
		g += `<rect x="${x - w / 2 - 6 * s}" y="${ty - 16 * s}" width="${w + 12 * s}" height="${16 * s}" fill="${o.roof || '#e9e2d0'}"/><path d="M${x - w / 2 - 6 * s},${ty - 16 * s} l${side},${-side * .5} l${w + 12 * s},0 l${-side},${side * .5}Z" fill="#fff8e8"/><path d="M${x + w / 2 + 6 * s},${ty - 16 * s} l${side},${-side * .5} l0,${16 * s} l${-side},${side * .5}Z" fill="#fff3da"/><rect x="${x - w / 2 - 6 * s}" y="${ty - 2 * s}" width="${w + 12 * s}" height="${3 * s}" fill="#3a2410" opacity=".25"/>`;
		g += `<rect x="${x - w * .3}" y="${y - 32 * s - 6 * s}" width="${w * .6}" height="${4 * s}" fill="#2a1a0b"/>`;
		g += `</g>`;
		return g;
	};
	S.hive = hive;
	const bees = (x, y, n, rad, seed, sc = 1) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = r() * rad, bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d * .6; s += `<path d="M${f1(bx - 16 * sc)},${f1(by + 7 * sc)} q${f1(8 * sc)},${f1(-10 * sc)} ${f1(14 * sc)},${f1(-6 * sc)}" stroke="#fff3c4" stroke-width="${f1(1 * sc)}" fill="none" opacity=".35"/><ellipse cx="${f1(bx - .8 * sc)}" cy="${f1(by - 2.4 * sc)}" rx="${f1(3 * sc)}" ry="${f1(1.6 * sc)}" fill="#fff" opacity=".7"/><ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(3.6 * sc)}" ry="${f1(2.3 * sc)}" fill="#e3a12a"/><rect x="${f1(bx - .6 * sc)}" y="${f1(by - 2.3 * sc)}" width="${f1(1.3 * sc)}" height="${f1(4.6 * sc)}" fill="#2a1a0b"/><circle cx="${f1(bx - 3.4 * sc)}" cy="${f1(by)}" r="${f1(1.5 * sc)}" fill="#2a1a0b"/>`; } return s; };
	S.bees = bees;
	const flowersField = (seed, x0, x1, y0, y1, n, s0, s1, cols) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const t = r(), y = y0 + (y1 - y0) * t, x = x0 + r() * (x1 - x0), rr = s0 + (s1 - s0) * t * (0.6 + r() * .6); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${cols[Math.floor(r() * cols.length)]}" opacity="${f1(.7 + r() * .3)}"/>`; } return s; };
	S.flowersField = flowersField;

	const poplar = (x, y, h, w) => `<ellipse cx="${x}" cy="${y - h / 2}" rx="${w}" ry="${h / 2}" fill="#5c6b38"/><path d="M${x + w * .2},${y - h * .95} Q${x + w * 1.05},${y - h * .5} ${x + w * .3},${y - 4}" stroke="#d9d08a" stroke-width="${w * .35}" fill="none" opacity=".55"/><rect x="${x - 2}" y="${y - 6}" width="4" height="14" fill="#4a3a20"/>`;
	S.poplar = poplar;
	const drifts = (seed, x0, x1, y0, y1, n, per, s0, s1, cols) => { const r = rng(seed); let s = ''; for (let k = 0; k < n; k++) { const cx = x0 + r() * (x1 - x0), t = r(), cy = y0 + (y1 - y0) * t, c = cols[Math.floor(r() * cols.length)], spread = 30 + t * 140; for (let i = 0; i < per; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * spread; const y = cy + Math.sin(a) * d * .35, sz = (s0 + (s1 - s0) * ((y - y0) / (y1 - y0))) * (.6 + r() * .6); s += `<circle cx="${f1(cx + Math.cos(a) * d)}" cy="${f1(y)}" r="${f1(Math.max(.8, sz))}" fill="${c}" opacity="${f1(.75 + r() * .25)}"/>`; } } return s; };
	S.drifts = drifts;
	const hive2 = (x, y, s, c, o = {}) => {
		const w = 130 * s, hb = 66 * s, n = o.n || 2, side = 26 * s;
		let g = `<path d="M${x - w * .55},${y + 2} L${x - w * 2.1},${y + 70 * s} L${x - w * .9},${y + 76 * s} L${x + w * .55 + side},${y + 2}Z" fill="#3a2a10" opacity=".26" filter="url(#hb4)"/>`;
		g += `<rect x="${x - w * .46}" y="${y - 24 * s}" width="${14 * s}" height="${24 * s}" fill="#8a7a66"/><rect x="${x + w * .32}" y="${y - 24 * s}" width="${14 * s}" height="${24 * s}" fill="#8a7a66"/><rect x="${x - w * .56}" y="${y - 32 * s}" width="${w * 1.12}" height="${9 * s}" fill="#6a4a26"/><path d="M${x + w * .56},${y - 32 * s} l${side},${-side * .5} l0,${9 * s} l${-side},${side * .5}Z" fill="#8a6a3e"/>`;
		g += `<path d="M${x - w * .3},${y - 32 * s} L${x - w * .38},${y - 22 * s} L${x + w * .38},${y - 22 * s} L${x + w * .3},${y - 32 * s}Z" fill="${c[0]}"/>`;
		for (let i = 0; i < n; i++) {
			const by = y - 32 * s - (i + 1) * hb, cc = c[i % c.length];
			g += `<rect x="${x - w / 2}" y="${by}" width="${w}" height="${hb}" fill="${cc}"/><rect x="${x - w / 2}" y="${by}" width="${w}" height="${hb}" fill="url(#apShade)"/>`;
			g += `<path d="M${x + w / 2},${by} l${side},${-side * .5} l0,${hb} l${-side},${side * .5}Z" fill="${cc}"/><path d="M${x + w / 2},${by} l${side},${-side * .5} l0,${hb} l${-side},${side * .5}Z" fill="#fff4d8" opacity=".55"/><path d="M${x + w / 2 + side},${by - side * .5} l0,${hb}" stroke="#fffaf0" stroke-width="${2.4 * s}" opacity=".9"/>`;
			g += `<rect x="${x - 18 * s}" y="${by + hb * .3}" width="${36 * s}" height="${8 * s}" rx="${4 * s}" fill="#3a2410" opacity=".45"/><rect x="${x - w / 2}" y="${by + hb - 2.5 * s}" width="${w}" height="${2.5 * s}" fill="#3a2410" opacity=".3"/>`;
		}
		const ty = y - 32 * s - n * hb;
		g += `<rect x="${x - w / 2 - 7 * s}" y="${ty - 17 * s}" width="${w + 14 * s}" height="${17 * s}" fill="${o.roof || '#d9d2c0'}"/><rect x="${x - w / 2 - 7 * s}" y="${ty - 17 * s}" width="${w + 14 * s}" height="${17 * s}" fill="url(#apShade)"/><path d="M${x - w / 2 - 7 * s},${ty - 17 * s} l${side},${-side * .5} l${w + 14 * s},0 l${-side},${side * .5}Z" fill="#fff6e2"/><path d="M${x + w / 2 + 7 * s},${ty - 17 * s} l${side},${-side * .5} l0,${17 * s} l${-side},${side * .5}Z" fill="#fff0d0"/><path d="M${x - w / 2 - 7 * s + side},${ty - 17 * s - side * .5} l${w + 14 * s},0" stroke="#fffaf0" stroke-width="${2.5 * s}"/>`;
		g += `<rect x="${x - w * .32}" y="${y - 32 * s - 7 * s}" width="${w * .64}" height="${5 * s}" fill="#1e1206"/>`;
		return g;
	};
	S.hive2 = hive2;

	scenes['honey-apiary'] = () => {
		const W = 1600, H = 1200, sunX = 1110, sunY = 235;
		const far = ridge(3, W, 430, 300, 8, .55), far2 = ridge(5, W, 520, 200, 8, .52), mid = ridge(9, W, 615, 120, 8, .5), near = ridge(14, W, 715, 60, 7, .45);
		let s = `<defs>
			${lg('apSky', [[0, '#e3a062'], [.35, '#f2c483'], [.7, '#fbe1b0'], [1, '#fff0d2']])}
			${rg('apSun', [[0, '#fffbea'], [.06, '#fff4cf', .95], [.25, '#ffd68a', .5], [1, '#ffd68a', 0]], .5, .5, .5)}
			${lg('apFar', [[0, '#e9c3a6'], [1, '#efd2b2']])}${lg('apFar2', [[0, '#dcb18c'], [1, '#e4c09a']])}${lg('apMid', [[0, '#b98762'], [1, '#c99f78']])}${lg('apNear', [[0, '#8d985c'], [1, '#a8a86c']])}
			${lg('apMeadow', [[0, '#a9ac6a'], [.35, '#8e9b5c'], [1, '#56632f']])}
			${lg('apShade', [[0, '#2a1a08', .28], [.6, '#2a1a08', .12], [1, '#2a1a08', .05]], 1, 0)}
			${lg('apHaze', [[0, '#fff1d2', 0], [1, '#fff1d2', .6]])}
			${lg('apPath', [[0, '#e8cf9c'], [1, '#d6b47a']])}
			${lg('apSnowG', [[0, '#fff', 1], [1, '#fff', 0]])}<mask id="apHi"><rect width="${W}" height="${Math.min(...far.map(q => q[1])) + 70}" fill="url(#apSnowG)"/></mask>
		</defs>`;
		s += `<rect width="${W}" height="${H}" fill="url(#apSky)"/><circle cx="${sunX}" cy="${sunY}" r="620" fill="url(#apSun)"/><circle cx="${sunX}" cy="${sunY}" r="58" fill="#fffcef"/>`;
		[[260, 170, 260], [700, 120, 200], [1300, 210, 300], [520, 300, 180]].forEach(([x, y, r]) => { s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="14" fill="#fff3dc" opacity=".55" filter="url(#hb8)"/><ellipse cx="${x + 20}" cy="${y + 8}" rx="${r * .8}" ry="6" fill="#ffd28c" opacity=".5" filter="url(#hb4)"/>`; });
		s += `<path d="${ridgePath(far, H)}" fill="url(#apFar)"/><path d="${ridgePath(far, H)}" fill="#fffaf0" opacity=".85" mask="url(#apHi)"/><path d="M${far.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')}" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
		s += `<rect y="380" width="${W}" height="220" fill="url(#apHaze)" opacity=".8"/><circle cx="${sunX}" cy="${sunY + 200}" r="420" fill="url(#apSun)" opacity=".55" style="mix-blend-mode:screen"/>`;
		s += `<path d="${ridgePath(far2, H)}" fill="url(#apFar2)"/><path d="M${far2.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')}" stroke="#ffe9c6" stroke-width="3" fill="none" opacity=".7"/>`;
		s += `<rect y="480" width="${W}" height="200" fill="url(#apHaze)" opacity=".7"/>`;
		s += `<path d="${ridgePath(mid, H)}" fill="url(#apMid)"/><path d="M${mid.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')}" stroke="#ffe2b0" stroke-width="3.5" fill="none" opacity=".8"/>`;
		s += `<rect y="580" width="${W}" height="190" fill="url(#apHaze)" opacity=".55"/>`;
		s += `<path d="${ridgePath(near, H)}" fill="url(#apNear)"/><path d="M${near.map(q => `${f1(q[0])},${f1(q[1])}`).join(' L')}" stroke="#f3e2a8" stroke-width="3" fill="none" opacity=".8"/>`;
		[[70, 760, 150, 18], [105, 762, 190, 22], [140, 758, 130, 16], [1420, 742, 160, 18], [1458, 746, 200, 22], [1500, 744, 140, 16], [1540, 748, 170, 18]].forEach(([x, y, h2, w2]) => { s += poplar(x, y, h2, w2); });
		s += `<g opacity=".8">${drifts(4, 0, W, 715, 780, 30, 14, 1.3, 2.4, ['#f2c230', '#fff8e8', '#c48ab4'])}</g>`;
		const hill = `M0,830 C300,800 600,770 900,772 C1150,774 1400,790 1600,800 L1600,${H} L0,${H}Z`;
		s += `<path d="${hill}" fill="url(#apMeadow)"/><path d="M0,830 C300,800 600,770 900,772 C1150,774 1400,790 1600,800" stroke="#eee3a6" stroke-width="4" fill="none" opacity=".8"/>`;
		s += `<path d="M760,${H} C780,1060 820,940 880,860 C900,830 930,800 950,782 L975,782 C960,805 945,835 935,865 C900,950 900,1070 980,${H}Z" fill="url(#apPath)" opacity=".85"/>`;
		s += drifts(7, 0, W, 790, 1200, 70, 26, 2, 8, ['#f2c230', '#fff8e8', '#c48ab4', '#b0709f', '#d9462b', '#f7d76b', '#fff8e8']);
		const C1 = [['#e9c78f', '#dcb47c'], ['#a9bccb', '#9bb0c1'], ['#efe2c8', '#e2d1b0'], ['#b7c28f', '#a8b480'], ['#e8a317', '#dc9612'], ['#d9a89a', '#cc988a']];
		[[180, 816, .5], [330, 806, .5], [480, 796, .48], [640, 790, .46], [1060, 790, .46], [1210, 796, .48], [1360, 804, .5]].forEach(([x, y, sc], i) => { s += hive2(x, y, sc, C1[i % C1.length], { n: 2 + (i % 2) }); });
		[[230, 1020, 1.25, 4], [560, 1000, 1.1, 0], [1180, 990, 1.1, 2], [1470, 1035, 1.3, 1]].forEach(([x, y, sc, ci], i) => { s += hive2(x, y, sc, C1[ci], { n: 2 + ((i + 1) % 2) }); });
		s += bees(420, 830, 26, 380, 3, .9) + bees(1150, 840, 26, 360, 5, .9) + bees(560, 900, 14, 120, 8, 1.4) + bees(1200, 890, 14, 120, 9, 1.4);
		s += `<g filter="url(#hb4)">${drifts(11, -40, W + 40, 1120, 1200, 14, 10, 10, 18, ['#f2c230', '#fff8e8', '#c48ab4', '#d9462b'])}</g>`;
		for (let i = 0; i < 90; i++) { const r = rng(i + 40), x = r() * W, h2 = 50 + r() * 130; s += `<path d="M${f1(x)},${H + 4} q${f1((r() - .5) * 40)},${f1(-h2 * .6)} ${f1((r() - .5) * 70)},${f1(-h2)}" stroke="${r() > .5 ? '#56632f' : '#7d8a4c'}" stroke-width="${f1(3 + r() * 4)}" fill="none" stroke-linecap="round" opacity=".9"/>`; }
		for (let i = 0; i < 7; i++) s += `<path d="M${sunX},${sunY} L${sunX - 1100 + i * 240},${H} L${sunX - 1010 + i * 240},${H}Z" fill="#fff4d6" opacity=".07"/>`;
		return `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${hdefs()}${s}</svg>${grainFx(.26, .75)}${vignette(.28, '80,40,0')}`;
	};
})();

/* ---------- honey: journal covers + process ---------- */
(() => {
	const S = window.SHAHD, { C, HONEY, hdefs, backdrop, bdDefs, jar, dipper, drip, thyme, gavan, konar, wild, daisy, poppy, cornflower, leaf, combFace, hexPts, lg, rg, f1, id, FA, SERIF } = S;
	const svg = (W, H, inner, post = '') => `<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${hdefs()}${inner}</svg>${post}`;
	const bokeh = (seed, W, H, n, cols, r0, r1, op = .5) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(r0 + r() * (r1 - r0))}" fill="${cols[Math.floor(r() * cols.length)]}" opacity="${f1(op * (.4 + r() * .6))}"/>`; return `<g filter="url(#hb8)">${s}</g>`; };

	/* ---- bee (side view, facing left; origin = thorax centre) ---- */
	const bee = (sc = 1) => {
		const p = id('bee'), r = rng(42);
		let s = `<defs>${rg(`${p}t`, [[0, '#e8b356'], [.6, '#a8681e'], [1, '#5a3410']], .45, .4, .6)}${lg(`${p}a`, [[0, '#f0b43c'], [.5, '#d48e1c'], [1, '#7a4a0c']], 0, 1)}<clipPath id="${p}ac"><ellipse cx="108" cy="22" rx="104" ry="66" transform="rotate(16 108 22)"/></clipPath>${lg(`${p}w`, [[0, '#fff', .42], [1, '#fff', .12]], 1, 1)}</defs>`;
		const legs = [[-30, 40, -60, 110, -78, 160], [10, 50, 0, 120, 6, 168], [50, 44, 90, 112, 74, 168]];
		legs.forEach(([a, b, c, d, e2, f], i) => { s += `<path d="M${a},${b} L${c},${d} L${e2},${f}" stroke="#2a1a0b" stroke-width="${i === 2 ? 9 : 7}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; });
		s += `<ellipse cx="86" cy="118" rx="22" ry="17" fill="#f08a1c" transform="rotate(-20 86 118)"/><ellipse cx="80" cy="112" rx="8" ry="5" fill="#ffd27a" opacity=".8"/>`;
		s += `<ellipse cx="108" cy="22" rx="104" ry="66" fill="url(#${p}a)" transform="rotate(16 108 22)"/>`;
		s += `<g clip-path="url(#${p}ac)">${[70, 112, 152, 190].map(x => `<rect x="${x}" y="-80" width="${x > 180 ? 60 : 22}" height="200" fill="#2a1608" transform="rotate(16 108 22)"/>`).join('')}<ellipse cx="96" cy="-14" rx="70" ry="16" fill="#fff" opacity=".35" transform="rotate(16 108 22)"/></g>`;
		for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, x = 108 + Math.cos(a) * 104, y = 22 + Math.sin(a) * 66; s += `<path d="M${f1(x)},${f1(y)} l${f1(Math.cos(a) * 7)},${f1(Math.sin(a) * 7)}" stroke="#e9c48a" stroke-width="1.2" opacity=".55" transform="rotate(16 108 22)"/>`; }
		s += `<circle cx="0" cy="0" r="64" fill="url(#${p}t)"/>`;
		for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 66; const x = Math.cos(a) * d, y = Math.sin(a) * d; s += `<path d="M${f1(x)},${f1(y)} l${f1(Math.cos(a) * 8 + (r() - .5) * 4)},${f1(Math.sin(a) * 8 + (r() - .5) * 4)}" stroke="${r() > .4 ? '#f5d08a' : '#6a3c10'}" stroke-width="1.3" opacity=".7"/>`; }
		s += `<ellipse cx="-92" cy="14" rx="44" ry="50" fill="#2a1a0b"/><ellipse cx="-96" cy="2" rx="27" ry="37" fill="#140b04"/><path d="M-112,-22 Q-100,-34 -86,-26" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/><ellipse cx="-100" cy="-6" rx="5" ry="9" fill="#fff" opacity=".35"/>`;
		for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2; s += `<path d="M${f1(-92 + Math.cos(a) * 44)},${f1(14 + Math.sin(a) * 50)} l${f1(Math.cos(a) * 6)},${f1(Math.sin(a) * 6)}" stroke="#7a5a30" stroke-width="1" opacity=".6"/>`; }
		s += `<path d="M-112,-30 L-138,-92 L-182,-108" stroke="#2a1a0b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-100,-34 L-116,-100 L-152,-128" stroke="#2a1a0b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
		s += `<path d="M-14,-40 C30,-150 180,-210 250,-170 C290,-140 210,-80 30,-34Z" fill="url(#${p}w)" stroke="#fff" stroke-opacity=".75" stroke-width="2"/><path d="M-4,-44 C60,-120 150,-160 230,-160 M40,-60 C90,-110 160,-130 200,-128 M100,-140 L120,-80" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" fill="none"/>`;
		s += `<path d="M10,-34 C60,-110 150,-120 190,-96 C214,-78 150,-46 34,-26Z" fill="url(#${p}w)" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/>`;
		return `<g transform="scale(${sc})">${s}</g>`;
	};
	S.bee = bee;

	/* ---- tea glass (estekan) top-down ---- */
	const estekan = (x, y, r) => `<circle cx="${x + 12}" cy="${y + 16}" r="${r * 1.5}" fill="#3a2008" opacity=".22" filter="url(#hb16)"/><circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="#f4efe6"/><circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="none" stroke="#c9b48a" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="none" stroke="#e2d6c0" stroke-width="2"/><circle cx="${x + 6}" cy="${y + 8}" r="${r}" fill="#3a1a00" opacity=".25" filter="url(#hb8)"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#hTea)"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/><path d="M${x - r * .6},${y - r * .5} A${r * .8},${r * .8} 0 0 1 ${x + r * .2},${y - r * .78}" stroke="#fff" stroke-width="5" fill="none" opacity=".8" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r * .82}" fill="none" stroke="#fff4d0" stroke-width="2" opacity=".35"/>`;

	scenes['honey-journal'] = (_, v) => {
		const W = 1600, H = 1000;
		switch ((v - 1) % 6) {
			case 0: { // honey drip macro
				const h = HONEY.thyme;
				let s = `<defs>${rg('jd0', [[0, '#8a4d0c'], [.5, '#4a2404'], [1, '#1c0d02']], .45, .4, .8)}${rg('jdp', [[0, h.c0], [.5, h.c1], [1, h.c3]], .5, .3, .7)}</defs><rect width="${W}" height="${H}" fill="url(#jd0)"/>`;
				s += bokeh(5, W, H, 26, ['#ffb84a', '#ffd27a', '#e8891c'], 20, 70, .5);
				s += `<path d="M0,${H - 150} C400,${H - 190} 1200,${H - 190} ${W},${H - 150} L${W},${H} L0,${H}Z" fill="url(#jdp)"/><path d="M0,${H - 150} C400,${H - 190} 1200,${H - 190} ${W},${H - 150}" stroke="#ffe7a8" stroke-width="3" fill="none" opacity=".6"/>`;
				s += `<ellipse cx="560" cy="${H - 168}" rx="220" ry="26" fill="#fff3c4" opacity=".25" filter="url(#hb8)"/>`;
				s += `<g transform="translate(700 210) rotate(-5)">${dipper(h, { len: 1100, hr: 92, hl: 300 })}</g>`;
				const x0 = 545, y0 = 330;
				for (let i = 0; i < 3; i++) s += `<ellipse cx="${560 + (i - 1) * 16}" cy="${H - 178 - i * 14}" rx="${70 - i * 18}" ry="${18 - i * 3}" fill="${h.c1}" stroke="${h.c2}" stroke-width="1.5"/><path d="M${520 + (i - 1) * 16},${H - 186 - i * 14} q30,-10 70,0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>`;
				s += `<g filter="url(#hb4)" opacity=".7">${drip(h, x0, y0, 560, H - 190, 30, { bend: 10 })}</g>${drip(h, x0, y0, 560, H - 190, 22, { bend: 10 })}`;
				s += drip(h, 450, 300, 452, 460, 12, { drop: true });
				return svg(W, H, s, `${vignette(.45, '20,8,0')}${grainFx(.22, .8)}`);
			}
			case 1: { // bee on thyme
				let s = `<defs>${rg('jb0', [[0, '#e9e2b4'], [.55, '#b7bd84'], [1, '#6f7a45']], .6, .35, .9)}</defs><rect width="${W}" height="${H}" fill="url(#jb0)"/>`;
				s += bokeh(9, W, H, 30, ['#fff3c4', '#d9d39a', '#c48ab4', '#f2c230'], 30, 110, .45);
				s += `<g filter="url(#hb4)" opacity=".85"><g transform="translate(260 1080)">${thyme(0, 0, 700, -78, 9, 2.2)}</g><g transform="translate(1420 1060)">${thyme(0, 0, 600, -100, 4, 2)}</g></g>`;
				s += `<g transform="translate(940 1090)">${thyme(0, 0, 560, -88, 2, 3.4)}</g>`;
				s += `<g transform="translate(900 380) rotate(-6)">${bee(1.25)}</g>`;
				return svg(W, H, s, `${vignette(.3, '40,40,10')}${grainFx(.22, .8)}`);
			}
			case 2: { // purity test
				const h = HONEY.forty, hz = 640;
				let s = bdDefs({ w0: '#e9dfc8', w1: '#f3ead8', w2: '#ebe0c8', t0: '#ece0c6', t1: '#f4ead6', t2: '#e2d2b2' }) + backdrop(W, H, hz, { bx: .42, bw: .34, leafOp: .12, linen: .3 });
				// glass of water
				const gx = 640, gy = 900, gr = 150, gh = 470, e = .16;
				s += `<defs>${lg('jpw', [[0, '#c9d6d2', .55], [.2, '#eef3f0', .25], [.5, '#fff', .12], [.85, '#c9d6d2', .3], [1, '#a9bcb8', .6]], 1, 0)}${lg('jph', [[0, h.c3], [.3, h.c1], [.5, h.c0], [.8, h.c2], [1, h.c3]], 1, 0)}</defs>`;
				s += `<ellipse cx="${gx + 120}" cy="${gy + 10}" rx="${gr * 1.5}" ry="30" fill="#5a4a2a" opacity=".2" filter="url(#hb16)"/><ellipse cx="${gx + 90}" cy="${gy + 6}" rx="${gr}" ry="20" fill="${h.cast}" opacity=".45" filter="url(#hb8)"/>`;
				s += `<path d="M${gx - gr},${gy - gh} L${gx - gr * .9},${gy} A${gr * .9},${gr * .9 * e} 0 0 0 ${gx + gr * .9},${gy} L${gx + gr},${gy - gh}Z" fill="#eef4f2" opacity=".55"/>`;
				s += `<path d="M${gx - gr + 4},${gy - gh + 60} L${gx - gr * .9 + 4},${gy - 10} A${gr * .9},${gr * .9 * e} 0 0 0 ${gx + gr * .9 - 4},${gy - 10} L${gx + gr - 4},${gy - gh + 60}Z" fill="#dfeae8" opacity=".55"/><ellipse cx="${gx}" cy="${gy - gh + 60}" rx="${gr - 4}" ry="${(gr - 4) * e}" fill="#f4faf8" stroke="#fff" stroke-width="2" opacity=".85"/>`;
				s += `<path d="M${gx - 96},${gy - 24} C${gx - 110},${gy - 70} ${gx - 40},${gy - 96} ${gx + 10},${gy - 86} C${gx + 80},${gy - 76} ${gx + 104},${gy - 40} ${gx + 92},${gy - 22} C${gx + 50},${gy - 4} ${gx - 60},${gy - 4} ${gx - 96},${gy - 24}Z" fill="url(#jph)"/><path d="M${gx - 60},${gy - 70} C${gx - 20},${gy - 86} ${gx + 30},${gy - 84} ${gx + 60},${gy - 66}" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>`;
				s += drip(h, gx + 6, gy - gh - 60, gx + 4, gy - 80, 7, { bend: 2 });
				s += `<path d="M${gx - gr},${gy - gh} L${gx - gr * .9},${gy} A${gr * .9},${gr * .9 * e} 0 0 0 ${gx + gr * .9},${gy} L${gx + gr},${gy - gh}Z" fill="url(#jpw)"/><ellipse cx="${gx}" cy="${gy - gh}" rx="${gr}" ry="${gr * e}" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/><path d="M${gx - gr + 22},${gy - gh + 30} L${gx - gr * .9 + 22},${gy - 30}" stroke="#fff" stroke-width="12" opacity=".6" stroke-linecap="round" filter="url(#hb2)"/>`;
				s += `<path d="M${gx - gr * .9},${gy} A${gr * .9},${gr * .9 * e} 0 0 0 ${gx + gr * .9},${gy} L${gx + gr * .9},${gy - 18} A${gr * .9},${gr * .9 * e} 0 0 1 ${gx - gr * .9},${gy - 18}Z" fill="#fff" opacity=".35"/>`;
				// spoon above
				s += `<g transform="translate(${gx - 4} ${gy - gh - 70}) rotate(-12)"><ellipse cx="0" cy="0" rx="58" ry="22" fill="#c9cdd1"/><ellipse cx="0" cy="-4" rx="48" ry="14" fill="${h.c1}"/><ellipse cx="-12" cy="-8" rx="20" ry="4" fill="#fff" opacity=".6"/><path d="M50,-6 L330,-40 L334,-30 L56,6Z" fill="#b8bec4"/><path d="M60,-4 L320,-36" stroke="#fff" stroke-width="2.5" opacity=".7"/></g>`;
				// beaker
				const bx = 1060, by = 900, bw = 130, bh = 330;
				s += `<ellipse cx="${bx + 100}" cy="${by + 10}" rx="${bw * 1.6}" ry="26" fill="#5a4a2a" opacity=".2" filter="url(#hb16)"/>`;
				s += `<path d="M${bx - bw + 10},${by - bh * .5} L${bx - bw + 10},${by - 10} Q${bx - bw + 10},${by + 14} ${bx - bw + 40},${by + 14} L${bx + bw - 40},${by + 14} Q${bx + bw - 10},${by + 14} ${bx + bw - 10},${by - 10} L${bx + bw - 10},${by - bh * .5}Z" fill="url(#jph)"/><rect x="${bx - bw + 10}" y="${by - bh * .5 - 10}" width="${bw * 2 - 20}" height="16" fill="${h.c0}" opacity=".9"/><path d="M${bx - bw + 20},${by - bh * .5} L${bx - bw + 20},${by - 10}" stroke="#fff" stroke-width="6" opacity=".55" stroke-linecap="round"/>`;
				s += `<path d="M${bx - bw},${by - bh} L${bx - bw},${by - 10} Q${bx - bw},${by + 22} ${bx - bw + 32},${by + 22} L${bx + bw - 32},${by + 22} Q${bx + bw},${by + 22} ${bx + bw},${by - 10} L${bx + bw},${by - bh} L${bx + bw + 18},${by - bh - 14}" fill="#eef4f2" fill-opacity=".22" stroke="#9fb0ad" stroke-width="4" stroke-linejoin="round"/>`;
				['۵۰', '۱۰۰', '۱۵۰', '۲۰۰'].forEach((t, i) => { const y = by - 40 - i * 64; s += `<path d="M${bx - bw + 18},${y} L${bx - bw + 70},${y}" stroke="#6f8582" stroke-width="2.5"/><text x="${bx - bw + 80}" y="${y + 7}" ${FA} font-size="20" font-weight="600" fill="#6f8582">${t}</text>`; for (let k = 1; k < 4 && i < 3; k++) s += `<path d="M${bx - bw + 18},${y - k * 16} L${bx - bw + 40},${y - k * 16}" stroke="#6f8582" stroke-width="1.6"/>`; });
				s += `<path d="M${bx + bw - 30},${by - bh + 20} L${bx + bw - 30},${by - 30}" stroke="#fff" stroke-width="8" opacity=".55" stroke-linecap="round"/>`;
				s += `<g transform="translate(250 960)">${thyme(0, 0, 300, -24, 3, 1.3)}</g>`;
				return svg(W, H, s, `${grainFx(.22, .8)}${vignette(.2, '70,50,20')}`);
			}
			case 3: { // comb frame held up, backlit
				let s = `<defs>${lg('jf0', [[0, '#f6d48e'], [.5, '#e9c070'], [1, '#9a9a52']])}${lg('jfw', [[0, '#e8c48c'], [.5, '#d4a468'], [1, '#a8743c']])}${lg('jfg', [[0, '#f1dcc2'], [1, '#d6b896']], 1, 1)}</defs><rect width="${W}" height="${H}" fill="url(#jf0)"/>`;
				s += bokeh(13, W, H, 34, ['#fff3c4', '#ffe08a', '#a8b06a', '#c48ab4'], 24, 90, .55);
				s += `<circle cx="1250" cy="160" r="260" fill="#fff8e0" opacity=".55" filter="url(#hb60)"/>`;
				const fx = 360, fy = 90, fw = 880, fh = 600;
				s += `<g transform="rotate(-4 800 400)">`;
				s += `<rect x="${fx + 30}" y="${fy + 30}" width="${fw}" height="${fh}" fill="#3a2008" opacity=".35" filter="url(#hb16)"/>`;
				s += `<rect x="${fx - 70}" y="${fy - 34}" width="${fw + 140}" height="40" rx="6" fill="url(#jfw)"/><rect x="${fx}" y="${fy}" width="${fw}" height="${fh + 200}" fill="url(#jfw)"/>`;
				s += `<g transform="translate(${fx + 24} ${fy + 22})"><clipPath id="jfc"><rect width="${fw - 48}" height="${fh + 160}"/></clipPath><g clip-path="url(#jfc)">${combFace(fw - 48, fh + 160, 22, { honey: 'thyme', seed: 31, capFn: (x, y, r) => { const d = Math.hypot(x - 420, y - 300); return d < 330 ? r() < .95 : r() < .35; } })}</g></g>`;
				s += `<rect x="${fx + 24}" y="${fy + 22}" width="${fw - 48}" height="${fh + 160}" fill="url(#jfBack)" style="mix-blend-mode:screen"/><defs>${rg('jfBack', [[0, '#fff6d0', .5], [.5, '#ffd27a', .15], [1, '#ffd27a', 0]], .78, .15, .8)}</defs>`;
				s += `<rect x="${fx + 22}" y="${fy + 20}" width="${fw - 44}" height="${fh + 180}" fill="none" stroke="#7a4b20" stroke-width="4"/>`;
				s += `</g>`;
				// hive box the frame is lifted from
				s += `<rect x="150" y="760" width="1300" height="300" fill="#3a2008" opacity=".3" filter="url(#hb16)"/><rect x="170" y="740" width="1260" height="300" fill="#d9b27a"/><rect x="170" y="740" width="1260" height="300" filter="url(#hWoodN)" opacity=".5"/><rect x="170" y="740" width="1260" height="300" fill="url(#jfBox)"/><defs>${lg('jfBox', [[0, '#2a1200', .05], [1, '#2a1200', .35]])}</defs>`;
				s += `<path d="M170,740 L1430,740 L1400,712 L200,712Z" fill="#f0d3a2"/>`;
				for (let i = 0; i < 9; i++) { const x = 230 + i * 128; if (i === 4) continue; s += `<rect x="${x}" y="696" width="34" height="34" rx="3" fill="#c9955a"/><rect x="${x}" y="696" width="34" height="8" fill="#f3d9a8"/>`; }
				s += `<rect x="560" y="860" width="480" height="18" rx="9" fill="#3a2410" opacity=".45"/>`;
				s += S.bees(800, 420, 18, 420, 21, 2.2) + S.bees(400, 700, 10, 200, 22, 1.8);
				return svg(W, H, s, `${vignette(.3, '80,40,0')}${grainFx(.22, .8)}`);
			}
			case 4: { // harvest map
				let s = `<defs>${lg('jm0', [[0, '#f6ead0'], [1, '#ecdab6']], 1, 1)}${lg('jmw', [[0, '#b9cbc6'], [1, '#9db4b0']])}</defs><rect width="${W}" height="${H}" fill="url(#jm0)"/><rect width="${W}" height="${H}" filter="url(#hLinen)" opacity=".25"/>`;
				const r = rng(77);
				for (let k = 0; k < 14; k++) { const cx = 200 + r() * 1200, cy = 150 + r() * 700, rr = 60 + r() * 120; for (let j = 0; j < 4; j++) s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rr + j * 26)}" ry="${f1((rr + j * 26) * .62)}" fill="none" stroke="#b9925a" stroke-width="1.2" opacity=".28" transform="rotate(${f1(r() * 60 - 30)} ${f1(cx)} ${f1(cy)})"/>`; }
				s += `<path d="M560,0 C540,70 600,140 650,190 C700,236 790,236 850,210 C900,186 930,120 920,60 C914,30 930,10 940,0Z" fill="url(#jmw)"/><path d="M560,0 C540,70 600,140 650,190 C700,236 790,236 850,210 C900,186 930,120 920,60 C914,30 930,10 940,0" fill="none" stroke="#7d9692" stroke-width="2"/>`;
				s += `<path d="M640,${H} C700,920 820,860 960,850 C1100,840 1200,880 1300,860 C1380,846 1460,880 1520,${H}Z" fill="url(#jmw)"/><path d="M640,${H} C700,920 820,860 960,850 C1100,840 1200,880 1300,860 C1380,846 1460,880 1520,${H}" fill="none" stroke="#7d9692" stroke-width="2"/>`;
				for (let i = 0; i < 4; i++) s += `<path d="M${600 + i * 40},${100 + i * 20} q30,-8 60,0" stroke="#7d9692" stroke-width="1.6" fill="none" opacity=".6"/><path d="M${900 + i * 120},${930 + (i % 2) * 20} q30,-8 60,0" stroke="#7d9692" stroke-width="1.6" fill="none" opacity=".6"/>`;
				const mtn = (x, y, sz, c = '#9a7a4e') => `<path d="M${x - sz},${y} L${x},${y - sz * 1.2} L${x + sz},${y}Z" fill="${c}"/><path d="M${x},${y - sz * 1.2} L${x + sz},${y} L${x + sz * .2},${y}Z" fill="#6e5432"/><path d="M${x - sz * .28},${y - sz * .86} L${x},${y - sz * 1.2} L${x + sz * .3},${y - sz * .84} L${x + sz * .08},${y - sz * .9}Z" fill="#fff8ec"/>`;
				const chain = (pts, sz, seed) => { const q = rng(seed); return pts.map(([x, y]) => mtn(x + (q() - .5) * 30, y + (q() - .5) * 20, sz * (.7 + q() * .6))).join(''); };
				s += chain([[300, 260], [350, 240], [400, 270], [330, 300]], 46, 1);
				s += chain([[560, 300], [640, 290], [720, 296], [800, 300], [880, 310], [960, 320], [1040, 330]], 40, 2);
				s += chain([[380, 420], [440, 470], [500, 520], [560, 570], [620, 620], [690, 660], [760, 700], [840, 740]], 42, 3);
				s += `<path d="M330,330 C450,360 560,380 640,330 C720,280 820,340 900,350 M640,330 C600,450 560,560 620,640 C680,720 900,760 1000,790" stroke="#b86e00" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/>`;
				const pin = (x, y, title, sub, ic, anchor = 'start') => { const tx = anchor === 'start' ? x + 44 : x - 44; return `<circle cx="${x + 4}" cy="${y + 6}" r="30" fill="#3a2008" opacity=".2" filter="url(#hb4)"/><circle cx="${x}" cy="${y}" r="30" fill="#fbf4e6" stroke="#b86e00" stroke-width="3"/>${ic}<text x="${tx}" y="${y - 2}" ${FA} font-size="30" font-weight="800" fill="#2a1a0b" text-anchor="${anchor}">${title}</text><text x="${tx}" y="${y + 32}" ${FA} font-size="21" font-weight="600" fill="#b86e00" text-anchor="${anchor}">${sub}</text>`; };
				s += pin(330, 330, 'سبلان', 'عسل گَوَن', `<g transform="translate(330 336)">${gavan(0, 12, 26, -90, 1, .5)}</g>`, 'end');
				s += pin(900, 350, 'البرز', 'عسل چهل‌گیاه', daisy(900, 350, 18));
				s += pin(620, 640, 'زاگرس · دنا', 'عسل آویشن', `<g>${thyme(612, 662, 30, -80, 2, .55)}</g>`, 'end');
				s += pin(1000, 790, 'هرمزگان', 'عسل کُنار', `<circle cx="1000" cy="790" r="12" fill="#c26f22"/><circle cx="996" cy="786" r="4" fill="#fff" opacity=".6"/>`);
				s += `<g transform="translate(1390 170)"><circle r="70" fill="none" stroke="#9a7a4e" stroke-width="2"/><circle r="56" fill="none" stroke="#9a7a4e" stroke-width="1" stroke-dasharray="3 5"/><path d="M0,-86 L12,0 L0,86 L-12,0Z" fill="#2a1a0b"/><path d="M0,-86 L12,0 L-12,0Z" fill="#b86e00"/><path d="M-86,0 L0,10 L86,0 L0,-10Z" fill="#9a7a4e" opacity=".6"/><text y="-96" ${FA} font-size="24" font-weight="800" fill="#2a1a0b" text-anchor="middle">ش</text></g>`;
				s += `<g transform="translate(300 860)"><rect x="-200" y="-60" width="400" height="120" rx="8" fill="#fbf4e6" stroke="#b86e00" stroke-width="2"/><rect x="-190" y="-50" width="380" height="100" rx="5" fill="none" stroke="#b86e00" stroke-width="1"/><text y="0" ${FA} font-size="34" font-weight="800" fill="#2a1a0b" text-anchor="middle" direction="rtl">نقشه‌ی برداشت</text><text y="34" ${SERIF} font-size="14" letter-spacing="3.5" fill="#b86e00" text-anchor="middle">SHAHDINEH · HARVEST MAP</text></g>`;
				return svg(W, H, s, `${grainFx(.26, .8)}${vignette(.25, '90,60,20')}`);
			}
			default: { // breakfast flat lay
				const h = HONEY.thyme;
				let s = `<defs>${lg('jbt', [[0, '#efe4cf'], [1, '#e6d6b8']], 1, 1)}${lg('jbw', [[0, '#c48a50'], [.5, '#d9a868'], [1, '#b07a3e']], 1, .4)}${rg('hTea', [[0, '#d9711a'], [.6, '#a8420c'], [1, '#6e2306']], .45, .4, .6)}${rg('jbb', [[0, '#f3d9a6'], [.7, '#e2b878'], [1, '#c48a4a']], .5, .5, .55)}${rg('jbc', [[0, '#8a4a18'], [.8, '#6e3810'], [1, '#4a240a']])}${lg('jbu', [[0, '#fff3c4'], [1, '#f2d78a']], 1, 1)}${rg('jbh', [[0, h.glow], [.4, h.c0], [.8, h.c1], [1, h.c2]], .45, .4, .6)}</defs>`;
				s += `<rect width="${W}" height="${H}" fill="url(#jbt)"/><rect width="${W}" height="${H}" filter="url(#hLinen)" opacity=".6"/>`;
				s += `<path d="M-40,620 L520,580 L560,1040 L-40,1040Z" fill="#f7efe0" opacity=".9"/><path d="M-40,620 L520,580 L560,1040" fill="none" stroke="#d8c6a2" stroke-width="2"/><path d="M-40,660 L526,620 M-40,700 L530,660" stroke="#c9a36a" stroke-width="3" opacity=".5"/>`;
				// board
				s += `<rect x="440" y="150" width="760" height="560" rx="40" fill="#3a2008" opacity=".25" filter="url(#hb16)" transform="translate(18 24)"/><rect x="440" y="150" width="760" height="560" rx="40" fill="url(#jbw)"/><rect x="440" y="150" width="760" height="560" rx="40" filter="url(#hWoodN)" opacity=".5"/><circle cx="1160" cy="430" r="16" fill="#6a4220"/>`;
				// bread slices
				const slice = (x, y, rot) => { const r = rng(x); let g = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-150,-90 C-160,-150 -60,-170 0,-165 C80,-170 160,-140 150,-80 L150,100 Q150,120 130,120 L-130,120 Q-150,120 -150,100Z" fill="#3a2008" opacity=".3" filter="url(#hb8)" transform="translate(10 14)"/><path d="M-150,-90 C-160,-150 -60,-170 0,-165 C80,-170 160,-140 150,-80 L150,100 Q150,120 130,120 L-130,120 Q-150,120 -150,100Z" fill="url(#jbc)"/><path d="M-134,-84 C-140,-136 -56,-150 0,-146 C70,-150 140,-126 134,-76 L134,92 Q134,104 120,104 L-120,104 Q-134,104 -134,92Z" fill="url(#jbb)"/>`; for (let i = 0; i < 70; i++) g += `<ellipse cx="${f1(-120 + r() * 240)}" cy="${f1(-130 + r() * 225)}" rx="${f1(2 + r() * 6)}" ry="${f1(1.5 + r() * 4)}" fill="#b4793a" opacity=".55"/>`; return g + `</g>`; };
				s += slice(640, 400, -8) + slice(860, 440, 6);
				// butter
				s += `<g transform="translate(1040 260) rotate(8)"><rect x="-100" y="-62" width="200" height="124" rx="16" fill="#3a2008" opacity=".25" filter="url(#hb8)" transform="translate(8 12)"/><rect x="-100" y="-62" width="200" height="124" rx="16" fill="#fbf8f2" stroke="#e2d6c0" stroke-width="2"/><rect x="-66" y="-36" width="132" height="72" rx="10" fill="url(#jbu)"/><path d="M-50,-20 q30,-12 60,0 q30,12 50,0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/></g>`;
				s += `<g transform="translate(980 600) rotate(-30)"><rect x="-10" y="-8" width="220" height="16" rx="8" fill="#b8bec4"/><rect x="-130" y="-11" width="130" height="22" rx="11" fill="#8a5a2b"/></g>`;
				// honey bowl with dipper
				s += `<circle cx="1330" cy="740" r="168" fill="#3a2008" opacity=".25" filter="url(#hb16)"/><circle cx="1312" cy="720" r="160" fill="#f6f1e8"/><circle cx="1312" cy="720" r="160" fill="none" stroke="#d9cdb6" stroke-width="3"/><circle cx="1312" cy="720" r="126" fill="url(#jbh)"/><circle cx="1312" cy="720" r="126" fill="none" stroke="${h.c2}" stroke-width="3" opacity=".5"/><path d="M1220,660 A110,110 0 0 1 1320,604" stroke="#fff" stroke-width="7" fill="none" opacity=".75" stroke-linecap="round"/>`;
				s += `<g transform="translate(1290 740) rotate(-40)">${dipper(h, { len: 300, hr: 30, hl: 96 })}</g>`;
				// tea
				s += estekan(300, 300, 74);
				s += `<g transform="translate(160 520) rotate(18)"><rect x="-26" y="-26" width="52" height="52" rx="6" fill="#fffdf8" stroke="#e8e0d0"/></g><g transform="translate(220 560) rotate(-12)"><rect x="-22" y="-22" width="44" height="44" rx="6" fill="#fffdf8" stroke="#e8e0d0"/></g>`;
				// walnuts
				[[1300, 160], [1400, 240], [1480, 140]].forEach(([x, y], i) => { s += `<ellipse cx="${x + 6}" cy="${y + 8}" rx="44" ry="38" fill="#3a2008" opacity=".2" filter="url(#hb4)"/><ellipse cx="${x}" cy="${y}" rx="44" ry="38" fill="#c49a62"/><path d="M${x},${y - 36} C${x - 12},${y - 10} ${x + 12},${y + 10} ${x},${y + 36}" stroke="#8a6a3a" stroke-width="3" fill="none"/>${[0, 1, 2, 3].map(k => `<path d="M${x - 30 + k * 8},${y - 20 + k * 10} q10,6 20,-2" stroke="#9a7442" stroke-width="2" fill="none"/>`).join('')}`; });
				s += `<g transform="translate(120 900)">${thyme(0, 0, 420, -32, 6, 1.4)}</g>`;
				return svg(W, H, s, `${grainFx(.22, .8)}${vignette(.22, '70,50,20')}`);
			}
		}
	};

	/* ---------- process (portrait 1200×1500) ---------- */
	scenes['honey-process'] = (_, v) => {
		const W = 1200, H = 1500;
		switch ((v - 1) % 3) {
			case 0: { // hive
				let s = `<defs>${lg('pq0', [[0, '#eab676'], [.45, '#f6d79e'], [.62, '#c9b27a'], [1, '#6d7a44']])}${lg('apShade', [[0, '#2a1a08', .28], [.6, '#2a1a08', .12], [1, '#2a1a08', .05]], 1, 0)}${rg('pqs', [[0, '#fffbe8'], [.1, '#fff1c4', .9], [.4, '#ffd68a', .35], [1, '#ffd68a', 0]])}</defs><rect width="${W}" height="${H}" fill="url(#pq0)"/>`;
				s += `<circle cx="900" cy="560" r="560" fill="url(#pqs)"/>`;
				const far = S.ridge(4, W, 700, 140, 7, .5);
				s += `<g filter="url(#hb4)"><path d="${S.ridgePath(far, H)}" fill="#c99f78" opacity=".8"/></g><g filter="url(#hb4)"><path d="M0,860 C300,820 800,820 1200,850 L1200,${H} L0,${H}Z" fill="#8f9b5d"/></g>`;
				s += `<g filter="url(#hb2)">${S.drifts(3, 0, W, 860, 1000, 30, 16, 2, 4, ['#f2c230', '#fff8e8', '#c48ab4'])}</g>`;
				s += `<path d="M0,1000 C400,960 800,960 1200,990 L1200,${H} L0,${H}Z" fill="#7d8a4c"/>`;
				s += S.hive2(580, 1260, 3.4, [['#e9c78f'], ['#d9a89a'], ['#efe2c8']].map(a => a[0]), { n: 3, roof: '#e6dfcc' });
				s += S.bees(560, 1170, 22, 300, 5, 2.4) + S.bees(760, 800, 12, 240, 7, 1.8);
				s += S.drifts(9, 0, W, 1250, 1500, 40, 20, 5, 14, ['#f2c230', '#fff8e8', '#c48ab4', '#d9462b']);
				for (let i = 0; i < 70; i++) { const r = rng(i + 90), x = r() * W, h2 = 80 + r() * 200; s += `<path d="M${f1(x)},${H + 4} q${f1((r() - .5) * 40)},${f1(-h2 * .6)} ${f1((r() - .5) * 70)},${f1(-h2)}" stroke="${r() > .5 ? '#56632f' : '#7d8a4c'}" stroke-width="${f1(4 + r() * 5)}" fill="none" stroke-linecap="round"/>`; }
				return svg(W, H, s, `${vignette(.28, '80,40,0')}${grainFx(.26, .75)}`);
			}
			case 1: { // harvest: uncapping
				let s = `<defs>${rg('pr0', [[0, '#7a4510'], [.6, '#3a1d05'], [1, '#1a0c02']], .5, .4, .8)}${lg('prf', [[0, '#e0b47a'], [1, '#a8743c']], 1, 0)}${lg('prb', [[0, '#f4f6f8'], [.4, '#c3cad2'], [.6, '#eef1f4'], [1, '#8d97a3']])}</defs><rect width="${W}" height="${H}" fill="url(#pr0)"/>`;
				s += bokeh(17, W, H, 22, ['#ffb84a', '#ffd27a'], 20, 70, .4);
				const fx = 170, fy = 150, fw = 860, fh = 1200;
				s += `<rect x="${fx + 30}" y="${fy + 40}" width="${fw}" height="${fh}" fill="#000" opacity=".45" filter="url(#hb16)"/><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="url(#prf)"/><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" filter="url(#hWoodN)" opacity=".5"/>`;
				const cut = 560;
				s += `<g transform="translate(${fx + 30} ${fy + 30})"><clipPath id="prc"><rect width="${fw - 60}" height="${fh - 60}"/></clipPath><g clip-path="url(#prc)">${combFace(fw - 60, fh - 60, 26, { honey: 'thyme', seed: 41, capFn: (x, y, r) => y > cut + (x - 400) * .12 + (r() - .5) * 20 })}</g></g>`;
				s += `<rect x="${fx + 30}" y="${fy + 30}" width="${fw - 60}" height="${fh - 60}" fill="none" stroke="#5a3410" stroke-width="5"/>`;
				// peeled cappings + knife
				const ky = fy + 30 + cut;
				s += `<path d="M${fx + 120},${ky - 10} C${fx + 300},${ky - 70} ${fx + 520},${ky - 90} ${fx + 700},${ky - 40} L${fx + 700},${ky + 6} C${fx + 520},${ky - 40} ${fx + 300},${ky - 24} ${fx + 120},${ky + 30}Z" fill="#f4d98c"/><path d="M${fx + 120},${ky - 10} C${fx + 300},${ky - 70} ${fx + 520},${ky - 90} ${fx + 700},${ky - 40}" stroke="#fff6d0" stroke-width="4" fill="none"/>`;
				s += `<g transform="translate(${fx + 90} ${ky + 20}) rotate(-6)"><path d="M0,0 L760,-30 L790,-10 L760,14 L0,30Z" fill="url(#prb)"/><path d="M10,4 L760,-24" stroke="#fff" stroke-width="3" opacity=".8"/><rect x="790" y="-30" width="60" height="50" rx="6" fill="#8d97a3"/><rect x="850" y="-34" width="260" height="58" rx="26" fill="#8a5a2b"/><path d="M870,-24 L1090,-24" stroke="#c48a50" stroke-width="5" opacity=".7" stroke-linecap="round"/></g>`;
				for (let i = 0; i < 4; i++) { const x = fx + 200 + i * 150; s += drip(HONEY.thyme, x, ky + 40, x + 2, ky + 110 + (i % 2) * 40, 7, { drop: true }); }
				return svg(W, H, s, `${vignette(.4, '20,8,0')}${grainFx(.22, .8)}`);
			}
			default: { // bottling
				const h = HONEY.forty;
				let s = bdDefs({ w0: '#e7d1a8', w1: '#efdcbc', w2: '#e3c79c' }) + backdrop(W, H, 980, { bx: .2, bw: .5, linen: .4 });
				s += `<defs>${lg('pbs', [[0, '#9aa4b0'], [.15, '#e6eaee'], [.3, '#ffffff'], [.5, '#c6cdd5'], [.85, '#8a94a2'], [1, '#b5bdc8']], 1, 0)}</defs>`;
				s += `<g filter="url(#hb4)" opacity=".85"><g transform="translate(180 1160) scale(.8)">${jar({ R: 150, Hb: 260, e: .14, honey: 'thyme', label: { name: 'عسل آویشن', band: '#c98a1c', fs: .2 } })}</g><g transform="translate(1030 1150) scale(.75)">${jar({ R: 150, Hb: 260, e: .14, honey: 'konar', label: { name: 'عسل کُنار', band: '#8a3a12', fs: .2 } })}</g></g>`;
				// tank + honey gate
				s += `<path d="M300,-20 L900,-20 L900,260 Q900,330 830,340 L370,340 Q300,330 300,260Z" fill="url(#pbs)"/><path d="M300,250 L900,250" stroke="#7d8795" stroke-width="3" opacity=".5"/><path d="M330,0 L330,300" stroke="#fff" stroke-width="10" opacity=".5"/>`;
				s += `<rect x="560" y="340" width="80" height="60" fill="url(#pbs)"/><rect x="530" y="396" width="140" height="56" rx="10" fill="url(#pbs)"/><path d="M640,380 L780,330 L790,350 L650,404Z" fill="#2b3037"/><rect x="566" y="450" width="68" height="30" rx="4" fill="url(#pbs)"/>`;
				// jar being filled
				const jx = 600, jy = 1270;
				s += `<g transform="translate(${jx} ${jy})">${jar({ R: 210, Hb: 380, e: .2, honey: 'forty', open: true, level: .55 })}</g>`;
				const yh = jy - 16 - (380 - 16) * .55;
				s += `<g filter="url(#hb4)" opacity=".6">${drip(h, 600, 478, 596, yh, 22, { bend: 0 })}</g>${drip(h, 600, 478, 596, yh - 10, 16, { bend: 0 })}`;
				for (let i = 0; i < 3; i++) s += `<ellipse cx="${596 + (i - 1) * 14}" cy="${yh - 6 - i * 12}" rx="${58 - i * 14}" ry="${16 - i * 3}" fill="${h.c1}" stroke="${h.c2}" stroke-width="1.5"/><path d="M${560 + (i - 1) * 14},${yh - 12 - i * 12} q30,-8 60,0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>`;
				return svg(W, H, s, `${grainFx(.22, .8)}${vignette(.22, '70,40,10')}`);
			}
		}
	};
})();
