/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
  'use strict';

  Dlow.Views.Home = Backbone.View.extend({

    template: JST['app/scripts/templates/home.ejs'],
    templateContentNavigation: JST['app/scripts/templates/content_navigation.ejs'],

    tagName: 'div',

    heights: {
      siteHeader: 0,
      siteHeaderLogo: 0,
      contentSection: 0,
      contentSectionOffsetTop: 0
    },

    resize_timeout: null,
   
    // ------------------------------------------------------------------------
    // Backbone Methods
    // ------------------------------------------------------------------------

    initialize: function () {
      $("body")
        .removeClass("content")
        .removeClass("subtle-background")
        .removeClass("single-post")
        .addClass("home");

      this.render();

      this.$siteHeader = $(".site-header");
      this.$siteHeaderLogo = $(".site-header-logo");
      this.$contentSection = $("#content-section");
    
      this.initializeUI();
      this.initializeEvents();
    },

    /**
     * @description Update sizing, get heights, and set header opacity, and 
     * show images
     * @todo Content images aren't shown!  Fix this tomorrow.
     */
    initializeUI: function() {
      this.setHeights();
      this.getHeights();
      this.updateSiteHeaderLogoOpacity();
      this.showContentNavigationImages();
      this.showBackgroundImages();
    },

    /**
     * @description Initialize custom, non delegate-able, events.
     */
    initializeEvents: function() {
      // We need assets loaded in order to show the background images so call
      // this method once they're all available.
      $(window).one("load", $.proxy(this.showBackgroundImages, this));

      $(window).resize($.proxy(this.window_resize, this));

      if (! Dlow.isMobile()) {
        // Parallax scrolling is only available in desktop (for now?)
        $(window).on("scroll", $.proxy(this.window_scroll, this));
      }
      else {
        $(window).off("scroll");
      }
    },

    render: function () {
      var html = [];

      html.push(
        '<section id="content-section">',
          this.templateContentNavigation({ 
            home: this.model, 
            fixed: false
          }),
        '</section>'
      );
      
      html.push(
        this.template()
      );

      this.$el.html(
        html.join('')
      );
    },

    /**
     * @description Reset height of site header and remove event handlers when
     * we're closed so we don't perform strange behaviors after we've left the
     * home page.
     */
    onClose: function() {
      this.$siteHeader.removeAttr("style");
      this.$siteHeaderLogo
        .removeAttr("style")
        .removeClass("hidden")
        .removeClass("show-background-image");
      this.$contentSection
        .removeClass("show-background-image");

      $("body").removeClass("home");

      $(window).off("scroll");
      $(window).off("resize");
    },


    // ------------------------------------------------------------------------
    // Event Handlers
    // ------------------------------------------------------------------------

    /**
     * @description Upon the last window resize event firing call our 
     * initialize method to set the heights, events, etc, again.  
     */
    window_resize: function() { 
      window.clearTimeout(this.resize_timeout);
      this.resize_timeout = window.setTimeout(
        $.proxy(this.initializeUI, this), 100
      );
    },

    /**
     * @description Handle the onscroll events to liven up the home page.
     */
    window_scroll: function() { 
      if (this.isSiteHeaderVisible()) {
        this.updateSiteHeaderBackground();
        this.updateSiteHeaderLogoOpacity();
      }
      if (this.isContentSectionVisible()) {
        this.scaleInContentNavImages();
      }
    },


    // ------------------------------------------------------------------------
    // Positioning Methods
    // ------------------------------------------------------------------------

    /**
     * @description Get the heights of our primary elements.
     */
    getHeights: function() {
      this.heights.siteHeader = this.$siteHeader.height();
      this.heights.siteHeaderLogo = this.$siteHeaderLogo.height();
      this.heights.contentSection = this.$contentSection.height();
      this.heights.contentSectionOffsetTop = this.$contentSection.offset().top;
    },

    /**
     * @description Set the height of the welcome and content sections to be the 
     * height of the view port so that the background image on the intro 
     * container, and perhaps others, covers the viewport properly.  This method 
     * will be called after the last window resize event.  We use 100vh to set
     * the height of these elements where supported.  We resort to setting the
     * height via JavaScript where the viewport vh unit isn't supported.
     * @see: http://caniuse.com/viewport-units.
     */
    setHeights: function() { 
      // Support for the vh unit is not supported well in iOS, so we just fall
      // back to setting the height manually.  For more information, see:
      // https://github.com/scottjehl/Device-Bugs/issues/36 and 
      // http://blog.rodneyrehm.de/archives/34-iOS7-Mobile-Safari-And-Viewport-Units.html

      if ($("html").hasClass("cssvhunit") && !Dlow.isIOS()) {
        return;
      }

      var height = $(window).height();

      this.$siteHeader.css("height", height + "px");

      if (!Dlow.isMobile()) {
        this.$contentSection.css("height", height + "px");
      }
    },

    /**
     * @description The site header is visible when the window's scroll top is 
     * less than or equal to the height of the site header.
     */
    isSiteHeaderVisible: function() { 
      return $(window).scrollTop() <= this.heights.siteHeader;
    },


    /**
     * @description The contents section is visible when the window's scroll 
     * top is within 300px of the top of it.
     */
    isContentSectionVisible: function() { 
      return $(window).scrollTop() >= this.heights.contentSectionOffsetTop - 300;
    },


    // ------------------------------------------------------------------------
    // Effects Methods
    // ------------------------------------------------------------------------

    /**
     * @description Update the background position of the site header so that 
     * its contents scroll away faster than the background image.  This is a 
     * simple parallax scrolling technique.
     */
    updateSiteHeaderBackground: function() { 
      var scrollTop = $(window).scrollTop();
      var yPos = -(scrollTop / 10);
      var coords = '50% '+ yPos + 'px';

      this.$siteHeader.css({"background-position": coords });
    },

    /**
     * @description Update the opacity of the intro header as we scroll down 
     * the page so that it fades away as the intro container is scrolled out of
     * view.
     */
    updateSiteHeaderLogoOpacity: function() { 
      if (Dlow.isMobile()) {
        this.$siteHeaderLogo
          .css("opacity", 1)
          .removeClass("hidden");
        return;
      }

      var scrollTop = $(window).scrollTop();
      var scrollRange = this.heights.siteHeader - this.heights.siteHeaderLogo;
      var opacity = Number((100 - (scrollTop / scrollRange * 100)) / 100).toFixed(2);

      opacity = opacity < 0.05 ? 0 : opacity;

      this.$siteHeaderLogo.css("opacity", opacity);

      // The header needs to be hidden (dislay: none) when it is no longer 
      // visible, meaning content below it has been scrolled into view, so that 
      // it doesn't sit on top of now visible content preventing the user from 
      // interacting with it.

      if (opacity == 0) {
        this.$siteHeaderLogo.addClass("hidden");
      }
      else {
        this.$siteHeaderLogo.removeClass("hidden");
      }
    },

    /**
     * @desccription The background images for the content navigation section 
     * are not shown initially to slim down the amount of images the mobile 
     * site must load.  So if we're not on a mobile device then swap the 
     * data-nonmobilestyle attribute for a style attribute to show the 
     * background images and load the background iamge so that when we scroll
     * down to them, they're already available.
     */
    showContentNavigationImages: function() { 
      if (Dlow.isMobile()) {
        return;
      }

      var itemImages = $(".js-content-navigation-item-image");

      for (var i = 0; i < itemImages.length; i++) {
        var $itemImage = $(itemImages[i]);
        var style = $itemImage.data("nonmobilestyle");

        $itemImage
          .attr("style", style)
          .removeData("nonmobilestyle");
          
        Dlow.loadBackgroundImage($itemImage);
      }
    },

    /**
     * @description The background images for the site header and contents
     * section are large.  So we fade them in once they've loaded by 
     * transitioning the opacity of generated content inserted after each 
     * element from 1 to 0, thus allowing the background images to appear.
     * @see http://stackoverflow.com/questions/5057990/how-can-i-check-if-a-background-image-is-loaded
     */
    showBackgroundImages: function() { 
      if (Dlow.isMobile()) {
        return;
      }

      Dlow.loadBackgroundImage(this.$siteHeader);
      Dlow.loadBackgroundImage(this.$contentSection);
    },

    /**
     * @description Once we've scrolled down to the contents section then load 
     * each background image one at a time and after loaded scale in the 
     * navigation item. 
     */
    scaleInContentNavImages: function() {
      if (Dlow.isMobile()) {
        return;
      }

      var self = this;
      var navItemImages = $(".js-content-navigation-item-image");
      var currentImage = -1;

      var fScaleIn = function($navItemImage) {
        console.log("fScaleIn()");

        var $navItem = $navItemImage.closest(".js-content-navigation-item");
        $navItem
          .one(
            "transitionend webkitTransitionEnd oTransitionEnd otransitionend", 
            fLoadNextNavItemImage
          )
          .removeClass("scaled-out");
      };

      var fLoadNextNavItemImage = function() { 
        currentImage += 1;

        if (currentImage == navItemImages.length) {
          return;
        }

        console.log("fLoadNextNavItemImage(): currentImage = " + currentImage);
        
        Dlow.loadBackgroundImage($(navItemImages[currentImage]), fScaleIn);        
      };

      fLoadNextNavItemImage();
    }

  }); // end Dlow.Views.Home

})(); // end IIFE
