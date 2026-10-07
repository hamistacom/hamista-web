<?php
/**
 * Icon set for widgets (24×24 line icons). The theme has a smaller UI set; this
 * set adds the feature icons offered in widget controls.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Icons.
 */
class Icons {

	/**
	 * Path data.
	 *
	 * @return array
	 */
	public static function paths() {
		static $paths = null;
		if ( null !== $paths ) {
			return $paths;
		}
		$paths = array(
			'arrow'       => '<path d="M19 12H5m6-6-6 6 6 6"/>',
			'arrow-right' => '<path d="M5 12h14m-6-6 6 6-6 6"/>',
			'menu'        => '<path d="M4 7h16M4 12h16M4 17h10"/>',
			'moon'        => '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
			'sound'       => '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
			'mute'        => '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5"/>',
			'tooth'       => '<path d="M7.5 3.5c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.5 3 1 5 2.2 5s1.6-2.2 2.1-4c.4-1.4 1-2 2.2-2s1.8.6 2.2 2c.5 1.8.9 4 2.1 4s1.7-2 2.2-5c.5-3 2-4.5 2-7.5 0-2.5-1.5-4.5-4-4.5-1.8 0-2.8 1-4.5 1s-2.7-1-4.5-1z"/>',
			'stethoscope' => '<path d="M5 3v5a5 5 0 0 0 10 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
			'pulse'       => '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
			'compare'     => '<path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8"/>',
			'fire'        => '<path d="M12 3c1 3 4 4.5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"/>',
			'gift'        => '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-4-6-4-6-1.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z"/>',
			'arrow-up'    => '<path d="M12 19V5m-6 6 6-6 6 6"/>',
			'arrow-out'   => '<path d="M7 17 17 7M8 7h9v9"/>',
			'chevron'     => '<path d="m6 9 6 6 6-6"/>',
			'chevron-l'   => '<path d="m15 6-6 6 6 6"/>',
			'chevron-r'   => '<path d="m9 6 6 6-6 6"/>',
			'check'       => '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
			'close'       => '<path d="M6 6l12 12M18 6 6 18"/>',
			'plus'        => '<path d="M12 5v14M5 12h14"/>',
			'minus'       => '<path d="M5 12h14"/>',
			'search'      => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
			'user'        => '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
			'users'       => '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
			'mail'        => '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
			'phone'       => '<path d="M5 3.5h3.2l1.6 4.3-2.1 1.3a11 11 0 0 0 5.2 5.2l1.3-2.1 4.3 1.6V17a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 2.5 6.2 2.5 2.5 0 0 1 5 3.5Z"/>',
			'mobile'      => '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
			'pin'         => '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
			'clock'       => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
			'calendar'    => '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4m8-4v4"/>',
			'compass'     => '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
			'rocket'      => '<path d="M14 4c3-1.5 6-1 6-1s.5 3-1 6l-6 6-5-5 6-6Z"/><path d="m8 10-3.5.5L3 13l4 1m7 2-.5 3.5L11 21l-1-4"/><circle cx="15.5" cy="8.5" r="1.3"/>',
			'bolt'        => '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z"/>',
			'layers'      => '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
			'shield'      => '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
			'chart'       => '<path d="M4 20V10m6 10V4m6 16v-7m4 7H3"/>',
			'trend'       => '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
			'globe'       => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
			'cpu'         => '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>',
			'sliders'     => '<path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
			'code'        => '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
			'palette'     => '<path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.6-1.5-1.8-1.5-3.1 0-1 .8-1.7 1.8-1.7H16a5 5 0 0 0 5-5c0-3.6-4-6.5-9-6.5Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
			'pen'         => '<path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z"/>',
			'book'        => '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
			'cap'         => '<path d="m12 4 10 5-10 5L2 9l10-5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
			'target'      => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
			'cube'        => '<path d="m12 2.5 8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5Z"/><path d="m3.5 7.3 8.5 4.8 8.5-4.8M12 12.1v9.4"/>',
			'box'         => '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9M7.8 5.2l8.4 4.6"/>',
			'truck'       => '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
			'card'        => '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
			'lock'        => '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
			'refresh'     => '<path d="M20 11A8 8 0 0 0 5.6 6.6L4 8.5M4 13a8 8 0 0 0 14.4 4.4L20 15.5"/><path d="M4 4v4.5h4.5M20 20v-4.5h-4.5"/>',
			'gauge'       => '<path d="M4.5 18a9 9 0 1 1 15 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1.4"/>',
			'cog'         => '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.2m0 14.6v2.2M4.6 4.6l1.6 1.6m11.6 11.6 1.6 1.6M2.5 12h2.2m14.6 0h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
			'wifi'        => '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.5 12a9.5 9.5 0 0 1 13 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
			'battery'     => '<rect x="2.5" y="7" width="17" height="10" rx="2.5"/><path d="M21.5 10.5v3M6 10v4m3.5-4v4"/>',
			'speaker'     => '<rect x="5" y="2.5" width="14" height="19" rx="3"/><circle cx="12" cy="14" r="3.5"/><circle cx="12" cy="7" r="1.3"/>',
			'headphones'  => '<path d="M3.5 16v-3a8.5 8.5 0 0 1 17 0v3"/><rect x="3" y="14.5" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14.5" width="4.5" height="6.5" rx="1.5"/>',
			'mic'         => '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
			'wave'        => '<path d="M2 12h2l2-6 3 12 3-15 3 15 3-9 2 3h2"/>',
			'music'       => '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
			'camera'      => '<path d="M3.5 8.5a2 2 0 0 1 2-2h2.3l1.5-2h5.4l1.5 2h2.3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
			'play'        => '<path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" stroke="none"/>',
			'quote'       => '<path d="M9.5 6.5c-3 .8-5 3.5-5 7v4h5v-5h-3c0-2 1-3.5 3-4.2Zm10 0c-3 .8-5 3.5-5 7v4h5v-5h-3c0-2 1-3.5 3-4.2Z"/>',
			'star'        => '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>',
			'heart'       => '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"/>',
			'leaf'        => '<path d="M5 19c0-8 5-13.5 15-14-.3 10-6 15-14 15"/><path d="M5 19 13 11"/>',
			'coffee'      => '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3m4-3v3"/>',
			'grid'        => '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
			'link'        => '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
			'bag'         => '<path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
			'drop'        => '<path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z"/><path d="M9.2 14.5a2.9 2.9 0 0 0 2.6 2.7"/>',
			'hexagon'     => '<path d="M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9Z"/>',
			'sun'         => '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
			'mountain'    => '<path d="m2.5 19.5 6.5-11 4 6.5 2.5-3.5 6 8Z"/><path d="m7.4 11.3 1.6 1.2 1.7-1.6"/>',
			'flower'      => '<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8C12 4 10.6 2.8 9.4 3.5S8.5 6.6 9.9 8M14.1 8c1.4-1.4 2.1-3.4.9-4.4s-3 .3-3 3.2M14 10.7c2.7.9 4.6.4 4.6-1s-2-2-4.4-1.1M10 10.7c-2.7.9-4.6.4-4.6-1s2-2 4.4-1.1M12 11.2V21m0-3c-1.8-2-4-2.2-5-1.6m5 3c1.8-2 4-2.2 5-1.6"/>',
			'tent'        => '<path d="M2.5 19.5 12 5l9.5 14.5Z"/><path d="M12 5v14.5m-3 0L12 14l3 5.5M10.5 3.5 12 5l1.5-1.5"/>',
			'megaphone'   => '<path d="M3.5 10v4a1 1 0 0 0 1 1H7l9 4.5v-15L7 9H4.5a1 1 0 0 0-1 1Z"/><path d="m7.5 15 1.5 5h2.5l-1.4-4.3M19 9.5a3 3 0 0 1 0 5"/>',
			'award'       => '<circle cx="12" cy="9" r="5.5"/><path d="m8.6 13.4-1.6 7.1 5-2.5 5 2.5-1.6-7.1"/>',
			'flask'       => '<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5"/><path d="M7.4 14.5h9.2"/>',
			'jar'         => '<path d="M8 3.5h8v3H8z"/><path d="M7 6.5h10a1.5 1.5 0 0 1 1.5 1.5v10.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V8A1.5 1.5 0 0 1 7 6.5Z"/><path d="M5.5 11.5h13"/>',
			'factory'     => '<path d="M3 20.5V10l5 3V10l5 3V10l5 3V4.5h3v16Z"/><path d="M7 17h2m3 0h2m3 0h2"/>',
			'wrench'      => '<path d="M14.7 6.3a4 4 0 0 0-5.4 5l-5.6 5.6a1.8 1.8 0 0 0 2.6 2.6l5.6-5.6a4 4 0 0 0 5-5.4l-2.6 2.6-2.4-.2-.2-2.4Z"/>',
			'eye'         => '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
			'mouse'       => '<rect x="6.5" y="3" width="11" height="18" rx="5.5"/><path d="M12 7v3"/>',
			'instagram'   => '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
			'telegram'    => '<path d="m21 4.5-3 15.2c-.2 1-1 1.2-1.8.8l-4.6-3.4-2.2 2.1c-.3.3-.5.4-1 .4l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.1 13.6 1.6 12.2c-1-.3-1-1 .2-1.5L19.6 3.8c.8-.3 1.6.2 1.4.7Z"/>',
			'whatsapp'    => '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.3 3.3Z"/><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2Z"/>',
			'linkedin'    => '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3"/>',
			'x'           => '<path d="m4 4 16 16M20 4 4 20" stroke-width="2"/>',
			'plane'       => '<path d="M10.5 4c0-1.1.7-2 1.5-2s1.5.9 1.5 2v5l7 4.2v2.3l-7-2.1v4.5l2.2 1.7V22L12 21.2 8.3 22v-2.4l2.2-1.7v-4.5l-7 2.1v-2.3l7-4.2Z"/>',
			'takeoff'     => '<path d="M3 20.5h18"/><path d="m4.5 13.2 2.4 2.7c.4.4 1 .6 1.6.4l11.8-4.1a2 2 0 0 0 1.2-2.5 2 2 0 0 0-2.5-1.2l-4.2 1.5-6-4.3-2.2.8 3.7 4.9-3.4 1.2-2.1-1.6-1.6.6Z"/>',
			'landing'     => '<path d="M3 20.5h18"/><path d="m3.5 6.5.2 5c0 .7.5 1.2 1.1 1.4l12 3.6a2 2 0 0 0 2.5-1.3 2 2 0 0 0-1.3-2.5l-4.3-1.3-2.4-6.8-2.3-.7.5 6-3.5-1-1-2.5Z"/>',
			'ticket'      => '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0 0-4Z"/><path d="M14.5 6.5v1.5m0 3v2m0 3v1.5"/>',
			'luggage'     => '<rect x="5.5" y="7" width="13" height="12.5" rx="2"/><path d="M9.5 7V4.5c0-.6.4-1 1-1h3c.6 0 1 .4 1 1V7M9.5 10.5v5.5m5-5.5v5.5M8.5 19.5V21m7-1.5V21"/>',
			'youtube'     => '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5Z" fill="currentColor"/>',
			'home'        => '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
			'ruler'       => '<path d="M3.5 20.5V3.5l17 17Z"/><path d="M7.5 16.5v-4l4 4Z"/><path d="M3.5 8h2m-2 4h2m-2 4h2"/>',
			'arch'        => '<path d="M4.5 21V10a7.5 7.5 0 0 1 15 0v11"/><path d="M8.5 21v-9.5a3.5 3.5 0 0 1 7 0V21"/><path d="M2.5 21h19"/>',
			'stairs'      => '<path d="M3.5 20.5h4v-4h4v-4h4v-4h4v-4"/><path d="M3.5 20.5h17"/>',
			'window'      => '<rect x="4.5" y="3.5" width="15" height="17" rx="1"/><path d="M12 3.5v17M4.5 12h15"/>',
			'tree'        => '<path d="M12 21v-6"/><path d="M12 15c-4 0-6.5-2.4-6.5-5.5S8.4 3.5 12 3.5s6.5 2.9 6.5 6S16 15 12 15Z"/><path d="M9 21h6"/>',
		);
		return $paths;
	}

	/**
	 * Icon choices for Elementor select controls.
	 *
	 * @return array
	 */
	public static function choices() {
		$names = array_keys( self::paths() );
		return array_combine( $names, $names );
	}

	/**
	 * Translated names of the icons, for pickers.
	 *
	 * @return array name => label
	 */
	public static function labels() {
		$labels = array(
			'arrow'       => _x( 'Arrow', 'icon', 'hamista-core' ),
			'arrow-right' => _x( 'Arrow right', 'icon', 'hamista-core' ),
			'menu'        => _x( 'Menu', 'icon', 'hamista-core' ),
			'moon'        => _x( 'Moon', 'icon', 'hamista-core' ),
			'sound'       => _x( 'Sound', 'icon', 'hamista-core' ),
			'mute'        => _x( 'Mute', 'icon', 'hamista-core' ),
			'tooth'       => _x( 'Tooth', 'icon', 'hamista-core' ),
			'stethoscope' => _x( 'Stethoscope', 'icon', 'hamista-core' ),
			'pulse'       => _x( 'Heartbeat', 'icon', 'hamista-core' ),
			'compare'     => _x( 'Compare', 'icon', 'hamista-core' ),
			'fire'        => _x( 'Flame', 'icon', 'hamista-core' ),
			'gift'        => _x( 'Gift', 'icon', 'hamista-core' ),
			'arrow-up'    => _x( 'Arrow up', 'icon', 'hamista-core' ),
			'arrow-out'   => _x( 'External link', 'icon', 'hamista-core' ),
			'chevron'     => _x( 'Chevron', 'icon', 'hamista-core' ),
			'chevron-l'   => _x( 'Chevron left', 'icon', 'hamista-core' ),
			'chevron-r'   => _x( 'Chevron right', 'icon', 'hamista-core' ),
			'check'       => _x( 'Tick', 'icon', 'hamista-core' ),
			'close'       => _x( 'Close', 'icon', 'hamista-core' ),
			'plus'        => _x( 'Plus', 'icon', 'hamista-core' ),
			'minus'       => _x( 'Minus', 'icon', 'hamista-core' ),
			'search'      => _x( 'Search', 'icon', 'hamista-core' ),
			'user'        => _x( 'Person', 'icon', 'hamista-core' ),
			'users'       => _x( 'People', 'icon', 'hamista-core' ),
			'mail'        => _x( 'Email', 'icon', 'hamista-core' ),
			'phone'       => _x( 'Phone', 'icon', 'hamista-core' ),
			'mobile'      => _x( 'Mobile', 'icon', 'hamista-core' ),
			'pin'         => _x( 'Location', 'icon', 'hamista-core' ),
			'clock'       => _x( 'Clock', 'icon', 'hamista-core' ),
			'calendar'    => _x( 'Calendar', 'icon', 'hamista-core' ),
			'compass'     => _x( 'Compass', 'icon', 'hamista-core' ),
			'rocket'      => _x( 'Rocket', 'icon', 'hamista-core' ),
			'bolt'        => _x( 'Lightning', 'icon', 'hamista-core' ),
			'layers'      => _x( 'Layers', 'icon', 'hamista-core' ),
			'shield'      => _x( 'Shield', 'icon', 'hamista-core' ),
			'chart'       => _x( 'Chart', 'icon', 'hamista-core' ),
			'trend'       => _x( 'Trend', 'icon', 'hamista-core' ),
			'globe'       => _x( 'Globe', 'icon', 'hamista-core' ),
			'cpu'         => _x( 'Processor', 'icon', 'hamista-core' ),
			'sliders'     => _x( 'Sliders', 'icon', 'hamista-core' ),
			'code'        => _x( 'Code', 'icon', 'hamista-core' ),
			'palette'     => _x( 'Palette', 'icon', 'hamista-core' ),
			'pen'         => _x( 'Pen', 'icon', 'hamista-core' ),
			'book'        => _x( 'Book', 'icon', 'hamista-core' ),
			'cap'         => _x( 'Graduation cap', 'icon', 'hamista-core' ),
			'target'      => _x( 'Target', 'icon', 'hamista-core' ),
			'cube'        => _x( 'Cube', 'icon', 'hamista-core' ),
			'box'         => _x( 'Box', 'icon', 'hamista-core' ),
			'truck'       => _x( 'Truck', 'icon', 'hamista-core' ),
			'card'        => _x( 'Bank card', 'icon', 'hamista-core' ),
			'lock'        => _x( 'Lock', 'icon', 'hamista-core' ),
			'refresh'     => _x( 'Refresh', 'icon', 'hamista-core' ),
			'gauge'       => _x( 'Gauge', 'icon', 'hamista-core' ),
			'cog'         => _x( 'Gear', 'icon', 'hamista-core' ),
			'wifi'        => _x( 'Wi-Fi', 'icon', 'hamista-core' ),
			'battery'     => _x( 'Battery', 'icon', 'hamista-core' ),
			'speaker'     => _x( 'Speaker', 'icon', 'hamista-core' ),
			'headphones'  => _x( 'Headphones', 'icon', 'hamista-core' ),
			'mic'         => _x( 'Microphone', 'icon', 'hamista-core' ),
			'wave'        => _x( 'Sound wave', 'icon', 'hamista-core' ),
			'music'       => _x( 'Music', 'icon', 'hamista-core' ),
			'camera'      => _x( 'Camera', 'icon', 'hamista-core' ),
			'play'        => _x( 'Play', 'icon', 'hamista-core' ),
			'quote'       => _x( 'Quote', 'icon', 'hamista-core' ),
			'star'        => _x( 'Star', 'icon', 'hamista-core' ),
			'heart'       => _x( 'Heart', 'icon', 'hamista-core' ),
			'leaf'        => _x( 'Leaf', 'icon', 'hamista-core' ),
			'coffee'      => _x( 'Coffee', 'icon', 'hamista-core' ),
			'grid'        => _x( 'Grid', 'icon', 'hamista-core' ),
			'link'        => _x( 'Link', 'icon', 'hamista-core' ),
			'bag'         => _x( 'Shopping bag', 'icon', 'hamista-core' ),
			'drop'        => _x( 'Drop', 'icon', 'hamista-core' ),
			'hexagon'     => _x( 'Hexagon', 'icon', 'hamista-core' ),
			'sun'         => _x( 'Sun', 'icon', 'hamista-core' ),
			'mountain'    => _x( 'Mountain', 'icon', 'hamista-core' ),
			'flower'      => _x( 'Flower', 'icon', 'hamista-core' ),
			'tent'        => _x( 'Tent', 'icon', 'hamista-core' ),
			'megaphone'   => _x( 'Megaphone', 'icon', 'hamista-core' ),
			'award'       => _x( 'Award', 'icon', 'hamista-core' ),
			'flask'       => _x( 'Flask', 'icon', 'hamista-core' ),
			'jar'         => _x( 'Jar', 'icon', 'hamista-core' ),
			'factory'     => _x( 'Factory', 'icon', 'hamista-core' ),
			'wrench'      => _x( 'Wrench', 'icon', 'hamista-core' ),
			'eye'         => _x( 'Eye', 'icon', 'hamista-core' ),
			'mouse'       => _x( 'Mouse', 'icon', 'hamista-core' ),
			'instagram'   => _x( 'Instagram', 'icon', 'hamista-core' ),
			'telegram'    => _x( 'Telegram', 'icon', 'hamista-core' ),
			'whatsapp'    => _x( 'WhatsApp', 'icon', 'hamista-core' ),
			'linkedin'    => _x( 'LinkedIn', 'icon', 'hamista-core' ),
			'x'           => _x( 'X (Twitter)', 'icon', 'hamista-core' ),
			'plane'       => _x( 'Plane', 'icon', 'hamista-core' ),
			'takeoff'     => _x( 'Take-off', 'icon', 'hamista-core' ),
			'landing'     => _x( 'Landing', 'icon', 'hamista-core' ),
			'ticket'      => _x( 'Ticket', 'icon', 'hamista-core' ),
			'luggage'     => _x( 'Luggage', 'icon', 'hamista-core' ),
			'youtube'     => _x( 'YouTube', 'icon', 'hamista-core' ),
			'home'        => _x( 'House', 'icon', 'hamista-core' ),
			'ruler'       => _x( 'Set square', 'icon', 'hamista-core' ),
			'arch'        => _x( 'Arch', 'icon', 'hamista-core' ),
			'stairs'      => _x( 'Stairs', 'icon', 'hamista-core' ),
			'window'      => _x( 'Window', 'icon', 'hamista-core' ),
			'tree'        => _x( 'Tree', 'icon', 'hamista-core' ),
		);
		$out    = array();
		foreach ( array_keys( self::paths() ) as $name ) {
			$out[ $name ] = $labels[ $name ] ?? $name;
		}
		return $out;
	}

	/**
	 * SVG markup.
	 *
	 * @param string $name  Icon.
	 * @param array  $attrs Attributes.
	 * @return string
	 */
	public static function get( $name, $attrs = array() ) {
		$paths = self::paths();
		if ( ! isset( $paths[ $name ] ) ) {
			return '';
		}
		$class = trim( 'hm-icon hm-i-' . $name . ' ' . ( isset( $attrs['class'] ) ? $attrs['class'] : '' ) );
		$size  = isset( $attrs['size'] ) ? (int) $attrs['size'] : 24;
		return '<svg class="' . esc_attr( $class ) . '" width="' . $size . '" height="' . $size . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $paths[ $name ] . '</svg>';
	}
}
