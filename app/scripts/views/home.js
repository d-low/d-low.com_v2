/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
    'use strict';

    Dlow.Views.Home = Backbone.View.extend({

        template: JST['app/scripts/templates/home.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.render();
            // NOTE: The model won't trigger a change event, it will have been
            // already initialized by the time we're passed it.
            // this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template({home: this.model}));
        }

    });

})();
