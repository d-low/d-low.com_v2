/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
    'use strict';

    Dlow.Views.Content = Backbone.View.extend({

        template: JST['app/scripts/templates/content.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.render();
            // TODO: Initialize event handlers, bind plug-ins, etc.
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
