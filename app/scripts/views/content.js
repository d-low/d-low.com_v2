/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
  'use strict';

  Dlow.Views.Content = Backbone.View.extend({

    templateContentHeader: JST['app/scripts/templates/content_header.ejs'],
    template: JST['app/scripts/templates/content.ejs'],
    templatePost: JST['app/scripts/templates/post.ejs'],
    templateContentNavigation: JST['app/scripts/templates/content_navigation.ejs'],

    tagName: 'div',

    id: '',

    className: '',

    events: {},

    initialize: function() {
      $("body")
        .removeClass("home")
        .removeClass("single-post")
        .addClass("content")
        .addClass("subtle-background");
        
      this.listenTo(this.model.content, "ready", this.render);

      if (this.model.content.isReady()) {
        this.render();
      }
    },

    render: function () {
      this.model.content.stopListening();

      var html = [];
      var posts = this.model.content.get("posts");

      html.push(
        this.templateContentHeader({ model: this.model.content })
      );

      if (posts && posts.length) {
        _.each(posts.toArray().reverse(), function(post) {
          html.push(
            this.templatePost({ post: post })
          );
        }, this);
      }
      else {
        html.push(
          this.template({ content: this.model.content })
        );
      }

      html.push(
        this.templateContentNavigation({ 
          home: this.model.home,
          fixed: true
        })
      );

      this.$el.html(html.join(''));

      if (posts && posts.length) {
        this.initializePosts();
      }
      else {
        this.lazyLoadImages();
      }
    },

    /**
     * @description Lazy load the images for the page when the contents are not
     * a list of posts immediately.
     */
    lazyLoadImages: function() {
      var immediateImages = $("img.js-lazy-load-immediate");

      if (Dlow.isMobile()) {
        immediateImages = immediateImages.not(".js-lazy-load-except-mobile");
      }

      immediateImages.lazyload({ 
        effect: "fadeIn",
        event: "lazyload" 
      });

      window.setTimeout(function() { immediateImages.trigger("lazyload"); }, 1000); 
    },


    // --------------------------------------------------------------------------
    // Event Handlers 
    // --------------------------------------------------------------------------

    onClose: function() { 
      $("body")
        .removeClass("subtle-background")
        .removeClass("content");

      // TODO: Remove simple carousel instances

      $(window).off("resize");
      $(".js-post-image-link").off("click");
    }

  }); // end Dlow.Views.Content

  _.extend(Dlow.Views.Content.prototype, Dlow.Views.PostMixin);

})(); // end IIFE
