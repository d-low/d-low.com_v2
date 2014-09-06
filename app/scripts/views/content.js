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

    initialize: function () {
      this.listenTo(this.model.content, "ready", this.render);

      if (this.model.content.isReady()) {
        this.render();
      }

      // TODO: Initialize event handlers, bind plug-ins, etc.
    },

    render: function () {
      this.model.content.stopListening();

      var html = [];
      var posts = this.model.content.get("posts");

      html.push(
        this.templateContentHeader({ model: this.model.content })
      );

      if (posts && posts.length) {
        posts.each(function(post) {
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
        this.templateContentNavigation({ home: this.model.home })
      );

      this.$el.html(html.join(''));
    }

  });

})();
