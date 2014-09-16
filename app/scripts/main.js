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
    console.log('Hello from Backbone!');
    this.router = new Dlow.Routers.Content();
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
