'use strict';

var BREAKPOINTS = {
  lg: 1280,
  md: 992,
  sm: 768,
  xs: 320
};

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

// $('.page-body__intro-video').click(function(){this.paused?this.play():this.pause();});
// $('.intro-video__pause').click(function(){$('.page-body__intro-video').pause()})
function playVideo() {
    $('.page-body__intro-video').trigger('play');
    $('.intro-video__start').hide();
    $('.intro-video__pause').show();
}
function pauseVideo() {
    $('.page-body__intro-video').trigger('pause');
    $('.intro-video__start').show();
    $('.intro-video__pause').hide();
}
svg4everybody();
var pageOverlay = new (function() {
  this.elSelector = '.el-page-overlay';
	this.$el = $(this.elSelector);

  this.init = function($newOverlay) {
    var _overlay = this;

    $(document).on('click', _overlay.elSelector, function() {
      _overlay.close();
    });
  },

	this.open = function($toEl) {
    var $parent = $toEl.parent();
    var $_overlay = $parent.find(this.elSelector);

    if (!$_overlay.length) {
      $_overlay = this.$el.clone()
        .css('zIndex', $toEl.css('zIndex') - 1);

      $parent.append($_overlay);
      this.init($_overlay);
    };

    $('body').addClass('disabled-scroll');
    $_overlay.addClass('open');
	},

	this.close = function() {
    // this.onClose();
		$(this.elSelector).removeClass('open');
    $('body').removeClass('disabled-scroll');
	}
})();


var formOverlayLoader = new (function() {
  this.elSelector = '.el-form-loader';
	this.$el = $(this.elSelector);

	this.open = function($toEl) {
    var $_overlay = $toEl.find(this.elSelector);
    var toElPosition = $toEl.css('position') || null;

    if ((!toElPosition) || (toElPosition == 'static')) {
      $toEl.css('position', 'relative');
    }

    if (!$_overlay.length) {
      $_overlay = this.$el.clone();

      $toEl.append($_overlay);

      $_overlay = $toEl.find(this.elSelector);
      $_overlay.css('zIndex', getSiblingsMaxIndex($_overlay));
    };

    $_overlay.addClass('open');
	},

	this.close = function() {
		$(this.elSelector).removeClass('open');
	}
})();


// dropdown
// https://github.com/Semantic-Org/Semantic-UI
//-----------------------------------------------------------------------------------
function Dropdown($el, options) {
  this.$el = $el;
  this.options = options || {};
  this.config = $.extend({}, this.defaults, this.options);
};

Dropdown.prototype = {
  defaults: {
    transition: 'fade down'
  },

  init: function() {
    var _this = this;

    this.$el.dropdown( $.extend({}, _this.config, {
      onChange: function(value, text, $choice) {
        var $dropdown = $(this);

        _this.inputValid($dropdown)
      },
      onHide: function() {
        var $dropdown = $(this);
        _this.inputValid($dropdown);
      }
    }) );
  },

  inputValid: function($dropdown) {
    var $input = $dropdown.find('.js-select-val');

    if ($input.length && !$dropdown.hasClass('mod-validate-disabled')) {
      $input.valid();
    }
  }
};

