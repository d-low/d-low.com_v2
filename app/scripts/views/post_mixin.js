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
            maxHeight: 125, // TODO: Use larger height when we have larger thumbnails!
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

      var fRenderListItems = function() { 
        var listItems = [];

        $postImages.find(".js-post-image").each(function() { 
          var $img = $(this);

          listItems.push([
            '<li>',
              '<a href="javascript:void(0);">',
                '<img src="' + $img.data("largeimage") + '" title="' + $img.attr("title") + '" />', 
              '</a>',
            '</li>'
          ].join(''));
        });

        return listItems.join('');
      };

      var $postImagesZoomWrapper = $([
        '<div class="post-images-zoom-wrapper" style="height: ' + $("body").height() + 'px;">',
          '<ul class="post-images-zoom js-post-images-zoom not-visible">',
            fRenderListItems(),
          '</ul>',
        '</div'
      ].join(''));

      //
      // Add the large post images element to the DOM and intialize the plug-in.
      //

      $("body").append($postImagesZoomWrapper);

      window.setTimeout(function() { 
        $postImagesZoomWrapper.addClass("fade-in");
      }, 100);

      //
      // Event handler used to remove the simple carousel
      //

      var fSimpleCarouselRemove = function(e) {
        e.preventDefault();

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
      };

      //
      // Apply the simple carousel plug-in to the post images zoom, and once its
      // loaded add the scale out class, then remove the not-visible-class, and 
      // then add the scale in class.
      //

      var $postImagesZoom = $postImagesZoomWrapper.find(".js-post-images-zoom");
      var $simpleCarousel = null;

      var fSimpleCarousel_load = function() {
        $simpleCarousel = $postImagesZoom.closest(".js-simple-carousel");
        
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
        $simpleCarousel.find(".js-simplecarousel-remove").one("click", fSimpleCarouselRemove);
      };

      $postImagesZoom.simplecarousel({
        carouselContentsHeight: Dlow.isMobile() ? "100%" : undefined,
        currentImage: currentImage,
        maxHeight: !Dlow.isMobile() ? 800 : undefined,
        maxItems: 1,
        maxWidth: !Dlow.isMobile() ? 800 : undefined,
        showCaption: true,
        showNavigation: true,
        onload: fSimpleCarousel_load
      });
    }

  }; // end Dlow.Views.PostMixin

})(); // end IIFE
