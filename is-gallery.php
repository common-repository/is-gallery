<?php
/**
 * IS Gallery
 *
 * @package           imagesnippets
 * @author            Henry Sautter
 * @copyright         2021 Henry Sautter, Sautter.Photography
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       IS Gallery
 * Plugin URI: https://imagesnippets.com/
 * Description: This is a Gutenberg block plugin for creating a gallery of Imagesnippets images.  Display images with easy access to the imbedded metadata.  The gallery is dynamically created, images tagged as in a gallery are automatically displayed. 
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           1.0.5
 * Author: Henry Sautter
 * Author URI: https://sautter.photography/desktop-gallery/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       is-gallery
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

 function imagesnippets_is_gallery_block_init() {
	wp_set_script_translations( 'index.js', 'is-gallery' );
	wp_set_script_translations( 'render.js', 'is-gallery' );
	register_block_type(
		 __DIR__ ,
		 array(
			'api_version' => 2,
			'render_callback' => 'render_imagesnippets_gallery' )
	);
}
add_action( 'init', 'imagesnippets_is_gallery_block_init' );

 /**
 * Create the block using the attributes loaded from the editor save function. 
 * Attributes are saved in the block html element for use during the front end rendering.
 * This greates a dynamic block based on the query results
 */

function render_imagesnippets_gallery( array $block_attributes ) {

    $class = $block_attributes['style'];
	$align = $block_attributes['alignment'];
	$gallery = $block_attributes['isGallery'];
	$userid = $block_attributes['isUserid'];
	$caption = $block_attributes['displayCaption'];
	$title = $block_attributes['displayTitle'];
	$order = $block_attributes['order'];
	$orderby = $block_attributes['orderBy'];
	$limit = $block_attributes['limit'];


	ob_start();
    ?>

    <div 
        class="<?php echo esc_attr( $class ); ?>" 
        data-alignment="<?php echo esc_attr( $align ); ?>" 
      	data-gallery="<?php echo esc_attr( $gallery ); ?>" 
      	data-userid="<?php echo esc_attr( $userid ); ?>" 
      	data-caption="<?php echo esc_attr( $caption ); ?>" 
      	data-title="<?php echo esc_attr( $title ); ?>" 
      	data-order="<?php echo esc_attr( $order ); ?>" 
      	data-orderby="<?php echo esc_attr( $orderby ); ?>" 
      	data-limit="<?php echo esc_attr( $limit ); ?>" 
    >
        <!-- initial block content here... -->
 		Imagesnippets Gallery
   </div>

    <?php
    return ob_get_clean();
}
/**
 * Registers the block script used for rendering the content of the gallery on the frontend.
 *
 */

function imagesnippets_is_gallery_scripts() {
    wp_enqueue_script(
        'imagesnippets-is-gallery',
        plugins_url( './build/render.js', __FILE__ ),
		array('wp-blocks', 'wp-components', 'wp-element', 'wp-i18n'), null, true
	);
}
add_action( 'wp_enqueue_scripts', 'imagesnippets_is_gallery_scripts' );

?>
