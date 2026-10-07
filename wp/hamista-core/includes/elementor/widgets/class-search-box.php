<?php
/**
 * Search box: a row of fields that sends the visitor to a results page.
 * Built for flights, hotels, tours, property or jobs: each field becomes a
 * query-string parameter of the address the form opens.
 *
 * Field types: text (with optional suggestions), list, date (the next days,
 * labelled in the Persian calendar on Persian sites) and count (1, 2, 3 …).
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Search box widget.
 */
class Search_Box extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-search-box';
	}

	/** @return string */
	public function get_title() {
		return __( 'Search box', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-search';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'search', 'flight', 'hotel', 'booking', 'filter', 'form' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_fields', array( 'label' => __( 'Fields', 'hamista-core' ) ) );

		$this->add_control(
			'pills',
			array(
				'label'       => __( 'Options above the fields', 'hamista-core' ),
				'description' => __( 'One per line, e.g. one way / return. Leave empty for none.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 3,
				'default'     => __( "One way\nReturn", 'hamista-core' ),
			)
		);
		$this->add_control(
			'pills_name',
			array(
				'label'     => __( 'Parameter name for the options', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => 'type',
				'condition' => array( 'pills!' => '' ),
			)
		);

		$fields = new Repeater();
		$fields->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => _x( 'From', 'travel origin', 'hamista-core' ),
			)
		);
		$fields->add_control(
			'name',
			array(
				'label'       => __( 'Parameter name', 'hamista-core' ),
				'description' => __( 'Latin letters, as the results page expects it, e.g. from.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => 'from',
			)
		);
		$fields->add_control(
			'type',
			array(
				'label'   => __( 'Type', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'text',
				'options' => array(
					'text'   => __( 'Text', 'hamista-core' ),
					'select' => __( 'List', 'hamista-core' ),
					'date'   => __( 'Date', 'hamista-core' ),
					'count'  => __( 'Count (1, 2, 3 …)', 'hamista-core' ),
				),
			)
		);
		$fields->add_control(
			'placeholder',
			array(
				'label'       => __( 'Placeholder or unit', 'hamista-core' ),
				'description' => __( 'For a count, the unit after the number, e.g. passenger.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
			)
		);
		$fields->add_control(
			'options',
			array(
				'label'       => __( 'Choices', 'hamista-core' ),
				'description' => __( 'One per line. A list offers these; a text field suggests them as the visitor types.', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 4,
				'condition'   => array( 'type' => array( 'text', 'select' ) ),
			)
		);
		$fields->add_control(
			'max',
			array(
				'label'     => __( 'Highest number', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 9,
				'min'       => 2,
				'max'       => 50,
				'condition' => array( 'type' => 'count' ),
			)
		);
		$fields->add_control(
			'days',
			array(
				'label'     => __( 'Days to offer', 'hamista-core' ),
				'type'      => Controls_Manager::NUMBER,
				'default'   => 60,
				'min'       => 7,
				'max'       => 365,
				'condition' => array( 'type' => 'date' ),
			)
		);
		$fields->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => self::icon_options(),
			)
		);
		$this->add_control(
			'fields',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $fields->get_controls(),
				'title_field' => '{{{ label }}}',
				'default'     => array(
					array(
						'label' => _x( 'From', 'travel origin', 'hamista-core' ),
						'name'  => 'from',
						'icon'  => 'takeoff',
					),
					array(
						'label' => _x( 'To', 'travel destination', 'hamista-core' ),
						'name'  => 'to',
						'icon'  => 'landing',
					),
					array(
						'label' => __( 'Departure', 'hamista-core' ),
						'name'  => 'date',
						'type'  => 'date',
						'icon'  => 'calendar',
					),
					array(
						'label'       => __( 'Passengers', 'hamista-core' ),
						'name'        => 'adults',
						'type'        => 'count',
						'placeholder' => __( 'passenger', 'hamista-core' ),
						'icon'        => 'users',
					),
				),
			)
		);
		$this->add_control(
			'swap',
			array(
				'label'        => __( 'Swap button between the first two fields', 'hamista-core' ),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_submit', array( 'label' => __( 'Results page', 'hamista-core' ) ) );
		$this->add_control(
			'action',
			array(
				'label'       => __( 'Results page address', 'hamista-core' ),
				'description' => __( 'The fields are added to this address as parameters. Empty: the site search.', 'hamista-core' ),
				'type'        => Controls_Manager::URL,
				'options'     => false,
			)
		);
		$this->add_control(
			'button',
			array(
				'label'   => __( 'Button text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Search', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_look',
			array(
				'label' => __( 'Look', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Box', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'solid',
				'options' => array(
					'solid' => __( 'Solid card', 'hamista-core' ),
					'glass' => __( 'Frosted glass (over a photo)', 'hamista-core' ),
					'line'  => __( 'Outline only', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'max_width',
			array(
				'label'      => __( 'Maximum width', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array(
						'min' => 320,
						'max' => 1400,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-sbox' => 'max-width: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_control(
			'align',
			array(
				'label'   => __( 'Position', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'center',
				'options' => array(
					'start'  => __( 'Start', 'hamista-core' ),
					'center' => __( 'Center', 'hamista-core' ),
				),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Lines of a textarea.
	 *
	 * @param string $text Text.
	 * @return string[]
	 */
	private static function lines( $text ) {
		return array_values( array_filter( array_map( 'trim', preg_split( '/[\r\n]+/', (string) $text ) ) ) );
	}

	/**
	 * Parameter name limited to what a query string expects.
	 *
	 * @param string $name     Name.
	 * @param string $fallback Fallback.
	 * @return string
	 */
	private static function param( $name, $fallback ) {
		$name = preg_replace( '/[^a-z0-9_\-\[\]]/i', '', (string) $name );
		return '' !== $name ? $name : $fallback;
	}

	/**
	 * Label for a day: weekday, day and month, in the Persian calendar on Persian sites.
	 *
	 * @param \DateTime $day Day.
	 * @return string
	 */
	private static function day_label( \DateTime $day ) {
		if ( 0 === strpos( get_locale(), 'fa' ) && class_exists( '\Hamista\Core\Jalali\Jalali' ) ) {
			return \Hamista\Core\Jalali\Jalali::format( 'l j F', $day );
		}
		return wp_date( 'l j F', $day->getTimestamp() );
	}

	/**
	 * The control of one field.
	 *
	 * @param array  $field Field settings.
	 * @param string $id    Element id.
	 * @param string $name  Parameter name.
	 * @return string
	 */
	private static function control( $field, $id, $name ) {
		$type = $field['type'] ?? 'text';
		$ph   = (string) ( $field['placeholder'] ?? '' );

		if ( 'select' === $type ) {
			$html = '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '">';
			if ( '' !== $ph ) {
				$html .= '<option value="">' . esc_html( $ph ) . '</option>';
			}
			foreach ( self::lines( $field['options'] ?? '' ) as $choice ) {
				$html .= '<option value="' . esc_attr( $choice ) . '">' . esc_html( $choice ) . '</option>';
			}
			return $html . '</select>';
		}

		if ( 'date' === $type ) {
			$days = max( 7, min( 365, absint( $field['days'] ?? 60 ) ) );
			$day  = new \DateTime( 'today', wp_timezone() );
			$html = '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '">';
			for ( $i = 0; $i < $days; $i++ ) {
				$html .= '<option value="' . esc_attr( $day->format( 'Y-m-d' ) ) . '">' . esc_html( self::day_label( $day ) ) . '</option>';
				$day->modify( '+1 day' );
			}
			return $html . '</select>';
		}

		if ( 'count' === $type ) {
			$max  = max( 2, min( 50, absint( $field['max'] ?? 9 ) ) );
			$html = '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '">';
			for ( $n = 1; $n <= $max; $n++ ) {
				$html .= '<option value="' . $n . '">' . esc_html( trim( hamista_core_digits( (string) $n ) . ' ' . $ph ) ) . '</option>';
			}
			return $html . '</select>';
		}

		$choices = self::lines( $field['options'] ?? '' );
		$list    = $choices ? $id . '-list' : '';
		$html    = '<input type="text" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" placeholder="' . esc_attr( $ph ) . '" autocomplete="off"' . ( $list ? ' list="' . esc_attr( $list ) . '"' : '' ) . '>';
		if ( $list ) {
			$html .= '<datalist id="' . esc_attr( $list ) . '">';
			foreach ( $choices as $choice ) {
				$html .= '<option value="' . esc_attr( $choice ) . '"></option>';
			}
			$html .= '</datalist>';
		}
		return $html;
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s      = $this->get_settings_for_display();
		$uid    = 'hms-' . $this->get_id();
		$fields = array_values( (array) $s['fields'] );
		$site   = empty( $s['action']['url'] );
		$action = $site ? home_url( '/' ) : $s['action']['url'];
		$pills  = self::lines( $s['pills'] ?? '' );
		$class  = 'hm-sbox hm-sbox--' . sanitize_html_class( $s['look'] ) . ( 'start' === $s['align'] ? ' hm-sbox--start' : '' );

		echo '<form class="' . esc_attr( $class ) . '" action="' . esc_url( $action ) . '" method="get" role="search" data-hm-widget="searchbox">';
		if ( $site ) {
			echo '<input type="hidden" name="s" value="">';
		}

		if ( $pills ) {
			$pname = self::param( $s['pills_name'] ?? '', 'type' );
			echo '<div class="hm-sbox__pills" role="radiogroup" aria-label="' . esc_attr__( 'Search options', 'hamista-core' ) . '">';
			foreach ( $pills as $i => $pill ) {
				echo '<label class="hm-sbox__pill"><input type="radio" name="' . esc_attr( $pname ) . '" value="' . esc_attr( $pill ) . '"' . checked( 0, $i, false ) . '><span>' . esc_html( $pill ) . '</span></label>';
			}
			echo '</div>';
		}

		echo '<div class="hm-sbox__row">';
		foreach ( $fields as $i => $field ) {
			$id   = $uid . '-' . $i;
			$name = self::param( $field['name'] ?? '', 'f' . $i );
			echo '<div class="hm-sbox__field hm-sbox__field--' . esc_attr( sanitize_html_class( $field['type'] ?? 'text' ) ) . '">';
			echo '<label class="hm-sbox__label" for="' . esc_attr( $id ) . '">' . esc_html( $field['label'] ?? '' ) . '</label>';
			echo '<span class="hm-sbox__control">';
			if ( ! empty( $field['icon'] ) ) {
				echo hamista_core_icon( $field['icon'], array( 'class' => 'hm-sbox__icon' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
			}
			echo self::control( $field, $id, $name ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in control().
			echo '</span></div>';
			if ( 0 === $i && 'yes' === $s['swap'] && count( $fields ) > 1 ) {
				echo '<button type="button" class="hm-sbox__swap" data-swap aria-label="' . esc_attr__( 'Swap the first two fields', 'hamista-core' ) . '">' . hamista_core_icon( 'compare' ) . '</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
			}
		}
		echo '<button type="submit" class="hm-btn hm-btn--primary hm-sbox__submit">' . hamista_core_icon( 'search' ) . '<span>' . esc_html( $s['button'] ) . '</span></button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG.
		echo '</div></form>';
	}
}
