/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
    'use strict';

    Dlow.Views.Post = Backbone.View.extend({

        template: JST['app/scripts/templates/post.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, "ready", this.render);
            
            if (this.model.isReady()) {
                this.render();
            }
        },

        render: function () {
            this.model.stopListening();
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
