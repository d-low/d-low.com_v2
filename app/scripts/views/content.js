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
            // TODO: Do we need to listen to our model's change event?  Will 
            // our model change once initiated?
            this.listenTo(this.model, 'change', this.render);
            this.render();
            // TODO: Initialize event handlers, bind plug-ins, etc.
        },

        render: function () {
            this.$el.html(this.template({content: this.model}));
        }

    });

})();
