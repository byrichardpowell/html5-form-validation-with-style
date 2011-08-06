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



	// Allows you to style a select by hiding the origional select and replacing it with a UL
	// Pluggin then attaches events to the UL that make it behave like a select	
        styleSelect: function () {
		
			// Is the user using IE 7 || 6
			// Yes: Return early as the pluggin isnt 100% in ie 6 & 7
			if (ie !== undefined && (ie === 6 || ie === 7)) {
				return this.each( function() {} );
			}

			// Make Items appears over the top of every other element
			// Increment the Z-Index of each list item in order
			// Remove the z-index value when closing	
			var toggleZIndex = function ($list,close) {
		
				var i = 500,
				removeZIndex = function () {
					$list.find('li, .icon').css('zIndex', '');
				};
				
				// Close Boolean was true
				// Remove inline zIndex value
				if ( close === true) {
				
					removeZIndex();
				
				// The List is closed (& The user just opened it)	
				// Incremenet the z index
				} else if ($list.hasClass('is-closed')) {
					
					$list.find('li, .icon').each( function () {

						$(this).css('zIndex', i);
						i++;

					});
					
					var $items = $list.find('li').not('.active');
					
				// The List is open (& The user just closed it)
				// Remove inline zIndex value	
				} else {
					
					removeZIndex();
					
				}
				
			};
 
			// Returns the select
			// TODO: Return the list instead
            return this.each(function () {

				// Alias the select for speed
				var $select = $(this).css({position : 'absolute', left : '-9999px', top : '-999px'}),
				
				// Return an array with objects
				// Each object contains the val & text for each option on the select
				// i.e: [{val : theValue, text : 'choose something'}, ... ]
				// We use this to insert each <li> into the new <ul>
				selectItems = (function () {
					var array = [];
					$select.children().each( function () {
						// For Each child of the select construct {val : 'the value', 'text' : 'thetext'}
						array.push({val : $(this).val(), text : $(this).html()});
					});

					return array;
				}()),
				
				// The Value of the select, as we found it
				// We use this to add the active class
				defaultVal = $select.val(),
				
				// Construct a unique ID, this gets added to the list
				// Do this because accesing ID's is quicker than elements or classes
				listId = 'fs-' + Math.floor(Math.random()*999),
				
				// The HTML string for the <ul> (inc id)
				listHtml = "<div class='style-select-wrap'><ul id='" + listId + "' class='style-select is-closed'></ul></div>",
				
				// Insert the <ul> after the list
				// Dont use this variable, use $list instead
				$ul = (function() {$select.after(listHtml);}()),
				
				// Alias the new <ul> for easy access
				$list = $('#' + listId),

				// Use this to check the state of the list (open closed).
				// this gets used to mimic a selects interactions
				// true when the user hovers over the list
				overSelect = false;	
							
				
				// Insert The list items (and the span icon) into the list
				$list.append((function () {
					var items = '';
					// Add each list item to the <ul> & then attach a click event to each <li>
					for (var i=0; i<selectItems.length; i++) {

						// A String that includes an <li> For Each option in the select
						items = (items || '') + '<li data-val="' + selectItems[i].val + '"><span class="pad">' + selectItems[i].text +'</span></li>';

					}
					
					return items + '<span class="icon"></span>';
					
				}()));


				// EVENT: Click on an item
				// Attach this event to every item
				$list.find('li').click( function (e) {
					
					e.preventDefault();

					// The val of the clicked item
					var val = $(this).data('val'),
						i = 500;
					

					// Tweak the z-index & pos of each item
					toggleZIndex($list);
					

					// They clicked on the active one 
					if (val === $select.val()) {


						if ($list.hasClass('is-closed')) {

							// Show every item
							$list.find('li').show();

						} else {

							// Hide every item
							$list.find('li').hide();
							$list.find('.active').show();
						}

					} else {

						// Remove Active From exisitng active item
						$list.find('.active').removeClass('active');

						// Hide Every Item
						$list.find('li').hide();

						// add active and show this item
						$(this).addClass('active').show();

						// update the selects value & trigger the change event
						$select.val(val).change();
					}

					// Updated the isclosed / open flag
					$list.toggleClass('is-closed');
					
					// Update the last item class (used to add rounded corners to the bottom)
					// First we remove the current last class
					// Then we check the index of the active item against the last items index & set the class accordingly
					$list.find('.last').removeClass('last');
					var $lastItem = $list.find('li:last');
						
					if ($lastItem.index() === $list.find('.active').index()) {
						$lastItem.prev().addClass('last');
						
					} else {
						$lastItem.addClass('last');
						
					}

				});



				

				// Fix the Width of the List
				// Do this so that the width doesnt pop when we show/hide the inactive items
				// Also Add the .icon span to the end of the<li>
				// Use this icon to style the up down arrow
				$list.width($list.width());

				// Find the default Item
				// Add the active Class
				// Hide the rest of the items
				$list.find('li[data-val=' + defaultVal + ']').addClass('active').siblings('li').hide();




				// EVENT: Hover & click outside of select area
				// This is to mimic how interaction with a <select> works.
				$list.hover(function () {

					// User hovered over the select
					overSelect = true;

				}, function () {

					// Use hovered out of the lists area
					overSelect = false;

					// User clicked in the document
					$(document).click( function (e) {

						// And has not hovered back over the select
						if (overSelect === false) {
							
							e.preventDefault();
							
							// Tweak the z-index of each item
							toggleZIndex($list, true);

							// Hide Every inactive item and change toggle class
							$list.find('li').not('.active').hide();
							$list.addClass('is-closed');
							
							// Unbind the click event
							$(document).unbind('click');
							
						}
					});
				});
				
				
				// EVENT: Click the icon
				// The Icon gets positioned over the active list item
				// The user might click the icon, but that wouldnt trigger a click event on the active list item.
				// So lets trigger the click event on that item instead
				$list.find('.icon').click(function () {
					
					$list.find('.active').click();
					
				});
				
				
				
            });
        },








	// Take a label with a chekbox or radio inside it.
	// Managae the class on the label depending on if the input is checked or not
	// This allows us to replace standard Checkboxes/Radios with styled ones in the CSS by changing the background image of the label
		styleToggles : function () { 
		
			// Is the user using IE 7 || 6
			// Yes: Return early as the pluggin isnt 100% in ie 6 & 7
			if (ie !== undefined && (ie === 6 || ie === 7)) {
				return this.each( function() {} );
			}

			// Toggle class based on the inputs checked status
			var updateState = function ($input) {
				
				// Is the input a radio?
				var isRadio = $input.is('[type=radio]'),
				
				// Change the class depending on if $input is a radio or not
				toggleClass = (isRadio) ? 'radio-on' : 'cb-on';
				
				if ($input.is(':checked')) {
					$input.parent().addClass(toggleClass);
					
				} else {
					$input.parent().removeClass(toggleClass);
					
				}
				
				// If $input is a radio then remove the active class from the parent of each radio with the same name
				if (isRadio) {
					
					$('input[type=' + $input.attr('name') +']').not($input).parent().removeClass(toggleClass);
					
				} 
				
			};
			
            return this.each(function () {
	
				var $label = $(this),
					$input = $label.find('input');
				
				$input.css('opacity', 0);
				
				// Insert the icon span (style this in CSS)
				$label.prepend('<span class="icon"></span>');
					
				// Update the status immediately
				updateState($input);
				
				// Update the status on change
				$input.change( function (e) {					
					updateState($(this));
				});

            });
        },


	// Take a Table 
	// When you hover on a <td> add a class to the parent <tr>. Do reverse on hover out
	// Usefull for highlighting rows in tables
		tableRowHover : function () { 
			
            return this.each(function () {
					
				$(this).find('tbody td, tfoot td').hover(function () {
					
					$(this).parent().addClass('hover');
					
				}, function () {
					
					$(this).parent().removeClass('hover');
					
				});

            });
        },



	// Toggle the loading & disabled state of a button
	// Fire this method on a Button. 
	// You could trigger the method when a button is clicked, or when a form is submited, but this is handled outside of the pluggin
	// If button is disabled:  Enables it
	// If button is enabled:  Disable it & set a timer to re-enable the button.
	// You can safely interupt the re-enable timer by calling the pluggin on the button again.
		toggleLoading : function () {

			return this.each( function () {
				
				var $button = $(this).css('overflow' , 'hidden'),
					defaultWidth = $button.width() + 2,
					timer = '',
				
				
				// Add the txt class to the span if it doesnt exist
				// If It doesnt exist lets also add overflow hidden (for animation)
				// Reason it wouldnt exist: we havent run this on this button yet
					$txt = (!($button.find('.txt').length)) ? $button.find('span:first').addClass('txt') : $button.find('.txt'),
			
					
				// Add the .loader span if it doesnt exist
				// Reason it wouldnt exist: we havent run this on this button yet
					$loader = (!($button.find('.loader').length)) ? $button.append('<div class="loader"></div>').find('.loader') : $button.find('.loader'),


				// Reactivate A Button	
				// This removes the loading ticker and animates the button back to its normal state			
					enableButton = function () {
						
						clearTimeout(timer);
						
						$loader.stop().animate({'opacity' : 0}, speed / 2, ease, function () {
							$button.stop().animate({'width' : defaultWidth, 'minWidth' : defaultWidth}, speed, ease).removeAttr('disabled');
							$txt.stop().animate({'opacity' : 1}, speed, ease);
						}).hide();
						
						
						
					};
					

				// FIRE
				if ($button.is(':disabled')) {
					// Button is disabled: Enable it
					enableButton();
					
				} else {
					// Button is enabled: Disable it & set timer to re-enable it.
					$txt.stop().animate({'opacity' : 0}, speed / 2, ease);
					$button.attr('disabled', 'disabled').stop().animate({'width' : 36, 'minWidth' : 36}, speed, ease, function () {
						$loader.show().stop().animate({'opacity' : 1}, speed, ease);
					});
					timer = setTimeout(function () {enableButton();}, 3000);
					
				}

				
			});
		},
		
		
		
	// Validate A Form
	// Take a HTML5 Form with HTML5 inputs and validation rules
	// Validate the form when the user submits the form
	// TODO: Add Min & Max Support
	// TODO: Add Pattern Support
		validateForm : function () {

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





