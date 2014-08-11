/*global Dlow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Home = Backbone.Model.extend({

        url: '',

        initialize: function() {
            var contents = new Dlow.Collections.Contents();

            for (var path in Dlow.Content) {
                contents.push(new Dlow.Models.Content({path: path}));
            }

            this.set("contents", contents);
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
