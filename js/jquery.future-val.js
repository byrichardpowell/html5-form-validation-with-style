/*jslint  browser:  true,
            eqeqeq:   true,
            immed:    true,
            newcap:   true,
            nomen:    true,
            onevar:   false,
            plusplus: false,
            undef:    true,
            white:    false */
/*global  window, jQuery, $, thap */


( function ($) {
	
	// Speed & Easign Settings for all the pluggins
	// Can always overwite these on a per pluggin basis
	var speed = 300,
	ease = 'easeOutExpo';
	
	// Add .js to the body
	// This will most likely be handled via Modernizr... but just incase...
	$('body').addClass('js');
	
	
 
    $.fn.extend({ 




		
	// Validate A Form
	// Take a HTML5 Form with HTML5 inputs and validation rules
	// Validate the form when the user submits the form
	// TODO: Add Min & Max Support
	// TODO: Add Pattern Support
		futureVal : function () {

			var ease = 'easeOutExpo',
			speed = 400,
			errorClass = 'has-error',
			
			// Is A Valid Email Adress
			isEmail = function (str) { 
				return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
			},
				
			// Is not empty
			isNotEmpty = function (str) {
				return (str.length) ? true : false; 
			},
				
			// Is A Number
			isNumber = function (str) {
				return (isNotEmpty(str) && !(isNaN(str)));
			},
				
			// Is A URL
			isURL = function (str) {
				return (str.indexOf(".") > 2);
				
			},
				
			// is Errors
			hasError = function (errors) {
			
			
				return ($.inArray(true, errors)) ? false : true ;
				
			},
				
			// Add or remove an error message from an input
			toggleError = function ($input, txt, remove) {
				
				var id = $input.attr('id'),
				errorId = id + '-error';

				
				// Remove The Error Message
				if (remove) {
					var $msg = $('#' + errorId);
					$input.removeClass(errorClass);
					$msg.animate({'opacity' : 0, 'marginLeft' : 30}, speed /2, ease, function () {
						$msg.remove();
					});
				
				// If The error message doesnt already exist, add it.	
				// Position it to the right of the input
				// Fade the opacity in
				} else if ($('#' + errorId).length === 0){
					
					var inputW = $input.outerWidth(true);
					
					$input.addClass(errorClass).after('<label class="error-msg" id="' + errorId + '" for="' + id + '" style="left:' + ($input.position().left + inputW) + 'px; top: ' + $input.position().top +'px;" ><span class="icon"></span>' + txt + '</label>')
						.next().css({'opacity' : 0, 'marginLeft' : (inputW / 4) * -1}).animate({'opacity' : 1, 'marginLeft' : 15}, speed, ease);
				
				}
				
			};
				

			return this.each( function () {

				var $form = $(this).attr('novalidate', 'novalidate'),
					
				// Each Input insde the form that is required & therefor should be validated	
				$inputs = $form.find('input[required]'),
				
				// Have We Submitted this form before ?	
				virgin = true,
					
				// An Array of true and false vales
				// If Every value is false theres no errors.
				errors = [],
				valid = false,

				// On Keyup event for the specified input run the specified test
				// If it passes remove the message (added previously) & remove a fail from errors	
				validateOnChange = function ($input, validTest, msg) {

					// Re-Validate When The User Updates the input
					$input.keyup(function () {

						// Input is valid: remove error message, remove an error from the array, remove the keyup event
						if (validTest($input.val())) {

							toggleError($input, '', true);
							errors.pop();

						} else {
							toggleError($input, msg);
							
						}
					});

				};
					

				$form.submit(function (e) {
				
				
					// Have we submitted the form before Or Are there Errors?
					// dont submit the form & de-flower virgin
					if (virgin || !valid) {

						e.preventDefault();
						virgin = false;
					
					// No Errors: Submit the form
					} else if (valid) {
						return true;
					
						
					}

					// Reset Errors to erase the results from the last submit
					errors = [];
					
					// Validate Each Input
					$inputs.each( function () {
						
						var $input = $(this),
						type = $input.attr('type'),
						msg = ($input.data('msg') !== undefined) ? $input.data('msg') : false;
						
						
						// Check Not Empty
						if (type === 'text' && !(isNotEmpty($input.val()))) {
							
							// Record the error
							// We check the array for errrors later
							errors.push(true);
							
							// Toggle The Error Message
							msg = (msg) ? msg : 'You must fill this in';
							toggleError($input, msg);
							
							// Re-Validate When The User Updates the input
							validateOnChange($input, isNotEmpty, msg);
					
						// Check Valid Email
						} else if (type === 'email' && !(isEmail($input.val()))) {
							errors.push(true);
							msg = (msg) ? msg : 'This is not a valid email address';
							toggleError($input, msg );
							validateOnChange($input, isEmail, msg);
						
						// Check Not Empty	
						} else if (type === 'tel' && !(isNumber($input.val()))) {
							errors.push(true);
							msg = (msg) ? msg : 'This must be a number';
							toggleError($input, msg );
							validateOnChange($input, isNumber, msg);
							
						// Check URL
						} else if (type === 'url' && !(isURL($input.val()))) {
							errors.push(true);
							msg = (msg) ? msg : 'This is not a valid URL';
							toggleError($input, msg );
							validateOnChange($input, isURL, msg);

						// Check Password
						} else if (type === 'password' && !(isNotEmpty($input.val()))) {
							errors.push(true);
							msg = (msg) ? msg : 'You must fill this in';
							toggleError($input, msg);
							validateOnChange($input, isNotEmpty, msg);
							
						} else {
							toggleError($input, '', true);
							$input.unbind('keyup');
							
						}
						
					});
					
					// No Errors!
					// Remove the submit event from the form, then re-submit
					if (!(hasError(errors))) {
					
						$form.unbind('submit').submit();
					
					// Errors!
					// Focus on the first input with errors
					} else {

						$form.find('input.' + errorClass+':first').focus();
					}
					
				});


			});
		}		
		
		
		
		
		
    }); 
}(jQuery));





