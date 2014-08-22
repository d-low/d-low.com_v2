/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
    'use strict';

    Dlow.Views.Content = Backbone.View.extend({

        templateContentHeader: JST['app/scripts/templates/content_header.ejs'],
        template: JST['app/scripts/templates/content.ejs'],
        templatePost: JST['app/scripts/templates/post.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, "ready", this.render);

            if (this.model.isReady()) {
                this.render();
            }

            // TODO: Initialize event handlers, bind plug-ins, etc.
        },

        render: function () {
            this.model.stopListening();

            var html = [];
            var posts = this.model.get("posts");

            html.push(
                this.templateContentHeader({ model: this.model })
            );

            if (posts && posts.length) {
                posts.each(function(post) {
                    html.push(
                        this.templatePost({ model: post })
                    );
                }, this);
            }
            else {
                html.push(
                    this.template({ content: this.model })
                );
            }

            this.$el.html(html.join(''));
        }

    });

})();
