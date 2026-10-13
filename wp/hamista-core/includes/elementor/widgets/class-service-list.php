<?php
/**
 * Service list, three looks:
 *  - stagger:  large names in rounded rows that step inwards, each with its
 *              tags; rows brighten as they scroll into place, and the
 *              picture of the row under the pointer floats beside it;
 *  - panels:   a row of tall cards; the open one widens to show its text,
 *              tags and picture (hover or tap opens another);
 *  - numbered: picture and numbered description side by side, with a
 *              timeline line and a button.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Service list widget.
 */
class Service_List extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-service-list';
	}

	/** @return string */
	public function get_title() {
		return __( 'Service List', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-bullet-list';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'services', 'list', 'offer', 'agency', 'tags', 'panels' );
	}

	/** @return array */
	public function get_script_depends() {
		return array( 'hamista-motion', 'hamista-agency' );
	}

	/** @return array */
	public function get_style_depends() {
		return array( 'hamista-widgets', 'hamista-agency' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->start_controls_section( 'section_services', array( 'label' => __( 'Services', 'hamista-core' ) ) );
		$r = new Repeater();
		$r->add_control(
			'title',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Web design', 'hamista-core' ),
			)
		);
		$r->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 3,
			)
		);
		$r->add_control(
			'tags',
			array(
				'label'       => __( 'Tags', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'description' => __( 'Separate with commas.', 'hamista-core' ),
				'default'     => __( 'UI design, Responsive, Visual identity', 'hamista-core' ),
			)
		);
		$r->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'palette',
				'options' => self::icon_options(),
			)
		);
		$r->add_control(
			'image',
			array(
				'label' => __( 'Picture', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$r->add_control(
			'meta_label',
			array(
				'label' => __( 'Detail label', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$r->add_control(
			'meta_value',
			array(
				'label' => __( 'Detail', 'hamista-core' ),
				'type'  => Controls_Manager::TEXT,
			)
		);
		$r->add_control(
			'link',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'items',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'title' => __( 'Web design', 'hamista-core' ),
						'tags'  => __( 'UI design, Responsive, Visual identity', 'hamista-core' ),
					),
					array(
						'title' => __( 'Digital marketing', 'hamista-core' ),
						'tags'  => __( 'Brand strategy, SEO, Paid ads', 'hamista-core' ),
						'icon'  => 'megaphone',
					),
					array(
						'title' => __( 'Brand strategy', 'hamista-core' ),
						'tags'  => __( 'Positioning, Naming, Logo', 'hamista-core' ),
						'icon'  => 'target',
					),
					array(
						'title' => __( 'Motion and 3D', 'hamista-core' ),
						'tags'  => __( 'Product film, 3D models', 'hamista-core' ),
						'icon'  => 'cube',
					),
				),
			)
		);
		$this->add_control(
			'look',
			array(
				'label'   => __( 'Look', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'stagger',
				'options' => array(
					'stagger'  => __( 'Large names stepping inwards', 'hamista-core' ),
					'panels'   => __( 'Cards that widen open', 'hamista-core' ),
					'numbered' => __( 'Picture beside a numbered description', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'btn_text',
			array(
				'label'     => __( 'Button text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'See details', 'hamista-core' ),
				'condition' => array( 'look' => 'numbered' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Tag pills.
	 *
	 * @param string $tags Comma list.
	 * @return string
	 */
	private static function tags( $tags ) {
		$list = array_filter( array_map( 'trim', preg_split( '/[,،]/u', (string) $tags ) ) );
		if ( ! $list ) {
			return '';
		}
		$html = '<ul class="hm-sl__tags">';
		foreach ( $list as $tag ) {
			$html .= '<li>' . esc_html( $tag ) . '</li>';
		}
		return $html . '</ul>';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$look  = in_array( $s['look'], array( 'stagger', 'panels', 'numbered' ), true ) ? $s['look'] : 'stagger';
		$items = array_values( (array) $s['items'] );
		echo '<div class="hm-sl hm-sl--' . esc_attr( $look ) . '" data-hm-widget="service-list"' . ( 'stagger' === $look ? '' : ' data-hm-stagger="0.1"' ) . '>';
		foreach ( $items as $i => $item ) {
			$url   = ! empty( $item['link']['url'] ) ? $item['link']['url'] : '';
			$title = esc_html( $item['title'] );
			$img   = ! empty( $item['image']['url'] ) ? hamista_core_image( $item['image'], 'stagger' === $look ? 'medium' : 'medium_large', array( 'class' => 'hm-sl__img' ) ) : '';
			if ( 'stagger' === $look ) {
				printf( '<div class="hm-sl__row" style="--i:%d">', (int) $i );
				echo $url ? '<a class="hm-sl__name" href="' . esc_url( $url ) . '">' . $title . '</a>' : '<span class="hm-sl__name">' . $title . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo self::tags( $item['tags'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( $img ) {
					echo '<span class="hm-sl__float" aria-hidden="true">' . $img . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div>';
			} elseif ( 'panels' === $look ) {
				printf( '<article class="hm-sl__panel%s" tabindex="0" data-hm-reveal="up">', 1 === $i ? ' is-open' : '' );
				echo '<span class="hm-sl__icon">' . hamista_core_icon( $item['icon'] ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-sl__panel-body"><h3 class="hm-sl__panel-title">' . $title . '</h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-sl__more">';
				if ( $item['text'] ) {
					echo '<p>' . esc_html( $item['text'] ) . '</p>';
				}
				echo self::tags( $item['tags'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( $url ) {
					echo '<a class="hm-sl__go" href="' . esc_url( $url ) . '" aria-label="' . esc_attr( $item['title'] ) . '">' . hamista_core_icon( 'arrow-out' ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></div>';
				if ( $img ) {
					echo '<span class="hm-sl__panel-img">' . $img . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</article>';
			} else {
				echo '<article class="hm-sl__item" data-hm-reveal="up">';
				echo '<div class="hm-sl__media">' . $img . self::tags( $item['tags'] ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<div class="hm-sl__copy"><span class="hm-sl__num hm-num">' . esc_html( self::pad_number( $i + 1 ) ) . '</span><h3 class="hm-sl__item-title">' . $title . '</h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( $item['text'] ) {
					echo '<p>' . esc_html( $item['text'] ) . '</p>';
				}
				if ( $item['meta_label'] || $item['meta_value'] ) {
					echo '<p class="hm-sl__meta"><span>' . esc_html( $item['meta_label'] ) . '</span><b class="hm-num">' . esc_html( hamista_core_digits( $item['meta_value'] ) ) . '</b></p>';
				}
				if ( $url && $s['btn_text'] ) {
					echo self::button_html( $s['btn_text'], $item['link'], 'primary', array( 'size' => 'sm' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '</div></article>';
			}
		}
		echo '</div>';
	}
}
