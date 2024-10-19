<?php
/**
 * Maestro Web
 *
 * @package       Maestro Web
 * @author        AltSalt
 *
 * @wordpress-plugin
 * Plugin Name:       Maestro Web
 * Plugin URI:        https://www.altsalt.com
 * Description:       Create scrollies with Maestro.
 * Version:           1.0
 * Author:            AltSalt
 * Author URI:        https://altsalt.com/
 * Text Domain:       maestro-web
 * Domain Path:       /lang
 * Requires PHP:      7.0
 * Requires at least: 5.8
 */

// functions.php or custom plugin file
function enqueue_react_app() {
	// Check if we are on the add or edit screen for the 'scrollie' post type
	if ( isset( $_GET['page'] ) && 'maestro-scrollie-template' === $_GET['page'] ) {
		wp_enqueue_script(
			'maestro-web-scripts',
			$file_url = plugins_url( 'build/assets/index.js', __FILE__ ),
			array(), // Dependencies, if any
			null, // Version
			true // Load in footer
		);

		add_filter(
			'script_loader_tag',
			function (
				$tag,
				$handle
			) {
				if ( 'maestro-web-scripts' !== $handle ) {
					return $tag;
				}
				return str_replace( '<script ', '<script type="module" ', $tag );
			},
			10,
			2
		);

		$nonce = wp_create_nonce( 'wp_rest' );

		// Localize the script with the nonce
		wp_localize_script(
			'maestro-web-scripts',
			'MaestroWebData', // This will be the global variable in JavaScript
			array(
				'nonce' => $nonce,
			)
		);

		wp_enqueue_style(
			'maestro-web-styles',
			$file_url = plugins_url( 'build/assets/index.css', __FILE__ ),
			array(), // Dependencies, if any
			null // Version
		);
	}
}
add_action( 'admin_enqueue_scripts', 'enqueue_react_app' );

// Register custom post type
// functions.php or custom plugin file
function create_scrollie_post_type() {
	$args = array(
		'label'              => __( 'Scrollies', 'maestro-web-features' ),
		'public'             => true,
		'publicly_queryable' => true,
		'show_in_rest'       => true,
		'rest_base'          => 'scrollies',
		'show_in_menu'       => true,
		'show_in_nav_menus'  => true,
		'show_in_admin_bar'  => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'supports'           => array( 'title', 'author', 'thumbnail', 'excerpt', 'comments', 'custom-fields' ),
	);

	register_post_type( 'scrollie', $args );

	register_post_meta(
		'scrollie',
		'scenes',
		array(
			'show_in_rest'      => true, // Make it available in the REST API
			'single'            => true, // Single value per post
			'type'              => 'string', // Type of the meta field
			'sanitize_callback' => 'wp_kses_post', // Sanitize the input
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' ); // Capability check
			},
		)
	);

	register_post_meta(
		'scrollie',
		'sequences',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'wp_kses_post',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'create_scrollie_post_type' );

function add_scrollie_admin_page() {
	add_submenu_page(
		'edit.php?post_type=scrollie', // Parent slug (custom post type menu)
		'Maestro',         // Page title
		'Add New Scrollie',         // Menu title
		'manage_options',          // Capability
		'maestro-scrollie-template',         // Menu slug
		'display_scrollie_template'  // Callback function
	);
}
add_action( 'admin_menu', 'add_scrollie_admin_page' );

function display_scrollie_template() {
	$html = <<<HTML
		<!doctype html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + React + TS</title>
			</head>
			<body>
				<div id="root"></div>
			</body>
		</html>
	HTML;

	echo wp_kses_post( $html );
}

// Customize admin links

function customize_edit_post_link( $url, $post_id ) {
	if ( 'scrollie' === get_post_type( $post_id ) ) {
		$url = admin_url( 'edit.php?post_type=scrollie&page=maestro-scrollie-template&post=' . $post_id );
	}
	return $url;
}
add_filter( 'get_edit_post_link', 'customize_edit_post_link', 10, 3 );

function remove_add_new_button() {
	global $submenu;
	$post_type = 'scrollie';

	// Remove "Add New" from the submenu
	if ( isset( $submenu[ "edit.php?post_type={$post_type}" ] ) ) {
		foreach ( $submenu[ "edit.php?post_type={$post_type}" ] as $key => $menu_item ) {
			if ( in_array( 'post-new.php?post_type=' . $post_type, $menu_item ) ) {
				unset( $submenu[ "edit.php?post_type={$post_type}" ][ $key ] );
			}
		}
	}
}
add_action( 'admin_menu', 'remove_add_new_button', 999 );
