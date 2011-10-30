#HTML5 Form Validation with Style

This jQuery pluggin aims to take the syntax from HTML5's inputs and validation attributes to create error messages that you can actually style.  This is to get around the fact that HTML5's shadow DOM is (at the moment) still so hard to style.

##Features

* Support for required, email, phone, url, matching
* A Function to run once the form is valid can also be passed in.
* Error message customisation by adding data-msg="my error message" to the input

##Limitations

* Only one type of validation can be applied to an input. (required & type)
* I'll add these features as & when I need them on production projects.
* The plugin could do with re-structuring, architecturally... its not great.

[view the demo](http://byrichardpowell.github.com/html5-form-validation-with-style/)