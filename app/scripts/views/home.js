/*global Dlow, Backbone, JST*/

Dlow.Views = Dlow.Views || {};

(function () {
    'use strict';

    Dlow.Views.Home = Backbone.View.extend({

        template: JST['app/scripts/templates/home.ejs'],
        templateContentNavigation: JST['app/scripts/templates/content_navigation.ejs'],

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
            var html = [];

            html.push(
                '<section id="contents-section">',
                    this.templateContentNavigation({ home: this.model }),
                '</section>'
            );
            
            html.push(
                this.template()
            );

            this.$el.html(
                html.join('')
            );
        }

    });

})();
