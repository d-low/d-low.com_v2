/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
  'use strict';

  Dlow.Views.Post = Backbone.View.extend({

    templateMobileBackNavigation: JST['app/scripts/templates/mobile_back_navigation.ejs'],
    template: JST['app/scripts/templates/post.ejs'],
    templateContentNavigation: JST['app/scripts/templates/content_navigation.ejs'],

    tagName: 'div',

    id: '',

    className: '',

    events: {},

    initialize: function () {
      $("body")
        .removeClass("home")
        .addClass("content")
        .addClass("subtle-background")
        .addClass("single-post");

      this.listenTo(this.model.post, "ready", this.render);
      
      if (this.model.post.isReady()) {
        this.render();
      }
    },

    onClose: function() { 
      $("body")
        .removeClass("subtle-background")
        .removeClass("content")
        .removeClass("single-post");
        
      // TODO: Remove simple carousel instances

      $(window).off("resize");
      $(".js-post-image-link").off("click");
    },

    render: function () {
      var html = [];

      this.model.post.stopListening();

      html.push(
        this.templateMobileBackNavigation({ 
          parent: this.model.post.getParent() 
        })
      );

      html.push(
        this.template({post: this.model.post })
      );

      html.push(
        this.templateContentNavigation({ 
          home: this.model.home,
          fixed: true
         })
      );

      this.$el.html(html.join(''));

      this.initializePosts();
    }

  }); // end Dlow.Views.Post

 _.extend(Dlow.Views.Post.prototype, Dlow.Views.PostMixin);


})(); // end IIEF
