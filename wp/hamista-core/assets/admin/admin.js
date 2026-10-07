/**
 * Hamista admin app.
 *
 * Renders the whole Hamista screen from `window.hamistaAdmin` (see DEVELOPMENT.md):
 * a side navigation built from the schema sections, one view per section, a save
 * bar that sends only the keys that changed, plus the dashboard, demo importer and
 * tools screens. No dependencies; jQuery is reached only through wp.media and
 * wp.codeEditor.
 *
 * @package Hamista\Core
 */
( function () {
	'use strict';

	const data = window.hamistaAdmin;
	const root = document.getElementById( 'hamista-admin' );
	if ( ! data || ! root ) {
		return;
	}

	/* ------------------------------------------------------------------ *
	 * State
	 * ------------------------------------------------------------------ */

	const L = data.i18n || {};
	const schema = data.schema || {};
	const plugins = data.plugins || {};
	const links = data.links || {};
	const REST = data.rest || {};
	const IS_MAC = /Mac|iPhone|iPad/.test( navigator.platform || navigator.userAgent || '' );

	const media = {}; // Attachment id → preview URL.
	let saved = takeValues( data.values ); // Last values confirmed by the server.
	let state = clone( saved ); // Values being edited.

	const fields = {}; // key → { def, section }.
	const order = Object.keys( schema );
	order.forEach( function ( id ) {
		const defs = schema[ id ].fields;
		if ( defs && 'object' === typeof defs ) {
			Object.keys( defs ).forEach( function ( key ) {
				fields[ key ] = { def: defs[ key ], section: id };
			} );
		}
	} );

	const ui = {
		route: '',
		query: '',
		saving: false,
		rendered: [], // Field contexts currently on screen.
		dom: {},
	};
	let uid = 0;

	/* ------------------------------------------------------------------ *
	 * Small helpers
	 * ------------------------------------------------------------------ */

	function t( key ) {
		return Object.prototype.hasOwnProperty.call( L, key ) ? L[ key ] : key;
	}

	/** sprintf-lite: %s, %d and positional %1$s / %2$d. */
	function fmt( str ) {
		const args = arguments;
		let i = 1;
		return String( str ).replace( /%(\d+\$)?[sd]/g, function ( m, pos ) {
			const v = pos ? args[ parseInt( pos, 10 ) ] : args[ i++ ];
			return undefined === v ? '' : String( v );
		} );
	}

	function clone( v ) {
		return undefined === v ? v : JSON.parse( JSON.stringify( v ) );
	}

	function isObj( v ) {
		return null !== v && 'object' === typeof v;
	}

	function scalar( v ) {
		if ( true === v ) {
			return '1';
		}
		if ( false === v ) {
			return '0';
		}
		return null === v || undefined === v ? '' : String( v );
	}

	/** Order-independent serialisation, so 3 equals "3" and key order never matters. */
	function stable( v ) {
		if ( Array.isArray( v ) ) {
			return '[' + v.map( stable ).join( ',' ) + ']';
		}
		if ( isObj( v ) ) {
			return '{' + Object.keys( v ).sort().map( function ( k ) {
				return JSON.stringify( k ) + ':' + stable( v[ k ] );
			} ).join( ',' ) + '}';
		}
		return JSON.stringify( scalar( v ) );
	}

	function same( a, b ) {
		return stable( a ) === stable( b );
	}

	/** Loose value for show_if: '0', 0, false and '' are all "off". */
	function condVal( v ) {
		if ( true === v || 'true' === v ) {
			return '1';
		}
		if ( false === v || 'false' === v || null === v || undefined === v || '' === v ) {
			return '0';
		}
		return String( v );
	}

	function takeValues( values ) {
		const out = clone( values || {} );
		if ( isObj( out._media ) && ! Array.isArray( out._media ) ) {
			Object.keys( out._media ).forEach( function ( id ) {
				if ( out._media[ id ] ) {
					media[ id ] = out._media[ id ];
				}
			} );
		}
		delete out._media;
		return out;
	}

	/** Search normalisation: case, Arabic/Persian letter variants, diacritics, ZWNJ. */
	function norm( s ) {
		return String( s || '' )
			.toLowerCase()
			.replace( /[يى]/g, 'ی' )
			.replace( /ك/g, 'ک' )
			.replace( /[ً-ٰٟ]/g, '' )
			.replace( /‌/g, ' ' );
	}

	/** Iterate choices given as an object or (PHP list) array. */
	function eachChoice( choices, fn ) {
		if ( ! isObj( choices ) ) {
			return;
		}
		Object.keys( choices ).forEach( function ( value ) {
			fn( value, choices[ value ] );
		} );
	}

	function clamp( v, min, max ) {
		if ( undefined !== min && null !== min && v < min ) {
			return Number( min );
		}
		if ( undefined !== max && null !== max && v > max ) {
			return Number( max );
		}
		return v;
	}

	function basename( url ) {
		const file = String( url || '' ).split( /[?#]/ )[ 0 ].split( '/' ).pop();
		try {
			return decodeURIComponent( file );
		} catch ( e ) {
			return file;
		}
	}

	function isTyping( el ) {
		return !! el && ( /^(INPUT|TEXTAREA|SELECT)$/.test( el.tagName ) || el.isContentEditable );
	}

	/** Hyperscript: h( 'button', { class, text, 'data-x': 1 }, children ). */
	function h( tag, attrs, kids ) {
		const el = document.createElement( tag );
		if ( attrs ) {
			Object.keys( attrs ).forEach( function ( name ) {
				const val = attrs[ name ];
				if ( null === val || undefined === val || false === val ) {
					return;
				}
				if ( 'class' === name ) {
					el.className = val;
				} else if ( 'text' === name ) {
					el.textContent = val;
				} else if ( 'value' === name || 'checked' === name || 'selected' === name ) {
					el[ name ] = val;
				} else if ( 'style' === name && isObj( val ) ) {
					Object.keys( val ).forEach( function ( prop ) {
						el.style.setProperty( prop, val[ prop ] );
					} );
				} else {
					el.setAttribute( name, true === val ? '' : val );
				}
			} );
		}
		return add( el, kids );
	}

	function add( el, kids ) {
		if ( null === kids || undefined === kids || false === kids ) {
			return el;
		}
		if ( Array.isArray( kids ) ) {
			kids.forEach( function ( kid ) {
				add( el, kid );
			} );
			return el;
		}
		el.appendChild( 'object' === typeof kids ? kids : document.createTextNode( String( kids ) ) );
		return el;
	}

	/** Visually hidden text for screen readers. */
	function sr( text ) {
		return h( 'span', { class: 'hm-sr', text } );
	}

	/* ------------------------------------------------------------------ *
	 * Icons (24×24 line set, matching the plugin's own icons)
	 * ------------------------------------------------------------------ */

	const ICONS = {
		grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
		layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
		palette: '<path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.6-1.5-1.8-1.5-3.1 0-1 .8-1.7 1.8-1.7H16a5 5 0 0 0 5-5c0-3.6-4-6.5-9-6.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
		sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
		moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>',
		mobile: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
		pen: '<path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z"/>',
		menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
		book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
		bag: '<path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
		wave: '<path d="M2 12h2l2-6 3 12 3-15 3 15 3-9 2 3h2"/>',
		compress: '<path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/>',
		expand: '<path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/>',
		mouse: '<rect x="6.5" y="3" width="11" height="18" rx="5.5"/><path d="M12 7v3"/>',
		dot: '<circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
		ring: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
		contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
		speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
		gauge: '<path d="M4.5 18a9 9 0 1 1 15 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1.4"/>',
		code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
		cog: '<path d="M10.3 3.2a1.7 1.7 0 0 1 3.4 0l.2 1.2a7.5 7.5 0 0 1 1.9 1.1l1.1-.5a1.7 1.7 0 0 1 2.2.7l.2.3a1.7 1.7 0 0 1-.4 2.3l-1 .7a7.6 7.6 0 0 1 0 2.2l1 .7a1.7 1.7 0 0 1 .4 2.3l-.2.3a1.7 1.7 0 0 1-2.2.7l-1.1-.5a7.5 7.5 0 0 1-1.9 1.1l-.2 1.2a1.7 1.7 0 0 1-3.4 0l-.2-1.2a7.5 7.5 0 0 1-1.9-1.1l-1.1.5a1.7 1.7 0 0 1-2.2-.7l-.2-.3a1.7 1.7 0 0 1 .4-2.3l1-.7a7.6 7.6 0 0 1 0-2.2l-1-.7a1.7 1.7 0 0 1-.4-2.3l.2-.3a1.7 1.7 0 0 1 2.2-.7l1.1.5a7.5 7.5 0 0 1 1.9-1.1Z"/><circle cx="12" cy="12" r="2.8"/>',
		search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
		check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
		close: '<path d="M6 6l12 12M18 6 6 18"/>',
		plus: '<path d="M12 5v14M5 12h14"/>',
		'arrow-up': '<path d="M12 19V5m-6 6 6-6 6 6"/>',
		'arrow-down': '<path d="M12 5v14m6-6-6 6-6-6"/>',
		chevron: '<path d="m6 9 6 6 6-6"/>',
		'chevron-end': '<path d="m9 6 6 6-6 6"/>',
		trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7"/>',
		eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="3"/>',
		'eye-off': '<path d="m3 3 18 18M10.6 5.1A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-3 3.9M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 19 12 19a9 9 0 0 0 5.3-1.7M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
		external: '<path d="M14 4h6v6m0-6-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
		download: '<path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/>',
		upload: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
		refresh: '<path d="M20 11A8 8 0 0 0 5.6 6.6L4 8.5M4 13a8 8 0 0 0 14.4 4.4L20 15.5"/><path d="M4 4v4.5h4.5M20 20v-4.5h-4.5"/>',
		alert: '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.5m0 2.7v.1"/>',
		info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5m0-8.7v.1"/>',
		image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 2.5-2.5L20 19"/>',
		type: '<path d="M5 7V5h14v2M12 5v14m-3 0h6"/>',
		mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
		sliders: '<path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
	};

	function icon( name, size ) {
		const paths = ICONS[ name ];
		if ( ! paths ) {
			return null;
		}
		const s = size || 20;
		const tpl = document.createElement( 'template' );
		tpl.innerHTML = '<svg class="hm-ico hm-ico--' + name + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
		return tpl.content.firstChild;
	}

	/** The geometric "H" monogram (same drawing as the admin menu icon). */
	function brandMark( size ) {
		const tpl = document.createElement( 'template' );
		tpl.innerHTML = '<svg class="hm-mark" width="' + size + '" height="' + size + '" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M5 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm1.5 3.5v9h2.25v-3.6h2.5v3.6h2.25v-9h-2.25v3.4h-2.5V5.5Z"/></svg>';
		return tpl.content.firstChild;
	}

	/* ------------------------------------------------------------------ *
	 * REST
	 * ------------------------------------------------------------------ */

	async function api( path, body, method ) {
		const verb = method || 'POST';
		let res;
		try {
			res = await fetch( REST.root + path, {
				method: verb,
				credentials: 'same-origin',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': REST.nonce,
				},
				body: 'GET' === verb ? undefined : JSON.stringify( body || {} ),
			} );
		} catch ( e ) {
			throw new Error( t( 'offline' ) );
		}
		let json = {};
		try {
			json = await res.json();
		} catch ( e ) {
			json = {};
		}
		if ( ! res.ok ) {
			const err = new Error( 'rest_cookie_invalid_nonce' === json.code ? t( 'sessionExpired' ) : ( json.message || t( 'requestFailed' ) ) );
			err.code = json.code;
			err.status = res.status;
			throw err;
		}
		return json || {};
	}

	/** Disable a button while a request runs (spinner via CSS). */
	function busy( btn, on, label ) {
		if ( ! btn ) {
			return;
		}
		if ( on ) {
			btn._hmLabel = Array.prototype.slice.call( btn.childNodes );
			btn.disabled = true;
			btn.setAttribute( 'aria-busy', 'true' );
			btn.classList.add( 'is-busy' );
			if ( label ) {
				btn.textContent = label;
			}
		} else {
			btn.disabled = false;
			btn.removeAttribute( 'aria-busy' );
			btn.classList.remove( 'is-busy' );
			if ( btn._hmLabel ) {
				btn.replaceChildren.apply( btn, btn._hmLabel );
			}
		}
	}

	/* ------------------------------------------------------------------ *
	 * Values, dirty tracking, visibility
	 * ------------------------------------------------------------------ */

	function val( key ) {
		return state[ key ];
	}

	function pluginActive( slug ) {
		return !! ( plugins[ slug ] && plugins[ slug ].active );
	}

	function sectionAvailable( id ) {
		const s = schema[ id ];
		return !! s && ( ! s.requires || pluginActive( s.requires ) );
	}

	function fieldAvailable( def ) {
		return ! def.requires || pluginActive( def.requires );
	}

	/** Cast an input string to the type of the field's default. */
	function cast( key, raw ) {
		const def = fields[ key ] ? fields[ key ].def.default : undefined;
		if ( 'number' === typeof def ) {
			const n = Number( raw );
			return isNaN( n ) ? def : n;
		}
		if ( 'boolean' === typeof def ) {
			return '1' === condVal( raw );
		}
		return null === raw || undefined === raw ? '' : String( raw );
	}

	function dirtyKeys() {
		return Object.keys( fields ).filter( function ( key ) {
			return 'action' !== fields[ key ].def.type && ! same( state[ key ], saved[ key ] );
		} );
	}

	function sectionDirty( id ) {
		return dirtyKeys().some( function ( key ) {
			return fields[ key ].section === id;
		} );
	}

	function conditionsMet( cond ) {
		if ( ! isObj( cond ) ) {
			return true;
		}
		return Object.keys( cond ).every( function ( key ) {
			const want = cond[ key ];
			const have = condVal( state[ key ] );
			return Array.isArray( want ) ? want.some( function ( w ) {
				return condVal( w ) === have;
			} ) : condVal( want ) === have;
		} );
	}

	function dependsText( cond ) {
		return Object.keys( cond || {} ).map( function ( key ) {
			return fields[ key ] ? fields[ key ].def.label : key;
		} ).join( t( 'listSep' ) );
	}

	function set( key, value ) {
		if ( same( state[ key ], value ) ) {
			return;
		}
		state[ key ] = value;
		refreshVisibility( false );
		updateDirtyUI();
	}

	/** Show/hide fields whose show_if changed; hide cards left empty. */
	function refreshVisibility( initial ) {
		const searching = !! ui.query;
		ui.rendered.forEach( function ( ctx ) {
			const ok = conditionsMet( ctx.def.show_if );
			if ( searching ) {
				// Search shows every match; dependent ones say what they depend on.
				ctx.el.classList.toggle( 'is-conditional', ! ok );
				ctx.note.hidden = ok;
				ctx.note.textContent = ok ? '' : fmt( t( 'dependsOn' ), dependsText( ctx.def.show_if ) );
				return;
			}
			const wasHidden = ctx.el.hidden;
			ctx.el.hidden = ! ok;
			if ( wasHidden && ok && ! initial ) {
				ctx.el.classList.remove( 'is-entering' );
				void ctx.el.offsetWidth; // Restart the entrance animation.
				ctx.el.classList.add( 'is-entering' );
				if ( ctx.cm ) {
					ctx.cm.refresh();
				}
			}
		} );
		ui.dom.view.querySelectorAll( '.hm-card[data-fields]' ).forEach( function ( card ) {
			card.hidden = ! card.querySelector( '.hm-field:not([hidden])' );
		} );
	}

	function updateDirtyUI() {
		const dirty = dirtyKeys();
		const lookup = {};
		dirty.forEach( function ( key ) {
			lookup[ key ] = true;
		} );
		ui.rendered.forEach( function ( ctx ) {
			ctx.el.classList.toggle( 'is-dirty', !! lookup[ ctx.key ] );
		} );
		updateSaveBar( dirty.length );
		markNav( dirty );
	}

	/**
	 * Take values returned by the server.
	 *
	 * opts.sent  – values that were just saved; a key is accepted only if it was not
	 *              edited again while the request ran.
	 * opts.force – true, or a list of keys, to overwrite local edits (reset/import).
	 */
	function applyServerValues( values, opts ) {
		const o = opts || {};
		const fresh = takeValues( values );
		let changedOnScreen = false;

		Object.keys( fresh ).forEach( function ( key ) {
			const forced = true === o.force || ( Array.isArray( o.force ) && -1 !== o.force.indexOf( key ) );
			let take = forced || same( state[ key ], saved[ key ] );
			if ( o.sent && Object.prototype.hasOwnProperty.call( o.sent, key ) ) {
				take = same( state[ key ], o.sent[ key ] );
			}
			if ( take && ! same( state[ key ], fresh[ key ] ) ) {
				state[ key ] = clone( fresh[ key ] );
				changedOnScreen = true;
			}
		} );
		saved = fresh;

		if ( changedOnScreen ) {
			renderView();
		} else {
			refreshVisibility( false );
			updateDirtyUI();
		}
	}

	async function save() {
		if ( ui.saving ) {
			return;
		}
		const keys = dirtyKeys();
		if ( ! keys.length ) {
			return;
		}
		const sent = {};
		keys.forEach( function ( key ) {
			sent[ key ] = clone( state[ key ] );
		} );

		ui.saving = true;
		updateSaveBar();
		try {
			const res = await api( 'settings', { values: sent } );
			ui.saving = false;
			applyServerValues( res.values || {}, { sent } );
			toast( res.message || t( 'saved' ), 'success' );
		} catch ( err ) {
			ui.saving = false;
			updateSaveBar();
			toast( err.message, 'error' );
		}
	}

	function discard() {
		if ( ! dirtyKeys().length ) {
			return;
		}
		state = clone( saved );
		renderView();
		toast( t( 'discarded' ) );
	}

	async function resetSection( id ) {
		const s = schema[ id ];
		if ( ! s ) {
			return;
		}
		const ok = await confirmDialog( {
			title: fmt( t( 'resetSectionQ' ), s.title ),
			message: t( 'resetSectionMsg' ),
			confirm: t( 'reset' ),
			danger: true,
		} );
		if ( ! ok ) {
			return;
		}
		try {
			const res = await api( 'settings/reset', { section: id } );
			applyServerValues( res.values || {}, { force: Object.keys( s.fields || {} ) } );
			toast( t( 'resetDone' ), 'success' );
		} catch ( err ) {
			toast( err.message, 'error' );
		}
	}

	/* ------------------------------------------------------------------ *
	 * Field controls
	 *
	 * Each control: render( ctx ) → nodes; optional input( ctx, event ) for
	 * input/change events, click( ctx, act, button ) for [data-act] buttons,
	 * mount( ctx ) once in the document. ctx = { key, def, id, el, control }.
	 * ------------------------------------------------------------------ */

	function describedBy( ctx ) {
		return ctx.def.desc ? ctx.id + '-desc' : null;
	}

	function selectWrap( select ) {
		return h( 'span', { class: 'hm-select' }, [ select, icon( 'chevron', 16 ) ] );
	}

	function iconBtn( name, label, act, disabled, extra ) {
		return h( 'button', Object.assign( { type: 'button', class: 'hm-icon-btn', 'data-act': act, 'aria-label': label, title: label, disabled: !! disabled }, extra || {} ), icon( name, 16 ) );
	}

	function textInput( ctx, type ) {
		const ltr = 'url' === type || 'password' === type || 'number' === type;
		return h( 'input', {
			type,
			id: ctx.id,
			class: 'hm-input',
			value: null === val( ctx.key ) || undefined === val( ctx.key ) ? '' : val( ctx.key ),
			placeholder: ctx.def.placeholder || null,
			autocomplete: 'password' === type ? 'new-password' : 'off',
			spellcheck: ltr ? 'false' : null,
			dir: ltr ? 'ltr' : null,
			'aria-describedby': describedBy( ctx ),
		} );
	}

	function rerenderControl( ctx ) {
		ctx.control.replaceChildren();
		add( ctx.control, ctx.ctrl.render( ctx ) );
		if ( ctx.ctrl.mount ) {
			ctx.ctrl.mount( ctx );
		}
	}

	function focusLater( el ) {
		if ( el ) {
			setTimeout( function () {
				el.focus();
			}, 0 );
		}
	}

	function rangeFill( input ) {
		const min = Number( input.min ) || 0;
		const max = Number( input.max ) || 100;
		const pct = max > min ? ( ( Number( input.value ) - min ) / ( max - min ) ) * 100 : 0;
		input.style.setProperty( '--hm-fill', pct + '%' );
	}

	function hex6( v ) {
		let c = String( v || '' ).trim();
		if ( ! c ) {
			return '';
		}
		if ( '#' !== c.charAt( 0 ) ) {
			c = '#' + c;
		}
		if ( /^#[0-9a-f]{3}$/i.test( c ) ) {
			c = '#' + c.charAt( 1 ) + c.charAt( 1 ) + c.charAt( 2 ) + c.charAt( 2 ) + c.charAt( 3 ) + c.charAt( 3 );
		}
		return /^#[0-9a-f]{6}$/i.test( c ) ? c.toUpperCase() : '';
	}

	function commitColor( ctx, value, from ) {
		const v = hex6( value );
		const wrap = ctx.control;
		set( ctx.key, v );
		const native = wrap.querySelector( '[data-part="native"]' );
		const hex = wrap.querySelector( '[data-part="hex"]' );
		if ( v && 'native' !== from ) {
			native.value = v.toLowerCase();
		}
		if ( 'hex' !== from ) {
			hex.value = v;
			hex.removeAttribute( 'aria-invalid' );
			wrap.querySelector( '.hm-field__error' ).hidden = true;
		}
		wrap.querySelector( '.hm-color__swatch' ).classList.toggle( 'is-empty', ! v );
		wrap.querySelector( '[data-act="color-clear"]' ).hidden = ! v;
		wrap.querySelectorAll( '.hm-swatch' ).forEach( function ( sw ) {
			sw.setAttribute( 'aria-pressed', String( sw.dataset.color.toUpperCase() === v ) );
		} );
	}

	/** Font weight from a file name — mirrors hamista_font_weight_from_name() in the theme. */
	const WEIGHT_TOKENS = [
		[ 'extrablack', 950 ], [ 'ultrablack', 950 ], [ 'extrabold', 800 ], [ 'ultrabold', 800 ],
		[ 'semibold', 600 ], [ 'demibold', 600 ], [ 'extralight', 200 ], [ 'ultralight', 200 ],
		[ 'hairline', 100 ], [ 'thin', 100 ], [ 'light', 300 ], [ 'regular', 400 ], [ 'normal', 400 ],
		[ 'book', 400 ], [ 'medium', 500 ], [ 'bold', 700 ], [ 'heavy', 900 ], [ 'black', 900 ], [ 'fat', 950 ],
	];

	function fontWeightFromName( name ) {
		const raw = String( name || '' );
		const flat = raw.replace( /[^a-z]/gi, '' ).toLowerCase();
		if ( -1 !== flat.indexOf( 'variable' ) || /(^|[^a-z])vf([^a-z]|$)/i.test( raw ) || -1 !== raw.indexOf( '[wght]' ) ) {
			return '100 900';
		}
		for ( let i = 0; i < WEIGHT_TOKENS.length; i++ ) {
			if ( -1 !== flat.indexOf( WEIGHT_TOKENS[ i ][ 0 ] ) ) {
				return String( WEIGHT_TOKENS[ i ][ 1 ] );
			}
		}
		return '400';
	}

	function fontStyleFromName( name ) {
		return /italic|oblique/i.test( String( name || '' ) ) ? 'italic' : 'normal';
	}

	const FONT_WEIGHTS = [ '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '100 900' ];
	const FONT_FILE = /\.(woff2?|ttf|otf)(\?.*)?$/i;
	const FONT_MIMES = [ 'font', 'application/font-woff', 'application/font-woff2', 'application/x-font-woff', 'application/x-font-ttf', 'application/x-font-truetype', 'application/x-font-otf', 'application/x-font-opentype', 'application/vnd.ms-opentype', 'application/octet-stream' ];

	function weightLabel( w ) {
		return '100 900' === w ? t( 'fontVariable' ) : w + ' · ' + t( 'w' + w );
	}

	function previewWeight( w ) {
		return /^\d+$/.test( w ) ? w : '400';
	}

	function cssString( s ) {
		return '"' + String( s ).replace( /["\\\n\r]/g, function ( c ) {
			return '\\' + c.charCodeAt( 0 ).toString( 16 ) + ' ';
		} ) + '"';
	}

	/** @font-face rules for uploaded files so each family previews in its own face. */
	function updateFontPreview( families ) {
		let style = document.getElementById( 'hm-font-preview' );
		if ( ! style ) {
			style = h( 'style', { id: 'hm-font-preview' } );
			document.head.appendChild( style );
		}
		let css = '';
		families.forEach( function ( fam, i ) {
			( fam.files || [] ).forEach( function ( file ) {
				css += '@font-face{font-family:"hm-preview-' + i + '";src:url(' + cssString( file.url ) + ');font-weight:' + ( String( file.weight ).replace( /[^0-9 ]/g, '' ) || '400' ) + ';font-style:' + ( 'italic' === file.style ? 'italic' : 'normal' ) + ';font-display:swap}';
			} );
		} );
		style.textContent = css;
	}

	function fontFamilies( ctx ) {
		const v = val( ctx.key );
		return Array.isArray( v ) ? clone( v ) : [];
	}

	function fontFamilyCard( ctx, fam, i ) {
		const files = fam.files || [];
		const face = '"hm-preview-' + i + '", var(--hm-a-font)';
		return h( 'div', { class: 'hm-font', 'data-family': i }, [
			h( 'div', { class: 'hm-font__head' }, [
				h( 'input', { type: 'text', class: 'hm-input hm-font__name', value: fam.family, 'data-part': 'family-name', 'aria-label': t( 'fontFamilyName' ), autocomplete: 'off', spellcheck: 'false' } ),
				h( 'span', { class: 'hm-font__count', text: 1 === files.length ? t( 'fontFileOne' ) : fmt( t( 'fontFiles' ), files.length ) } ),
				iconBtn( 'trash', t( 'fontRemoveFamily' ) + ': ' + fam.family, 'font-remove-family' ),
			] ),
			files.length ? h( 'p', { class: 'hm-font__preview', lang: 'fa', dir: 'rtl', style: { 'font-family': face }, text: t( 'fontSample' ) } ) : null,
			files.length ? h( 'ul', { class: 'hm-font__files' }, files.map( function ( file, j ) {
				const weights = FONT_WEIGHTS.slice();
				if ( -1 === weights.indexOf( String( file.weight ) ) ) {
					weights.push( String( file.weight ) );
				}
				const name = basename( file.url );
				return h( 'li', { class: 'hm-font__file', 'data-file': j }, [
					h( 'span', { class: 'hm-font__sample', 'aria-hidden': 'true', style: { 'font-family': face, 'font-weight': previewWeight( String( file.weight ) ), 'font-style': 'italic' === file.style ? 'italic' : 'normal' }, text: t( 'fontSampleShort' ) } ),
					h( 'span', { class: 'hm-font__filename', dir: 'ltr', title: file.url, text: name } ),
					selectWrap( h( 'select', { class: 'hm-select__el', 'data-part': 'weight', 'aria-label': t( 'fontWeight' ) + ': ' + name }, weights.map( function ( w ) {
						return h( 'option', { value: w, selected: w === String( file.weight ), text: t( 'w' + w ) !== 'w' + w || '100 900' === w ? weightLabel( w ) : w } );
					} ) ) ),
					selectWrap( h( 'select', { class: 'hm-select__el', 'data-part': 'style', 'aria-label': t( 'fontStyle' ) + ': ' + name }, [
						h( 'option', { value: 'normal', selected: 'italic' !== file.style, text: t( 'fontNormal' ) } ),
						h( 'option', { value: 'italic', selected: 'italic' === file.style, text: t( 'fontItalic' ) } ),
					] ) ),
					iconBtn( 'close', t( 'fontRemoveFile' ) + ': ' + name, 'font-remove-file' ),
				] );
			} ) ) : h( 'p', { class: 'hm-font__nofiles', text: t( 'fontNoFiles' ) } ),
			h( 'button', { type: 'button', class: 'hm-btn hm-btn--sm', 'data-act': 'font-upload' }, [ icon( 'upload', 16 ), t( 'fontUpload' ) ] ),
		] );
	}

	function blankRow( subs ) {
		const row = {};
		Object.keys( subs || {} ).forEach( function ( sub ) {
			const d = subs[ sub ];
			if ( 'select' === d.type && isObj( d.choices ) ) {
				row[ sub ] = Object.keys( d.choices )[ 0 ] || '';
			} else if ( 'toggle' === d.type ) {
				row[ sub ] = false;
			} else {
				row[ sub ] = '';
			}
		} );
		return row;
	}

	/** One sub-field inside a repeater row. */
	function subControl( ctx, i, sub, d, value ) {
		const id = ctx.id + '-' + i + '-' + sub;
		let control;
		if ( 'select' === d.type ) {
			const sel = h( 'select', { id, class: 'hm-select__el', 'data-sub': sub } );
			eachChoice( d.choices, function ( v, label ) {
				sel.appendChild( h( 'option', { value: v, selected: scalar( v ) === scalar( value ), text: isObj( label ) ? label.label : label } ) );
			} );
			control = selectWrap( sel );
		} else if ( 'toggle' === d.type ) {
			control = h( 'span', { class: 'hm-switch' }, [
				h( 'input', { type: 'checkbox', role: 'switch', id, class: 'hm-switch__input', checked: !! value, 'data-sub': sub } ),
				h( 'span', { class: 'hm-switch__track', 'aria-hidden': 'true' }, h( 'span', { class: 'hm-switch__thumb' } ) ),
			] );
		} else if ( 'textarea' === d.type ) {
			control = h( 'textarea', { id, class: 'hm-input', rows: 3, value: value || '', 'data-sub': sub } );
		} else {
			const type = 'url' === d.type || 'number' === d.type ? d.type : 'text';
			control = h( 'input', { type, id, class: 'hm-input', value: null === value || undefined === value ? '' : value, placeholder: d.placeholder || null, dir: 'url' === type ? 'ltr' : null, autocomplete: 'off', 'data-sub': sub } );
		}
		return h( 'div', { class: 'hm-row__field hm-row__field--' + d.type }, [ h( 'label', { class: 'hm-row__label', for: id, text: d.label } ), control ] );
	}

	/** Handlers for `action` fields, keyed by the schema's `action`. */
	const ACTIONS = {
		otp_test( value ) {
			return api( 'auth/test', { mobile: value } );
		},
	};

	const controls = {
		toggle: {
			render( ctx ) {
				return h( 'span', { class: 'hm-switch' }, [
					h( 'input', { type: 'checkbox', role: 'switch', id: ctx.id, class: 'hm-switch__input', checked: !! val( ctx.key ), 'aria-describedby': describedBy( ctx ) } ),
					h( 'span', { class: 'hm-switch__track', 'aria-hidden': 'true' }, h( 'span', { class: 'hm-switch__thumb' } ) ),
				] );
			},
			input( ctx, e ) {
				set( ctx.key, !! e.target.checked );
			},
		},

		select: {
			render( ctx ) {
				const cur = val( ctx.key );
				const sel = h( 'select', { id: ctx.id, class: 'hm-select__el', 'aria-describedby': describedBy( ctx ) } );
				eachChoice( ctx.def.choices, function ( value, label ) {
					sel.appendChild( h( 'option', { value, selected: scalar( value ) === scalar( cur ), text: isObj( label ) ? label.label : label } ) );
				} );
				return selectWrap( sel );
			},
			input( ctx, e ) {
				set( ctx.key, cast( ctx.key, e.target.value ) );
			},
		},

		cards: {
			group: true,
			render( ctx ) {
				const cur = val( ctx.key );
				let hasImage = false;
				const group = h( 'div', { class: 'hm-choices', role: 'radiogroup', 'aria-labelledby': ctx.id + '-label', 'aria-describedby': describedBy( ctx ) } );
				eachChoice( ctx.def.choices, function ( value, c ) {
					const choice = isObj( c ) ? c : { label: c };
					const checked = scalar( value ) === scalar( cur );
					hasImage = hasImage || !! choice.image;
					group.appendChild( h( 'label', { class: 'hm-choice' + ( checked ? ' is-selected' : '' ) }, [
						h( 'input', { type: 'radio', class: 'hm-choice__input', name: ctx.id, value, checked } ),
						choice.image ? h( 'span', { class: 'hm-choice__media' }, h( 'img', { src: choice.image, alt: '', width: 320, height: 200, decoding: 'async' } ) ) : null,
						! choice.image && choice.icon ? h( 'span', { class: 'hm-choice__icon' }, icon( choice.icon, 22 ) ) : null,
						h( 'span', { class: 'hm-choice__body' }, [
							h( 'span', { class: 'hm-choice__title', text: choice.label } ),
							choice.desc ? h( 'span', { class: 'hm-choice__desc', text: choice.desc } ) : null,
						] ),
						h( 'span', { class: 'hm-choice__check', 'aria-hidden': 'true' }, icon( 'check', 12 ) ),
					] ) );
				} );
				group.classList.add( hasImage ? 'hm-choices--media' : 'hm-choices--icons' );
				return group;
			},
			input( ctx, e ) {
				if ( ! e.target.checked ) {
					return;
				}
				set( ctx.key, cast( ctx.key, e.target.value ) );
				ctx.control.querySelectorAll( '.hm-choice' ).forEach( function ( el ) {
					el.classList.toggle( 'is-selected', el.querySelector( 'input' ).checked );
				} );
			},
		},

		color: {
			render( ctx ) {
				const cur = hex6( val( ctx.key ) );
				const presets = ( ctx.def.presets || [] ).map( function ( c ) {
					return h( 'button', { type: 'button', class: 'hm-swatch', style: { '--hm-swatch': c }, 'data-act': 'color-preset', 'data-color': c, 'aria-label': c, title: c, 'aria-pressed': String( c.toUpperCase() === cur ) } );
				} );
				return [
					h( 'div', { class: 'hm-color' }, [
						h( 'span', { class: 'hm-color__swatch' + ( cur ? '' : ' is-empty' ) }, h( 'input', { type: 'color', class: 'hm-color__native', value: ( cur || '#0052FF' ).toLowerCase(), 'data-part': 'native', 'aria-label': t( 'colorPick' ) + ': ' + ctx.def.label } ) ),
						h( 'input', { type: 'text', id: ctx.id, class: 'hm-input hm-color__hex', value: cur, placeholder: t( 'colorDefault' ), maxlength: 7, dir: 'ltr', spellcheck: 'false', autocomplete: 'off', 'data-part': 'hex', 'aria-describedby': describedBy( ctx ) } ),
						h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet hm-btn--sm', 'data-act': 'color-clear', hidden: ! cur, text: t( 'colorClear' ) } ),
					] ),
					h( 'p', { class: 'hm-field__error', id: ctx.id + '-error', hidden: true, text: t( 'colorInvalid' ) } ),
					presets.length ? h( 'div', { class: 'hm-swatches', role: 'group', 'aria-label': t( 'colorPresets' ) }, presets ) : null,
				];
			},
			input( ctx, e ) {
				const part = e.target.dataset.part;
				const error = ctx.control.querySelector( '.hm-field__error' );
				const invalid = function ( on ) {
					error.hidden = ! on;
					if ( on ) {
						e.target.setAttribute( 'aria-invalid', 'true' );
						e.target.setAttribute( 'aria-errormessage', error.id );
					} else {
						e.target.removeAttribute( 'aria-invalid' );
						e.target.removeAttribute( 'aria-errormessage' );
					}
				};
				if ( 'native' === part ) {
					commitColor( ctx, e.target.value, 'native' );
				} else if ( 'hex' === part ) {
					const raw = e.target.value.trim();
					const v = hex6( raw );
					if ( ! raw || v ) {
						invalid( false );
						commitColor( ctx, v, 'change' === e.type ? 'blur' : 'hex' );
					} else if ( 'change' === e.type ) {
						// Leaving an invalid value: fall back to the last valid one.
						e.target.value = hex6( val( ctx.key ) );
						invalid( false );
					} else if ( raw.replace( '#', '' ).length >= 6 || /[^#0-9a-f]/i.test( raw ) ) {
						invalid( true );
					}
				}
			},
			click( ctx, act, btn ) {
				if ( 'color-clear' === act ) {
					commitColor( ctx, '' );
					ctx.control.querySelector( '[data-part="hex"]' ).focus();
				} else if ( 'color-preset' === act ) {
					commitColor( ctx, btn.dataset.color );
				}
			},
		},

		range: {
			render( ctx ) {
				const d = ctx.def;
				const cur = Number( val( ctx.key ) );
				const v = isNaN( cur ) ? Number( d.default ) || 0 : cur;
				const range = h( 'input', { type: 'range', id: ctx.id, class: 'hm-range__input', min: d.min, max: d.max, step: d.step || 1, value: v, 'data-part': 'range', 'aria-describedby': describedBy( ctx ) } );
				rangeFill( range );
				return h( 'div', { class: 'hm-range' }, [
					range,
					h( 'span', { class: 'hm-range__box', dir: 'ltr' }, [
						h( 'input', { type: 'number', class: 'hm-input hm-range__num', min: d.min, max: d.max, step: d.step || 1, value: v, dir: 'ltr', 'data-part': 'num', 'aria-label': d.label + ( d.unit ? ' (' + d.unit + ')' : '' ) } ),
						d.unit ? h( 'span', { class: 'hm-range__unit', 'aria-hidden': 'true', text: d.unit } ) : null,
					] ),
				] );
			},
			input( ctx, e ) {
				const d = ctx.def;
				const range = ctx.control.querySelector( '[data-part="range"]' );
				const num = ctx.control.querySelector( '[data-part="num"]' );
				if ( e.target === range ) {
					num.value = range.value;
					rangeFill( range );
					set( ctx.key, cast( ctx.key, range.value ) );
					return;
				}
				let v = Number( num.value );
				if ( 'change' === e.type ) {
					v = '' === num.value || isNaN( v ) ? Number( val( ctx.key ) ) : clamp( v, d.min, d.max );
					num.value = v;
				} else if ( '' === num.value || isNaN( v ) || v !== clamp( v, d.min, d.max ) ) {
					return; // Wait for a complete, in-range number (or blur).
				}
				range.value = v;
				rangeFill( range );
				set( ctx.key, cast( ctx.key, v ) );
			},
		},

		number: {
			render( ctx ) {
				const d = ctx.def;
				return h( 'span', { class: 'hm-number', dir: 'ltr' }, [
					h( 'input', { type: 'number', id: ctx.id, class: 'hm-input', min: d.min, max: d.max, step: d.step || 'any', value: val( ctx.key ), dir: 'ltr', placeholder: d.placeholder || null, 'aria-describedby': describedBy( ctx ) } ),
					d.unit ? h( 'span', { class: 'hm-number__unit', 'aria-hidden': 'true', text: d.unit } ) : null,
				] );
			},
			input( ctx, e ) {
				const d = ctx.def;
				let v = Number( e.target.value );
				if ( '' === e.target.value || isNaN( v ) ) {
					if ( 'change' === e.type ) {
						e.target.value = val( ctx.key );
					}
					return;
				}
				if ( 'change' === e.type ) {
					v = clamp( v, d.min, d.max );
					e.target.value = v;
				}
				set( ctx.key, cast( ctx.key, v ) );
			},
		},

		text: {
			render( ctx ) {
				return textInput( ctx, 'text' );
			},
			input( ctx, e ) {
				set( ctx.key, e.target.value );
			},
		},

		url: {
			render( ctx ) {
				return textInput( ctx, 'url' );
			},
			input( ctx, e ) {
				set( ctx.key, e.target.value.trim() );
			},
		},

		password: {
			render( ctx ) {
				return h( 'div', { class: 'hm-input-group', dir: 'ltr' }, [
					textInput( ctx, 'password' ),
					h( 'button', { type: 'button', class: 'hm-input-group__btn', 'data-act': 'reveal', 'aria-label': t( 'show' ), title: t( 'show' ), 'aria-pressed': 'false' }, icon( 'eye', 18 ) ),
				] );
			},
			input( ctx, e ) {
				set( ctx.key, e.target.value );
			},
			click( ctx, act, btn ) {
				const input = ctx.control.querySelector( 'input' );
				const show = 'password' === input.type;
				input.type = show ? 'text' : 'password';
				btn.setAttribute( 'aria-pressed', String( show ) );
				btn.setAttribute( 'aria-label', show ? t( 'hide' ) : t( 'show' ) );
				btn.title = show ? t( 'hide' ) : t( 'show' );
				btn.replaceChildren( icon( show ? 'eye-off' : 'eye', 18 ) );
			},
		},

		textarea: {
			render( ctx ) {
				return h( 'textarea', { id: ctx.id, class: 'hm-input hm-textarea', rows: 4, value: val( ctx.key ) || '', placeholder: ctx.def.placeholder || null, 'aria-describedby': describedBy( ctx ) } );
			},
			input( ctx, e ) {
				set( ctx.key, e.target.value );
			},
		},

		code: {
			render( ctx ) {
				return h( 'textarea', { id: ctx.id, class: 'hm-input hm-code', rows: 10, dir: 'ltr', spellcheck: 'false', value: val( ctx.key ) || '', 'aria-describedby': describedBy( ctx ) } );
			},
			mount( ctx ) {
				const area = ctx.control.querySelector( 'textarea.hm-code' );
				const settings = isObj( data.codeEditor ) ? data.codeEditor[ 'html' === ctx.def.mode ? 'html' : 'css' ] : null;
				if ( ! settings || ! window.wp || ! window.wp.codeEditor ) {
					if ( isObj( data.codeEditor ) && ! settings ) {
						ctx.control.appendChild( h( 'p', { class: 'hm-field__hint', text: t( 'codeHint' ) } ) );
					}
					return;
				}
				const editor = window.wp.codeEditor.initialize( area, settings );
				ctx.cm = editor.codemirror;
				ctx.cm.on( 'change', function ( cm ) {
					set( ctx.key, cm.getValue() );
				} );
			},
			input( ctx, e ) {
				// CodeMirror's own hidden textarea also fires input events: ignore those.
				if ( ! ctx.cm && e.target.classList.contains( 'hm-code' ) ) {
					set( ctx.key, e.target.value );
				}
			},
		},

		media: {
			group: true,
			render( ctx ) {
				const id = Number( val( ctx.key ) ) || 0;
				const url = id ? media[ id ] : '';
				return h( 'div', { class: 'hm-media' + ( id ? ' has-image' : '' ) + ( /dark/.test( ctx.key ) ? ' hm-media--dark' : '' ), role: 'group', 'aria-labelledby': ctx.id + '-label' }, [
					h( 'div', { class: 'hm-media__preview' }, url ? h( 'img', { src: url, alt: '' } ) : h( 'span', { class: 'hm-media__empty' }, [ icon( 'image', 22 ), h( 'span', { text: id ? '#' + id : t( 'mediaNone' ) } ) ] ) ),
					h( 'div', { class: 'hm-media__actions' }, [
						h( 'button', { type: 'button', class: 'hm-btn hm-btn--sm', 'data-act': 'media-pick', id: ctx.id }, id ? t( 'mediaReplace' ) : t( 'mediaChoose' ) ),
						id ? h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet hm-btn--sm', 'data-act': 'media-remove' }, t( 'mediaRemove' ) ) : null,
					] ),
				] );
			},
			click( ctx, act ) {
				if ( 'media-remove' === act ) {
					set( ctx.key, 0 );
					rerenderControl( ctx );
					focusLater( ctx.control.querySelector( '[data-act="media-pick"]' ) );
					return;
				}
				if ( ! window.wp || ! window.wp.media ) {
					toast( t( 'mediaUnavailable' ), 'error' );
					return;
				}
				if ( ! ctx.frame ) {
					ctx.frame = window.wp.media( {
						title: t( 'mediaTitle' ),
						button: { text: t( 'mediaUse' ) },
						library: { type: 'image' },
						multiple: false,
					} );
					ctx.frame.on( 'open', function () {
						const id = Number( val( ctx.key ) ) || 0;
						const selection = ctx.frame.state().get( 'selection' );
						selection.reset( id && window.wp.media.attachment ? [ window.wp.media.attachment( id ) ] : [] );
					} );
					ctx.frame.on( 'select', function () {
						const a = ctx.frame.state().get( 'selection' ).first().toJSON();
						const size = a.sizes && ( a.sizes.medium || a.sizes.full );
						media[ a.id ] = size ? size.url : a.url;
						set( ctx.key, a.id );
						rerenderControl( ctx );
						focusLater( ctx.control.querySelector( '[data-act="media-pick"]' ) );
					} );
				}
				ctx.frame.open();
			},
		},

		repeater: {
			group: true,
			render( ctx ) {
				const rows = Array.isArray( val( ctx.key ) ) ? val( ctx.key ) : [];
				const subs = ctx.def.fields || {};
				const list = h( 'ol', { class: 'hm-rows', 'aria-labelledby': ctx.id + '-label' } );
				rows.forEach( function ( row, i ) {
					list.appendChild( h( 'li', { class: 'hm-row', 'data-row': i, 'aria-label': fmt( t( 'rowLabel' ), i + 1 ) }, [
						h( 'span', { class: 'hm-row__num', 'aria-hidden': 'true', text: i + 1 } ),
						h( 'div', { class: 'hm-row__fields' }, Object.keys( subs ).map( function ( sub ) {
							return subControl( ctx, i, sub, subs[ sub ], isObj( row ) ? row[ sub ] : '' );
						} ) ),
						h( 'div', { class: 'hm-row__tools' }, [
							iconBtn( 'arrow-up', t( 'rowUp' ), 'row-up', 0 === i ),
							iconBtn( 'arrow-down', t( 'rowDown' ), 'row-down', i === rows.length - 1 ),
							iconBtn( 'trash', t( 'rowRemove' ), 'row-remove' ),
						] ),
					] ) );
				} );
				return [
					rows.length ? list : h( 'p', { class: 'hm-rows__empty', text: t( 'rowEmpty' ) } ),
					h( 'button', { type: 'button', class: 'hm-btn hm-btn--sm', 'data-act': 'row-add', id: ctx.id }, [ icon( 'plus', 16 ), ctx.def.add || t( 'rowAdd' ) ] ),
				];
			},
			input( ctx, e ) {
				const rowEl = e.target.closest( '[data-row]' );
				const sub = e.target.dataset.sub;
				if ( ! rowEl || ! sub ) {
					return;
				}
				const rows = Array.isArray( val( ctx.key ) ) ? clone( val( ctx.key ) ) : [];
				const i = Number( rowEl.dataset.row );
				if ( ! isObj( rows[ i ] ) ) {
					rows[ i ] = blankRow( ctx.def.fields );
				}
				rows[ i ][ sub ] = 'checkbox' === e.target.type ? e.target.checked : e.target.value;
				set( ctx.key, rows );
			},
			click( ctx, act, btn ) {
				const rows = Array.isArray( val( ctx.key ) ) ? clone( val( ctx.key ) ) : [];
				const rowEl = btn.closest( '[data-row]' );
				const i = rowEl ? Number( rowEl.dataset.row ) : -1;
				let focus = null; // [ row index, selector ] to focus after re-render.

				if ( 'row-add' === act ) {
					rows.push( blankRow( ctx.def.fields ) );
					focus = [ rows.length - 1, 'select, input, textarea' ];
				} else if ( 'row-remove' === act ) {
					rows.splice( i, 1 );
					focus = rows.length ? [ Math.min( i, rows.length - 1 ), '[data-act="row-remove"]' ] : [ -1, '[data-act="row-add"]' ];
				} else if ( 'row-up' === act && i > 0 ) {
					rows.splice( i - 1, 0, rows.splice( i, 1 )[ 0 ] );
					focus = [ i - 1, 0 === i - 1 ? '[data-act="row-down"]' : '[data-act="row-up"]' ];
				} else if ( 'row-down' === act && i < rows.length - 1 ) {
					rows.splice( i + 1, 0, rows.splice( i, 1 )[ 0 ] );
					focus = [ i + 1, i + 1 === rows.length - 1 ? '[data-act="row-up"]' : '[data-act="row-down"]' ];
				} else {
					return;
				}
				set( ctx.key, rows );
				rerenderControl( ctx );
				if ( focus ) {
					const scope = focus[ 0 ] >= 0 ? ctx.control.querySelector( '[data-row="' + focus[ 0 ] + '"]' ) : ctx.control;
					focusLater( scope && scope.querySelector( focus[ 1 ] ) );
				}
			},
		},

		fonts: {
			group: true,
			render( ctx ) {
				const fams = fontFamilies( ctx );
				updateFontPreview( fams );
				const newId = ctx.id + '-new';
				return [
					fams.length ? h( 'div', { class: 'hm-fonts' }, fams.map( function ( fam, i ) {
						return fontFamilyCard( ctx, fam, i );
					} ) ) : h( 'p', { class: 'hm-fonts__empty', text: t( 'fontEmpty' ) } ),
					h( 'div', { class: 'hm-fonts__add' }, [
						h( 'label', { class: 'hm-sr', for: newId, text: t( 'fontFamilyName' ) } ),
						h( 'input', { type: 'text', id: newId, class: 'hm-input', placeholder: t( 'fontFamilyPh' ), autocomplete: 'off', spellcheck: 'false', 'data-part': 'new-family' } ),
						h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'font-add-family', id: ctx.id }, [ icon( 'plus', 16 ), t( 'fontAddFamily' ) ] ),
					] ),
					h( 'p', { class: 'hm-field__error', role: 'alert', hidden: true } ),
					fams.length ? h( 'p', { class: 'hm-field__hint', text: t( 'fontReloadHint' ) } ) : null,
				];
			},
			input( ctx, e ) {
				const part = e.target.dataset.part;
				const famEl = e.target.closest( '[data-family]' );
				if ( ! famEl ) {
					return;
				}
				const fams = fontFamilies( ctx );
				const fam = fams[ Number( famEl.dataset.family ) ];
				if ( ! fam ) {
					return;
				}
				if ( 'family-name' === part ) {
					const name = e.target.value.trim();
					if ( name ) {
						fam.family = name;
						set( ctx.key, fams );
					} else if ( 'change' === e.type ) {
						e.target.value = fam.family; // An empty name would drop the family on save.
					}
					return;
				}
				const fileEl = e.target.closest( '[data-file]' );
				const file = fileEl && fam.files ? fam.files[ Number( fileEl.dataset.file ) ] : null;
				if ( ! file || ( 'weight' !== part && 'style' !== part ) ) {
					return;
				}
				file[ part ] = e.target.value;
				set( ctx.key, fams );
				updateFontPreview( fams );
				const sample = fileEl.querySelector( '.hm-font__sample' );
				sample.style.fontWeight = previewWeight( String( file.weight ) );
				sample.style.fontStyle = 'italic' === file.style ? 'italic' : 'normal';
			},
			click( ctx, act, btn ) {
				const fams = fontFamilies( ctx );
				const famEl = btn.closest( '[data-family]' );
				const fi = famEl ? Number( famEl.dataset.family ) : -1;
				const error = ctx.control.querySelector( '.hm-field__error' );

				if ( 'font-add-family' === act ) {
					const input = ctx.control.querySelector( '[data-part="new-family"]' );
					const name = input.value.trim();
					const taken = fams.some( function ( f ) {
						return norm( f.family ) === norm( name );
					} );
					if ( ! name || taken ) {
						error.textContent = name ? t( 'fontFamilyExists' ) : t( 'fontFamilyEmpty' );
						error.hidden = false;
						input.setAttribute( 'aria-invalid', 'true' );
						input.focus();
						return;
					}
					fams.push( { family: name, files: [] } );
					set( ctx.key, fams );
					rerenderControl( ctx );
					focusLater( ctx.control.querySelector( '[data-family="' + ( fams.length - 1 ) + '"] [data-act="font-upload"]' ) );
				} else if ( 'font-remove-family' === act && fams[ fi ] ) {
					fams.splice( fi, 1 );
					set( ctx.key, fams );
					rerenderControl( ctx );
					focusLater( ctx.control.querySelector( '[data-part="new-family"]' ) );
				} else if ( 'font-remove-file' === act && fams[ fi ] ) {
					const fileEl = btn.closest( '[data-file]' );
					fams[ fi ].files.splice( Number( fileEl.dataset.file ), 1 );
					set( ctx.key, fams );
					rerenderControl( ctx );
					focusLater( ctx.control.querySelector( '[data-family="' + fi + '"] [data-act="font-upload"]' ) );
				} else if ( 'font-upload' === act && fams[ fi ] ) {
					uploadFonts( ctx, fi );
				}
			},
		},

		action: {
			render( ctx ) {
				const d = ctx.def;
				const isPhone = 'otp_test' === d.action;
				return [
					h( 'div', { class: 'hm-action' }, [
						d.input ? h( 'input', { type: isPhone ? 'tel' : 'text', id: ctx.id, class: 'hm-input', placeholder: d.input, 'aria-label': d.input, dir: isPhone ? 'ltr' : null, inputmode: isPhone ? 'tel' : null, autocomplete: 'off', 'data-part': 'action-input' } ) : null,
						h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'run-action', id: d.input ? null : ctx.id }, d.button || d.label ),
					] ),
					h( 'p', { class: 'hm-action__result', role: 'status', hidden: true } ),
					isPhone ? lastTestCode( data.lastTestCode ) : null,
				];
			},
			async click( ctx, act, btn ) {
				const result = ctx.control.querySelector( '.hm-action__result' );
				const input = ctx.control.querySelector( '[data-part="action-input"]' );
				const value = input ? input.value.trim() : '';
				const show = function ( msg, type ) {
					result.hidden = ! msg;
					result.textContent = msg || '';
					result.className = 'hm-action__result' + ( type ? ' is-' + type : '' );
				};
				if ( input && ! value ) {
					show( t( 'actionMissing' ), 'error' );
					input.focus();
					return;
				}
				if ( sectionDirty( fields[ ctx.key ].section ) ) {
					show( t( 'actionSaveFirst' ), 'warn' );
					return;
				}
				const handler = ACTIONS[ ctx.def.action ];
				if ( ! handler ) {
					return;
				}
				busy( btn, true );
				show( t( 'actionWorking' ) );
				try {
					const res = await handler( value );
					show( res.message || t( 'requestFailed' ), false === res.ok ? 'error' : 'success' );
					if ( res.lastTestCode ) {
						data.lastTestCode = res.lastTestCode;
						const old = ctx.control.querySelector( '.hm-testcode' );
						const fresh = lastTestCode( res.lastTestCode );
						if ( old ) {
							old.replaceWith( fresh );
						} else {
							ctx.control.appendChild( fresh );
						}
					}
				} catch ( err ) {
					show( err.message, 'error' );
				}
				busy( btn, false );
			},
		},
	};

	/** Test-mode code from the auth module: { code, mobile, time } or a plain string. */
	function lastTestCode( last ) {
		if ( ! last ) {
			return null;
		}
		const info = isObj( last ) ? last : { code: last };
		if ( ! info.code ) {
			return null;
		}
		const parts = String( t( 'lastTestCode' ) ).split( '%s' );
		const extra = [];
		if ( info.mobile ) {
			extra.push( h( 'span', { dir: 'ltr', text: info.mobile } ) );
		}
		if ( info.time ) {
			extra.push( new Date( Number( info.time ) * 1000 ).toLocaleTimeString( document.documentElement.lang || undefined, { hour: '2-digit', minute: '2-digit' } ) );
		}
		return h( 'p', { class: 'hm-field__hint hm-testcode' }, [
			parts[ 0 ],
			h( 'code', { dir: 'ltr', text: String( info.code ) } ),
			parts[ 1 ] || '',
			extra.length ? extra.reduce( function ( acc, node ) {
				return acc.concat( [ ' · ', node ] );
			}, [] ) : null,
		] );
	}

	function uploadFonts( ctx, fi ) {
		if ( ! window.wp || ! window.wp.media ) {
			toast( t( 'mediaUnavailable' ), 'error' );
			return;
		}
		const family = fontFamilies( ctx )[ fi ];
		const frame = window.wp.media( {
			title: fmt( t( 'fontUploadTitle' ), family.family ),
			button: { text: t( 'fontUse' ) },
			library: { type: FONT_MIMES },
			multiple: 'add',
		} );
		frame.on( 'select', function () {
			const fams = fontFamilies( ctx );
			const fam = fams[ fi ];
			if ( ! fam ) {
				return;
			}
			fam.files = fam.files || [];
			let skipped = 0;
			frame.state().get( 'selection' ).toJSON().forEach( function ( a ) {
				const name = a.filename || basename( a.url );
				if ( ! FONT_FILE.test( a.url || '' ) ) {
					skipped++;
					return;
				}
				if ( fam.files.some( function ( f ) {
					return f.url === a.url;
				} ) ) {
					return;
				}
				fam.files.push( { id: a.id, url: a.url, weight: fontWeightFromName( name ), style: fontStyleFromName( name ) } );
			} );
			// Lightest first; variable files lead.
			fam.files.sort( function ( a, b ) {
				return ( parseInt( a.weight, 10 ) || 0 ) - ( parseInt( b.weight, 10 ) || 0 ) || ( 'italic' === a.style ) - ( 'italic' === b.style );
			} );
			if ( skipped ) {
				toast( fmt( t( 'fontNotFont' ), skipped ), 'error' );
			}
			set( ctx.key, fams );
			rerenderControl( ctx );
			focusLater( ctx.control.querySelector( '[data-family="' + fi + '"] [data-act="font-upload"]' ) );
		} );
		frame.open();
	}

	/* ------------------------------------------------------------------ *
	 * Field + section rendering
	 * ------------------------------------------------------------------ */

	function renderField( key, def ) {
		const ctrl = controls[ def.type ] || controls.text;
		const id = 'hm-f-' + key;
		const ctx = { key, def, id, ctrl, el: null, control: null, note: null };
		// A label that only repeats its card heading stays for screen readers but is not shown.
		const labelClass = 'hm-field__label' + ( def.group && def.group === def.label && 'half' !== def.width && ! ui.query ? ' hm-sr' : '' );
		const label = ctrl.group
			? h( 'span', { class: labelClass, id: id + '-label', text: def.label } )
			: h( 'label', { class: labelClass, for: id, id: id + '-label', text: def.label } );

		ctx.note = h( 'p', { class: 'hm-field__note', hidden: true } );
		ctx.control = h( 'div', { class: 'hm-field__control' } );
		ctx.el = h( 'div', {
			class: 'hm-field hm-field--' + ( def.type || 'text' ) + ( 'half' === def.width ? ' hm-field--half' : '' ),
			'data-key': key,
		}, [
			h( 'div', { class: 'hm-field__head' }, [
				label,
				def.desc ? h( 'p', { class: 'hm-field__desc', id: id + '-desc', text: def.desc } ) : null,
				ctx.note,
			] ),
			ctx.control,
		] );
		ctx.el._hm = ctx;
		add( ctx.control, ctrl.render( ctx ) );
		ui.rendered.push( ctx );
		return ctx.el;
	}

	/** Fields grouped into cards; a field with `group` opens a new card with a heading. */
	function renderCards( keys, flat ) {
		const wrap = h( 'div', { class: 'hm-stack' } );
		let grid = null;
		keys.forEach( function ( key ) {
			const f = fields[ key ];
			if ( ! f || ! fieldAvailable( f.def ) ) {
				return;
			}
			if ( ! grid || ( f.def.group && ! flat ) ) {
				grid = h( 'div', { class: 'hm-fields' } );
				wrap.appendChild( h( 'section', { class: 'hm-card', 'data-fields': '' }, [
					f.def.group && ! flat ? h( 'h2', { class: 'hm-card__title hm-card__title--group', text: f.def.group } ) : null,
					grid,
				] ) );
			}
			grid.appendChild( renderField( key, f.def ) );
		} );
		return wrap;
	}

	function sectionHead( title, desc, aside ) {
		return h( 'header', { class: 'hm-head' }, [
			h( 'div', { class: 'hm-head__text' }, [
				h( 'h1', { class: 'hm-head__title', tabindex: '-1' }, title ),
				desc ? h( 'p', { class: 'hm-head__desc', text: desc } ) : null,
			] ),
			aside ? h( 'div', { class: 'hm-head__aside' }, aside ) : null,
		] );
	}

	function renderSection( view, id, s ) {
		view.appendChild( sectionHead( s.title, s.desc, h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet hm-btn--sm', 'data-act': 'reset-section', 'data-section': id }, [ icon( 'refresh', 16 ), t( 'resetSection' ) ] ) ) );
		view.appendChild( renderCards( Object.keys( s.fields || {} ), false ) );
	}

	function renderSearch( view ) {
		const words = norm( ui.query ).split( /\s+/ ).filter( Boolean );
		let total = 0;
		const groups = [];

		order.forEach( function ( id ) {
			const s = schema[ id ];
			if ( s.view || ! s.fields || ! sectionAvailable( id ) ) {
				return;
			}
			const keys = Object.keys( s.fields ).filter( function ( key ) {
				const d = s.fields[ key ];
				if ( ! fieldAvailable( d ) ) {
					return false;
				}
				const hay = norm( [ d.label, d.desc, d.group, d.button ].join( ' ' ) );
				return words.every( function ( w ) {
					return -1 !== hay.indexOf( w );
				} );
			} );
			if ( keys.length ) {
				total += keys.length;
				groups.push( [ id, keys ] );
			}
		} );

		view.appendChild( sectionHead( withQuery( t( 'searchFor' ) ), 1 === total ? t( 'resultOne' ) : fmt( t( 'resultMany' ), total ) ) );
		if ( ! total ) {
			view.appendChild( emptyState( 'search', withQuery( t( 'searchNone' ) ), t( 'searchNoneHint' ) ) );
			return;
		}
		groups.forEach( function ( g ) {
			const s = schema[ g[ 0 ] ];
			view.appendChild( h( 'div', { class: 'hm-result' }, [
				h( 'div', { class: 'hm-result__head' }, [
					h( 'span', { class: 'hm-result__icon' }, icon( s.icon, 16 ) ),
					h( 'h2', { class: 'hm-result__title', text: s.title } ),
					h( 'a', { class: 'hm-link', href: '#' + g[ 0 ], 'data-section': g[ 0 ] }, [ t( 'openSection' ), icon( 'chevron-end', 14 ) ] ),
				] ),
				renderCards( g[ 1 ], true ),
			] ) );
		} );
	}

	/** "Results for “%s”" with the typed query isolated, so mixed-direction text stays in order. */
	function withQuery( str ) {
		const parts = String( str ).split( '%s' );
		return [ parts[ 0 ], h( 'bdi', { text: ui.query } ), parts.slice( 1 ).join( '%s' ) ];
	}

	function emptyState( iconName, title, text, extra ) {
		return h( 'div', { class: 'hm-empty' }, [
			h( 'span', { class: 'hm-empty__icon' }, icon( iconName, 22 ) ),
			h( 'p', { class: 'hm-empty__title' }, title ),
			text ? h( 'p', { class: 'hm-empty__text', text } ) : null,
			extra || null,
		] );
	}

	/* ------------------------------------------------------------------ *
	 * Dashboard
	 * ------------------------------------------------------------------ */

	function statusChip( ok, text ) {
		const kind = true === ok ? 'ok' : ( false === ok ? 'warn' : 'info' );
		return h( 'span', { class: 'hm-status hm-status--' + kind }, [
			h( 'span', { class: 'hm-status__dot', 'aria-hidden': 'true' } ),
			text || t( 'ok' === kind ? 'statusOk' : ( 'warn' === kind ? 'statusWarn' : 'statusInfo' ) ),
		] );
	}

	function externalLink( href, text, cls ) {
		return h( 'a', { class: cls || 'hm-link', href, target: '_blank', rel: 'noopener noreferrer' }, [ text, icon( 'external', 14 ), sr( ' ' + t( 'newTab' ) ) ] );
	}

	const PLUGIN_DESC = { elementor: 'elementorDesc', woocommerce: 'wooDesc' };

	function pluginRow( slug, badge ) {
		const p = plugins[ slug ] || { name: slug.charAt( 0 ).toUpperCase() + slug.slice( 1 ), installed: false, active: false };
		const label = p.active ? t( 'pluginActive' ) : ( p.installed ? t( 'pluginInactive' ) : t( 'pluginMissing' ) );
		return h( 'li', { class: 'hm-plugin', 'data-plugin': slug, 'data-badge': badge || null }, [
			h( 'span', { class: 'hm-plugin__tile', 'aria-hidden': 'true', text: ( p.name || slug ).charAt( 0 ) } ),
			h( 'span', { class: 'hm-plugin__body' }, [
				h( 'span', { class: 'hm-plugin__name' }, [
					p.name,
					badge ? h( 'span', { class: 'hm-badge' + ( 'required' === badge ? ' hm-badge--strong' : '' ), text: 'required' === badge ? t( 'pluginRequired' ) : t( 'pluginRecommend' ) } ) : null,
				] ),
				PLUGIN_DESC[ slug ] ? h( 'span', { class: 'hm-plugin__desc', text: t( PLUGIN_DESC[ slug ] ) } ) : null,
			] ),
			p.active ? statusChip( true, label ) : h( 'span', { class: 'hm-plugin__side' }, [
				statusChip( 'required' === badge || 'elementor' === slug ? false : null, label ),
				h( 'button', { type: 'button', class: 'hm-btn hm-btn--sm', 'data-act': 'plugin-install', 'data-slug': slug }, p.installed ? t( 'pluginActivate' ) : t( 'pluginInstall' ) ),
			] ),
		] );
	}

	async function installPlugin( slug, btn ) {
		busy( btn, true, t( 'pluginWorking' ) );
		try {
			const res = await api( 'demos/plugins', { slug } );
			if ( false === res.ok ) {
				throw new Error( res.message || t( 'requestFailed' ) );
			}
			plugins[ slug ] = Object.assign( {}, plugins[ slug ], { installed: true, active: true } );
			toast( res.message || fmt( t( 'pluginDone' ), plugins[ slug ].name || slug ), 'success' );
			root.querySelectorAll( '.hm-plugin' ).forEach( function ( row ) {
				if ( row.dataset.plugin === slug ) {
					row.replaceWith( pluginRow( slug, row.dataset.badge ) );
				}
			} );
			renderNav();
			root.dispatchEvent( new CustomEvent( 'hm:plugins', { detail: { slug } } ) );
		} catch ( err ) {
			busy( btn, false );
			toast( err.message, 'error' );
		}
	}

	function renderDashboard( view ) {
		const steps = [
			{ id: 'demos', title: t( 'stepDemo' ), desc: t( 'stepDemoDesc' ), done: !! data.demoImported },
			{ id: 'header', title: t( 'stepLogo' ), desc: t( 'stepLogoDesc' ), done: Number( saved.logo ) > 0 },
			{ id: 'colors', title: t( 'stepColors' ), desc: t( 'stepColorsDesc' ), done: !! saved.accent },
			{ id: 'login', title: t( 'stepLogin' ), desc: t( 'stepLoginDesc' ), done: !! saved.otp_enabled },
		].filter( function ( st ) {
			return sectionAvailable( st.id );
		} );
		const done = steps.filter( function ( st ) {
			return st.done;
		} ).length;

		const hero = h( 'section', { class: 'hm-hero' }, [
			h( 'div', { class: 'hm-hero__text' }, [
				h( 'p', { class: 'hm-eyebrow', text: fmt( t( 'versionLabel' ), data.version || '' ) } ),
				h( 'h1', { class: 'hm-hero__title', tabindex: '-1', text: t( 'welcome' ) } ),
				h( 'p', { class: 'hm-hero__lead', text: t( 'welcomeLead' ) } ),
				h( 'div', { class: 'hm-hero__actions' }, [
					sectionAvailable( 'demos' ) ? h( 'a', { class: 'hm-btn hm-btn--primary', href: '#demos' }, t( 'stepDemo' ) ) : null,
					links.site ? externalLink( links.site, t( 'viewSite' ), 'hm-btn' ) : null,
				] ),
			] ),
			h( 'div', { class: 'hm-hero__mark', 'aria-hidden': 'true' }, brandMark( 132 ) ),
		] );

		const checklist = h( 'section', { class: 'hm-card hm-steps', 'aria-labelledby': 'hm-steps-title' }, [
			h( 'div', { class: 'hm-card__head' }, [
				h( 'h2', { class: 'hm-card__title', id: 'hm-steps-title', text: t( 'getStarted' ) } ),
				h( 'span', { class: 'hm-steps__count', text: fmt( t( 'stepsDone' ), done, steps.length ) } ),
			] ),
			h( 'div', { class: 'hm-meter', 'aria-hidden': 'true' }, h( 'span', { class: 'hm-meter__bar', style: { '--hm-p': ( steps.length ? ( done / steps.length ) * 100 : 0 ) + '%' } } ) ),
			h( 'ol', { class: 'hm-steps__list' }, steps.map( function ( st, i ) {
				return h( 'li', { class: 'hm-step' + ( st.done ? ' is-done' : '' ) }, h( 'a', { class: 'hm-step__link', href: '#' + st.id }, [
					h( 'span', { class: 'hm-step__num', 'aria-hidden': 'true' }, st.done ? icon( 'check', 14 ) : String( i + 1 ) ),
					h( 'span', { class: 'hm-step__body' }, [
						h( 'span', { class: 'hm-step__title', text: st.title } ),
						h( 'span', { class: 'hm-step__desc', text: st.desc } ),
					] ),
					h( 'span', { class: 'hm-step__state' }, st.done ? t( 'done' ) : [ sr( t( 'open' ) ), icon( 'chevron-end', 16 ) ] ),
				] ) );
			} ) ),
		] );

		const pluginCard = h( 'section', { class: 'hm-card', 'aria-labelledby': 'hm-plugins-title' }, [
			h( 'div', { class: 'hm-card__head' }, [
				h( 'h2', { class: 'hm-card__title', id: 'hm-plugins-title', text: t( 'plugins' ) } ),
				links.plugins ? h( 'a', { class: 'hm-link', href: links.plugins }, [ t( 'pluginsManage' ), icon( 'chevron-end', 14 ) ] ) : null,
			] ),
			h( 'ul', { class: 'hm-plugins' }, [ pluginRow( 'elementor' ), pluginRow( 'woocommerce' ) ] ),
		] );

		const quick = [
			[ 'templates', 'linkTemplates', 'layers' ],
			[ 'messages', 'linkMessages', 'mail' ],
			[ 'menus', 'linkMenus', 'menu' ],
			[ 'widgets', 'linkWidgets', 'grid' ],
			[ 'customize', 'linkCustomize', 'sliders' ],
			[ 'docs', 'docs', 'book', true ],
		].filter( function ( q ) {
			return links[ q[ 0 ] ];
		} );
		const quickCard = h( 'section', { class: 'hm-card', 'aria-labelledby': 'hm-links-title' }, [
			h( 'div', { class: 'hm-card__head' }, h( 'h2', { class: 'hm-card__title', id: 'hm-links-title', text: t( 'quickLinks' ) } ) ),
			h( 'ul', { class: 'hm-quick' }, quick.map( function ( q ) {
				return h( 'li', null, h( 'a', { class: 'hm-quick__link', href: links[ q[ 0 ] ], target: q[ 3 ] ? '_blank' : null, rel: q[ 3 ] ? 'noopener noreferrer' : null }, [
					h( 'span', { class: 'hm-quick__icon' }, icon( q[ 2 ], 18 ) ),
					h( 'span', { class: 'hm-quick__text', text: t( q[ 1 ] ) } ),
					q[ 3 ] ? [ icon( 'external', 14 ), sr( ' ' + t( 'newTab' ) ) ] : icon( 'chevron-end', 14 ),
				] ) );
			} ) ),
		] );

		const system = h( 'section', { class: 'hm-card', 'aria-labelledby': 'hm-system-title' }, [
			h( 'div', { class: 'hm-card__head' }, h( 'h2', { class: 'hm-card__title', id: 'hm-system-title', text: t( 'system' ) } ) ),
			h( 'table', { class: 'hm-table' }, h( 'tbody', null, ( data.system || [] ).map( function ( row ) {
				return h( 'tr', null, [
					h( 'th', { scope: 'row', text: row.label } ),
					h( 'td', { class: 'hm-table__value' }, h( 'bdi', { text: row.value } ) ),
					h( 'td', { class: 'hm-table__status' }, statusChip( row.ok ) ),
				] );
			} ) ) ),
		] );

		view.appendChild( h( 'div', { class: 'hm-dash' }, [ hero, checklist, pluginCard, quickCard, system ] ) );
	}

	/* ------------------------------------------------------------------ *
	 * Demos
	 * ------------------------------------------------------------------ */

	function demoList() {
		const d = data.demos;
		if ( Array.isArray( d ) ) {
			return d;
		}
		return isObj( d ) ? Object.keys( d ).map( function ( id ) {
			return Object.assign( { id }, d[ id ] );
		} ) : [];
	}

	function kitLabel( kit ) {
		const f = fields.kit;
		const c = f && isObj( f.def.choices ) ? f.def.choices[ kit ] : null;
		return isObj( c ) ? c.label : ( c || kit );
	}

	function renderDemos( view, s ) {
		const demos = demoList();
		view.appendChild( sectionHead( s.title || t( 'demosTitle' ), t( 'demosDesc' ), demos.length ? h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet hm-btn--sm', 'data-act': 'demo-uninstall' }, [ icon( 'trash', 16 ), t( 'demoUninstall' ) ] ) : null ) );

		if ( ! demos.length ) {
			view.appendChild( emptyState( 'layers', t( 'demosEmpty' ), t( 'demosEmptyDesc' ) ) );
			return;
		}

		view.appendChild( h( 'div', { class: 'hm-demos' }, demos.map( function ( d ) {
			const pages = Array.isArray( d.pages ) ? d.pages : [];
			const titleId = 'hm-demo-' + String( d.id ).replace( /[^a-z0-9_-]/gi, '' );
			return h( 'article', { class: 'hm-demo', 'aria-labelledby': titleId }, [
				h( 'div', { class: 'hm-demo__thumb' }, d.thumb ? h( 'img', { src: d.thumb, alt: '', loading: 'lazy', decoding: 'async' } ) : h( 'span', { class: 'hm-demo__ph' }, icon( 'layers', 28 ) ) ),
				h( 'div', { class: 'hm-demo__body' }, [
					h( 'h2', { class: 'hm-demo__title', id: titleId, text: d.title } ),
					d.desc ? h( 'p', { class: 'hm-demo__desc', text: d.desc } ) : null,
					h( 'div', { class: 'hm-demo__meta' }, [
						d.kit ? h( 'span', { class: 'hm-badge', text: fmt( t( 'demoKit' ), kitLabel( d.kit ) ) } ) : null,
						pages.length ? h( 'span', { class: 'hm-badge', title: pages.join( t( 'listSep' ) ), text: fmt( t( 'demoPages' ), pages.length ) } ) : null,
					] ),
				] ),
				h( 'div', { class: 'hm-demo__foot' }, [
					d.preview ? externalLink( d.preview, t( 'demoPreview' ), 'hm-btn hm-btn--quiet hm-btn--sm' ) : null,
					h( 'button', { type: 'button', class: 'hm-btn hm-btn--primary hm-btn--sm', 'data-act': 'demo-open', 'data-demo': d.id, 'aria-describedby': titleId }, t( 'demoImport' ) ),
				] ),
			] );
		} ) ) );
	}

	const DEMO_OPTIONS = [
		[ 'content', 'demoOptContent', 'demoOptContentD' ],
		[ 'menus', 'demoOptMenus', 'demoOptMenusD' ],
		[ 'settings', 'demoOptSettings', 'demoOptSettingsD' ],
		[ 'front_page', 'demoOptFront', 'demoOptFrontD' ],
	];

	function openDemo( demo ) {
		const options = {};
		DEMO_OPTIONS.forEach( function ( o ) {
			options[ o[ 0 ] ] = true;
		} );
		const required = ( demo.required || [] ).slice();
		const recommended = ( demo.recommended || [] ).filter( function ( slug ) {
			return -1 === required.indexOf( slug );
		} );
		let phase = 'setup';
		let pending = { step: 'prepare', batch: 0 };
		let doneLinks = {};
		let progress = 0;

		const m = openModal( {
			title: fmt( t( 'demoImportTitle' ), demo.title ),
			size: 'md',
			locked() {
				return 'running' === phase;
			},
			onClose() {
				root.removeEventListener( 'hm:plugins', onPlugins );
			},
		} );

		function onPlugins() {
			if ( 'setup' === phase ) {
				renderSetup();
			}
		}
		root.addEventListener( 'hm:plugins', onPlugins );

		function ready() {
			return required.every( pluginActive ) && DEMO_OPTIONS.some( function ( o ) {
				return options[ o[ 0 ] ];
			} );
		}

		function button( text, cls, onClick, attrs ) {
			const b = h( 'button', Object.assign( { type: 'button', class: 'hm-btn' + ( cls ? ' ' + cls : '' ) }, attrs || {} ), text );
			b.addEventListener( 'click', onClick );
			return b;
		}

		function renderSetup() {
			const start = button( t( 'demoStart' ), 'hm-btn--primary', begin, { disabled: ! ready() } );
			const body = [];
			const pages = Array.isArray( demo.pages ) ? demo.pages : [];
			if ( demo.desc || pages.length ) {
				body.push( h( 'p', { class: 'hm-modal__text' }, [ demo.desc || '', pages.length ? h( 'span', { class: 'hm-modal__pages', text: ' ' + pages.join( t( 'listSep' ) ) } ) : null ] ) );
			}
			if ( required.length || recommended.length ) {
				body.push( h( 'h3', { class: 'hm-modal__sub', text: t( 'demoPluginsHead' ) } ) );
				body.push( h( 'ul', { class: 'hm-plugins hm-plugins--compact' }, required.map( function ( slug ) {
					return pluginRow( slug, 'required' );
				} ).concat( recommended.map( function ( slug ) {
					return pluginRow( slug, 'recommended' );
				} ) ) ) );
				if ( ! required.every( pluginActive ) ) {
					body.push( h( 'p', { class: 'hm-note hm-note--warn' }, [ icon( 'info', 16 ), t( 'demoPluginsNeed' ) ] ) );
				}
			}
			body.push( h( 'h3', { class: 'hm-modal__sub', text: t( 'demoOptionsHead' ) } ) );
			body.push( h( 'div', { class: 'hm-checks' }, DEMO_OPTIONS.map( function ( o ) {
				const id = 'hm-demo-opt-' + o[ 0 ];
				const box = h( 'input', { type: 'checkbox', id, class: 'hm-check__input', checked: options[ o[ 0 ] ] } );
				box.addEventListener( 'change', function () {
					options[ o[ 0 ] ] = box.checked;
					start.disabled = ! ready();
				} );
				return h( 'div', { class: 'hm-check' }, [
					box,
					h( 'label', { for: id, class: 'hm-check__label' }, [
						h( 'span', { class: 'hm-check__box', 'aria-hidden': 'true' }, icon( 'check', 12 ) ),
						h( 'span', { class: 'hm-check__text' }, [ h( 'strong', { text: t( o[ 1 ] ) } ), h( 'span', { text: t( o[ 2 ] ) } ) ] ),
					] ),
				] );
			} ) ) );
			body.push( h( 'p', { class: 'hm-note' }, [ icon( 'info', 16 ), t( 'demoKeepNote' ) ] ) );
			m.body.replaceChildren.apply( m.body, body );
			m.foot.replaceChildren( button( t( 'cancel' ), 'hm-btn--quiet', function () {
				m.close();
			} ), start );
		}

		function renderProgress( message, error ) {
			const bar = h( 'div', { class: 'hm-meter hm-meter--lg', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round( progress ), 'aria-label': t( 'demoRunning' ) }, h( 'span', { class: 'hm-meter__bar', style: { '--hm-p': progress + '%' } } ) );
			const nodes = [
				h( 'div', { class: 'hm-progress' + ( error ? ' is-error' : '' ) }, [
					h( 'div', { class: 'hm-progress__top' }, [
						h( 'span', { class: 'hm-progress__label', text: error ? t( 'demoFailed' ) : t( 'demoRunning' ) } ),
						h( 'span', { class: 'hm-progress__pct', dir: 'ltr', text: Math.round( progress ) + '%' } ),
					] ),
					bar,
					h( 'p', { class: 'hm-progress__msg', role: error ? 'alert' : 'status', text: message || '' } ),
				] ),
			];
			m.body.replaceChildren.apply( m.body, nodes );
			if ( error ) {
				const retry = button( t( 'demoRetry' ), 'hm-btn--primary', function () {
					phase = 'running';
					m.setLocked();
					renderProgress( t( 'demoPreparing' ) );
					run( pending );
				} );
				m.foot.replaceChildren( button( t( 'close' ), 'hm-btn--quiet', function () {
					m.close();
				} ), retry );
				focusLater( retry );
			} else {
				m.foot.replaceChildren();
			}
		}

		function begin() {
			phase = 'running';
			progress = 0;
			m.setLocked();
			renderProgress( t( 'demoPreparing' ) );
			m.dialog.focus();
			run( { step: 'prepare', batch: 0 } );
		}

		async function run( req ) {
			pending = req;
			let res;
			try {
				res = await api( 'demos/' + encodeURIComponent( demo.id ) + '/import', { step: req.step, batch: req.batch || 0, options } );
			} catch ( err ) {
				phase = 'error';
				m.setLocked();
				renderProgress( err.message, true );
				return;
			}
			if ( isObj( res.links ) ) {
				doneLinks = res.links;
			}
			if ( 'number' === typeof res.progress || /^\d/.test( String( res.progress ) ) ) {
				progress = Math.max( 0, Math.min( 100, Number( res.progress ) ) );
			}
			const next = res.next;
			if ( res.done || ! isObj( next ) || 'done' === next.step ) {
				finish();
				return;
			}
			renderProgress( res.message );
			run( next );
		}

		function finish() {
			phase = 'done';
			progress = 100;
			data.demoImported = true;
			m.setLocked();
			const home = doneLinks.home || links.site;
			m.body.replaceChildren( h( 'div', { class: 'hm-success' }, [
				h( 'span', { class: 'hm-success__icon', 'aria-hidden': 'true' }, icon( 'check', 26 ) ),
				h( 'p', { class: 'hm-success__title', role: 'status', text: t( 'demoDone' ) } ),
				h( 'p', { class: 'hm-success__text', text: t( 'demoDoneDesc' ) } ),
			] ) );
			const actions = [ button( t( 'close' ), 'hm-btn--quiet', function () {
				m.close();
			} ) ];
			if ( home ) {
				actions.push( externalLink( home, t( 'viewSite' ), 'hm-btn' ) );
			}
			if ( doneLinks.edit ) {
				actions.push( h( 'a', { class: 'hm-btn hm-btn--primary', href: doneLinks.edit }, t( 'demoEditHome' ) ) );
			}
			m.foot.replaceChildren.apply( m.foot, actions );
			focusLater( m.foot.lastChild );

			// The import may have changed settings (style kit, logo): pick them up.
			api( 'settings', null, 'GET' ).then( function ( values ) {
				applyServerValues( values );
			} ).catch( function () {} );
		}

		renderSetup();
	}

	async function uninstallDemos( btn ) {
		const ok = await confirmDialog( {
			title: t( 'demoUninstallQ' ),
			message: t( 'demoUninstallMsg' ),
			confirm: t( 'demoUninstallGo' ),
			danger: true,
		} );
		if ( ! ok ) {
			return;
		}
		busy( btn, true );
		try {
			const res = await api( 'demos/uninstall' );
			toast( res.message || t( 'done' ), false === res.ok ? 'error' : 'success' );
			if ( false !== res.ok ) {
				data.demoImported = false;
			}
		} catch ( err ) {
			toast( err.message, 'error' );
		}
		busy( btn, false );
	}

	/* ------------------------------------------------------------------ *
	 * Tools
	 * ------------------------------------------------------------------ */

	function toolRow( iconName, title, desc, action, extra ) {
		return h( 'li', { class: 'hm-tool' }, [
			h( 'span', { class: 'hm-tool__icon' }, icon( iconName, 18 ) ),
			h( 'div', { class: 'hm-tool__text' }, [ h( 'h3', { class: 'hm-tool__title', text: title } ), h( 'p', { class: 'hm-tool__desc', text: desc } ) ] ),
			h( 'div', { class: 'hm-tool__action' }, [ extra || null, action ] ),
		] );
	}

	function renderTools( view, s ) {
		const elementor = pluginActive( 'elementor' );
		const file = h( 'input', { type: 'file', accept: '.json,application/json', class: 'hm-sr', tabindex: '-1', 'aria-hidden': 'true', 'data-part': 'import-file' } );
		file.addEventListener( 'change', function () {
			if ( file.files && file.files[ 0 ] ) {
				importSettings( file.files[ 0 ] );
			}
			file.value = '';
		} );

		view.appendChild( sectionHead( s.title || t( 'toolsTitle' ), t( 'toolsDesc' ) ) );
		view.appendChild( h( 'div', { class: 'hm-stack' }, [
			h( 'section', { class: 'hm-card' }, h( 'ul', { class: 'hm-tools' }, [
				toolRow( 'download', t( 'exportTitle' ), t( 'exportDesc' ), h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'tool-export' }, t( 'exportButton' ) ) ),
				toolRow( 'upload', t( 'importTitle' ), t( 'importDesc' ), h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'tool-import' }, t( 'importButton' ) ), file ),
				toolRow( 'refresh', t( 'cssTitle' ), elementor ? t( 'cssDesc' ) : t( 'cssDesc' ) + ' ' + t( 'cssNeedsElem' ), h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'tool-css', disabled: ! elementor }, t( 'cssButton' ) ) ),
				toolRow( 'type', t( 'fontsTitle' ), t( 'fontsDesc' ), h( 'button', { type: 'button', class: 'hm-btn', 'data-act': 'tool-fonts' }, t( 'fontsButton' ) ) ),
			] ) ),
			h( 'section', { class: 'hm-card hm-card--danger', 'aria-labelledby': 'hm-danger-title' }, [
				h( 'div', { class: 'hm-card__head' }, h( 'h2', { class: 'hm-card__title', id: 'hm-danger-title', text: t( 'dangerZone' ) } ) ),
				h( 'ul', { class: 'hm-tools' }, toolRow( 'alert', t( 'resetAllTitle' ), t( 'resetAllDesc' ), h( 'button', { type: 'button', class: 'hm-btn hm-btn--danger', 'data-act': 'tool-reset-all' }, t( 'resetAllButton' ) ) ) ),
			] ),
		] ) );
	}

	function exportSettings() {
		const payload = { hamista: data.version || '1.0.0', exported: new Date().toISOString(), values: clone( saved ) };
		const blob = new Blob( [ JSON.stringify( payload, null, 2 ) ], { type: 'application/json' } );
		const url = URL.createObjectURL( blob );
		const a = h( 'a', { href: url, download: 'hamista-settings-' + payload.exported.slice( 0, 10 ) + '.json', hidden: true } );
		document.body.appendChild( a );
		a.click();
		a.remove();
		setTimeout( function () {
			URL.revokeObjectURL( url );
		}, 2000 );
		toast( t( 'exportDone' ), 'success' );
	}

	async function importSettings( file ) {
		let json;
		try {
			json = JSON.parse( await file.text() );
		} catch ( e ) {
			toast( t( 'importBad' ), 'error' );
			return;
		}
		const ok = await confirmDialog( { title: fmt( t( 'importQ' ), file.name ), message: t( 'importMsg' ), confirm: t( 'importGo' ) } );
		if ( ! ok ) {
			return;
		}
		try {
			const res = await api( 'settings/import', { data: json } );
			applyServerValues( res.values || {}, { force: true } );
			toast( res.message || t( 'saved' ), 'success' );
		} catch ( err ) {
			toast( err.message, 'error' );
		}
	}

	async function simpleTool( path, btn ) {
		busy( btn, true );
		try {
			const res = await api( path );
			toast( res.message || t( 'done' ), 'success' );
		} catch ( err ) {
			toast( err.message, 'error' );
		}
		busy( btn, false );
	}

	async function resetAll() {
		const ok = await confirmDialog( {
			title: t( 'resetAllQ' ),
			message: t( 'resetAllMsg' ),
			confirm: t( 'resetAllButton' ),
			danger: true,
			typed: t( 'resetAllWord' ),
		} );
		if ( ! ok ) {
			return;
		}
		try {
			const res = await api( 'settings/reset', {} );
			applyServerValues( res.values || {}, { force: true } );
			toast( t( 'resetAllDone' ), 'success' );
		} catch ( err ) {
			toast( err.message, 'error' );
		}
	}

	/* ------------------------------------------------------------------ *
	 * Modal, confirm, toasts
	 * ------------------------------------------------------------------ */

	const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	function focusables( scope ) {
		return Array.prototype.filter.call( scope.querySelectorAll( FOCUSABLE ), function ( el ) {
			return ! el.closest( '[hidden]' ) && null !== el.offsetParent;
		} );
	}

	/**
	 * Accessible modal dialog: focus moves in and is trapped, Esc and the backdrop
	 * close it (unless opts.locked() says otherwise), focus returns on close.
	 */
	function openModal( opts ) {
		const titleId = 'hm-modal-title-' + ( ++uid );
		const prev = document.activeElement;
		const closeBtn = h( 'button', { type: 'button', class: 'hm-icon-btn hm-modal__x', 'aria-label': t( 'close' ) }, icon( 'close', 18 ) );
		const body = h( 'div', { class: 'hm-modal__body' } );
		const foot = h( 'div', { class: 'hm-modal__foot' } );
		const dialog = h( 'div', { class: 'hm-modal__dialog hm-modal__dialog--' + ( opts.size || 'md' ), role: opts.role || 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, tabindex: '-1' }, [
			h( 'div', { class: 'hm-modal__head' }, [ h( 'h2', { class: 'hm-modal__title', id: titleId, text: opts.title } ), closeBtn ] ),
			body,
			foot,
		] );
		const overlay = h( 'div', { class: 'hm-modal' }, dialog );
		const isLocked = function () {
			return !! ( opts.locked && opts.locked() );
		};

		function close( result ) {
			if ( ! overlay.isConnected ) {
				return;
			}
			overlay.remove();
			document.removeEventListener( 'keydown', onKey, true );
			if ( ! ui.dom.modals.children.length ) {
				ui.dom.app.inert = false;
				document.documentElement.classList.remove( 'hm-modal-open' );
			}
			if ( prev && prev.isConnected && prev.focus ) {
				prev.focus();
			}
			if ( opts.onClose ) {
				opts.onClose( result );
			}
		}

		function onKey( e ) {
			if ( ! overlay.isConnected || overlay !== ui.dom.modals.lastElementChild ) {
				return;
			}
			if ( 'Escape' === e.key ) {
				e.preventDefault();
				e.stopPropagation();
				if ( ! isLocked() ) {
					close( false );
				}
			} else if ( 'Tab' === e.key ) {
				const items = focusables( dialog );
				if ( ! items.length ) {
					e.preventDefault();
					dialog.focus();
					return;
				}
				const first = items[ 0 ];
				const last = items[ items.length - 1 ];
				if ( e.shiftKey && ( document.activeElement === first || document.activeElement === dialog ) ) {
					e.preventDefault();
					last.focus();
				} else if ( ! e.shiftKey && document.activeElement === last ) {
					e.preventDefault();
					first.focus();
				}
			}
		}

		function setLocked() {
			closeBtn.disabled = isLocked();
			overlay.classList.toggle( 'is-locked', isLocked() );
		}

		overlay.addEventListener( 'mousedown', function ( e ) {
			if ( e.target === overlay && ! isLocked() ) {
				close( false );
			}
		} );
		closeBtn.addEventListener( 'click', function () {
			if ( ! isLocked() ) {
				close( false );
			}
		} );

		ui.dom.modals.appendChild( overlay );
		ui.dom.app.inert = true;
		document.documentElement.classList.add( 'hm-modal-open' );
		document.addEventListener( 'keydown', onKey, true );
		setTimeout( function () {
			const target = ( opts.focus && opts.focus() ) || focusables( body )[ 0 ] || dialog;
			target.focus();
		}, 0 );

		return { overlay, dialog, body, foot, close, setLocked };
	}

	/** Promise<boolean>. opts: title, message, confirm, danger, typed (word to type). */
	function confirmDialog( opts ) {
		return new Promise( function ( resolve ) {
			let input = null;
			const ok = h( 'button', { type: 'button', class: 'hm-btn ' + ( opts.danger ? 'hm-btn--danger' : 'hm-btn--primary' ), text: opts.confirm || t( 'confirm' ) } );
			const cancel = h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet', text: t( 'cancel' ) } );
			const m = openModal( {
				title: opts.title,
				size: 'sm',
				role: 'alertdialog',
				onClose( result ) {
					resolve( true === result );
				},
				focus() {
					return input || cancel;
				},
			} );
			m.body.appendChild( h( 'p', { class: 'hm-modal__text', text: opts.message } ) );
			if ( opts.typed ) {
				const id = 'hm-typed-' + uid;
				const parts = String( t( 'resetAllType' ) ).split( '%s' );
				input = h( 'input', { type: 'text', id, class: 'hm-input', autocomplete: 'off', spellcheck: 'false' } );
				ok.disabled = true;
				input.addEventListener( 'input', function () {
					ok.disabled = norm( input.value.trim() ) !== norm( opts.typed );
				} );
				input.addEventListener( 'keydown', function ( e ) {
					if ( 'Enter' === e.key && ! ok.disabled ) {
						m.close( true );
					}
				} );
				m.body.appendChild( h( 'div', { class: 'hm-typed' }, [
					h( 'label', { for: id, class: 'hm-typed__label' }, [ parts[ 0 ], h( 'code', { text: opts.typed } ), parts[ 1 ] || '' ] ),
					input,
				] ) );
			}
			ok.addEventListener( 'click', function () {
				m.close( true );
			} );
			cancel.addEventListener( 'click', function () {
				m.close( false );
			} );
			m.foot.replaceChildren( cancel, ok );
		} );
	}

	function toast( message, type ) {
		if ( ! message ) {
			return;
		}
		const kind = type || 'info';
		const el = h( 'div', { class: 'hm-toast hm-toast--' + kind }, [
			icon( 'error' === kind ? 'alert' : ( 'success' === kind ? 'check' : 'info' ), 18 ),
			h( 'span', { class: 'hm-toast__msg', text: message } ),
			h( 'button', { type: 'button', class: 'hm-toast__close', 'data-act': 'toast-close', 'aria-label': t( 'close' ) }, icon( 'close', 14 ) ),
		] );
		( 'error' === kind ? ui.dom.alerts : ui.dom.status ).appendChild( el );
		el._hmTimer = setTimeout( function () {
			dismiss( el );
		}, 'error' === kind ? 8000 : 4000 );
	}

	function dismiss( el ) {
		if ( ! el || el.classList.contains( 'is-leaving' ) ) {
			return;
		}
		clearTimeout( el._hmTimer );
		el.classList.add( 'is-leaving' );
		setTimeout( function () {
			el.remove();
		}, 200 );
	}

	/* ------------------------------------------------------------------ *
	 * Shell: top bar, navigation, view, save bar
	 * ------------------------------------------------------------------ */

	function buildShell() {
		const search = h( 'input', { type: 'search', id: 'hm-search', class: 'hm-search__input', placeholder: t( 'search' ), 'aria-label': t( 'search' ), autocomplete: 'off', spellcheck: 'false' } );
		const clearBtn = h( 'button', { type: 'button', class: 'hm-search__clear', 'data-act': 'search-clear', 'aria-label': t( 'searchClear' ), hidden: true }, icon( 'close', 14 ) );
		const top = h( 'header', { class: 'hm-top' }, h( 'div', { class: 'hm-top__in' }, [
			h( 'a', { class: 'hm-brand', href: '#' + firstRoute() }, [
				h( 'span', { class: 'hm-brand__mark' }, brandMark( 26 ) ),
				h( 'span', { class: 'hm-brand__name', text: t( 'appName' ) } ),
				data.version ? h( 'span', { class: 'hm-brand__ver', dir: 'ltr', text: data.version } ) : null,
			] ),
			h( 'div', { class: 'hm-search', role: 'search' }, [
				icon( 'search', 16 ),
				search,
				h( 'kbd', { class: 'hm-search__kbd', 'aria-hidden': 'true', text: '/' } ),
				clearBtn,
			] ),
			h( 'div', { class: 'hm-top__links' }, [
				links.docs ? externalLink( links.docs, t( 'docs' ), 'hm-top__link' ) : null,
				links.site ? externalLink( links.site, t( 'viewSite' ), 'hm-btn hm-btn--sm' ) : null,
			] ),
		] ) );

		const nav = h( 'nav', { class: 'hm-nav', 'aria-label': t( 'navLabel' ) } );
		const view = h( 'div', { class: 'hm-view', id: 'hm-view' } );
		const bar = h( 'div', { class: 'hm-savebar', 'data-state': 'clean' }, h( 'div', { class: 'hm-savebar__in' }, [
			h( 'div', { class: 'hm-savebar__status' }, [
				h( 'span', { class: 'hm-savebar__dot', 'aria-hidden': 'true' } ),
				h( 'span', { class: 'hm-savebar__text', role: 'status', text: t( 'allSaved' ) } ),
			] ),
			h( 'div', { class: 'hm-savebar__actions' }, [
				h( 'kbd', { class: 'hm-savebar__kbd', 'aria-hidden': 'true', text: IS_MAC ? t( 'shortcutSaveMac' ) : t( 'shortcutSave' ) } ),
				h( 'button', { type: 'button', class: 'hm-btn hm-btn--quiet hm-btn--sm', 'data-act': 'discard', disabled: true, text: t( 'discard' ) } ),
				h( 'button', { type: 'button', class: 'hm-btn hm-btn--primary hm-btn--sm', 'data-act': 'save', disabled: true, text: t( 'save' ) } ),
			] ),
		] ) );
		const main = h( 'div', { class: 'hm-main' }, [ view, bar ] );
		const app = h( 'div', { class: 'hm-app' }, [ top, h( 'div', { class: 'hm-shell' }, [ nav, main ] ) ] );
		const status = h( 'div', { class: 'hm-toasts__region', role: 'status', 'aria-live': 'polite' } );
		const alerts = h( 'div', { class: 'hm-toasts__region', role: 'alert', 'aria-live': 'assertive' } );
		const modals = h( 'div', { class: 'hm-modals' } );

		root.replaceChildren( app, h( 'div', { class: 'hm-toasts' }, [ alerts, status ] ), modals );
		root.classList.toggle( 'is-rtl', !! data.rtl );
		Object.assign( ui.dom, { app, top, search, clearBtn, nav, view, bar, main, status, alerts, modals } );
	}

	function renderNav() {
		const list = h( 'ul', { class: 'hm-nav__list' } );
		let prev = null;
		order.forEach( function ( id ) {
			if ( ! sectionAvailable( id ) ) {
				return;
			}
			const s = schema[ id ];
			const kind = s.view ? 'view' : 'fields';
			if ( 'fields' === kind && 'fields' !== prev ) {
				list.appendChild( h( 'li', { class: 'hm-nav__label', role: 'presentation', text: t( 'navSettings' ) } ) );
			} else if ( 'view' === kind && 'fields' === prev ) {
				list.appendChild( h( 'li', { class: 'hm-nav__sep', role: 'presentation' } ) );
			}
			prev = kind;
			list.appendChild( h( 'li', null, h( 'a', { class: 'hm-nav__link', href: '#' + id, 'data-section': id }, [
				icon( s.icon || 'cog', 18 ),
				h( 'span', { class: 'hm-nav__text', text: s.title } ),
				h( 'span', { class: 'hm-nav__dot', title: t( 'unsavedDot' ), hidden: true }, sr( t( 'unsavedDot' ) ) ),
			] ) ) );
		} );
		ui.dom.nav.replaceChildren( list );
		markNav();
	}

	function markNav( dirty ) {
		const keys = dirty || dirtyKeys();
		const sections = {};
		keys.forEach( function ( key ) {
			sections[ fields[ key ].section ] = true;
		} );
		ui.dom.nav.querySelectorAll( '.hm-nav__link' ).forEach( function ( link ) {
			const id = link.dataset.section;
			if ( id === ui.route && ! ui.query ) {
				link.setAttribute( 'aria-current', 'page' );
			} else {
				link.removeAttribute( 'aria-current' );
			}
			link.querySelector( '.hm-nav__dot' ).hidden = ! sections[ id ];
		} );
		const current = ui.dom.nav.querySelector( '[aria-current="page"]' );
		if ( current && ui.dom.nav.scrollWidth > ui.dom.nav.clientWidth ) {
			current.scrollIntoView( { block: 'nearest', inline: 'nearest' } );
		}
	}

	function isViewRoute() {
		return ! ui.query && !! ( schema[ ui.route ] && schema[ ui.route ].view );
	}

	function updateSaveBar( count ) {
		const n = undefined === count ? dirtyKeys().length : count;
		const bar = ui.dom.bar;
		bar.dataset.state = ui.saving ? 'saving' : ( n ? 'dirty' : 'clean' );
		bar.querySelector( '.hm-savebar__text' ).textContent = ui.saving ? t( 'saving' ) : ( n > 1 ? fmt( t( 'unsavedCount' ), n ) : ( n ? t( 'unsaved' ) : t( 'allSaved' ) ) );
		bar.querySelector( '[data-act="save"]' ).disabled = ! n || ui.saving;
		bar.querySelector( '[data-act="discard"]' ).disabled = ! n || ui.saving;
		bar.hidden = ! n && ! ui.saving && isViewRoute();
	}

	function firstRoute() {
		for ( let i = 0; i < order.length; i++ ) {
			if ( sectionAvailable( order[ i ] ) ) {
				return order[ i ];
			}
		}
		return '';
	}

	function hashRoute() {
		let id = '';
		try {
			id = decodeURIComponent( location.hash.replace( /^#/, '' ) );
		} catch ( e ) {
			id = '';
		}
		return sectionAvailable( id ) ? id : firstRoute();
	}

	function renderView() {
		ui.rendered = [];
		const view = ui.dom.view;
		view.replaceChildren();
		const s = schema[ ui.route ];
		view.dataset.view = ui.query ? 'search' : ( s && s.view ) || 'section';

		if ( ui.query ) {
			renderSearch( view );
		} else if ( ! s ) {
			view.appendChild( emptyState( 'info', t( 'requestFailed' ) ) );
		} else if ( 'dashboard' === s.view ) {
			renderDashboard( view );
		} else if ( 'demos' === s.view ) {
			renderDemos( view, s );
		} else if ( 'tools' === s.view ) {
			renderTools( view, s );
		} else {
			renderSection( view, ui.route, s );
		}

		ui.rendered.forEach( function ( ctx ) {
			if ( ctx.ctrl.mount ) {
				ctx.ctrl.mount( ctx );
			}
		} );
		refreshVisibility( true );
		updateDirtyUI();
	}

	/** Keep the WordPress submenu highlight in step with the hash route. */
	function syncWpMenu() {
		const menu = document.getElementById( 'toplevel_page_hamista' );
		if ( ! menu ) {
			return;
		}
		const items = menu.querySelectorAll( '.wp-submenu li' );
		let target = null;
		items.forEach( function ( li ) {
			const a = li.querySelector( 'a' );
			const href = a ? a.getAttribute( 'href' ) || '' : '';
			if ( /#demos$/.test( href ) ? 'demos' === ui.route : /[?&]page=hamista$/.test( href ) && 'demos' !== ui.route ) {
				target = target || li;
			}
		} );
		if ( ! target ) {
			return;
		}
		items.forEach( function ( li ) {
			const a = li.querySelector( 'a' );
			const on = li === target;
			li.classList.toggle( 'current', on );
			if ( a ) {
				a.classList.toggle( 'current', on );
				if ( on ) {
					a.setAttribute( 'aria-current', 'page' );
				} else {
					a.removeAttribute( 'aria-current' );
				}
			}
		} );
	}

	function navigate( byUser ) {
		const id = hashRoute();
		if ( location.hash && location.hash.replace( /^#/, '' ) !== id && window.history.replaceState ) {
			window.history.replaceState( null, '', '#' + id );
		}
		ui.route = id;
		if ( ui.query ) {
			clearSearch( true );
		}
		renderView();
		markNav();
		syncWpMenu();
		if ( byUser ) {
			window.scrollTo( 0, 0 );
			const heading = ui.dom.view.querySelector( 'h1' );
			if ( heading ) {
				heading.focus( { preventScroll: true } );
			}
		}
	}

	/* ------------------------------------------------------------------ *
	 * Search
	 * ------------------------------------------------------------------ */

	let searchTimer = 0;

	function onSearchInput() {
		clearTimeout( searchTimer );
		searchTimer = setTimeout( function () {
			const q = ui.dom.search.value.trim();
			ui.dom.clearBtn.hidden = ! ui.dom.search.value;
			if ( q === ui.query ) {
				return;
			}
			ui.query = q;
			renderView();
			markNav();
			updateSaveBar();
		}, 120 );
	}

	function clearSearch( silent ) {
		clearTimeout( searchTimer );
		ui.dom.search.value = '';
		ui.dom.clearBtn.hidden = true;
		if ( ! ui.query ) {
			return;
		}
		ui.query = '';
		if ( ! silent ) {
			renderView();
			markNav();
		}
	}

	/* ------------------------------------------------------------------ *
	 * Events (delegated on the root)
	 * ------------------------------------------------------------------ */

	const globalActions = {
		save,
		discard,
		'search-clear'() {
			clearSearch();
			ui.dom.search.focus();
		},
		'toast-close'( btn ) {
			dismiss( btn.closest( '.hm-toast' ) );
		},
		'reset-section'( btn ) {
			resetSection( btn.dataset.section );
		},
		'plugin-install'( btn ) {
			installPlugin( btn.dataset.slug, btn );
		},
		'demo-open'( btn ) {
			const demo = demoList().filter( function ( d ) {
				return String( d.id ) === btn.dataset.demo;
			} )[ 0 ];
			if ( demo ) {
				openDemo( demo );
			}
		},
		'demo-uninstall'( btn ) {
			uninstallDemos( btn );
		},
		'tool-export': exportSettings,
		'tool-import'( btn ) {
			const input = btn.parentNode.querySelector( '[data-part="import-file"]' );
			if ( input ) {
				input.click();
			}
		},
		'tool-css'( btn ) {
			simpleTool( 'tools/elementor-css', btn );
		},
		'tool-fonts'( btn ) {
			simpleTool( 'tools/flush-fonts', btn );
		},
		'tool-reset-all': resetAll,
	};

	function fieldCtx( el ) {
		const fieldEl = el && el.closest ? el.closest( '.hm-field' ) : null;
		return fieldEl && fieldEl._hm ? fieldEl._hm : null;
	}

	function onFieldEvent( e ) {
		if ( e.target === ui.dom.search ) {
			if ( 'input' === e.type ) {
				onSearchInput();
			}
			return;
		}
		const ctx = fieldCtx( e.target );
		if ( ctx && ctx.ctrl.input ) {
			ctx.ctrl.input( ctx, e );
		}
	}

	function onClick( e ) {
		// Clicking the current section in the nav while searching: leave search.
		const link = e.target.closest( 'a[data-section]' );
		if ( link && ui.query && link.getAttribute( 'href' ) === '#' + ui.route ) {
			e.preventDefault();
			clearSearch( true );
			navigate( true );
			return;
		}

		const btn = e.target.closest( '[data-act]' );
		if ( ! btn || ! root.contains( btn ) || btn.disabled ) {
			return;
		}
		const act = btn.dataset.act;
		const ctx = fieldCtx( btn );
		if ( ctx && ctx.ctrl.click ) {
			e.preventDefault();
			ctx.ctrl.click( ctx, act, btn, e );
		} else if ( globalActions[ act ] ) {
			e.preventDefault();
			globalActions[ act ]( btn, e );
		}
	}

	function onRootKey( e ) {
		if ( 'Enter' !== e.key && 'Escape' !== e.key ) {
			return;
		}
		const target = e.target;
		if ( target === ui.dom.search ) {
			if ( 'Escape' === e.key && ( ui.dom.search.value || ui.query ) ) {
				e.preventDefault();
				clearSearch();
			}
			return;
		}
		if ( 'Enter' !== e.key ) {
			return;
		}
		// Enter in the font "family name" or action inputs presses their button.
		const part = target.dataset ? target.dataset.part : '';
		const ctx = fieldCtx( target );
		if ( ctx && ( 'new-family' === part || 'action-input' === part ) ) {
			e.preventDefault();
			const btn = ctx.control.querySelector( 'new-family' === part ? '[data-act="font-add-family"]' : '[data-act="run-action"]' );
			if ( btn && ! btn.disabled ) {
				btn.click();
			}
		}
	}

	function onDocKey( e ) {
		if ( ( e.ctrlKey || e.metaKey ) && ! e.altKey && ! e.shiftKey && 's' === String( e.key ).toLowerCase() ) {
			e.preventDefault();
			if ( ! document.documentElement.classList.contains( 'hm-modal-open' ) ) {
				// Commit a half-typed number/hex before saving.
				if ( document.activeElement && root.contains( document.activeElement ) && isTyping( document.activeElement ) ) {
					document.activeElement.dispatchEvent( new Event( 'change', { bubbles: true } ) );
				}
				save();
			}
			return;
		}
		if ( '/' === e.key && ! e.ctrlKey && ! e.metaKey && ! isTyping( e.target ) && ! document.documentElement.classList.contains( 'hm-modal-open' ) && ! document.body.classList.contains( 'modal-open' ) ) {
			e.preventDefault();
			ui.dom.search.focus();
		}
	}

	/* ------------------------------------------------------------------ *
	 * Boot
	 * ------------------------------------------------------------------ */

	function boot() {
		try {
			buildShell();
			renderNav();
			navigate( false );
		} catch ( err ) {
			// Never leave a blank screen: say what happened and keep the console trace.
			root.replaceChildren( h( 'div', { class: 'hm-noscript', role: 'alert' }, [ h( 'strong', { text: t( 'requestFailed' ) } ), String( err && err.message ? err.message : err ) ] ) );
			throw err;
		}

		root.addEventListener( 'input', onFieldEvent );
		root.addEventListener( 'change', onFieldEvent );
		root.addEventListener( 'click', onClick );
		root.addEventListener( 'keydown', onRootKey );
		document.addEventListener( 'keydown', onDocKey );
		window.addEventListener( 'hashchange', function () {
			navigate( true );
		} );
		window.addEventListener( 'beforeunload', function ( e ) {
			if ( dirtyKeys().length ) {
				e.preventDefault();
				e.returnValue = t( 'leaveWarning' );
				return e.returnValue;
			}
		} );
	}

	// Footer scripts (wp.media, wp.codeEditor) have all run by DOMContentLoaded.
	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
}() );
