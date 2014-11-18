/*global Dlow, $*/


window.Dlow = {
  Models: {},
  DATA_PATH: "/data/",
  Collections: {},
  Views: {},
  Routers: {},
  router: null,

  _isMobile: undefined,
  _isTablet: undefined,
  _isDesktop: undefined,
  _isDesktopLarge: undefined,
  _isIOS: undefined,
  _isAndroid: undefined,

  init: function () {
    'use strict';
    this.router = new Dlow.Routers.Content();

    // Add a close method to the Backbone.View object to be called when switching 
    // between views to allow them to unbind their event handlers. For more 
    // information please see:
    // http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/

    Backbone.View.prototype.close = function() {  
      this.$el.off();

      // Allow for views to provide a custom onClose method.
      if (typeof this.onClose == "function") {
        this.onClose();
      }

      this.$el.empty();
    };

    //
    // Initialize site wide common functionality
    //
 
    if (this.isMobile()) {
      $("body")
        .on("touchstart", ".button", $.proxy(this.el_touchStart, this))
        .on("touchend", ".button", $.proxy(this.el_touchEnd, this))
        .on("touchcancel", ".button", $.proxy(this.el_touchCancel, this));
    }
  },


  // --------------------------------------------------------------------------
  // Common Event Handling Methods
  // --------------------------------------------------------------------------

  /**
   * @description Add the tapped class to the element when the touchstart event 
   * fires so that our CSS can reverse the gradient (if required).
   */
  el_touchStart: function(e) {
    $(e.target).closest(".button").addClass("tapped");
  },

  /**
   * @description Remove the tapped class from the element when the touchend 
   * event fires so that our CSS can change back to the normal gradient.
   */
  el_touchEnd: function(e) {
    $(e.target).closest(".button").removeClass("tapped");
  },

  /**
   * @description Remove the tapped class from the element when the touchcancel
   * event fires so that our CSS can change back to the normal gradient.
   */
  el_touchCancel: function(e) { 
    $(e.target).closest(".button").removeClass("tapped");
  },


  // --------------------------------------------------------------------------
  // Effects 
  // --------------------------------------------------------------------------

  /** 
   * @description Animate scrolling up to the requested position and when done 
   * invoke the callback function if one was specified.  Note that we prefer to
   * use jQuery's animate() method rather than use iScroll b/c we make heavy 
   * use of CSS properties that wouldn't work with iScroll's CSS based animation.
   * @param scrollUpTo The y coordinate that we have been requested to scroll
   * up to.
   * @param fCallback An optional callback function to invoke when done 
   * scrolling.
   */
  scrollUpTo: function(scrollUpTo, fCallback) {
    $('html,body').animate({
      scrollTop: scrollUpTo
    }, 500, fCallback);
  },
  

  // --------------------------------------------------------------------------
  // Utility Methods
  // --------------------------------------------------------------------------

  /**
   * @description Query hidden generated content to check Bootstrap breakpoints
   * in client side script.
   * @see: https://coderwall.com/p/_ldtkg
   * @todo 
   * 1) Add CSS to add generated styles!
   * 2) Do we really need isIOS() and isAndroid()?  Can we use feature detect
   *    instead?
   */
  isMobile: function() { 
    if (typeof(this._isMobile) === "undefined") {
      this._isMobile = window.getComputedStyle(document.body,':after')
        .getPropertyValue('content')
        .indexOf("mobile") != -1;
    }

    return this._isMobile;
  },

  isTablet: function() { 
    if (typeof(this._isTablet) === "undefined") {
      this._isTablet =  window.getComputedStyle(document.body,':after')
        .getPropertyValue('content')
        .indexOf("tablet") != -1;
    }

    return this._isTablet;
  },

  isDesktop: function() { 
    if (typeof(this._isDesktop) == "undefined") {
      this._isDesktop = window.getComputedStyle(document.body,':after')
        .getPropertyValue('content')
        .indexOf("desktop") != -1;
    }

    return this._isDesktop;
  },

  isDesktopLarge: function() { 
    if (typeof(this._isDesktopLarge) == "undefined") {
      this._isDesktopLarge = window.getComputedStyle(document.body,':after')
        .getPropertyValue('content')
        .indexOf("desktop-large") != -1;
    }

    return this._isDesktopLarge;
  },

  isIOS: function() { 
    if (typeof(this._isIOS) == "undefined") {
      this._isIOS = $("body").hasClass("ios");
    }

    return  this._isIOS;
  },

  isAndroid: function() { 
    if (typeof(this._isAndroid) == "undefined") {
      this._isAndroid = $("body").hasClass("android");
    }

    return  this._isAndroid;
  }

};

$(document).ready(function () {
  'use strict';
  Dlow.init();
});
