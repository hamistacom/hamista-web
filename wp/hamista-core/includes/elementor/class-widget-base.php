<?php
/**
 * Base class for Hamista widgets: category, assets, and shared controls
 * (section header, buttons, colour scheme, spacing) with matching renderers.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;

defined( 'ABSPATH' ) || exit;

/**
 * Widget base.
 */
abstract class Widget_Base extends \Elementor\Widget_Base {

	/**
	 * Panel category.
	 *
	 * @return array
	 */
	public function get_categories() {
		return array( 'hamista' );
	}

	/**
	 * Engine script.
	 *
	 * @return array
	 */
	public function get_script_depends() {
		return array( 'hamista-motion' );
	}

	/**
	 * Widget styles.
	 *
	 * @return array
	 */
	public function get_style_depends() {
		return array( 'hamista-widgets' );
	}

	/**
	 * Search keywords.
	 *
	 * @return array
	 */
	public function get_keywords() {
		return array( 'hamista' );
	}

	/**
	 * Output is static for a given set of settings, so Elementor may cache it.
	 *
	 * @return bool
	 */
	protected function is_dynamic_content(): bool {
		return false;
	}

	/**
	 * No extra .elementor-widget-container wrapper (lighter DOM).
	 *
	 * @return bool
	 */
	public function has_widget_inner_wrapper(): bool {
		return false;
	}

	/* ------------------------------------------------------------------ */
	/* Shared controls                                                    */
	/* ------------------------------------------------------------------ */

	/**
	 * Eyebrow, title, description, tag, alignment.
	 *
	 * @param array $defaults Defaults: eyebrow, title, desc, tag, align, size.
	 * @param bool  $section  Open its own controls section.
	 */
	protected function add_header_controls( $defaults = array(), $section = true ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'eyebrow' => '',
				'title'   => '',
				'desc'    => '',
				'tag'     => 'h2',
				'align'   => 'start',
				'size'    => 'lg',
			)
		);

		if ( $section ) {
			$this->start_controls_section(
				'section_header',
				array( 'label' => __( 'Heading', 'hamista-core' ) )
			);
		}

		$this->add_control(
			'eyebrow',
			array(
				'label'       => __( 'Eyebrow', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => $defaults['eyebrow'],
				'label_block' => true,
				'dynamic'     => array( 'active' => true ),
			)
		);
		$this->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 2,
				'default'     => $defaults['title'],
				'description' => __( 'Wrap words in *asterisks* to highlight them. Line breaks are kept.', 'hamista-core' ),
				'dynamic'     => array( 'active' => true ),
			)
		);
		$this->add_control(
			'desc',
			array(
				'label'   => __( 'Description', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 3,
				'default' => $defaults['desc'],
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->add_control(
			'title_tag',
			array(
				'label'   => __( 'Title tag', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['tag'],
				'options' => array(
					'h1'  => 'H1',
					'h2'  => 'H2',
					'h3'  => 'H3',
					'h4'  => 'H4',
					'div' => 'div',
					'p'   => 'p',
				),
			)
		);
		$this->add_control(
			'title_size',
			array(
				'label'   => __( 'Title size', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['size'],
				'options' => array(
					'xxl' => __( 'Giant', 'hamista-core' ),
					'xl'  => __( 'Display', 'hamista-core' ),
					'lg'  => __( 'Large', 'hamista-core' ),
					'md'  => __( 'Medium', 'hamista-core' ),
					'sm'  => __( 'Small', 'hamista-core' ),
				),
			)
		);
		$this->add_responsive_control(
			'header_align',
			array(
				'label'   => __( 'Alignment', 'hamista-core' ),
				'type'    => Controls_Manager::CHOOSE,
				'default' => $defaults['align'],
				'options' => array(
					'start'  => array(
						'title' => __( 'Start', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-text-align-right' : 'eicon-text-align-left',
					),
					'center' => array(
						'title' => __( 'Center', 'hamista-core' ),
						'icon'  => 'eicon-text-align-center',
					),
					'end'    => array(
						'title' => __( 'End', 'hamista-core' ),
						'icon'  => is_rtl() ? 'eicon-text-align-left' : 'eicon-text-align-right',
					),
				),
			)
		);
		$this->add_control(
			'title_reveal',
			array(
				'label'   => __( 'Title animation', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'words',
				'options' => array(
					'words' => __( 'Words rise', 'hamista-core' ),
					'up'    => __( 'Rise', 'hamista-core' ),
					'blur'  => __( 'Blur in', 'hamista-core' ),
					'fade'  => __( 'Fade', 'hamista-core' ),
					'none'  => __( 'None', 'hamista-core' ),
				),
			)
		);

		if ( $section ) {
			$this->end_controls_section();
		}
	}

	/**
	 * Style controls for the header (title/desc colours and typography).
	 */
	protected function add_header_style_controls() {
		$this->start_controls_section(
			'section_header_style',
			array(
				'label' => __( 'Heading', 'hamista-core' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);
		$this->add_control(
			'title_color',
			array(
				'label'     => __( 'Title color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-head__title' => 'color: {{VALUE}};' ),
			)
		);
		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'title_typography',
				'selector' => '{{WRAPPER}} .hm-head__title',
			)
		);
		$this->add_control(
			'highlight_color',
			array(
				'label'     => __( 'Highlight color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-hl' => 'color: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'desc_color',
			array(
				'label'     => __( 'Description color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-head__desc' => 'color: {{VALUE}};' ),
			)
		);
		$this->add_responsive_control(
			'header_width',
			array(
				'label'      => __( 'Max width', 'hamista-core' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', 'ch', '%' ),
				'range'      => array(
					'px' => array(
						'min' => 300,
						'max' => 1400,
					),
					'ch' => array(
						'min' => 10,
						'max' => 80,
					),
				),
				'selectors'  => array( '{{WRAPPER}} .hm-head' => 'max-width: {{SIZE}}{{UNIT}};' ),
			)
		);
		$this->add_responsive_control(
			'header_gap',
			array(
				'label'     => __( 'Space below heading', 'hamista-core' ),
				'type'      => Controls_Manager::SLIDER,
				'range'     => array(
					'px' => array(
						'min' => 0,
						'max' => 160,
					),
				),
				'selectors' => array( '{{WRAPPER}}' => '--hm-head-gap: {{SIZE}}px;' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render the eyebrow/title/description block.
	 *
	 * @param array  $s     Settings.
	 * @param string $class Extra class.
	 * @return string
	 */
	protected function render_header( $s, $class = '' ) {
		if ( empty( $s['eyebrow'] ) && empty( $s['title'] ) && empty( $s['desc'] ) ) {
			return '';
		}
		$align  = ! empty( $s['header_align'] ) ? $s['header_align'] : 'start';
		$tag    = in_array( $s['title_tag'] ?? 'h2', array( 'h1', 'h2', 'h3', 'h4', 'div', 'p' ), true ) ? $s['title_tag'] : 'h2';
		$size   = ! empty( $s['title_size'] ) ? $s['title_size'] : 'lg';
		$reveal = ! empty( $s['title_reveal'] ) ? $s['title_reveal'] : 'words';
		$html   = '<header class="hm-head hm-head--' . esc_attr( $align ) . ' ' . esc_attr( $class ) . '">';

		if ( ! empty( $s['eyebrow'] ) ) {
			$html .= '<p class="hm-eyebrow" data-hm-reveal="up">' . esc_html( $s['eyebrow'] ) . '</p>';
		}
		if ( ! empty( $s['title'] ) ) {
			$html .= sprintf(
				'<%1$s class="hm-head__title hm-title hm-title--%2$s"%3$s>%4$s</%1$s>',
				$tag,
				esc_attr( $size ),
				'none' === $reveal ? '' : ' data-hm-reveal="' . esc_attr( $reveal ) . '" data-hm-delay="0.05"',
				isset( $s['title_html'] ) ? $s['title_html'] : hamista_core_highlight( $s['title'] )
			);
		}
		if ( ! empty( $s['desc'] ) ) {
			$html .= '<div class="hm-head__desc" data-hm-reveal="up" data-hm-delay="0.15">' . wp_kses_post( wpautop( $s['desc'] ) ) . '</div>';
		}
		return $html . '</header>';
	}

	/**
	 * Button controls with a prefix (e.g. btn1, btn2).
	 *
	 * @param string $prefix   Control prefix.
	 * @param string $label    Heading label.
	 * @param array  $defaults text, style.
	 */
	protected function add_button_controls( $prefix, $label, $defaults = array() ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'text'  => '',
				'style' => 'primary',
				'url'   => '#',
			)
		);
		$this->add_control(
			$prefix . '_heading',
			array(
				'label'     => $label,
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
			)
		);
		$this->add_control(
			$prefix . '_text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => $defaults['text'],
				'dynamic' => array( 'active' => true ),
			)
		);
		$this->add_control(
			$prefix . '_link',
			array(
				'label'     => __( 'Link', 'hamista-core' ),
				'type'      => Controls_Manager::URL,
				'default'   => array( 'url' => $defaults['url'] ),
				'dynamic'   => array( 'active' => true ),
				'condition' => array( $prefix . '_text!' => '' ),
			)
		);
		$this->add_control(
			$prefix . '_style',
			array(
				'label'     => __( 'Style', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => $defaults['style'],
				'options'   => self::button_styles(),
				'condition' => array( $prefix . '_text!' => '' ),
			)
		);
	}

	/**
	 * Button style choices.
	 *
	 * @return array
	 */
	protected static function button_styles() {
		return array(
			'primary'   => __( 'Primary', 'hamista-core' ),
			'secondary' => __( 'Secondary', 'hamista-core' ),
			'ghost'     => __( 'Ghost', 'hamista-core' ),
			'inverse'   => __( 'Inverse', 'hamista-core' ),
			'orb'       => __( 'Round, metallic ring', 'hamista-core' ),
			'link'      => __( 'Text link', 'hamista-core' ),
		);
	}

	/**
	 * Render a button from prefixed settings.
	 *
	 * @param array  $s      Settings.
	 * @param string $prefix Prefix.
	 * @param array  $args   size, class, icon (bool).
	 * @return string
	 */
	protected function render_button( $s, $prefix, $args = array() ) {
		if ( empty( $s[ $prefix . '_text' ] ) ) {
			return '';
		}
		$args  = wp_parse_args(
			$args,
			array(
				'size'  => '',
				'class' => '',
				'icon'  => true,
			)
		);
		$style = $s[ $prefix . '_style' ] ?? 'primary';
		$link  = $s[ $prefix . '_link' ] ?? array();
		return self::button_html( $s[ $prefix . '_text' ], $link, $style, $args );
	}

	/**
	 * Button markup.
	 *
	 * @param string $text  Text.
	 * @param array  $link  Elementor URL array.
	 * @param string $style Style.
	 * @param array  $args  size, class, icon.
	 * @return string
	 */
	public static function button_html( $text, $link, $style = 'primary', $args = array() ) {
		$classes = array( 'hm-btn' );
		if ( 'link' === $style ) {
			$classes = array( 'hm-link-btn' );
		} elseif ( 'primary' !== $style ) {
			$classes[] = 'hm-btn--' . sanitize_html_class( $style );
		}
		if ( ! empty( $args['size'] ) ) {
			$classes[] = 'hm-btn--' . sanitize_html_class( $args['size'] );
		}
		if ( ! empty( $args['class'] ) ) {
			$classes[] = $args['class'];
		}
		if ( 'link' !== $style && hamista_core_option( 'magnetic' ) ) {
			$classes[] = 'hm-btn--magnetic';
		}
		$url   = ! empty( $link['url'] ) ? $link['url'] : '#';
		$attrs = ' href="' . esc_url( $url ) . '"';
		if ( ! empty( $link['is_external'] ) ) {
			$attrs .= ' target="_blank"';
		}
		$rel = array();
		if ( ! empty( $link['nofollow'] ) ) {
			$rel[] = 'nofollow';
		}
		if ( ! empty( $link['is_external'] ) ) {
			$rel[] = 'noopener';
		}
		if ( $rel ) {
			$attrs .= ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"';
		}
		$icon = ( ! isset( $args['icon'] ) || $args['icon'] ) ? hamista_core_icon( 'arrow', array( 'class' => 'hm-i-arrow' ) ) : '';
		return '<a class="' . esc_attr( implode( ' ', $classes ) ) . '"' . $attrs . '><span>' . esc_html( $text ) . '</span>' . $icon . '</a>';
	}

	/**
	 * Colour scheme + vertical spacing controls (in a "Section" panel).
	 *
	 * @param array $defaults scheme, space, width.
	 */
	protected function add_section_controls( $defaults = array() ) {
		$defaults = wp_parse_args(
			$defaults,
			array(
				'scheme' => '',
				'space'  => 'md',
				'width'  => 'container',
			)
		);
		$this->start_controls_section(
			'section_layout_hm',
			array( 'label' => __( 'Section', 'hamista-core' ) )
		);
		$this->add_control(
			'scheme',
			array(
				'label'   => __( 'Colour scheme', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['scheme'],
				'options' => array(
					''        => __( 'Page colours', 'hamista-core' ),
					'surface' => __( 'Soft surface', 'hamista-core' ),
					'inverse' => __( 'Inverted (dark slab)', 'hamista-core' ),
					'accent'  => __( 'Accent', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'space',
			array(
				'label'   => __( 'Vertical spacing', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['space'],
				'options' => array(
					'none' => __( 'None', 'hamista-core' ),
					'sm'   => __( 'Small', 'hamista-core' ),
					'md'   => __( 'Medium', 'hamista-core' ),
					'lg'   => __( 'Large', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'inner_width',
			array(
				'label'   => __( 'Content width', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => $defaults['width'],
				'options' => array(
					'container' => __( 'Site container', 'hamista-core' ),
					'narrow'    => __( 'Narrow', 'hamista-core' ),
					'full'      => __( 'Full width', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'accent_override',
			array(
				'label'     => __( 'Accent color', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}}' => '--hm-accent: {{VALUE}}; --hm-accent-ink: {{VALUE}};' ),
			)
		);
		$this->add_control(
			'bg_override',
			array(
				'label'     => __( 'Background', 'hamista-core' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array( '{{WRAPPER}} .hm-sec' => 'background-color: {{VALUE}};' ),
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Classes for the outer <section>.
	 *
	 * @param array  $s    Settings.
	 * @param string $base Widget base class.
	 * @return string
	 */
	protected function section_class( $s, $base ) {
		$classes = array( 'hm-sec', $base );
		if ( ! empty( $s['scheme'] ) ) {
			$classes[] = 'hm-scheme-' . $s['scheme'];
		}
		$classes[] = 'hm-space-' . ( ! empty( $s['space'] ) ? $s['space'] : 'md' );
		return implode( ' ', array_map( 'sanitize_html_class', $classes ) );
	}

	/**
	 * Inner wrapper class from the content width setting.
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	protected function inner_class( $s ) {
		$width = $s['inner_width'] ?? 'container';
		if ( 'full' === $width ) {
			return 'hm-inner--full';
		}
		return 'narrow' === $width ? 'hm-container--narrow' : 'hm-container';
	}

	/**
	 * Icon choices for SELECT controls.
	 *
	 * @return array
	 */
	protected static function icon_options() {
		$options = array( '' => __( 'None', 'hamista-core' ) );
		foreach ( \Hamista\Core\Icons::choices() as $name ) {
			$options[ $name ] = $name;
		}
		return $options;
	}

	/**
	 * Two-digit index label (01, 02…), in Persian digits on Persian sites.
	 *
	 * @param int $i Zero-based index.
	 * @return string
	 */
	protected static function index_label( $i ) {
		return self::pad_number( $i + 1 );
	}

	/**
	 * A number padded to two digits, in Persian digits on Persian sites.
	 *
	 * @param int $n Number.
	 * @return string
	 */
	protected static function pad_number( $n ) {
		return hamista_core_digits( str_pad( (string) $n, 2, '0', STR_PAD_LEFT ) );
	}
}
