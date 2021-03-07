function formClear($form) {
	if ($form.prop("tagName") == 'FORM') {
		$form.get(0).reset();
		$form.validate().resetForm();
	} else {
		$form.find('input, textarea').each(function(){
			var $_field = $(this);

			$_field.val('')
						 .removeClass('error')
						 .next('.error').remove();
		});
	}
};

function isFormValid($form) {
	var isValid = true;

	if ($form.prop("tagName") == 'FORM') {
		isValid = $form.validate().checkForm();
	} else {
		$form.find('input, textarea').each(function(){
			var val = $(this).closest('form').validate();

			if (!val.element($(this))) {
				isValid = false;
				return false;
			}
		});
	}

	return isValid;
};

function getCurrentBreakpoint() {
	var currentPoint;

	for (var key in BREAKPOINTS) {
		if (BREAKPOINTS[key] <= window.innerWidth) {
			currentPoint = key;
			return currentPoint;
		}
	}
};

function changeDataValidError($input, isValid){
	if (isValid) {
		$input.removeAttr('data-valid-error');
	} else {
		$input.attr('data-valid-error', 'error');
	}

	$input.valid();
};

function scrollToEl($el, time) {
	var time = time === undefined ? time : 350;
  $('html, body').animate({
      scrollTop: $el.offset().top - $('#header').outerHeight()
  }, time );
};

function getSiblingsMaxIndex($el) {
	var $siblings = $el.siblings();
	var maxIndex = 0;

	$siblings.each(function() {
		var $this = $(this);
		var zIndex = $this.css('zIndex');

		if (zIndex > maxIndex) maxIndex = zIndex;
	});

	return maxIndex;
};
