/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
  'use strict';

  Dlow.Views.PostMixin = {

    /**
     * @description Initialize plug-ins used when the content page displays a 
     * list of posts.
     */
    initializePosts: function() { 

      //
      // First, lazy load the images that are 200px below the fold and one the
      // first one is loaded intialize the simple carousel plug-in if not 
      // already initialized.
      //

      var fSimpleCarousel = function($postImages) {
        if (! $postImages.data("simplecarousel")) {
          $postImages.simplecarousel({
            handleResize: false,
            height: 125, // TODO: Use larger height when we have larger thumbnails!
            minItems: 2,
            showNavigation: true
          });
        }
      };

      $(".js-post-images").each(function() {
        var $postImages = $(this);

        $postImages.find("img.js-lazy-load").lazyload({
          load: function() { 
            $postImages.removeClass("uninitialized");
            fSimpleCarousel($postImages); 
          },
          threshold: 400
        });
      });

      //
      // And then initialize the content toggle plug-in to expand/collapse text.
      //

      $(".js-post-content-togglable").contenttoggle({
        collapsedHeight: Dlow.isMobile() ? 150 : 300,
        collapseText: "Show Less",
        expandText: "Read More",
        handleResize: false,
        pretoggled_callback: $.proxy(this.content_pretoggled, this)
      });

      //
      // Event handlers
      //
      
      $(window).on("resize", $.proxy(this.window_resize, this));
      $(".js-post-image-link").on("click", $.proxy(this.postImageLink_click, this));
    },

    /**
     * @description Callback method passed to content toggle used to scroll up to
     * the parent element after hiding the text.
     * @param $el The element that the contenttoggle plug-in is applied to.
     * @param toggleState The state of the toggled element: "more" or "less".
     * @param callback The callback from the content toggle that will be invoked 
     * once the change in toggle state is handled.
     */
    content_pretoggled: function($el, toggleState, callback) {
      if (toggleState === "less") {
        var $post = $el.closest(".js-post");
        Dlow.scrollUpTo(
          $post.offset().top - (parseInt($post.css("margin-bottom"), 10) * 2),
          callback
        );
      }
      else {
        callback();
      }
    },


    // --------------------------------------------------------------------------
    // Event Handlers 
    // --------------------------------------------------------------------------

    /**
     * @description Debounced resize method used to call our resize handler on
     * final resize event.
     */
    window_resize: function() {
      window.clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout($.proxy(this.resize, this), 150);
    },

    /**
     * @description Inform our simple carousel and content toggle plug-ins to
     * resize themselves.  We do this once, here, rather than haivng the plug-ins
     * do it themselves, becase there will be cascading resize events as one
     * plug-in resizes itself thus triggering a resize event that others will 
     * need to handle.
     */
    resize: function() { 
      $(".js-post-content-togglable").contenttoggle("resize");

      $(".js-post-images").each(function() { 
        var $postImages = $(this);

        if ($postImages.data("simplecarousel")) {
          $postImages.simplecarousel("resize");
        }
      });
    },

    /**
     * @description When a post image is clicked on clone the list and scale it
     * in to view ensuring the post image that was clicked on is displayed.
     * TODO: Refactor:
     * 1) Move rendering to a template.
     * 2) Move event handlers to their own methods instead of closures.
     */
    postImageLink_click: function(e) {
      e.preventDefault();

      //
      // Elements
      //

      var $postImage = $(e.target).closest(".js-post-image-link");
      var $postImages = $postImage.closest(".js-post-images");
      var currentImage = $postImage.data("itemnum");

      //
      // Generate HTML using template
      //

      var images = [];

      $postImages.find(".js-post-image").each(function() { 
        var $img = $(this);

        images.push({
          src: $img.data("largeimage"),
          title: $img.attr("title")
        })
      });

      var $postImagesZoomWrapper = $(JST['app/scripts/templates/post_images_zoom_wrapper.ejs']({
        height: $("body").height(),
        images: images
      }));

      //
      // Add the large post images element to the DOM and intialize the plug-in.
      //

      $("body").append($postImagesZoomWrapper);

      window.setTimeout(function() { 
        $postImagesZoomWrapper.addClass("fade-in");
      }, 100);

      //
      // Apply the simple carousel plug-in to the post images zoom, and once its
      // loaded add the scale out class, then remove the not-visible-class, and 
      // then add the scale in class.
      //

      var $postImagesZoom = $postImagesZoomWrapper.find(".js-post-images-zoom");

      $postImagesZoom.simplecarousel({
        carouselContentsHeight: Dlow.isMobile() ? "100%" : undefined,
        currentImage: currentImage,
        maxHeight: !Dlow.isMobile() ? 800 : undefined,
        maxItems: 1,
        maxWidth: !Dlow.isMobile() ? 800 : undefined,
        showCaption: true,
        showNavigation: true,
        onload: $.proxy(this.simpleCarousel_load, this)
      });
    },

    /**
     * @description When the simple carousel has loaded add a remove element, 
     * scale in the simple carousel, and bind an onclick handler for the remove
     * element.
     */
    simpleCarousel_load: function() { 
      var $postImagesZoom = $(".js-post-images-zoom");
      var $simpleCarousel = $postImagesZoom.closest(".js-simple-carousel");
        
      $simpleCarousel.append(
        '<a class="simple-carousel-nav-text simplecarousel-remove ' + 
          'js-simplecarousel-remove button" href="javascript:void(0);">x</a>'
      );

      $simpleCarousel.one(
        "transitionend webkitTransitionEnd oTransitionEnd otransitionend", 
        function() { 
          $postImagesZoom.removeClass("not-visible");
          $simpleCarousel.addClass("scale-in");
        }
      );

      $simpleCarousel.addClass("scale-out");

      $simpleCarousel.find(".js-simplecarousel-remove").one(
        "click", $.proxy(this.simpleCarousel_remove, this)
      );
    },

    /**
     * @description To remove the simple carousel slide it up and then when 
     * done destroy the plug in, remove the list of images, fade out the back-
     * ground shim, and then remove it too.
     */
    simpleCarousel_remove: function(e) { 
      e.preventDefault();

      var $postImagesZoomWrapper = $(".js-post-images-zoom-wrapper");
      var $simpleCarousel = $postImagesZoomWrapper.find(".js-simple-carousel");

      $simpleCarousel.one(
        "transitionend webkitTransitionEnd oTransitionEnd otransitionend", 
        function() {
          var $ul = $simpleCarousel.find("ul");
          $ul.simplecarousel("destroy");
          $ul.remove();

          $postImagesZoomWrapper.one(
            "transitionend webkitTransitionEnd oTransitionEnd otransitionend", 
            function() {
              window.setTimeout(function() { $postImagesZoomWrapper.remove(); }, 100);
            }
          );

          $postImagesZoomWrapper.removeClass("fade-in");
        }
      );

      $simpleCarousel.addClass("slide-up");
    }

  }; // end Dlow.Views.PostMixin

})(); // end IIFE
