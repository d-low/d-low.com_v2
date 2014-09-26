/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
  'use strict';

  Dlow.Views.Post = Backbone.View.extend({

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

    render: function () {
      var html = [];

      this.model.post.stopListening();

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
    }

  });

})();
