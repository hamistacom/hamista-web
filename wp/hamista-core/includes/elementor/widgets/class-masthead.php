<?php
/**
 * Masthead: the nameplate of a newspaper or magazine. A ruled line with the
 * issue details, the title set large with an optional round stamp, the motto,
 * and a dateline with today's date (in the Persian calendar on Persian sites)
 * and the issue number counted from the day you started.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Masthead widget.
 */
class Masthead extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-masthead';
	}

	/** @return string */
	public function get_title() {
		return __( 'Masthead', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-site-title';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'masthead', 'newspaper', 'nameplate', 'magazine', 'date', 'issue' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-news' );
	}

	/**
	 * Today's date and the issue number change every day.
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_masthead', array( 'label' => __( 'Masthead', 'hamista-core' ) ) );
		$this->add_control(
			'title',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => get_bloginfo( 'name' ),
			)
		);
		$this->add_control(
			'motto',
			array(
				'label'   => __( 'Motto', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => get_bloginfo( 'description' ),
			)
		);
		$this->add_control(
			'top_start',
			array(
				'label'       => __( 'Top line, start', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Year {year} · Issue {issue}', 'hamista-core' ),
				'description' => __( '{issue} becomes the issue number and {year} the year of publication.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'top_middle',
			array(
				'label'   => __( 'Top line, middle', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Morning daily', 'hamista-core' ),
			)
		);
		$this->add_control(
			'top_end',
			array(
				'label'   => __( 'Top line, end', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Founded {founded}', 'hamista-core' ),
			)
		);
		$this->add_control(
			'since',
			array(
				'label'          => __( 'First issue', 'hamista-core' ),
				'type'           => Controls_Manager::DATE_TIME,
				'picker_options' => array( 'enableTime' => false ),
				'default'        => '2000-03-21',
				'description'    => __( 'Counts the issue number (one a day) and the year of publication.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'place',
			array(
				'label'   => __( 'Place', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Tehran', 'hamista-core' ),
			)
		);
		$this->add_control(
			'stamp',
			array(
				'label'       => __( 'Round stamp', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Special edition', 'hamista-core' ),
				'description' => __( 'Leave empty to hide it.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'end_text',
			array(
				'label'   => __( 'Dateline button', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Print edition', 'hamista-core' ),
			)
		);
		$this->add_control(
			'end_link',
			array(
				'label' => __( 'Button link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$since = strtotime( (string) $s['since'] );
		$now   = current_time( 'timestamp' ); // phpcs:ignore WordPress.DateTime.CurrentTimeTimestamp.Requested -- local day count.
		$issue = $since && $since < $now ? (int) floor( ( $now - $since ) / DAY_IN_SECONDS ) + 1 : 1;
		$years = $since && $since < $now ? (int) floor( ( $now - $since ) / ( 365.2425 * DAY_IN_SECONDS ) ) + 1 : 1;
		$vars  = array(
			'{issue}'   => hamista_core_digits( number_format_i18n( $issue ) ),
			'{year}'    => hamista_core_digits( (string) $years ),
			'{founded}' => $since ? hamista_core_digits( wp_date( 'Y', $since ) ) : '',
		);
		$line  = static function ( $text ) use ( $vars ) {
			return esc_html( strtr( (string) $text, $vars ) );
		};

		echo '<header class="hm-mast">';
		echo '<p class="hm-mast__top"><span>' . $line( $s['top_start'] ) . '</span><span>' . $line( $s['top_middle'] ) . '</span><span>' . $line( $s['top_end'] ) . '</span></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in $line.
		echo '<div class="hm-mast__name">';
		if ( $s['stamp'] ) {
			echo '<span class="hm-mast__stamp" aria-hidden="true"><span>' . esc_html( $s['stamp'] ) . '</span></span>';
		}
		echo '<p class="hm-mast__title" data-hm-reveal="up">' . esc_html( $s['title'] ) . '</p>';
		if ( $s['motto'] ) {
			echo '<p class="hm-mast__motto" data-hm-reveal="up" data-hm-delay=".15">' . esc_html( $s['motto'] ) . '</p>';
		}
		echo '</div>';
		echo '<div class="hm-mast__dateline"><span>' . esc_html( $s['place'] ) . '</span><time datetime="' . esc_attr( wp_date( 'Y-m-d' ) ) . '">' . esc_html( hamista_core_digits( wp_date( 'l j F Y' ) ) ) . '</time>';
		if ( $s['end_text'] ) {
			$href = ! empty( $s['end_link']['url'] ) ? $s['end_link']['url'] : '#';
			echo '<a class="hm-mast__btn" href="' . esc_url( $href ) . '">' . esc_html( $s['end_text'] ) . '</a>';
		} else {
			echo '<span></span>';
		}
		echo '</div></header>';
	}
}
