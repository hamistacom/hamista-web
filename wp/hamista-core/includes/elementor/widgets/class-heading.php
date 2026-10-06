<?php
/**
 * Heading: eyebrow + title (with *highlight* and word reveal) + description.
 *
 * @package Hamista\Core
 */

namespace Hamista\Core\Elementor\Widgets;

use Hamista\Core\Elementor\Widget_Base;

defined( 'ABSPATH' ) || exit;

/**
 * Heading widget.
 */
class Heading extends Widget_Base {

	/** @return string */
	public function get_name() {
		return 'hm-heading';
	}

	/** @return string */
	public function get_title() {
		return __( 'Heading', 'hamista-core' );
	}

	/** @return string */
	public function get_icon() {
		return 'eicon-heading';
	}

	/** @return array */
	public function get_keywords() {
		return array( 'hamista', 'heading', 'title', 'eyebrow' );
	}

	/**
	 * Controls.
	 */
	protected function register_controls() {
		$this->add_header_controls(
			array(
				'eyebrow' => __( 'Section label', 'hamista-core' ),
				'title'   => __( 'A headline with a *highlighted* word', 'hamista-core' ),
			)
		);
		$this->add_header_style_controls();
	}

	/**
	 * Render.
	 */
	protected function render() {
		echo $this->render_header( $this->get_settings_for_display(), 'hm-head--standalone' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in render_header().
	}
}
