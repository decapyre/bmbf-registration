'use strict';

$(function(){
	function noop(){}

	$(document).foundation({
		orbit: {
			animation: 'slide', // Sets the type of animation used for transitioning between slides, can also be 'fade'
			timer_speed: 0, // Sets the amount of time in milliseconds before transitioning a slide
			pause_on_hover: false, // Pauses on the current slide while hovering
			resume_on_mouseout: false, // If pause on hover is set to true, this setting resumes playback after mousing out of slide
			next_on_click: false, // Advance to next slide on click
			animation_speed: 300, // Sets the amount of time in milliseconds the transition between slides will last
			stack_on_small: false,
			navigation_arrows: false,
			slide_number: false,
			slide_number_text: 'of',
			container_class: 'orbit-container',
			stack_on_small_class: 'orbit-stack-on-small',
			next_class: 'orbit-next', // Class name given to the next button
			prev_class: 'orbit-prev', // Class name given to the previous button
			timer_container_class: 'orbit-timer', // Class name given to the timer
			timer_paused_class: 'paused', // Class name given to the paused button
			timer_progress_class: 'orbit-progress', // Class name given to the progress bar
			slides_container_class: 'orbit-slides-container', // Class name given to the slide container
			preloader_class: 'preloader', // Class given to the perloader
			slide_selector: 'div', // Default is '*' which selects all children under the container
			bullets_container_class: 'orbit-bullets',
			bullets_active_class: 'active', // Class name given to the active bullet
			slide_number_class: 'orbit-slide-number', // Class name given to the slide number
			caption_class: 'orbit-caption', // Class name given to the caption
			active_slide_class: 'active', // Class name given to the active slide
			orbit_transition_class: 'orbit-transitioning',
			bullets: false, // Does the slider have bullets visible?
			circular: true, // Does the slider should go to the first slide after showing the last?
			timer: false, // Does the slider have a timer active? Setting to false disables the timer.
			variable_height: true, // Does the slider have variable height content?
			swipe: false,
			before_slide_change: noop, // Execute a function before the slide changes
			after_slide_change: noop // Execute a function after the slide changes
		},
		abide : {
			live_validate : true,
			timeout : 300
		}
	});

	// fix for dynamic height change on the 'orbit' container
	$('form')
		.on('invalid.fndtn.abide', function () {
			$(document).foundation('orbit', 'reflow');
		})
		.on('valid.fndtn.abide', function () {
			$(document).foundation('orbit', 'reflow');
		});

	// reset error messages when modal is closed
	$('#reg-dropdown').on('closed.fndtn.dropdown', function() {
		var abideForms = $(this).find('form');

		$(abideForms).children('div').removeClass('error');
		$(abideForms).each(function(){
			this.reset();
		});

		// reflow
		$(document).foundation('orbit', 'reflow');
	});
});


