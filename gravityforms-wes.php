<?php
/**
 * Plugin Name: Gravity Forms - WES
 * Description: Manage cookies and add them to Gravity Forms
 * Author: Kurt Rank
 * Version: 1.0.1
 */

function tlh_gravity_forms_modify_fields( $field_content, $field ) {
	if ( 'hidden' == $field->type && '' !== $field->inputName ) {
		return str_replace( 'type=', 'data-populate=' . $field->inputName . ' type=', $field_content );
	}
	return $field_content;
}
add_action( 'gform_field_content', 'tlh_gravity_forms_modify_fields', 10, 2 );

function tlh_gravity_forms_populate() {
	wp_register_script( 'js-cookie', 'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js', false );
	wp_register_script( 'tlh-gravity-forms-populate', plugins_url( '/public/js/tlh-gravity-forms-populate.js', __FILE__ ), false );

	wp_enqueue_script( 'js-cookie' );
	wp_enqueue_script( 'tlh-gravity-forms-populate' );
}
add_action( 'wp_enqueue_scripts', 'tlh_gravity_forms_populate' );
