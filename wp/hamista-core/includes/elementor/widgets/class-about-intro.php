<?php
/**
 * About introduction, two compositions:
 *  - mission: a narrow column with the section label, a turning object and
 *             two figures; beside it a statement that lights up word by word,
 *             a tall picture and fold-out cards (mission, vision…) with a
 *             checklist, a person and a button;
 *  - stats:   a stack of figure cards (the middle one in the accent) next to
 *             the title, text, button and a review score with avatars.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * About intro widget.
 */
class About_Intro extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-about-intro';
	}

	/** @return string */
	public function get_title() {
		return __( 'About Introduction', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-info-box';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'about', 'mission', 'vision', 'intro', 'statement', 'figures' );
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
		$mission = array( 'style' => 'mission' );

		$this->start_controls_section( 'section_about', array( 'label' => __( 'About', 'hamista-core' ) ) );
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Composition', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'mission',
				'options' => array(
					'mission' => __( 'Statement, picture and fold-out cards', 'hamista-core' ),
					'stats'   => __( 'Figure cards beside the title', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'eyebrow',
			array(
				'label'   => __( 'Section label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( '*{ 01 }* # About us', 'hamista-core' ),
			)
		);
		$this->add_control(
			'statement',
			array(
				'label'       => __( 'Statement', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 4,
				'default'     => __( 'Akhgar is a creative studio that turns ideas into brands, websites and campaigns people remember.', 'hamista-core' ),
				'description' => __( 'Lights up word by word as it scrolls past. *Asterisks* colour words with the accent.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'text',
			array(
				'label'     => __( 'Text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXTAREA,
				'rows'      => 3,
				'condition' => array( 'style' => 'stats' ),
			)
		);
		$this->add_control(
			'image',
			array(
				'label'     => __( 'Tall picture', 'hamista-core' ),
				'type'      => Controls_Manager::MEDIA,
				'condition' => $mission,
			)
		);
		$this->add_control(
			'shape',
			array(
				'label'       => __( 'Turning object', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'A small object picture (transparent PNG or WebP) that turns slowly as the page scrolls.', 'hamista-core' ),
			)
		);
		$this->add_button_controls(
			'btn',
			__( 'Button', 'hamista-core' ),
			array(
				'text' => __( 'More about us', 'hamista-core' ),
				'url'  => '#',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_figures', array( 'label' => __( 'Figures', 'hamista-core' ) ) );
		$fig = new Repeater();
		$fig->add_control(
			'label',
			array(
				'label'   => __( 'Label', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Client rating', 'hamista-core' ),
			)
		);
		$fig->add_control(
			'value',
			array(
				'label'   => __( 'Figure', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '4.8',
			)
		);
		$fig->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 2,
			)
		);
		$this->add_control(
			'figures',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $fig->get_controls(),
				'title_field' => '{{{ value }}} — {{{ label }}}',
				'default'     => array(
					array(
						'label' => __( 'Client rating', 'hamista-core' ),
						'value' => '4.8',
						'text'  => __( 'From more than two hundred finished projects.', 'hamista-core' ),
					),
					array(
						'label' => __( 'Launches', 'hamista-core' ),
						'value' => '+1K',
						'text'  => __( 'Sites, products and campaigns we have put live.', 'hamista-core' ),
					),
				),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_cards',
			array(
				'label'     => __( 'Fold-out cards', 'hamista-core' ),
				'condition' => $mission,
			)
		);
		$card = new Repeater();
		$card->add_control(
			'icon',
			array(
				'label'   => __( 'Icon', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'target',
				'options' => self::icon_options(),
			)
		);
		$card->add_control(
			'title',
			array(
				'label'   => __( 'Title', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Our mission', 'hamista-core' ),
			)
		);
		$card->add_control(
			'text',
			array(
				'label' => __( 'Text', 'hamista-core' ),
				'type'  => Controls_Manager::TEXTAREA,
				'rows'  => 3,
			)
		);
		$card->add_control(
			'points',
			array(
				'label'       => __( 'Checklist', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 4,
				'description' => __( 'One item per line.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'cards',
			array(
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $card->get_controls(),
				'title_field' => '{{{ title }}}',
				'default'     => array(
					array(
						'icon'   => 'target',
						'title'  => __( 'Our mission', 'hamista-core' ),
						'text'   => __( 'To keep finding fresh ideas and turn them into measurable growth for every client.', 'hamista-core' ),
						'points' => __( "Clear strategy\nHonest reports\nOne team, start to finish\nSupport after launch", 'hamista-core' ),
					),
					array(
						'icon'   => 'eye',
						'title'  => __( 'Our vision', 'hamista-core' ),
						'text'   => __( 'A studio that brands come back to, because the work keeps paying off.', 'hamista-core' ),
						'points' => '',
					),
				),
			)
		);
		$this->add_control(
			'avatars',
			array(
				'label' => __( 'Avatars', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->add_control(
			'person',
			array(
				'label'   => __( 'Name', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Sara Ahmadi', 'hamista-core' ),
			)
		);
		$this->add_control(
			'role',
			array(
				'label'   => __( 'Role', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Founder and creative director', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_rating',
			array(
				'label'     => __( 'Review score', 'hamista-core' ),
				'condition' => array( 'style' => 'stats' ),
			)
		);
		$this->add_control(
			'score',
			array(
				'label'   => __( 'Score', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '4.9/5',
			)
		);
		$this->add_control(
			'score_text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'The average score our clients give us.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'score_avatars',
			array(
				'label' => __( 'Avatars', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$style = 'stats' === $s['style'] ? 'stats' : 'mission';
		$shape = ! empty( $s['shape']['url'] ) ? '<span class="hm-ab__shape" data-hm-ab-turn>' . hamista_core_image( $s['shape'], 'medium' ) . '</span>' : '';
		echo '<div class="hm-ab hm-ab--' . esc_attr( $style ) . '" data-hm-widget="about-intro">';

		if ( 'mission' === $style ) {
			echo '<aside class="hm-ab__aside">';
			if ( $s['eyebrow'] ) {
				echo '<p class="hm-eyebrow" data-hm-reveal="up">' . hamista_core_highlight( $s['eyebrow'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo $shape; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<dl class="hm-ab__figs">';
			foreach ( (array) $s['figures'] as $fig ) {
				echo '<div class="hm-ab__fig" data-hm-reveal="up"><dt>' . esc_html( $fig['label'] ) . '<i aria-hidden="true"></i></dt><dd><b class="hm-num">' . esc_html( hamista_core_digits( $fig['value'] ) ) . '</b>';
				if ( $fig['text'] ) {
					echo '<span>' . esc_html( $fig['text'] ) . '</span>';
				}
				echo '</dd></div>';
			}
			echo '</dl></aside>';

			echo '<div class="hm-ab__main">';
			echo '<div class="hm-scrubtext hm-scrubtext--md" data-hm-widget="scrubtext"><p class="hm-scrubtext__text">' . hamista_core_highlight( $s['statement'] ) . '</p></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ab__body">';
			echo '<div class="hm-ab__picture" data-hm-reveal="clip-up">' . hamista_core_image( $s['image'], 'large' ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ab__cards">';
			foreach ( array_values( (array) $s['cards'] ) as $i => $card ) {
				$open = 0 === $i;
				echo '<details class="hm-ab__card"' . ( $open ? ' open' : '' ) . ' data-hm-reveal="up"><summary><span class="hm-ab__icon">' . hamista_core_icon( $card['icon'] ) . '</span><span class="hm-ab__card-title">' . esc_html( $card['title'] ) . '</span></summary><div class="hm-ab__card-body">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				if ( $card['text'] ) {
					echo '<p>' . esc_html( $card['text'] ) . '</p>';
				}
				$points = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $card['points'] ) ) );
				if ( $points ) {
					echo '<ul class="hm-ab__points">';
					foreach ( $points as $point ) {
						echo '<li>' . hamista_core_icon( 'check' ) . esc_html( $point ) . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
					echo '</ul>';
				}
				echo '</div></details>';
			}
			echo '<div class="hm-ab__foot" data-hm-reveal="up">';
			echo '<div class="hm-ab__person">' . Proof::avatars( $s['avatars'] ) . '<span><b>' . esc_html( $s['person'] ) . '</b><small>' . esc_html( $s['role'] ) . '</small></span></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $this->render_button( $s, 'btn' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div></div></div></div>';
		} else {
			echo '<div class="hm-ab__stack" data-hm-stagger="0.12">';
			foreach ( array_values( (array) $s['figures'] ) as $i => $fig ) {
				echo '<div class="hm-ab__stat' . ( 1 === $i ? ' is-accent' : '' ) . '" data-hm-reveal="up"><div class="hm-ab__stat-head"><b class="hm-num">' . esc_html( hamista_core_digits( $fig['value'] ) ) . '</b><span>' . esc_html( $fig['label'] ) . '</span></div>';
				if ( $fig['text'] ) {
					echo '<p>' . esc_html( $fig['text'] ) . '</p>';
				}
				echo '</div>';
			}
			echo '</div><div class="hm-ab__copy">';
			if ( $s['eyebrow'] ) {
				echo '<p class="hm-eyebrow" data-hm-reveal="up">' . hamista_core_highlight( $s['eyebrow'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '<div class="hm-scrubtext hm-scrubtext--md" data-hm-widget="scrubtext"><h2 class="hm-scrubtext__text">' . hamista_core_highlight( $s['statement'] ) . '</h2></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $s['text'] ) {
				echo '<p class="hm-ab__text" data-hm-reveal="up">' . esc_html( $s['text'] ) . '</p>';
			}
			echo $this->render_button( $s, 'btn' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ab__score" data-hm-reveal="up"><b class="hm-num">' . esc_html( hamista_core_digits( $s['score'] ) ) . hamista_core_icon( 'star' ) . '</b><p>' . esc_html( $s['score_text'] ) . '</p>' . Proof::avatars( $s['score_avatars'], true ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div>' . $shape; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</div>';
	}
}
