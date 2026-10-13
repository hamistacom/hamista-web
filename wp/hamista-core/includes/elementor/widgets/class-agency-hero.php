<?php
/**
 * Agency hero, three compositions:
 *  - panel:    a dark rounded panel; text and a turning social ring on one side,
 *              a portrait behind a running vertical strip in the middle, the
 *              title, a short film and the rating on the other side;
 *  - wordmark: the brand name set huge along the bottom, a title above, two
 *              round pictures, a strip of client logos, a "start a project"
 *              card and a "liked by" line;
 *  - marquee:  a large picture in the middle with a giant line of text running
 *              across it (the text inverts where it crosses the picture), a
 *              short film card and a tilted card floating at the edge.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Agency hero widget.
 */
class Agency_Hero extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-agency-hero';
	}

	/** @return string */
	public function get_title() {
		return __( 'Agency Hero', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-header';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'hero', 'agency', 'studio', 'wordmark', 'marquee', 'header', 'banner' );
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
		$panel    = array( 'style' => 'panel' );
		$wordmark = array( 'style' => 'wordmark' );
		$marquee  = array( 'style' => 'marquee' );

		$this->start_controls_section( 'section_hero', array( 'label' => __( 'Hero', 'hamista-core' ) ) );
		$this->add_control(
			'style',
			array(
				'label'   => __( 'Composition', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'panel',
				'options' => array(
					'panel'    => __( 'Dark panel: portrait, vertical strip, social ring', 'hamista-core' ),
					'wordmark' => __( 'Giant brand name along the bottom', 'hamista-core' ),
					'marquee'  => __( 'Giant running text over a large picture', 'hamista-core' ),
				),
			)
		);
		$this->add_control(
			'status',
			array(
				'label'       => __( 'Status line', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Taking new projects', 'hamista-core' ),
				'description' => __( 'A small pill with a pulsing dot at the top. Leave empty to hide it.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'eyebrow',
			array(
				'label'     => __( 'Line above the title', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( '{ Best studio of the year 1404 }', 'hamista-core' ),
				'condition' => $panel,
			)
		);
		$this->add_control(
			'title',
			array(
				'label'       => __( 'Title', 'hamista-core' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 2,
				'default'     => __( "Ideas that\n*sell*", 'hamista-core' ),
				'description' => __( 'Wrap words in *asterisks* to make them glow in one by one.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'desc',
			array(
				'label'   => __( 'Short text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXTAREA,
				'rows'    => 3,
				'default' => __( 'Brand, website and campaigns from one team; built to grow the business.', 'hamista-core' ),
			)
		);
		$this->add_button_controls(
			'btn',
			__( 'Button', 'hamista-core' ),
			array(
				'text' => __( 'About us', 'hamista-core' ),
				'url'  => '#',
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_media', array( 'label' => __( 'Pictures and film', 'hamista-core' ) ) );
		$this->add_control(
			'image',
			array(
				'label'       => __( 'Main picture', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'Panel: a portrait (about 660×800). Wordmark: the first round picture. Running text: a large picture (about 1000×870).', 'hamista-core' ),
			)
		);
		$this->add_control(
			'image2',
			array(
				'label'       => __( 'Second picture', 'hamista-core' ),
				'type'        => Controls_Manager::MEDIA,
				'description' => __( 'Wordmark: the second round picture and the picture beside the card. Running text: the tilted card at the edge.', 'hamista-core' ),
				'condition'   => array( 'style!' => 'panel' ),
			)
		);
		$this->add_control(
			'loop',
			array(
				'label'       => __( 'Short silent loop (MP4)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'description' => __( 'Plays in the small film card while it is on screen. Leave empty to show the still.', 'hamista-core' ),
			)
		);
		$this->add_control(
			'poster',
			array(
				'label' => __( 'Film still', 'hamista-core' ),
				'type'  => Controls_Manager::MEDIA,
			)
		);
		$this->add_control(
			'film',
			array(
				'label'       => __( 'Full film (opens in a window)', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'description' => __( 'An MP4 file, or an Aparat or YouTube link.', 'hamista-core' ),
			)
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'section_panel',
			array(
				'label'     => __( 'Strip, ring and logos', 'hamista-core' ),
				'condition' => array( 'style!' => 'marquee' ),
			)
		);
		$strip = new Repeater();
		$strip->add_control(
			'text',
			array(
				'label'   => __( 'Text', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Web design', 'hamista-core' ),
			)
		);
		$this->add_control(
			'strip',
			array(
				'label'       => __( 'Vertical strip', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $strip->get_controls(),
				'title_field' => '{{{ text }}}',
				'default'     => array(
					array( 'text' => __( 'Web design', 'hamista-core' ) ),
					array( 'text' => __( 'Branding', 'hamista-core' ) ),
					array( 'text' => __( 'SEO', 'hamista-core' ) ),
					array( 'text' => __( 'Development', 'hamista-core' ) ),
				),
				'condition'   => $panel,
			)
		);
		$net = new Repeater();
		$net->add_control(
			'network',
			array(
				'label'   => __( 'Network', 'hamista-core' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'instagram',
				'options' => array(
					'instagram' => __( 'Instagram', 'hamista-core' ),
					'telegram'  => __( 'Telegram', 'hamista-core' ),
					'whatsapp'  => __( 'WhatsApp', 'hamista-core' ),
					'linkedin'  => __( 'LinkedIn', 'hamista-core' ),
					'x'         => __( 'X', 'hamista-core' ),
					'youtube'   => __( 'YouTube', 'hamista-core' ),
				),
			)
		);
		$net->add_control(
			'url',
			array(
				'label' => __( 'Link', 'hamista-core' ),
				'type'  => Controls_Manager::URL,
			)
		);
		$this->add_control(
			'socials',
			array(
				'label'       => __( 'Social ring', 'hamista-core' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $net->get_controls(),
				'title_field' => '{{{ network }}}',
				'default'     => array(
					array( 'network' => 'instagram' ),
					array( 'network' => 'telegram' ),
					array( 'network' => 'linkedin' ),
					array( 'network' => 'x' ),
					array( 'network' => 'whatsapp' ),
				),
				'condition'   => $panel,
			)
		);
		$this->add_control(
			'brand_title',
			array(
				'label'     => __( 'Line above the logos', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( '*#1* most recommended digital studio', 'hamista-core' ),
				'condition' => $panel,
			)
		);
		$this->add_control(
			'logos',
			array(
				'label' => __( 'Client logos', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->end_controls_section();

		$this->start_controls_section( 'section_proof', array( 'label' => __( 'Rating and wordmark', 'hamista-core' ) ) );
		$this->add_control(
			'avatars',
			array(
				'label' => __( 'Avatars', 'hamista-core' ),
				'type'  => Controls_Manager::GALLERY,
			)
		);
		$this->add_control(
			'score',
			array(
				'label'     => __( 'Score', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => '4.8',
				'condition' => $panel,
			)
		);
		$this->add_control(
			'proof_note',
			array(
				'label'   => __( 'Rating line', 'hamista-core' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Based on 204 reviews', 'hamista-core' ),
			)
		);
		$this->add_control(
			'big',
			array(
				'label'       => __( 'Giant text', 'hamista-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'Akh*g*ar', 'hamista-core' ),
				'description' => __( 'The brand name, or a short line for the running text. Wrap a part in *asterisks* for the accent colour.', 'hamista-core' ),
				'label_block' => true,
				'condition'   => array( 'style!' => 'panel' ),
			)
		);
		$this->add_control(
			'card_title',
			array(
				'label'     => __( 'Card title', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Start a project', 'hamista-core' ),
				'condition' => $wordmark,
			)
		);
		$this->add_control(
			'card_text',
			array(
				'label'     => __( 'Card text', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Book a call and talk it through with a project lead.', 'hamista-core' ),
				'condition' => $wordmark,
			)
		);
		$this->add_control(
			'card_btn',
			array(
				'label'     => __( 'Card button', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Book a call', 'hamista-core' ),
				'condition' => $wordmark,
			)
		);
		$this->add_control(
			'card_link',
			array(
				'label'     => __( 'Card link', 'hamista-core' ),
				'type'      => Controls_Manager::URL,
				'condition' => $wordmark,
			)
		);
		$this->add_control(
			'liked',
			array(
				'label'     => __( 'Line beside the avatars', 'hamista-core' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => __( 'Chosen by 45+ founders', 'hamista-core' ),
				'condition' => $wordmark,
			)
		);
		$this->add_control(
			'height',
			array(
				'label'     => __( 'Height', 'hamista-core' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'screen',
				'options'   => array(
					'screen'  => __( 'Full screen', 'hamista-core' ),
					'compact' => __( 'Compact', 'hamista-core' ),
				),
				'separator' => 'before',
			)
		);
		$this->end_controls_section();
	}

	/**
	 * Small film card.
	 *
	 * @param array  $s     Settings.
	 * @param string $class Extra class.
	 * @return string
	 */
	private function film_card( $s, $class ) {
		$poster = hamista_core_image( $s['poster'], 'medium', array( 'class' => 'hm-ah__film-img' ) );
		$loop   = ! empty( $s['loop'] ) ? '<video class="hm-vid__loop" data-hm-loop="' . esc_url( $s['loop'] ) . '" muted loop playsinline preload="none" aria-hidden="true"></video>' : '';
		$play   = '';
		if ( ! empty( $s['film'] ) ) {
			$play = '<button type="button" class="hm-ah__film-play" data-hm-film="' . esc_url( $s['film'] ) . '" aria-label="' . esc_attr__( 'Watch the film', 'hamista-core' ) . '">' . hamista_core_icon( 'play' ) . '</button>';
		}
		return '<div class="hm-ah__film ' . esc_attr( $class ) . '">' . $poster . $loop . $play . '</div>';
	}

	/**
	 * Logo row.
	 *
	 * @param array $logos Gallery.
	 * @return string
	 */
	private static function logos( $logos ) {
		$html = '';
		foreach ( (array) $logos as $logo ) {
			$html .= '<span class="hm-ah__logo">' . hamista_core_image( $logo, 'medium', array( 'class' => 'hm-ah__logo-img' ) ) . '</span>';
		}
		return $html;
	}

	/**
	 * Status pill.
	 *
	 * @param array $s Settings.
	 * @return string
	 */
	private static function status( $s ) {
		return $s['status'] ? '<p class="hm-ah__status"><i aria-hidden="true"></i>' . esc_html( $s['status'] ) . '</p>' : '';
	}

	/**
	 * Render.
	 */
	protected function render() {
		$s     = $this->get_settings_for_display();
		$style = in_array( $s['style'], array( 'panel', 'wordmark', 'marquee' ), true ) ? $s['style'] : 'panel';
		$title = '<h1 class="hm-ah__title" data-hm-reveal="words">' . hamista_core_highlight( $s['title'] ) . '</h1>';
		$desc  = $s['desc'] ? '<p class="hm-ah__desc" data-hm-reveal="up" data-hm-delay=".2">' . esc_html( $s['desc'] ) . '</p>' : '';
		$btn   = $this->render_button( $s, 'btn', array( 'class' => 'hm-ah__btn' ) );

		printf( '<section class="hm-ah hm-ah--%1$s hm-ah--%2$s" data-hm-widget="agency-hero">', esc_attr( $style ), esc_attr( 'compact' === $s['height'] ? 'compact' : 'screen' ) );

		if ( 'panel' === $style ) {
			echo '<div class="hm-ah__panel">';
			echo '<span class="hm-ah__lines" aria-hidden="true"></span>';
			// Social ring, half outside the panel edge.
			if ( ! empty( $s['socials'] ) ) {
				$items = array_values( $s['socials'] );
				echo '<div class="hm-ah__ring" aria-label="' . esc_attr__( 'Social networks', 'hamista-core' ) . '"><span class="hm-ah__ring-arc" aria-hidden="true"></span><ul>';
				foreach ( $items as $i => $item ) {
					printf(
						'<li style="--i:%1$d;--n:%2$d"><a href="%3$s" target="_blank" rel="noopener" aria-label="%4$s">%5$s</a></li>',
						(int) $i,
						count( $items ),
						esc_url( ! empty( $item['url']['url'] ) ? $item['url']['url'] : '#' ),
						esc_attr( $item['network'] ),
						hamista_core_icon( $item['network'] ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					);
				}
				echo '</ul></div>';
			}
			echo '<div class="hm-ah__side">';
			echo '<div class="hm-ah__intro">' . $desc . $btn . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $s['brand_title'] || ! empty( $s['logos'] ) ) {
				echo '<div class="hm-ah__brands" data-hm-reveal="up" data-hm-delay=".3">';
				if ( $s['brand_title'] ) {
					echo '<p class="hm-ah__brands-title">' . hamista_core_highlight( $s['brand_title'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				echo '<div class="hm-ah__brands-row"><span class="hm-ah__laurel" aria-hidden="true"></span>' . self::logos( $s['logos'] ) . '<span class="hm-ah__laurel hm-ah__laurel--end" aria-hidden="true"></span></div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- image markup from WordPress.
			echo '<div class="hm-ah__figure" data-hm-parallax="0.12" data-hm-parallax-var>' . hamista_core_image(
				$s['image'],
				'large',
				array(
					'class'         => 'hm-ah__portrait',
					'loading'       => 'eager',
					'fetchpriority' => 'high',
				)
			) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			if ( ! empty( $s['strip'] ) ) {
				$words = '';
				foreach ( $s['strip'] as $item ) {
					$words .= '<span>' . esc_html( $item['text'] ) . '</span><i aria-hidden="true"></i>';
				}
				echo '<div class="hm-ah__strip" aria-hidden="true"><div class="hm-ah__strip-run">' . $words . $words . $words . '</div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}

			echo '<div class="hm-ah__main">';
			echo self::status( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( $s['eyebrow'] ) {
				echo '<p class="hm-ah__eyebrow" data-hm-reveal="up">' . esc_html( $s['eyebrow'] ) . '</p>';
			}
			echo $title; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__foot">' . $this->film_card( $s, '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__proof" data-hm-reveal="up" data-hm-delay=".35">' . Proof::avatars( $s['avatars'], true ) . '<div class="hm-ah__rate"><span>' . Proof::stars( 4.5 ) . '<small>' . esc_html( $s['proof_note'] ) . '</small></span><b class="hm-num">' . esc_html( hamista_core_digits( $s['score'] ) ) . '</b></div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div></div></div>';
		} elseif ( 'wordmark' === $style ) {
			echo self::status( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__top">';
			echo '<div class="hm-ah__intro">' . $title . $desc . $btn . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__orbs" data-hm-reveal="up" data-hm-delay=".2">';
			echo '<span class="hm-ah__orb hm-ah__orb--a">' . hamista_core_image( $s['image'], 'medium_large', array( 'loading' => 'eager' ) ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<span class="hm-ah__orb hm-ah__orb--b">' . hamista_core_image( $s['image2'], 'medium_large' ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( ! empty( $s['logos'] ) ) {
				$row = self::logos( $s['logos'] );
				echo '<div class="hm-ah__ticker" aria-hidden="true"><div class="hm-ah__ticker-run">' . $row . $row . '</div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
			echo $this->film_card( $s, 'hm-ah__film--outline' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div>';
			echo '<div class="hm-ah__bottom">';
			echo '<p class="hm-ah__mark" aria-hidden="true">' . hamista_core_highlight( $s['big'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__aside" data-hm-reveal="up" data-hm-delay=".3">';
			$card_link = ! empty( $s['card_link']['url'] ) ? $s['card_link']['url'] : '#';
			echo '<div class="hm-ah__card"><div class="hm-ah__card-body"><h2>' . esc_html( $s['card_title'] ) . '</h2><p>' . esc_html( $s['card_text'] ) . '</p>';
			if ( $s['card_btn'] ) {
				echo '<a class="hm-ah__card-btn" href="' . esc_url( $card_link ) . '">' . esc_html( $s['card_btn'] ) . '</a>';
			}
			echo '</div>' . hamista_core_image( $s['image2'], 'medium', array( 'class' => 'hm-ah__card-img' ) ) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<p class="hm-ah__liked"><span>' . esc_html( $s['liked'] ) . '</span>' . Proof::avatars( $s['avatars'] ) . '</p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div></div>';
		} else {
			echo '<span class="hm-ah__grid" aria-hidden="true"></span>';
			echo '<p class="hm-ah__ghost" aria-hidden="true">' . esc_html( wp_strip_all_tags( str_replace( '*', '', $s['big'] ) ) ) . '</p>';
			echo self::status( $s ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__stage">';
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- image markup from WordPress.
			echo '<div class="hm-ah__picture" data-hm-ah-zoom>' . hamista_core_image(
				$s['image'],
				'large',
				array(
					'loading'       => 'eager',
					'fetchpriority' => 'high',
				)
			) . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '<div class="hm-ah__intro">' . $title . $desc . $btn . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			if ( ! empty( $s['image2']['url'] ) ) {
				echo '<span class="hm-ah__tilt" data-hm-parallax="-0.2" data-hm-parallax-var>' . hamista_core_image( $s['image2'], 'medium' ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo $this->film_card( $s, 'hm-ah__film--float' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div>';
			$big = hamista_core_highlight( $s['big'] );
			echo '<div class="hm-ah__band" aria-hidden="true"><div class="hm-ah__band-run"><span>' . $big . '</span><span>' . $big . '</span><span>' . $big . '</span></div></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		echo '</section>';
	}
}
