/* ================= Industrial v2 — HAMOON (صنایع هامون) =================
 * Industrial skeuomorphism: matte #e0e5ec chassis, dual neumorphic shadows (light top-left),
 * screws, LEDs, recessed red-glow LCDs. All devices are SVG groups drawn in local coords
 * (0..w, 0..h) so they can be reused in the product shots, the hero and the plant diorama.
 */
(() => {
	const MONO = `font-family="DejaVu Sans Mono,ui-monospace,monospace"`;
	const SANS = `font-family="Vazirmatn,DejaVu Sans,sans-serif"`;

	const IM = dark => dark ? {
		dark: true,
		c0: '#3b414b', c1: '#30353e', c2: '#272b32', c3: '#1c1f24',
		hi: '#3c434e', lo: '#111316', hiA: .9, loA: 1,
		engr: '#7c8594', engrSh: 'rgba(0,0,0,.65)', engrDy: -1,
		cyl: [[0, '#1b1e23'], [.1, '#353b44'], [.22, '#56606c'], [.32, '#3d434d'], [.62, '#2a2f36'], [.86, '#1b1e22'], [.95, '#16181c'], [1, '#2a2f37']],
		cylV: [[0, '#2c3139'], [.1, '#56606c'], [.24, '#454c57'], [.6, '#2a2f36'], [.9, '#191b1f'], [1, '#262a31']],
		face: [[0, '#21252b'], [1, '#16191d']], faceInk: '#d9dee5', faceSub: '#8b94a3',
		steel: [[0, '#4b525d'], [.2, '#8f99a6'], [.32, '#c3cad3'], [.46, '#6e7783'], [.75, '#3c424b'], [1, '#5c6470']],
		screw: ['#15181b', '#2a2f36', '#3e4550', '#0f1113'],
		key: ['#383e47', '#2a2f36'], keyHi: '#434a55', keyLo: '#121417',
		recess: ['#16181c', '#30363f'],
		ledOff: '#1a1d21', floor: 'rgba(0,0,0,.7)',
		bg: 'radial-gradient(120% 90% at 20% 10%,#3a414b,#262a31 50%,#1c1f24 100%)',
		dimLight: .82,
	} : {
		dark: false,
		c0: '#f4f6f9', c1: '#e3e8ee', c2: '#d6dce5', c3: '#c3cbd6',
		hi: '#ffffff', lo: '#a6b1c2', hiA: .95, loA: .95,
		engr: '#8a94a6', engrSh: '#ffffff', engrDy: 1,
		cyl: [[0, '#b3bcc9'], [.1, '#e4e9ef'], [.22, '#ffffff'], [.33, '#eef1f5'], [.62, '#d1d8e1'], [.86, '#aab4c2'], [.95, '#9aa5b4'], [1, '#c4ccd7']],
		cylV: [[0, '#c9d0da'], [.1, '#ffffff'], [.25, '#eef1f5'], [.6, '#d0d7e0'], [.9, '#a8b2c0'], [1, '#bfc7d2']],
		face: [[0, '#fbfcfd'], [1, '#e9edf2']], faceInk: '#1f2429', faceSub: '#7a8494',
		steel: [[0, '#8a94a2'], [.18, '#e9edf1'], [.3, '#ffffff'], [.46, '#c3cad3'], [.75, '#8a94a2'], [1, '#b7bfca']],
		screw: ['#9aa3b2', '#c9d0da', '#eef1f5', '#8b94a3'],
		key: ['#eef1f5', '#d9dfe7'], keyHi: '#ffffff', keyLo: '#aeb8c7',
		recess: ['#b9c2ce', '#f4f6f9'],
		ledOff: '#b8c0cc', floor: 'rgba(40,50,70,.45)',
		bg: 'radial-gradient(120% 90% at 20% 10%,#f6f8fa,#e0e5ec 45%,#cbd3de 100%)',
		dimLight: 1,
	};

	const st = s => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
	const lg = (id, s, x2 = 0, y2 = 1, x1 = 0, y1 = 0, ex = '') => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${ex}>${st(s)}</linearGradient>`;
	const rg = (id, s, cx = .5, cy = .5, r = .5, fx = cx, fy = cy, ex = '') => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}" ${ex}>${st(s)}</radialGradient>`;
	const RED = [[0, '#9c1d2b'], [.1, '#e8404f'], [.22, '#ff7f8b'], [.33, '#ff5664'], [.62, '#e43a4a'], [.86, '#a71f2e'], [.95, '#8d1824'], [1, '#c02e3c']];
	const REDV = [[0, '#c2303e'], [.1, '#ff7c88'], [.25, '#ff5765'], [.6, '#e03747'], [.9, '#9a1c29'], [1, '#b42a38']];
	const BRASS = [[0, '#6f4b14'], [.12, '#c9963e'], [.26, '#fff0c4'], [.38, '#e3b45a'], [.66, '#a87726'], [.88, '#6a4610'], [1, '#9c7330']];
	const YEL = [[0, '#fff0a0'], [.45, '#ffd21f'], [.8, '#e6a800'], [1, '#b98200']];

	const defs = M => `<defs>
		${lg('iCh', [[0, M.c0], [.55, M.c1], [1, M.c2]], 1, 1)}
		${lg('iChV', [[0, M.c0], [1, M.c2]])}
		${lg('iCylH', M.cyl)}${lg('iCylV', M.cylV, 1, 0)}
		${lg('iSteelH', M.steel)}${lg('iSteelV', M.steel, 1, 0)}
		${lg('iRedH', RED)}${lg('iRedV', REDV, 1, 0)}
		${lg('iBrassH', BRASS)}${lg('iBrassV', BRASS, 1, 0)}
		${lg('iFace', M.face, .4, 1)}
		${lg('iKey', [[0, M.key[0]], [1, M.key[1]]], .3, 1)}
		${lg('iRecess', [[0, M.recess[0]], [1, M.recess[1]]], .5, 1)}
		${lg('iEdge', [[0, '#fff', M.dark ? .14 : .95], [.5, '#fff', 0], [1, '#000', M.dark ? .4 : .08]], 1, 1)}
		${lg('iGlare', [[0, '#fff', .16], [.6, '#fff', .03], [1, '#fff', 0]], 1, 1)}
		${lg('iChrome', [[0, M.dark ? '#9aa3b0' : '#ffffff'], [.22, M.dark ? '#4b525d' : '#c4ccd6'], [.45, M.dark ? '#2b3037' : '#8b95a4'], [.55, M.dark ? '#a8b0bc' : '#eef1f5'], [.8, M.dark ? '#3c424b' : '#9aa4b2'], [1, M.dark ? '#6b7380' : '#e3e8ee']], 1, 1)}
		${rg('iScrew', [[0, M.screw[0]], [.28, M.screw[0]], [.32, M.screw[1]], [.7, M.screw[1]], [.75, M.screw[2]], [1, M.screw[2]]])}
		${rg('iRedDome', [[0, '#ffc2c8'], [.22, '#ff6f7c'], [.55, '#ff4757'], [.85, '#b8212f'], [1, '#7d1420']], .5, .5, .5, .36, .3)}
		${rg('iGreenLens', [[0, '#eaffef'], [.25, '#7dff9f'], [.6, '#22c55e'], [1, '#0d6b31']], .5, .5, .5, .38, .32)}
		${rg('iAmberLens', [[0, '#fff6dd'], [.25, '#ffd36b'], [.6, '#f59e0b'], [1, '#8a5200']], .5, .5, .5, .38, .32)}
		${lg('iYellow', YEL, .3, 1)}
		${lg('iScreen', [[0, '#151a20'], [1, '#0a0c0f']], .3, 1)}
		${lg('iTrend', [[0, '#ff4757', .42], [1, '#ff4757', 0]])}
		${lg('iTopFace', [[0, M.c0], [1, M.c1]])}
		<filter id="iNeu" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
			<feGaussianBlur in="SourceAlpha" stdDeviation="22" result="b"/>
			<feOffset in="b" dx="22" dy="24" result="bo"/><feFlood flood-color="${M.lo}" flood-opacity="${M.loA}"/><feComposite in2="bo" operator="in" result="sd"/>
			<feOffset in="b" dx="-20" dy="-20" result="bl"/><feFlood flood-color="${M.hi}" flood-opacity="${M.hiA}"/><feComposite in2="bl" operator="in" result="sl"/>
			<feMerge><feMergeNode in="sl"/><feMergeNode in="sd"/><feMergeNode in="SourceGraphic"/></feMerge>
		</filter>
		<filter id="iNeuS" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
			<feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
			<feOffset in="b" dx="5" dy="6" result="bo"/><feFlood flood-color="${M.lo}" flood-opacity=".9"/><feComposite in2="bo" operator="in" result="sd"/>
			<feOffset in="b" dx="-4" dy="-4" result="bl"/><feFlood flood-color="${M.hi}"/><feComposite in2="bl" operator="in" result="sl"/>
			<feMerge><feMergeNode in="sl"/><feMergeNode in="sd"/><feMergeNode in="SourceGraphic"/></feMerge>
		</filter>
		<filter id="iDrop" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dx="8" dy="12" result="o"/><feFlood flood-color="#0b1020" flood-opacity="${M.dark ? .6 : .28}"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
		<filter id="iDropS" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="3" dy="4" result="o"/><feFlood flood-color="#0b1020" flood-opacity="${M.dark ? .6 : .3}"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
		<filter id="iGlow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
		<filter id="iB1"><feGaussianBlur stdDeviation="1.2"/></filter>
		<filter id="iB3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
		<filter id="iB6" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
		<filter id="iB14" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
		<filter id="iB40" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="40"/></filter>
		<filter id="iCast" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 ${M.dark ? 1 : 0} 0 0 0 0 ${M.dark ? 1 : 0} 0 0 0 0 ${M.dark ? 1 : 0} 0 0 0 ${M.dark ? .5 : .9} -.3"/><feComposite in2="SourceAlpha" operator="in"/></filter>
		<pattern id="iThread" width="12" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect width="12" height="10" fill="none"/><rect y="0" width="12" height="4" fill="#000" opacity=".28"/><rect y="4" width="12" height="1.5" fill="#fff" opacity=".35"/></pattern>
		<pattern id="iHoles" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="4.2" fill="${M.dark ? '#0d0f12' : '#5d6674'}"/><circle cx="8.6" cy="8.8" r="4.2" fill="none" stroke="#fff" stroke-opacity="${M.dark ? .06 : .5}" stroke-width="1"/></pattern>
	</defs>`;

	/* ---------- primitives ---------- */
	const eng = (M, x, y, t, o = {}) => {
		const sz = o.size || 14, an = o.anchor || 'start', w = o.weight || 700, ls = (o.ls ?? .18) * sz;
		const b = `x="${x}" y="${y}" ${o.font || MONO} font-size="${sz}" font-weight="${w}" letter-spacing="${ls}" text-anchor="${an}"${o.tr ? ` transform="${o.tr}"` : ''}`;
		return `<text ${b} dy="${M.engrDy}" fill="${M.engrSh}">${t}</text><text ${b} fill="${o.fill || M.engr}">${t}</text>`;
	};
	const screw = (M, x, y, r = 8, a = 35) => `<g transform="translate(${x} ${y})"><circle r="${r + 2}" fill="${M.dark ? '#16181c' : '#b7c0cc'}" opacity=".6"/><circle r="${r}" fill="url(#iScrew)"/><rect x="${-r * .72}" y="-1.2" width="${r * 1.44}" height="2.4" rx="1.2" fill="${M.screw[3]}" transform="rotate(${a})"/><circle r="${r}" fill="none" stroke="#fff" stroke-opacity="${M.dark ? .08 : .7}" stroke-width="1" transform="translate(-.6 -.6)"/></g>`;
	const led = (M, x, y, c, r = 6, on = true) => on
		? `<circle cx="${x}" cy="${y}" r="${r * 3.2}" fill="${c}" opacity="${M.dark ? .55 : .42}" filter="url(#iB6)"/><circle cx="${x}" cy="${y}" r="${r + 1.5}" fill="${M.dark ? '#0d0f12' : '#9aa4b2'}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * .28}" cy="${y - r * .32}" r="${r * .42}" fill="#fff" opacity=".85"/>`
		: `<circle cx="${x}" cy="${y}" r="${r + 1.5}" fill="${M.dark ? '#0d0f12' : '#9aa4b2'}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${M.ledOff}"/><circle cx="${x - r * .28}" cy="${y - r * .32}" r="${r * .35}" fill="#fff" opacity="${M.dark ? .12 : .6}"/>`;
	const bevel = (x, y, w, h, r, sw = 2) => `<rect x="${x + sw / 2}" y="${y + sw / 2}" width="${w - sw}" height="${h - sw}" rx="${r}" fill="none" stroke="url(#iEdge)" stroke-width="${sw}"/>`;
	const recess = (M, x, y, w, h, r) => `<rect x="${x - 7}" y="${y - 7}" width="${w + 14}" height="${h + 14}" rx="${r + 6}" fill="url(#iRecess)"/><rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="${r + 2}" fill="${M.dark ? '#0b0c0e' : '#1d2125'}"/>`;
	const key = (M, x, y, w, h, r = 12) => `<g filter="url(#iNeuS)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#iKey)"/></g>${bevel(x, y, w, h, r - 1, 1.5)}`;
	/* hex nut, front view (across flats horizontal) */
	const hexFront = (cx, cy, w, h, grad = 'iSteelV') => {
		const q = w / 4;
		return `<g><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="2" fill="url(#${grad})"/><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${q}" height="${h}" fill="#000" opacity=".18"/><rect x="${cx + w / 2 - q}" y="${cy - h / 2}" width="${q}" height="${h}" fill="#000" opacity=".3"/><rect x="${cx - w / 2 + q - 1}" y="${cy - h / 2}" width="1.4" height="${h}" fill="#fff" opacity=".5"/><rect x="${cx + w / 2 - q - .4}" y="${cy - h / 2}" width="1.4" height="${h}" fill="#000" opacity=".25"/></g>`;
	};
	/* flat compressed hexagon (nut seen on an ellipse face) */
	const hexFace = (cx, cy, r, k, rot = 0) => {
		const p = [0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 + rot) * Math.PI / 180; return `${(cx + Math.cos(a) * r * k).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`; }).join(' ');
		return p;
	};
	const arcPath = (cx, cy, r, a0, a1) => {
		const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
		const [x0, y0] = p(a0), [x1, y1] = p(a1);
		return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
	};

	/* ========== 1. HCP-7 HMI control panel ========== */
	const panel = M => {
		const W = 960, H = 690;
		const BW = 960, BH = 640;
		let s = '';
		// feet + thickness
		s += [120, BW - 230].map(x => `<rect x="${x}" y="${BH - 30}" width="110" height="${H - BH + 30}" rx="12" fill="${M.dark ? '#121417' : '#3a3f47'}"/><rect x="${x}" y="${BH - 30}" width="110" height="10" rx="5" fill="#fff" opacity="${M.dark ? .04 : .12}"/>`).join('');
		s += `<rect x="8" y="22" width="${BW - 16}" height="${BH}" rx="40" fill="${M.c3}"/>`;
		s += `<g filter="url(#iNeu)"><rect x="0" y="0" width="${BW}" height="${BH}" rx="40" fill="url(#iCh)"/></g>${bevel(0, 0, BW, BH, 39, 2.5)}`;
		// header
		s += eng(M, 52, 66, 'HAMOON', { size: 24, weight: 800, ls: .32 });
		s += eng(M, 236, 64, 'HCP-7 · HMI CONTROL PANEL', { size: 13 });
		[['PWR', '#22c55e', 1], ['RUN', '#22c55e', 1], ['COM', '#f59e0b', 1], ['FLT', '#ff4757', 0]].forEach(([t, c, on], i) => { const x = 690 + i * 64; s += led(M, x, 52, c, 6, on) + eng(M, x, 84, t, { size: 10, anchor: 'middle', ls: .12 }); });
		// screen recess + glass
		const sx = 44, sy = 108, sw = 590, sh = 400;
		s += recess(M, sx, sy, sw, sh, 18);
		s += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="16" fill="url(#iScreen)"/>`;
		// screen UI
		const ui = [];
		ui.push(`<text x="${sx + 26}" y="${sy + 38}" ${MONO} font-size="15" font-weight="700" fill="#8f9bab" letter-spacing="1.5">LINE 03 · PRESSURE</text><text x="${sx + sw - 26}" y="${sy + 38}" ${MONO} font-size="15" fill="#5f6b7a" text-anchor="end">14:32:08</text>`);
		ui.push(`<rect x="${sx + 26}" y="${sy + 52}" width="${sw - 52}" height="1" fill="#fff" opacity=".07"/>`);
		const cx0 = sx + 26, cy0 = sy + 70, cw = 330, ch = 220;
		for (let i = 0; i <= 4; i++) ui.push(`<rect x="${cx0}" y="${cy0 + i * ch / 4}" width="${cw}" height="1" fill="#fff" opacity=".06"/>`);
		for (let i = 0; i <= 6; i++) ui.push(`<rect x="${cx0 + i * cw / 6}" y="${cy0}" width="1" height="${ch}" fill="#fff" opacity=".045"/>`);
		['8', '6', '4', '2'].forEach((t, i) => ui.push(`<text x="${cx0 + 4}" y="${cy0 + 14 + i * ch / 4}" ${MONO} font-size="11" fill="#566170">${t}.0</text>`));
		const pts = [];
		for (let i = 0; i <= 64; i++) {
			const t = i / 64;
			const v = 5.0 + 1.0 * t + .3 * Math.sin(i * .32) + .12 * Math.sin(i * .9 + 1) + (i > 40 ? .35 : 0) * Math.min(1, (i - 40) / 6) + .05 * Math.sin(i * 2.3);
			pts.push([cx0 + t * cw, cy0 + ch - (v - 2) / 8 * ch * 1.33 + 30]);
		}
		const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
		ui.push(`<path d="${d} L${cx0 + cw},${cy0 + ch} L${cx0},${cy0 + ch}Z" fill="url(#iTrend)"/>`);
		ui.push(`<path d="${d}" fill="none" stroke="#ff4757" stroke-width="9" opacity=".35" filter="url(#iB3)"/><path d="${d}" fill="none" stroke="#ff5a69" stroke-width="3" stroke-linejoin="round"/>`);
		const sp = cy0 + ch - (6 - 2) / 8 * ch * 1.33 + 30;
		ui.push(`<line x1="${cx0}" x2="${cx0 + cw}" y1="${sp}" y2="${sp}" stroke="#f5a524" stroke-width="1.5" stroke-dasharray="6 6" opacity=".7"/><rect x="${cx0 + 44}" y="${sp - 9}" width="64" height="18" rx="4" fill="#0d1013"/><text x="${cx0 + 76}" y="${sp + 4}" ${MONO} font-size="11" fill="#f5a524" text-anchor="middle">SP 6.00</text>`);
		const [ex, ey] = pts[pts.length - 1];
		ui.push(`<circle cx="${ex}" cy="${ey}" r="16" fill="#ff4757" opacity=".22"/><circle cx="${ex}" cy="${ey}" r="6" fill="#fff"/><circle cx="${ex}" cy="${ey}" r="3.5" fill="#ff4757"/>`);
		const tiles = [['PRESSURE', '6.42', 'bar'], ['TEMP', '78.3', '°C'], ['FLOW', '42.7', 'm³/h']];
		tiles.forEach(([l, v, u], i) => {
			const tx = sx + 378, ty = sy + 70 + i * 76;
			ui.push(`<rect x="${tx}" y="${ty}" width="186" height="66" rx="10" fill="#141a20" stroke="#fff" stroke-opacity=".06"/><text x="${tx + 14}" y="${ty + 22}" ${MONO} font-size="11" fill="#6b7685" letter-spacing="1.2">${l}</text><text x="${tx + 14}" y="${ty + 54}" ${MONO} font-size="29" font-weight="700" fill="${i ? '#e9edf2' : '#ff8a94'}" ${i ? '' : 'filter="url(#iGlow)"'}>${v}<tspan font-size="13" fill="#7f8a99" font-weight="400" dx="6">${u}</tspan></text>`);
		});
		const pills = [['AUTO', 1], ['MANUAL', 0], ['TRENDS', 0], ['ALARMS 0', 0]];
		let px = sx + 26;
		pills.forEach(([t, on]) => { const w = t.length * 10 + 32; ui.push(`<rect x="${px}" y="${sy + 322}" width="${w}" height="40" rx="20" fill="${on ? 'rgba(255,71,87,.16)' : '#141a20'}" stroke="${on ? '#ff4757' : '#fff'}" stroke-opacity="${on ? .7 : .07}"/><text x="${px + w / 2}" y="${sy + 347}" ${MONO} font-size="13" font-weight="700" fill="${on ? '#ff8a94' : '#8f9bab'}" text-anchor="middle">${t}</text>`); px += w + 10; });
		ui.push(`<rect x="${sx + sw - 120}" y="${sy + 322}" width="94" height="40" rx="20" fill="rgba(34,197,94,.16)" stroke="#22c55e" stroke-opacity=".6"/><circle cx="${sx + sw - 98}" cy="${sy + 342}" r="5" fill="#4ade80"/><circle cx="${sx + sw - 98}" cy="${sy + 342}" r="11" fill="#22c55e" opacity=".25"/><text x="${sx + sw - 82}" y="${sy + 347}" ${MONO} font-size="13" font-weight="700" fill="#86efac">RUN</text>`);
		s += `<g>${ui.join('')}</g>`;
		// glass glare
		s += `<path d="M${sx},${sy + 16} Q${sx},${sy} ${sx + 16},${sy} L${sx + 360},${sy} L${sx},${sy + 300}Z" fill="url(#iGlare)"/><rect x="${sx + 18}" y="${sy + 1.5}" width="${sw - 36}" height="1.5" fill="#fff" opacity=".12"/>`;
		// F-keys
		for (let i = 0; i < 6; i++) { const kx = 44 + i * 100; s += key(M, kx, 552, 86, 52, 12) + eng(M, kx + 43, 584, 'F' + (i + 1), { size: 14, anchor: 'middle', ls: .1 }); }
		s += led(M, 44 + 86 - 12, 563, '#22c55e', 3.2, 1);
		// right column: e-stop
		const ecx = 795, ecy = 236;
		s += `<circle cx="${ecx}" cy="${ecy}" r="122" fill="url(#iRecess)" opacity=".8"/>`;
		s += `<g filter="url(#iDrop)"><circle cx="${ecx}" cy="${ecy}" r="112" fill="url(#iYellow)"/></g><circle cx="${ecx}" cy="${ecy}" r="111" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>`;
		s += `<path id="iEsArc" d="${arcPath(ecx, ecy, 92, 200, 340)}" fill="none"/><path id="iEsArc2" d="M${ecx - 92 * Math.cos(Math.PI * 25 / 180)},${ecy + 92 * Math.sin(Math.PI * 25 / 180) + 10} A92,92 0 0 0 ${ecx + 92 * Math.cos(Math.PI * 25 / 180)},${ecy + 92 * Math.sin(Math.PI * 25 / 180) + 10}" fill="none"/>`;
		s += `<text ${SANS} font-size="15" font-weight="800" fill="#3d3000" letter-spacing="3"><textPath href="#iEsArc" startOffset="50%" text-anchor="middle">EMERGENCY STOP</textPath></text>`;
		s += `<text ${SANS} font-size="13" font-weight="800" fill="#3d3000" letter-spacing="3"><textPath href="#iEsArc2" startOffset="50%" text-anchor="middle">PUSH · TURN</textPath></text>`;
		s += `<circle cx="${ecx}" cy="${ecy}" r="74" fill="#1b1e22"/><circle cx="${ecx + 10}" cy="${ecy + 14}" r="72" fill="#000" opacity=".45" filter="url(#iB6)"/>`;
		s += `<circle cx="${ecx}" cy="${ecy}" r="70" fill="url(#iRedDome)"/><ellipse cx="${ecx - 18}" cy="${ecy - 30}" rx="34" ry="18" fill="#fff" opacity=".55" filter="url(#iB3)" transform="rotate(-24 ${ecx - 18} ${ecy - 30})"/><path d="${arcPath(ecx, ecy, 64, 20, 110)}" stroke="#ffb3ba" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>`;
		// pushbuttons
		[['START', 'iGreenLens', '#22c55e', 735], ['RESET', 'iAmberLens', '#f59e0b', 855]].forEach(([t, g, c, x]) => {
			const y = 432;
			s += `<circle cx="${x}" cy="${y}" r="58" fill="${c}" opacity="${M.dark ? .28 : .2}" filter="url(#iB14)"/><g filter="url(#iDropS)"><circle cx="${x}" cy="${y}" r="40" fill="url(#iChrome)"/></g><circle cx="${x}" cy="${y}" r="31" fill="#15181b"/><circle cx="${x}" cy="${y}" r="29" fill="url(#${g})"/><ellipse cx="${x - 8}" cy="${y - 12}" rx="14" ry="7" fill="#fff" opacity=".6" filter="url(#iB1)"/>`;
			s += eng(M, x, y + 68, t, { size: 13, anchor: 'middle', ls: .2 });
		});
		// vents
		for (let i = 0; i < 5; i++) s += `<rect x="${700}" y="${540 + i * 15}" width="190" height="7" rx="3.5" fill="${M.dark ? '#121417' : '#9aa5b4'}"/><rect x="${700}" y="${547 + i * 15}" width="190" height="1.4" rx=".7" fill="#fff" opacity="${M.dark ? .06 : .8}"/>`;
		[[26, 26], [BW - 26, 26], [26, BH - 26], [BW - 26, BH - 26]].forEach(([x, y]) => { s += screw(M, x, y, 8, x * 7 + y); });
		return { w: W, h: H, svg: s };
	};

	/* ========== 2. PG-160 pressure gauge ========== */
	const gauge = (M, val = 6.4) => {
		const W = 660, H = 900, cx = 330, cy = 330;
		const ang = v => (135 + 270 * v / 16);
		const P = (r, v) => { const a = ang(v) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
		let s = '';
		// brass socket (behind case)
		const bx = cx;
		s += `<rect x="${bx - 44}" y="610" width="88" height="96" fill="url(#iBrassV)"/><rect x="${bx - 44}" y="610" width="88" height="10" fill="#000" opacity=".25"/>`;
		s += `<g>${hexFront(bx, 748, 150, 76, 'iBrassV')}<rect x="${bx - 75}" y="710" width="150" height="5" fill="#fff" opacity=".35"/><rect x="${bx - 75}" y="781" width="150" height="5" fill="#000" opacity=".25"/></g>`;
		s += `<rect x="${bx - 34}" y="786" width="68" height="92" fill="url(#iBrassV)"/><rect x="${bx - 34}" y="786" width="68" height="92" fill="url(#iThread)"/><path d="M${bx - 34},868 L${bx - 26},884 L${bx + 26},884 L${bx + 34},868Z" fill="url(#iBrassV)"/><rect x="${bx - 34}" y="786" width="68" height="8" fill="#000" opacity=".3"/>`;
		// case
		s += `<g filter="url(#iNeu)"><circle cx="${cx}" cy="${cy}" r="322" fill="url(#iCh)"/></g><circle cx="${cx}" cy="${cy}" r="320" fill="none" stroke="url(#iEdge)" stroke-width="3"/>`;
		s += `<circle cx="${cx}" cy="${cy}" r="292" fill="none" stroke="url(#iChrome)" stroke-width="30"/><circle cx="${cx}" cy="${cy}" r="306" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="278" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`;
		// face
		s += `<circle cx="${cx}" cy="${cy}" r="276" fill="url(#iFace)"/>`;
		s += `<clipPath id="iFaceClip"><circle cx="${cx}" cy="${cy}" r="276"/></clipPath><g clip-path="url(#iFaceClip)"><circle cx="${cx + 18}" cy="${cy + 22}" r="292" fill="none" stroke="#000" stroke-opacity="${M.dark ? .55 : .2}" stroke-width="44" filter="url(#iB14)"/></g>`;
		// red & safe zones
		const arcBand = (v0, v1, r, w, c, op = 1) => `<path d="${arcPath(cx, cy, r, ang(v0), ang(v1))}" stroke="${c}" stroke-width="${w}" fill="none" opacity="${op}"/>`;
		s += arcBand(12, 16, 232, 16, '#ff4757');
		s += arcBand(0, 12, 241, 2, M.faceInk, .55);
		// ticks
		for (let i = 0; i <= 80; i++) {
			const v = i / 5, maj = i % 10 === 0, mid = i % 5 === 0;
			const r1 = 241, r0 = maj ? 206 : mid ? 216 : 228;
			const [x0, y0] = P(r0, v), [x1, y1] = P(r1, v);
			s += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${v >= 12 && !maj ? '#fff' : M.faceInk}" stroke-opacity="${v >= 12 && !maj ? .85 : 1}" stroke-width="${maj ? 4.5 : mid ? 2.8 : 1.6}" stroke-linecap="butt"/>`;
			if (maj) { const [tx, ty] = P(176, v); s += `<text x="${tx.toFixed(1)}" y="${(ty + 12).toFixed(1)}" ${SANS} font-size="36" font-weight="700" fill="${v >= 12 ? '#e63946' : M.faceInk}" text-anchor="middle">${v}</text>`; }
		}
		s += `<text x="${cx + 70}" y="${cy - 62}" ${SANS} font-size="40" font-weight="700" fill="${M.faceInk}" text-anchor="middle">bar</text>`;
		s += `<text x="${cx}" y="${cy + 84}" ${SANS} font-size="26" font-weight="800" fill="${M.faceInk}" text-anchor="middle" letter-spacing="8">HAMOON</text>`;
		s += `<text x="${cx}" y="${cy + 116}" ${MONO} font-size="14" fill="${M.faceSub}" text-anchor="middle" letter-spacing="2">PG-160 · CL 1.0</text>`;
		s += `<text x="${cx}" y="${cy + 138}" ${MONO} font-size="12" fill="${M.faceSub}" text-anchor="middle" letter-spacing="2">EN 837-1 · 0–16</text>`;
		// needle
		const a = ang(val);
		s += `<g transform="translate(${cx + 7} ${cy + 10}) rotate(${a})" opacity="${M.dark ? .7 : .32}" filter="url(#iB3)"><path d="M-56,-11 L0,-7 L228,-1.6 L232,0 L228,1.6 L0,7 L-56,11Z" fill="#000"/><circle cx="-46" r="16" fill="#000"/></g>`;
		s += `<g transform="translate(${cx} ${cy}) rotate(${a})"><path d="M-56,-11 L0,-7 L228,-1.6 L232,0 L228,1.6 L0,7 L-56,11Z" fill="#ff4757"/><path d="M-56,-11 L0,-7 L228,-1.6 L232,0 L0,0 L-56,0Z" fill="#fff" opacity=".22"/><circle cx="-46" r="16" fill="#e23646"/><circle cx="-46" r="16" fill="none" stroke="#fff" stroke-opacity=".25"/></g>`;
		s += `<circle cx="${cx}" cy="${cy}" r="28" fill="url(#iChrome)" filter="url(#iDropS)"/><circle cx="${cx}" cy="${cy}" r="11" fill="url(#iScrew)"/><rect x="${cx - 8}" y="${cy - 1.3}" width="16" height="2.6" rx="1.3" fill="#6b7482" transform="rotate(30 ${cx} ${cy})"/>`;
		// glass
		s += `<g clip-path="url(#iFaceClip)"><ellipse cx="${cx - 96}" cy="${cy - 128}" rx="230" ry="96" fill="#fff" opacity="${M.dark ? .1 : .38}" transform="rotate(-38 ${cx - 96} ${cy - 128})" filter="url(#iB14)"/><path d="${arcPath(cx, cy, 258, 196, 262)}" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity="${M.dark ? .35 : .85}" filter="url(#iB1)"/><path d="${arcPath(cx, cy, 258, 18, 52)}" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="${M.dark ? .18 : .5}" filter="url(#iB1)"/></g>`;
		return { w: W, h: H, svg: s };
	};

	/* ========== 3D-ish flange helpers (camera from front-left, k = sin θ) ========== */
	const K = .36;
	/* flange with visible outer face at x (face toward -x), thickness t extends to +x */
	const flangeL = (M, x, y, R, t, o = {}) => {
		const rx = R * K, nb = o.bolts || 8, br = R * .82;
		let s = `<path d="M${x},${y - R} L${x + t},${y - R} A${rx},${R} 0 0 1 ${x + t},${y + R} L${x},${y + R}Z" fill="url(#${o.grad || 'iCylH'})"/>`;
		s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${R}" fill="url(#iFace2)"/><ellipse cx="${x}" cy="${y}" rx="${rx - 1.5}" ry="${R - 1.5}" fill="none" stroke="#fff" stroke-opacity="${M.dark ? .1 : .7}" stroke-width="2"/>`;
		s += `<ellipse cx="${x - 4}" cy="${y}" rx="${R * .6 * K}" ry="${R * .6}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/><ellipse cx="${x - 4}" cy="${y}" rx="${R * .5 * K}" ry="${R * .5}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1.5"/>`;
		if (o.bore !== false) s += `<ellipse cx="${x - 6}" cy="${y}" rx="${R * .34 * K}" ry="${R * .34}" fill="#0c0e10"/><ellipse cx="${x - 2}" cy="${y + R * .04}" rx="${R * .26 * K}" ry="${R * .28}" fill="url(#iSteelV)" opacity="${o.ball ? .9 : .25}"/><ellipse cx="${x - 6}" cy="${y}" rx="${R * .34 * K}" ry="${R * .34}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
		for (let i = 0; i < nb; i++) {
			const a = (i + .5) * 2 * Math.PI / nb;
			const cx = x + Math.cos(a) * br * K, cy = y + Math.sin(a) * br;
			const nh = R * .12, nr = R * .1;
			s += `<rect x="${cx - nh}" y="${cy - nr}" width="${nh}" height="${nr * 2}" fill="url(#iSteelH)"/><polygon points="${hexFace(cx - nh, cy, nr, K * 1.2)}" fill="url(#iChrome)"/><ellipse cx="${cx - nh - 3}" cy="${cy}" rx="${nr * .5 * K}" ry="${nr * .5}" fill="${M.dark ? '#1b1e22' : '#7d8795'}"/>`;
		}
		return s;
	};
	/* flange whose outer face points to +x (hidden), band visible */
	const flangeR = (M, x, y, R, t, o = {}) => {
		const rx = R * K;
		let s = `<path d="M${x - t},${y - R} L${x},${y - R} A${rx},${R} 0 0 1 ${x},${y + R} L${x - t},${y + R}Z" fill="url(#${o.grad || 'iCylH'})"/>`;
		s += `<path d="M${x},${y - R} A${rx},${R} 0 0 1 ${x},${y + R}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
		// stud tips visible beyond silhouette
		[-.62, -.25, .25, .62].forEach(f => { const yy = y + f * R * .95, xx = x + Math.sqrt(1 - f * f) * rx * .9; s += `<rect x="${xx - 2}" y="${yy - R * .07}" width="${R * .1}" height="${R * .14}" rx="3" fill="url(#iSteelH)"/>`; });
		return s;
	};
	const faceDef = M => `${lg('iFace2', [[0, M.c0], [.6, M.c1], [1, M.c3]], .55, 1, 0, 0)}`;

	/* ========== 3. BV-50 ball valve ========== */
	const valve = M => {
		const W = 1000, H = 640, y0 = 420;
		const xL = 140, xR = 860, R = 168, t = 54;
		let s = `<defs>${faceDef(M)}</defs>`;
		s += flangeR(M, xR, y0, R, t);
		// body
		const body = `M${xL + t - 4},${y0 - 104} C${xL + 150},${y0 - 108} ${430},${y0 - 212} ${515},${y0 - 212} C${600},${y0 - 212} ${xR - 150},${y0 - 108} ${xR - t + 4},${y0 - 104} L${xR - t + 4},${y0 + 104} C${xR - 150},${y0 + 108} ${600},${y0 + 212} ${515},${y0 + 212} C${430},${y0 + 212} ${xL + 150},${y0 + 108} ${xL + t - 4},${y0 + 104}Z`;
		s += `<path d="${body}" fill="url(#iCylH)"/><path d="${body}" filter="url(#iCast)" opacity=".55"/>`;
		// joint ring (right half ellipse) with bolts
		const js = 600;
		s += `<path d="M${js - 14},${y0 - 196} L${js + 14},${y0 - 196} A${196 * K},196 0 0 1 ${js + 14},${y0 + 196} L${js - 14},${y0 + 196} A${196 * K},196 0 0 0 ${js - 14},${y0 - 196}Z" fill="url(#iCylH)"/><path d="M${js - 14},${y0 - 196} A${196 * K},196 0 0 1 ${js - 14},${y0 + 196}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="3"/><path d="M${js + 14},${y0 - 196} A${196 * K},196 0 0 1 ${js + 14},${y0 + 196}" fill="none" stroke="#fff" stroke-opacity="${M.dark ? .1 : .7}" stroke-width="2"/>`;
		s += eng(M, 420, y0 + 14, 'DN50', { size: 26, weight: 800, ls: .12, fill: M.dark ? '#5d6672' : '#a5afbd' });
		s += eng(M, 420, y0 + 48, 'PN16', { size: 18, weight: 800, ls: .18, fill: M.dark ? '#5d6672' : '#a5afbd' });
		s += `<path d="M300,${y0 - 40} h80 l-12,-10 M380,${y0 - 40} l-12,10" stroke="${M.dark ? '#5d6672' : '#a5afbd'}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
		// bonnet
		const bx = 515, by = y0 - 200;
		s += `<path d="M${bx - 62},${by + 20} L${bx - 62},${by - 70} L${bx + 62},${by - 70} L${bx + 62},${by + 20}Z" fill="url(#iCylV)"/><ellipse cx="${bx}" cy="${by - 70}" rx="62" ry="12" fill="url(#iTopFace)"/>`;
		s += `<path d="M${bx - 90},${by - 72} L${bx - 90},${by - 92} L${bx + 90},${by - 92} L${bx + 90},${by - 72}Z" fill="url(#iCylV)"/><ellipse cx="${bx}" cy="${by - 92}" rx="90" ry="16" fill="url(#iTopFace)"/><ellipse cx="${bx}" cy="${by - 92}" rx="89" ry="15" fill="none" stroke="#fff" stroke-opacity="${M.dark ? .1 : .8}" stroke-width="1.5"/>`;
		[-60, 60].forEach(dx => { s += `<ellipse cx="${bx + dx}" cy="${by - 92}" rx="9" ry="3.5" fill="#1b1e22"/>`; });
		s += `<rect x="${bx - 18}" y="${by - 150}" width="36" height="60" fill="url(#iSteelV)"/>`;
		// lever: steel tongue + red grip
		const ly = by - 150;
		s += `<g filter="url(#iDrop)"><path d="M${bx - 40},${ly - 8} L${bx + 160},${ly - 10} L${bx + 160},${ly + 22} L${bx - 40},${ly + 22}Z" fill="url(#iSteelH)"/><path d="M${bx - 40},${ly - 8} L${bx - 30},${ly - 18} L${bx + 168},${ly - 20} L${bx + 160},${ly - 10}Z" fill="#fff" opacity="${M.dark ? .15 : .7}"/>`;
		s += `<path d="M${bx + 120},${ly - 26} L${bx + 430},${ly - 36} Q${bx + 478},${ly - 37} ${bx + 478},${ly - 4} L${bx + 478},${ly + 14} Q${bx + 478},${ly + 40} ${bx + 440},${ly + 40} L${bx + 120},${ly + 40}Z" fill="url(#iRedH)"/>`;
		s += `<path d="M${bx + 120},${ly - 26} L${bx + 132},${ly - 40} L${bx + 438},${ly - 50} Q${bx + 480},${ly - 50} ${bx + 478},${ly - 22} L${bx + 478},${ly - 4} Q${bx + 478},${ly - 37} ${bx + 430},${ly - 36}Z" fill="#ff8f9a"/>`;
		s += `<path d="M${bx + 150},${ly - 22} L${bx + 420},${ly - 31}" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" filter="url(#iB1)"/>`;
		for (let i = 0; i < 6; i++) s += `<rect x="${bx + 330 + i * 18}" y="${ly - 24 - i * .4}" width="5" height="60" rx="2.5" fill="#000" opacity=".12"/>`;
		s += `</g>`;
		s += `<polygon points="${hexFace(bx, ly - 14, 28, .9, 0)}" fill="url(#iChrome)"/><ellipse cx="${bx}" cy="${ly - 22}" rx="13" ry="6" fill="url(#iSteelV)"/><rect x="${bx - 28}" y="${ly - 14}" width="56" height="14" fill="url(#iSteelV)"/>`;
		s += flangeL(M, xL, y0, R, t, { ball: true });
		s += `<text x="${bx + 300}" y="${ly + 14}" ${MONO} font-size="17" font-weight="700" fill="#fff" fill-opacity=".85" text-anchor="middle" letter-spacing="5" transform="rotate(-1.9 ${bx + 300} ${ly + 8})">HAMOON</text>`;
		return { w: W, h: H, svg: s };
	};

	/* ========== 4. CP-15 centrifugal pump + motor (side elevation) ========== */
	const pump = M => {
		const W = 1060, H = 640, ay = 330;
		let s = '';
		// base plate
		s += `<path d="M20,532 L40,512 L1020,512 L1040,532Z" fill="url(#iTopFace)"/><rect x="20" y="532" width="1020" height="46" rx="4" fill="${M.dark ? '#1f2328' : '#3b414a'}"/><rect x="20" y="532" width="1020" height="3" fill="#fff" opacity="${M.dark ? .08 : .25}"/>`;
		[70, 990].forEach(x => { s += `<ellipse cx="${x}" cy="522" rx="16" ry="5" fill="#0b0c0e" opacity=".75"/><polygon points="${hexFace(x, 518, 12, 1.3, 0).split(' ').map(p => { const [a, b] = p.split(','); return `${a},${(522 + (b - 518) * .35).toFixed(1)}`; }).join(' ')}" fill="url(#iSteelH)"/>`; });
		// motor feet
		[[200, 280], [430, 510]].forEach(([a, b]) => { s += `<path d="M${a + 10},440 L${b - 10},440 L${b + 8},514 L${a - 8},514Z" fill="url(#iCylV)"/><rect x="${a - 8}" y="506" width="${b - a + 16}" height="8" fill="#000" opacity=".2"/>`; });
		// fan cowl
		s += `<path d="M150,${ay - 146} L104,${ay - 146} Q66,${ay - 146} 66,${ay - 100} L66,${ay + 100} Q66,${ay + 146} 104,${ay + 146} L150,${ay + 146}Z" fill="url(#iCylH)"/>`;
		[92, 116, 140].forEach(x => { s += `<rect x="${x}" y="${ay - 144}" width="2" height="288" fill="#000" opacity=".12"/><rect x="${x + 2}" y="${ay - 144}" width="1.4" height="288" fill="#fff" opacity="${M.dark ? .05 : .5}"/>`; });
		// motor body with fins
		const mx0 = 150, mx1 = 540, mr = 158;
		s += `<rect x="${mx0}" y="${ay - mr}" width="${mx1 - mx0}" height="${mr * 2}" fill="url(#iCylH)"/>`;
		for (let i = 1; i < 18; i++) {
			const ph = -Math.PI / 2 + i * Math.PI / 18, y = ay + Math.sin(ph) * mr;
			s += `<rect x="${mx0 + 26}" y="${(y - 1.6).toFixed(1)}" width="${mx1 - mx0 - 52}" height="2.2" fill="#000" opacity="${.08 + .1 * Math.abs(Math.sin(ph))}"/><rect x="${mx0 + 26}" y="${(y + .8).toFixed(1)}" width="${mx1 - mx0 - 52}" height="1.4" fill="#fff" opacity="${M.dark ? .05 : .45 * (1 - Math.abs(Math.sin(ph)) * .6)}"/>`;
		}
		[mx0, mx1 - 26].forEach(x => { s += `<rect x="${x}" y="${ay - mr - 4}" width="26" height="${mr * 2 + 8}" rx="6" fill="url(#iCylH)"/><rect x="${x}" y="${ay - mr - 4}" width="2" height="${mr * 2 + 8}" fill="#000" opacity=".15"/>`; });
		// terminal box
		s += `<rect x="270" y="${ay - mr - 62}" width="150" height="66" rx="8" fill="url(#iCylV)"/><rect x="262" y="${ay - mr - 72}" width="166" height="16" rx="5" fill="url(#iTopFace)"/><rect x="262" y="${ay - mr - 58}" width="166" height="3" fill="#000" opacity=".15"/>`;
		s += screw(M, 280, ay - mr - 64, 5) + screw(M, 410, ay - mr - 64, 5);
		s += `<rect x="420" y="${ay - mr - 40}" width="34" height="26" fill="url(#iSteelH)"/>${hexFront(458, ay - mr - 27, 16, 34)}<rect x="466" y="${ay - mr - 34}" width="22" height="14" rx="3" fill="#1b1e22"/>`;
		// nameplate
		const nx = 222, ny = ay - 52;
		s += `<rect x="${nx}" y="${ny}" width="180" height="104" rx="6" fill="url(#iSteelH)" filter="url(#iDropS)"/><rect x="${nx}" y="${ny}" width="180" height="22" rx="6" fill="#ff4757"/><rect x="${nx}" y="${ny + 16}" width="180" height="6" fill="#ff4757"/>`;
		s += `<text x="${nx + 12}" y="${ny + 16}" ${MONO} font-size="12" font-weight="700" fill="#fff" letter-spacing="2">HAMOON</text><text x="${nx + 168}" y="${ny + 16}" ${MONO} font-size="11" fill="#fff" text-anchor="end">CP-15</text>`;
		['3~ MOT  IE3', '15 kW  2930 min⁻¹', '400V Δ  50Hz', 'IP55   CL.F'].forEach((t, i) => { s += `<text x="${nx + 12}" y="${ny + 40 + i * 17}" ${MONO} font-size="11.5" fill="#2b3037">${t}</text>`; });
		[[nx + 6, ny + 98], [nx + 174, ny + 98]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="2.5" fill="#6b7482"/>`; });
		// shaft & coupling guard (perforated)
		s += `<rect x="${mx1}" y="${ay - 20}" width="80" height="40" fill="url(#iSteelH)"/>`;
		s += `<rect x="560" y="${ay - 92}" width="96" height="184" rx="10" fill="url(#iCylH)"/><rect x="566" y="${ay - 84}" width="84" height="168" rx="6" fill="url(#iHoles)" opacity=".85"/><rect x="560" y="${ay - 92}" width="96" height="184" rx="10" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
		s += `<path d="M612,${ay + 102} l18,0 l-9,-14z" fill="#ff4757"/>`;
		// bearing bracket (lantern)
		s += `<path d="M656,${ay - 80} L712,${ay - 112} L712,${ay + 112} L656,${ay + 80}Z" fill="url(#iRedH)"/><path d="M656,${ay - 80} L712,${ay - 112} L712,${ay + 112} L656,${ay + 80}Z" filter="url(#iCast)" opacity=".5"/>`;
		// volute
		const vx0 = 712, vx1 = 880;
		const vol = `M${vx0},${ay - 150} C${vx0},${ay - 190} ${vx0 + 40},${ay - 200} ${vx0 + 84},${ay - 200} C${vx1 - 20},${ay - 200} ${vx1},${ay - 170} ${vx1},${ay - 120} L${vx1},${ay + 120} C${vx1},${ay + 168} ${vx1 - 30},${ay + 176} ${vx0 + 84},${ay + 176} C${vx0 + 30},${ay + 176} ${vx0},${ay + 160} ${vx0},${ay + 120}Z`;
		s += `<path d="${vol}" fill="url(#iRedV)"/><path d="${vol}" fill="url(#iCylH)" opacity=".35" style="mix-blend-mode:multiply"/><path d="${vol}" filter="url(#iCast)" opacity=".55"/>`;
		s += `<path d="M${vx0 + 20},${ay - 170} C${vx0 + 40},${ay - 188} ${vx1 - 40},${ay - 188} ${vx1 - 16},${ay - 150}" stroke="#fff" stroke-opacity=".45" stroke-width="4" fill="none" filter="url(#iB1)"/>`;
		// pump foot
		s += `<path d="M${vx0 + 26},${ay + 170} L${vx1 - 26},${ay + 170} L${vx1 - 10},514 L${vx0 + 10},514Z" fill="url(#iRedV)"/>`;
		// suction nozzle + flange
		s += `<rect x="${vx1}" y="${ay - 72}" width="96" height="144" fill="url(#iRedH)"/><rect x="${vx1 + 96}" y="${ay - 112}" width="28" height="224" rx="4" fill="url(#iRedH)"/>`;
		[-.92, -.38, .38, .92].forEach(f => { const yy = ay + f * 92; s += `<rect x="${vx1 + 124}" y="${yy - 11}" width="18" height="22" fill="url(#iSteelH)"/><rect x="${vx1 + 142}" y="${yy - 5}" width="8" height="10" rx="2" fill="url(#iSteelH)"/>`; });
		// discharge nozzle + flange
		const dx = 796;
		s += `<rect x="${dx - 48}" y="${ay - 286}" width="96" height="100" fill="url(#iRedV)"/><rect x="${dx - 104}" y="${ay - 314}" width="208" height="28" rx="4" fill="url(#iRedV)"/><ellipse cx="${dx}" cy="${ay - 314}" rx="104" ry="9" fill="#ff8a94"/>`;
		[-.92, -.38, .38, .92].forEach(f => { const xx = dx + f * 84; s += `${hexFront(xx, ay - 324, 22, 16)}<rect x="${xx - 4}" y="${ay - 338}" width="8" height="10" rx="2" fill="url(#iSteelV)"/>`; });
		s += `<ellipse cx="${dx}" cy="${ay - 314}" rx="40" ry="4" fill="#3a0a10" opacity=".7"/>`;
		// highlight label on volute
		s += `<rect x="${vx0 + 30}" y="${ay + 40}" width="110" height="34" rx="5" fill="#fff" opacity=".9"/><text x="${vx0 + 85}" y="${ay + 63}" ${MONO} font-size="13" font-weight="700" fill="#c0283a" text-anchor="middle" letter-spacing="2">CP-15</text>`;
		return { w: W, h: H, svg: s };
	};

	/* ========== 5. PLC-X8 controller on DIN rail ========== */
	const plc = M => {
		const W = 1060, H = 620, top = 40, bot = 580;
		let s = '';
		// rail
		s += `<rect x="0" y="282" width="${W}" height="56" rx="3" fill="url(#iSteelH)"/><rect x="0" y="292" width="${W}" height="36" fill="#000" opacity=".12"/>`;
		for (let x = 18; x < W; x += 54) s += `<rect x="${x}" y="303" width="30" height="14" rx="7" fill="${M.dark ? '#0b0c0e' : '#596270'}"/><rect x="${x}" y="315" width="30" height="2" rx="1" fill="#fff" opacity=".35"/>`;
		// backing shadow body
		s += `<g filter="url(#iNeu)"><rect x="40" y="${top}" width="940" height="${bot - top}" rx="14" fill="url(#iCh)"/></g>`;
		const mod = (x, w, label, kind) => {
			let m = `<g filter="url(#iDropS)"><rect x="${x}" y="${top}" width="${w}" height="${bot - top}" rx="12" fill="url(#iChV)"/></g>${bevel(x, top, w, bot - top, 11, 2)}`;
			m += `<rect x="${x + w - 3}" y="${top + 10}" width="3" height="${bot - top - 20}" fill="#000" opacity=".12"/>`;
			const tb = (y, n) => {
				let t = `<rect x="${x + 8}" y="${y}" width="${w - 16}" height="84" rx="6" fill="${M.dark ? '#16191d' : '#2c3138'}"/>`;
				const pitch = (w - 24) / n;
				for (let i = 0; i < n; i++) {
					const px = x + 12 + i * pitch + pitch / 2;
					t += `<rect x="${px - pitch * .36}" y="${y + 8}" width="${pitch * .72}" height="22" rx="3" fill="${i % 4 === 3 ? '#9aa4b2' : '#f08a24'}"/><rect x="${px - pitch * .36}" y="${y + 8}" width="${pitch * .72}" height="5" rx="2" fill="#fff" opacity=".35"/>`;
					t += `<rect x="${px - pitch * .3}" y="${y + 40}" width="${pitch * .6}" height="${pitch * .6}" rx="2" fill="#050607"/><rect x="${px - pitch * .3}" y="${y + 40}" width="${pitch * .6}" height="2" fill="#fff" opacity=".12"/>`;
					t += `<text x="${px}" y="${y + 76}" ${MONO} font-size="8.5" fill="#8b94a3" text-anchor="middle">${i}</text>`;
				}
				return t;
			};
			if (kind !== 'cpu') { m += tb(top + 12, kind === 'ps' ? 4 : 9); m += tb(bot - 96, kind === 'ps' ? 4 : 9); }
			m += eng(M, x + w / 2, top + 132, label, { size: 15, anchor: 'middle', ls: .14 });
			if (kind === 'io' || kind === 'do' || kind === 'ai') {
				const n = kind === 'ai' ? 8 : 16, cols = kind === 'ai' ? 1 : 2;
				for (let i = 0; i < n; i++) {
					const c = i % cols, r = Math.floor(i / cols);
					const lx = x + (cols === 2 ? w / 2 - 22 + c * 44 : w / 2 - 10), ly = top + 162 + r * 22;
					const on = ((i * 7 + x) % 5) < 3;
					m += led(M, lx, ly, kind === 'do' ? '#f59e0b' : '#22c55e', 4.2, on) + `<text x="${lx + (c ? 11 : -11)}" y="${ly + 4}" ${MONO} font-size="9" fill="${M.engr}" text-anchor="${c ? 'start' : 'end'}">${kind === 'ai' ? 'CH' + i : (cols === 2 ? (r + c * 8) : i)}</text>`;
					if (kind === 'ai') m += `<rect x="${lx + 30}" y="${ly - 3}" width="40" height="6" rx="3" fill="${M.dark ? '#16191d' : '#c3cbd6'}"/><rect x="${lx + 30}" y="${ly - 3}" width="${10 + ((i * 13) % 28)}" height="6" rx="3" fill="#22c55e"/>`;
				}
			}
			if (kind === 'ps') {
				m += led(M, x + 30, top + 172, '#22c55e', 5, 1) + eng(M, x + 44, top + 177, 'DC OK', { size: 11, ls: .08 });
				m += `<circle cx="${x + w / 2}" cy="${top + 236}" r="16" fill="url(#iChrome)"/><rect x="${x + w / 2 - 10}" y="${top + 234.5}" width="20" height="3" rx="1.5" fill="#4b5360" transform="rotate(-30 ${x + w / 2} ${top + 236})"/>` + eng(M, x + w / 2, top + 274, 'ADJ', { size: 10, anchor: 'middle' });
				for (let i = 0; i < 6; i++) m += `<rect x="${x + 22}" y="${top + 300 + i * 16}" width="${w - 44}" height="7" rx="3.5" fill="${M.dark ? '#121417' : '#9aa5b4'}"/>`;
				m += eng(M, x + w / 2, top + 412, '24V ⎓ 5A', { size: 11, anchor: 'middle', ls: .06 });
			}
			if (kind === 'cpu') {
				m += eng(M, x + 22, top + 46, 'HAMOON', { size: 20, weight: 800, ls: .28 });
				m += eng(M, x + 22, top + 70, 'PLC-X8 · CPU 1214', { size: 11 });
				m += recess(M, x + 22, top + 94, w - 44, 96, 8) + `<rect x="${x + 22}" y="${top + 94}" width="${w - 44}" height="96" rx="8" fill="#101316"/>`;
				m += `<text x="${x + 36}" y="${top + 120}" ${MONO} font-size="12" fill="#ff8a94" opacity=".75">MODE  AUTO</text><text x="${x + 36}" y="${top + 166}" ${MONO} font-size="34" font-weight="700" fill="#ff8a94" filter="url(#iGlow)">RUN</text><text x="${x + w - 36}" y="${top + 166}" ${MONO} font-size="13" fill="#ff8a94" text-anchor="end" opacity=".8">12.4ms</text>`;
				m += `<rect x="${x + 22}" y="${top + 94}" width="${w - 44}" height="96" rx="8" fill="url(#iGlare)"/>`;
				[['PWR', '#22c55e', 1], ['RUN', '#22c55e', 1], ['ERR', '#ff4757', 0], ['COM', '#f59e0b', 1]].forEach(([t, c, on], i) => { const ly = top + 232 + i * 30; m += led(M, x + 34, ly, c, 5, on) + eng(M, x + 50, ly + 4, t, { size: 11, ls: .1 }); });
				m += `<rect x="${x + w - 82}" y="${top + 222}" width="52" height="96" rx="10" fill="url(#iRecess)"/><rect x="${x + w - 72}" y="${top + 232}" width="32" height="40" rx="6" fill="url(#iChrome)" filter="url(#iDropS)"/>` + eng(M, x + w - 56, top + 336, 'RUN', { size: 10, anchor: 'middle' });
				[0, 1].forEach(i => { const px = x + 24 + i * 96; m += `<rect x="${px}" y="${top + 380}" width="80" height="62" rx="5" fill="${M.dark ? '#0d0f12' : '#2c3138'}"/><rect x="${px + 12}" y="${top + 392}" width="56" height="40" rx="2" fill="#050607"/><rect x="${px + 18}" y="${top + 394}" width="44" height="6" fill="#d4a650"/>${led(M, px + 8, top + 372, i ? '#f59e0b' : '#22c55e', 3, 1)}`; m += eng(M, px + 40, top + 462, 'ETH ' + (i + 1), { size: 10, anchor: 'middle' }); });
				m += `<rect x="${x + 24}" y="${top + 486}" width="110" height="10" rx="3" fill="#050607"/>` + eng(M, x + 24, top + 516, 'SD · 32GB', { size: 10, ls: .1 });
			}
			return m;
		};
		let x = 46;
		[[150, 'PS 24V', 'ps'], [244, '', 'cpu'], [126, 'DI 16', 'io'], [126, 'DI 16', 'io'], [126, 'DO 16', 'do'], [126, 'AI 8', 'ai']].forEach(([w, l, k]) => { s += mod(x, w, l, k); x += w + 6; });
		// end clamp
		s += `<rect x="${x + 6}" y="250" width="28" height="120" rx="4" fill="url(#iSteelH)" filter="url(#iDropS)"/>${screw(M, x + 20, 268, 6)}`;
		return { w: W, h: H, svg: s };
	};

	/* ========== 6. FM-200 inline flow meter ========== */
	const meter = M => {
		const W = 1000, H = 880, y0 = 680, xL = 120, xR = 880, R = 150, t = 46;
		let s = `<defs>${faceDef(M)}</defs>`;
		s += flangeR(M, xR, y0, R, t);
		// pipe stubs
		s += `<rect x="${xL + t - 2}" y="${y0 - 86}" width="${xR - xL - 2 * t + 4}" height="172" fill="url(#iCylH)"/>`;
		// meter body (liner + red bands)
		const b0 = 290, b1 = 710, br = 128;
		s += `<rect x="${b0}" y="${y0 - br}" width="${b1 - b0}" height="${br * 2}" fill="url(#iCylH)"/>`;
		[b0, b1 - 22].forEach(x => { s += `<rect x="${x}" y="${y0 - br - 6}" width="22" height="${br * 2 + 12}" rx="4" fill="url(#iRedH)"/>`; });
		s += `<path d="M${b0},${y0 - br} A${br * K},${br} 0 0 1 ${b0},${y0 + br}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;
		// flow arrow + nameplate on body
		s += `<path d="M${b0 + 60},${y0 + 62} h170 l-18,-14 M${b0 + 230},${y0 + 62} l-18,14" stroke="#ff4757" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + eng(M, b0 + 270, y0 + 69, 'FLOW', { size: 18, weight: 800, ls: .28 });
		// neck
		const hx = 500, hy = 330;
		s += `<rect x="${hx - 50}" y="${hy + 120}" width="100" height="${y0 - br - hy - 110}" fill="url(#iCylV)"/><ellipse cx="${hx}" cy="${y0 - br + 6}" rx="70" ry="14" fill="url(#iCylV)"/>${hexFront(hx, hy + 200, 130, 44, 'iCylV')}`;
		// head (disc facing viewer, side band on left)
		const hr = 210, dep = 34;
		s += `<g filter="url(#iNeu)"><circle cx="${hx - dep}" cy="${hy}" r="${hr}" fill="url(#iCylH)"/><rect x="${hx - dep}" y="${hy - hr}" width="${dep}" height="${hr * 2}" fill="url(#iCylH)"/><circle cx="${hx}" cy="${hy}" r="${hr}" fill="url(#iCh)"/></g>`;
		s += `<circle cx="${hx}" cy="${hy}" r="${hr - 1.5}" fill="none" stroke="url(#iEdge)" stroke-width="3"/>`;
		// cable glands
		[166, 14].forEach(a => { s += `<g transform="translate(${hx - dep / 2} ${hy}) rotate(${a}) translate(${hr - 14} 0)"><rect x="0" y="-22" width="40" height="44" fill="url(#iSteelH)"/><rect x="40" y="-29" width="20" height="58" rx="2" fill="url(#iChrome)"/><rect x="60" y="-18" width="22" height="36" rx="4" fill="url(#iSteelH)"/><path d="M82,-11 C110,-11 120,-10 150,-14 L150,14 C120,10 110,11 82,11Z" fill="#1d2025"/><rect x="82" y="-8" width="66" height="3" fill="#fff" opacity=".12"/></g>`; });
		// bezel + window
		s += `<circle cx="${hx}" cy="${hy}" r="168" fill="none" stroke="url(#iChrome)" stroke-width="18"/><circle cx="${hx}" cy="${hy}" r="158" fill="#0d1013"/>`;
		const lx = hx - 120, ly = hy - 82, lw = 240, lh = 160;
		s += `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="10" fill="#111518" stroke="#fff" stroke-opacity=".05"/>`;
		s += `<text x="${lx + 16}" y="${ly + 26}" ${MONO} font-size="12" fill="#ff8a94" opacity=".7">Q  LINE 03</text><text x="${lx + lw - 16}" y="${ly + 26}" ${MONO} font-size="12" fill="#ff8a94" opacity=".7" text-anchor="end">▲</text>`;
		s += `<text x="${lx + 16}" y="${ly + 88}" ${MONO} font-size="56" font-weight="700" fill="#ff8a94" filter="url(#iGlow)">42.7</text><text x="${lx + lw - 16}" y="${ly + 86}" ${MONO} font-size="17" fill="#ff8a94" text-anchor="end">m³/h</text>`;
		for (let i = 0; i < 20; i++) s += `<rect x="${lx + 16 + i * 10.5}" y="${ly + 104}" width="7" height="12" rx="1" fill="#ff4757" opacity="${i < 13 ? .9 : .15}"/>`;
		s += `<text x="${lx + 16}" y="${ly + 144}" ${MONO} font-size="13" fill="#ff8a94" opacity=".8">Σ 018204.6 m³</text>`;
		s += `<path d="M${hx - 140},${hy - 60} A158,158 0 0 1 ${hx + 40},${hy - 154} L${hx - 40},${hy - 154} Z" fill="#fff" opacity="${M.dark ? .05 : .09}"/><path d="${arcPath(hx, hy, 150, 200, 255)}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".35" filter="url(#iB1)"/>`;
		[45, 135, 225, 315].forEach(a => { const r = a * Math.PI / 180; s += screw(M, hx + Math.cos(r) * 190, hy + Math.sin(r) * 190, 7, a); });
		s += eng(M, hx, hy - 182, 'HAMOON', { size: 13, anchor: 'middle', weight: 800, ls: .3 }) + eng(M, hx, hy + 194, 'FM-200', { size: 12, anchor: 'middle', ls: .3 });
		s += flangeL(M, xL, y0, R, t);
		return { w: W, h: H, svg: s };
	};

	const DEV = [panel, gauge, valve, pump, plc, meter];
	window.HAMOON = { IM, defs, DEV, panel, gauge, valve, pump, plc, meter, eng, screw, led, lg, rg, K, flangeL, flangeR, faceDef, hexFront, arcPath, MONO, SANS };

	const fitDev = (d, W, H, fw, fh, cy, smax = 1.15) => {
		const s = Math.min(fw / d.w, fh / d.h, smax);
		return { s, x: (W - d.w * s) / 2, y: cy - d.h * s / 2 };
	};

	/* ---------- product shot (1200×1200) ---------- */
	scenes['ind-product'] = (_, v) => {
		const M = IM(DARK), W = 1200, H = 1200;
		const d = DEV[(v - 1) % 6](M);
		const f = fitDev(d, W, H, 940, 800, 560, 1.05);
		const fy = f.y + d.h * f.s;
		return `<div class="abs" style="inset:0;background:${M.bg}"></div>
		<div class="abs" style="left:-10%;top:-20%;width:70%;height:70%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,${M.dark ? .06 : .5}),transparent);"></div>
		<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${defs(M)}
			<ellipse cx="${W / 2 + 20}" cy="${Math.min(fy + 110, H - 90)}" rx="${d.w * f.s * .46}" ry="34" fill="${M.floor}" filter="url(#iB40)"/>
			<ellipse cx="${W / 2 + 10}" cy="${Math.min(fy + 104, H - 96)}" rx="${d.w * f.s * .3}" ry="10" fill="${M.floor}" opacity=".6" filter="url(#iB14)"/>
			<g transform="translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${f.s.toFixed(4)})">${d.svg}</g>
		</svg>${grainFx(M.dark ? .35 : .24, .9, M.dark ? 'overlay' : 'multiply')}`;
	};
})();

/* ---------- hero, plant, extra blueprints ---------- */
(() => {
	const H_ = window.HAMOON, { IM, defs, MONO } = H_;
	const place = (d, x, yBottom, s) => `<g transform="translate(${x.toFixed(1)} ${(yBottom - d.h * s).toFixed(1)}) scale(${s})">${d.svg}</g>`;
	const contact = (cx, cy, rx, M, k = 1) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .09}" fill="${M.floor}" opacity="${.9 * k}" filter="url(#iB14)"/><ellipse cx="${cx + rx * .12}" cy="${cy + 6}" rx="${rx * 1.12}" ry="${rx * .2}" fill="${M.floor}" opacity="${.5 * k}" filter="url(#iB40)"/>`;
	const callout = (x0, y0, x1, y1, t, sub, M, anchor = 'start') => `<g><circle cx="${x0}" cy="${y0}" r="6" fill="#ff4757"/><circle cx="${x0}" cy="${y0}" r="14" fill="none" stroke="#ff4757" stroke-opacity=".5" stroke-width="2"/><path d="M${x0},${y0} L${x1},${y1} L${x1 + (anchor === 'start' ? 150 : -150)},${y1}" fill="none" stroke="${M.dark ? '#7c8594' : '#5d6878'}" stroke-width="1.6"/><text x="${x1 + (anchor === 'start' ? 4 : -4)}" y="${y1 - 12}" ${MONO} font-size="20" font-weight="700" letter-spacing="3" fill="${M.dark ? '#d9dee5' : '#2d3436'}" text-anchor="${anchor}">${t}</text><text x="${x1 + (anchor === 'start' ? 4 : -4)}" y="${y1 + 26}" ${MONO} font-size="14" letter-spacing="2" fill="${M.dark ? '#7c8594' : '#7a8494'}" text-anchor="${anchor}">${sub}</text></g>`;

	/* gauge mounted on a steel manifold block (so it can stand on a surface) */
	const gaugeStand = (M, val) => {
		const g = H_.gauge(M, val);
		const s = `${g.svg}<rect x="250" y="874" width="160" height="96" rx="8" fill="url(#iCylV)"/><rect x="250" y="874" width="160" height="12" rx="6" fill="url(#iTopFace)"/><ellipse cx="330" cy="880" rx="40" ry="6" fill="#000" opacity=".3"/>${H_.screw(M, 275, 930, 7)}${H_.screw(M, 385, 930, 7, 80)}`;
		return { w: g.w, h: 970, svg: s };
	};

	scenes['ind-hero2'] = () => {
		const M = IM(false), W = 2000, H = 1125;
		const pnl = H_.panel(M), gs = gaugeStand(M, 6.4), vl = H_.valve(M);
		const fl = 905;
		return `<div class="abs" style="inset:0;background:radial-gradient(90% 120% at 22% 0%,#fbfcfd,#e3e8ee 46%,#c7cfda 100%)"></div>
		<div class="abs" style="inset:0;background-image:linear-gradient(rgba(99,110,124,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(99,110,124,.10) 1px,transparent 1px);background-size:64px 64px;-webkit-mask:linear-gradient(#000,rgba(0,0,0,.5) 70%,transparent 80%)"></div>
		<div class="abs" style="left:0;right:0;top:${fl - 30}px;bottom:0;background:linear-gradient(#d9dfe7,#c9d1dc 40%,#b9c2cf)"></div>
		<div class="abs" style="left:0;right:0;top:${fl - 32}px;height:3px;background:rgba(255,255,255,.85)"></div>
		<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${defs(M)}
			<path d="M0,0 L900,0 L1500,${H} L0,${H}Z" fill="#fff" opacity=".22" filter="url(#iB40)"/><path d="M1300,0 L2000,0 L2000,${H} L1800,${H}Z" fill="#5a6678" opacity=".12" filter="url(#iB40)"/>
			${contact(1060, fl - 2, 420, M)}
			${place(pnl, 640, fl, .86)}
			${contact(1640, 1056, 230, M)}
			${place(gs, 1440, 1060, .6)}
			${contact(330, 1078, 320, M)}
			${place(vl, 30, 1092, .6)}
			${callout(1300, 300, 1400, 170, 'HCP-7', 'HMI CONTROL PANEL', M)}
			${callout(1735, 560, 1800, 420, 'PG-160', '0 – 16 BAR', M)}
			${callout(200, 880, 260, 560, 'BV-50', 'DN50 · PN16', M)}
		</svg>
		<div class="abs mono" style="left:4%;top:7%;font-size:22px;color:#4a5568">HAMOON — FIG. 01</div>
		<div class="abs mono" style="right:4%;top:7%;font-size:20px;color:#4a5568">SYSTEM OPERATIONAL <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#22c55e;box-shadow:0 0 12px #22c55e;margin-left:10px"></span></div>
		${vignette(.32, '30,40,60')}${grainFx(.26, .9)}`;
	};

	/* ---------- process skid diorama ---------- */
	scenes['ind-plant'] = () => {
		const M = IM(false), W = 1600, H = 1200;
		const lg = H_.lg;
		let s = '';
		const elbow = (cx, cy, rb, r, a0, a1, id) => {
			const o0 = (rb - r) / (rb + r);
			const stops = M.cyl.map(([t, c]) => [1 - t * (1 - o0), c]).reverse();
			return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${rb + r}">${stops.map(([o, c]) => `<stop offset="${o.toFixed(3)}" stop-color="${c}"/>`).join('')}</radialGradient><path d="${H_.arcPath(cx, cy, rb, a0, a1)}" stroke="url(#${id})" stroke-width="${r * 2}" fill="none"/>`;
		};
		const pipeH = (x0, x1, y, r) => `<rect x="${x0}" y="${y - r}" width="${x1 - x0}" height="${r * 2}" fill="url(#iCylH)"/>`;
		const pipeV = (x, y0, y1, r) => `<rect x="${x - r}" y="${y0}" width="${r * 2}" height="${y1 - y0}" fill="url(#iCylV)"/>`;
		const flgV = (x, y, r) => `<rect x="${x - 7}" y="${y - r}" width="14" height="${r * 2}" rx="3" fill="url(#iCylH)"/><rect x="${x - 7}" y="${y - r}" width="2" height="${r * 2}" fill="#000" opacity=".15"/>`;
		const flgH = (x, y, r) => `<rect x="${x - r}" y="${y - 7}" width="${r * 2}" height="14" rx="3" fill="url(#iCylV)"/>`;
		const tag = (x, y, t) => `<g filter="url(#iDropS)"><rect x="${x}" y="${y}" width="${t.length * 13 + 26}" height="34" rx="6" fill="url(#iChV)"/></g><rect x="${x}" y="${y}" width="6" height="34" rx="3" fill="#ff4757"/><text x="${x + 17}" y="${y + 23}" ${MONO} font-size="16" font-weight="700" fill="#5d6878" letter-spacing="2">${t}</text>`;
		const tank = (cx, r, yt, yb, name, lvl) => {
			let t = '';
			[cx - r * .8, cx + r * .8].forEach(x => { t += `<rect x="${x - 14}" y="${yb}" width="28" height="${978 - yb}" fill="url(#iCylV)"/><rect x="${x - 26}" y="972" width="52" height="10" rx="3" fill="url(#iSteelH)"/>`; });
			t += `<rect x="${cx - 14}" y="${yb}" width="28" height="${972 - yb}" fill="#9aa5b4"/>`;
			t += `<path d="M${cx - r},${yb} A${r},${r * .32} 0 0 0 ${cx + r},${yb}Z" fill="url(#iCylV)"/>`;
			t += `<g filter="url(#iNeu)"><rect x="${cx - r}" y="${yt}" width="${r * 2}" height="${yb - yt}" fill="url(#iCylV)"/></g>`;
			t += `<path d="M${cx - r},${yt + 1} A${r},${r * .42} 0 0 1 ${cx + r},${yt + 1}Z" fill="url(#iCylV)"/><path d="M${cx - r * .9},${yt - r * .16} A${r},${r * .42} 0 0 1 ${cx + r * .9},${yt - r * .16}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>`;
			[.33, .66].forEach(f => { const y = yt + (yb - yt) * f; t += `<rect x="${cx - r}" y="${y}" width="${r * 2}" height="2" fill="#000" opacity=".1"/><rect x="${cx - r}" y="${y + 2}" width="${r * 2}" height="1.5" fill="#fff" opacity=".6"/>`; });
			// sight glass
			const gx = cx - r * .55, g0 = yt + 60, g1 = yb - 50;
			t += `<rect x="${gx - 14}" y="${g0 - 16}" width="28" height="16" rx="3" fill="url(#iSteelV)"/><rect x="${gx - 14}" y="${g1}" width="28" height="16" rx="3" fill="url(#iSteelV)"/><rect x="${gx - 8}" y="${g0}" width="16" height="${g1 - g0}" rx="3" fill="#20262d"/><rect x="${gx - 6}" y="${g0 + (g1 - g0) * (1 - lvl)}" width="12" height="${(g1 - g0) * lvl}" rx="2" fill="#ff4757" opacity=".85"/><rect x="${gx - 4}" y="${g0 + 4}" width="3" height="${g1 - g0 - 8}" fill="#fff" opacity=".35"/>`;
			for (let i = 1; i < 6; i++) t += `<rect x="${gx + 10}" y="${g0 + (g1 - g0) * i / 6}" width="10" height="2" fill="#7a8494"/>`;
			// manway
			t += `<rect x="${cx + r * .2 - 30}" y="${yt - r * .42 - 24}" width="60" height="30" fill="url(#iCylV)"/><ellipse cx="${cx + r * .2}" cy="${yt - r * .42 - 24}" rx="38" ry="8" fill="url(#iTopFace)"/>`;
			t += `<rect x="${cx + r * .1}" y="${yt + (yb - yt) * .45}" width="${r * .72}" height="70" rx="8" fill="url(#iCh)" filter="url(#iDropS)"/><text x="${cx + r * .46}" y="${yt + (yb - yt) * .45 + 32}" ${MONO} font-size="20" font-weight="800" fill="#5d6878" text-anchor="middle" letter-spacing="3">${name}</text><text x="${cx + r * .46}" y="${yt + (yb - yt) * .45 + 54}" ${MONO} font-size="12" fill="#8a94a6" text-anchor="middle" letter-spacing="2">${r > 140 ? '12 m³' : '8 m³'}</text>`;
			return t;
		};
		const pmp = H_.pump(M), fm = H_.meter(M), bv = H_.valve(M), pg = H_.gauge(M, 5.2), pg2 = H_.gauge(M, 3.6), pnl = H_.panel(M);
		const hy = 540, hr = 26;
		// skid base
		s += `<path d="M60,990 L84,966 L1516,966 L1540,990Z" fill="url(#iTopFace)"/><rect x="60" y="990" width="1480" height="54" rx="4" fill="#3b414a"/><rect x="60" y="990" width="1480" height="3" fill="#fff" opacity=".25"/>`;
		for (let x = 110; x < 1520; x += 200) s += `<rect x="${x}" y="1004" width="90" height="26" rx="3" fill="#2b3037"/>`;
		// panel on wall
		s += `<rect x="1288" y="380" width="22" height="120" fill="url(#iSteelV)"/>` + place(pnl, 1095, 400, .44);
		// tanks
		s += tank(290, 160, 310, 860, 'T-101', .62);
		s += tank(1330, 130, 560, 860, 'T-102', .4);
		// header + riser
		s += pipeH(450, 1000, hy, hr) + flgV(456, hy, hr + 14);
		s += elbow(1000, hy + 60, 60, hr, 270, 360, 'iElb1');
		s += pipeV(1060, hy + 60, 668, hr);
		// tee + gauge branch on riser
		s += pipeH(1060, 1120, 610, 14) + flgV(1118, 610, 22);
		// pump (suction right)
		const ps = .5, px = 640, pyB = 966;
		const ptop = pyB - pmp.h * ps;
		s += pipeH(px + 1010 * ps, 1200, ptop + 330 * ps, 40) + flgV(1196, ptop + 330 * ps, 60);
		s += place(pmp, px, pyB, ps);
		// inline valve + flow meter on header
		s += place(bv, 470, hy + (640 - 420) * .2, .2);
		s += place(fm, 690, hy + (880 - 680) * .3, .3);
		// gauges
		s += place(pg2, 1065, 598, .17);
		s += pipeV(220, 200, 236, 10) + place(pg, 162, 210, .18);
		// tags
		s += tag(150, 820, 'LI-101');
		s += tag(690, 924, 'P-201') + tag(470, 640, 'FV-301') + tag(800, 640, 'FT-302') + tag(1150, 520, 'PI-303') + tag(1110, 120, 'HMI-01');
		return `<div class="abs" style="inset:0;background:radial-gradient(100% 90% at 25% 10%,#f8f9fb,#e2e7ed 50%,#ccd4df)"></div>
		<div class="abs" style="inset:0;background-image:linear-gradient(rgba(99,110,124,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(99,110,124,.09) 1px,transparent 1px);background-size:80px 80px;-webkit-mask:linear-gradient(#000 40%,transparent 78%)"></div>
		<div class="abs" style="left:0;right:0;top:930px;bottom:0;background:linear-gradient(#dde2e9,#c5cdd8)"></div>
		<svg class="abs" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0;direction:ltr">${defs(M)}
			<ellipse cx="800" cy="1060" rx="760" ry="40" fill="${M.floor}" filter="url(#iB40)"/>
			${s}
		</svg>
		<div class="abs mono" style="left:4%;top:5%;font-size:18px;color:#4a5568">HAMOON — PROCESS SKID PS-03</div>
		${vignette(.18, '40,50,70')}${grainFx(.26, .9)}`;
	};

	/* ---------- extra blueprint drawings (v5 pump section, v6 gauge) ---------- */
	scenes['blueprint-x'] = v => {
		const C = '#cfe3ff', D = '#9cc3ff';
		const ln = (d, w = 2, dash = '') => `<path d="${d}" fill="none" stroke="${C}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
		const cl = d => `<path d="${d}" fill="none" stroke="${D}" stroke-width="1.2" stroke-dasharray="26 6 4 6" opacity=".8"/>`;
		const tx = (x, y, t, a = 'middle', sz = 16) => `<text x="${x}" y="${y}" font-family="DejaVu Sans Mono,monospace" font-size="${sz}" font-weight="600" letter-spacing="2" fill="${D}" text-anchor="${a}">${t}</text>`;
		const arrowH = (x0, x1, y, t) => `${ln(`M${x0},${y} L${x1},${y}`, 1.3)}${ln(`M${x0 + 14},${y - 6} L${x0},${y} L${x0 + 14},${y + 6} M${x1 - 14},${y - 6} L${x1},${y} L${x1 - 14},${y + 6}`, 1.3)}${tx((x0 + x1) / 2, y - 10, t)}`;
		const arrowV = (x, y0, y1, t) => `${ln(`M${x},${y0} L${x},${y1}`, 1.3)}${ln(`M${x - 6},${y0 + 14} L${x},${y0} L${x + 6},${y0 + 14} M${x - 6},${y1 - 14} L${x},${y1} L${x + 6},${y1 - 14}`, 1.3)}<text x="${x - 12}" y="${(y0 + y1) / 2}" font-family="DejaVu Sans Mono,monospace" font-size="16" font-weight="600" letter-spacing="2" fill="${D}" text-anchor="middle" transform="rotate(-90 ${x - 12} ${(y0 + y1) / 2})">${t}</text>`;
		let g = '';
		if (v % 2 === 1) { // pump section
			const cx = 520, cy = 520;
			const sp = [];
			for (let i = 0; i <= 120; i++) { const a = -Math.PI / 2 + i / 120 * Math.PI * 1.85, r = 200 + 70 * i / 120; sp.push(`${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
			const sp2 = [];
			for (let i = 0; i <= 120; i++) { const a = -Math.PI / 2 + i / 120 * Math.PI * 1.85, r = 220 + 90 * i / 120; sp2.push(`${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`); }
			g += `<defs><pattern id="bpH" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.4" height="12" fill="${C}" opacity=".55"/></pattern></defs>`;
			const spR = sp.slice().reverse().map((p, i) => (i ? 'L' : 'L') + p.slice(1)).join('');
			g += `<path d="${sp2.join('')} ${spR}Z" fill="url(#bpH)" stroke="none" opacity=".7"/>`;
			g += ln(sp.join('')) + ln(sp2.join(''));
			g += ln(`M${cx},${cy - 200} L${cx},${cy - 380} M${cx + 120},${cy - 300} L${cx + 120},${cy - 380} M${cx - 30},${cy - 380} L${cx + 150},${cy - 380} M${cx - 30},${cy - 396} L${cx + 150},${cy - 396} M${cx - 30},${cy - 380} L${cx - 30},${cy - 396} M${cx + 150},${cy - 380} L${cx + 150},${cy - 396}`);
			g += `<circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="${C}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="60" fill="none" stroke="${C}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="${C}" stroke-width="2"/><rect x="${cx - 6}" y="${cy - 34}" width="12" height="10" fill="none" stroke="${C}" stroke-width="1.6"/>`;
			for (let i = 0; i < 7; i++) { const a0 = i * 2 * Math.PI / 7; const p = t => { const r = 60 + 110 * t, a = a0 + t * 1.1; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }; g += ln(`M${p(0)} Q${p(.45)} ${p(1)}`, 2.4); }
			g += cl(`M${cx - 330},${cy} L${cx + 360},${cy} M${cx},${cy - 430} L${cx},${cy + 320}`);
			g += arrowH(cx - 170, cx + 170, cy + 250, 'Ø 340');
			g += arrowV(cx - 330, cy - 380, cy, '380');
			g += tx(cx + 60, cy - 410, 'DN 80 — DISCHARGE');
			g += tx(cx + 210, cy + 120, 'IMPELLER Z=7', 'start', 14);
			// side elevation (small)
			const sx = 1000, sy = 560;
			g += ln(`M${sx},${sy - 110} L${sx + 300},${sy - 110} L${sx + 300},${sy + 110} L${sx},${sy + 110}Z`) + ln(`M${sx - 40},${sy - 100} Q${sx - 60},${sy} ${sx - 40},${sy + 100} L${sx},${sy + 100} M${sx - 40},${sy - 100} L${sx},${sy - 100}`);
			for (let i = 1; i < 8; i++) g += ln(`M${sx + 20},${sy - 110 + i * 27.5} L${sx + 280},${sy - 110 + i * 27.5}`, 1, '');
			g += ln(`M${sx + 300},${sy - 18} L${sx + 360},${sy - 18} M${sx + 300},${sy + 18} L${sx + 360},${sy + 18}`) + ln(`M${sx + 360},${sy - 70} L${sx + 400},${sy - 90} L${sx + 400},${sy + 90} L${sx + 360},${sy + 70}Z`);
			g += ln(`M${sx + 400},${sy - 130} Q${sx + 400},${sy - 150} ${sx + 430},${sy - 150} L${sx + 470},${sy - 150} Q${sx + 500},${sy - 150} ${sx + 500},${sy - 110} L${sx + 500},${sy + 100} Q${sx + 500},${sy + 125} ${sx + 470},${sy + 125} L${sx + 430},${sy + 125} Q${sx + 400},${sy + 125} ${sx + 400},${sy + 100}Z`);
			g += ln(`M${sx + 430},${sy - 150} L${sx + 430},${sy - 210} M${sx + 470},${sy - 150} L${sx + 470},${sy - 210} M${sx + 405},${sy - 210} L${sx + 495},${sy - 210}`);
			g += ln(`M${sx - 60},${sy + 150} L${sx + 520},${sy + 150} L${sx + 520},${sy + 170} L${sx - 60},${sy + 170}Z`);
			g += cl(`M${sx - 80},${sy} L${sx + 540},${sy}`);
			g += arrowH(sx - 60, sx + 520, sy + 220, '1 120');
			g += tx(sx + 230, sy - 250, 'CP-15 · SIDE ELEVATION', 'middle', 14);
		} else { // gauge face + profile
			const cx = 560, cy = 480, R = 236;
			g += `<circle cx="${cx}" cy="${cy}" r="${R + 30}" fill="none" stroke="${C}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R - 30}" fill="none" stroke="${C}" stroke-width="1.2" stroke-dasharray="4 6"/>`;
			for (let i = 0; i <= 80; i++) { const v2 = i / 5, a = (135 + 270 * v2 / 16) * Math.PI / 180, maj = i % 10 === 0, r0 = R - (maj ? 46 : i % 5 === 0 ? 36 : 24); g += ln(`M${(cx + r0 * Math.cos(a)).toFixed(1)},${(cy + r0 * Math.sin(a)).toFixed(1)} L${(cx + (R - 12) * Math.cos(a)).toFixed(1)},${(cy + (R - 12) * Math.sin(a)).toFixed(1)}`, maj ? 3 : 1.4); if (maj) g += tx((cx + (R - 80) * Math.cos(a)).toFixed(1), (cy + (R - 80) * Math.sin(a) + 7).toFixed(1), v2, 'middle', 22); }
			const na = (135 + 270 * 6.4 / 16);
			g += `<g transform="translate(${cx} ${cy}) rotate(${na})">${ln('M-50,-10 L200,-2 L206,0 L200,2 L-50,10Z', 2)}<circle cx="-40" r="14" fill="none" stroke="${C}" stroke-width="2"/></g><circle cx="${cx}" cy="${cy}" r="22" fill="#0f2a4a" stroke="${C}" stroke-width="2"/>`;
			g += cl(`M${cx - R - 70},${cy} L${cx + R + 70},${cy} M${cx},${cy - R - 70} L${cx},${cy + R + 70}`);
			g += `<path d="${H_.arcPath(cx, cy, R - 20, 135 + 270 * 12 / 16, 405)}" stroke="${C}" stroke-width="10" fill="none" opacity=".35"/>`;
			g += arrowH(cx - R - 30, cx + R + 30, cy + R + 80, 'Ø 160');
			g += tx(cx, cy + 90, 'bar', 'middle', 22) + tx(cx + 180, cy - 230, 'RED ZONE 12–16', 'start', 14);
			// profile
			const px = 1110, py = cy;
			g += ln(`M${px},${py - R - 30} L${px + 120},${py - R - 30} L${px + 120},${py + R + 30} L${px},${py + R + 30}Z`) + ln(`M${px + 12},${py - R - 30} L${px + 12},${py + R + 30}`, 1.2);
			g += ln(`M${px + 30},${py + R + 30} L${px + 30},${py + R + 70} L${px + 90},${py + R + 70} L${px + 90},${py + R + 30}`);
			g += ln(`M${px + 14},${py + R + 70} L${px + 106},${py + R + 70} L${px + 106},${py + R + 110} L${px + 14},${py + R + 110}Z M${px + 44},${py + R + 70} L${px + 44},${py + R + 110} M${px + 76},${py + R + 70} L${px + 76},${py + R + 110}`);
			for (let i = 0; i < 6; i++) g += ln(`M${px + 36},${py + R + 116 + i * 9} L${px + 84},${py + R + 112 + i * 9}`, 1.2);
			g += ln(`M${px + 36},${py + R + 110} L${px + 36},${py + R + 168} L${px + 84},${py + R + 168} L${px + 84},${py + R + 110}`);
			g += arrowV(px + 200, py - R - 30, py + R + 30, '160') + tx(px - 24, py + R + 96, 'SW 22', 'end', 14) + tx(px - 24, py + R + 150, 'G ½ B', 'end', 14);
			g += arrowH(px, px + 120, py - R - 64, '62');
		}
		return `<div class="bp"><svg class="abs" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" style="inset:0;width:100%;height:100%;direction:ltr">${g}</svg>
			<div class="dim" style="left:5%;top:7%;font-size:20px;color:#cfe3ff">HAMOON / DWG-${String(v).padStart(3, '0')}</div>
			<div class="dim" style="right:5%;bottom:7%">FIG. ${String(v).padStart(2, '0')} — SCALE 1:${v === 5 ? 5 : 2}</div>
			<div class="abs" style="right:5%;top:7%;width:180px;border:2px solid #cfe3ff;font:600 14px ui-monospace,monospace;letter-spacing:.12em;direction:ltr">${['REV  C', 'DATE 1405', 'DRAWN HM'].map(t => `<div style="padding:8px 12px;border-bottom:1px solid rgba(207,227,255,.4)">${t}</div>`).join('')}</div></div>`;
	};
})();
