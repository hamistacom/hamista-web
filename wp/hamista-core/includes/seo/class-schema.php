<?php
/**
 * Structured data (JSON-LD) as one @graph: the website and its search box,
 * the business behind it (Organization or a LocalBusiness type with address,
 * hours and map position), the page, its breadcrumb trail and, on posts,
 * the article. WooCommerce prints its own Product data and the FAQ widget
 * its own FAQPage, so neither is repeated here.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Seo;

defined( 'ABSPATH' ) || exit;

/**
 * Schema.
 */
class Schema {

	/**
	 * Business types offered in the settings (schema.org names).
	 *
	 * @return array type => label
	 */
	public static function types() {
		return array(
			'Organization'            => __( 'Company or organisation (no walk-in address)', 'hamista-core' ),
			'LocalBusiness'           => __( 'Local business', 'hamista-core' ),
			'ProfessionalService'     => __( 'Professional services, agency or studio', 'hamista-core' ),
			'Store'                   => __( 'Shop', 'hamista-core' ),
			'Restaurant'              => __( 'Restaurant or café', 'hamista-core' ),
			'MedicalClinic'           => __( 'Clinic', 'hamista-core' ),
			'Dentist'                 => __( 'Dental practice', 'hamista-core' ),
			'BeautySalon'             => __( 'Beauty salon', 'hamista-core' ),
			'LegalService'            => __( 'Law firm', 'hamista-core' ),
			'EducationalOrganization' => __( 'School or academy', 'hamista-core' ),
			'TravelAgency'            => __( 'Travel agency', 'hamista-core' ),
			'RealEstateAgent'         => __( 'Real estate agency', 'hamista-core' ),
			'AutoRepair'              => __( 'Car service', 'hamista-core' ),
			'SportsActivityLocation'  => __( 'Gym or sports venue', 'hamista-core' ),
			'LodgingBusiness'         => __( 'Hotel or guesthouse', 'hamista-core' ),
		);
	}

	/**
	 * Print the graph.
	 */
	public static function output() {
		if ( ! hamista_core_option( 'seo_schema', true ) || is_404() ) {
			return;
		}
		$graph = array_values( array_filter( array( self::website(), self::business(), self::webpage(), self::breadcrumbs(), self::article() ) ) );

		/**
		 * Change the structured data graph before it prints.
		 *
		 * @param array $graph Nodes.
		 */
		$graph = apply_filters( 'hamista_core/schema_graph', $graph );
		if ( ! $graph ) {
			return;
		}
		$json = wp_json_encode(
			array(
				'@context' => 'https://schema.org',
				'@graph'   => $graph,
			),
			JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
		);
		echo '<script type="application/ld+json">' . str_replace( '</', '<\/', $json ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON, closing tags escaped.
	}

	/**
	 * Stable node ids.
	 *
	 * @param string $name Node name.
	 * @return string
	 */
	private static function id( $name ) {
		return home_url( '/#' . $name );
	}

	/**
	 * WebSite with a search action.
	 *
	 * @return array
	 */
	private static function website() {
		return array(
			'@type'           => 'WebSite',
			'@id'             => self::id( 'website' ),
			'url'             => home_url( '/' ),
			'name'            => get_bloginfo( 'name' ),
			'description'     => get_bloginfo( 'description' ),
			'inLanguage'      => get_bloginfo( 'language' ),
			'publisher'       => array( '@id' => self::id( 'organization' ) ),
			'potentialAction' => array(
				'@type'       => 'SearchAction',
				'target'      => array(
					'@type'       => 'EntryPoint',
					'urlTemplate' => home_url( '/?s={search_term_string}' ),
				),
				'query-input' => 'required name=search_term_string',
			),
		);
	}

	/**
	 * The organisation or local business, from Hamista → SEO.
	 *
	 * @return array
	 */
	private static function business() {
		$type = (string) hamista_core_option( 'seo_business_type', 'Organization' );
		if ( ! isset( self::types()[ $type ] ) ) {
			$type = 'Organization';
		}
		$name = trim( (string) hamista_core_option( 'seo_business_name', '' ) );
		$node = array(
			'@type' => $type,
			'@id'   => self::id( 'organization' ),
			'name'  => '' !== $name ? $name : get_bloginfo( 'name' ),
			'url'   => home_url( '/' ),
		);

		$logo_id = (int) get_theme_mod( 'custom_logo' );
		if ( ! $logo_id && function_exists( 'hamista_option' ) ) {
			$logo_id = (int) hamista_option( 'logo' );
		}
		if ( ! $logo_id ) {
			$logo_id = (int) get_option( 'site_icon' );
		}
		if ( $logo_id ) {
			$src = wp_get_attachment_image_src( $logo_id, 'full' );
			if ( $src ) {
				$node['logo']  = array(
					'@type'  => 'ImageObject',
					'@id'    => self::id( 'logo' ),
					'url'    => $src[0],
					'width'  => (int) $src[1],
					'height' => (int) $src[2],
				);
				$node['image'] = array( '@id' => self::id( 'logo' ) );
			}
		}

		$phone = trim( (string) hamista_core_option( 'seo_business_phone', '' ) );
		if ( '' !== $phone ) {
			$node['telephone'] = hamista_core_latin_digits( $phone );
		}
		$email = sanitize_email( (string) hamista_core_option( 'seo_business_email', '' ) );
		if ( $email ) {
			$node['email'] = $email;
		}

		$same = array();
		foreach ( (array) hamista_core_option( 'footer_social', array() ) as $row ) {
			if ( ! empty( $row['url'] ) && wp_http_validate_url( $row['url'] ) ) {
				$same[] = esc_url_raw( $row['url'] );
			}
		}
		if ( $same ) {
			$node['sameAs'] = array_values( array_unique( $same ) );
		}

		if ( 'Organization' !== $type && 'EducationalOrganization' !== $type ) {
			$address = array_filter(
				array(
					'@type'           => 'PostalAddress',
					'streetAddress'   => trim( (string) hamista_core_option( 'seo_business_street', '' ) ),
					'addressLocality' => trim( (string) hamista_core_option( 'seo_business_city', '' ) ),
					'addressRegion'   => trim( (string) hamista_core_option( 'seo_business_region', '' ) ),
					'postalCode'      => hamista_core_latin_digits( trim( (string) hamista_core_option( 'seo_business_postcode', '' ) ) ),
					'addressCountry'  => 'IR',
				)
			);
			if ( count( $address ) > 2 ) {
				$node['address'] = $address;
			}
			$lat = (float) hamista_core_latin_digits( (string) hamista_core_option( 'seo_business_lat', '' ) );
			$lng = (float) hamista_core_latin_digits( (string) hamista_core_option( 'seo_business_lng', '' ) );
			if ( $lat && $lng ) {
				$node['geo'] = array(
					'@type'     => 'GeoCoordinates',
					'latitude'  => $lat,
					'longitude' => $lng,
				);
			}
			$hours = self::hours();
			if ( $hours ) {
				$node['openingHoursSpecification'] = $hours;
			}
			$price = trim( (string) hamista_core_option( 'seo_business_price', '' ) );
			if ( '' !== $price ) {
				$node['priceRange'] = $price;
			}
		}
		return $node;
	}

	/**
	 * Opening hours rows → OpeningHoursSpecification.
	 *
	 * @return array
	 */
	private static function hours() {
		$days = array(
			'sat' => 'Saturday',
			'sun' => 'Sunday',
			'mon' => 'Monday',
			'tue' => 'Tuesday',
			'wed' => 'Wednesday',
			'thu' => 'Thursday',
			'fri' => 'Friday',
		);
		$out  = array();
		foreach ( (array) hamista_core_option( 'seo_business_hours', array() ) as $row ) {
			$opens  = hamista_core_latin_digits( isset( $row['opens'] ) ? (string) $row['opens'] : '' );
			$closes = hamista_core_latin_digits( isset( $row['closes'] ) ? (string) $row['closes'] : '' );
			$day    = isset( $row['day'] ) ? (string) $row['day'] : '';
			if ( ! isset( $days[ $day ] ) || ! preg_match( '/^\d{1,2}:\d{2}$/', $opens ) || ! preg_match( '/^\d{1,2}:\d{2}$/', $closes ) ) {
				continue;
			}
			$out[] = array(
				'@type'     => 'OpeningHoursSpecification',
				'dayOfWeek' => $days[ $day ],
				'opens'     => $opens,
				'closes'    => $closes,
			);
		}
		return $out;
	}

	/**
	 * The current page.
	 *
	 * @return array|null
	 */
	private static function webpage() {
		$url = Seo::canonical();
		if ( ! $url ) {
			return null;
		}
		$type = 'WebPage';
		if ( is_search() ) {
			$type = 'SearchResultsPage';
		} elseif ( is_home() || is_archive() ) {
			$type = 'CollectionPage';
		} elseif ( is_page() && in_array( get_post_field( 'post_name', get_queried_object_id() ), array( 'about', 'about-us', 'darbare-ma' ), true ) ) {
			$type = 'AboutPage';
		} elseif ( is_page() && in_array( get_post_field( 'post_name', get_queried_object_id() ), array( 'contact', 'contact-us', 'tamas' ), true ) ) {
			$type = 'ContactPage';
		}
		$node = array(
			'@type'      => $type,
			'@id'        => $url . '#webpage',
			'url'        => $url,
			'name'       => wp_get_document_title(),
			'isPartOf'   => array( '@id' => self::id( 'website' ) ),
			'inLanguage' => get_bloginfo( 'language' ),
		);
		$desc = Seo::description();
		if ( '' !== $desc ) {
			$node['description'] = $desc;
		}
		if ( is_singular() ) {
			$node['datePublished'] = get_post_time( 'c', true );
			$node['dateModified']  = get_post_modified_time( 'c', true );
			if ( has_post_thumbnail() ) {
				$node['primaryImageOfPage'] = array(
					'@type' => 'ImageObject',
					'url'   => get_the_post_thumbnail_url( get_queried_object_id(), 'large' ),
				);
			}
		}
		if ( ! is_front_page() ) {
			$node['breadcrumb'] = array( '@id' => $url . '#breadcrumb' );
		}
		return $node;
	}

	/**
	 * Breadcrumb trail of the current page.
	 *
	 * @return array|null
	 */
	private static function breadcrumbs() {
		if ( is_front_page() ) {
			return null;
		}
		$url = Seo::canonical();
		if ( ! $url ) {
			return null;
		}
		$trail = self::trail();
		$items = array();
		foreach ( $trail as $i => $crumb ) {
			$item = array(
				'@type'    => 'ListItem',
				'position' => $i + 1,
				'name'     => $crumb[1],
			);
			if ( $crumb[0] ) {
				$item['item'] = $crumb[0];
			}
			$items[] = $item;
		}
		return array(
			'@type'           => 'BreadcrumbList',
			'@id'             => $url . '#breadcrumb',
			'itemListElement' => $items,
		);
	}

	/**
	 * Trail as [ url, name ] pairs (last one is the current page, with its url).
	 *
	 * @return array
	 */
	public static function trail() {
		$items = array( array( home_url( '/' ), __( 'Home', 'hamista-core' ) ) );
		if ( is_singular( 'post' ) ) {
			$blog = (int) get_option( 'page_for_posts' );
			if ( $blog ) {
				$items[] = array( get_permalink( $blog ), get_the_title( $blog ) );
			}
			$cats = get_the_category( get_queried_object_id() );
			if ( $cats ) {
				$items[] = array( get_category_link( $cats[0] ), $cats[0]->name );
			}
		} elseif ( is_singular( 'product' ) && function_exists( 'wc_get_page_id' ) ) {
			$shop = (int) wc_get_page_id( 'shop' );
			if ( $shop > 0 ) {
				$items[] = array( get_permalink( $shop ), get_the_title( $shop ) );
			}
			$terms = get_the_terms( get_queried_object_id(), 'product_cat' );
			if ( $terms && ! is_wp_error( $terms ) ) {
				$items[] = array( get_term_link( $terms[0] ), $terms[0]->name );
			}
		} elseif ( is_singular() && ! is_page() ) {
			$type = get_post_type_object( get_post_type() );
			if ( $type && $type->has_archive ) {
				$items[] = array( get_post_type_archive_link( $type->name ), $type->labels->name );
			}
		} elseif ( is_page() ) {
			foreach ( array_reverse( get_post_ancestors( get_queried_object_id() ) ) as $ancestor ) {
				$items[] = array( get_permalink( $ancestor ), get_the_title( $ancestor ) );
			}
		}
		$items[] = array( Seo::canonical(), self::current_name() );
		return $items;
	}

	/**
	 * Name of the current view for the last crumb.
	 *
	 * @return string
	 */
	private static function current_name() {
		if ( is_singular() ) {
			return wp_strip_all_tags( get_the_title( get_queried_object_id() ) );
		}
		if ( is_home() ) {
			$blog = (int) get_option( 'page_for_posts' );
			return $blog ? get_the_title( $blog ) : __( 'Blog', 'hamista-core' );
		}
		if ( is_search() ) {
			return __( 'Search', 'hamista-core' );
		}
		return wp_strip_all_tags( (string) get_the_archive_title() );
	}

	/**
	 * BlogPosting on single posts.
	 *
	 * @return array|null
	 */
	private static function article() {
		if ( ! is_singular( 'post' ) ) {
			return null;
		}
		$id     = get_queried_object_id();
		$url    = Seo::canonical();
		$author = (int) get_post_field( 'post_author', $id );
		$node   = array(
			'@type'            => 'BlogPosting',
			'@id'              => $url . '#article',
			'headline'         => mb_substr( wp_strip_all_tags( get_the_title( $id ) ), 0, 110 ),
			'mainEntityOfPage' => array( '@id' => $url . '#webpage' ),
			'datePublished'    => get_post_time( 'c', true, $id ),
			'dateModified'     => get_post_modified_time( 'c', true, $id ),
			'author'           => array(
				'@type' => 'Person',
				'name'  => get_the_author_meta( 'display_name', $author ),
				'url'   => get_author_posts_url( $author ),
			),
			'publisher'        => array( '@id' => self::id( 'organization' ) ),
			'inLanguage'       => get_bloginfo( 'language' ),
		);
		$desc   = Seo::description();
		if ( '' !== $desc ) {
			$node['description'] = $desc;
		}
		if ( has_post_thumbnail( $id ) ) {
			$node['image'] = get_the_post_thumbnail_url( $id, 'large' );
		}
		$cats = get_the_category( $id );
		if ( $cats ) {
			$node['articleSection'] = $cats[0]->name;
		}
		$words = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( get_post_field( 'post_content', $id ) ) ) ) );
		if ( $words > 1 ) {
			$node['wordCount'] = $words;
		}
		return $node;
	}
}
