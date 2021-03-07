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

