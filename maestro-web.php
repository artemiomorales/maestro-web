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
function enqueue_react_app( $hook ) {
	// Adjust the path to your React app's build files
	wp_enqueue_script(
		'react-app',
		$file_url = plugins_url( 'dist/assets/index.js', __FILE__ ),
		array(), // Dependencies, if any
		null, // Version
		true // Load in footer
	);

	wp_enqueue_style(
		'react-app-style',
		$file_url = plugins_url( 'dist/assets/index.css', __FILE__ ),
		array(), // Dependencies, if any
		null // Version
	);

	$screen = get_current_screen();
	// Check if we are on the add or edit screen for the 'scrollie' post type
	if ( 'scrollie' === $screen->post_type && ( 'post-new.php' === $hook || 'post.php' === $hook ) ) {
		wp_enqueue_script(
			'maestro-web-admin-redirect',
			plugins_url( 'dist/redirect.js', __FILE__ ),
			array(), // Dependencies
			true // Load in footer
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
		'show_in_menu'       => true,
		'show_in_nav_menus'  => true,
		'show_in_admin_bar'  => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'supports'           => array( 'title', 'author', 'thumbnail', 'excerpt', 'comments' ),
	);

	register_post_type( 'scrollie', $args );
}
add_action( 'init', 'create_scrollie_post_type' );

function add_scrollie_admin_page() {
	add_submenu_page(
		'edit.php?post_type=scrollie', // Parent slug (custom post type menu)
		'Custom Template',         // Page title
		'Custom Template',         // Menu title
		'manage_options',          // Capability
		'maestro-scrollie-template',         // Menu slug
		'display_scrollie_template'  // Callback function
	);
}
add_action( 'admin_menu', 'add_scrollie_admin_page' );

function display_scrollie_template() {
	// Check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$html_content = <<<HTML
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

	echo wp_kses_post( $html_content );
}
